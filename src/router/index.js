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
        path: "/Auth",
        name: "Authentication",
        component: () => import("../views/Auth.vue")
    },
    // {
    //   path: "/movingIcon",
    //   name: "moving Icon",
    //   component: () => import("../components/movingIcon.vue")
    // },
    {
        path: "/create/:_id",
        name: "create doc",
        component: () => import("../views/CU-Doc.vue"),
        meta: {
            requiresAuth: true,
        },
    }, {
        path: "/update/:_id",
        name: "update doc",
        component: () => import("../views/CU-Doc.vue"),
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
        path: "/read/:_id",
        name: "read doc",
        component: () => import("../views/R-Doc.vue"),
        meta: {
            requiresAuth: true,
        },
    }, {
        path: "*",
        name: "404 page",
        component: () => import("../views/404.vue")
    }
];

const router = new VueRouter({
    mode: "history",
    routes
});

router.beforeEach(async (to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (store.getters.isAuthenticated) {
            next()
            return
        } else if (set_user_if_exist()) {
            next()
            return
        }
        next('/Auth')
    }
    if (to.fullPath == "/create" || to.fullPath == "/create/") {
        await router.push('/create/forward')
        return
    }
    next()
});

router.afterEach(async (to) => {
    if (to.name == "create doc" || to.name == "update doc" || to.name == "read doc") {
        if (store.state.newDocs.length) store.commit('UPDATE_DOC_INDEX');
    }
});

function set_user_if_exist() {
    const userInLocalStorage = localStorage.getItem('sjufNEbjDmE') // sjufNEbjDmE = userData
    if (!userInLocalStorage) return false
    const decrypt = atob(userInLocalStorage)
    const userData = JSON.parse(decrypt)
    if (userData) {
        const now = new Date().getTime()
        if (userData.expire > now) {
            store.commit('SET_USER', userData.user)
            store.commit('SET_USER_ACCESS_TOKEN', userData.accessToken)
            return true
        }
    }
    return false
}

export default router;