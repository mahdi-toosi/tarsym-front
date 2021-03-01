<template>
    <div class="newPolygon">
        <div class="tool_header">
            <i
                class="fas fa-draw-polygon"
                :style="{ color: tool.color.hex8 || tool.color }"
                style="font-size: 24px; padding: 3px 4px"
            ></i>

            <Tooltip :index="index" placeholder="توضیح کوتاه چند ضلعی" />

            <button
                class="editIcon"
                @click="toolSwitch({ tool, index })"
                :class="tool.isOn ? 'tool_is_on' : ''"
                title="ویرایش ابزار"
            >
                <i class="fas fa-pencil-alt"></i>
            </button>

            <button
                class="visibility"
                @click="CHANGE_VISIBILITY(index)"
                title="نمایش / عدم نمایش"
            >
                <i
                    class="far"
                    :class="tool.visible ? 'fa-eye' : 'fa-eye-slash'"
                ></i>
            </button>

            <button
                @click="copy_tool(index)"
                class="copy_button"
                v-if="!tool.searchable"
            >
                <i class="far fa-copy"></i>
            </button>

            <button
                @click="deleteTool(index)"
                class="delete_button"
                title="حذف ابزار"
            >
                <i class="far fa-trash-alt"></i>
            </button>
        </div>
        <div class="tool_body">
            <div class="polygonColor">
                <label for="polygonColor">رنگ بیرونی:</label>
                <ColorPicker
                    :value="tool.color"
                    id="polygonColor"
                    :tool="tool"
                />
            </div>
            <div class="polygonSencondaryColor">
                <label for="polygonSencondaryColor">رنگ داخلی</label>
                <ColorPicker
                    :value="tool.secondaryColor"
                    id="polygonSencondaryColor"
                    :tool="tool"
                    :secondaryColor="true"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";

export default {
    name: "newPolygon",
    props: ["tool", "index"],
    methods: {
        ...mapActions("docs", ["deleteTool", "toolSwitch", "copy_tool"]),
        ...mapMutations("docs", ["CHANGE_VISIBILITY"]),
    },
    computed: {
        visibility() {
            return this.$store.getters.visibility;
        },
    },
    components: {
        ColorPicker: () =>
            import("@/components/newDoc/helper Components/colorPicker"),
        Tooltip: () =>
            import("@/components/newDoc/helper Components/tooltip.vue"),
    },
};
</script>

<style>
</style>