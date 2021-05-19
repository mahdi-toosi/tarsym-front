<template>
    <div class="profilePage">
        <header>
            <div class="profileData">
                <img
                    :src="avatar || '/imgs/profileAvatar.png'"
                    :alt="avatar ? profile.user.name : 'عکس پروفایل'"
                    width="60"
                    height="60"
                />
                <span>
                    {{ profile.user.name }} <br />
                    {{ profile.user.username }}
                </span>
            </div>
            <button
                class="btn btn-blue"
                @click="addNewDoc()"
                v-if="profile.user.role >= 35"
            >
                نقطه ی جدید ایجاد کن
                <i class="mdi mdi-plus" />
            </button>
        </header>
        <section class="points">
            <span v-if="!profile.user._id" class="notingToShow">
                وجود ندارد
                {{ $router.currentRoute.params.username }} کاربری با نام کاربری
            </span>

            <Loading
                :data="profile.data"
                notingToShowText="داکیومنتی طراحی نکرده اید ..."
                type="list"
            />

            <router-link
                :to="`/read/${doc._id}`"
                class="point shadow"
                v-for="doc in profile.data"
                :key="doc._id"
            >
                <header>
                    <i
                        class="logo"
                        :class="`mdi mdi-${
                            doc.tools[0].iconName || 'map-marker'
                        }`"
                        :style="{
                            color: doc.tools[0].iconName
                                ? doc.tools[0].secondaryColor.hex8 ||
                                  doc.tools[0].secondaryColor
                                : '#277696',
                        }"
                        aria-hidden="true"
                    />
                    <div class="nameandsituation">
                        <h1 href="#" v-text="doc.title"></h1>
                        <time v-html="filterdate(doc.date)"></time>
                    </div>
                    <router-link
                        :to="`/update/${doc._id}`"
                        class="editDoc"
                        v-if="profile.user._id === user._id"
                        tag="button"
                        title="تغییر داکیومنت"
                    >
                        <i class="mdi mdi-pencil"></i>
                    </router-link>
                    <button
                        @click.stop.prevent="
                            Delete_this_Document({ doc, root: true })
                        "
                        class="deleteDoc"
                        v-if="profile.user._id === user._id"
                        title="حذف داکیومنت"
                    >
                        <i class="mdi mdi-delete-outline"></i>
                    </button>
                </header>
                <main v-text="doc.excerpt + ' ...'"></main>
                <footer>
                    <ul>
                        <li v-if="doc.desc_imgs.length">
                            <i class="mdi mdi-image-multiple-outline" />
                            <span v-text="doc.desc_imgs.length"></span>
                            تصویر
                        </li>
                    </ul>
                </footer>
            </router-link>
        </section>

        <button
            v-if="profile.data.length < profile.total"
            class="btn btn-blue loadMore"
            @click="fetch({ nextPage: true })"
        >
            بارگزاری بیشتر ...
        </button>
    </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
    name: "Profile",
    computed: {
        user() {
            return this.$store.state.user;
        },
        profile() {
            return this.$store.state.docs.profilePage;
        },
        avatar() {
            const avatar = this.profile.user.avatar;
            if (!avatar) return false;
            if (process.env.NODE_ENV === "production") return avatar;
            return process.env.VUE_APP_DOMAIN + avatar;
        },
    },
    methods: {
        ...mapActions("docs", [
            "getUserDocs",
            "addNewDoc",
            "Delete_this_Document",
        ]),

        filterdate(val) {
            return new Date(val).toLocaleDateString("fa-IR");
            // const day = String(val).slice(-2);
            // const month = String(val).slice(-4, -2);
            // const year = String(val).slice(0, -4);

            // const JustYear = `<span ${
            //     /[-]/.test(year) ? "class='negetiveYear'" : ""
            // }>${year.replace(/[-]/gi, "")}</span>`;

            // const FullDate = `<ul class="FullDate"><li>${JustYear}</li><li>${month}</li><li>${day}</li></ul>`;

            // const date = month === "00" ? JustYear : FullDate;
            // return date + `<span> ه‍.ق</span>`;
        },
        async fetch({ nextPage }) {
            const route = this.$router.currentRoute;

            if (route.name === "profile") await this.getUserDocs({ nextPage });
            else if (route.name === "user Docs with tag")
                await this.getUserDocs({
                    nextPage,
                    tag: route.params.name,
                });
            else if (route.name === "user Docs with category")
                await this.getUserDocs({
                    nextPage,
                    category: route.params.name,
                });

            if (this.$store.state.map.zoom > 5) this.$store.state.map.zoom = 5;
            this.$store.dispatch("change_map_layers", true); // mainMap = true
        },
    },
    beforeRouteEnter(to, from, next) {
        if (to.params.username === "forward") {
            next(async (vm) => {
                vm.$router.push(`/profile/${vm.user.username}`);
            });
            return;
        }
        next(async (vm) => {
            await vm.fetch({ nextPage: false });
        });
    },
    destroyed() {
        this.$store.commit("docs/FLUSH_DATA", { list: "profilePage" });
    },
};
</script>

<style lang="stylus">
.profilePage {
    direction: rtl;

    >header {
        display: flex;
        align-items: center;

        .btn {
            margin-right: auto;
        }

        .mdi {
            font-size: 28px !important;
            line-height: 20px !important;
        }
    }

    .profileData {
        display: flex;
        align-items: center;
        line-height: 24px;

        img {
            width: 60px;
            height: 60px;
            border-radius: 100%;
            margin-left: 6px;
        }
    }
}

@media only screen and (max-width: 950px) {
    .profilePage {
        .btn.btn-blue, .editDoc, .deleteDoc {
            display: none;
        }
    }
}
</style>