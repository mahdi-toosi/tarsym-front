const documentsRoutes = [
    {
        path: "/read/:_id",
        name: "read doc",
        component: () => import("@/views/R-Doc.vue"),
        meta: {
            withoutAuth: true,
        },
    },
    {
        path: "/tag/:name",
        name: "list Docs with tag",
        component: () => import("@/views/ListDocs.vue"),
        meta: {
            withoutAuth: true,
        },
    },
    {
        path: "/category/:name",
        name: "list Docs with category",
        component: () => import("@/views/ListDocs.vue"),
        meta: {
            withoutAuth: true,
        },
    },
    {
        path: "/search",
        name: "search",
        component: () => import("@/views/Search.vue"),
        meta: {
            withoutAuth: true,
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
