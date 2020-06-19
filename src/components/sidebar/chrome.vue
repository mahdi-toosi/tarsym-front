<template>
	<div class="color-picker" ref="colorpicker" dir="ltr">
		<span class="color-picker-container">
			<span class="current-color" :style="'background-color: ' + activeColor" @click="togglePicker()"></span>
			<div class="vc-chrome" v-if="displayPicker">
				<div class="vc-chrome-saturation-wrap">
					<saturation v-model="colors" @change="childChange"></saturation>
				</div>
				<div class="vc-chrome-body">
					<div class="vc-chrome-controls">
						<div class="vc-chrome-color-wrap">
							<div class="vc-chrome-active-color" :style="{background: activeColor}"></div>
							<checkboard></checkboard>
						</div>
						<div class="vc-chrome-sliders">
							<div class="vc-chrome-hue-wrap">
								<hue v-model="colors" @change="childChange"></hue>
							</div>
							<div class="vc-chrome-alpha-wrap">
								<alpha v-model="colors" @change="childChange"></alpha>
							</div>
						</div>
					</div>
				</div>
			</div>
		</span>
	</div>
</template>

<script>
import colorMixin from "vue-color/src/mixin/color";
import saturation from "vue-color/src/components/common/Saturation";
import hue from "vue-color/src/components/common/Hue";
import alpha from "vue-color/src/components/common/Alpha";
import checkboard from "vue-color/src/components/common/Checkboard";

export default {
	name: "Chrome",
	mixins: [colorMixin],
	props: {
		index: Number,
		fillColor: { type: Boolean, default: false }
	},
	components: {
		saturation,
		hue,
		alpha,
		checkboard
	},
	data() {
		return {
			displayPicker: false
		};
	},
	computed: {
		activeColor() {
			const color = this.colors.hex8;
			this.ADD_COLOR(color);
			return color;
		}
	},
	methods: {
		ADD_COLOR(color) {
			const data = {
				color: color,
				index: this.index,
				fillColor: this.fillColor
			};
			this.$store.commit("ADD_COLOR", data);
		},
		childChange(data) {
			this.colorChange(data);
		},
		inputChange(data) {
			if (!data) {
				return;
			}
			this.isValidHex(data.hex);
			this.colorChange({
				hex: data.hex,
				source: "hex"
			});
		},
		showPicker() {
			document.addEventListener("click", this.documentClick);
			this.displayPicker = true;
		},
		hidePicker() {
			document.removeEventListener("click", this.documentClick);
			this.displayPicker = false;
		},
		togglePicker() {
			this.displayPicker ? this.hidePicker() : this.showPicker();
		},
		documentClick(e) {
			var el = this.$refs.colorpicker,
				target = e.target;
			if (el !== target && !el.contains(target)) {
				this.hidePicker();
			}
		}
	}
};
</script>

<style>
.vc-chrome {
	background: #fff;
	border-radius: 2px;
	box-shadow: 0 0 2px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.3);
	box-sizing: initial;
	width: 225px;
	font-family: Menlo;
	background-color: #fff;
}
.vc-chrome-controls {
	display: flex;
}
.vc-chrome-color-wrap {
	position: relative;
	width: 36px;
}
.vc-chrome-active-color {
	position: relative;
	width: 30px;
	height: 30px;
	border-radius: 15px;
	overflow: hidden;
	z-index: 1;
}
.vc-chrome-color-wrap .vc-checkerboard {
	width: 30px;
	height: 30px;
	border-radius: 15px;
	background-size: auto;
}
.vc-chrome-sliders {
	flex: 1;
}
.vc-chrome-hue-wrap {
	position: relative;
	height: 10px;
	margin-bottom: 8px;
}
.vc-chrome-alpha-wrap {
	position: relative;
	height: 10px;
}
.vc-chrome-hue-wrap .vc-hue {
	border-radius: 2px;
}
.vc-chrome-hue-wrap .vc-hue-picker,
.vc-chrome-alpha-wrap .vc-alpha-picker {
	width: 12px;
	height: 12px;
	border-radius: 6px;
	transform: translate(-6px, -2px);
	background-color: rgb(248, 248, 248);
	box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.37);
}
.vc-chrome-body {
	padding: 16px 16px 12px;
	background-color: #fff;
}
.vc-chrome-saturation-wrap {
	width: 100%;
	padding-bottom: 55%;
	position: relative;
	border-radius: 2px 2px 0 0;
	overflow: hidden;
}
.vc-chrome-saturation-wrap .vc-saturation-circle {
	width: 12px;
	height: 12px;
}
.vc-chrome__disable-alpha .vc-chrome-active-color {
	width: 18px;
	height: 18px;
}
.vc-chrome__disable-alpha .vc-chrome-color-wrap {
	width: 30px;
}
.vc-chrome__disable-alpha .vc-chrome-hue-wrap {
	margin-top: 4px;
	margin-bottom: 4px;
}
.color-picker {
	position: relative;
}
.vc-chrome {
	position: absolute;
	top: 35px;
	right: 0;
	z-index: 9;
}
.current-color {
	display: inline-block;
	width: 16px;
	height: 16px;
	background-color: #000;
	cursor: pointer;
}
</style>
