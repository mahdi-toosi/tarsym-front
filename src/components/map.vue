<template>
	<div>
		<l-map
			class="map"
			:zoom="zoom"
			:center="mapCenter"
			:options="{ zoomControl: false }"
			@update:zoom="zoomUpdated"
			@update:center="mapCenterUpdated"
			@mousemove="setMouseCoordinate"
			@click="setClickCoordinates"
		>
			<l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

			<l-marker
				v-for="marker in allPoints"
				:key="marker._id"
				:lat-lng="{
					lat: marker.location.coordinates[1],
					lng: marker.location.coordinates[0],
				}"
				@click="readThisPoint"
			>
				<!-- <l-tooltip v-if="marker.tooltip ">{{ //marker.tooltip }}</l-tooltip> -->
			</l-marker>
			<l-polygon
				:lat-lngs="polygon.latlngs"
				:color="polygon.color"
				:fillOpacity="0.15"
			/>
			<l-polygon
				:dashArray="'10,10'"
				:lat-lngs="polygonSimolationLatlngs"
				:color="'red'"
				v-if="this.polygonToolOn"
				:fill="false"
				:opacity="0.5"
			/>

			<!-- <l-moving-marker
				v-for="driver in drivers"
				:key="driver.uuid"
				v-if="driver.location"
				:lat-lng="getLocation(driver)"
				:icon="getIcon(driver.uuid)"
				@click="setCurrentDriver(driver)"
				ref="driverMarker"
				:duration="2000"
			/> -->

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

			<l-control position="bottomright" class="leaflet-control mapmaker">
				<!-- <a href="#" @click="newPointMarker" v-if="!situations.newPoint">
					<i class="fas fa-map-marker-alt"></i>
				</a>
				<a href="#" @click="closeNewPointMarker" v-if="situations.newPoint">
					<i class="fas fa-times"></i>
				</a>-->
				<a @click="polygon.latlngs.pop()" v-if="this.polygonToolOn">
					<i class="fa fa-undo" aria-hidden="true"></i>
				</a>
			</l-control>
		</l-map>
		<button @click="polygonToolSwitch">
			polygon tool {{ polygonToolOn ? "on" : "off" }}
		</button>
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
	LControlZoom,
} from "vue2-leaflet";
// import LMovingMarker from "vue2-leaflet-movingmarker";

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
			// bounds: null,
			iconSize: 64,
			polygonToolOn: false,
			polygon: {
				latlngs: [],
				color: "green",
			},
			// points: [],
		};
	},
	computed: {
		...mapState([
			"allPoints",
			"situations",
			"mapCenter",
			"newPoint",
			"zoom",
			"MouseCoordinate",
		]),
		polygonSimolationLatlngs() {
			if (
				this.polygonToolOn &&
				this.MouseCoordinate.lat &&
				this.polygon.latlngs.length > 0
			) {
				const latlngs = [
					...this.polygon.latlngs,
					{
						lat: this.MouseCoordinate.lat,
						lng: this.MouseCoordinate.lng,
					},
				];
				return latlngs;
			}
			return [];
		},
		dynamicSize() {
			return [this.iconSize, this.iconSize * 1.15];
		},
		dynamicAnchor() {
			return [this.iconSize / 2, this.iconSize * 1.15];
		},
	},
	methods: {
		...mapMutations([
			"newPointMarker",
			"closeNewPointMarker",
			"mapCenterUpdated",
			"readThisPoint",
		]),
		setClickCoordinates(c) {
			console.log(c.latlng);

			this.$store.state.clickCoordinates = c.latlng;
			if (this.polygonToolOn) this.polygon.latlngs.push(c.latlng);
		},
		setMouseCoordinate(m) {
			this.$store.state.MouseCoordinate = m.latlng;
		},
		zoomUpdated(z) {
			this.$store.state.zoom = z;
		},
		newPointCoordinateUpdated(c) {
			this.$store.state.newPoint.coordinates = c;
		},
		polygonToolSwitch() {
			if (this.polygonToolOn) {
				this.polygonToolOn = false;
				this.polygon.latlngs = [];
			} else {
				this.polygonToolOn = true;
			}
		},
		keyPressed(e) {
			// escape pressed
			switch (e.keyCode === 27) {
				case this.polygonToolOn:
					this.polygonToolSwitch();
					break;
			}
		},
	},
	mounted() {},
	created() {
		document.addEventListener("keyup", this.keyPressed);
	},
	components: {
		LMap,
		LTileLayer,
		LMarker,
		LPolygon,
		// LIcon,
		LControl,
		LControlZoom,
		// LMovingMarker,
		// LTooltip
	},
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
