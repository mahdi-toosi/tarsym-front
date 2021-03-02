<template>
    <div class="ReadDoc_wrapper">
        <header>
            <button
                class="btn btn-back"
                style="position: relative"
                @click="hasHistory() ? $router.go(-1) : $router.push('/')"
                aria-label="بازگشت"
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
                <ul class="share">
                    <li>
                        <button
                            class="btn btn-back"
                            title="کپی کردن آیفریم"
                            @click="copyIframe(DocLayer._id, DocLayer.title)"
                            aria-label="کپی کردن آیفریم"
                        >
                            <i class="fas fa-code"></i>
                        </button>
                    </li>
                </ul>
            </footer>
        </article>
    </div>
</template>

<script>
export default {
    name: "readDocument",
    metaInfo() {
        return {
            title: `ترسیم - ${this.DocLayer?.title}`,
            meta: [
                { name: "robots", content: "index, follow" },
                {
                    name: "description",
                    content: this.DocLayer?.title,
                },
                { property: "og:title", content: this.DocLayer?.title },
                { property: "og:description", content: this.DocLayer?.title },
                {
                    property: "og:url",
                    content: `https://tarsym.com/read/${this.DocLayer?._id}`,
                },
            ],
        };
    },
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
        copyIframe(_id, title) {
            const iframe = `<iframe
            src="https://tarsym.com/embed/${_id}"
            width="600px"
            height="450px"
            frameborder="0"
            style="border: 0"
            tabindex="0"
            title="${title}"
            allowfullscreen="allowfullscreen"
            aria-hidden="false"
        ></iframe>`;

            const el = document.createElement("textarea");
            el.value = iframe;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);

            this.$toasted.success("آیفریم کپی شد ...", {
                icon: "fa-copy",
            });
        },
        async read_this_doc() {
            await this.$store.dispatch("docs/read_this_doc");
            if (this.$store.state.docs.readDoc.length)
                this.$store.commit("docs/UPDATE_DOC_INDEX");

            await this.$store.dispatch("change_map_layers");
        },
    },
    watch: {
        $route: "read_this_doc",
    },
    beforeRouteEnter(to, from, next) {
        next(async (vm) => {
            await vm.read_this_doc();
        });
    },
    destroyed() {
        this.$store.commit("docs/CLEAR_READ_DOC");
    },
};
</script>

<style lang="stylus">
@import '../assets/styles/readDoc';
</style>
