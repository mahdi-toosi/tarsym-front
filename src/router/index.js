import Vue from "vue";
import VueRouter from "vue-router";
// import App from "../App.vue";

Vue.use(VueRouter);

const routes = [
  // {
  //   path: "/",
  //   name: "App",
  //   component: App
  // },
  {
    path: "/home",
    name: "Home",
    component: () => import("../views/Home.vue")
  }, {
    path: "/signup",
    name: "Signup",
    component: () => import("../views/Signup.vue")
  }, {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue")
  }, {
    path: "/movingIcon",
    name: "moving Icon",
    component: () => import("../views/movingIcon.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;