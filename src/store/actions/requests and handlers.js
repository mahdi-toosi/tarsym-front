import axios from 'axios';
import router from "../../router";
import Vue from "vue";

export default {
    // !  Create_this_Document
    async Create_this_Document({
        dispatch
    }, doc, ) {
        const url = `/documents`,
            ready_doc = await dispatch('ready_document_for_send', doc)
        // if (url) {
        // TODO delete this
        //     console.log('ready_doc => ', ready_doc)
        //     return 
        // }
        const newID = await axios.post(url, ready_doc).then((res) => {
            if (res.status == 201) return res.data
        }).catch(error => {
            dispatch('handleAxiosError', error)
            return false
        })
        return newID
    },
    // !  Update_this_Document
    async Update_this_Document({
        dispatch,
    }, doc, ) {
        const url = `/documents/${doc._id}`,
            ready_doc = await dispatch('ready_document_for_send', doc)

        const newID = await axios.put(url, ready_doc).then(async (res) => {
            if (res.status == 200) return res.data
        }).catch(error => {
            dispatch('handleAxiosError', error)
            return false
        })
        return newID
    },
    // !  Delete_this_Document
    async Delete_this_Document({
        state,
        commit,
        dispatch
    }, id, ) {
        if (typeof (id) == 'number') {
            const doc = state.newDocs.filter(el => el.id == id)[0]
            //  TODO => check for childs, if have child send toast for childs will delete ?
            if (doc.childs_id.length) {
                const remove_childs = confirm('این داکیومنت دارای داکیومنت زیرمجموعه میباشد، حذف شود؟');
                if (remove_childs) commit('REMOVE_THIS_DOC', id)
            } else {
                commit('REMOVE_THIS_DOC', id)
            }
            return
        }
        const remove_childs = confirm('در صورتی که این داکیومنت دارای زیرمجموعه باشد آنها هم حذف میشوند');
        if (!remove_childs) return

        const url = `/documents/${id}`
        const newID = await axios.delete(url).then(res => {
            if (res.status == 200) commit('REMOVE_THIS_DOC', id)
            return res // remember this set value for newID
        }).catch(error => {
            dispatch('handleAxiosError', error)
            return false
        })
        return newID

    },
    // !  Create_or_Update_Documents
    async Create_or_Update_Documents({
        state,
        dispatch,
        commit
    }) {
        const Docs = state.newDocs
        // TODO => show loading
        // validate docs
        for (let index = 0; index < Docs.length; index++) {
            const is_this_Doc_valid = await dispatch('is_this_Doc_valid', Docs[index]);
            if (!is_this_Doc_valid) return false
        }
        // create and add new id s
        for (let index = 0; index < Docs.length; index++) {
            // TODO => when user can import existing doc =>  if is new create , else update
            const doc = Docs[index]
            if (doc._id) {
                const updated_doc = await dispatch('Update_this_Document', doc)
                if (!updated_doc) return false
            } else {
                const created_doc = await dispatch('Create_this_Document', doc)
                if (!created_doc) return false
                await commit('ADD_NEW_ID', {
                    doc,
                    id: created_doc._id
                })
            }
        }
        const relationships_list = await dispatch('get_relationship_list');
        await dispatch('create_relationships', relationships_list);

        // get and add childs
        // TODO show done if work is successful
        commit('CLEAR_NEW_DOC')
    },
    // !  get_relationship_list
    get_relationship_list({
        state
    }) {
        const Docs = state.newDocs
        let list = []
        Docs.forEach(doc => {
            const obj = {
                new_id: doc._id,
                childs: []
            }
            if (!doc.childs_id.length) return

            doc.childs_id.forEach(child_id => {
                const new_child = Docs.filter(doc => doc._id == child_id)
                if (new_child.length) obj.childs.push((new_child[0]._id))
            });
            list.push(obj)
        });
        return list
    },
    // !  create_relationships
    async create_relationships({
        dispatch
    }, list) {
        if (!list.length) return
        const url = `/create/documents/relationship`;

        const data = await axios.post(url, list).then((res) => {
            if (res.status == 201) return res.data
        }).catch(error => {
            dispatch('handleAxiosError', error)
            return false
        })
        return data
    },
    // !  get_All_Tag
    get_All_Tag({
        commit,
        dispatch
    }) {
        const allTags = false; // JSON.parse(localStorage.getItem("allTags"))
        if (allTags) {
            const
                current = new Date(),
                allTagsDate = new Date(allTags.date),
                Difference_In_Time = current.getTime() - allTagsDate.getTime(),
                Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
            if (Difference_In_Days < 5) {
                commit('SET_ALL_TAGS', allTags)
                return
            }
        }
        const url = `/tags`,
            params = {
                params: {
                    $limit: 50,
                    $select: ['_id', 'name']
                }
            };
        axios.get(url, params).then(res => {
            if (res.status == 200) {
                res.data.date = new Date()
                localStorage.setItem("allTags", JSON.stringify(res.data));
                commit('SET_ALL_TAGS', res.data)
            }
        }).catch(error => {
            dispatch('handleAxiosError', error)
        })
    },
    // !  getAllDocs
    async getAllDocs({
        commit,
        dispatch
    }) {
        const url = `/documents`;
        const params = {
            params: {
                root: true,
                $skip: 0
            }
        }
        const docs = await axios.get(url, params).then((res) => {
            if (res.status == 200) return res.data
        }).catch(error => {
            dispatch('handleAxiosError', error)
        });
        if (!docs) return

        await commit('SET_DOCS_TO', {
            docs,
            list: 'allDocs',
            merge: false
        })

    },
    // !  get_this_docs
    async get_this_docs({
        dispatch
    }, doc_ids) {
        let url = `/documents/`,
            params = {
                params: {
                    '_id[$in]': doc_ids
                }
            }
        const docs = await axios.get(url, params).then(async res => res.data).catch(error => {
            dispatch('handleAxiosError', error)
            return false
        });
        return docs
    },
    // !  is_this_Doc_valid
    async is_this_Doc_valid({
        commit
    }, thisDoc) {
        await commit('OFF_THE_ON_TOOL')
        await commit('UPDATE_ON_TOOL');

        let errors = []
        // validate conditions
        const title = thisDoc.title.length > 5,
            description = thisDoc.description.length > 20,
            tools = thisDoc.tools.length > 0,
            date = thisDoc.date_props.year && thisDoc.date_props.month && thisDoc.date_props.day,
            currentRoute = router.currentRoute;

        if (!title) errors.push('تیتر کافی نیست')
        if (!description) errors.push('توضیحات کافی نیست')
        if (!date) errors.push('تاریخ برای این داکیومنت انتخاب کنید')
        if (!tools) errors.push('حداقل از یک ابزار برای این داکیومنت استفاده کنید')
        if (thisDoc.root) {
            const tags = thisDoc.tags.length;
            if (!tags) errors.push('حداقل یک تگ برای این داکیومنت انتخاب کنید')
        }

        if (errors.length == 0) return true
        else {
            const action = [{
                text: 'داکیومنت',
                onClick: async (e, toastObject) => {
                    const routeName = currentRoute.name
                    const path = `/${ routeName == 'create doc' ? 'create' : 'update' }/doc/${ (thisDoc._id || thisDoc.id) }`;
                    await router.push(path);
                    toastObject.goAway(0);
                }
            }]
            errors.forEach(msg => {
                Vue.toasted.error(msg, {
                    position: "bottom-left",
                    duration: 5 * 1000,
                    keepOnHover: true,
                    iconPack: "fontawesome",
                    icon: "fa-times-circle",
                    action: currentRoute.params.id == (thisDoc._id || thisDoc.id) ? false : action
                });
            });
            return false
        }
    },
    // !  update_this_doc
    async update_this_doc({
        state,
        commit,
        // dispatch
    }, doc_id) {
        if (!state.allDocs.data) {
            router.push('/my-docs')
            return
        }

        const doc = state.allDocs.data.filter(el => el._id == doc_id)
        if (doc.length) {
            await commit('UPDATE_THIS_DOC', doc)
            return
        } else {
            router.push('/my-docs')
        }
    },
    // !  ready_document_for_send
    ready_document_for_send(store, thisDoc) {
        let doc = {
            ...thisDoc,
            junk: {}
        }
        doc.title = doc.title.trim()

        // * create excerpt
        let excerpt = doc.description.replace(/<[^>]+>/g, '')
        excerpt = excerpt.split(/\s+/).slice(0, 50).join(" ")
        let fakeElement = document.createElement("textarea");
        fakeElement.innerHTML = excerpt;
        excerpt = fakeElement.value
        excerpt += ' ...'
        doc.excerpt = excerpt

        // * create searcheable coordinate
        if (doc.root) {
            const this_tool = obj => obj.searchable == true
            const searchable_tool_index = doc.tools.findIndex(this_tool)
            doc.coordinates = {
                type: "Point",
                coordinates: doc.tools[searchable_tool_index].coordinates
            }
        }

        // * remove unnecessary items form tools color obj
        doc.tools.forEach(tool => {
            if (tool.color.hex8) tool.color = tool.color.hex8
            if (tool.secondaryColor.hex8) tool.secondaryColor = tool.secondaryColor.hex8
        });

        // * count imgs in description
        const imgs = doc.description.match(/<img/gm);
        doc.imgsCount = (imgs || []).length

        // * make valid date for database
        const year = doc.date_props.year,
            month = doc.date_props.month,
            day = doc.date_props.day;
        doc.date = year + month + day
        doc.date = Number(doc.date) + 2 * 1000 * 1000

        const clear_this_items = ['tools', 'imgsCount', 'date_props', 'dashed', 'description']
        clear_this_items.forEach(element => {
            if (doc[element]) {
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
    handleAxiosError(store, error) {
        let msg;
        if (error == "Error: Network Error") msg = "مشکل در برقراری ارتباط با سرور";
        else if (error == "Error: Request failed with status code 409") msg = "ایمیل قبلا به ثبت رسیده است";
        else if (error == "Error: Request failed with status code 401") msg = "ایمیل یا رمز عبور اشتباه است";
        else if (error == "Error: Request failed with status code 503") msg = "مشکل در برقراری ارتباط با سرور";
        else if (error == "Error: Request failed with status code 400") msg = "درخواست شما معتبر نمیباشد"
        else {
            msg = error;
            // msg = "مشکلی در ارتباط با سرور بوجود آمده، لطفا چند دقیقه بعد دوباره امتحان کنید";
            console.log("request get error => ", msg);
        }
        Vue.toasted.error(msg, {
            position: "bottom-left",
            duration: 5 * 1000,
            keepOnHover: true,
            iconPack: "fontawesome",
            icon: "fa-times-circle",
        });
    },
}