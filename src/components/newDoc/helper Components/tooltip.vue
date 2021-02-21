<template>
    <div class="tooltipbox">
        <input
            type="text"
            class="tooltip"
            :placeholder="placeholder"
            v-model="toolTipModel"
            maxlength="120"
        />
        <div class="tooltipImage">
            <i
                class="far fa-image"
                @click="$refs.tooltipImageInput.click()"
                v-if="toolTipModel"
            ></i>
            <i
                class="fas fa-slash"
                v-if="tooltip.image"
                @click="cleanImage()"
            ></i>

            <input
                ref="tooltipImageInput"
                style="display: none"
                type="file"
                accept="image/gif, image/jpeg, image/png"
                @change="uploadTooltipImage"
            />
        </div>
    </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
    props: ["index", "placeholder"],
    computed: {
        tooltip() {
            return this.$store.getters.tooltipData(this.index);
        },
        toolTipModel: {
            get() {
                return this.tooltip.text;
            },
            set(val) {
                this.CHANGE_TOOLTIP({
                    index: this.index,
                    val,
                    type: "text",
                });
            },
        },
    },
    methods: {
        ...mapMutations("docs", ["CHANGE_TOOLTIP"]),

        async uploadTooltipImage(event) {
            const image = event.target.files[0];
            if (!image) return;
            if (image.size > 1e5) {
                this.$toasted.error("حجم عکس حداکثر 100kb میتواند باشد");
                return;
            }

            event.target.value = "";
            const formData = new FormData();
            formData.append("docImage", image);

            await this.$axios
                .post("/uploadDocImage", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                })
                .then((res) => {
                    this.CHANGE_TOOLTIP({
                        index: this.index,
                        val: res.data.url,
                        type: "image",
                    });
                })
                .catch(() => {
                    let msg =
                        "آپلود عکس با مشکل روبرو شده. لطفا دوباره امتحان کنید ...";
                    this.$toasted.error(msg);
                    // this.$store.dispatch("handleAxiosError", error);
                });
        },
        async cleanImage() {
            let regex = new RegExp('/UPLOADS/documents/(.*?)"', "gi"),
                result = [],
                removeThisImgs = [];
            while ((result = regex.exec(this.tooltip.image + '"'))) {
                removeThisImgs.push(result[1]);
            }
            if (!removeThisImgs.length) return;

            const res = await this.$store.dispatch(
                "docs/removeThisImgs",
                removeThisImgs
            );
            if (!res) return;
            this.CHANGE_TOOLTIP({
                index: this.index,
                val: null,
                type: "image",
            });
        },
    },
    mounted() {},
};
</script>

<style>
</style>