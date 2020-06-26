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
		>
			<l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
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

			<div v-if="newDocs.length > 0 ">
				<div v-if="docLayer.tools.length > 0">
					<div v-for="(tool, index) in docLayer.tools" :key="index">
						<div v-if="tool.type == 'Polygon'">
							<l-polygon
								:lat-lngs="polygonOrPolylineSimolationCoordinates"
								v-if=" tool.isOn"
								:dashArray="'10,10'"
								:opacity="0.5"
								:color="tool.color"
								:fill="false"
							/>
							<l-polygon
								:fillOpacity="0.4"
								:fillColor="tool.fillColor"
								:color="tool.color"
								:lat-lngs="tool.coordinates"
							>
								<l-tooltip v-if="tool.tooltip">{{ tool.tooltip }}</l-tooltip>
							</l-polygon>
						</div>
						<div v-if="tool.type == 'Polyline'">
							<l-polyline
								:lat-lngs="polygonOrPolylineSimolationCoordinates"
								:color="tool.color"
								v-if="tool.isOn"
								:dashArray="'10,10'"
								:opacity="0.5"
								:fill="false"
							/>
							<l-marker
								v-for="(coordinate, index) in tool.coordinates"
								:lat-lng="coordinate"
								:key="index"
								:icon="CircleIcon"
							/>
							<l-polyline :lat-lngs="tool.coordinates" :color="tool.color">
								<l-tooltip v-if="tool.tooltip">{{ tool.tooltip }}</l-tooltip>
							</l-polyline>
						</div>
						<div v-if="tool.type == 'Point'">
							<l-marker
								:lat-lng="tool.coordinates"
								:draggable="tool.isOn"
								@update:latLng="UPDATE_THIS_POINT_COORDINATE"
								:icon="defaultIcon"
							>
								<l-icon
									:icon-size="dynamicSize"
									:icon-anchor="dynamicAnchor"
									:icon-url="`/icons/${tool.icon}.svg`"
									v-if="tool.icon"
								>
									<!-- <img
										:width="dynamicSize"
										:src="`/icons/${tool.icon}.svg`"
										style="transform: rotate(20deg)"
									/>-->
								</l-icon>
								<l-tooltip v-if="tool.tooltip">{{ tool.tooltip }}</l-tooltip>
							</l-marker>
						</div>
					</div>
				</div>
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
	LControlZoom
} from "vue2-leaflet";
import LControlPolylineMeasure from "vue2-leaflet-polyline-measure";
import { mapMutations, mapState } from "vuex";

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
			popupAnchor: [4, -25]
		});
		let defaultIcon = L.icon({
			iconUrl:
				"https://s3-eu-west-1.amazonaws.com/ct-documents/emails/A-static.png",
			iconSize: [21, 31],
			iconAnchor: [10.5, 31],
			popupAnchor: [4, -25]
		});
		return {
			iconSize: 35,
			CircleIcon,
			defaultIcon
		};
	},
	computed: {
		...mapState([
			"allPoints",
			"mapCenter",
			"newDocs",
			"newDocProp",
			"zoom",
			"MouseCoordinate",
			"polylineTool"
		]),
		docLayer() {
			return this.$store.getters.newDocLayer;
		},
		undoCondition() {
			const onTool = this.newDocProp.OnTool;
			if (!onTool.condition) return false;
			const thisTool = this.docLayer.tools[onTool.index];
			if (thisTool.type !== "Point") return true;
			else return false;
		},
		polygonOrPolylineSimolationCoordinates() {
			const OnToolProp = this.newDocProp.OnTool;
			if (!OnToolProp.condition) return [];
			const OnTool = this.docLayer.tools[OnToolProp.index];
			const isPolygonOrPolylineOn =
				OnTool.type == "Polygon" || OnTool.type == "Polyline";
			if (!isPolygonOrPolylineOn && !this.MouseCoordinate) return [];
			if (OnTool.coordinates.length < 1) return [];
			const coordinates = [
				...OnTool.coordinates,
				{
					lat: this.MouseCoordinate.lat,
					lng: this.MouseCoordinate.lng
				}
			];
			return coordinates;
		},
		dynamicSize() {
			return [this.iconSize, this.iconSize * 1.15];
		},
		dynamicAnchor() {
			return [this.iconSize / 2, this.iconSize * 1.15];
		}
	},
	methods: {
		...mapMutations([
			"newPointMarker",
			"closeNewPointMarker",
			"mapCenterUpdated",
			"readThisPoint",
			"UPDATE_THIS_POINT_COORDINATE",
			"UPDATE_NEW_DOC_INDEX"
		]),
		setClickCoordinates(c) {
			const OnTool = this.newDocProp.OnTool;
			if (!OnTool.condition) return;
			const thisTool = this.docLayer.tools[OnTool.index];
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
				this.docLayer.tools[OnTool.index].coordinates.pop();
		}
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
		LTooltip
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
.map {
	height: 80vh;
	width: 60%;
	position: relative;
	overflow: hidden;
	margin-right: auto;
	outline: none;
	border: red dashed 1px;
	direction: ltr;
}
</style>
