<template>
    <div class="allpoints">
        <SearchField />
        <section class="points">
            <Loading
                :data="searchedDocs.data"
                notingToShowText="داکیومنتی برای نمایش دادن نیست"
                type="list"
            />

            <router-link
                :to="`/read/${doc._id}`"
                class="point shadow"
                v-for="doc in searchedDocs.data"
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
                        <!-- <a href="#" v-text="point.user.situation"></a> -->
                        <time v-html="filterdate(doc.date)"></time>
                    </div>
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
            v-if="searchedDocs.data.length < searchedDocs.total"
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
    name: "SearchedDocs",
    computed: {
        searchedDocs() {
            return this.$store.state.docs.searchedDocs;
        },
    },
    methods: {
        ...mapActions("docs", ["searchData"]),
        filterdate(val) {
            return new Date(val).toLocaleDateString("fa-IR");
        },
        async fetch({ nextPage }) {
            if (this.$store.state.map.zoom > 5) this.$store.state.map.zoom = 5;
            await this.searchData({ nextPage });
            this.$store.dispatch("change_map_layers", true); // mainMap = true
        },
    },
    destroyed() {
        this.$store.commit("docs/FLUSH_DATA", { list: "searchedDocs" });
    },
    beforeRouteEnter(to, from, next) {
        next(async (vm) => {
            await vm.fetch({ nextPage: false });
        });
    },
};
</script>