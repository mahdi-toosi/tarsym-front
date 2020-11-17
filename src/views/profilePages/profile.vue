<template>
    <div class="profilePage">
        <header>
            <div class="profileData">
                <img src="@/assets/profileAvatar.png" />
                <span>
                    {{ profile.user.name }} <br />
                    {{ profile.user.username }}
                </span>
            </div>
            <a
                class="btn btn-blue"
                @click="addNewDoc()"
                v-if="profile.user.role >= 35"
            >
                نقطه ی جدید ایجاد کن
                <i class="fas fa-plus" />
            </a>
        </header>
        <section class="points">
            <span v-if="!profile.user._id" class="notingToShow">
                وجود ندارد
                {{ $router.currentRoute.params.username }} کاربری با نام کاربری
            </span>
            <span v-if="!profile.docs.data" class="notingToShow">
                داکیومنتی برای نمایش دادن نیست
            </span>
            <div
                class="point shadow"
                v-for="doc in profile.docs.data"
                :key="doc._id"
                @click="$router.push(`/read/${doc._id}`)"
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
                        <a href="#" v-text="doc.title"></a>
                    </div>
                    <time v-html="filterdate(doc.date)"></time>
                    <button
                        class="editDoc"
                        @click.stop="$router.push(`/update/${doc._id}`)"
                        v-if="profile.user._id === user._id"
                    >
                        <i class="far fa-edit"></i>
                    </button>
                    <button
                        @click.stop="Delete_this_Document(doc._id)"
                        class="deleteDoc"
                        v-if="profile.user._id === user._id"
                    >
                        <i class="far fa-trash-alt"></i>
                    </button>
                </header>
                <main v-text="doc.excerpt + ' ...'"></main>
                <footer>
                    <ul>
                        <li v-if="doc.imgsCount">
                            <i class="far fa-images" />
                            <span v-text="doc.imgsCount"></span>
                            تصویر
                        </li>
                    </ul>
                </footer>
            </div>
        </section>
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
            return this.$store.state.profilePage;
        },
    },
    methods: {
        ...mapActions([
            "getUserDocs",
            "addNewDoc",
            "Delete_this_Document",
            "searchData",
            "setUserProfileAndGet_id",
        ]),
        filterdate(val) {
            const day = String(val).slice(-2);
            const month = String(val).slice(-4, -2);
            const year = String(val).slice(0, -4);
            const yearIsNegetive = /[-]/.test(year);
            const currectYear = yearIsNegetive
                ? year.replace(/[-]/gi, "")
                : year;
            const JustYear = `سال ${year.replace(/[-]/gi, "")}${
                yearIsNegetive ? "<span>-</span>" : ""
            }<span> ه‍.ق</span>`;
            const FullDate = `${month}/${day}/${
                yearIsNegetive
                    ? "<span style='display: inline-block; direction: ltr;'>-" +
                      currectYear +
                      "</span>"
                    : currectYear
            }<span> ه‍.ق</span>`;
            return month == "00" ? JustYear : FullDate;
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
        const username = this.$router.currentRoute.params.username;
        const user_id = await this.setUserProfileAndGet_id(username);
        if (!user_id) return;
        this.getUserDocs(user_id);
        this.$store.state.map.zoom = 5;
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
            height: 22px;
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
</style>