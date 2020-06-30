<template>
	<div style="display: none;">
		<slot v-if="ready"></slot>
	</div>
</template>

<script>
//  this baster dosent edit and remove ! and bind !

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
	iconName: {
		type: String,
		default: "fa fa-plane"
	},
	iconColor: {
		type: String,
		default: "#8d96ac"
	},
	iconSize: {
		type: Number,
		default: 35
	},
	iconRotate: {
		type: Number,
		default: 0
	},
	iconRepeat: {
		type: Number,
		default: 30
	}
};
export default {
	name: "LPolylineDecorator",
	props,
	data: () => ({
		ready: false
	}),

	methods: {
		remove() {
			const parent = findRealParent(this.$parent);
			parent.removeLayer(this);
			this.ready = false;
		},
		reBuild() {
			this.remove();
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
				<i class="${this.iconName}" 
					style=" color: ${this.iconColor};
								font-size: ${this.iconSize - 2}px; 
								transform: rotate(${this.iconRotate}deg)" 
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
				offset: "0.5%",
				repeat: `${this.iconRepeat}%`,
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
			return [this.iconSize, this.iconSize * 1.15];
		},
		dynamicAnchor() {
			return [this.iconSize / 2, this.iconSize * 1.15];
		}
	},
	watch: {
		arrowColor() {
			this.reBuild();
		},
		iconName() {
			this.reBuild();
		},
		iconColor() {
			this.reBuild();
		},
		iconSize() {
			this.reBuild();
		},
		iconRotate() {
			this.reBuild();
		},
		iconRepeat() {
			this.reBuild();
		},
		latLngs(val) {
			this.reBuild();
			console.log(val);
		},
		types() {
			this.reBuild();
		}
	},
	mounted() {
		this.build();
	}
};
</script>