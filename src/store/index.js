import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

import getters from "./getters";
import actions from "./actions";
import mutations from "./mutations";

import map from "./map/";
import docs from "./docs/";
import auth from "./auth/";

export default new Vuex.Store({
    state: {
        searchPolygon: {
            coordinates: [],
            color: "#23A9AEFF",
            secondaryColor: "#23A9AEFF",
            isOn: false,
        },
        showSidebarNav: false,
    },
    getters,
    mutations,
    actions,
    modules: { map, docs, auth },
});
