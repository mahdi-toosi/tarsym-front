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

            <label for="zoomLevel" style="top: 4px" v-if="tool.searchable"
                >سطح زوم:</label
            >
            <select
                id="zoomLevel"
                v-if="tool.searchable"
                v-model="zoomLevel"
                title="سطح زوم 5 بیشترین مقدار زوم است"
            >
                <option :value="4">1</option>
                <option :value="6">2</option>
                <option :value="8">3</option>
                <option :value="10">4</option>
                <option :value="13">5</option>
            </select>

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
        <div class="tool_body" v-if="tool.iconName">
            <div class="iconColor">
                <label for="iconColor">رنگ آیکن:</label>
                <ColorPicker
                    id="iconColor"
                    :value="tool.secondaryColor"
                    :index="index"
                    :secondaryColor="true"
                />
            </div>
            <div class="tool_body">
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
import mixins from "./mixins";
import IconPicker from "@/components/newDoc/helper Components/iconPicker";

export default {
    name: "newPoint",
    mixins: [mixins],
    components: { IconPicker },
    computed: {
        zoomLevel: {
            get() {
                return this.$store.getters.DocLayer.zoomLevel;
            },
            set(val) {
                this.SET_ZOOM_LEVEL(val);
            },
        },
    },
};
</script>
<style lang="stylus"></style>