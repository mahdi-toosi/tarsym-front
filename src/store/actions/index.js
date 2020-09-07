import requests from "./requests and handlers"
import router from "../../router";

const docLayer = (state) => state.newDocs[state.DocProp.index]

export default {
    ...requests,
    async get_childs({
        state,
        dispatch,
        commit
    }) {
        const doc = docLayer(state)
        if (!doc || !doc.childs_id.length) return
        let valid_childs_id = []
        doc.childs_id.forEach(child_id => {
            if (typeof child_id == 'number') return
            const already_exist = state.newDocs.findIndex(doc => doc._id == child_id)
            if (already_exist > -1) return
            valid_childs_id.push(child_id)
        });
        if (!valid_childs_id.length) return

        const childs = await dispatch('get_this_docs', valid_childs_id);
        const decoded_childs = await dispatch('decode_the_docs', {
            docs: childs
        })
        await commit('SET_DOCS_TO', {
            decoded_docs: decoded_childs,
            list: 'newDocs',
            merge: true
        })
    },
    async deleteTool(store, index) {
        await store.commit('DELETE_TOOL', index)
        await store.commit('UPDATE_ON_TOOL')
    },
    async toolSwitch(store, index) {
        const thisTool = docLayer(store.state).tools[index];
        if (thisTool.isOn) {
            // if is on turned off
            await store.commit('OFF_THE_ON_TOOL')
            await store.commit('UPDATE_ON_TOOL')
            return
        } else {
            await store.dispatch('makeToolOn', index)
        }
    },
    async makeToolOn(store, index) {
        await store.commit('OFF_THE_ON_TOOL')
        const thisTool = docLayer(store.state).tools[index];
        thisTool.isOn = true;
        await store.commit('UPDATE_ON_TOOL')
    },
    async setTool({
        commit
    }, type) {
        await commit('OFF_THE_ON_TOOL')
        await commit('UPDATE_ON_TOOL');
        await commit('SET_TOOL', type);
        await commit('UPDATE_ON_TOOL');
    },
    async addNewDoc({
        commit,
        state,
        dispatch
    }, root = true) {
        await commit('OFF_THE_ON_TOOL')
        await commit('UPDATE_ON_TOOL');

        const fake_id = new Date().getTime();
        const payload = {
            fake_id,
            root,
        }
        if (!root) {
            const father_doc = docLayer(state)
            father_doc.childs_id.push(fake_id);
            payload.date_props = father_doc.date_props
        }
        await commit('SET_NEW_DOCUMENT', payload)

        const path = `/${state.route.name == 'update doc' ? 'update' : 'create'}/${fake_id}`;
        await router.push(path);

        if (root) await dispatch('setTool', 'Point')
    },
    async addExistingDoc({
        commit,
        state,
        dispatch
    }, _id) {
        await commit('OFF_THE_ON_TOOL')
        await commit('UPDATE_ON_TOOL');

        const existingDoc = await dispatch('get_this_docs', _id)
        if (!existingDoc) return false
        docLayer(state).childs_id.push(_id);

        const decode_existingDoc = await dispatch('decode_the_docs', {
            docs: [existingDoc]
        })
        await commit('SET_DOCS_TO', {
            decoded_docs: decode_existingDoc,
            list: 'newDocs',
            merge: true,
        })
        const path = `/${state.route.name == 'update doc' ? 'update' : 'create'}/${_id}`;
        await router.push(path);
    },
    // async addNewDoc({
    //     commit,
    //     // getters,
    //     state,
    //     dispatch
    // }, {
    //     root,
    //     _id
    // }) {
    //     await commit('OFF_THE_ON_TOOL')
    //     await commit('UPDATE_ON_TOOL');

    //     const ID = (_id || new Date().getTime());
    //     if (!root) {
    //         const docLayer = state.newDocs[state.DocProp.index];
    //         docLayer.childs_id.push(ID);
    //     }
    //     if (!_id) {

    //         await commit('SET_NEW_DOCUMENT', {
    //             ID,
    //             root
    //         })
    //     } else {
    //         const existingDoc = await dispatch('get_this_docs', [_id])
    //         if (!existingDoc) return false

    //         await commit('SET_DOCS_TO', {
    //             docs: existingDoc,
    //             list: 'newDocs',
    //             merge: true,
    //             deleteRoot: true
    //         })
    //     }
    //     const path = `/${state.route.name == 'update doc' ? 'update' : 'create'}/${ID}`;
    //     await router.push(path);

    //     if (root) await dispatch('setTool', 'Point')
    // },

    async goBackToParent({
        state,
        commit
    }) {
        await commit('OFF_THE_ON_TOOL')
        await commit('UPDATE_ON_TOOL');

        const doc_id = state.DocProp._id;
        const father = await state.newDocs.filter(el => el.childs_id.includes(doc_id))[0]
        const path = `/${ state.route.name == 'create doc' ? 'create' : 'update'}/${ father._id }`;
        await router.push(path);
    },
    async goToChild({
        commit
    }, _id) {
        await commit('OFF_THE_ON_TOOL')
        await commit('UPDATE_ON_TOOL');

        const routeName = router.currentRoute.name
        const path = `/${ routeName == 'create doc' ? 'create' : 'update' }/${_id}`;
        await router.push(path);
        return;
    },
    decode_the_docs(store, {
        docs,
        deleteRoot,
    }) {
        const Docs = docs.data || docs
        const newData = []
        const categories = store.state.taxonomies.categories
        const tags = store.state.taxonomies.tags
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
        return newData
    }

}