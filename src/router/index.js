import Vue from "vue";
import VueRouter from "vue-router";

import Helpers from "./beforeAndAfterEachRoute";

import AuthRoutes from "./routes/Auth";
import documentsRoutes from "./routes/documents";

Vue.use(VueRouter);

// * USERS ROLES
// *  admin: 48,
// *  drawer: 35,
// *  user: 3,
// *  suspension: 1

const routes = [
    {
        path: "/",
        name: "all docs",
        component: () => import("@/views/ListDocs.vue"),
        meta: {
            minimumRole: 3,
        },
    },
    ...documentsRoutes,
    {
        path: "/profile/:username",
        component: () => import("@/views/profilePages/profile.vue"),
        name: "profile",
        meta: {
            minimumRole: 3,
        },
    },
    {
        path: "/profile",
        name: "forward profile",
        meta: {
            minimumRole: 3,
        },
    },
    {
        path: "/profile/:username/setting",
        component: () => import("@/views/profilePages/setting.vue"),
        name: "profile setting",
        meta: {
            minimumRole: 3,
        },
    },
    ...AuthRoutes,
    {
        path: "*",
        name: "404 page",
        component: () => import("@/views/404.vue"),
        meta: {
            withoutAuth: true,
        },
    },
];

const router = new VueRouter({
    mode: "history",
    routes,
});

router.beforeEach(Helpers.beforeEach());
router.afterEach(Helpers.afterEach());

export default router;
