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

			<div v-if="allPoints.length">
				<l-marker
					:key="marker._id"
					@click="readThisPoint"
					v-for="marker in allPoints"
					:lat-lng="{
						lat: marker.location.coordinates[1],
						lng: marker.location.coordinates[0],
					}"
				>
					<!-- <l-tooltip v-if="marker.tooltip ">{{ //marker.tooltip }}</l-tooltip> -->
				</l-marker>
			</div>
			<div v-if="newPoint.length > 0">
				<div v-if="docLayer.Polygons.length">
					<div v-for="(polygon, index) in docLayer.Polygons" :key="index">
						<l-polygon
							:lat-lngs="polygonOrPolylineSimolationCoordinates"
							v-if="polygon.isOn"
							:dashArray="'10,10'"
							:opacity="0.5"
							:color="polygon.color"
							:fill="false"
						/>
						<l-polygon
							:fillOpacity="0.4"
							:fillColor="polygon.fillColor"
							:color="polygon.color"
							:lat-lngs="polygon.coordinates"
						>
							<l-tooltip v-if="polygon.tooltip">{{ polygon.tooltip }}</l-tooltip>
						</l-polygon>
					</div>
				</div>

				<div v-if="docLayer.Polylines.length">
					<div v-for="(polyline, index) in docLayer.Polylines" :key="index">
						<l-polyline
							:lat-lngs="polygonOrPolylineSimolationCoordinates"
							:color="polyline.color"
							v-if="polyline.isOn"
							:dashArray="'10,10'"
							:opacity="0.5"
							:fill="false"
						/>
						<l-marker
							v-for="(coordinate, index) in polyline.coordinates"
							:lat-lng="coordinate"
							:key="index"
							:icon="CircleIcon"
						/>
						<l-polyline :lat-lngs="polyline.coordinates" :color="polyline.color" />
					</div>
				</div>

				<div v-if="docLayer.Points.length">
					<l-marker
						v-for="(point, index) in docLayer.Points"
						:key="index"
						:lat-lng="point.coordinates"
						:draggable="point.isOn"
						@update:latLng="UPDATE_THIS_POINT_COORDINATE"
						:icon="defaultIcon"
					>
						<l-tooltip v-if="point.tooltip">{{ point.tooltip }}</l-tooltip>
					</l-marker>
				</div>
			</div>
			<!-- <l-marker
				:lat-lng="markerLatLng"
				:draggable="true"
				@update:latLng="latUpdated"
				@click="logsomthing"
			>
				<l-icon
					:icon-size="dynamicSize"
					:icon-anchor="dynamicAnchor"
					icon-url="@/assets/icon for test.png"
				>
					<div class="headline">
						<img :src="img" alt />
					</div>
				</l-icon>
				<l-tooltip>Hello!</l-tooltip>
			</l-marker>-->
			<l-control-zoom position="bottomright"></l-control-zoom>

			<l-control-polyline-measure
				:options="{ showUnitControl: true }"
				position="bottomright"
				v-if="!newDocProp.OnTool.condition"
			/>
			<l-control position="bottomright" class="leaflet-control mapmaker">
				<a @click="undoTools" v-if="newDocProp.OnTool.condition">
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
	// LIcon,
	LControl,
	LControlZoom
} from "vue2-leaflet";
import LControlPolylineMeasure from "vue2-leaflet-polyline-measure";

// import imgadr from "@/assets/img/icon for test.png";
// import points from "../../data/points.json";
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
			// bounds: null,
			iconSize: 64,
			CircleIcon,
			defaultIcon

			// points: [],
		};
	},
	computed: {
		...mapState([
			"allPoints",
			"mapCenter",
			"newPoint",
			"newDocProp",
			"zoom",
			"MouseCoordinate",
			"polylineTool"
		]),
		docLayer() {
			return this.$store.getters.newDocLayer;
		},
		polygonOrPolylineSimolationCoordinates() {
			const type = this.newDocProp.OnTool.type;
			const isPolygonOrPolylineOn =
				type == "Polygons" || type == "Polylines";

			if (isPolygonOrPolylineOn && this.MouseCoordinate) {
				const index = this.newDocProp.OnTool.index;
				const thisTool = this.docLayer[type][index];

				if (thisTool.coordinates.length > 0) {
					const coordinates = [
						...thisTool.coordinates,
						{
							lat: this.MouseCoordinate.lat,
							lng: this.MouseCoordinate.lng
						}
					];
					return coordinates;
				}
			}
			return [];
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
			// console.log(c.latlng);
			this.$store.state.clickCoordinates = c.latlng;
			const OnTool = this.newDocProp.OnTool;
			if (OnTool.condition) {
				if (OnTool.type == "Points") return;
				const type = OnTool.type;
				const index = OnTool.index;
				this.docLayer[type][index].coordinates.push(c.latlng);
			}
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
				this.docLayer[OnTool.type][OnTool.index].coordinates.pop();
		}
	},
	components: {
		LMap,
		LTileLayer,
		LMarker,
		LPolygon,
		LPolyline,
		// LIcon,
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
