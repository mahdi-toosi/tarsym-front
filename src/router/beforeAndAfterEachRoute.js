import Vue from "vue";
import store from "../store/";
import NProgress from "nprogress";

function beforeEach() {
    return async (to, from, next) => {
        if (to.path) NProgress.start();

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
        } else if (await store.dispatch("set_user_if_exist", to.meta.minimumRole)) {
            if (to.name === "forward profile") {
                next(`/profile/${store.state.user.username}`);
                return;
            }
            next();
            return;
        } else {
            await store.dispatch("logout", to.fullPath);
        }
    };
}
function afterEach() {
    return async () => {
        NProgress.done();
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
            Vue.toasted.error("اکانت شما دسترسی لازم برای استفاده از این صفحه را ندارید  ...");
            return false;
        }
    }
    return false;
}
