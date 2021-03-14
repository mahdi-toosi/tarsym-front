<template>
    <div class="loadingBar">
        <div v-if="loading && type === 'list'">
            <VueContentLoading
                :width="500"
                :height="150"
                :rtl="true"
                v-for="n in 4"
                :key="n"
                style="margin-top: 15px"
                primary="#e4e4e4"
                :speed="1"
                secondary="#fff"
            >
                <!-- Borders -->
                <rect x="0" y="0" rx="4" ry="4" width="8" height="150" />
                <rect :x="500 - 8" y="0" rx="4" ry="4" width="8" height="150" />
                <rect x="0" :y="150 - 8" rx="4" ry="4" width="500" height="8" />
                <rect x="0" y="0" rx="4" ry="4" width="500" height="8" />
                <!-- End borders -->
                <!-- Header -->
                <circle cx="40" cy="35" r="20" />
                <rect x="70" y="20" rx="4" ry="4" width="170" height="16" />
                <rect x="70" y="40" rx="4" ry="4" width="70" height="14" />
                <!-- End header -->
                <!-- Body -->
                <rect x="20" y="65" rx="4" ry="4" width="460" height="16" />
                <rect x="20" y="90" rx="4" ry="4" width="460" height="16" />
                <rect x="20" y="115" rx="4" ry="4" width="350" height="16" />
                <!-- End body -->
            </VueContentLoading>
        </div>
        <div v-if="loading && type === 'read'">
            <VueContentLoading
                :width="500"
                :height="500"
                :rtl="true"
                style="margin-top: 15px"
                primary="#e4e4e4"
                :speed="1"
                secondary="#fff"
            >
                <!-- Borders -->
                <rect x="0" y="0" rx="4" ry="4" width="8" height="500" />
                <rect :x="500 - 8" y="0" rx="4" ry="4" width="8" height="500" />
                <rect x="0" :y="500 - 8" rx="4" ry="4" width="500" height="8" />
                <rect x="0" y="0" rx="4" ry="4" width="500" height="8" />
                <!-- End borders -->
                <!-- Header -->
                <rect x="20" y="20" rx="4" ry="4" width="300" height="16" />
                <rect x="20" y="45" rx="4" ry="4" width="150" height="14" />
                <rect x="400" y="45" rx="4" ry="4" width="70" height="16" />
                <!-- End header -->
                <!-- Body -->
                <rect x="20" y="80" rx="4" ry="4" width="460" height="16" />
                <rect x="20" :y="105" rx="4" ry="4" width="460" height="16" />
                <rect
                    x="20"
                    :y="105 + 25 * x"
                    rx="4"
                    ry="4"
                    width="460"
                    height="16"
                    v-for="x in 12"
                    :key="x"
                />
                <rect
                    x="20"
                    :y="105 + 25 * 13"
                    rx="4"
                    ry="4"
                    width="350"
                    height="16"
                />
                <rect
                    x="20"
                    :y="105 + 25 * 14.5"
                    rx="4"
                    ry="4"
                    width="250"
                    height="16"
                />
                <rect
                    x="430"
                    :y="105 + 25 * 14.5"
                    rx="4"
                    ry="4"
                    width="50"
                    height="16"
                />
                <!-- End body -->
            </VueContentLoading>
        </div>
        <span
            v-if="notingToShow"
            class="notingToShow"
            v-text="notingToShowText"
        >
        </span>
    </div>
</template>

<script>
import VueContentLoading from "vue-content-loading";

export default {
    name: "Loading",
    props: ["data", "type", "notingToShowText"],
    data() {
        return { loading: true, notingToShow: false };
    },
    components: { VueContentLoading },
    created() {
        document.addEventListener("StopLoader", () => {
            this.loading = false;
            this.notingToShow = false;
        });
        document.addEventListener("dataReceivedStopLoader", () => {
            setTimeout(() => {
                if (this.data.length) {
                    this.loading = false;
                    this.notingToShow = false;
                } else {
                    this.loading = false;
                    this.notingToShow = true;
                }
            }, 500);
        });
    },
    watch: {
        data() {
            if (this.data.length) {
                this.loading = false;
                this.notingToShow = false;
            }
        },
    },
};
</script>

<style>
</style>