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
            <ul class="menuItems">
                <li @click="$router.push('/'), hideNav()">صفحه نخست</li>
                <li
                    @click="
                        $router.push(`/profile/${user.username}`), hideNav()
                    "
                >
                    پروفایل
                </li>
                <li
                    @click="
                        $router.push(`/profile/${user.username}/categories`),
                            hideNav()
                    "
                >
                    دسته بندی ها
                </li>
                <li
                    @click="
                        $router.push(`/profile/${user.username}/users`),
                            hideNav()
                    "
                >
                    کاربران
                </li>
                <li @click="hideNav()">تنظیمات اکانت</li>
                <li @click="Logout()">خارج شدن</li>
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
    },
    methods: {
        Logout() {
            this.$store.commit("LOGOUT");
            this.hideNav();
            this.$router.push(`/Auth`);
        },
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
        }

        li:not(:last-child) {
            border-bottom: 1px solid darkgray;
        }
    }
}
</style>