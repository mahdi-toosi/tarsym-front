import Vue from "vue";
import router from "../../router";
import mu_tools from "./mu-tools";
import ac_docs from "./ac-docs";

const docLayer = (state) => state.newDocs[state.DocProp.index];

const isEditMode = () => {
    const routeName = router.currentRoute.name;
    return ["update doc", "create doc"].includes(routeName);
};

export default {
    namespaced: true,
    actions: { ...ac_docs },
    state: {
        newDocs: [],
        DocProp: {
            index: 0,
            _id: 0,
            invisibleDocs: [],
            OnTool: {
                condition: false,
                index: -1,
            },
        },
        vitrineDocs: { data: [] },
        readDoc: [],
        profilePage: {
            user: {},
            docs: {},
        },
    },
    mutations: {
        ...mu_tools,
        UPDATE_ZOOM(state, zoom) {
            if (!isEditMode) return;
            docLayer(state).map_animate.zoom = zoom;
        },
        UPDATE_CENTER(state, center) {
            if (!isEditMode) return;
            docLayer(state).map_animate.coordinates = center;
        },
        UPDATE_LAYER(state, layerIndex) {
            if (!isEditMode) return;
            docLayer(state).map_animate.layerIndex = layerIndex;
        },
        ADD_TAXONOMY(state, { $event, cats }) {
            if ($event.length && $event[$event.length - 1].length < 3) {
                Vue.toasted.error(`${cats ? "دسته بندی" : "تگ"} باید حداقل 4 حرف داشته باشد`);
                return;
            }
            const doc = docLayer(state);
            if (cats) doc.categories = $event;
            else doc.tags = $event;
        },
        SET_ZOOM_LEVEL(state, val) {
            state.newDocs[0].zoomLevel = val;
        },
        SET_NEW_DOCUMENT(state, { fake_id, root, date_props }) {
            const newDocObj = {
                _id: fake_id,
                title: "",
                description: "",
                tools: [],
                date_props: date_props || {
                    century: null,
                    year: null,
                    month: "00",
                    day: "00",
                },
                childs_id: [],
                map_animate: {
                    zoom: state.map.zoom,
                    layerIndex: state.map.layerIndex,
                    coordinates: state.map.center,
                },
            };
            if (root) {
                newDocObj.tags = [];
                newDocObj.categories = [];
                newDocObj.root = true;
                newDocObj.zoomLevel = 4;
                newDocObj.situation = "publish";
                newDocObj.read = false;
                newDocObj.star = false;
                newDocObj.vitrine = false;
            }
            state.newDocs.push(newDocObj);
        },
        CLEAR_NEW_DOC(state) {
            state.newDocs = [];
            state.DocProp = {
                index: 0,
                _id: 0,
                invisibleDocs: [],
                OnTool: {
                    condition: false,
                    index: -1,
                },
            };
        },
        ADD_DATE(state, { century, year, month, day }) {
            const doc_dateProps = docLayer(state).date_props;
            if (century) doc_dateProps.century = century;
            if (month) doc_dateProps.month = month;
            if (year) doc_dateProps.year = year;
            if (day) doc_dateProps.day = day;
        },
        CLEAR_DATE(state) {
            docLayer(state).date_props = {
                century: null,
                year: null,
                month: "00",
                day: "00",
            };
        },
        CHANGE_VISIBILITY_doc(state, _id) {
            const invisibleDocs = state.DocProp.invisibleDocs;
            console.log({ invisibleDocs }, { _id });
            const isInvisible = invisibleDocs.indexOf(_id);
            if (isInvisible !== -1) invisibleDocs.splice(isInvisible, 1);
            else invisibleDocs.push(_id);
        },
        SET_NEW_ID(state, { doc, _id }) {
            const fakeID = doc._id;
            state.newDocs.forEach((doc) => {
                const index = doc.childs_id.findIndex((child_id) => child_id == fakeID);
                if (index < 0) return;
                doc.childs_id[index] = _id;
            });
            doc._id = _id;
            if (state.DocProp._id == fakeID) state.DocProp._id = _id;
        },
        UPDATE_DOC_INDEX(state) {
            // TODO => can you use state.route ? 👇👇
            const doc_id = router.currentRoute.params._id;
            const routeName = router.currentRoute.name;
            const Docs = routeName === "read doc" ? state.readDoc : state.newDocs;
            const index = Docs.findIndex((obj) => obj._id == doc_id); // * should be == (for make number to string)

            state.DocProp.index = index;
            state.DocProp._id = Docs[index]._id;
        },
        SET_DOCS_TO(state, { decoded_docs, list, merge }) {
            if (!merge) {
                state[list] = decoded_docs;
                return;
            }

            if (state[list].data) {
                state[list].data = state[list].data.concat(decoded_docs);
                return;
            } else state[list] = state[list].concat(decoded_docs);
        },
        SET_DOCS_TO_Profile_Page(state, docs) {
            state.profilePage.docs = docs;
        },
        CLEAR_READ_DOC(state) {
            state.readDoc = [];
            state.DocProp = {
                index: 0,
                _id: 0,
                OnTool: {
                    condition: false,
                    index: -1,
                },
            };
        },
        REMOVE_THIS_DOC(state, _id) {
            let doc_index;
            const equal_id = (id) => (doc) => doc._id === id;
            // ? remove from profile page
            const profilePageDocs = state.profilePage.docs.data;
            if (profilePageDocs && profilePageDocs.length) {
                doc_index = profilePageDocs.findIndex(equal_id(_id));
                if (doc_index !== -1) profilePageDocs.splice(doc_index, 1);
            }
            // ? remove from edit page
            let Docs = state.newDocs;
            if (!Docs.length) return;

            doc_index = Docs.findIndex(equal_id(_id));
            if (doc_index === -1) return;

            const doc = Docs[doc_index];

            function remove_id_from_childs() {
                for (let i = 0; i < Docs.length; i++) {
                    const doc = Docs[i];
                    const child_index = doc.childs_id.findIndex((child_id) => child_id === _id);
                    if (child_index === -1) continue;
                    doc.childs_id.splice(child_index, 1);
                    break;
                }
            }

            // * if dosent have child , just delete document and done
            if (!doc.childs_id.length) {
                Docs.splice(doc_index, 1);
                remove_id_from_childs();
                return;
            }
            // * delete all of related
            const childs_IDs = [doc._id];
            for (let index = 0; index < childs_IDs.length; index++) {
                doc_index = Docs.findIndex(equal_id(childs_IDs[index]));
                if (doc_index === -1) continue;
                Docs[doc_index].childs_id.forEach((child_id) => childs_IDs.push(child_id));
            }
            // * delete all of sons and grandsons in newDocs
            childs_IDs.forEach((id) => {
                const doc_index = Docs.findIndex(equal_id(id));
                if (doc_index !== -1) Docs.splice(doc_index, 1);
            });
            remove_id_from_childs();
        },
        SET_User_to_Profile(state, user) {
            state.docs.profilePage.user = user;
        },
    },
};