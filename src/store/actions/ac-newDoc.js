import Vue from "vue";
import router from "../../router";

// function sendinfoToast(type, text) {
//     Vue.toasted[type](text, {
//         position: "bottom-left",
//         duration: 5 * 1000,
//         keepOnHover: true,
//         iconPack: "fontawesome",
//         icon: "fa-close",
//     });
// }

function thisDoc(state) {
    return state.newDocs[state.newDocProp.index]
}

export default {
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
        getters,
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

        const path = `/create/doc/${getters.lastAddedDocID}`;
        await router.push(path);

        if (root) await dispatch('setTool', 'Point')
    },
    is_this_Doc_valid({
        state
    }, thisDoc) {
        let errors = []
        // validate conditions
        const title = thisDoc.title.length > 5,
            description = thisDoc.description.length > 20,
            tools = thisDoc.tools.length > 0,
            date = thisDoc.date_props.year && thisDoc.date_props.month && thisDoc.date_props.day,
            // * later => auto swich off the tool
            is_any_tool_on = state.newDocProp.OnTool.condition;

        if (!title) errors.push('تیتر کافی نیست')
        if (!description) errors.push('توضیحات کافی نیست')
        if (!date) errors.push('تاریخ برای این داکیومنت انتخاب کنید')
        if (!tools) errors.push('حداقل از یک ابزار برای این داکیومنت استفاده کنید')
        // * later => auto swich off the tool
        if (is_any_tool_on) errors.push('در حال استفاده از ابزاری هستید')
        if (thisDoc.tags) {
            const tags = thisDoc.tags.length > 0;
            if (!tags) errors.push('حداقل یک تگ برای این داکیومنت انتخاب کنید')
        }

        if (errors.length == 0) return true
        else {
            const action = [{
                text: 'داکیومنت',
                onClick: async (e, toastObject) => {
                    const path = `/create/doc/${thisDoc.id}`;
                    await router.push(path);
                    toastObject.goAway(0);
                }
            }]
            errors.forEach(msg => {
                Vue.toasted.error(msg, {
                    position: "bottom-left",
                    duration: 5 * 1000,
                    keepOnHover: true,
                    iconPack: "fontawesome",
                    icon: "fa-close",
                    action: router.currentRoute.params.id == thisDoc.id ? false : action
                });
            });
            return false
        }
    },
    async goBack({
        state,
        commit
    }) {
        await commit('OFF_THE_ON_TOOL')
        await commit('UPDATE_ON_TOOL');

        const doc_id = state.newDocProp.id;
        const father_id = await state.newDocs.filter(el => el.childs_id.includes(doc_id))[0]
        const path = `/${ state.route.name == 'create doc' ? 'create' : 'update'}/doc/${ father_id._id ? father_id._id : father_id.id }`;
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
    async deleteTool({
        commit
    }, index) {
        await commit('DELETE_TOOL', index)
        await commit('UPDATE_TOOLTIPS')
        await commit('UPDATE_ON_TOOL')
    },
    async toolSwitch({
            state,
            commit,
            dispatch
        },
        index) {
        const thisTool = thisDoc(state).tools[index];
        if (thisTool.isOn) {
            // if is on turned off
            await commit('OFF_THE_ON_TOOL')
            await commit('UPDATE_ON_TOOL')
            return
        } else {
            //turned On
            await dispatch('makeToolOn', index)
        }
    },
    async makeToolOn({
        state,
        commit
    }, index) {
        await commit('OFF_THE_ON_TOOL')
        const thisTool = thisDoc(state).tools[index];
        thisTool.isOn = true;
        await commit('UPDATE_ON_TOOL')
    },
}