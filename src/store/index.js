import Vue from "vue";
import Vuex from "vuex";
import {
    FeathersVuex
} from "../feathers-client";
import auth from "./auth";
import state from "./state";
import actions from "./actions";
import mutations from "./mutations";

Vue.use(Vuex);
Vue.use(FeathersVuex);

const requireModule = require.context(
    // The path where the service modules live
    "./services",
    // Whether to look in subfolders
    false,
    // Only include .js files (prevents duplicate imports`)
    /.js$/
);
const servicePlugins = requireModule
    .keys()
    .map(modulePath => requireModule(modulePath).default);

export default new Vuex.Store({
    state,
    getters: {
        newPointTitle: state => {
            return state.newPoint.title;
        },
        newPointDescription: state => {
            return state.newPoint.description;
        }
    },
    mutations,
    actions,
    plugins: [...servicePlugins, auth]
});