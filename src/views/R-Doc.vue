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
import { mapGetters } from "vuex";

export default {
    name: "readDocument",
    data() {
        return {};
    },
    computed: {
        ...mapGetters(["DocLayer"]),
    },
    methods: {
        hasHistory() {
            return window.history.length > 2;
        },
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
            const FullDate = `${
                yearIsNegetive
                    ? "<span style='display: inline-block; direction: ltr;'>-" +
                      currectYear +
                      "</span>"
                    : currectYear
            }/${month}/${day} <span> ه‍.ق</span>`;
            return month == "00" ? JustYear : FullDate;
        },
    },
};
</script>

<style lang="stylus">
.ReadDoc_wrapper {
    direction: ltr;
    height: 95vh;
    overflow-y: auto;
    border-radius: 5px;
    background: #fff;
}
</style>
