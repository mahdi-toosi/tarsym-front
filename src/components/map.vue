<template>
	<div>
		<l-map
			:icon="defaultIcon"
			class="map"
			:zoom="zoom"
			:center="mapCenter"
			@click="setClickCoordinates"
			@update:zoom="zoomUpdated"
			:options="{ zoomControl: false }"
			@update:center="mapCenterUpdated"
			@mousemove="setMouseCoordinate"
			:minZoom="4"
			ref="myMap"
		>
			<l-tile-layer :url="openStreetTileURL" layerType="satellite" />

			<!-- <div v-if="allPoints.length">
				<l-marker
					:key="marker._id"
					@click="readThisPoint"
					v-for="marker in allPoints"
					:lat-lng="{
						lat: marker.location.coordinates[1],
						lng: marker.location.coordinates[0],
					}"
			>-->
			<!-- <l-tooltip v-if="marker.tooltip ">{{ //marker.tooltip }}</l-tooltip> -->
			<!-- </l-marker>
			</div>-->

			<div v-if="docs_list.length > 0 ">
				<!-- <div v-if="newDocLayer.tools.length > 0"> -->
				<div
					v-for="(tool, index) in 
							($route.name == 'my docs' || $route.name == 'all docs') 
							? allDocPageTools 
							: newDocLayer.tools "
					:key="index"
				>
					<div v-if="tool.type == 'Polygon'">
						<span v-if="newDocProp.OnTool.condition">
							<l-polygon
								:lat-lngs="polygonOrPolylineSimolationCoordinates"
								v-if=" tool.isOn"
								:dashArray="'10,10'"
								:opacity="0.5"
								:color="tool.color"
								:fill="false"
							/>
						</span>
						<l-polygon
							:fillOpacity="0.4"
							:fillColor="tool.secondaryColor"
							:color="tool.color"
							:lat-lngs="tool.coordinates"
						>
							<l-tooltip v-if="tool.tooltip">{{ tool.tooltip }}</l-tooltip>
						</l-polygon>
					</div>
					<!-- end Polygon -->
					<div v-if="tool.type == 'Polyline'">
						<span v-if="newDocProp.OnTool.condition">
							<l-polyline
								:lat-lngs="polygonOrPolylineSimolationCoordinates"
								:color="tool.color"
								v-if="tool.isOn"
								:dashArray="'10,10'"
								:opacity="0.5"
								:fill="false"
							/>
						</span>
						<!-- <l-marker
								v-for="(coordinate, index) in tool.coordinates"
								:lat-lng="coordinate"
								:key="index"
								:icon="CircleIcon"
						/>-->
						<l-polyline
							:lat-lngs="tool.coordinates"
							:color="tool.color"
							:dashArray=" tool.dashed ? '10,10' : '' "
							@click="mahdi(tool)"
						>
							<l-tooltip v-if="tool.tooltip">{{ tool.tooltip }}</l-tooltip>
						</l-polyline>
						<polyline-decorator
							:lat-lngs="tool.coordinates"
							:icon-size="tool.iconSize"
							:icon-name="tool.iconName"
							:icon-color="tool.secondaryColor"
							:icon-rotate="tool.angle"
							:icon-repeat="tool.iconRepeat"
							:arrow-color="tool.color"
							:show-icon="tool.showIcon"
							:show-arrow="tool.showArrow"
						/>
					</div>
					<!-- end Polyline -->
					<div v-if="tool.type == 'Point'">
						<l-marker
							:lat-lng="tool.coordinates"
							:draggable="tool.isOn"
							@update:latLng="UPDATE_THIS_POINT_COORDINATE"
							:icon="defaultIcon"
						>
							<l-icon
								:icon-size="dynamicSize(tool.iconSize)"
								:icon-anchor="dynamicAnchor(tool.iconSize)"
								v-if="tool.iconName"
							>
								<i
									:class="tool.iconName"
									:style="{ fontSize: tool.iconSize + 'px', 
												color: tool.secondaryColor , 
												transform: 'rotate('+tool.angle+ 'deg)' 
												}"
								/>
							</l-icon>
							<l-tooltip v-if="tool.tooltip">{{ tool.tooltip }}</l-tooltip>
						</l-marker>
					</div>
					<!-- end Point -->
					<div v-if="tool.type == 'Textbox'">
						<l-marker
							:lat-lng="tool.coordinates"
							:draggable="tool.isOn"
							:icon="defaultIcon"
							@update:latLng="UPDATE_THIS_POINT_COORDINATE"
						>
							<l-icon
								v-if="tool.tooltip"
								:icon-size="[ tool.width, tool.height ]"
								:icon-anchor="[ tool.width/2, tool.height/2 ]"
							>
								<div
									class="bubble"
									v-if="tool.tooltip"
									:style="{ width: tool.width + 'px',
												height: tool.height + 'px',
												background: tool.color, 
												fontSize: tool.fontSize + 'px',
												color: tool.secondaryColor
												}"
								>{{ tool.tooltip }}</div>
								<!-- <div class="pointer"></div> -->
							</l-icon>
						</l-marker>
					</div>
					<!-- end Textbox  -->
				</div>
				<!-- </div> -->
			</div>

			<l-control-zoom position="bottomright"></l-control-zoom>
			<l-control-polyline-measure
				:options="{ showUnitControl: true }"
				position="bottomright"
				v-if="!newDocProp.OnTool.condition"
			/>
			<l-control position="bottomright" class="leaflet-control mapmaker">
				<a @click="undoTools" v-if="undoCondition">
					<i class="fa fa-undo" aria-hidden="true"></i>
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
} from "vue2-leaflet";
require("leaflet-easyprint");
import LControlPolylineMeasure from "vue2-leaflet-polyline-measure";
import polylineDecorator from "@/components/polyline-decorator";
import { mapMutations, mapState, mapGetters } from "vuex";
export default {
	name: "leaflet-oprator-map",
	data() {
		let achenSvgString = `
			<svg xmlns='http://www.w3.org/2000/svg' height="100" width="100">
				<circle cx="50" cy="50" r="40" stroke="#4a47ff" stroke-width="10" fill="white" />
			</svg>`;
		let myIconUrl = encodeURI(
			"data:image/svg+xml," + achenSvgString
		).replace("#", "%23");
		let CircleIcon = L.icon({
			iconUrl: myIconUrl,
			iconSize: [10, 10],
			iconAnchor: [5, 5],
			popupAnchor: [4, -25],
		});
		let defaultIcon = L.icon({
			iconUrl:
				"https://s3-eu-west-1.amazonaws.com/ct-documents/emails/A-static.png",
			iconSize: [21, 31],
			iconAnchor: [10.5, 31],
			popupAnchor: [4, -25],
		});
		return {
			// bingApiKey: "1mNX1ryO2Ny_3kzHceofAUIfZFIk8LEjB37y43NYPBzk-jgBLvPxc",
			openStreetTileURL:
				"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
			CircleIcon,
			defaultIcon,
		};
	},
	computed: {
		...mapState(["mapCenter", "newDocProp", "zoom", "MouseCoordinate"]),
		...mapGetters(["newDocLayer", "docs_list", "allDocPageTools"]),
		undoCondition() {
			const onTool = this.newDocProp.OnTool;
			if (!onTool.condition) return false;
			const thisTool = this.newDocLayer.tools[onTool.index];
			if (thisTool.type !== "Point") return true;
			else return false;
		},
		polygonOrPolylineSimolationCoordinates() {
			const OnToolProp = this.newDocProp.OnTool;
			const OnTool = this.newDocLayer.tools[OnToolProp.index];
			const isPolygonOrPolylineOn =
				OnTool.type == "Polygon" || OnTool.type == "Polyline";
			if (!isPolygonOrPolylineOn && !this.MouseCoordinate) return [];
			if (OnTool.coordinates.length < 1) return [];
			const coordinates = [
				...OnTool.coordinates,
				{
					lat: this.MouseCoordinate.lat,
					lng: this.MouseCoordinate.lng,
				},
			];
			return coordinates;
		},
	},
	methods: {
		...mapMutations([
			"newPointMarker",
			"mapCenterUpdated",
			"readThisPoint",
			"UPDATE_THIS_POINT_COORDINATE",
		]),
		dynamicSize(iconSize) {
			return [iconSize, iconSize * 1.15];
		},
		dynamicAnchor(iconSize) {
			return [iconSize / 2, iconSize * 1.15];
		},
		setClickCoordinates(c) {
			const OnTool = this.newDocProp.OnTool;
			if (!OnTool.condition) return;
			const thisTool = this.newDocLayer.tools[OnTool.index];
			if (thisTool.type == "Point") return;
			thisTool.coordinates.push(c.latlng);
		},
		setMouseCoordinate(m) {
			this.$store.state.MouseCoordinate = m.latlng;
		},
		zoomUpdated(z) {
			this.$store.state.zoom = z;
		},
		undoTools() {
			const OnTool = this.newDocProp.OnTool;
			if (OnTool.condition)
				this.newDocLayer.tools[OnTool.index].coordinates.pop();
		},
	},
	mounted() {
		L.easyPrint({
			position: "bottomleft",
			sizeModes: ["Current"],
			exportOnly: true,
			filename: "tarsym",
		}).addTo(this.$refs.myMap.mapObject);
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
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
.map {
	height: 100vh;
	width: 60%;
	position: relative;
	overflow: hidden;
	margin-right: auto;
	outline: none;
	// border: red dashed 1px;
	direction: ltr;
}
</style>
