<template>
    <div class="newPoint">
        <div class="tool_header">
            <i
                class="far fa-comment-alt"
                style="font-size: 25px; padding: 3px 5px"
            />
            <textarea
                class="tooltip"
                placeholder="تکست باکس"
                v-model="toolTipModel"
            />
            <button
                class="editIcon"
                @click="toolSwitch(index)"
                :class="
                    $store.state.DocProp.OnTool.index == index
                        ? 'tool_is_on'
                        : ''
                "
            >
                <i class="fas fa-pencil-alt"></i>
            </button>
            <button
                @click="deleteTool(index)"
                class="delete_button"
                v-if="!tool.searchable"
            >
                <i class="far fa-trash-alt"></i>
            </button>
        </div>
        <div class="tool_body">
            <div class="backColor">
                <label for="backColor">رنگ زمینه:</label>
                <color-picker
                    id="backColor"
                    :value="tool.color"
                    :index="index"
                />
            </div>

            <div class="fontColor">
                <label for="fontColor">رنگ فونت:</label>
                <color-picker
                    id="fontColor"
                    :value="tool.secondaryColor"
                    :index="index"
                    :secondaryColor="true"
                />
            </div>

            <div class="fontSize">
                <label for="fontSize">سایز فونت:</label>
                <vue-slider
                    id="fontSize"
                    v-model="TextBoxfontSize"
                    :width="120"
                    :height="6"
                    :min="14"
                    :max="30"
                />
            </div>

            <div class="heightOfbox">
                <label for="heightOfbox">عرض باکس:</label>
                <vue-slider
                    id="heightOfbox"
                    v-model="TextBoxHeight"
                    :width="120"
                    :height="6"
                    :min="30"
                    :max="300"
                />
            </div>

            <div class="widthOfBox">
                <label for="widthOfBox">طول باکس:</label>
                <vue-slider
                    id="widthOfBox"
                    v-model="TextBoxWidth"
                    :width="120"
                    :height="6"
                    :min="100"
                    :max="350"
                />
            </div>
        </div>
    </div>
</template>

<script>
import colorPicker from "@/components/newDoc/colorPicker";
import { mapActions, mapMutations } from "vuex";
import VueSlider from "vue-slider-component";

export default {
    name: "newPoint",
    props: ["tool", "index"],
    methods: {
        ...mapActions(["deleteTool", "makeToolOn", "toolSwitch"]),
        ...mapMutations(["CHANGE_RANG_INPUT", "CHANGE_TOOLTIP"]),
    },
    computed: {
        DocLayer() {
            return this.$store.getters.DocLayer;
        },
        logo() {
            const thisTool = this.DocLayer.tools[this.index];
            return thisTool.iconName;
        },
        toolTipModel: {
            get() {
                return this.$store.getters.tooltipData(this.index);
            },
            set(val) {
                const index = this.index;
                this.CHANGE_TOOLTIP({ index, val });
            },
        },
        TextBoxfontSize: {
            get() {
                return this.DocLayer.tools[this.index].iconRepeat;
            },
            set(val) {
                this.CHANGE_RANG_INPUT({
                    index: this.index,
                    val,
                    type: "fontSize",
                });
            },
        },
        TextBoxHeight: {
            get() {
                return this.DocLayer.tools[this.index].iconRepeat;
            },
            set(val) {
                this.CHANGE_RANG_INPUT({
                    index: this.index,
                    val,
                    type: "height",
                });
            },
        },
        TextBoxWidth: {
            get() {
                return this.DocLayer.tools[this.index].iconRepeat;
            },
            set(val) {
                this.CHANGE_RANG_INPUT({
                    index: this.index,
                    val,
                    type: "width",
                });
            },
        },
    },
    components: {
        VueSlider,
        colorPicker,
    },
};
</script>

<style>
</style>