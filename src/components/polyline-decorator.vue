<template>
	<div style="display: none;">
		<slot v-if="ready"></slot>
	</div>
</template>

<script>
import L from "leaflet";
import "leaflet-polylinedecorator";
import { findRealParent, propsBinder } from "vue2-leaflet";
const props = {
	latLngs: {
		type: Array,
		default: () => []
	},
	visible: {
		type: Boolean,
		custom: true,
		default: true
	},
	types: {
		type: Array,
		default: () => []
	},
	arrowColor: {
		type: String,
		default: "red"
	},
	icon: {
		type: Object,
		default: {
			name: "fa fa-plane",
			color: null,
			size: 35,
			rotate: 0,
			repeat: 30
		}
	}
};
export default {
	name: "LPolylineDecorator",
	props,
	data: () => ({
		ready: false
	}),
	watch: {
		arrowColor() {
			this.reBuild();
		},
		icon() {
			this.reBuild();
		}
	},
	methods: {
		reBuild() {
			const parent = findRealParent(this.$parent);
			parent.removeLayer(this);
			this.ready = false;
			this.build();
		},
		build() {
			const polyline = L.polyline(this.latLngs);
			this.mapObject = L.polylineDecorator(polyline, this.patterns());
			L.DomEvent.on(this.mapObject, this.$listeners);
			propsBinder(this, this.mapObject, props);
			this.ready = true;
			const parent = findRealParent(this.$parent);
			parent.addLayer(this, !this.visible);
		},
		patterns() {
			let options = { patterns: [] };
			this.types.forEach(type => {
				if (type == "arrow") {
					options.patterns.push(this.getArrow());
					return;
				} else if (type == "icon") {
					options.patterns.push(this.geticon());
					return;
				}
			});
			return options;
		},
		HTMLicon() {
			const HTMLicon = `
				<i class="${this.icon.name}" 
					style=" color: ${this.icon.color ? this.icon.color : this.arrowColor};
								font-size: ${this.icon.size - 2}px; 
								transform: rotate(${this.icon.rotate}deg)" 
					aria-hidden="true">
				</i>`;
			return HTMLicon;
		},
		geticon() {
			const fontAwesomeIcon = L.divIcon({
				html: this.HTMLicon(),
				iconSize: this.dynamicSize(),
				iconAnchor: this.dynamicAnchor(),
				className: "fontAwesomeIcon"
			});
			const obj = {
				offset: "2%",
				repeat: `${this.icon.repeat}%`,
				symbol: L.Symbol.marker({
					rotate: true,
					markerOptions: {
						icon: fontAwesomeIcon
					}
				})
			};
			return obj;
		},
		getArrow() {
			const obj = {
				offset: "100%",
				repeat: 0,
				symbol: L.Symbol.arrowHead({
					pixelSize: 10,
					polygon: false,
					pathOptions: { stroke: true, color: this.arrowColor }
				})
			};
			return obj;
		},
		dynamicSize() {
			return [this.icon.size, this.icon.size * 1.15];
		},
		dynamicAnchor() {
			return [this.icon.size / 2, this.icon.size * 1.15];
		}
	},
	mounted() {
		this.build();
	}
};
</script>