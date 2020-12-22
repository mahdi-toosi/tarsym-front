export default {
    CHANGE_SEARCH_POLYGON_SITUATION(state) {
        state.searchPolygon.isOn = !state.searchPolygon.isOn;
    },
    HIDE_SIDEBAR(state) {
        setTimeout(() => (state.showSidebarNav = false), 600);
    },
    SHOW_SIDEBAR(state) {
        state.showSidebarNav = true;
    },
};
