<template>
    <div
        style="
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
        "
    >
        <h1>404</h1>
        <router-link to="/" class="btn btn-blue">
            صفحه اصلی
            <i class="mdi mdi-home" aria-hidden="true"></i>
        </router-link>
    </div>
</template>

<script>
export default {
    name: "404Page",
    metaInfo() {
        return {
            title: `ترسیم - 404`,
            meta: [{ name: "robots", content: "noindex, nofollow" }],
        };
    },
};
</script>
