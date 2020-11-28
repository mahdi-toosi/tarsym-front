<template>
    <div class="sidebarNavigation" ref="sidebarNav">
        <img src="@/assets/apple-touch-icon-120x120.png" @click="toggleNav()" />
        <div
            class="sidebar"
            :class="displayNav ? 'show' : ''"
            v-show="$store.state.showSidebarNav"
        >
            <div class="header">
                <div></div>
                <header>{{ user.name }} <br />{{ user.username }}</header>
            </div>
            <ul class="navigation_items">
                <router-link
                    :to="nav.addr"
                    v-for="(nav, index) in routes"
                    :key="index"
                    :class="nav.class"
                    tag="li"
                >
                    {{ nav.name }} <i :class="nav.icon"></i>
                </router-link>
                <li @click="$store.commit('LOGOUT')">
                    خروج
                    <i class="fas fa-sign-out-alt"></i>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            displayNav: false,
        };
    },
    computed: {
        user() {
            return this.$store.state.user;
        },
        routes() {
            const username = this.user.username;
            const routes = [
                {
                    name: "صفحه نخست",
                    addr: "/",
                    icon: "far fa-circle",
                    class: "home",
                },
                {
                    name: "پروفایل",
                    addr: `/profile/${username}`,
                    icon: "far fa-user",
                    class: "profile",
                },
                {
                    name: "تنظیمات حساب کاربری",
                    addr: `/profile/${username}/setting`,
                    icon: "fas fa-cogs",
                    class: "options",
                },
            ];
            return routes;
        },
    },
    methods: {
        showNav() {
            document.addEventListener("click", this.documentClick);
            this.displayNav = true;
        },
        hideNav() {
            document.removeEventListener("click", this.documentClick);
            this.displayNav = false;
        },
        toggleNav() {
            this.displayNav ? this.hideNav() : this.showNav();
        },
        documentClick(e) {
            var el = this.$refs.sidebarNav,
                target = e.target;
            if (el !== target && !el.contains(target)) {
                this.hideNav();
            }
        },
    },
    created() {
        if (this.user.username) this.$store.state.showSidebarNav = true;

        setTimeout(() => {
            const navMenu = document.querySelectorAll(".navigation_items li");
            navMenu.forEach((element) => {
                element.addEventListener("click", () => this.hideNav());
            });
        }, 2000);
    },
};
</script>