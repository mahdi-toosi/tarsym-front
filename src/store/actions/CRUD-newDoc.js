import axios from 'axios';
import Vue from "vue";

function sendinfoToast(type, text) {
    Vue.toasted[type](text, {
        position: "bottom-left",
        duration: 5 * 1000,
        keepOnHover: true,
        iconPack: "fontawesome",
        icon: "fa-close",
    });
}
const domain = 'http://localhost:3030';

export default {
    async Create_this_Document({
        dispatch,
        commit
    }, doc, ) {
        const is_this_Doc_valid = await dispatch('is_this_Doc_valid', doc);
        if (!is_this_Doc_valid) return false;

        const url = `${ domain }/documents`,
            ready_doc = await dispatch('ready_document_for_send', doc),
            obj = {
                data: ready_doc
            };

        try {
            const newID = await axios.post(url, obj).then(async (res) => {
                if (res.status == 201) {
                    await commit('ADD_NEW_ID', {
                        doc: doc,
                        id: res.data._id
                    })
                    await dispatch('Update_father_Document_for_this_child', res.data._id);
                    // commit('setNewPointWithoutRefresh', data)
                }
                // console.log('res create =>', res.data.childs_id);
                return res.data._id
            })
            return newID
        } catch (error) {
            sendinfoToast('error', `مشکلی در سرور بوجود آمده ${error}`);
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
                }
                return res.data._id // remember this set value for newID
            })
            return newID
        } catch (error) {
            sendinfoToast('error', `مشکلی در سرور بوجود آمده ${error}`);
            return false
        }

    },
    async Update_father_Document_for_this_child({
        state
    }, id) {
        const thisDoc = await state.newDocs.filter(el => el.id == id)[0]
        const father_id = thisDoc.father_id
        if (father_id == 0) return
        const father_index = await state.newDocs.findIndex(el => el.id == father_id)
        const father = state.newDocs[father_index]
        const url = `${domain}/documents/${father_id}`
        // repalse previous id 
        const previous_id_index = await father.childs_id.findIndex(el => thisDoc.previous_id == el)
        father.childs_id[previous_id_index] = thisDoc.id

        const childs = {
            childs_id: father.childs_id
        }

        try {
            await axios.patch(url, childs).then((res) => {
                console.log('Update_father_Document_for_this_child =>', res.data.childs_id);

                //     // if (res.status == 201) {
                //     // commit('setNewPointWithoutRefresh', data)
                //     // }
            });
        } catch (error) {
            console.log(error);
        }
    },
    // ! CREATE Document 
    async Create_Documents({
        state,
        dispatch
    }) {
        // TODO show loading
        try {
            // TODO => if some requests failed , what should i do ?
            //TODO         stop the proccess or continue and send toast for  try again ?
            //TODO         or  repead request with timeout ?
            for (let index = 0; index < state.newDocs.length; index++) {
                const doc = state.newDocs[index];
                if (typeof (doc.id) == 'number') {
                    const result = await dispatch('Create_this_Document', doc);
                    if (result == false) break; // TODO => show try again ? 
                    continue
                } else {
                    const result = await dispatch('Update_this_Document', doc);
                    if (result == false) break; // TODO => show try again ?
                }

            }
        } catch (error) {
            console.log(error);
        }
        // TODO show done  if success
    },
}