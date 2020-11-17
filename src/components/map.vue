<template>
    <div>
        <l-map
            :icon="defaultIcon"
            class="map"
            :zoom="map.zoom"
            :center="map.center"
            @click="setClickCoordinates"
            @update:zoom="UPDATE_MAP_ZOOM"
            :options="{ zoomControl: false }"
            @update:center="UPDATE_MAP_CENTER"
            @mousemove="setMouseCoordinate"
            :minZoom="4"
            ref="LeafletMap"
        >
            <l-control-layers position="bottomright"></l-control-layers>
            <l-tile-layer
                v-for="tileProvider in map.tileProviders"
                :key="tileProvider.name"
                :name="tileProvider.name"
                :visible="tileProvider.visible"
                :url="tileProvider.url"
                layer-type="base"
            />

            <div v-if="docs_list.length">
                <div v-for="(tool, index) in DocWithChildsTools" :key="index">
                    <div v-if="tool.type === 'Polygon'">
                        <l-polygon
                            :lat-lngs="polygonOrPolylineSimolationCoordinates"
                            v-if="OnTool && tool.isOn"
                            :dashArray="'10,10'"
                            :opacity="0.5"
                            :color="tool.color.hex8 || tool.color"
                            :fill="false"
                        />
                        <l-polygon
                            :fillOpacity="0.4"
                            :fillColor="
                                tool.secondaryColor.hex8 || tool.secondaryColor
                            "
                            :color="tool.color.hex8 || tool.color"
                            :lat-lngs="tool.coordinates"
                            @click="goToThisDoc(tool._id)"
                            :visible="tool.visible"
                        >
                            <l-tooltip v-if="tool.tooltip">{{
                                tool.tooltip
                            }}</l-tooltip>
                        </l-polygon>
                    </div>
                    <!-- end Polygon -->
                    <div v-if="tool.type === 'Polyline'">
                        <l-polyline
                            :lat-lngs="polygonOrPolylineSimolationCoordinates"
                            :color="tool.color.hex8 || tool.color"
                            v-if="OnTool && tool.isOn"
                            :dashArray="'10,10'"
                            :opacity="0.5"
                            :fill="false"
                        />
                        <!-- <l-marker
								v-for="(coordinate, index) in tool.coordinates"
								:lat-lng="coordinate"
								:key="index"
								:icon="CircleIcon"
                        />-->
                        <l-polyline
                            :lat-lngs="tool.coordinates"
                            :color="tool.color.hex8 || tool.color"
                            :dashArray="tool.dashed ? '10,10' : ''"
                            @click="goToThisDoc(tool._id)"
                            :visible="tool.visible"
                        >
                            <l-tooltip v-if="tool.tooltip">
                                {{ tool.tooltip }}
                            </l-tooltip>
                        </l-polyline>
                        <polyline-decorator
                            @click="goToThisDoc(tool._id)"
                            :lat-lngs="tool.coordinates"
                            :icon-size="tool.iconSize"
                            :icon-name="tool.iconName"
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
                        <l-marker
                            :lat-lng="tool.coordinates"
                            :draggable="tool.isOn"
                            @update:latLng="
                                UPDATE_THIS_POINT_COORDINATE({ $event, tool })
                            "
                            :icon="defaultIcon"
                            @click="goToThisDoc(tool._id)"
                            :visible="tool.visible"
                        >
                            <l-icon
                                :icon-size="dynamicSize(tool.iconSize)"
                                :icon-anchor="dynamicAnchor(tool.iconSize)"
                                v-if="tool.iconName"
                            >
                                <!-- if tool is on , this span make ripple wave effect -->
                                <span></span>
                                <i
                                    :class="tool.iconName"
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
                            </l-icon>
                            <l-tooltip
                                v-if="tool.tooltip"
                                :options="tooltipOptions"
                                @click="goToThisDoc(tool._id)"
                                :key="mmmm"
                            >
                                {{ tool.tooltip }}
                            </l-tooltip>
                        </l-marker>
                    </div>
                    <!-- end Point -->
                    <div v-if="tool.type === 'Textbox'">
                        <l-marker
                            :lat-lng="tool.coordinates"
                            :draggable="tool.isOn"
                            :icon="CircleIcon"
                            @update:latLng="
                                UPDATE_THIS_POINT_COORDINATE({ $event, tool })
                            "
                            @click="goToThisDoc(tool._id)"
                            :visible="tool.visible"
                        >
                            <l-icon
                                v-if="tool.tooltip"
                                :icon-size="[tool.width, tool.height]"
                                :icon-anchor="[tool.width / 2, tool.height / 2]"
                            >
                                <div
                                    class="textBoxTool_inMap"
                                    v-if="tool.tooltip"
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
                                    {{ tool.tooltip }}
                                </div>
                            </l-icon>
                        </l-marker>
                    </div>
                    <!-- end Textbox  -->
                </div>
            </div>
            <!-- end docs_list -->

            <div v-if="searchPolygon">
                <l-polygon
                    :lat-lngs="polygonOrPolylineSimolationCoordinates"
                    v-if="searchPolygon.isOn"
                    :dashArray="'10,10'"
                    :opacity="0.5"
                    :color="searchPolygon.color"
                    :fill="false"
                />
                <l-polygon
                    :fillOpacity="0.2"
                    :fillColor="searchPolygon.secondaryColor"
                    :color="searchPolygon.color"
                    :lat-lngs="searchPolygon.coordinates"
                />
            </div>

            <v-geosearch :options="geosearchOptions"></v-geosearch>

            <l-control-zoom position="bottomright"></l-control-zoom>
            <l-control-polyline-measure
                :options="{ showUnitControl: true }"
                position="bottomright"
                v-if="!OnTool && !searchPolygon.isOn"
            />
            <l-control position="bottomright" class="leaflet-control mapmaker">
                <a @click="undoTools" v-if="undoCondition">
                    <i class="fa fa-undo" aria-hidden="true"></i>
                </a>
            </l-control>
            <l-control position="bottomright" class="leaflet-control mapmaker">
                <a @click="toggleShowAllToolips()">
                    <i class="far fa-comment-alt"></i>
                </a>
            </l-control>
        </l-map>
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
    LControlLayers,
} from "vue2-leaflet";
require("leaflet-easyprint");
import LControlPolylineMeasure from "vue2-leaflet-polyline-measure";
import polylineDecorator from "@/components/newDoc/helper Components/polyline-decorator";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import VGeosearch from "vue2-leaflet-geosearch";
import "leaflet-geosearch/assets/css/leaflet.css";
import { mapMutations, mapState, mapGetters } from "vuex";
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
            html: `<span></span><img class="leafletDefaultIcon" src="data:image/png;base64,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"/>`,
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
                searchLabel: "جستجو در نقشه ...",
                autoClose: true,
            },
            tooltipOptions: { permanent: false },
            mmmm: 54825,
        };
    },
    computed: {
        ...mapState(["map", "DocProp", "searchPolygon"]),
        ...mapGetters(["DocLayer", "docs_list", "DocWithChildsTools"]),
        OnTool() {
            const OnTool = this.DocProp.OnTool;
            if (OnTool.condition) return this.DocLayer.tools[OnTool.index];
            else return false;
        },
        undoCondition() {
            if (this.searchPolygon.isOn) return true;
            if (!this.DocLayer) return false;

            const thisTool = this.OnTool;
            if (thisTool) return false;

            if (!["Point", "Textbox"].includes(thisTool.type)) return true;
            else return false;
        },
        polygonOrPolylineSimolationCoordinates() {
            const tool = this.OnTool || this.searchPolygon;
            // if (!OnTool) return;
            // const isPolygonOrPolylineOn =
            //     OnTool.type === "Polygon" || OnTool.type === "Polyline";

            // if (!isPolygonOrPolylineOn) return [];
            if (!tool.coordinates.length) return [];

            const coordinates = [...tool.coordinates, this.map.MouseCoordinate];
            return coordinates;
        },
    },
    methods: {
        ...mapMutations([
            "UPDATE_MAP_CENTER",
            "UPDATE_THIS_POINT_COORDINATE",
            "CHANGE_LAYER_INDEX",
            "UPDATE_MAP_ZOOM",
        ]),
        dynamicSize(iconSize) {
            return [iconSize, iconSize * 1.15];
        },
        dynamicAnchor(iconSize) {
            return [iconSize / 2, iconSize * 1.15];
        },
        setClickCoordinates(c) {
            if (this.searchPolygon.isOn) {
                this.searchPolygon.coordinates.push(c.latlng);
                return;
            }
            const thisTool = this.OnTool;
            if (!thisTool) return;

            if (thisTool.type === "Point" || thisTool.type === "Textbox") {
                thisTool.coordinates = [c.latlng.lat, c.latlng.lng];
                return;
            }
            thisTool.coordinates.push(c.latlng);
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
        setMouseCoordinate(coordinates) {
            this.map.MouseCoordinate = coordinates.latlng;
        },
        undoTools() {
            if (this.searchPolygon.isOn) {
                this.searchPolygon.coordinates.pop();
                return;
            }
            this.OnTool.coordinates.pop();
        },
        toggleShowAllToolips() {
            this.tooltipOptions.permanent = !this.tooltipOptions.permanent;
            this.mmmm = Math.ceil(Math.random() * 100);
        },
    },
    mounted() {
        const mapObject = this.$refs.LeafletMap.mapObject;
        L.easyPrint({
            position: "bottomleft",
            sizeModes: ["Current"],
            exportOnly: true,
            filename: "tarsym",
        }).addTo(mapObject);

        document.addEventListener(
            "showThisDoc",
            (event) => {
                const doc = event.detail;
                if (!doc || !doc.map_animate) return;
                mapObject.flyTo(
                    doc.map_animate.coordinates,
                    doc.map_animate.zoom
                );
            },
            false
        );

        mapObject.on("baselayerchange", (Layer) => {
            const layerIndex = this.map.tileProviders.findIndex(
                (el) => el.name === Layer.name
            );
            this.CHANGE_LAYER_INDEX(layerIndex);
        });

        // * edit search in map
        setTimeout(() => {
            const button = document.querySelector(
                ".leaflet-control-geosearch .reset"
            );
            button.innerHTML = "";
            const closeIcon = document.createElement("i");
            closeIcon.classList.add("fas", "fa-times");
            button.appendChild(closeIcon);
        }, 2000);
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
        polylineDecorator,
        LTooltip,
        LControlLayers,
        VGeosearch,
    },
};
</script>

