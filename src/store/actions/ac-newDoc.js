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
    async addNewDoc({
        commit,
        getters,
        state
    }, father_id = 0) {
        const all_tools_is_off = !state.newDocProp.OnTool.condition;
        if (all_tools_is_off) {
            const fake_id = new Date().getTime();
            if (father_id !== 0) {
                const index = state.newDocProp.index;
                state.newDocs[index].childs_id.push(fake_id);
            }
            await commit('ADD_NEW_DOCUMENT', {
                fake_id,
                father_id
            })
            const path = `/new-point/${getters.lastAddedDocID}`;
            await router.push(path);
            await commit('UPDATE_NEW_DOC_INDEX');
            return;
        } else {
            sendinfoToast('info', "ابتدا تغییر مختصات قبلی را ذخیره کنید");
        }
    },
    async goBack({
        state,
        commit
    }) {
        const all_tools_is_off = !state.newDocProp.OnTool.condition;
        if (all_tools_is_off) {
            const thisDoc = state.newDocProp.index;
            const father_id = state.newDocs[thisDoc].father_id;
            const path = `/new-point/${father_id}`;
            await router.push(path);
            await commit('UPDATE_NEW_DOC_INDEX');
            return;
        } else {
            sendinfoToast('info', "ابتدا تغییر مختصات قبلی را ذخیره کنید");
        }
    },
    async goToChild({
        commit,
        state
    }, id) {
        const all_tools_is_off = !state.newDocProp.OnTool.condition;
        if (all_tools_is_off) {
            const path = `/new-point/${id}`;
            await router.push(path);
            await commit('UPDATE_NEW_DOC_INDEX');
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