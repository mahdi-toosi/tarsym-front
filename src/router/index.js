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
    {
        path: "/signup",
        name: "Signup",
        component: () => import("../components/just save/Signup.vue")
    },
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
        name: "all points",
        component: () => import("../views/allDocs.vue")
    }, {
        path: "/create-point/:id",
        name: "create point with prop",
        component: () => import("../views/newDoc.vue")
    }, {
        path: "/create-point",
        name: "create point",
        component: () => import("../views/newDoc.vue")
    }, {
        path: "/read-point",
        name: "read point",
        component: () => import("../views/readDoc.vue")
    }
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});
router.afterEach((to) => {
    if (to.fullPath.split('/')[1] == "create-point") {
        if (store.state.newDocs.length > 0) {
            store.commit('UPDATE_NEW_DOC_INDEX');
        }
    }
})

export default router;