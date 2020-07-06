<template>
	<div class="newPoint">
		<div class="tool_header">
			<icon-picker :index="index" />
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
		<color-picker :value="tool.color" :index="index" :secondaryColor="true" />
		<input
			dir="ltr"
			type="range"
			:index="index"
			min="10"
			max="45"
			value="35"
			v-on:input="CHANGE_ICON({ $event , type: 'size' })"
		/>
		<input
			dir="ltr"
			type="range"
			:index="index"
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
import iconPicker from "@/components/newDoc/iconPicker";
import colorPicker from "@/components/newDoc/colorPicker";
import { mapActions, mapMutations } from "vuex";

export default {
	name: "newPoint",
	props: ["tool", "index"],
	methods: {
		...mapActions(["deleteTool", "makeToolOn", "toolSwitch"]),
		...mapMutations(["CHANGE_ICON", "CHANGE_TOOLTIP"])
	},
	components: {
		iconPicker,
		colorPicker
	}
};
</script>

<style>
</style>