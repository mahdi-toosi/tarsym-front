import { mapActions, mapMutations } from "vuex";
import ColorPicker from "@/components/newDoc/helper Components/colorPicker";
import Tooltip from "@/components/newDoc/helper Components/tooltip";
import VueSlider from "vue-slider-component";

export default {
    props: ["tool", "index"],
    components: {
        ColorPicker,
        VueSlider,
        Tooltip,
    },
    methods: {
        ...mapActions("docs", ["deleteTool", "toolSwitch", "copy_tool"]),
        ...mapMutations("docs", [
            "CHANGE_RANG_INPUT",
            "SET_ZOOM_LEVEL",
            "CHANGE_VISIBILITY",
            "CHANGE_POLYLINE_DECORATOR",
        ]),
    },
    computed: {
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
