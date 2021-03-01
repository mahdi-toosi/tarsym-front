<template>
    <section class="tools shadow">
        <br />
        <div class="tabs">
            <span
                @click="tabContent = 'tools'"
                :class="tabContent == 'tools' ? 'activeTab' : ''"
            >
                ابزار ها
            </span>
            <span
                @click="tabContent = 'layers'"
                :class="tabContent == 'layers' ? 'activeTab' : ''"
            >
                لایه ها
            </span>
            <span
                @click="tabContent = 'publish'"
                :class="tabContent == 'publish' ? 'activeTab' : ''"
            >
                انتشار
            </span>
        </div>
        <div class="content">
            <div class="tools-content" v-show="tabContent === 'tools'">
                <ul class="tools">
                    <Draggable v-model="DocTools" handle=".fa-grip-vertical">
                        <li v-for="(tool, index) in DocTools" :key="index">
                            <i
                                class="fas fa-grip-vertical"
                                v-if="tool.isOn && index !== 0"
                            ></i>
                            <NewPoint
                                :tool="tool"
                                :index="index"
                                v-if="tool.type === 'Point'"
                                class="tool"
                                :class="{ active: tool.isOn }"
                            />
                            <NewPolygon
                                :tool="tool"
                                :index="index"
                                v-if="tool.type === 'Polygon'"
                                class="tool"
                                :class="{ active: tool.isOn }"
                            />
                            <NewPolyline
                                :tool="tool"
                                :index="index"
                                v-if="tool.type === 'Polyline'"
                                class="tool"
                                :class="{ active: tool.isOn }"
                            />
                            <NewTextBox
                                :tool="tool"
                                :index="index"
                                v-if="tool.type === 'Textbox'"
                                class="tool"
                                :class="{ active: tool.isOn }"
                            />
                            <!-- <NewHeatmap
                                        :tool="tool"
                                        :index="index"
                                        v-if="tool.type === 'Heatmap'"
                                        class="tool"
                                        :class="{ active: tool.isOn }"
                                    /> -->
                        </li>
                    </Draggable>
                </ul>
                <GooeyMenu />
            </div>
            <div class="layers-content" v-show="tabContent === 'layers'">
                <LayersRelationshipTree @childClicked="tabContent = 'tools'" />
                <AddNewLayerBox @childAdded="tabContent = 'tools'" />
            </div>
            <div class="publish-layer" v-show="tabContent === 'publish'">
                <div>
                    <label for="zoomLevel" style="top: 4px">سطح زوم:</label>
                    <select
                        id="zoomLevel"
                        v-model="zoomLevel"
                        title="سطح زوم 5 بیشترین مقدار زوم است"
                    >
                        <option :value="4">1</option>
                        <option :value="6">2</option>
                        <option :value="8">3</option>
                        <option :value="10">4</option>
                        <option :value="13">5</option>
                    </select>
                </div>
                <br />
            </div>
        </div>
    </section>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
// *  vue slider styles
import "vue-slider-component/theme/antd.css";

// * components
// import NewHeatmap from "@/components/newDoc/newHeatmap";
// import datePicker from "@/components/newDoc/helper Components/datePicker";

export default {
    name: "newDocOptions",
    data() {
        return { tabContent: "tools" };
    },
    computed: {
        ...mapGetters(["DocLayer"]),
        DocTools: {
            get() {
                return this.DocLayer.tools;
            },
            set(value) {
                this.DRAG_TOOL_UPDATE(value);
                this.UPDATE_ON_TOOL();
            },
        },
        zoomLevel: {
            get() {
                return this.DocLayer.zoomLevel;
            },
            set(val) {
                this.SET_ZOOM_LEVEL(val);
            },
        },
    },
    methods: {
        ...mapMutations("docs", [
            "DRAG_TOOL_UPDATE",
            "UPDATE_ON_TOOL",
            "SET_ZOOM_LEVEL",
        ]),
    },
    components: {
        Draggable: () => import("vuedraggable"),
        GooeyMenu: () =>
            import("@/components/newDoc/helper Components/gooeyMenu"),
        NewPoint: () => import("@/components/newDoc/newPoint"),
        NewPolygon: () => import("@/components/newDoc/newPolygon"),
        NewPolyline: () => import("@/components/newDoc/newPolyline"),
        NewTextBox: () => import("@/components/newDoc/newTextBox"),
        // NewHeatmap,
        AddNewLayerBox: () =>
            import("@/components/newDoc/helper Components/addNewLayerBox"),
        LayersRelationshipTree: () =>
            import(
                "@/components/newDoc/helper Components/layersRelationshipTree"
            ),
    },
};
</script>

<style>
</style>