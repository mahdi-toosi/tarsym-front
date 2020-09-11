<template>
	<div class="newPoint">
		<div class="tool_header">
			<icon-picker :index="index" />
			<input type="text" class="tooltip" placeholder="توضیح کوتاه آیکن" v-model="toolTipModel" />

			<button
				class="editIcon"
				@click="toolSwitch(index)"
				:class="$store.state.DocProp.OnTool.index == index ? 'tool_is_on' : '' "
			>
				<i class="fas fa-pencil-alt"></i>
			</button>

			<label for="zoomLevel" style="top: 4px" v-if="tool.searchable">لول زوم:</label>
			<select
				id="zoomLevel"
				v-if="tool.searchable"
				v-model="zoomLevel"
				title="لول زوم 4 بیشترین مقدار زوم است"
			>
				<option :value="4">1</option>
				<option :value="6">2</option>
				<option :value="8">3</option>
				<option :value="10">4</option>
				<option :value="13">5</option>
			</select>

			<button @click="deleteTool(index)" class="delete_button" v-if="!tool.searchable">
				<i class="far fa-trash-alt"></i>
			</button>
		</div>
		<div class="tool_body" v-if="logo">
			<div class="iconColor">
				<label for="iconColor">رنگ آیکن:</label>
				<color-picker
					id="iconColor"
					:value="tool.secondaryColor"
					:index="index"
					:secondaryColor="true"
				/>
			</div>
			<div class="tool_body">
				<div class="iconSize">
					<label for="iconSize">سایز آیکن:</label>
					<vue-slider
						id="iconSize"
						v-model="IconSizeModel"
						:width="120"
						:height="6"
						:min="10"
						:max="45"
					/>
				</div>
				<div class="iconDegree">
					<label for="iconDegree">چرخش آیکن:</label>
					<vue-slider
						id="iconDegree"
						v-model="iconDegreeModel"
						:width="120"
						:height="6"
						:min="0"
						:max="360"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import iconPicker from "@/components/newDoc/iconPicker";
import colorPicker from "@/components/newDoc/colorPicker";
import { mapActions, mapMutations } from "vuex";
import VueSlider from "vue-slider-component";

export default {
	name: "newPoint",
	props: ["tool", "index"],
	data() {
		return {
			value: 30,
		};
	},
	methods: {
		...mapActions(["deleteTool", "makeToolOn", "toolSwitch"]),
		...mapMutations([
			"CHANGE_RANG_INPUT",
			"CHANGE_TOOLTIP",
			"SET_ZOOM_LEVEL",
		]),
	},
	computed: {
		DocLayer() {
			return this.$store.getters.DocLayer;
		},
		logo() {
			const thisTool = this.DocLayer.tools[this.index];
			return thisTool.iconName;
		},
		toolTipModel: {
			get() {
				return this.$store.getters.tooltipData(this.index);
			},
			set(val) {
				this.CHANGE_TOOLTIP({ index: this.index, val });
			},
		},
		IconSizeModel: {
			get() {
				return this.DocLayer.tools[this.index].iconSize;
			},
			set(val) {
				this.CHANGE_RANG_INPUT({
					index: this.index,
					val,
					type: "iconSize",
				});
			},
		},
		iconDegreeModel: {
			get() {
				return this.DocLayer.tools[this.index].angel;
			},
			set(val) {
				this.CHANGE_RANG_INPUT({
					index: this.index,
					val,
					type: "angle",
				});
			},
		},
		zoomLevel: {
			get() {
				return this.DocLayer.zoomLevel;
			},
			set(val) {
				this.SET_ZOOM_LEVEL(val);
			},
		},
	},
	components: {
		iconPicker,
		colorPicker,
		VueSlider,
	},
};
</script>

<style>
#zoomLevel {
	cursor: pointer;
}
</style>