import Vue from "vue";
import axios from "axios";
import router from "../../router";

export default {
    // !  Create_this_Document
    async Create_this_Document({ dispatch }, doc) {
        const ready_doc = await dispatch("ready_document_for_send", doc);

        const newID = await axios
            .post("/documents", ready_doc)
            .then((res) => res.data)
            .catch((error) => {
                dispatch("handleAxiosError", error, { root: true });
                return false;
            });
        return newID;
    },
    // !  Update_this_Document
    async Update_this_Document({ dispatch }, doc) {
        const ready_doc = await dispatch("ready_document_for_send", doc);

        const newID = await axios
            .put(`/documents/${doc._id}`, ready_doc)
            .then((res) => res.data)
            .catch((error) => {
                dispatch("handleAxiosError", error, { root: true });
                return false;
            });
        return newID;
    },
    // !  Delete_this_Document
    async Delete_this_Document({ state, commit, dispatch, rootState }, _id) {
        const areYouSure = confirm("بابت حدف این داکیومنت مطمئنید ؟");
        if (!areYouSure) return;

        if (typeof _id === "number") {
            const doc = state.newDocs.filter((el) => el._id === _id)[0];

            if (doc.childs_id.length) {
                const remove_childs = confirm("این داکیومنت دارای داکیومنت زیرمجموعه میباشد، حذف شود؟");
                if (remove_childs) commit("REMOVE_THIS_DOC", _id);
            } else commit("REMOVE_THIS_DOC", _id);

            // * redirect if need
            //  TODO can you use state.route 👇
            const route = rootState.route.name;
            const root_id = state.newDocs[0]._id;
            const path = `/${route === "create doc" ? "create" : "update"}/${root_id}`;
            router.push(path);
            return;
        }
        const remove_childs = confirm("در صورتی که این داکیومنت دارای زیرمجموعه باشد آنها هم حذف میشوند");
        if (!remove_childs) return;

        const newID = await axios
            .delete(`/documents/${_id}`)
            .then((res) => {
                commit("REMOVE_THIS_DOC", _id);
                return res; // remember this set value for newID
            })
            .catch((error) => {
                dispatch("handleAxiosError", error, { root: true });
                return false;
            });
        return newID;
    },
    // !  Create_or_Update_Documents
    async Create_or_Update_Documents({ state, dispatch, commit, rootState }) {
        const Docs = state.newDocs;
        let verb;
        // * validate docs
        for (let index = 0; index < Docs.length; index++) {
            const is_this_Doc_valid = await dispatch("is_this_Doc_valid", Docs[index]);
            if (!is_this_Doc_valid) return false;
        }
        // * create or update documents
        for (let index = 0; index < Docs.length; index++) {
            const doc = Docs[index];
            if (typeof doc._id === "number") {
                const created_doc = await dispatch("Create_this_Document", doc);
                if (!created_doc) return false;

                // *  add new _id s
                await commit("SET_NEW_ID", {
                    doc,
                    _id: created_doc._id,
                });

                verb = "ساخته شد";
            } else {
                const updated_doc = await dispatch("Update_this_Document", doc);
                if (!updated_doc) return false;

                verb = "بروزرسانی شد";
            }
        }
        const relationships_list = await dispatch("get_relationship_list");
        const create_relationships = await dispatch("create_relationships", relationships_list);
        if (!create_relationships) return;

        await commit("CLEAR_NEW_DOC");
        await router.push(`/profile/${rootState.auth.user.username}`);
        Vue.toasted.success(`داکیومنت با موفقیت ${verb} ...`);
    },
    // !  getAllDocs
    async getAllDocs({ commit, dispatch, rootState }, taxonomies = {}) {
        if (!rootState.auth.user.username) return; // if authenticated continue

        const options = {
            params: {
                root: true,
                vitrine: true,
                situation: "publish",
                "$sort[createdAt]": -1,
            },
        };

        // * select docs with taxonomies
        if (taxonomies.tag) options.params.tags = taxonomies.tag;
        if (taxonomies.category) options.params.categories = taxonomies.category;

        const docs = await axios
            .get("/documents", options)
            .then((res) => res.data)
            .catch((error) => {
                dispatch("handleAxiosError", error, { root: true });
                return false;
            });
        if (!docs) return;

        const decoded_docs = await dispatch("decode_the_docs", { docs });
        docs.data = decoded_docs;

        await commit("SET_DOCS_TO", { decoded_docs: docs, list: "vitrineDocs", merge: false });
    },
    // !  get_this_docs
    async get_this_docs({ dispatch }, doc_ids) {
        const is_doc_ids_array = Array.isArray(doc_ids),
            url = `/documents/${is_doc_ids_array ? "" : doc_ids}`,
            obj = { params: { "_id[$in]": doc_ids } },
            options = is_doc_ids_array ? obj : {};

        const docs = await axios
            .get(url, options)
            .then((res) => res.data)
            .catch((error) => {
                dispatch("handleAxiosError", error, { root: true });
                return false;
            });
        return docs;
    },
    // !  get_this_doc_for_update
    async get_this_doc_for_update({ state, commit, dispatch }, doc_id) {
        let doc, already_Decoded, decode_doc;
        const profileDocs = state.profilePage.docs.data,
            user = state.user;

        if (profileDocs && profileDocs.length) {
            // * load from profile page
            doc = await profileDocs.filter((doc) => doc._id === doc_id)[0];
            if (doc) already_Decoded = true;
        }
        if (!doc) doc = await dispatch("get_this_docs", doc_id);

        if (!doc) {
            router.push(`/profile/${user.username}`);
            return;
        }

        if (user.role >= 48 || doc.user._id === user._id) {
            if (!already_Decoded) decode_doc = await dispatch("decode_the_docs", { docs: [doc] });

            await commit("SET_DOCS_TO", { decoded_docs: decode_doc || [doc], list: "newDocs", merge: false });
            await dispatch("get_all_childs", decode_doc || doc);
        } else {
            Vue.toasted.error("شما دسترسی لازم جهت ادیت این داکیومنت را ندارید");
            dispatch("auth/logout", `/profile/${user.username}`, { root: true });
        }
    },
    // ! get_all_childs
    async get_all_childs({ dispatch, commit }, doc) {
        const father = Array.isArray(doc) ? doc[0] : doc;
        if (!father.childs_id.length) return;

        const childs_ids = [...father.childs_id];
        let childs = [];

        for (let index = 0; index < childs_ids.length; index++) {
            const child_id = childs_ids[index];
            const child = await dispatch("get_this_docs", child_id);
            childs.push(child);
            child.childs_id.forEach((c_id) => childs_ids.push(c_id));
        }

        const decoded_childs = await dispatch("decode_the_docs", { docs: childs });

        await commit("SET_DOCS_TO", { decoded_docs: decoded_childs, list: "newDocs", merge: true });
    },
    // !  read_this_doc
    async read_this_doc({ state, commit, dispatch }, id) {
        // TODO can you use state.route ? 👇
        const _id = id || router.currentRoute.params._id;
        let doc, already_Decoded, decoded_docs;

        // * set doc if already exist in state
        if (state.vitrineDocs.data.length) {
            doc = await state.vitrineDocs.data.filter((doc) => doc._id === _id)[0];
            if (doc) already_Decoded = true;
        }
        if (!doc && state.readDoc.length) {
            doc = await state.readDoc.filter((doc) => doc._id === _id)[0];
            if (doc) already_Decoded = true;
        }
        // * not exist , get doc from server
        if (!doc) doc = await dispatch("get_this_docs", _id);
        if (!doc) return;

        if (!already_Decoded) decoded_docs = await dispatch("decode_the_docs", { docs: [doc] });

        await commit("SET_DOCS_TO", { decoded_docs: decoded_docs || [doc], list: "readDoc", merge: true });

        dispatch("flyToThisDoc", decoded_docs ? decoded_docs[0] : doc);

        await dispatch("change_map_layers", null, { root: true });

        // * get childs , if have any
        if (!doc.childs_id.length) return;
        const childs = await dispatch("get_this_docs", doc.childs_id);
        if (!childs) return;

        const decoded_childs = await dispatch("decode_the_docs", { docs: childs, deleteRoot: true });

        await commit("SET_DOCS_TO", { decoded_docs: decoded_childs, list: "readDoc", merge: true });
    },
    // !  create_relationships
    async create_relationships({ dispatch }, list) {
        if (!list.length) return true;

        const result = await axios
            .post("/create/documents/relationship", list)
            .then((res) => res.data)
            .catch((error) => {
                dispatch("handleAxiosError", error, { root: true });
                Vue.toasted.success("ساخت رابطه ی داکیومنت ها با مشکل مواجه شد ...");
                return false;
            });
        return result;
    },
    // !  get_User_Cat_and_Tags
    async get_User_Taxonomies({ dispatch, rootState }) {
        const options = {
            params: {
                root: true,
                "user._id": rootState.auth.user._id,
                $select: ["tags", "categories"],
            },
        };
        const taxonomies = await axios
            .get("/documents", options)
            .then((res) => res.data.data)
            .catch((error) => {
                dispatch("handleAxiosError", error);
                return false;
            });
        return taxonomies;
    },
    // !  searchData
    async searchData(store) {
        const route = router.currentRoute;
        const url = "/searchInDocs";
        const options = {
            params: {},
        };
        if (route.query.area) options.params.area = route.query.area;
        if (route.query.text) options.params.text = route.query.text;
        await axios
            .get(url, options)
            .then((response) => console.log("response.data => ", response.data))
            .catch((error) => {
                if (error == "Error: Request failed with status code 415") {
                    Vue.toasted.error("محدوده ای که مشخص کرده اید معتبر نمیباشد ...");
                    return;
                }
                store.dispatch("handleAxiosError", error);
            });
    },
};
