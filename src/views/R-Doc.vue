<template>
    <div class="ReadDoc_wrapper">
        <header>
            <button
                class="btn btn-back"
                style="position: relative"
                @click="hasHistory() ? $router.go(-1) : $router.push('/')"
            >
                <i class="fas fa-arrow-left"></i>
            </button>
        </header>
        <article class="point readPoint" v-if="DocLayer">
            <header>
                <h1 v-text="DocLayer.title"></h1>
                <div>
                    <h4>
                        <i class="fas fa-tags"></i>
                        <span
                            v-for="(cat, index) in DocLayer.categories"
                            :key="index"
                            v-text="cat"
                            @click="$router.push(`/category/${cat}`)"
                        ></span>
                    </h4>
                    <time v-html="filterdate(DocLayer.date)"></time>
                </div>
            </header>
            <main v-html="DocLayer.description"></main>
            <footer>
                <ul class="tags">
                    <li
                        v-for="(tag, index) in DocLayer.tags"
                        :key="index"
                        @click="$router.push(`/tag/${tag}`)"
                    >
                        <i class="fas fa-hashtag"></i> {{ tag }}
                    </li>
                </ul>
            </footer>
        </article>
    </div>
</template>

<script>
export default {
    name: "readDocument",
    data() {
        return {};
    },
    computed: {
        DocLayer() {
            return this.$store.getters.DocLayer;
        },
    },
    methods: {
        hasHistory() {
            return window.history.length > 2;
        },
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
    destroyed() {
        this.$store.commit("docs/CLEAR_READ_DOC");
    },
};
</script>

<style lang="stylus">
.ReadDoc_wrapper {
    direction: ltr;
    overflow-y: auto;
    border-radius: 5px;
    background: #fff;
}
</style>
