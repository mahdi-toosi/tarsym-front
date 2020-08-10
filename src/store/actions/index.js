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
        const text = doc.description.replace(/<[^>]+>/g, '')
        const splitstr = text.split(' ')
        let excerpt = ''
        for (let index = 0; index < 50; index++) {
            const word = splitstr[index];
            if (!word) continue
            excerpt += ` ${word}`
        }
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
            docs: docs,
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
            // const url = `/documents/${doc_id}`
            // const doc2 = await axios.get(url).then(res => {
            //     if (res.status == 200) return res.data
            // }).catch(error => {
            //     dispatch('handleAxiosError', error)
            // });
            // if (!doc2) return

            // await commit('SET_DOCS_TO', {
            //     docs: [doc2],
            //     list: 'newDocs',
            //     merge: false
            // })
        }
        // await commit('UPDATE_NEW_DOC_INDEX')

    },
    async get_childs({
        dispatch,
        commit
    }, doc) {
        if (!doc) return
        if (!doc.childs_id.length) return
        const can_be_num = Number(doc.childs_id[0])
        if (!can_be_num) {
            const childs = await dispatch('get_this_docs', doc.childs_id);
            childs.data.forEach(child => {
                child.father_id = doc._id
            });
            await commit('SET_DOCS_TO', {
                docs: childs,
                list: 'newDocs',
                merge: true
            })
        } else return


    },
    async get_this_docs({
        dispatch
    }, doc_ids) {
        let url = `/documents/`
        doc_ids.forEach(id => {
            url = url + `?_id[$in]=${id}&`
        });
        const docs = await axios.get(url).then(async res => res.data).catch(error => {
            dispatch('handleAxiosError', error)
        });
        return docs
    }
}