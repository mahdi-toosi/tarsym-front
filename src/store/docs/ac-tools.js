export default {
    async deleteTool(store, index) {
        await store.commit("DELETE_TOOL", index);
        await store.commit("UPDATE_ON_TOOL");
    },
    async toolSwitch({ commit }, { tool, index }) {
        const tool_is_on = tool.isOn;

        await commit("OFF_THE_ON_TOOL");
        if (!tool_is_on) await commit("MAKE_TOOL_ON", index);

        await commit("UPDATE_ON_TOOL");
    },
    async setTool({ commit, rootState }, type) {
        await commit("OFF_THE_ON_TOOL");
        await commit("UPDATE_ON_TOOL");
        await commit("SET_TOOL", { type, map: rootState.map });
        await commit("UPDATE_ON_TOOL");
    },
    async copy_tool({ commit }, index) {
        await commit("OFF_THE_ON_TOOL");
        await commit("COPY_TOOL", index);
        await commit("MAKE_TOOL_ON", index + 1);
        await commit("UPDATE_ON_TOOL");
    },
};
