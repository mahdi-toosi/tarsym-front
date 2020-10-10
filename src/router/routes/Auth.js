const AuthRoutes = [{
    path: "/Auth",
    name: "Authentication",
    component: () => import("@/views/Auth/root.vue"),
    meta: {
        withoutAuth: true
    },
    children: [{
        path: '',
        component: () => import("@/views/Auth/login.vue"),
    }, {
        path: 'signup',
        component: () => import("@/views/Auth/signup.vue"),
    }, {
        path: 'verify-mobile',
        component: () => import("@/views/Auth/verifyMobile.vue"),
    }, {
        path: 'reset-password',
        component: () => import("@/views/Auth/resetPassword.vue"),
    }]
}]


export default AuthRoutes