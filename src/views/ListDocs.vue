<template>
    <div class="allpoints">
        <SearchField />
        <section class="points">
            <Loading
                :data="allDocs.data"
                type="list"
                notingToShowText="داکیومنتی برای نمایش دادن نیست"
            />

            <router-link
                :to="`/read/${doc._id}`"
                class="point shadow"
                v-for="doc in allDocs.data"
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
                        <!-- <a href="#" v-text="point.user.situation"></a> -->
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
            </router-link>
        </section>

        <button
            v-if="allDocs.data.length < allDocs.total"
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
    name: "ListDocs",
    computed: {
        allDocs() {
            return this.$store.state.docs.vitrineDocs;
        },
    },
    methods: {
        ...mapActions("docs", ["getAllDocs"]),
        filterdate(val) {
            return new Date(val).toLocaleDateString("fa-IR");
        },
        async fetch({ nextPage }) {
            if (this.$store.state.map.zoom > 5) this.$store.state.map.zoom = 5;
            const route = this.$router.currentRoute;

            if (route.name === "all docs") await this.getAllDocs({ nextPage });
            if (route.name === "list Docs with category")
                await this.getAllDocs({
                    category: route.params.name,
                    nextPage,
                });
            if (route.name === "list Docs with tag")
                await this.getAllDocs({ tag: route.params.name, nextPage });

            this.$store.dispatch("change_map_layers", true); // mainMap = true
        },
    },
    destroyed() {
        this.$store.commit("docs/FLUSH_DATA", { list: "vitrineDocs" });
    },
    beforeRouteEnter(to, from, next) {
        next(async (vm) => {
            await vm.fetch({ nextPage: false });
        });
    },
};
</script>