import Vue from "vue";
import axios from 'axios';
import router from "../../router";
import newDoc from "./ac-newDoc"
import crudNewDoc from "./CRUD-newDoc"

const domain = 'http://localhost:3030';

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
    ...newDoc,
    ...crudNewDoc,
    async setCategory({
        // state,
        commit
    }, category) {
        await commit('setCategory', category)

        // * just for see all points select below! :D
        // if (state.situations.allPoints || state.situations.thereIsNoPoint) {
        //     situations(state.situations, 'loading')
        //     // * get the all points with this category
        //     const url = '/point/' + category._id
        //     try {
        //         await this.$axios.get(url).then((res) => {
        //             if (res.status == 200) {
        //                 commit('setAllPoints', res.data)
        //             }
        //         })
        //     } catch (error) {
        //         console.log(error);
        //     }
        // }
    },
    ready_document_for_send({
        state
    }, thisDoc) {
        let doc = {
            ...thisDoc,
            junk: {}
        }

        const is_this_doc_root = doc._id ? state.newDocs[0]._id == doc._id : state.newDocs[0].id == doc.id
        if (is_this_doc_root) {
            const this_tool = obj => obj.searchable == true
            const searchable_tool_index = doc.tools.findIndex(this_tool)
            doc.coordinates = {
                type: "Point",
                coordinates: doc.tools[searchable_tool_index].coordinates
            }
            doc.root = true
        }
        const imgs = doc.description.match(/<img/gm);
        doc.imgsCount = (imgs || []).length

        const year = doc.date_props.year,
            month = doc.date_props.month,
            day = doc.date_props.day;
        doc.date = year + month + day
        console.log(doc.date);
        doc.date = Number(doc.date) + 2 * 1000 * 1000
        console.log(doc.date);

        //  * description must be junk ?? (should include in the search query)
        const clear_this_items = ['tools', 'imgsCount', 'date_props']
        clear_this_items.forEach(element => {
            doc.junk[element] = doc[element];
            delete doc[element];
        });
        delete doc.childs_id;

        // const videos = doc.description.match(/<iframe/gm);
        // console.log('videos', (videos || []).length);

        doc.junk = JSON.stringify(doc.junk);
        // const data_striggify = JSON.stringify(doc)
        return doc;
    },
    async getAllCategories({
        commit
    }) {
        const url = '/category/'
        try {
            const categories = await this.$axios.get(url)
            commit('setAllCategories', categories.data)
        } catch (error) {
            console.log(error);
        }
    },

    async getTheCurrentUser({
        commit
    }) {
        const url = '/currentUser/'
        try {
            const user = await this.$axios.get(url);
            if (user.data == 401) {
                console.log('you should login');
            } else {
                commit('setTheCurrentUser', user.data)
            }
            // switch (user.data) {
            //     case 401:
            //         console.log('you should login');
            //         break;
            //     default:
            //         commit('setTheCurrentUser', user.data)
            //         break;
            // }
        } catch (error) {
            console.log(error);
        }

    },

    async getAllDocs({
        commit
    }) {
        const url = `${domain}/documents`;
        const params = {
            params: {
                root: true,
                $skip: 2
            }
        }
        const docs = await axios.get(url, params).then((res) => {
            if (res.status == 200) return res.data
            else if (res.code >= 500) {
                sendToast('error', 'مشکلی در سرور بوجود آمده')
            } else if (res.code >= 400) {
                sendToast('error', 'مشکلی بوجود آمده')
            }
        });
        if (!docs) return

        await commit('SET_DOCS_TO', {
            docs: docs,
            list: 'allDocs',
            merge: false
        })

    },
    async update_this_doc({
        state,
        commit,
    }, doc_id) {
        if (state.allDocs.data) {
            const doc = state.allDocs.data.filter(el => el._id == doc_id)
            if (doc) {
                await commit('UPDATE_THIS_DOC', doc)
                return
            }
            const url = `${domain}/documents/${doc_id}`
            const doc2 = await axios.get(url).then(res => {
                if (res.status == 200) return res.data
                // TODO => show errors 
            })
            if (!doc2) return
            await commit('SET_DOCS_TO', {
                docs: [doc2],
                list: 'newDocs',
                merge: false
            })
            // await commit('UPDATE_NEW_DOC_INDEX')
        }
        router.push('/my-docs')
    },
    get_childs({
        dispatch
    }, doc) {
        if (!doc) return
        if (!doc.childs_id.length) return
        const can_be_num = Number(doc.childs_id[0])
        if (!can_be_num) {
            dispatch('get_this_docs', doc.childs_id);
        } else return

    },
    async get_this_docs({
            commit
        },
        doc_ids) {
        let url = `${domain}/documents/`
        doc_ids.forEach(id => {
            url = url + `?_id[$in]=${id}&`
        });
        const docs = await axios.get(url).then(async res => res.data)
        // TODO => show errors for get method
        await commit('SET_DOCS_TO', {
            docs: docs,
            list: 'newDocs',
            merge: true
        })
        // console.log('doc', docs);
    }
}