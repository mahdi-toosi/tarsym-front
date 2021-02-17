import Vue from "vue";
import store from "../store/";
import NProgress from "nprogress";

function beforeEach() {
    return async (to, from, next) => {
        if (to.path) {
            NProgress.start();
        }
        if (to.matched.some((record) => record.meta.withoutAuth)) {
            // * scape authenticate
            next();
            return;
        } else if (checkForAuth(to.meta.minimumRole)) {
            if (to.name === "forward profile") {
                next(`/profile/${store.state.user.username}`);
                return;
            }
            // * check authenticate
            next();
            return;
        } else if (store.dispatch("set_user_if_exist", to.meta.minimumRole)) {
            if (to.name === "forward profile") {
                next(`/profile/${store.state.user.username}`);
                return;
            }
            next();
            return;
        } else store.dispatch("logout", to.path);
    };
}
function afterEach() {
    return async (to) => {
        NProgress.done();
        const RN = to.name; // * route name
        if (RN === "read doc") {
            await store.dispatch("docs/read_this_doc");

            if (store.state.docs.readDoc.length) store.commit("docs/UPDATE_DOC_INDEX");

            store.dispatch("change_map_layers");
            return;
        } else if (RN === "create doc" || RN === "update doc") {
            if (store.state.docs.newDocs.length) store.commit("docs/UPDATE_DOC_INDEX");
            // * show document items if invisible
            const _id = to.params._id;
            const invisibleDocs = store.state.docs.DocProp.invisibleDocs || [];
            const indexOfDoc = invisibleDocs.indexOf(_id);
            if (indexOfDoc > -1) invisibleDocs.splice(indexOfDoc, 1);

            // * flyToThisDoc
            setTimeout(() => {
                store.dispatch("change_map_layers");
                store.dispatch("docs/flyToThisDoc");
            }, 300);
            return;
        } else store.dispatch("change_map_layers", true); // mainMap = true
    };
}
export default {
    beforeEach,
    afterEach,
};

// * Helper Functions

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
