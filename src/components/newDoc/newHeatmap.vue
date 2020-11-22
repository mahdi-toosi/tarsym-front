<template>
    <div class="newHeatmap">
        <div class="tool_header">
            <i
                class="fas fa-fire-alt"
                style="font-size: 24px; padding: 3px 4px"
            ></i>
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
    </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";

export default {
    name: "newPoint",
    props: ["tool", "index"],
    methods: {
        ...mapActions(["deleteTool", "toolSwitch"]),
        ...mapMutations(["CHANGE_TOOLTIP", "CHANGE_VISIBILITY"]),
    },
    components: {},
};
</script>