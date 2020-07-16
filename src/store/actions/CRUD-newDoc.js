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

// async function sendToast_yes_or_no(type, text) {
//     await Vue.toasted[type](text, {
//         position: "bottom-left",
//         duration: 5 * 1000,
//         keepOnHover: true,
//         iconPack: "fontawesome",
//         icon: "fa-close",
//         action: [{
//                 text: 'Cancel',
//                 onClick: (e, toastObject) => {
//                     toastObject.goAway(0);
//                     return false
//                 }
//             },
//             {
//                 text: 'Ok',
//                 onClick: (e, toastObject) => {
//                     toastObject.goAway(0);
//                     return true
//                 }
//             }
//         ]
//     });
// }

const domain = 'http://localhost:3030';

export default {
    async Create_this_Document({
        dispatch
    }, doc, ) {
        // const is_this_Doc_valid = await dispatch('is_this_Doc_valid', doc);
        // if (!is_this_Doc_valid) return false;

        const url = `${ domain }/documents`,
            ready_doc = await dispatch('ready_document_for_send', doc)
        // obj = {
        //     data: ready_doc
        // };

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
        dispatch,
    }, doc, ) {
        const is_this_Doc_valid = await dispatch('is_this_Doc_valid', doc);
        if (!is_this_Doc_valid) return false;

        const url = `${ domain }/documents/${doc.id}`,
            ready_doc = await dispatch('ready_document_for_send', doc),
            obj = {
                data: ready_doc
            };
        console.log("request for update", url);

        try {
            const newID = await axios.put(url, obj).then(async (res) => {
                if (res.status == 200) {
                    console.log('UPDATED => ', res.data.title);
                } else if (res.status == 500) {
                    sendToast('error', `Update_this_Document => ${res.message}`);
                }
                return res.data._id // remember this set value for newID
            })
            return newID
        } catch (error) {
            sendToast('error', `مشکلی در سرور بوجود آمده ${error}`);
            return false
        }

    },
    async Delete_this_Document({
        state,
        dispatch,
        commit
    }, id, ) {
        const doc = state.newDocs.filter(el => el.id == id)[0]
        console.log(doc);

        //  TODO => check for childs, if have child send toast for childs will delete ?
        if (doc.childs_id.length > 0) {
            // const remove_childs = await sendToast_yes_or_no('error', 'این داکیومنت دارای داکیومنت زیرمجموعه میباشد، حذف شوند؟')
            const remove_childs = confirm('این داکیومنت دارای داکیومنت زیرمجموعه میباشد، حذف شوند؟');
            console.log(remove_childs);
        }
        let mahdi = true
        if (mahdi) return
        // TODO => if doc is not create in database remove form state and done
        if (typeof (id) == 'number') {
            commit('REMOVE_THIS_DOC', id)
            return
        }
        const url = `${ domain }/documents/${id}`,
            ready_doc = await dispatch('ready_document_for_send', doc),
            obj = {
                data: ready_doc
            };
        console.log("request for update", url);

        try {
            const newID = await axios.put(url, obj).then(async (res) => {
                if (res.status == 200) {
                    console.log('UPDATED => ', res.data.title);
                }
                return res.data._id // remember this set value for newID
            })
            return newID
        } catch (error) {
            sendToast('error', `مشکلی در سرور بوجود آمده ${error}`);
            return false
        }
    },

    // ! CREATE Document 
    async Create_Documents({
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
            const created_doc = await dispatch('Create_this_Document', Docs[index])
            if (created_doc == false) return false

            await commit('ADD_NEW_ID', {
                doc: Docs[index],
                id: created_doc._id
            })
        }
        const relationships_list = await dispatch('get_relationship_list');
        const data = dispatch('create_relationships', relationships_list);
        console.log(data);

        // get and add childs
        // TODO show done  if work is successful
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
            if (doc.childs_id.length == 0) return

            doc.childs_id.forEach(child => {
                const new_id = Docs.filter(el => el.id == child)[0]._id
                obj.childs.push(new_id)
            });
            list.push(obj)
        });
        return list
    },
    async create_relationships(state, list) {
        if (list.length == 0) return
        const url = `${ domain }/create/documents/relationship`;

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

    }
}