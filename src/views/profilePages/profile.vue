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
                <i class="fas fa-plus" />
            </button>
        </header>
        <section class="points">
            <span v-if="!profile.user._id" class="notingToShow">
                وجود ندارد
                {{ $router.currentRoute.params.username }} کاربری با نام کاربری
            </span>
            <span v-if="!profile.data.length" class="notingToShow">
                داکیومنتی برای نمایش دادن نیست
            </span>
            <router-link
                :to="`/read/${doc._id}`"
                class="point shadow"
                v-for="doc in profile.data"
                :key="doc._id"
            >
                <header>
                    <i
                        class="logo"
                        :class="
                            doc.tools[0].iconName || 'fas fa-map-marker-alt'
                        "
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
                        <i class="far fa-edit"></i>
                    </router-link>
                    <button
                        @click.stop.prevent="
                            Delete_this_Document({ doc, root: true })
                        "
                        class="deleteDoc"
                        v-if="profile.user._id === user._id"
                        title="حذف داکیومنت"
                    >
                        <i class="far fa-trash-alt"></i>
                    </button>
                </header>
                <main v-text="doc.excerpt + ' ...'"></main>
                <footer>
                    <ul>
                        <li v-if="doc.desc_imgs.length">
                            <i class="far fa-images" />
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
            @click="getUserDocs({ nextPage: true })"
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
    },
    beforeRouteEnter(to, from, next) {
        if (to.params.username === "forward") {
            next(async (vm) => {
                vm.$router.push(`/profile/${vm.user.username}`);
            });
            return;
        }
        next();
    },
    // async beforeRouteUpdate(to, from, next) {
    // console.log("profile beforeRouteUpdate");
    // const username = this.$router.currentRoute.params.username;
    // const user_id = await this.setUserProfileAndGet_id(username);
    // console.log("user_id", user_id);
    // if (!user_id) return;
    // this.getUserDocs(user_id);
    // this.$store.state.map.zoom = 5;
    // next();
    // },
    async created() {
        await this.getUserDocs({ nextPage: false });
        if (this.$store.state.map.zoom > 5) this.$store.state.map.zoom = 5;
        this.$store.dispatch("change_map_layers", true); // mainMap = true
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