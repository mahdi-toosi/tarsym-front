<template>
    <div class="newPoint">
        <div class="tool_header">
            <i
                class="mdi mdi-comment-outline"
                style="font-size: 25px; padding: 3px 5px"
            />

            <textarea
                class="tooltip"
                placeholder="تکست باکس"
                v-model="toolTipModel"
            />

            <button
                class="editIcon"
                @click="toolSwitch({ tool, index })"
                :class="tool.isOn ? 'tool_is_on' : ''"
                title="ویرایش ابزار"
            >
                <i class="mdi mdi-pencil"></i>
            </button>

            <button
                class="visibility"
                @click="CHANGE_VISIBILITY(index)"
                title="نمایش / عدم نمایش"
            >
                <i
                    class="mdi"
                    :class="
                        tool.visible ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
                    "
                ></i>
            </button>

            <button
                @click="copy_tool(index)"
                class="copy_button"
                v-if="!tool.searchable"
            >
                <i class="mdi mdi-content-copy"></i>
            </button>

            <button
                @click="deleteTool(index)"
                class="delete_button"
                v-if="!tool.searchable"
                title="حذف ابزار"
            >
                <i class="mdi mdi-delete-outline"></i>
            </button>
        </div>
        <div class="tool_body">
            <div class="backColor">
                <label for="backColor">رنگ زمینه:</label>
                <ColorPicker id="backColor" :value="tool.color" :tool="tool" />
            </div>

            <div class="fontColor">
                <label for="fontColor">رنگ فونت:</label>
                <ColorPicker
                    id="fontColor"
                    :value="tool.secondaryColor"
                    :tool="tool"
                    :secondaryColor="true"
                />
            </div>

            <div class="heightOfbox">
                <label for="heightOfbox">عرض باکس:</label>
                <vue-slider
                    id="heightOfbox"
                    v-model="TextBoxHeight"
                    :width="100"
                    :height="6"
                    :min="30"
                    :max="300"
                />
            </div>

            <div class="fontSize">
                <label for="fontSize">سایز فونت:</label>
                <vue-slider
                    id="fontSize"
                    v-model="TextBoxfontSize"
                    :width="100"
                    :height="6"
                    :min="14"
                    :max="30"
                />
            </div>

            <div class="widthOfBox">
                <label for="widthOfBox">طول باکس:</label>
                <vue-slider
                    id="widthOfBox"
                    v-model="TextBoxWidth"
                    :width="100"
                    :height="6"
                    :min="30"
                    :max="350"
                />
            </div>
        </div>
    </div>
</template>

<script>
import mixins from "./mixins";

export default {
    name: "newTextBox",
    mixins: [mixins],
    computed: {
        toolTipModel: {
            get() {
                return this.$store.getters.tooltipData(this.index).text;
            },
            set(val) {
                this.$store.commit("docs/CHANGE_TOOLTIP", {
                    index: this.index,
                    val,
                    type: "text",
                });
            },
        },
        TextBoxfontSize: {
            get() {
                return this.tool.fontSize;
            },
            set(val) {
                this.CHANGE_RANG_INPUT({
                    index: this.index,
                    val,
                    type: "fontSize",
                });
            },
        },
        TextBoxHeight: {
            get() {
                return this.tool.height;
            },
            set(val) {
                this.CHANGE_RANG_INPUT({
                    index: this.index,
                    val,
                    type: "height",
                });
            },
        },
        TextBoxWidth: {
            get() {
                return this.tool.width;
            },
            set(val) {
                this.CHANGE_RANG_INPUT({
                    index: this.index,
                    val,
                    type: "width",
                });
            },
        },
    },
};
</script>