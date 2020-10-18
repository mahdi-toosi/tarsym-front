import Vue from "vue";
import store from "../store/";

function beforeEach() {
    return async (to, from, next) => {
        if (to.matched.some((record) => record.meta.withoutAuth)) {
            // * scape authenticate
            next();
            return;
        } else if (checkForAuth(to.meta.minimumRole)) {
            // * check authenticate
            next();
            return;
        } else if (set_user_if_exist(to.meta.minimumRole)) {
            next();
            return;
        } else store.commit("LOGOUT");
    };
}
function afterEach() {
    return async (to) => {
        const RN = to.name; // * route name
        if (RN === "read doc") {
            await store.dispatch("read_this_doc");
            store.commit("CHANGE_MAP_LAYERS");
            return;
        } else if (RN === "create doc" || RN === "update doc") {
            if (store.state.newDocs.length) store.commit("UPDATE_DOC_INDEX");
            await store.dispatch("get_childs");
            store.commit("CHANGE_MAP_LAYERS");
            const _id = to.params._id;
            const invisibleDocs = store.state.DocProp.invisibleDocs || [];
            const indexOfDoc = invisibleDocs.indexOf(_id);
            if (indexOfDoc >= 0) invisibleDocs.splice(indexOfDoc, 1);
            store.dispatch("flyToThisDoc");
            return;
        } else store.commit("CHANGE_MAP_LAYERS", 0);
    };
}
export default {
    beforeEach,
    afterEach,
};

// * Helper Functions
function set_user_if_exist(minimumRole) {
    const userData = JSON.parse(localStorage.getItem("sjufNEbjDmE")); // sjufNEbjDmE = userData
    if (!userData) return false;
    const now = new Date().getTime();
    if (userData && userData.expire > now) {
        // * add user
        store.commit("SET_USER", userData.user);
        store.commit("SET_USER_ACCESS_TOKEN", userData.accessToken);
        // * validate user role for route
        if (minimumRole <= store.state.user.role) return true;
        else {
            // Vue.toasted.error("اکانت شما دسترسی لازم برای استفاده از این صفحه را نداشت   ...");
            return false;
        }
    }
    return false;
}

function checkForAuth(minimumRole) {
    // * validate user role for route if exist
    if (store.getters.isAuthenticated) {
        if (minimumRole <= store.state.user.role) return true;
        else {
            Vue.toasted.error("اکانت شما دسترسی لازم برای استفاده از این صفحه را نداشت  ...");
            return false;
        }
    }
    return false;
}
