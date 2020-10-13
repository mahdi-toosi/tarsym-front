const profileRoutes = [
    {
        path: "/profile/:username",
        component: () => import("@/views/profilePages/root.vue"),
        meta: {
            minimumRole: 3,
        },
        children: [
            {
                path: "",
                component: () => import("@/views/profilePages/profile.vue"),
                name: "profile",
                meta: {
                    minimumRole: 3,
                },
            },
            {
                // ! admin page
                path: "categories",
                component: () => import("@/views/profilePages/categories.vue"),
                meta: {
                    minimumRole: 48,
                },
            },
            {
                // ! admin page
                path: "users",
                component: () => import("@/views/profilePages/users.vue"),
                meta: {
                    minimumRole: 48,
                },
            },
            {
                path: "change-password",
                component: () => import("@/views/profilePages/changePassword.vue"),
                meta: {
                    minimumRole: 3,
                },
            },
        ],
    },
    {
        path: "/profile",
        redirect: "/profile/forward",
        meta: {
            minimumRole: 3,
        },
    },
];

export default profileRoutes;
