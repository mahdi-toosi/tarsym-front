<template>
    <div class="newPolyline">
        <div class="tool_header">
            <IconPicker :index="index" :tool="tool" v-if="tool.showIcon" />
            <i
                class="mdi mdi-vector-polyline"
                :style="{ color: tool.color.hex8 || tool.color }"
                style="font-size: 25px; padding: 3px 5px"
                v-else
            />

            <Tooltip :index="index" placeholder="توضیح کوتاه خط" />

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
                title="حذف ابزار"
            >
                <i class="mdi mdi-delete-outline"></i>
            </button>
        </div>
        <div class="tool_body">
            <div class="lineColor">
                <label for="lineColor">رنگ خط:</label>
                <ColorPicker id="lineColor" :value="tool.color" :tool="tool" />
            </div>
            <div class="addIcon">
                <label :for="'addIcon' + index">آیکن:</label>
                <input
                    type="checkbox"
                    :id="'addIcon' + index"
                    :checked="tool.showIcon"
                    @input="
                        CHANGE_POLYLINE_DECORATOR({
                            $event,
                            tool,
                            type: 'icon',
                        })
                    "
                />
            </div>
            <div class="isDashed">
                <label :for="'isDashed' + index">خط چین:</label>
                <input
                    type="checkbox"
                    :id="'isDashed' + index"
                    :checked="tool.dashed"
                    @input="
                        CHANGE_POLYLINE_DECORATOR({
                            $event,
                            tool,
                            type: 'dashed',
                        })
                    "
                />
            </div>
            <div class="addArrow">
                <label :for="'addArrow' + index">فلش:</label>
                <input
                    type="checkbox"
                    :id="'addArrow' + index"
                    :checked="tool.showArrow"
                    @input="
                        CHANGE_POLYLINE_DECORATOR({
                            $event,
                            tool,
                            type: 'arrow',
                        })
                    "
                />
            </div>
            <div class="lineIconsColor" v-if="tool.showIcon">
                <label for="lineIconsColor">رنگ آیکن:</label>
                <ColorPicker
                    id="lineIconsColor"
                    :value="tool.secondaryColor"
                    :tool="tool"
                    :secondaryColor="true"
                />
            </div>
            <div class="lineIconSize" v-if="tool.showIcon">
                <label for="lineIconSize">سایز آیکن:</label>
                <vue-slider
                    id="lineIconSize"
                    v-model="IconSizeModel"
                    :width="100"
                    :height="6"
                    :min="20"
                    :max="60"
                />
            </div>
            <div class="lineIconRepeat" v-if="tool.showIcon">
                <label for="lineIconRepeat">فاصله آیکن ها:</label>
                <vue-slider
                    id="lineIconRepeat"
                    v-model="IconRepeatModel"
                    :width="100"
                    :height="6"
                    :min="2"
                    :max="100"
                    :tooltip-formatter="'{value}%'"
                />
            </div>
            <div class="lineIconDegree" v-if="tool.showIcon">
                <label for="lineIconDegree">چرخش آیکن:</label>
                <vue-slider
                    id="lineIconDegree"
                    v-model="iconDegreeModel"
                    :width="100"
                    :height="6"
                    :min="0"
                    :max="360"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { mapMutations } from "vuex";
import mixins from "./mixins";

export default {
    name: "newPolyline",
    mixins: [mixins],
    components: {
        IconPicker: () =>
            import("@/components/newDoc/helper Components/iconPicker"),
    },
    methods: {
        ...mapMutations("docs", ["CHANGE_POLYLINE_DECORATOR"]),
    },
    computed: {
        IconRepeatModel: {
            get() {
                return this.tool.iconRepeat;
            },
            set(val) {
                this.CHANGE_RANG_INPUT({
                    index: this.index,
                    val,
                    type: "iconRepeat",
                });
            },
        },
    },
};
</script>
