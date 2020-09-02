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

			<label for="zoomLevel" style="top: 4px">لول زوم:</label>
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
					<input
						dir="ltr"
						id="iconSize"
						type="range"
						:index="index"
						min="10"
						max="45"
						value="35"
						v-on:input="CHANGE_RANG_INPUT({ $event , type: 'iconSize' })"
					/>
				</div>
				<div class="iconDegree">
					<label for="iconDegree">چرخش آیکن:</label>
					<input
						dir="ltr"
						id="iconDegree"
						type="range"
						:index="index"
						min="0"
						max="360"
						value="0"
						@input="CHANGE_RANG_INPUT({ $event, type:'angle' })"
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

export default {
	name: "newPoint",
	props: ["tool", "index"],
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
		zoomLevel: {
			get() {
				return this.DocLayer.zoom;
			},
			set(val) {
				this.SET_ZOOM_LEVEL(val);
			},
		},
	},
	components: {
		iconPicker,
		colorPicker,
	},
};
</script>

<style>
#zoomLevel {
	cursor: pointer;
}
</style>