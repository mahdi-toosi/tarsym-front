<template>
    <div style="width: 100%; position: relative">
        <LMap
            :icon="defaultIcon"
            class="map"
            :zoom="map.zoom"
            :center="map.center"
            @click="setClickCoordinates"
            @update:zoom="update_zoom"
            :options="{ zoomControl: false }"
            @update:center="update_center"
            @mousemove="update_mouse_coor"
            @contextmenu="showNavigate"
            :minZoom="4"
            ref="LeafletMap"
        >
            <LControl position="bottomright" class="leaflet-control mapmaker">
                <LayerPicker />
            </LControl>

            <LTileLayer
                v-for="tileProvider in map.tileProviders"
                :key="tileProvider.name"
                :name="tileProvider.name"
                :visible="tileProvider.visible"
                :url="tileProvider.url"
                layer-type="base"
                attribution="<a class='attr' href='https://tarsym.com' rel='nofollow'><strong>TARSYM.COM</strong></a>"
            />

            <div v-if="docs_list.length">
                <div v-for="(tool, index) in DocWithChildsTools" :key="index">
                    <div v-if="tool.type === 'Polygon'">
                        <LPolygon
                            :lat-lngs="polygonOrPolylineSimolationCoordinates"
                            v-if="tool.isOn"
                            :dashArray="'10,10'"
                            :opacity="0.5"
                            :color="tool.color.hex8 || tool.color"
                            :fill="false"
                        />
                        <LPolygon
                            :fillOpacity="0.4"
                            :fillColor="
                                tool.secondaryColor.hex8 || tool.secondaryColor
                            "
                            :color="tool.color.hex8 || tool.color"
                            :lat-lngs="tool.coordinates"
                            @dblclick="goToThisDoc(tool._id)"
                            :visible="tool.visible"
                        >
                            <LTooltip v-if="tool.tooltip.text">
                                <p>{{ tool.tooltip.text }}</p>
                                <img
                                    v-if="tool.tooltip.image"
                                    :src="tool.tooltip.image"
                                    :alt="tool.tooltip.text"
                                />
                            </LTooltip>
                        </LPolygon>
                    </div>
                    <!-- end Polygon -->
                    <div v-if="tool.type === 'Polyline'">
                        <LPolyline
                            :lat-lngs="polygonOrPolylineSimolationCoordinates"
                            :color="tool.color.hex8 || tool.color"
                            v-if="tool.isOn"
                            :dashArray="'10,10'"
                            :opacity="0.5"
                            :fill="false"
                        />
                        <!-- <LMarker
								v-for="(coordinate, index) in tool.coordinates"
								:lat-lng="coordinate"
								:key="index"
								:icon="CircleIcon"
                        />-->
                        <LPolyline
                            :lat-lngs="tool.coordinates"
                            :color="tool.color.hex8 || tool.color"
                            :dashArray="tool.dashed ? '10,10' : ''"
                            @dblclick="goToThisDoc(tool._id)"
                            :visible="tool.visible"
                        >
                            <LTooltip v-if="tool.tooltip.text">
                                <p>{{ tool.tooltip.text }}</p>
                                <img
                                    v-if="tool.tooltip.image"
                                    :src="tool.tooltip.image"
                                    :alt="tool.tooltip.text"
                                />
                            </LTooltip>
                        </LPolyline>
                        <PolylineDecorator
                            @dblclick="goToThisDoc(tool._id)"
                            :lat-lngs="tool.coordinates"
                            :icon-size="tool.iconSize"
                            :icon-name="`mdi mdi-${tool.iconName}`"
                            :icon-color="
                                tool.secondaryColor.hex8 || tool.secondaryColor
                            "
                            :icon-rotate="tool.angle"
                            :icon-repeat="tool.iconRepeat"
                            :arrow-color="tool.color.hex8 || tool.color"
                            :show-icon="tool.showIcon"
                            :show-arrow="tool.showArrow"
                            v-if="tool.visible"
                        />
                    </div>
                    <!-- end Polyline -->
                    <div
                        v-if="
                            tool.type === 'Point' && tool.coordinates[1] != '0'
                        "
                    >
                        <LMarker
                            :lat-lng="tool.coordinates"
                            :draggable="tool.isOn"
                            @update:latLng="
                                UPDATE_THIS_POINT_COORDINATE({ $event, tool })
                            "
                            :icon="defaultIcon"
                            @dblclick="goToThisDoc(tool._id)"
                            :visible="tool.visible"
                        >
                            <LIcon
                                :icon-size="[
                                    tool.iconSize,
                                    tool.iconSize * 1.15,
                                ]"
                                :icon-anchor="[
                                    tool.iconSize / 2,
                                    tool.iconSize / 2,
                                ]"
                                v-if="tool.iconName"
                            >
                                <div
                                    :class="{ tada: tool.alarm }"
                                    class="customIconWrapper"
                                >
                                    <span>
                                        <!-- if tool is on , this span make ripple wave effect -->
                                    </span>
                                    <i
                                        :class="`mdi mdi-${tool.iconName}`"
                                        :style="{
                                            fontSize: `${tool.iconSize}px`,
                                            color:
                                                tool.secondaryColor.hex8 ||
                                                tool.secondaryColor,
                                            transform:
                                                'rotate(' + tool.angle + 'deg)',
                                            position: 'absolute',
                                        }"
                                    />
                                </div>
                            </LIcon>
                            <LTooltip
                                v-if="tool.tooltip.text"
                                :options="tooltipOptions"
                                @dblclick="goToThisDoc(tool._id)"
                            >
                                <p>{{ tool.tooltip.text }}</p>
                                <img
                                    v-if="tool.tooltip.image"
                                    :src="tool.tooltip.image"
                                    :alt="tool.tooltip.text"
                                />
                            </LTooltip>
                        </LMarker>
                    </div>
                    <!-- end Point -->
                    <div v-if="tool.type === 'Textbox'">
                        <LMarker
                            :lat-lng="tool.coordinates"
                            :draggable="tool.isOn"
                            :icon="CircleIcon"
                            @update:latLng="
                                UPDATE_THIS_POINT_COORDINATE({ $event, tool })
                            "
                            @dblclick="goToThisDoc(tool._id)"
                            :visible="tool.visible"
                        >
                            <LIcon
                                v-if="tool.tooltip.text"
                                :icon-size="[tool.width, tool.height]"
                                :icon-anchor="[
                                    tool.width / 2,
                                    tool.height / 1.5,
                                ]"
                            >
                                <div
                                    class="textBoxTool_inMap"
                                    v-if="tool.tooltip.text"
                                    :style="{
                                        width: `${tool.width}px`,
                                        height: `${tool.height}px`,
                                        background:
                                            tool.color.hex8 || tool.color,
                                        fontSize: `${tool.fontSize}px`,
                                        color:
                                            tool.secondaryColor.hex8 ||
                                            tool.secondaryColor,
                                    }"
                                >
                                    <p>{{ tool.tooltip.text }}</p>
                                    <img
                                        v-if="tool.tooltip.image"
                                        :src="tool.tooltip.image"
                                        :alt="tool.tooltip.text"
                                    />
                                </div>
                            </LIcon>
                        </LMarker>
                    </div>
                    <!-- end Textbox  -->

                    <div v-if="tool.type === 'Heatmap' && tool.visible">
                        <LeafletHeatmap
                            :key="tool.key"
                            :lat-lng="tool.coordinates"
                            :radius="20"
                            :min-opacity="0.75"
                            :blur="17"
                            @dblclick="goToThisDoc(tool._id)"
                        />
                    </div>
                </div>
            </div>
            <!-- end docs_list -->

            <!-- <div v-if="searchPolygon">
                <LPolygon
                    :lat-lngs="polygonOrPolylineSimolationCoordinates"
                    v-if="searchPolygon.isOn"
                    :dashArray="'10,10'"
                    :opacity="0.5"
                    :color="searchPolygon.color"
                    :fill="false"
                />
                <LPolygon
                    :fillOpacity="0.2"
                    :fillColor="searchPolygon.secondaryColor"
                    :color="searchPolygon.color"
                    :lat-lngs="searchPolygon.coordinates"
                />
            </div> -->

            <LMarker
                :lat-lng="map.navigate.latlng"
                :icon="defaultIcon"
                v-if="map.navigate.show"
            ></LMarker>

            <VGeosearch :options="geosearchOptions" />

            <!-- <LControlLayers position="bottomright"></LControlLayers> -->

            <LControlZoom position="bottomright"></LControlZoom>

            <LControlPolylineMeasure
                :options="{
                    showUnitControl: true,
                    tooltipTextDelete:
                        'با نگه داشتن دکمه <b>shift</b> و کلیک بر روی نقطه <br/> آن را حذف کنید ...',
                    tooltipTextFinish:
                        'برای تمام کردن روی نقطه کلیک کنید. <br/>',
                    startCircle: { ...PMCO, radius: 5 },
                    intermedCircle: { ...PMCO, radius: 3 },
                    currentCircle: { ...PMCO, radius: 5 },
                    endCircle: { ...PMCO, radius: 3 },
                }"
                position="bottomright"
                v-if="!OnTool"
            />
            <!-- && 👆🏼 !searchPolygon.isOn -->

            <LControl position="bottomright" class="mapmaker undoControl">
                <a
                    href="#"
                    @click="undoTools"
                    v-if="undoCondition"
                    rel="nofollow"
                >
                    <i class="mdi mdi-undo-variant" aria-hidden="true"></i>
                </a>
            </LControl>
            <!-- <LControl position="bottomright" class="leaflet-control mapmaker">
                <a @click="toggleShowAllToolips()"  rel='nofollow' href="#">
                    <i class="far fa-comment-alt"></i>
                </a>
            </LControl> -->
        </LMap>
        <button class="scrollToContent" @click="scrollToContent()">
            <svg
                version="1.1"
                id="wave"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 119 26"
            >
                <path
                    class="path"
                    d="M120.8,26C98.1,26,86.4,0,60.4,0C35.9,0,21.1,26,0.5,26H120.8z"
                ></path>
            </svg>
            <span class="arrow primera next"
                ><i class="mdi mdi-chevron-up"></i
            ></span>
            <span class="arrow segunda next"
                ><i class="mdi mdi-chevron-up"></i
            ></span>
        </button>
    </div>
