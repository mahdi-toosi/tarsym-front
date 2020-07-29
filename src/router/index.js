import Vue from "vue";
import VueRouter from "vue-router";
import store from '../store/';

// import App from "../App.vue";

Vue.use(VueRouter);

const routes = [
    // {
    //   path: "/",
    //   name: "App",
    //   component: App
    // },
    // {
    //     path: "/signup",
    //     name: "Signup",
    //     component: () => import("../components/just save/Signup.vue")
    // },
    // {
    //   path: "/login",
    //   name: "Login",
    //   component: () => import("../components/just save/Login.vue")
    // },
    // {
    //   path: "/movingIcon",
    //   name: "moving Icon",
    //   component: () => import("../components/movingIcon.vue")
    // },
    {
        path: "/",
        name: "all docs",
        component: () => import("../views/allDocs.vue")
    }, {
        path: "/create/doc/:id",
        name: "create doc",
        component: () => import("../views/newDoc.vue")
    }, {
        path: "/update/doc/:id",
        name: "update doc",
        component: () => import("../views/newDoc.vue")
    }, {
        path: "/my-docs",
        name: "my docs",
        component: () => import("../views/allDocs.vue")
    }, {
        path: "/read-point",
        name: "read point",
        component: () => import("../views/readDoc.vue")
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
router.afterEach(async (to) => {
    if (to.fullPath == "/create/doc/") {
        await router.push('/create/doc/forward')
        return
    }
    if (to.name == "create doc" || to.name == "update doc") {
        if (store.state.newDocs.length > 0) store.commit('UPDATE_NEW_DOC_INDEX');
    }
})

export default router;