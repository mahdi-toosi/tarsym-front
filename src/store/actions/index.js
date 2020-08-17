import requests from "./requests and handlers"
import router from "../../router";

const thisDoc = (state) => state.newDocs[state.newDocProp.index]

export default {
    ...requests,
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
    async deleteTool(store, index) {
        await store.commit('DELETE_TOOL', index)
        await store.commit('UPDATE_ON_TOOL')
    },
    async toolSwitch(store, index) {
        const thisTool = thisDoc(store.state).tools[index];
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
        const thisTool = thisDoc(store.state).tools[index];
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
        if (!root) {
            const thisDoc = state.newDocs[state.newDocProp.index];
            thisDoc.childs_id.push(fake_id);
        }
        await commit('SET_NEW_DOCUMENT', {
            fake_id,
            root
        })

        const path = `/${state.route.name == 'update doc' ? 'update' : 'create'}/doc/${fake_id}`;
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

        const existingDoc = await dispatch('get_this_docs', [_id])
        if (!existingDoc) return false

        const thisDoc = state.newDocs[state.newDocProp.index];
        thisDoc.childs_id.push(_id);

        await commit('SET_DOCS_TO', {
            docs: existingDoc,
            list: 'newDocs',
            merge: true,
            deleteRoot: true
        })
        const path = `/${state.route.name == 'update doc' ? 'update' : 'create'}/doc/${_id}`;
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
    //         const thisDoc = state.newDocs[state.newDocProp.index];
    //         thisDoc.childs_id.push(ID);
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
    //     const path = `/${state.route.name == 'update doc' ? 'update' : 'create'}/doc/${ID}`;
    //     await router.push(path);

    //     if (root) await dispatch('setTool', 'Point')
    // },

    async goBack({
        state,
        commit
    }) {
        await commit('OFF_THE_ON_TOOL')
        await commit('UPDATE_ON_TOOL');

        const doc_id = state.newDocProp.id;
        const father = await state.newDocs.filter(el => el.childs_id.includes(doc_id))[0]
        const path = `/${ state.route.name == 'create doc' ? 'create' : 'update'}/doc/${ ( father._id || father.id ) }`;
        await router.push(path);
    },
    async goToChild({
        commit
    }, id) {
        await commit('OFF_THE_ON_TOOL')
        await commit('UPDATE_ON_TOOL');

        const routeName = router.currentRoute.name
        const path = `/${ routeName == 'create doc' ? 'create' : 'update' }/doc/${id}`;
        await router.push(path);
        return;

    },

}