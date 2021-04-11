<template>
    <div class="newHeatmap">
        <div class="tool_header">
            <i
                class="mdi mdi-fire"
                style="font-size: 24px; padding: 3px 4px"
            ></i>
            <button
                class="editIcon"
                @click="toolSwitch({ tool, index })"
                :class="tool.isOn ? 'tool_is_on' : ''"
                aria-label="تغییر"
            >
                <i class="mdi mdi-pencil"></i>
            </button>

            <button class="visibility" @click="CHANGE_VISIBILITY(index)">
                <i
                    class="mdi"
                    :class="
                        tool.visible ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
                    "
                ></i>
            </button>

            <button @click="deleteTool(index)" class="delete_button">
                <i class="mdi mdi-delete-outline"></i>
            </button>
        </div>
    </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";

export default {
    name: "newPoint",
    props: ["tool", "index"],
    methods: {
        ...mapActions("docs", ["deleteTool", "toolSwitch"]),
        ...mapMutations("docs", ["CHANGE_VISIBILITY"]),
    },
    components: {},
};
</script>