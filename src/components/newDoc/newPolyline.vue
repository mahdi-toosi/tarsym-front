<template>
	<div class="newPolyline">
		<div class="tool_header">
			<icon-picker :index="index" v-if="tool.showIcon" />
			<i class="fas fa-long-arrow-alt-up" v-if="!tool.showIcon" />
			<input
				type="text"
				class="tooltip"
				:placeholder="`new ${tool.type}`"
				:index="index"
				@input="CHANGE_TOOLTIP"
			/>
			<button @click="deleteTool(index)" class="delete_button">
				<i class="far fa-trash-alt"></i>
			</button>
		</div>
		<color-picker :value="tool.color" :index="index" />
		<color-picker :value="tool.color" :index="index" :secondaryColor="true" />
		<input
			type="checkbox"
			:index="index"
			@input="CHANGE_POLYLINE_DECORATOR"
			changeType="icon"
			v-if="tool.type == 'Polyline'"
		/>
		<input
			type="checkbox"
			:index="index"
			@input="CHANGE_POLYLINE_DECORATOR"
			changeType="arrow"
			v-if="tool.type == 'Polyline' "
		/>
		<input
			dir="ltr"
			type="range"
			:index="index"
			v-if="tool.showIcon "
			min="10"
			max="45"
			value="35"
			@input="CHANGE_ICON({ $event , type: 'size' })"
		/>
		<input
			dir="ltr"
			type="range"
			:index="index"
			v-if="tool.showIcon"
			min="2"
			max="100"
			value="30"
			@input="CHANGE_ICON({ $event, type: 'repeat' })"
		/>
		<input
			dir="ltr"
			type="range"
			:index="index"
			v-if="tool.showIcon "
			min="0"
			max="360"
			value="0"
			@input="CHANGE_ICON({ $event, type:'angle' })"
		/>
		<button @click="makeToolOn(index)" v-if="!tool.isOn">تغییر</button>
		<button @click="toolSwitch(index , 'off')" class="btn-green" v-if="tool.isOn">ثبت</button>
	</div>
</template>

<script>
import colorPicker from "@/components/newDoc/colorPicker";
import iconPicker from "@/components/newDoc/iconPicker";
import { mapActions, mapMutations } from "vuex";
export default {
	name: "newPolygon",
	props: ["tool", "index"],
	methods: {
		...mapActions(["deleteTool", "makeToolOn", "toolSwitch"]),
		...mapMutations([
			"CHANGE_TOOLTIP",
			"CHANGE_ICON",
			"CHANGE_POLYLINE_DECORATOR"
		])
	},
	components: {
		colorPicker,
		iconPicker
	}
};
</script>

<style>
</style>