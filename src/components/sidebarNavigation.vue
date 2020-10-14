<template>
    <div class="sidebarNavigation" ref="sidebarNav">
        <img
            src="/img/icons/apple-touch-icon-120x120.png"
            @click="toggleNav()"
        />
        <div
            class="sidebar"
            :class="displayNav ? 'show' : ''"
            v-if="showSidebarNav"
        >
            <div class="header">
                <div></div>
                <header>mahdi toosi</header>
            </div>
            <ul class="navigation_items">
                <router-link
                    :to="nav.addr"
                    v-for="nav in routes"
                    :key="nav.addr"
                    tag="li"
                >
                    {{ nav.name }} <i :class="nav.icon"></i>
                </router-link>
                <li @click="$store.commit('LOGOUT')">
                    خارج شدن
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
            const routes = [
                {
                    name: "صفحه نخست",
                    addr: "/",
                    icon: "far fa-circle",
                    role: 3,
                },
                {
                    name: "پروفایل",
                    addr: `/profile/${this.user.username}`,
                    icon: "far fa-user",
                    role: 3,
                },
                {
                    name: "دسته بندی ها",
                    addr: `/profile/${this.user.username}/categories`,
                    icon: "fas fa-tags",
                    role: 48,
                },
                {
                    name: "کاربران",
                    addr: `/profile/${this.user.username}/users`,
                    icon: "fas fa-users",
                    role: 48,
                },
                {
                    name: "پیام ها",
                    addr: `/profile/${this.user.username}/messages`,
                    icon: "far fa-envelope",
                    role: 3,
                },
                {
                    name: "تنظیمات اکانت",
                    addr: ``,
                    icon: "fas fa-cogs",
                    role: 3,
                },
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

<style  lang="stylus">
.sidebarNavigation {
    position: fixed;
    top: 20px;
    left: 20px;
    user-select: none;
    z-index: 999;

    img {
        border-radius: 50%;
        width: 50px;
        height: 50px;
        position: relative;
        z-index: 999;
        cursor: pointer;
    }

    .sidebar {
        max-width: 400px;
        background: white;
        margin-top: -55px;
        border-radius: 25px 12px 12px 12px;
        font-size: 15px;
        text-align: center;
        padding: 0px;
        transition: all 0.5s ease-in-out;
        clip-path: circle(100% at -65% -60%);
        max-height: 0;

        &.show {
            max-height: 100%;
            padding: 5px;
            clip-path: circle(100%);
            box-shadow: #00000091 2px 2px 8px -3px;
        }

        .header {
            display: flex;
            align-items: center;

            div {
                width: 50px;
                height: 50px;
            }

            header {
                padding: 10px;
            }
        }

        ul {
            padding: 0px 10px;
        }

        li {
            cursor: pointer;
            list-style: none;
            padding: 10px 0;
            text-align: right;
        }

        li:not(:last-child) {
            border-bottom: 1px solid darkgray;
        }
    }
}
</style>