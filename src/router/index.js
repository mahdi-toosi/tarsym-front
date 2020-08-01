import Vue from "vue";
import VueRouter from "vue-router";
import store from '../store/';

// import App from "../App.vue";

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
    base: process.env.BASE_URL,
    routes
});

router.beforeEach(async (to, from, next) => {
    const userData = JSON.parse(localStorage.getItem('userData'))
    if (userData) {
        const now = new Date().getTime()
        console.log(userData.expire, now, userData.expire < now);
        if (userData.expire < now) {
            store.commit('auth/setAccessToken', userData.accessToken)
            store.commit('users/addItem', userData.user)
            store.commit('auth/setUser', userData.user)
        }
    }
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (store.getters['auth/isAuthenticated']) {
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

export default router;