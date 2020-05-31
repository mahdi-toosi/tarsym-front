import Vue from "vue";
import Vuex from "vuex";
import {
    FeathersVuex
} from "../feathers-client";
import auth from "./auth";
import * as actions from "./actions";
import * as mutations from "./mutations";

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
    state: {
        newPoint: {
            title: null,
            description: null,
            coordinates: {
                lat: null,
                lng: null
            },
            tooltip: "ثبت مختصات",
            draggable: true
        },
        zoom: 13,
        MouseCoordinate: null,
        category: null,
        categories: [],
        allPoints: [],
        mapCenter: {
            lat: 36.21193841525171,
            lng: 57.680192944186096
        },
        readPoint: null,
        situations: {
            allPoints: false,
            readPoint: false,
            newPoint: false,
            loading: true,
            thereIsNoPoint: false
        },
        User: null
    },
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