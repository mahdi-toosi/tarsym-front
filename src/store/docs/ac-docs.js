import Vue from "vue";
import router from "../../router";

import tools from "./ac-tools";
import requests from "./requests";
import profilePage from "./ac-profilePage";

const docLayer = (state) => state.newDocs[state.DocProp.index];

export default {
    ...tools,
    ...requests,
    ...profilePage,
    // ! flyToThisDoc
    flyToThisDoc({ state }, doc) {
        document.dispatchEvent(
            new CustomEvent("showThisDoc", {
                detail: doc || docLayer(state),
            })
        );
    },
    // ! get_childs
    async get_childs({ state, dispatch, commit }) {
        const doc = docLayer(state);
        if (!doc || !doc.childs_id.length) return;
        let valid_childs_id = [];
        doc.childs_id.forEach((child_id) => {
            if (typeof child_id === "number") return;
            const already_exist = state.newDocs.findIndex((doc) => doc._id === child_id);
            if (already_exist > -1) return;
            valid_childs_id.push(child_id);
        });
        if (!valid_childs_id.length) return;

        const childs = await dispatch("get_this_docs", valid_childs_id);
        const decoded_childs = await dispatch("decode_the_docs", {
            docs: childs,
        });
        await commit("SET_DOCS_TO", {
            decoded_docs: decoded_childs,
            list: "newDocs",
            merge: true,
        });
    },
    // ! addNewDoc
    async addNewDoc({ commit, state, dispatch, rootState }, root = true) {
        commit("OFF_THE_ON_TOOL");
        commit("UPDATE_ON_TOOL");

        const fake_id = new Date().getTime();
        const payload = { fake_id, root, map: rootState.map };
        if (!root) {
            const father_doc = docLayer(state);
            father_doc.childs_id.push(fake_id);
            payload.date_props = father_doc.date_props;
        }
        commit("SET_NEW_DOCUMENT", payload);

        const path = `/${rootState.route.name == "update doc" ? "update" : "create"}/${fake_id}`;
        await router.push(path);

        if (root) await dispatch("setTool", "Point");
    },
    // ! addExistingDoc
    async addExistingDoc({ commit, state, dispatch }, _id) {
        commit("OFF_THE_ON_TOOL");
        commit("UPDATE_ON_TOOL");

        const existingDoc = await dispatch("get_this_docs", _id);
        if (!existingDoc) return false;
        docLayer(state).childs_id.push(_id);

        const decode_existingDoc = await dispatch("decode_the_docs", {
            docs: [existingDoc],
        });
        commit("SET_DOCS_TO", {
            decoded_docs: decode_existingDoc,
            list: "newDocs",
            merge: true,
        });
        const path = `/${state.route.name == "update doc" ? "update" : "create"}/${_id}`;
        await router.push(path);
    },
    // ! goBackToParent
    async goBackToParent({ state, commit }) {
        commit("OFF_THE_ON_TOOL");
        commit("UPDATE_ON_TOOL");

        const doc_id = state.DocProp._id;
        const father = await state.newDocs.filter((el) => el.childs_id.includes(doc_id))[0];
        const path = `/${state.route.name == "create doc" ? "create" : "update"}/${father._id}`;
        await router.push(path);
    },
    // ! goToChild
    async goToChild({ commit }, _id) {
        commit("OFF_THE_ON_TOOL");
        commit("UPDATE_ON_TOOL");

        const routeName = router.currentRoute.name;
        const path = `/${routeName == "create doc" ? "create" : "update"}/${_id}`;
        await router.push(path);
        return;
    },
    // ! decode_the_docs
    decode_the_docs(store, { docs, deleteRoot }) {
        const Docs = docs.data || docs;
        const newData = [];
        Docs.forEach((doc) => {
            const junk = JSON.parse(doc.junk);
            delete doc.junk;
            const decoded_Doc = {
                ...doc,
                ...junk,
            };
            decoded_Doc.date = decoded_Doc.date - 2000000;
            if (deleteRoot && decoded_Doc.root) delete decoded_Doc.root;
            newData.push(decoded_Doc);
        });
        return newData;
    },
    // !  get_relationship_list
    get_relationship_list({ state }) {
        const Docs = state.newDocs;
        let list = [];

        Docs.forEach((doc) => {
            if (!doc.childs_id.length) return;
            list.push({
                new_id: doc._id,
                childs: doc.childs_id,
            });
        });
        return list;
    },
    // !  is_this_Doc_valid
    is_this_Doc_valid({ commit }, docLayer) {
        commit("OFF_THE_ON_TOOL");
        commit("UPDATE_ON_TOOL");

        let errors = [];
        // validate conditions
        const title = docLayer.title.length > 5,
            description = docLayer.description.length > 20,
            tools = docLayer.tools.length,
            date = docLayer.date_props.year && docLayer.date_props.month && docLayer.date_props.day,
            currentRoute = router.currentRoute;

        if (!title) errors.push("عنوان کافی نیست");
        if (!description) errors.push("توضیحات کافی نیست");
        if (!date) errors.push("تاریخ انتخاب کنید");
        if (!tools) errors.push("حداقل از یک ابزار استفاده کنید");
        if (docLayer.root) {
            //  IMC == Index Marker Coordinates
            const IMC = docLayer.tools[0].coordinates;
            const isIndexMarketDefault = IMC[0] == "0" && IMC[1] == "0";
            if (isIndexMarketDefault) errors.push("برای آیکون شاخص مختصات مشخص کنید");

            const tags = docLayer.tags.length;
            if (!tags) errors.push("حداقل یک تگ انتخاب کنید");

            const categories = docLayer.categories.length;
            if (!categories) errors.push(" یک دسته بندی انتخاب کنید");
        }

        if (!errors.length) return true;
        else {
            const action = [
                {
                    text: "داکیومنت",
                    onClick: async (e, toastObject) => {
                        const routeName = currentRoute.name;
                        const path = `/${routeName == "create doc" ? "create" : "update"}/${docLayer._id}`;
                        await router.push(path);
                        toastObject.goAway(0);
                    },
                },
            ];
            errors.forEach((msg) => {
                Vue.toasted.error(msg, {
                    action: currentRoute.params._id == docLayer._id ? [] : action,
                });
            });
            return false;
        }
    },
    // !  ready_document_for_send
    ready_document_for_send(store, docLayer) {
        let doc = {
            ...docLayer,
            junk: {},
        };

        if (typeof doc._id == "number") delete doc._id;

        doc.title = doc.title.trim();

        // * create excerpt
        let excerpt = doc.description.replace(/<[^>]+>/g, "");
        excerpt = excerpt
            .split(/\s+/)
            .slice(0, 50)
            .join(" "); //* 50 words
        let fakeElement = document.createElement("textarea");
        fakeElement.innerHTML = excerpt;
        excerpt = fakeElement.value;
        doc.excerpt = excerpt;

        if (doc.root) {
            // * count imgs in description
            const imgs = doc.description.match(/<img/gm);
            doc.imgsCount = (imgs || []).length;
        }

        // * remove unnecessary items form tools
        doc.tools.forEach((tool) => {
            if (tool._id) delete tool._id;
            if (tool.color.hex8) tool.color = tool.color.hex8;
            if (tool.secondaryColor.hex8) tool.secondaryColor = tool.secondaryColor.hex8;
        });

        // * make valid date for database
        const year = doc.date_props.year,
            month = doc.date_props.month,
            day = doc.date_props.day;
        doc.date = year + month + day;
        doc.date = Number(doc.date) + 2 * 1000 * 1000;

        // *  make junk field
        const make_junk_with_this_items = [
            "tools",
            "imgsCount",
            "date_props",
            "description",
            "layerIndex",
            "map_animate",
            "zoomLevel",
        ];
        make_junk_with_this_items.forEach((element) => {
            if (element in doc) {
                doc.junk[element] = doc[element];
                delete doc[element];
            }
        });
        delete doc.childs_id;

        // const videos = doc.description.match(/<iframe/gm);
        // console.log('videos', (videos || []).length);

        doc.junk = JSON.stringify(doc.junk);
        return doc;
    },
};
