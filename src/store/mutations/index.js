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
        // if (!data.length) return
        let categories = [],
            tags = []
        data.forEach(taxonomy => {
            //*  categories type = 1 / tags type = 2s
            if (taxonomy.type == 1) {
                categories.push(taxonomy)
                return
            }
            delete taxonomy.childs
            tags.push(taxonomy)
        });
        state.taxonomies.categories = categories
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
        const categories = state.taxonomies.categories
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
            const last_category_child_id = decoded_Doc.categories[0]
            const last_category_child_obj = categories.filter(category => category._id == last_category_child_id)[0]
            if (last_category_child_obj) {
                categorys_list.push(last_category_child_obj)
                let stop_the_loop = false;
                for (let index = 0; index < 30; index++) {
                    const child = categorys_list[index];
                    const father = categories.filter(category => category.childs.includes(child._id))[0]
                    if (father) categorys_list.push(father)
                    else stop_the_loop = true
                    if (stop_the_loop) break;
                }
                decoded_Doc.categories = categorys_list.reverse()
            }
            newData.push(decoded_Doc)
        });

        if (docs.data) docs.data = newData
        else docs = newData

        if (!merge) return state[list] = docs

        if (state[list].data) {
            state[list].data = state[list].data.concat(docs.data)
            return
        } else state[list] = state[list].concat(docs.data)
    },
    mapCenterUpdated(state, coordinates) {
        state.map.center = coordinates;
    },
}