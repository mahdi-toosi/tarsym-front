<template>
	<div>
		<l-map
			:icon="deafultIcon"
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

			<l-polygon
				:lat-lngs="polygonSimolationLatlngs"
				v-if="polygonTool.isOn"
				:dashArray="'10,10'"
				:opacity="0.5"
				:color="polygonTool.color"
				:fill="false"
			/>
			<l-polygon
				:fillOpacity="0.15"
				:fillColor="polygonTool.fillColor"
				:color="polygonTool.color"
				:lat-lngs="polygonTool.latlngs"
			/>

			<l-polyline
				:lat-lngs="polylineSimolationLatlngs"
				:color="polylineTool.color"
				v-if="polylineTool.isOn"
				:dashArray="'10,10'"
				:opacity="0.5"
				:fill="false"
			/>
			<l-marker
				v-for="(latlng, index) in polylineTool.latlngs"
				:lat-lng="latlng"
				:key="index"
				:icon="CircleIcon"
			/>
			<l-polyline
				:lat-lngs="polylineTool.latlngs"
				:color="polylineTool.color"
			/>
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

			<l-control-polyline-measure
				:options="{ showUnitControl: true }"
				position="bottomright"
				v-if="!anyToolisOn"
			/>
			<l-control position="bottomright" class="leaflet-control mapmaker">
				<!-- <a href="#" @click="newPointMarker" v-if="!situations.newPoint">
					<i class="fas fa-map-marker-alt"></i>
				</a>
				<a href="#" @click="closeNewPointMarker" v-if="situations.newPoint">
					<i class="fas fa-times"></i>
				</a>-->
				<a @click="undoTools" v-if="anyToolisOn">
					<i class="fa fa-undo" aria-hidden="true"></i>
				</a>
			</l-control>
		</l-map>

		<button @click="polygonToolSwitch">
			polygon tool {{ polygonTool.isOn ? "On" : "Off" }}
		</button>

		<button @click="polylineToolSwitch">
			polyline tool {{ polylineTool.isOn ? "On" : "Off" }}
		</button>

		<div ref="colorpicker">
			<button @click="colorpickerSwitch">
				color picker {{ colorpicker.isOn ? "On" : "Off" }}
			</button>
			<sketch
				v-model="colorpicker.color"
				v-if="colorpicker.isOn"
				:color="colorpicker.defaultColor"
				@input="updateFromPicker"
				id="mahdi"
			/>
		</div>
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
	// LTooltip,
	// LIcon,
	LControl,
	LControlZoom,
} from "vue2-leaflet";
import LControlPolylineMeasure from "vue2-leaflet-polyline-measure";
import { Sketch } from "vue-color";

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
		let myIconUrl = encodeURI("data:image/svg+xml," + achenSvgString).replace(
			"#",
			"%23"
		);
		let CircleIcon = L.icon({
			iconUrl: myIconUrl,
			iconSize: [10, 10],
			iconAnchor: [5, 5],
			popupAnchor: [4, -25],
		});
		let deafultIcon = L.icon({
			iconUrl:
				"https://s3-eu-west-1.amazonaws.com/ct-documents/emails/A-static.png",
			iconSize: [21, 31],
			iconAnchor: [10.5, 31],
			popupAnchor: [4, -25],
		});
		return {
			colorpicker: {
				color: {
					hex: "#194d33",
				},
				defaultColor: "#FF0000",
				isOn: false,
			},
			// bounds: null,
			iconSize: 64,
			polygonTool: {
				latlngs: [],
				color: "green",
				isOn: false,
				fillColor: "blue",
			},
			CircleIcon,
			deafultIcon,
			polylineTool: {
				latlngs: [],
				color: "red",
				isOn: false,
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
		anyToolisOn() {
			if (this.polygonTool.isOn || this.polylineTool.isOn) return true;
			else return false;
		},
		polygonSimolationLatlngs() {
			if (
				this.polygonTool.isOn &&
				this.MouseCoordinate.lat &&
				this.polygonTool.latlngs.length > 0
			) {
				const latlngs = [
					...this.polygonTool.latlngs,
					{
						lat: this.MouseCoordinate.lat,
						lng: this.MouseCoordinate.lng,
					},
				];
				return latlngs;
			}
			return [];
		},
		polylineSimolationLatlngs() {
			if (
				this.polylineTool.isOn &&
				this.MouseCoordinate.lat &&
				this.polylineTool.latlngs.length > 0
			) {
				const latlngs = [
					...this.polylineTool.latlngs,
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
		updateFromPicker(e) {
			if (this.polygonTool.isOn) this.polygonTool.color = e.hex;
			if (this.polylineTool.isOn) this.polylineTool.color = e.hex;
		},
		colorpickerSwitch(off = null) {
			if (this.colorpicker.isOn || off == "off") {
				document.removeEventListener("click", this.documentClick);
				this.colorpicker.isOn = false;
			} else {
				document.addEventListener("click", this.documentClick);
				this.colorpicker.isOn = true;
			}
		},
		documentClick(e) {
			var el = this.$refs.colorpicker,
				target = e.target;
			if (el !== target && !el.contains(target)) {
				this.colorpickerSwitch("off");
			}
		},
		setClickCoordinates(c) {
			// console.log(c.latlng);
			this.$store.state.clickCoordinates = c.latlng;
			if (this.polygonTool.isOn) this.polygonTool.latlngs.push(c.latlng);
			if (this.polylineTool.isOn) this.polylineTool.latlngs.push(c.latlng);
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
		makeToolOn(tool) {
			let polygon = tool == "polygonTool";
			let polyline = tool == "polylineTool";
			if (this.polygonTool.isOn || this.polylineTool.isOn) {
				this.$swal
					.fire({
						icon: "info",
						html: `.دیتا های وارد شده بدون ذخیره سازی
								<b>از بین خواهند رفت </b>
								<br/>مایل به تعویض ابزار هستید؟`,
						showCancelButton: true,
						focusConfirm: true,
						confirmButtonColor: "#f80000ab",
						cancelButtonColor: "#00bc00",
						confirmButtonText: '<i class="fa fa-thumbs-up"></i> Owki!',
						cancelButtonText: '<i class="fa fa-thumbs-down"></i> bikhial',
					})
					.then((result) => {
						if (result.value) {
							this.polygonToolSwitch("off");
							this.polylineToolSwitch("off");
							if (polygon) this.polygonTool.isOn = true;
							if (polyline) this.polylineTool.isOn = true;
						}
					});

				// (
				// 	"دیتا های وارد شده بدون ذخیره سازی از بین خواهند رفت. مایل به تعویض ابزار هستید؟"
				// );
			} else {
				if (polygon) this.polygonTool.isOn = true;
				if (polyline) this.polylineTool.isOn = true;
			}
		},
		polygonToolSwitch(off) {
			if (this.polygonTool.isOn || off == "off") {
				this.polygonTool.isOn = false;
				this.polygonTool.latlngs = [];
			} else {
				this.makeToolOn("polygonTool");
			}
		},
		polylineToolSwitch(off = null) {
			if (this.polylineTool.isOn || off == "off") {
				this.polylineTool.isOn = false;
				this.polylineTool.latlngs = [];
			} else {
				this.makeToolOn("polylineTool");
			}
		},
		keyPressed(e) {
			// escape pressed
			switch (e.keyCode === 27) {
				case this.polygonTool.isOn:
					this.polygonToolSwitch();
					break;
				case this.polylineTool.isOn:
					this.polylineToolSwitch();
					break;
			}
		},
		undoTools() {
			if (this.polygonTool.latlngs.length > 0) this.polygonTool.latlngs.pop();
			if (this.polylineTool.latlngs.length > 0) this.polylineTool.latlngs.pop();
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
		LPolyline,
		// LIcon,
		LControl,
		LControlZoom,
		LControlPolylineMeasure,
		// LTooltip
		Sketch,
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
