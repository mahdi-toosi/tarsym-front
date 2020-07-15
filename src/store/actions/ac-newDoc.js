import Vue from "vue";
import router from "../../router";

function sendinfoToast(type, text) {
    Vue.toasted[type](text, {
        position: "bottom-left",
        duration: 5 * 1000,
        keepOnHover: true,
        iconPack: "fontawesome",
        icon: "fa-close",
    });
}

function thisDoc(state) {
    return state.newDocs[state.newDocProp.index]
}

export default {
    async setTool({
        commit,
        state
    }, type) {
        const all_tools_is_off = !state.newDocProp.OnTool.condition;
        if (all_tools_is_off) {
            await commit('SET_TOOL', type);
            await commit('UPDATE_ON_TOOL');
            return;
        } else {
            sendinfoToast('info', "درحال استفاده از ابزاری هستید");
        }
    },
    // async addChild({
    //     state,
    //     dispatch
    // }) {
    //     const thisDoc = state.newDocs[state.newDocProp.index],
    //         new_id = await dispatch('Create_this_Document', thisDoc);
    //     if (new_id) {
    //         await dispatch('addNewDoc', new_id);
    //         await dispatch('Update_father_Document_for_this_child', new_id);
    //     }
    // },
    async addNewDoc({
        commit,
        getters,
        state,
        dispatch
    }, root = true) {
        const is_any_tool_on = state.newDocProp.OnTool.condition
        if (is_any_tool_on) {
            // TODO => auto swich off the tool
            sendinfoToast('info', "ابتدا تغییر مختصات قبلی را ذخیره کنید");
            return;
        }
        const fake_id = new Date().getTime(),
            thisDoc = state.newDocs[state.newDocProp.index];

        if (!root) {
            thisDoc.childs_id.push(fake_id);
        }
        await commit('SET_NEW_DOCUMENT', fake_id)

        const path = `/create-point/${getters.lastAddedDocID}`;
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
            date = thisDoc.date,
            tags = thisDoc.tags.length > 0,
            // * later => auto swich off the tool
            is_any_tool_on = state.newDocProp.OnTool.condition;

        if (!title) errors.push('تیتر کافی نیست')
        if (!description) errors.push('توضیحات کافی نیست')
        if (!tags) errors.push('حداقل یک تگ برای این داکیومنت انتخاب کنید')
        if (!date) errors.push('تاریخ برای این داکیومنت انتخاب کنید')
        if (!tools) errors.push('حداقل از یک ابزار برای این داکیومنت استفاده کنید')
        // * later => auto swich off the tool
        if (is_any_tool_on) errors.push('در حال استفاده از ابزاری هستید')

        if (errors.length == 0) return true
        else {
            const action = [{
                text: 'داکیومنت',
                onClick: async (e, toastObject) => {
                    const path = `/create-point/${thisDoc.id}`;
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
    }) {
        const all_tools_is_off = !state.newDocProp.OnTool.condition;
        if (all_tools_is_off) {
            const doc_id = state.newDocProp.id;
            const father_id = await state.newDocs.filter(el => el.childs_id.includes(doc_id))[0].id
            const path = `/create-point/${father_id}`;
            await router.push(path);
            return;
        } else {
            sendinfoToast('info', "ابتدا تغییر مختصات قبلی را ذخیره کنید");
        }
    },
    async goToChild({
        state
    }, id) {
        const all_tools_is_off = !state.newDocProp.OnTool.condition;
        if (all_tools_is_off) {
            const path = `/create-point/${id}`;
            await router.push(path);
            return;
        } else {
            sendinfoToast('info', "ابتدا تغییر مختصات قبلی را ذخیره کنید");
        }
    },
    async deleteTool({
        commit
    }, index) {
        await commit('DELETE_TOOL', index)
        await commit('UPDATE_TOOLTIPS')
        await commit('UPDATE_ON_TOOL')
    },
    makeToolOn({
        state,
        commit
    }, index) {
        if (state.newDocProp.OnTool.condition) {
            const msg = "ابتدا دیتا های وارد شده قبلی را ذخیره کنید";
            sendinfoToast('error', msg);
            return;
        } else {
            const thisTool = thisDoc(state).tools[index];
            thisTool.isOn = true;
            commit('UPDATE_ON_TOOL')
        }
    },
    async toolSwitch({
            state,
            commit,
            dispatch
        },
        index, situation = "on") {
        const thisTool = thisDoc(state).tools[index];
        if (thisTool.isOn || situation == "off") {
            await commit('OFF_THIS_TOOL', thisTool)
            await commit('UPDATE_ON_TOOL')
            return
        } else {
            dispatch('makeToolOn', index)
        }
    },
}