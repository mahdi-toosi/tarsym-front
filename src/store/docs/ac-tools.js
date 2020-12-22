export default {
    async deleteTool(store, index) {
        await store.commit("DELETE_TOOL", index);
        await store.commit("UPDATE_ON_TOOL");
    },
    toolSwitch({ commit }, { tool, index }) {
        const tool_is_on = tool.isOn;

        commit("OFF_THE_ON_TOOL");

        if (!tool_is_on) commit("MAKE_TOOL_ON", index);

        commit("UPDATE_ON_TOOL");
        return;
    },
    async setTool({ commit }, type) {
        await commit("OFF_THE_ON_TOOL");
        await commit("UPDATE_ON_TOOL");
        await commit("SET_TOOL", type);
        await commit("UPDATE_ON_TOOL");
    },
};
