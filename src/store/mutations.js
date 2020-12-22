import router from "../router";

export default {
    CHANGE_SEARCH_POLYGON_SITUATION(state) {
        state.searchPolygon.isOn = !state.searchPolygon.isOn;
    },
    CHANGE_MAP_LAYERS(state, mainMap) {
        if (mainMap) {
            state.map.tileProviders.forEach((tileProvider) => (tileProvider.visible = false));
            state.map.tileProviders[0].visible = true;
            return;
        }
        const docs = router.currentRoute.name === "read doc" ? state.docs.readDoc : state.docs.newDocs;
        const doc = docs[state.docs.DocProp.index];
        if (!doc) return;
        state.map.tileProviders.forEach((tileProvider, index) => {
            if (doc.map_animate.layerIndex === index) tileProvider.visible = true;
            else tileProvider.visible = false;
        });
    },
    HIDE_SIDEBAR(state) {
        setTimeout(() => (state.showSidebarNav = false), 600);
    },
    SHOW_SIDEBAR(state) {
        console.log("SHOW_SIDEBAR");
        state.showSidebarNav = true;
    },
};
