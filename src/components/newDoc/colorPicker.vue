<template>
	<div class="color-picker" ref="colorpicker" dir="ltr">
		<span class="color-picker-container">
			<span class="current-color" :style="'background-color: ' + colors.hex8" @click="togglePicker()"></span>
			<!-- bottom line ---- @click can be mouseover-->
			<div class="vc-chrome" :class="displayPicker ? 'show' : '' " @click="ADD_COLOR(colors)">
				<div class="vc-chrome-saturation-wrap">
					<saturation v-model="colors" @change="childChange" />
				</div>
				<div class="vc-chrome-body">
					<div class="vc-chrome-controls">
						<div class="vc-chrome-color-wrap">
							<checkboard />
						</div>
						<div class="vc-chrome-sliders">
							<div class="vc-chrome-hue-wrap">
								<hue v-model="colors" @change="childChange" />
							</div>
							<div class="vc-chrome-alpha-wrap">
								<alpha v-model="colors" @change="childChange" />
							</div>
						</div>
					</div>
					<div class="vc-chrome-fields-wrap">
						<div class="vc-chrome-fields">
							<!-- hex -->
							<div class="vc-chrome-field">
								<ed-in v-if="!hasAlpha" label="hex" :value="colors.hex" @change="inputChange"></ed-in>
								<ed-in v-if="hasAlpha" label="hex" :value="colors.hex8" @change="inputChange"></ed-in>
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
import editableInput from "vue-color/src/components/common/EditableInput.vue";

export default {
	name: "Chrome",
	mixins: [colorMixin],
	props: {
		index: Number,
		secondaryColor: { type: Boolean, default: false },
	},
	components: {
		saturation,
		hue,
		alpha,
		checkboard,
		"ed-in": editableInput,
	},
	data() {
		return {
			displayPicker: false,
		};
	},
	computed: {
		hasAlpha() {
			return this.colors.a < 1;
		},
	},
	methods: {
		ADD_COLOR(color) {
			const data = {
				color,
				index: this.index,
				secondaryColor: this.secondaryColor,
			};
			this.$store.commit("ADD_COLOR", data);
		},
		childChange(data) {
			this.colorChange(data);
		},
		inputChange(data) {
			if (!data || !data.hex) return;
			this.isValidHex(data.hex) &&
				this.colorChange({
					hex: data.hex,
					source: "hex",
				});
			this.ADD_COLOR(this.colors);
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
		},
	},
	mounted() {
		// const color = this.colors.hex8;
		this.ADD_COLOR(this.colors);
	},
};
</script>
