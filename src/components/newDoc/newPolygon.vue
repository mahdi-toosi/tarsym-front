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
                class="visibility"
                @click="CHANGE_VISIBILITY(index)"
                v-if="index != 0"
            >
                <i
                    class="far"
                    :class="visibility(index) ? 'fa-eye' : 'fa-eye-slash'"
                ></i>
            </button>

            <button @click="deleteTool(index)" class="delete_button">
                <i class="far fa-trash-alt"></i>
            </button>
        </div>
        <div class="tool_body">
            <div class="polygonColor">
                <label for="polygonColor">رنگ بیرونی:</label>
                <color-picker
                    :value="tool.color"
                    id="polygonColor"
                    :index="index"
                />
            </div>
            <div class="polygonSencondaryColor">
                <label for="polygonSencondaryColor">رنگ داخلی</label>
                <color-picker
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
import colorPicker from "@/components/newDoc/helper Components/colorPicker";
import { mapActions, mapMutations } from "vuex";
export default {
    name: "newPolygon",
    props: ["tool", "index"],
    methods: {
        ...mapActions(["deleteTool", "makeToolOn", "toolSwitch"]),
        ...mapMutations(["CHANGE_TOOLTIP", "CHANGE_VISIBILITY"]),
    },
    computed: {
        toolTipModel: {
            get() {
                return this.$store.getters.tooltipData(this.index);
            },
            set(val) {
                const index = this.index;
                this.CHANGE_TOOLTIP({ index, val });
            },
        },
        visibility() {
            return this.$store.getters.visibility;
        },
    },
    components: {
        colorPicker,
    },
};
</script>

<style>
</style>