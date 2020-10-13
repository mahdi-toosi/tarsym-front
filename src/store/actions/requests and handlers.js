import axios from "axios";
import router from "../../router";
import Vue from "vue";

export default {
    // !  Create_this_Document
    async Create_this_Document({ dispatch }, doc) {
        const url = `/documents`,
            ready_doc = await dispatch("ready_document_for_send", doc);

        const newID = await axios
            .post(url, ready_doc)
            .then((res) => {
                if (res.status == 201) return res.data;
            })
            .catch((error) => {
                dispatch("handleAxiosError", error);
                return false;
            });
        return newID;
    },
    // !  Update_this_Document
    async Update_this_Document({ dispatch }, doc) {
        const url = `/documents/${doc._id}`,
            ready_doc = await dispatch("ready_document_for_send", doc);

        const newID = await axios
            .put(url, ready_doc)
            .then(async (res) => {
                if (res.status == 200) return res.data;
            })
            .catch((error) => {
                dispatch("handleAxiosError", error);
                return false;
            });
        return newID;
    },
    // !  Delete_this_Document
    async Delete_this_Document({ state, commit, dispatch }, _id) {
        if (typeof _id == "number") {
            const doc = state.newDocs.filter((el) => el._id == _id)[0];
            //  TODO => check for childs, if have child send toast for childs will delete ?
            if (doc.childs_id.length) {
                const remove_childs = confirm("این داکیومنت دارای داکیومنت زیرمجموعه میباشد، حذف شود؟");
                if (remove_childs) commit("REMOVE_THIS_DOC", _id);
            } else {
                commit("REMOVE_THIS_DOC", _id);
            }
            return;
        }
        const remove_childs = confirm("در صورتی که این داکیومنت دارای زیرمجموعه باشد آنها هم حذف میشوند");
        if (!remove_childs) return;

        const url = `/documents/${_id}`;
        const newID = await axios
            .delete(url)
            .then((res) => {
                commit("REMOVE_THIS_DOC", _id);
                return res; // remember this set value for newID
            })
            .catch((error) => {
                dispatch("handleAxiosError", error);
                return false;
            });
        return newID;
    },
    // !  Create_or_Update_Documents
    async Create_or_Update_Documents({ state, dispatch, commit }) {
        const Docs = state.newDocs;
        let verb;
        // * validate docs
        for (let index = 0; index < Docs.length; index++) {
            const is_this_Doc_valid = await dispatch("is_this_Doc_valid", Docs[index]);
            if (!is_this_Doc_valid) return false;
        }
        // * create documents and add new _id s
        for (let index = 0; index < Docs.length; index++) {
            // TODO => when user can import existing doc =>  if is new create , else update
            const doc = Docs[index];
            if (typeof doc._id == "number") {
                const created_doc = await dispatch("Create_this_Document", doc);
                if (!created_doc) return false;
                await commit("ADD_NEW_ID", {
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
        await router.push("/profile");
        Vue.toasted.success(`داکیومنت با موفقیت ${verb} ...`);
    },
    // !  get_relationship_list
    get_relationship_list({ state }) {
        const Docs = state.newDocs;
        let list = [];
        Docs.forEach((doc) => {
            const obj = {
                new_id: doc._id,
                childs: [],
            };
            if (!doc.childs_id.length) return;

            doc.childs_id.forEach((child_id) => {
                const new_child = Docs.filter((doc) => doc._id == child_id);
                if (new_child.length) obj.childs.push(new_child[0]._id);
            });
            list.push(obj);
        });
        return list;
    },
    // !  create_relationships
    async create_relationships({ dispatch }, list) {
        if (!list.length) return true;
        const url = `/create/documents/relationship`;

        const data = await axios
            .post(url, list)
            .then((res) => {
                if (res.status == 201) return res.data;
            })
            .catch((error) => {
                dispatch("handleAxiosError", error);
                Vue.toasted.success("ساخت رابطه ی داکیومنت ها با مشکل مواجه شد ...");
                return false;
            });
        return data;
    },
    // !  get_All_Taxanomies
    get_All_Taxanomies({ commit, dispatch }, withCache = true) {
        const Taxonomies = JSON.parse(localStorage.getItem("Taxonomies"));
        if (withCache && Taxonomies) {
            const TaxsDate_PlusSomeDays = new Date(Taxonomies.date).getTime() + 1000 * 60 * 60 * 24 * 5, //*  5 days
                CurrentTime = new Date().getTime();
            if (TaxsDate_PlusSomeDays > CurrentTime) {
                commit("SET_CHOSEN_TAXONOMIES", Taxonomies);
                return;
            }
        }
        const url = `/taxonomies`,
            options = {
                params: {
                    $limit: 50,
                    $select: ["_id", "name", "type", "childs"],
                },
            };
        axios
            .get(url, options)
            .then((res) => {
                res.data.date = new Date();
                localStorage.setItem("Taxonomies", JSON.stringify(res.data));
                commit("SET_CHOSEN_TAXONOMIES", res.data);
            })
            .catch((error) => dispatch("handleAxiosError", error));
    },
    // !  getAllDocs
    async getAllDocs({ commit, dispatch }) {
        const url = `/documents`;
        const options = {
            params: {
                root: true,
                $skip: 0,
            },
        };
        const docs = await axios
            .get(url, options)
            .then((res) => {
                if (res.status == 200) return res.data;
            })
            .catch((error) => {
                dispatch("handleAxiosError", error);
            });
        if (!docs) return;

        const decoded_docs = await dispatch("decode_the_docs", {
            docs,
        });
        docs.data = decoded_docs;
        await commit("SET_DOCS_TO", {
            decoded_docs: docs,
            list: "allDocs",
            merge: false,
        });
    },
    // !  get_this_docs
    async get_this_docs({ dispatch }, doc_ids) {
        let is_doc_ids_array = Array.isArray(doc_ids),
            url = `/documents/${is_doc_ids_array ? "" : doc_ids}`,
            obj = {
                params: {
                    "_id[$in]": doc_ids,
                },
            },
            options = is_doc_ids_array ? obj : {};
        const docs = await axios
            .get(url, options)
            .then(async (res) => res.data)
            .catch((error) => {
                dispatch("handleAxiosError", error);
                return false;
            });
        return docs;
    },
    // !  is_this_Doc_valid
    async is_this_Doc_valid({ commit }, docLayer) {
        await commit("OFF_THE_ON_TOOL");
        await commit("UPDATE_ON_TOOL");

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
    // !  update_this_doc
    async update_this_doc({ state, commit }, doc_id) {
        if (!state.profilePage.docs.data) {
            router.push("/profile");
            return;
        }

        const doc = state.profilePage.docs.data.filter((el) => el._id == doc_id);
        if (doc.length) {
            await commit("UPDATE_THIS_DOC", doc);
            return;
        } else {
            router.push("/profile");
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
        excerpt += " ...";
        doc.excerpt = excerpt;

        if (doc.root) {
            // * create searcheable coordinate
            const this_tool = (obj) => obj.searchable == true;
            const searchable_tool_index = doc.tools.findIndex(this_tool);
            doc.location = {
                type: "Point",
                coordinates: doc.tools[searchable_tool_index].coordinates,
            };

            // * optimize categories for backend
            const Cats = doc.categories,
                removeCats = [];
            for (let index = 0; index < Cats.length; index++) {
                const nextCat = Cats[index + 1];
                if (nextCat && nextCat._id) removeCats.push(index);
                else break;
            }
            removeCats.forEach((index) => Cats.splice(index, 1));

            // * count imgs in description
            const imgs = doc.description.match(/<img/gm);
            doc.imgsCount = (imgs || []).length;
        }

        // * remove unnecessary items form tools color obj
        doc.tools.forEach((tool) => {
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
        const clear_this_items = ["tools", "imgsCount", "date_props", "description", "layerIndex", "map_animate"];
        if (!doc.root) clear_this_items.push("location");
        clear_this_items.forEach((element) => {
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
    // !  handleAxiosError
    handleAxiosError({ commit }, error) {
        let msg;
        if (error == "Error: Network Error") msg = "مشکل در برقراری ارتباط با سرور";
        else if (error == "Error: Request failed with status code 409") msg = "مختصات شاخص قبلا به ثبت رسیده است";
        else if (error == "Error: Request failed with status code 503") msg = "مشکل در برقراری ارتباط با سرور";
        else if (error == "Error: Request failed with status code 400") msg = "درخواست شما معتبر نمیباشد";
        else if (error == "Error: Request failed with status code 500") msg = "مشکلی در سرور بوجود آمده است";
        else if (error == "Error: Request failed with status code 404") msg = "دیتای درخواستی پیدا نشد ...";
        else if (error == "Error: Request failed with status code 401") {
            // msg = "ایمیل یا رمز عبور اشتباه است"
            commit("LOGOUT");
            router.push("/Auth");
        } else {
            msg = error;
            // msg = "مشکلی در ارتباط با سرور بوجود آمده، لطفا چند دقیقه بعد دوباره امتحان کنید";
            console.log("request get error => ", msg);
        }
        Vue.toasted.error(msg);
    },
    // !  read_this_doc
    async read_this_doc({ state, commit, dispatch }, id) {
        const _id = id || router.currentRoute.params._id;
        let doc, already_Decoded, decoded_docs;
        if (state.allDocs.data.length) {
            doc = await state.allDocs.data.filter((doc) => doc._id == _id)[0];
            if (doc) already_Decoded = true;
        }
        if (!doc) doc = await dispatch("get_this_docs", _id);
        if (!doc) return;

        if (!already_Decoded)
            decoded_docs = await dispatch("decode_the_docs", {
                docs: [doc],
            });
        await commit("SET_DOCS_TO", {
            decoded_docs: decoded_docs || [doc],
            list: "readDoc",
        });

        dispatch("flyToThisDoc", decoded_docs ? decoded_docs[0] : doc);

        await commit("CHANGE_MAP_LAYERS");
        if (!doc.childs_id.length) return;
        const childs = await dispatch("get_this_docs", doc.childs_id);
        if (!childs) return;

        const decoded_childs = await dispatch("decode_the_docs", {
            docs: childs,
            deleteRoot: true,
        });
        await commit("SET_DOCS_TO", {
            decoded_docs: decoded_childs,
            list: "readDoc",
            merge: true,
        });
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
