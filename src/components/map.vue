<template>
	<div>
		<!-- <div class="info" style="height: 15%"> -->
		<!-- <p>Map Center: {{ mapCenter }}</p> -->
		<!-- <span>
				<button @click="addnewpoint">add point</button>
		</!-->
		<!-- <p>Zoom: {{ this.$store.state.zoom }}</p> -->
		<!-- <p>add marker: {{ this.$store.state.newPointCoordinate }}</p> -->
		<!-- </div> -->
		<l-map
			class="map"
			:zoom="zoom"
			:center="mapCenter"
			:options="{ zoomControl: false }"
			@update:zoom="zoomUpdated"
			@update:center="mapCenterUpdated"
			@mousemove="setMouseCoordinate"
		>
			<l-tile-layer :url="url"></l-tile-layer>

			<l-marker
				v-for="marker in allPoints"
				:key="marker._id"
				:lat-lng="{
                    lat: marker.location.coordinates[1],
                    lng: marker.location.coordinates[0]
                }"
				@click="readThisPoint"
			>
				<!-- <l-tooltip v-if="marker.tooltip ">{{ //marker.tooltip }}</l-tooltip> -->
			</l-marker>
			<l-polygon :lat-lngs="polygon.latlngs" :color="polygon.color"></l-polygon>

			<!-- <l-marker
				v-if="situations.newPoint"
				:lat-lng="newPoint.coordinates"
				:draggable="newPoint.draggable"
				@update:latLng="newPointCoordinateUpdated"
			>
				<l-tooltip>{{ newPoint.tooltip }}</l-tooltip>
			</l-marker>-->

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

			<l-control position="topleft" class="leaflet-control mapmaker">
				<a href="#" @click="newPointMarker" v-show="!situations.newPoint">
					<i class="fas fa-map-marker-alt"></i>
				</a>
				<a href="#" @click="closeNewPointMarker" v-show="situations.newPoint">
					<i class="fas fa-times"></i>
				</a>
			</l-control>
		</l-map>
	</div>
</template>
<script>
import "leaflet/dist/leaflet.css";
import {
	LMap,
	LTileLayer,
	LMarker,
	LPolygon,
	// LTooltip,
	// LIcon,
	LControl,
	LControlZoom
} from "vue2-leaflet";
// import { Icon } from "leaflet";
// delete Icon.Default.prototype._getIconUrl;
// Icon.Default.mergeOptions({
// 	iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
// 	iconUrl: require("leaflet/dist/images/marker-icon.png"),
// 	shadowUrl: require("leaflet/dist/images/marker-shadow.png")
// });

// import imgadr from "@/assets/img/icon for test.png";
// import points from "../../data/points.json";
import { mapMutations, mapState } from "vuex";
export default {
	name: "leaflet-map",
	data() {
		return {
			url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
			// bounds: null,
			iconSize: 64,
			polygon: {
				latlngs: [
					[47.2263299, -1.6222],
					[47.21024000000001, -1.6270065],
					[47.1969447, -1.6136169],
					[47.18527929999999, -1.6143036],
					[47.1794457, -1.6098404],
					[47.1775788, -1.5985107],
					[47.1676598, -1.5753365],
					[47.1593731, -1.5521622],
					[47.1593731, -1.5319061],
					[47.1722111, -1.5143967],
					[47.1960115, -1.4841843],
					[47.2263299, -1.6222]
				],
				color: "green"
			}
			// points: []
		};
	},
	computed: {
		...mapState([
			"allPoints",
			"situations",
			"mapCenter",
			"newPoint",
			"zoom",
			"MouseCoordinate"
		]),
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
			"readThisPoint"
		]),
		setMouseCoordinate(m) {
			this.MouseCoordinate = m.latlng;
		},
		zoomUpdated(zoom) {
			this.zoom = zoom;
		},
		newPointCoordinateUpdated(coordinate) {
			this.$store.state.newPoint.coordinates = coordinate;
		}
	},
	mounted() {},
	components: {
		LMap,
		LTileLayer,
		LMarker,
		LPolygon,
		// LIcon,
		LControl,
		LControlZoom
		// LTooltip
	}
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
	border: red dashed 1px;
	direction: ltr;
}
</style>
