import newDoc from "./mu-newDoc"

export default {
    ...newDoc,
    SET_USER(state, user) {
        state.user = user
    },
    SET_USER_ACCESS_TOKEN(state, token) {
        if (state.user) state.user.accessToken = token
    },
    SET_CHOSEN_TAXONOMIES(state, {
        data
    }) {
        if (!data.length) return

        let categorys = [],
            tags = []
        data.forEach(taxonomy => {
            //*  categorys type = 1 / tags type = 2s
            if (taxonomy.type == 1) {
                categorys.push(taxonomy)
                return
            }
            delete taxonomy.childs
            tags.push(taxonomy)
        });
        state.taxonomies.categorys = categorys
        state.taxonomies.tags = tags
    },
    UPDATE_THIS_DOC(state, doc) {
        state.newDocs = doc
    },
    SET_DOCS_TO(state, {
        docs,
        list,
        merge,
        deleteRoot,
        whitoutDecode
    }) {
        const Docs = docs.data || docs
        if (whitoutDecode) {
            state[list] = Docs
            return
        }
        const newData = []
        const categorys = state.taxonomies.categorys
        const tags = state.taxonomies.tags
        Docs.forEach(doc => {
            const junk = JSON.parse(doc.junk)
            delete doc.junk
            const decoded_Doc = {
                ...doc,
                ...junk
            }
            decoded_Doc.date = decoded_Doc.date - 2000000
            if (deleteRoot && decoded_Doc.root) delete decoded_Doc.root
            // * populate taxonomies
            // *tags
            for (let index = 0; index < decoded_Doc.tags.length; index++) {
                let doc_tag = decoded_Doc.tags[index];
                const tag_obj = tags.filter(tag => tag._id == doc_tag)[0]
                if (tag_obj) decoded_Doc.tags[index] = tag_obj
                else decoded_Doc.tags.splice(index, 1)
            }
            // * categories
            let categorys_list = [];
            const last_category_child_id = decoded_Doc.categorys[0]
            const last_category_child_obj = categorys.filter(category => category._id == last_category_child_id)[0]
            if (last_category_child_obj) {
                categorys_list.push(last_category_child_obj)
                let stop_the_loop = false;
                for (let index = 0; index < 30; index++) {
                    const child = categorys_list[index];
                    const father = categorys.filter(category => category.childs.includes(child._id))[0]
                    if (father) categorys_list.push(father)
                    else stop_the_loop = true
                    if (stop_the_loop) break;
                }
                decoded_Doc.categorys = categorys_list.reverse()
            }
            newData.push(decoded_Doc)
        });
        if (docs.data) docs.data = newData
        else docs = newData

        if (merge) {
            if (state[list].data) {
                state[list].data.concat(docs.data)
                return
            } else state[list].concat(docs.data)
        } else state[list] = docs
    },
    mapCenterUpdated(state, coordinates) {
        state.map.center = coordinates;
    },
}