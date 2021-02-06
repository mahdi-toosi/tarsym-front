<template>
    <div class="allpoints">
        <search-field />
        <section class="points">
            <span v-if="!allDocs.data.length" class="notingToShow"
                >داکیومنتی برای نمایش دادن نیست</span
            >
            <div
                class="point shadow"
                v-for="doc in allDocs.data"
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
                        <!-- <a href="#" v-text="point.user.situation"></a> -->
                    </div>
                    <time v-html="filterdate(doc.date)"></time>
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
            </div>
        </section>
    </div>
</template>

<script>
import searchField from "@/components/searchField";
import { mapActions } from "vuex";

export default {
    name: "ListDocs",
    computed: {
        allDocs() {
            return this.$store.state.docs.vitrineDocs;
        },
    },
    methods: {
        ...mapActions("docs", ["getAllDocs", "searchData"]),
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
        next(async (vm) => {
            if (vm.$store.state.map.zoom > 5) vm.$store.state.map.zoom = 5;
            if (to.name === "all docs") await vm.getAllDocs();
            if (to.name === "list Docs with category")
                await vm.getAllDocs({ category: to.params.name });
            if (to.name === "list Docs with tag")
                await vm.getAllDocs({ tag: to.params.name });
        });
    },
    components: { searchField },
};
</script>