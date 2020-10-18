<template>
    <div class="sidebarNavigation" ref="sidebarNav">
        <img
            src="/dist/img/icons/apple-touch-icon-120x120.png"
            @click="toggleNav()"
        />
        <div
            class="sidebar"
            :class="displayNav ? 'show' : ''"
            v-if="showSidebarNav"
        >
            <div class="header">
                <div></div>
                <header>{{ user.name }} <br />{{ user.username }}</header>
            </div>
            <ul class="navigation_items">
                <router-link
                    :to="nav.addr"
                    v-for="nav in routes"
                    :key="nav.addr"
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
            showSidebarNav: false,
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
                    role: 3,
                    class: "home",
                },
                {
                    name: "پروفایل",
                    addr: `/profile/${username}`,
                    icon: "far fa-user",
                    role: 3,
                    class: "profile",
                },
                {
                    name: "دسته بندی ها",
                    addr: `/profile/${username}/categories`,
                    icon: "fas fa-tags",
                    role: 48,
                    class: "categories",
                },
                {
                    name: "کاربران",
                    addr: `/profile/${username}/users`,
                    icon: "fas fa-users",
                    role: 48,
                    class: "users",
                },
                {
                    name: "پیام ها",
                    addr: `/profile/${username}/messages`,
                    icon: "far fa-envelope",
                    role: 3,
                    class: "messages",
                },
                // {
                //     name: "تنظیمات اکانت",
                //     addr: ``,
                //     icon: "fas fa-cogs",
                //     role: 3,
                //     class: "options",
                // },
            ];
            return routes.filter((route) => route.role <= this.user.role);
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
    mounted() {
        document.addEventListener("showSidebarNav", () => {
            this.showSidebarNav = true;
        });
        document.addEventListener("hideSidebarNav", () => {
            setTimeout(() => (this.showSidebarNav = false), 1400);
        });
        if (this.user.username) this.showSidebarNav = true;

        setTimeout(() => {
            const navMenu = document.querySelectorAll(".navigation_items li");
            navMenu.forEach((element) => {
                element.addEventListener("click", () => {
                    this.hideNav();
                });
            });
        }, 2000);
    },
};
</script>