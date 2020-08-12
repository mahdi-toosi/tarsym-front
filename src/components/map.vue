<template>
	<div>
		<l-map
			:icon="defaultIcon"
			class="map"
			:zoom="map.zoom"
			:center="map.center"
			@click="setClickCoordinates"
			@update:zoom="zoomUpdated"
			:options="{ zoomControl: false }"
			@update:center="mapCenterUpdated"
			@mousemove="setMouseCoordinate"
			:minZoom="4"
			ref="LeafletMap"
		>
			<l-tile-layer :url="openStreetTileURL" layerType="satellite" />
			<div v-if="docs_list.length">
				<div v-for="(tool, index) in DocWithChildsTools " :key="index">
					<div v-if="tool.type == 'Polygon'">
						<span v-if="newDocProp.OnTool.condition">
							<l-polygon
								:lat-lngs="polygonOrPolylineSimolationCoordinates"
								v-if=" tool.isOn"
								:dashArray="'10,10'"
								:opacity="0.5"
								:color="( tool.color.hex8 || tool.color )"
								:fill="false"
							/>
						</span>
						<l-polygon
							:fillOpacity="0.4"
							:fillColor="( tool.secondaryColor.hex8 || tool.secondaryColor )"
							:color="( tool.color.hex8 || tool.color )"
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
								:color="(tool.color.hex8 || tool.color)"
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
							:color="(tool.color.hex8 || tool.color)"
							:dashArray=" tool.dashed ? '10,10' : '' "
							@click="mahdi(tool)"
						>
							<l-tooltip v-if="tool.tooltip">{{ tool.tooltip }}</l-tooltip>
						</l-polyline>
						<polyline-decorator
							:lat-lngs="tool.coordinates"
							:icon-size="tool.iconSize"
							:icon-name="tool.iconName"
							:icon-color="( tool.secondaryColor.hex8 || tool.secondaryColor )"
							:icon-rotate="tool.angle"
							:icon-repeat="tool.iconRepeat"
							:arrow-color="( tool.color.hex8 || tool.color )"
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
												color:  ( tool.secondaryColor.hex8 || tool.secondaryColor ), 
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
							:icon="CircleIcon"
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
												background: ( tool.color.hex8 || tool.color ), 
												fontSize: tool.fontSize + 'px',
												color: ( tool.secondaryColor.hex8 || tool.secondaryColor )
												}"
								>{{ tool.tooltip }}</div>
								<!-- <div class="pointer"></div> -->
							</l-icon>
						</l-marker>
					</div>
					<!-- end Textbox  -->
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
				// "https://s3-eu-west-1.amazonaws.com/ct-documents/emails/A-static.png",
				"data:image/png;base64,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",
			iconSize: [21, 31],
			iconAnchor: [10.5, 31],
			popupAnchor: [4, -25],
		});
		return {
			openStreetTileURL:
				"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
			CircleIcon,
			defaultIcon,
		};
	},
	computed: {
		...mapState(["map", "newDocProp"]),
		...mapGetters(["newDocLayer", "docs_list", "DocWithChildsTools"]),
		undoCondition() {
			const onTool = this.newDocProp.OnTool;
			if (!onTool.condition) return false;
			const thisTool = this.newDocLayer.tools[onTool.index];
			if (thisTool.type !== "Point" && thisTool.type !== "Textbox")
				return true;
			else return false;
		},
		polygonOrPolylineSimolationCoordinates() {
			const OnToolProp = this.newDocProp.OnTool,
				OnTool = this.newDocLayer.tools[OnToolProp.index],
				isPolygonOrPolylineOn =
					OnTool.type == "Polygon" || OnTool.type == "Polyline",
				MouseCoordinate = this.map.MouseCoordinate;
			if (!isPolygonOrPolylineOn && !MouseCoordinate) return [];
			if (OnTool.coordinates.length < 1) return [];
			const coordinates = [
				...OnTool.coordinates,
				{
					lat: MouseCoordinate.lat,
					lng: MouseCoordinate.lng,
				},
			];
			return coordinates;
		},
	},
	methods: {
		...mapMutations(["mapCenterUpdated", "UPDATE_THIS_POINT_COORDINATE"]),
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
			if (thisTool.type == "Point" || thisTool.type == "Textbox") return;
			thisTool.coordinates.push(c.latlng);
		},
		setMouseCoordinate(m) {
			this.map.MouseCoordinate = m.latlng;
		},
		zoomUpdated(zoomLevel) {
			this.map.zoom = zoomLevel;
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
		}).addTo(this.$refs.LeafletMap.mapObject);
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
