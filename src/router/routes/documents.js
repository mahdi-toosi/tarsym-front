const documentsRoutes = [
    {
        path: "/read/:_id",
        name: "read doc",
        component: () => import("@/views/R-Doc.vue"),
        meta: {
            minimumRole: 3,
        },
    },
    {
        path: "/search",
        name: "search",
        component: () => import("@/views/ListDocs.vue"),
        meta: {
            minimumRole: 3,
        },
    },
    {
        path: "/create/:_id",
        name: "create doc",
        component: () => import("@/views/CU-Doc.vue"),
        meta: {
            minimumRole: 35,
        },
    },
    {
        path: "/update/:_id",
        name: "update doc",
        component: () => import("@/views/CU-Doc.vue"),
        meta: {
            minimumRole: 35,
        },
    },
    {
        path: "/create",
        redirect: "/create/forward",
    },
];

export default documentsRoutes;
