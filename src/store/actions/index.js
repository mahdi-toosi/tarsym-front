import axios from 'axios';
import router from "../../router";
import newDoc from "./ac-newDoc"
import crudNewDoc from "./CRUD-newDoc"

export default {
    ...newDoc,
    ...crudNewDoc,
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
    async get_childs({
        state,
        dispatch,
        commit
    }, doc) {
        if (!doc || !doc._id || !doc.childs_id.length) return
        let valid_childs_id = []
        for (let index = 0; index < doc.childs_id.length; index++) {
            const child_id = doc.childs_id[index];
            const is_it_number = typeof child_id == 'number'
            if (is_it_number) continue
            const thisObject = (doc) => doc._id == child_id
            const is_already_exist = state.newDocs.findIndex(thisObject)
            if (!is_already_exist) continue
            valid_childs_id.push(child_id)
        }
        if (!valid_childs_id.length) return

        const childs = await dispatch('get_this_docs', valid_childs_id);

        await commit('SET_DOCS_TO', {
            docs: childs,
            list: 'newDocs',
            merge: true
        })


    },
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
    }
}