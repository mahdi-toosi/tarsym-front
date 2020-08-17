<template>
	<div class="newPolyline">
		<div class="tool_header">
			<icon-picker :index="index" v-if="tool.showIcon" />
			<i
				class="fas fa-long-arrow-alt-up"
				style="font-size: 25px; padding: 3px 5px;"
				v-if="!tool.showIcon"
			/>
			<input type="text" class="tooltip" placeholder="توضیح کوتاه خط" v-model="toolTipModel" />
			<button
				class="editIcon"
				@click="toolSwitch(index)"
				:class="$store.state.DocProp.OnTool.index == index ? 'tool_is_on' : '' "
			>
				<i class="fas fa-pencil-alt"></i>
			</button>
			<button @click="deleteTool(index)" class="delete_button">
				<i class="far fa-trash-alt"></i>
			</button>
		</div>
		<div class="tool_body">
			<div class="lineColor">
				<label for="lineColor">رنگ خط</label>
				<color-picker id="lineColor" :value="tool.color" :index="index" />
			</div>
			<div class="addIcon">
				<label for="addIcon">آیکن:</label>
				<input
					type="checkbox"
					id="addIcon"
					@input="CHANGE_POLYLINE_DECORATOR({ $event, index , type: 'icon'})"
				/>
			</div>
			<div class="isDashed">
				<label for="isDashed">خط چین:</label>
				<input
					type="checkbox"
					id="isDashed"
					@input="CHANGE_POLYLINE_DECORATOR({ $event, index , type: 'dashed' })"
				/>
			</div>
			<div class="addArrow">
				<label for="addArrow">فلش:</label>
				<input
					type="checkbox"
					id="addArrow"
					@input="CHANGE_POLYLINE_DECORATOR({ $event, index , type: 'arrow'})"
				/>
			</div>
			<div class="lineIconsColor" v-if="tool.showIcon">
				<label for="lineIconsColor">رنگ آیکن:</label>
				<color-picker id="lineIconsColor" :value="tool.color" :index="index" :secondaryColor="true" />
			</div>
			<div class="lineIconSize" v-if="tool.showIcon">
				<label for="lineIconSize">سایز آیکن:</label>
				<input
					dir="ltr"
					type="range"
					id="lineIconSize"
					:index="index"
					min="10"
					max="45"
					value="35"
					@input="CHANGE_RANG_INPUT({ $event , type: 'iconSize' })"
				/>
			</div>
			<div class="lineIconRepeat" v-if="tool.showIcon ">
				<label for="lineIconRepeat">تعداد آیکن:</label>
				<input
					dir="ltr"
					type="range"
					:index="index"
					id="lineIconRepeat"
					min="2"
					max="100"
					value="30"
					@input="CHANGE_RANG_INPUT({ $event, type: 'iconRepeat' })"
				/>
			</div>
			<div class="lineIconDegree" v-if="tool.showIcon ">
				<label for="lineIconDegree">چرخش آیکن:</label>
				<input
					dir="ltr"
					type="range"
					id="lineIconDegree"
					:index="index"
					min="0"
					max="360"
					value="0"
					@input="CHANGE_RANG_INPUT({ $event, type:'angle' })"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import colorPicker from "@/components/newDoc/colorPicker";
import iconPicker from "@/components/newDoc/iconPicker";
import { mapActions, mapMutations } from "vuex";
export default {
	name: "newPolyline",
	props: ["tool", "index"],
	methods: {
		...mapActions(["deleteTool", "makeToolOn", "toolSwitch"]),
		...mapMutations([
			"CHANGE_TOOLTIP",
			"CHANGE_RANG_INPUT",
			"CHANGE_POLYLINE_DECORATOR",
		]),
	},
	computed: {
		toolTipModel: {
			get() {
				return this.$store.getters.tooltipData(this.index);
			},
			set(val) {
				const index = this.index;
				this.CHANGE_TOOLTIP({ index, val });
			},
		},
	},
	components: {
		colorPicker,
		iconPicker,
	},
};
</script>

<style>
</style>