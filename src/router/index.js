import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/";

Vue.use(VueRouter);
// * USERS ROLES
// *  admin: 48,
// *  drawer: 35,
// *  user: 3,
// *  suspension: 1

const routes = [{
    path: "/",
    name: "all docs",
    component: () => import("../views/ListDocs.vue"),
    meta: {
        minimumRole: 3
    }
}, {
    // ! should delete
    path: "/my-docs",
    name: "my docs",
    component: () => import("../views/ListDocs.vue")
}, {
    path: "/read/:_id",
    name: "read doc",
    component: () => import("../views/R-Doc.vue"),
    meta: {
        minimumRole: 3
    }
}, {
    path: "/search",
    name: "search",
    component: () => import("../views/ListDocs.vue"),
    meta: {
        minimumRole: 3
    }
}, {
    path: "/Auth",
    name: "Authentication",
    component: () => import("../views/Auth.vue"),
    meta: {
        withoutAuth: true
    }
}, {
    path: "/profile/:email",
    component: () => import("../views/profilePages/root.vue"),
    meta: {
        minimumRole: 3
    },
    children: [{
        path: '',
        component: () => import("../views/profilePages/profile.vue"),
        meta: {
            minimumRole: 3
        }
    }, {
        path: 'categories',
        component: () => import("../views/profilePages/categories.vue"),
        meta: {
            minimumRole: 48
        }
    }]
}, {
    path: "/create/:_id",
    name: "create doc",
    component: () => import("../views/CU-Doc.vue"),
    meta: {
        minimumRole: 35
    }
}, {
    path: "/update/:_id",
    name: "update doc",
    component: () => import("../views/CU-Doc.vue"),
    meta: {
        minimumRole: 35
    }
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
    } else if (checkForAuth(to.meta.minimumRole)) { // * check authenticate
        next();
        return;
    } else if (set_user_if_exist(to.meta.minimumRole)) {
        next();
        return;
    }
    store.commit('LOGOOUT')
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

function set_user_if_exist(minimumRole) {
    const userInLocalStorage = localStorage.getItem("sjufNEbjDmE"); // sjufNEbjDmE = userData
    if (!userInLocalStorage) return false;
    const decrypt = atob(userInLocalStorage);
    const userData = JSON.parse(decrypt);
    if (userData) {
        const now = new Date().getTime();
        if (userData.expire > now) {
            store.commit("SET_USER", userData.user);
            store.commit("SET_USER_ACCESS_TOKEN", userData.accessToken);
            if (minimumRole >= store.state.user.role)
                return true;
            else {
                console.log('Vue => ', Vue);
                Vue.toasted('اکانت شما دسترسی لازم برای استفاده از این صفحه را نداشت   ...')
                return false
            }
        }
    }
    return false;
}

function checkForAuth(minimumRole) {
    if (store.getters.isAuthenticated) {
        if (minimumRole >= store.state.user.role)
            return true
        else {
            Vue.toasted('اکانت شما دسترسی لازم برای استفاده از این صفحه را نداشت  ...')
            return false
        }
    }
    return false
}

export default router;