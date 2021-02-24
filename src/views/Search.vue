<template>
    <div class="allpoints">
        <SearchField />
        <section class="points">
            <span v-if="!searchedDocs.data.length" class="notingToShow">
                داکیومنتی برای نمایش دادن نیست
            </span>
            <a
                class="point shadow"
                v-for="doc in searchedDocs.data"
                :key="doc._id"
                :href="`https://tarsym.com/read/${doc._id}`"
                @click.prevent="$router.push(`/read/${doc._id}`)"
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
                        <!-- <a href="#" v-text="point.user.situation"></a> -->
                        <time v-html="filterdate(doc.date)"></time>
                    </div>
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
            </a>
        </section>
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
    },
    beforeRouteEnter(to, from, next) {
        next(async (vm) => {
            if (vm.$store.state.map.zoom > 5) vm.$store.state.map.zoom = 5;
            if (to.name === "search") await vm.searchData();
        });
    },
    components: { SearchField: () => import("@/components/searchField") },
};
</script>