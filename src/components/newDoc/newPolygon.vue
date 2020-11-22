<template>
    <div class="newPolygon">
        <div class="tool_header">
            <i
                class="fas fa-draw-polygon"
                style="font-size: 24px; padding: 3px 4px"
            ></i>

            <input
                type="text"
                class="tooltip"
                placeholder="توضیح کوتاه چند ضلعی"
                v-model="toolTipModel"
            />

            <button
                class="editIcon"
                @click="toolSwitch({ tool, index })"
                :class="tool.isOn ? 'tool_is_on' : ''"
            >
                <i class="fas fa-pencil-alt"></i>
            </button>

            <button class="visibility" @click="CHANGE_VISIBILITY(index)">
                <i
                    class="far"
                    :class="tool.visible ? 'fa-eye' : 'fa-eye-slash'"
                ></i>
            </button>

            <button @click="deleteTool(index)" class="delete_button">
                <i class="far fa-trash-alt"></i>
            </button>
        </div>
        <div class="tool_body">
            <div class="polygonColor">
                <label for="polygonColor">رنگ بیرونی:</label>
                <ColorPicker
                    :value="tool.color"
                    id="polygonColor"
                    :index="index"
                />
            </div>
            <div class="polygonSencondaryColor">
                <label for="polygonSencondaryColor">رنگ داخلی</label>
                <ColorPicker
                    :value="tool.secondaryColor"
                    id="polygonSencondaryColor"
                    :index="index"
                    :secondaryColor="true"
                />
            </div>
        </div>
    </div>
</template>

<script>
import ColorPicker from "@/components/newDoc/helper Components/colorPicker";
import { mapActions, mapMutations } from "vuex";
export default {
    name: "newPolygon",
    props: ["tool", "index"],
    methods: {
        ...mapActions(["deleteTool", "toolSwitch"]),
        ...mapMutations(["CHANGE_TOOLTIP", "CHANGE_VISIBILITY"]),
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
        visibility() {
            return this.$store.getters.visibility;
        },
    },
    components: {
        ColorPicker,
    },
};
</script>

<style>
</style>