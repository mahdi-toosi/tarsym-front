import axios from 'axios';
import Vue from "vue";

function sendToast(type, text) {
    Vue.toasted[type](text, {
        position: "bottom-left",
        duration: 5 * 1000,
        keepOnHover: true,
        iconPack: "fontawesome",
        icon: "fa-close",
    });
}

export default {
    async Create_this_Document({
        state,
        dispatch
    }, doc, ) {
        // const is_this_Doc_valid = await dispatch('is_this_Doc_valid', doc);
        // if (!is_this_Doc_valid) return false;

        const url = `${ state.domain }documents`,
            ready_doc = await dispatch('ready_document_for_send', doc)

        try {
            const newID = await axios.post(url, ready_doc).then((res) => {
                if (res.status == 201) {

                    return res.data
                    // await dispatch('Update_father_Document_for_this_child', res.data._id);
                    // commit('setNewPointWithoutRefresh', data)
                } else if (res.code == 500) {
                    sendToast('error', `Create_this_Document => ${res.message}`);
                }
                // console.log('res create =>', res.data.childs_id);
            })
            return newID
        } catch (error) {
            // TODO => how to show error mesaage
            sendToast('error', `مشکلی در سرور بوجود آمده ${error}`);
            return false
        }

    },
    async Update_this_Document({
        state,
        dispatch,
    }, doc, ) {
        const url = `${ state.domain }documents/${doc._id}`,
            ready_doc = await dispatch('ready_document_for_send', doc)
        try {
            const newID = await axios.put(url, ready_doc).then(async (res) => {
                if (res.status == 200) {
                    // console.log('UPDATED => ', res.data);
                    return res.data
                } else if (res.status == 500) {
                    sendToast('error', `Update_this_Document => ${res.message}`);
                }
            })
            return newID
        } catch (error) {
            sendToast('error', `مشکلی در سرور بوجود آمده ${error}`);
            return false
        }

    },
    async Delete_this_Document({
        state,
        commit
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
        const url = `${ state.domain }documents/${id}`
        try {
            const newID = await axios.delete(url).then(res => {
                if (res.status == 200) {
                    commit('REMOVE_THIS_DOC', id)
                }
                return res // remember this set value for newID
            })
            return newID
        } catch (error) {
            sendToast('error', `مشکلی در سرور بوجود آمده ${error}`);
            return false
        }
    },

    // ! CREATE Document 
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
                if (updated_doc == false) return false
            } else {
                const created_doc = await dispatch('Create_this_Document', doc)
                if (created_doc == false) return false
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
    async create_relationships({
        state
    }, list) {
        if (!list.length) return
        const url = `${ state.domain }create/documents/relationship`;

        try {
            const data = await axios.post(url, list).then((res) => {
                if (res.status == 201) {
                    return res.data
                    // await dispatch('Update_father_Document_for_this_child', res.data._id);
                    // commit('setNewPointWithoutRefresh', data)
                } else if (res.code == 500) {
                    sendToast('error', `create_relationships => ${res.message}`);
                }
                // console.log('res create =>', res.data.childs_id);
            })
            return data
        } catch (error) {
            // TODO => how to show error mesaage
            sendToast('error', `مشکلی در سرور بوجود آمده ${error}`);
            return false
        }

    },
    get_All_Tag({
        state,
        commit
    }) {
        const
            limit = 50,
            url = `${ state.domain }tags?$limit=${limit}`,
            allTags = false // JSON.parse(localStorage.getItem("allTags"))
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
        try {
            axios.get(url).then(res => {
                if (res.status == 200) {
                    res.data.date = new Date()
                    localStorage.setItem("allTags", JSON.stringify(res.data));
                    commit('SET_ALL_TAGS', res.data)
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
}