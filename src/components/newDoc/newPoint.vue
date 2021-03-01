<template>
    <div class="newPoint">
        <div class="tool_header">
            <IconPicker :index="index" :tool="tool" />
            <Tooltip :index="index" placeholder="توضیح کوتاه آیکن" />

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
                v-if="!tool.searchable"
            >
                <i class="far fa-trash-alt"></i>
            </button>
        </div>
        <div class="tool_body">
            <div class="iconColor" v-if="tool.iconName">
                <label for="iconColor">رنگ آیکن:</label>
                <ColorPicker
                    id="iconColor"
                    :value="tool.secondaryColor"
                    :tool="tool"
                    :secondaryColor="true"
                />
            </div>
            <div class="iconAlarm" v-if="!tool.searchable && tool.iconName">
                <label for="iconAlarm">آلارم آیکن:</label>
                <input type="checkbox" name="" id="iconAlarm" v-model="alarm" />
            </div>
            <div class="tool_body" v-if="tool.iconName">
                <div class="iconSize">
                    <label for="iconSize">سایز آیکن:</label>
                    <vue-slider
                        id="iconSize"
                        v-model="IconSizeModel"
                        :width="100"
                        :height="6"
                        :min="10"
                        :max="45"
                    />
                </div>
                <div class="iconDegree">
                    <label for="iconDegree">چرخش آیکن:</label>
                    <vue-slider
                        id="iconDegree"
                        v-model="iconDegreeModel"
                        :width="100"
                        :height="6"
                        :min="0"
                        :max="360"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapMutations } from "vuex";
import mixins from "./mixins";
export default {
    name: "newPoint",
    mixins: [mixins],
    components: {
        IconPicker: () =>
            import("@/components/newDoc/helper Components/iconPicker"),
    },
    methods: {
        ...mapMutations("docs", ["SET_ALARM_SITUATION"]),
    },
    computed: {
        alarm: {
            get() {
                return this.tool.alarm;
            },
            set(val) {
                this.SET_ALARM_SITUATION({ tool: this.tool, val });
            },
        },
    },
};
</script>
<style lang="stylus"></style>