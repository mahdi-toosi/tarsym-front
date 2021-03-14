import Vue from "vue";
import VueRouter from "vue-router";
import VueMeta from "vue-meta";

import Helpers from "./beforeAndAfterEachRoute";

import AuthRoutes from "./routes/Auth";
import documentsRoutes from "./routes/documents";

Vue.use(VueRouter);
Vue.use(VueMeta);

const routes = [
    {
        path: "/",
        name: "all docs",
        component: () => import("@/views/ListDocs.vue"),
        meta: {
            withoutAuth: true,
        },
    },
    ...documentsRoutes,
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
    scrollBehavior() {
        return { x: 0, y: 0, behavior: "smooth" };
    },
});

router.beforeEach(Helpers.beforeEach());
router.afterEach(Helpers.afterEach());

export default router;
