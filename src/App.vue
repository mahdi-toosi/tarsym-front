<template>
    <div id="app">
        <Tarsym-map />
        <Sidebar />
        <Sidebar-navigation />
        <Send-msg />
    </div>
</template>
<script>
import TarsymMap from "@/components/map";
import Sidebar from "@/components/sidebar";
import SidebarNavigation from "@/components/sidebarNavigation";
import SendMsg from "@/components/sendMessage";

export default {
    name: "app",
    components: {
        TarsymMap,
        Sidebar,
        SidebarNavigation,
        SendMsg,
    },
    async mounted() {},
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
