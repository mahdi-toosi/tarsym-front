import { mapActions, mapMutations } from "vuex";
import ColorPicker from "@/components/newDoc/helper Components/colorPicker";
import VueSlider from "vue-slider-component";

export default {
    props: ["tool", "index"],
    components: {
        ColorPicker,
        VueSlider,
    },
    methods: {
        ...mapActions("docs", ["deleteTool", "toolSwitch"]),
        ...mapMutations("docs", [
            "CHANGE_RANG_INPUT",
            "CHANGE_TOOLTIP",
            "SET_ZOOM_LEVEL",
            "CHANGE_VISIBILITY",
            "CHANGE_POLYLINE_DECORATOR",
        ]),
    },
    computed: {
        toolTipModel: {
            get() {
                return this.$store.getters.tooltipData(this.index);
            },
            set(val) {
                this.CHANGE_TOOLTIP({ index: this.index, val });
            },
        },
        IconSizeModel: {
            get() {
                return this.tool.iconSize;
            },
            set(val) {
                this.CHANGE_RANG_INPUT({
                    index: this.index,
                    val,
                    type: "iconSize",
                });
            },
        },
        iconDegreeModel: {
            get() {
                return this.tool.angle;
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
};
