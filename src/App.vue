<template>
    <div id="app">
        <Sidebar-navigation />
        <Sidebar id="content" />
        <Tarsym-map v-if="showMapInMobile" />
    </div>
</template>
<script>
import TarsymMap from "@/components/map";
import Sidebar from "@/components/sidebar";
import SidebarNavigation from "@/components/sidebarNavigation";

export default {
    name: "app",
    metaInfo() {
        return {
            title: process.env.VUE_APP_TITLE,
            meta: [
                {
                    name: "description",
                    content: this.DocLayer?.title,
                },
                { property: "og:url", content: "https://tarsym.com" },
                { name: "robots", content: "index, follow" },
            ],
        };
    },
    data() {
        return {
            triggerShowMapInMobile: 0,
        };
    },
    computed: {
        showMapInMobile() {
            this.triggerShowMapInMobile;
            const needMapPages = [
                "profile",
                "all docs",
                "list Docs with tag",
                "list Docs with category",
                "read doc",
                "search",
            ];
            if (
                window.innerWidth >= 950 ||
                needMapPages.includes(this.$route.name)
            )
                return true;
            else return false;
        },
    },
    components: {
        TarsymMap,
        Sidebar,
        SidebarNavigation,
    },
    async mounted() {
        await this.$store.dispatch("set_user_if_exist", 3);
        this.includeRaychat();
    },
    created() {
        document.addEventListener("PWAoffline", () => {
            let msg = "مشکل در ارتباط با سرور، اینترنت خود را بررسی کنید ...";
            this.$toasted.error(msg);
        });
        window.addEventListener("resize", () => {
            ++this.triggerShowMapInMobile;
        });
    },
    methods: {
        includeRaychat() {
            var e = document,
                a = window,
                o = "c007f731-c6dd-4eae-b814-5d52e20f64d3";

            function t() {
                var t = document.createElement("script");
                (t.type = "text/javascript"),
                    (t.async = !0),
                    localStorage.getItem("rayToken")
                        ? (t.src =
                              "https://app.raychat.io/scripts/js/" +
                              o +
                              "?rid=" +
                              localStorage.getItem("rayToken") +
                              "&href=" +
                              window.location.href)
                        : (t.src =
                              "https://app.raychat.io/scripts/js/" +
                              o +
                              "?href=" +
                              window.location.href);
                var e = document.getElementsByTagName("script")[0];
                e.parentNode.insertBefore(t, e);
            }
            "complete" == e.readyState
                ? t()
                : a.attachEvent
                ? a.attachEvent("onload", t)
                : a.addEventListener("load", t, !1);
        },
    },
};
</script>

<style lang="stylus">
@import './assets/styles/main.styl';
@import './assets/styles/libs/fontIcon.styl';

.toasted-primary {
    border-radius: 5px !important;
    box-shadow: 0px 0px 16px 0px rgba(5, 108, 158, 0.52) !important;
}
</style>