</template>
<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
    LMap,
    LTileLayer,
    LMarker,
    LPolygon,
    LPolyline,
    LTooltip,
    LIcon,
    LControl,
    LControlZoom,
    // LControlLayers,
} from "vue2-leaflet";

import LControlPolylineMeasure from "vue2-leaflet-polyline-measure";
import PolylineDecorator from "@/components/newDoc/helper Components/polyline-decorator";

import LeafletHeatmap from "@/components/newDoc/helper Components/Vue2LeafletHeatmap.common.js";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/assets/css/leaflet.css";

import { mapMutations, mapState, mapGetters, mapActions } from "vuex";

export default {
    name: "Map",
    data() {
        let achenSvgString = `
			<svg xmlns='http://www.w3.org/2000/svg' height="100" width="100">
				<circle cx="50" cy="50" r="40" stroke="#4a47ff" stroke-width="10" fill="white" />
			</svg>`;
        let myIconUrl = encodeURI(
            `data:image/svg+xml,${achenSvgString}`
        ).replace("#", "%23");
        let CircleIcon = L.icon({
            iconUrl: myIconUrl,
            iconSize: [10, 10],
            iconAnchor: [5, 5],
            popupAnchor: [4, -25],
        });
        let defaultIcon = L.divIcon({
            html: `<span></span><img class="leafletDefaultIcon" alt="ترسیم" src="data:image/png;base64,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"/>`,
            // "https://s3-eu-west-1.amazonaws.com/ct-documents/emails/A-static.png",
            iconSize: [21, 31],
            iconAnchor: [10.5, 31],
            popupAnchor: [4, -25],
        });

        return {
            CircleIcon,
            defaultIcon,
            geosearchOptions: {
                position: "topright",
                // Important part Here
                provider: new OpenStreetMapProvider(),
                showMarker: true,
                marker: {
                    // optional: L.Marker    - default L.Icon.Default
                    icon: defaultIcon,
                },
                searchLabel: "جستجو در نقشه",
                autoClose: true,
            },
            tooltipOptions: { permanent: false },
            PMCO: {
                // * polylineMetureCirclesOptions
                // Style settings for circle marker indicating the starting point of the polyline
                color: "#669b86", // Color of the border of the circle
                weight: 1, // Weight of the circle
                fillColor: "#00e8ff", // Fill color of the circle
                fillOpacity: 1, // Fill opacity of the circle
                // radius: 3, // Radius of the circle
            },
            clickCount: 0,
        };
    },
    computed: {
        ...mapState(["map"]), //"searchPolygon"
        ...mapGetters(["DocLayer", "docs_list", "DocWithChildsTools"]),

        OnTool() {
            const OnTool = this.$store.state.docs.DocProp.OnTool;
            if (OnTool.condition) return this.DocLayer?.tools[OnTool.index];
            else return false;
        },
        undoCondition() {
            // if (this.searchPolygon.isOn) return true;
            if (!this.DocLayer) return false;

            const thisTool = this.OnTool;
            if (!thisTool) return false;

            if (!["Point", "Textbox"].includes(thisTool.type)) return true;
            else return false;
        },
        polygonOrPolylineSimolationCoordinates() {
            const tool = this.OnTool; // || this.searchPolygon;
            if (!tool) return [];
            // const isPolygonOrPolylineOn =
            //     OnTool.type === "Polygon" || OnTool.type === "Polyline";

            // if (!isPolygonOrPolylineOn) return [];
            if (!tool.coordinates.length) return [];

            const coordinates = [...tool.coordinates, this.map.MouseCoordinate];
            return coordinates;
        },
    },
    methods: {
        scrollToContent() {
            const el = document.getElementById("content");
            if (el) el.scrollIntoView();
        },
        ...mapMutations("docs", [
            "UPDATE_THIS_POINT_COORDINATE",
            "OFF_THE_ON_TOOL",
            "UPDATE_ON_TOOL",
        ]),
        ...mapMutations("map", ["UPDATE_MOUSE_COOR", "SET_NAVIGATION_ICON"]),
        ...mapActions(["update_zoom", "update_center"]),
        update_mouse_coor(obj) {
            const editMode = ["update doc", "create doc"].includes(
                this.$router.currentRoute.name
            );
            if (!editMode) return;
            this.UPDATE_MOUSE_COOR(obj);
        },

        showNavigate({ latlng }) {
            const condition = ["create doc", "update doc"].includes(
                this.$router.currentRoute.name
            );
            if (condition) return;

            ++this.clickCount;
            if (this.clickCount % 2 == 0) {
                this.SET_NAVIGATION_ICON();
                this.$toasted.clear();
                return;
            }
            this.SET_NAVIGATION_ICON(latlng);

            this.$toasted.clear();
            this.$toasted.info("مسیر یابی با گوگل مپ", {
                icon: "mdi mdi-arrow-decision-outline",
                position: "bottom-center",
                duration: 30 * 1000,
                className: "navigate",
                action: [
                    {
                        text: "هدایت",
                        onClick: async (e, toastObject) => {
                            window.open(
                                `https://www.google.com/maps/dir//${latlng.lat},${latlng.lng}/@${latlng.lat},${latlng.lng},5.25z`,
                                "_blank"
                            );
                            toastObject.goAway(0);
                        },
                    },
                ],
            });
        },
        setClickCoordinates({ latlng }) {
            // if (this.searchPolygon.isOn) {
            //     this.searchPolygon.coordinates.push(latlng);
            //     return;
            // }
            const thisTool = this.OnTool;
            if (!thisTool) return;

            if (thisTool.type === "Point" || thisTool.type === "Textbox") {
                thisTool.coordinates = latlng;
                return;
            }
            const coor = thisTool.coordinates;
            if (thisTool.type === "Heatmap") {
                if (coor.length) {
                    // dont repeat coordinate
                    const lastCoor = coor[coor.length - 1];
                    if (
                        lastCoor[0] === latlng.lat &&
                        lastCoor[1] === latlng.lng
                    )
                        return;
                }
                coor.push([latlng.lat, latlng.lng, 1]);
                ++thisTool.key; // * rebuild the Heatmap
                return;
            }
            thisTool.coordinates.push(latlng);
        },
        goToThisDoc(_id) {
            const currentRoute = this.$router.currentRoute;
            const condition = ["create doc", "update doc"].includes(
                currentRoute.name
            );

            const pathThing = condition
                ? currentRoute.path.split("/")[1]
                : "read";

            const path = `/${pathThing}/${_id}`;
            if (path != currentRoute.fullPath) this.$router.push(path);
        },
        undoTools() {
            // if (this.searchPolygon.isOn) {
            //     this.searchPolygon.coordinates.pop();
            //     return;
            // }
            this.OnTool.coordinates.pop();
            if (this.OnTool.type === "Heatmap") ++this.OnTool.key; // * rebuild the Heatmap
        },
        // toggleShowAllToolips() {
        //     this.tooltipOptions.permanent = !this.tooltipOptions.permanent;
        //     this.mmmm = new Date().getTime();
        // },
    },
    mounted() {
        const mapObject = this.$refs.LeafletMap.mapObject;

        document.addEventListener(
            "showThisDoc",
            (event) => {
                const doc = event.detail;
                if (!doc) return;
                mapObject.flyTo(
                    doc.map_animate.coordinates,
                    doc.map_animate.zoom
                );
            },
            false
        );

        document.onkeydown = (evt) => {
            evt = evt || window.event;
            if (evt.keyCode === 27) {
                this.OFF_THE_ON_TOOL();
                this.UPDATE_ON_TOOL();
            }
        };
    },
    components: {
        LMap,
        LTileLayer,
        LMarker,
        LPolygon,
        LPolyline,
        LIcon,
        LControl,
        LControlZoom,
        LControlPolylineMeasure,
        PolylineDecorator,
        LTooltip,
        // LControlLayers,
        VGeosearch: () => import("vue2-leaflet-geosearch"),
        LayerPicker: () => import("@/components/layerPicker"),
        LeafletHeatmap,
    },
};
</script>