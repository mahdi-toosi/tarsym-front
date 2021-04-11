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
    async Delete_this_Document({ state, commit, dispatch }, { doc, root }) {
        const areYouSure = confirm("بابت حدف این داکیومنت مطمئنید ؟");
        if (!areYouSure) return;
        if (doc.childs_id.length) {
            const remove_children = confirm(
                "این داکیومنت دارای داکیومنت زیرمجموعه میباشد، بابت حدف این داکیومنت مطمئنید ؟"
            );
            if (!remove_children) return;
        }

        if (typeof doc._id === "number") {
            commit("REMOVE_THIS_DOC", doc._id);
            // * redirect if need
            const root_id = state.newDocs[0]._id;
            const path = `/${router.currentRoute.name === "create doc" ? "create" : "update"}/${root_id}`;
            router.push(path);
            return;
        }
        // should be before REMOVE_THIS_DOC mutation
        const father_index = state.newDocs.findIndex((d) => d.childs_id.includes(doc._id));

        const success = await axios
            .delete(`/documents/${doc._id}`)
            .then(() => {
                commit("REMOVE_THIS_DOC", doc._id);
                return true;
            })
            .catch((error) => {
                if (error.response.data.message === "documents has 2 fathers") {
                    commit("REMOVE_THIS_DOC", doc._id);
                    return true;
                }
                dispatch("handleAxiosError", error, { root: true });
                return false;
            });

        if (success && !root) {
            const father = state.newDocs[father_index];
            await axios
                .patch(`/documents/${father._id}`, { childs_id: father.childs_id })
                .then()
                .catch((error) => {
                    dispatch("handleAxiosError", error, { root: true });
                });
        }
    },
    // ! removeThisImgs
    async removeThisImgs({ dispatch }, images) {
        return await axios
            .post("/documents/remove/imgs", { images })
            .then(() => true)
            .catch((error) => {
                dispatch("handleAxiosError", error, { root: true });
                return false;
            });
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

        await dispatch("delete_deletedImgs");

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
        await router.push(`/profile/${rootState.user.username}`);
        Vue.toasted.success(`داکیومنت با موفقیت ${verb} ...`, {
            icon: "fa-check-circle",
        });
    },
    // !  getAllDocs
    async getAllDocs({ state, commit, dispatch }, { tag, category, nextPage }) {
        const params = {
            root: true,
            vitrine: true,
            $limit: 10,
            situation: "publish",
            "$sort[createdAt]": -1,
        };
        if (nextPage) params.$skip = state.vitrineDocs.data.length;

        // * select docs with taxonomies
        if (tag) params.tags = tag;
        if (category) params.categories = category;

        const docs = await axios
            .get("/documents", { params })
            .then((res) => res.data)
            .catch((error) => {
                dispatch("handleAxiosError", error, { root: true });
                return false;
            });
        if (!docs) return;

        docs.data = await dispatch("decode_the_docs", { docs: docs.data });

        await commit("SET_DOCS_TO", { decoded_docs: docs.data, list: "vitrineDocs", merge: nextPage });
        commit("SET_TOTAL", { list: "vitrineDocs", total: docs.total });
    },
    // !  get_this_docs
    async get_this_docs({ state, dispatch }, doc_ids) {
        const copy_ids = [...doc_ids];
        let docs = [],
            local_databases = ["vitrineDocs", "readDoc"],
            already_fetchedDocs_ids = [];

        // * set doc if already exist in state
        copy_ids.forEach((_id) => {
            for (let i = 0; i < local_databases.length; i++) {
                const database = Array.isArray(state[local_databases[i]])
                    ? state[local_databases[i]]
                    : state[local_databases[i]].data;
                const doc = database.find((doc) => doc._id === _id);
                if (doc) {
                    doc.already_fetched = true;
                    already_fetchedDocs_ids.push(doc._id);
                    docs.push(doc);
                    return;
                }
            }
        });

        already_fetchedDocs_ids.forEach((id) => {
            let index = copy_ids.indexOf(id);
            if (index > -1) copy_ids.splice(index, 1);
        });
        if (copy_ids.length === 0) {
            document.dispatchEvent(new CustomEvent("dataReceivedStopLoader"));
            return docs;
        }

        await axios
            .get("/documents/", { params: { "_id[$in]": copy_ids } })
            .then(({ data }) => {
                docs = [...docs, ...data.data];
            })
            .catch((error) => {
                dispatch("handleAxiosError", error, { root: true });
            });
        document.dispatchEvent(new CustomEvent("dataReceivedStopLoader"));
        return docs;
    },
    // !  get_this_doc
    async get_this_doc({ state, dispatch }, _id) {
        let local_databases = ["vitrineDocs", "readDoc"];
        let doc;
        for (let i = 0; i < local_databases.length; i++) {
            const database = Array.isArray(state[local_databases[i]])
                ? state[local_databases[i]]
                : state[local_databases[i]].data;
            doc = database.find((doc) => doc._id === _id);
            if (doc) {
                doc.already_fetched = true;
                document.dispatchEvent(new CustomEvent("dataReceivedStopLoader"));
                return doc;
            }
        }

        doc = await axios
            .get(`/documents/${_id}`)
            .then((res) => res.data)
            .catch((error) => {
                dispatch("handleAxiosError", error, { root: true });
                return false;
            });
        document.dispatchEvent(new CustomEvent("dataReceivedStopLoader"));
        return doc;
    },
    // !  get_this_doc_for_update
    async get_this_doc_for_update({ state, commit, dispatch, rootState }, doc_id) {
        let doc, already_Decoded, decode_doc;
        const profileDocs = state.profilePage.data,
            user = rootState.user;

        if (profileDocs && profileDocs.length) {
            // * load from profile page
            doc = await profileDocs.filter((doc) => doc._id === doc_id)[0];
            if (doc) already_Decoded = true;
        }
        if (!doc) doc = await dispatch("get_this_doc", doc_id);

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
            dispatch("logout", `/profile/${user.username}`, { root: true });
        }
    },
    // ! get_all_childs
    async get_all_childs({ dispatch, commit }, doc) {
        const father = Array.isArray(doc) ? doc[0] : doc;
        if (!father.childs_id.length) return;

        const childs_ids = [...father.childs_id];
        let childs = [];

        childs = await dispatch("get_this_docs", childs_ids);
        if (!childs) return;

        const decoded_childs = await dispatch("decode_the_docs", { docs: childs });

        await commit("SET_DOCS_TO", { decoded_docs: decoded_childs, list: "newDocs", merge: true });
    },
    // !  read_this_doc
    async read_this_doc({ commit, dispatch, rootState }, id) {
        const _id = id || router.currentRoute.params._id;
        let doc, decoded_docs;

        // * not exist , get doc from server
        doc = await dispatch("get_this_doc", _id);
        if (!doc) return;

        if (doc.situation !== "publish" && doc.user._id !== rootState.user._id) {
            Vue.toasted.error("این داکیومنت خصوصی است ...");
            await dispatch("logout", null, { root: true });
            return;
        }

        decoded_docs = await dispatch("decode_the_docs", { docs: [doc] });

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
            .post("/documents/create/relationship", list)
            .then((res) => res.data)
            .catch((error) => {
                dispatch("handleAxiosError", error, { root: true });
                Vue.toasted.error("ساخت رابطه ی داکیومنت ها با مشکل مواجه شد ...");
                return false;
            });
        return result;
    },
    // !  searchData
    async searchData({ state, dispatch, rootState, commit }, { nextPage }) {
        const params = rootState.route.query;
        if (nextPage) params.$skip = state.searchedDocs.data.length;
        if (!params.text) {
            Vue.toasted.error("محتوایی را جستجو نکرده اید ...");
            router.push({ name: "all docs" });
            return;
        }

        const searchedDocs = await axios
            .get("/searchInDocs", { params })
            .then((res) => res.data)
            .catch((error) => {
                if (error == "Error: Request failed with status code 415") {
                    Vue.toasted.error("محدوده ای که مشخص کرده اید معتبر نمیباشد ...");
                }
                dispatch("handleAxiosError", error, { root: true });
            });
        console.log(searchedDocs);
        const decoded_docs = await dispatch("decode_the_docs", { docs: searchedDocs.data });

        await commit("SET_DOCS_TO", { decoded_docs, list: "searchedDocs", merge: nextPage });
        commit("SET_TOTAL", { list: "searchedDocs", total: searchedDocs.total });
    },
};
