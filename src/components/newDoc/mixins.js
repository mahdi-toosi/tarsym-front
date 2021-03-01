import { mapActions, mapMutations } from "vuex";

export default {
    props: ["tool", "index"],
    components: {
        ColorPicker: () => import("@/components/newDoc/helper Components/colorPicker"),
        VueSlider: () => import("vue-slider-component"),
        Tooltip: () => import("@/components/newDoc/helper Components/tooltip"),
    },
    methods: {
        ...mapActions("docs", ["deleteTool", "toolSwitch", "copy_tool"]),
        ...mapMutations("docs", ["CHANGE_RANG_INPUT", "CHANGE_VISIBILITY"]),
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
