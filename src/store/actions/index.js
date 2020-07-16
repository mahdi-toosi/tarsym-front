import Vue from "vue";
import axios from 'axios';
import newDoc from "./ac-newDoc"
import crudNewDoc from "./CRUD-newDoc"
import router from "../../router";

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
        const is_this_doc_root = state.newDocs[0].id == thisDoc.id
        if (is_this_doc_root) {
            const this_tool = obj => obj.searchable == true
            const searchable_tool_index = thisDoc.tools.findIndex(this_tool)
            doc.coordinates = {
                type: "Point",
                coordinates: thisDoc.tools[searchable_tool_index].coordinates
            }
            doc.root = true
        }
        const imgs = doc.description.match(/<img/gm);
        doc.imgsCount = (imgs || []).length

        //  * description must be junk ?? (should include in the search query)
        const clear_this_items = ['tools', 'imgsCount']
        clear_this_items.forEach(element => {
            doc.junk[element] = thisDoc[element];
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
        await axios.get(url, {
            params: {
                root: true,
                $skip: 2
            }
        }).then((res) => {
            // console.log('getAllDocs res  =>', res);
            if (res.status == 200) {
                commit('SET_ALL_DOCS', res.data)
            } else if (res.code >= 500) {
                sendToast('error', 'مشکلی در سرور بوجود آمده')
            } else if (res.code >= 400) {
                sendToast('error', 'مشکلی بوجود آمده')
            }
        });
    },
    editThisDoc(state, doc_id) {
        const path = `/update/doc/${doc_id}`
        router.push(path)
    }
}