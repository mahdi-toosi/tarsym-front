import Vue from "vue";
import VueRouter from "vue-router";
import store from '../store/';

Vue.use(VueRouter);

const routes = [{
        path: "/",
        name: "all docs",
        component: () => import("../views/allDocs.vue"),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: "/authentication",
        name: "Authentication",
        component: () => import("../views/Auth.vue")
    },
    // {
    //   path: "/movingIcon",
    //   name: "moving Icon",
    //   component: () => import("../components/movingIcon.vue")
    // },
    {
        path: "/create/doc/:id",
        name: "create doc",
        component: () => import("../views/newDoc.vue"),
        meta: {
            requiresAuth: true,
        },
    }, {
        path: "/update/doc/:id",
        name: "update doc",
        component: () => import("../views/newDoc.vue"),
        meta: {
            requiresAuth: true,
        },
    }, {
        path: "/my-docs",
        name: "my docs",
        component: () => import("../views/allDocs.vue"),
        meta: {
            requiresAuth: true,
        },
    }, {
        path: "/read-point",
        name: "read point",
        component: () => import("../views/readDoc.vue"),
        meta: {
            requiresAuth: true,
        },
    }, {
        path: "*",
        name: "404 page",
        component: () => import("../views/notFound.vue")
    }
];

const router = new VueRouter({
    mode: "history",
    routes
});

router.beforeEach(async (to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (await store.getters.isAuthenticated) {
            next()
            return
        } else if (await set_user_if_exist()) {
            next()
            return
        }
        next('/authentication')
    }
    next()
});

router.afterEach(async (to) => {
    if (to.fullPath == "/create/doc/") {
        await router.push('/create/doc/forward')
        return
    }
    if (to.name == "create doc" || to.name == "update doc") {
        if (store.state.newDocs.length > 0) store.commit('UPDATE_NEW_DOC_INDEX');
    }
});

async function set_user_if_exist() {
    const userData = JSON.parse(localStorage.getItem('userData'))
    if (userData) {
        const now = new Date().getTime()
        if (userData.expire < now) {
            await store.commit('SET_USER', userData.user)
            await store.commit('SET_USER_ACCESS_TOKEN', userData.accessToken)
        }
        return true
    } else return false
}

export default router;