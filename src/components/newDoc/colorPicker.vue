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
		secondaryColor: { type: Boolean, default: false }
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
				secondaryColor: this.secondaryColor
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
