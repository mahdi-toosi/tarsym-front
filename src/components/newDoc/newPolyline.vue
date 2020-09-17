<template>
    <div class="newPolyline">
        <div class="tool_header">
            <icon-picker :index="index" v-if="tool.showIcon" />
            <i class="fas fa-long-arrow-alt-up" style="font-size: 25px; padding: 3px 5px;" v-else />
            <input type="text" class="tooltip" placeholder="توضیح کوتاه خط" v-model="toolTipModel" />
            <button
                class="editIcon"
                @click="toolSwitch(index)"
                :class="$store.state.DocProp.OnTool.index == index ? 'tool_is_on' : '' "
            >
                <i class="fas fa-pencil-alt"></i>
            </button>
            <button @click="deleteTool(index)" class="delete_button">
                <i class="far fa-trash-alt"></i>
            </button>
        </div>
        <div class="tool_body">
            <div class="lineColor">
                <label for="lineColor">رنگ خط</label>
                <color-picker id="lineColor" :value="tool.color" :index="index" />
            </div>
            <div class="addIcon">
                <label for="addIcon">آیکن:</label>
                <input
                    type="checkbox"
                    id="addIcon"
                    @input="CHANGE_POLYLINE_DECORATOR({ $event, index , type: 'icon'})"
                />
            </div>
            <div class="isDashed">
                <label for="isDashed">خط چین:</label>
                <input
                    type="checkbox"
                    id="isDashed"
                    @input="CHANGE_POLYLINE_DECORATOR({ $event, index , type: 'dashed' })"
                />
            </div>
            <div class="addArrow">
                <label for="addArrow">فلش:</label>
                <input
                    type="checkbox"
                    id="addArrow"
                    @input="CHANGE_POLYLINE_DECORATOR({ $event, index , type: 'arrow'})"
                />
            </div>
            <div class="lineIconsColor" v-if="tool.showIcon">
                <label for="lineIconsColor">رنگ آیکن:</label>
                <color-picker
                    id="lineIconsColor"
                    :value="tool.color"
                    :index="index"
                    :secondaryColor="true"
                />
            </div>
            <div class="lineIconSize" v-if="tool.showIcon">
                <label for="lineIconSize">سایز آیکن:</label>
                <vue-slider
                    id="lineIconSize"
                    v-model="IconSizeModel"
                    :width="120"
                    :height="6"
                    :min="10"
                    :max="45"
                />
            </div>
            <div class="lineIconRepeat" v-if="tool.showIcon ">
                <label for="lineIconRepeat">فاصله آیکن ها:</label>
                <vue-slider
                    id="lineIconRepeat"
                    v-model="IconRepeatModel"
                    :width="120"
                    :height="6"
                    :min="2"
                    :max="100"
                    :tooltip-formatter="'{value}%'"
                />
            </div>
            <div class="lineIconDegree" v-if="tool.showIcon ">
                <label for="lineIconDegree">چرخش آیکن:</label>
                <vue-slider
                    id="lineIconDegree"
                    v-model="iconDegreeModel"
                    :width="120"
                    :height="6"
                    :min="0"
                    :max="360"
                />
            </div>
        </div>
    </div>
</template>

<script>
import colorPicker from "@/components/newDoc/colorPicker";
import iconPicker from "@/components/newDoc/iconPicker";
import { mapActions, mapGetters, mapMutations } from "vuex";
import VueSlider from "vue-slider-component";

export default {
    name: "newPolyline",
    props: ["tool", "index"],
    methods: {
        ...mapActions(["deleteTool", "makeToolOn", "toolSwitch"]),
        ...mapMutations([
            "CHANGE_TOOLTIP",
            "CHANGE_RANG_INPUT",
            "CHANGE_POLYLINE_DECORATOR",
        ]),
    },
    computed: {
        ...mapGetters(["DocLayer"]),
        toolTipModel: {
            get() {
                return this.$store.getters.tooltipData(this.index);
            },
            set(val) {
                const index = this.index;
                this.CHANGE_TOOLTIP({ index, val });
            },
        },
        IconSizeModel: {
            get() {
                return this.DocLayer.tools[this.index].iconSize;
            },
            set(val) {
                this.CHANGE_RANG_INPUT({
                    index: this.index,
                    val,
                    type: "iconSize",
                });
            },
        },
        IconRepeatModel: {
            get() {
                return this.DocLayer.tools[this.index].iconRepeat;
            },
            set(val) {
                this.CHANGE_RANG_INPUT({
                    index: this.index,
                    val,
                    type: "iconRepeat",
                });
            },
        },
        iconDegreeModel: {
            get() {
                return this.DocLayer.tools[this.index].angel;
            },
            set(val) {
                this.CHANGE_RANG_INPUT({
                    index: this.index,
                    val,
                    type: "angle",
                });
            },
        },
    },
    components: {
        VueSlider,
        colorPicker,
        iconPicker,
    },
};
</script>

<style>
</style>