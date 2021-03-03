<template>
    <div id="app">
        <Sidebar-navigation />
        <Sidebar id="content" />
        <Tarsym-map v-show="showMapInMobile" />
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
    computed: {
        showMapInMobile() {
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
    },
    created() {
        document.addEventListener("PWAupdatefound", () => {
            let msg = "آپدیتی برای اپلیکیشن ارائه شد. در حال دانلود ...";
            this.$toasted.info(msg, {
                icon: "fa-code",
            });
        });
        document.addEventListener("PWAupdated", () => {
            let msg = "آپدیت به پایان رسید ، نیاز به رفرش کردن صفحه است ...";
            this.$toasted.info(msg, {
                duration: 10 * 1000,
                icon: "fa-info-circle",
            });
        });
        document.addEventListener("PWAoffline", () => {
            let msg = "مشکل در ارتباط با سرور، اینترنت خود را بررسی کنید ...";
            this.$toasted.error(msg);
        });
    },
};
</script>

<style lang="stylus">
@import './assets/styles/main.styl';

.toasted-primary {
    border-radius: 5px !important;
    box-shadow: 0px 0px 16px 0px rgba(5, 108, 158, 0.52) !important;
}
</style>
