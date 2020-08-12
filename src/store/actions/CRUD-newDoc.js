import axios from 'axios';

export default {
    async Create_this_Document({
        dispatch
    }, doc, ) {
        const url = `/documents`,
            ready_doc = await dispatch('ready_document_for_send', doc)
        if (url) return
        const newID = await axios.post(url, ready_doc).then((res) => {
            if (res.status == 201) return res.data
        }).catch(error => {
            dispatch('handleAxiosError', error)
            return false
        })
        return newID
    },
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
    get_All_Tag({
        commit,
        dispatch
    }) {
        const
            limit = 50,
            url = `/tags?$limit=${limit}`,
            allTags = false; // JSON.parse(localStorage.getItem("allTags"))
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
        axios.get(url).then(res => {
            if (res.status == 200) {
                res.data.date = new Date()
                localStorage.setItem("allTags", JSON.stringify(res.data));
                commit('SET_ALL_TAGS', res.data)
            }
        }).catch(error => {
            dispatch('handleAxiosError', error)
        })
    }
}