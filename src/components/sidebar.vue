<template>
    <div class="panel">
        <router-view />
        <!-- <footer style="text-align: center">footer</footer> -->
        <transition name="back-to-top-animate">
            <div
                class="vue-back-to-top btn"
                v-show="visible"
                @click="backToTop"
            >
                <i class="fas fa-arrow-up"></i>
            </div>
        </transition>
    </div>
</template>
<script>
export default {
    name: "sidebar",
    props: {},
    data() {
        return {
            visible: false,
            visibleoffset: 2000,
        };
    },
    methods: {
        catchScroll() {
            this.visible = window.pageYOffset > parseInt(this.visibleoffset);
        },
        backToTop() {
            const el = document.getElementById("content");
            if (el) el.scrollIntoView();
        },
    },
    destroyed() {
        if (window.innerWidth <= 950)
            window.removeEventListener("scroll", this.catchScroll);
    },
    mounted() {
        if (window.innerWidth <= 950)
            window.addEventListener("scroll", this.catchScroll);
    },
};
</script>
