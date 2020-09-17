import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/";

Vue.use(VueRouter);

const routes = [{
    path: "/",
    name: "all docs",
    component: () => import("../views/ListDocs.vue")
}, {
    path: "/read/:_id",
    name: "read doc",
    component: () => import("../views/R-Doc.vue")
}, {
    path: "/search",
    name: "search",
    component: () => import("../views/ListDocs.vue")
}, {
    path: "/Auth",
    name: "Authentication",
    component: () => import("../views/Auth.vue"),
    meta: {
        withoutAuth: true
    }
}, {
    path: "/profile/:email",
    name: "profile",
    component: () => import("../views/profile.vue")
}, {
    path: "/create/:_id",
    name: "create doc",
    component: () => import("../views/CU-Doc.vue")
}, {
    path: "/update/:_id",
    name: "update doc",
    component: () => import("../views/CU-Doc.vue")
}, {
    path: "/create",
    redirect: "/create/forward"
}, {
    path: "*",
    name: "404 page",
    component: () => import("../views/404.vue"),
    meta: {
        withoutAuth: true
    }
}];

const router = new VueRouter({
    mode: "history",
    routes
});

router.beforeEach(async (to, from, next) => {
    if (to.matched.some(record => record.meta.withoutAuth)) { // * scape authenticate
        next();
        return
    } else if (store.getters.isAuthenticated) { // * check authenticate
        next();
        return;
    } else if (set_user_if_exist()) {
        next();
        return;
    }
    next("/Auth");

});

router.afterEach(async to => {
    if (["create doc", "update doc"].includes(to.name)) {
        if (store.state.newDocs.length) store.commit("UPDATE_DOC_INDEX");
        await store.dispatch("get_childs");
        store.commit("CHANGE_MAP_LAYERS");
        store.dispatch("flyToThisDoc");
    }
    if (to.name == "read doc") {
        await store.dispatch("read_this_doc");
        store.commit("CHANGE_MAP_LAYERS");
    }
    if (["my docs", "all docs"].includes(to.name)) {
        store.commit("CHANGE_MAP_LAYERS", 0);
    }
});

function set_user_if_exist() {
    const userInLocalStorage = localStorage.getItem("sjufNEbjDmE"); // sjufNEbjDmE = userData
    if (!userInLocalStorage) return false;
    const decrypt = atob(userInLocalStorage);
    const userData = JSON.parse(decrypt);
    if (userData) {
        const now = new Date().getTime();
        if (userData.expire > now) {
            store.commit("SET_USER", userData.user);
            store.commit("SET_USER_ACCESS_TOKEN", userData.accessToken);
            return true;
        }
    }
    return false;
}

export default router;