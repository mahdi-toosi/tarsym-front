<template>
    <div class="sidebarNavigation" ref="sidebarNav">
        <img
            src="@/assets/apple-touch-icon-120x120.png"
            @click="toggleNav()"
            alt=" لوگو ترسیم"
        />
        <div class="sidebar" :class="displayNav ? 'show' : ''">
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
                <li @click="$store.dispatch('logout')" v-if="user.role">
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
            const user = this.user;
            const routes = [
                {
                    name: "صفحه نخست",
                    addr: "/",
                    icon: "far fa-circle",
                    class: "home",
                    show: true,
                },
                {
                    name: "پروفایل",
                    addr: `/profile/${user.username}`,
                    icon: "far fa-user",
                    class: "profile",
                    show: user.username,
                },
                {
                    name: "تنظیمات حساب کاربری",
                    addr: `/profile/${user.username}/setting`,
                    icon: "fas fa-cogs",
                    class: "options",
                    show: user.username,
                },
                {
                    name: "ورود",
                    addr: `/auth`,
                    icon: "fas fa-sign-in-alt",
                    class: "login",
                    show: !user.username,
                },
            ];
            return routes.filter((route) => route.show);
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
            if (
                !el ||
                target.className ===
                    "router-link-exact-active router-link-active options" ||
                (el !== target && !el.contains(target))
            ) {
                this.hideNav();
            }
        },
    },
    created() {
        setTimeout(() => {
            const navMenu = document.querySelectorAll(".navigation_items li");
            navMenu.forEach((element) => {
                element.addEventListener("click", () => this.hideNav());
            });
        }, 2000);
    },
};
</script>