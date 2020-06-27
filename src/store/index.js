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
    getters: {
        newDocLayer: state => {
            return state.newDocs[state.newDocProp.index]
        },
        lastAddedDocID: state => {
            const Docs = state.newDocs
            if (Docs.length > 0) {
                return Docs[Docs.length - 1].id
            }
            return 0
        },
        newDocChilds: (state, getters) => {
            const childsID = getters.newDocLayer.childs_id
            const childs = []
            const Docs = state.newDocs
            childsID.forEach(id => {
                const thisObject = (obj) => obj.id == id
                const index = Docs.findIndex(thisObject);
                childs.push(Docs[index])
            });
            return childs
        },
        chosenTags: (state, getters) => {
            const thisDoc = getters.newDocLayer
            return thisDoc.tags
        }
    },
    mutations,
    actions,
    plugins: [...servicePlugins, auth]
});