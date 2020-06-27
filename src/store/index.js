import Vue from "vue";
import Vuex from "vuex";
import {
    FeathersVuex
}
from "./feathers-client/feathers-client";
import auth from "./feathers-client/auth";
import state from "./state";
import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

Vue.use(Vuex);
Vue.use(FeathersVuex);

const requireModule = require.context(
    // The path where the service modules live
    "./feathers-client/services",
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
    getters,
    mutations,
    actions,
    plugins: [...servicePlugins, auth]
});