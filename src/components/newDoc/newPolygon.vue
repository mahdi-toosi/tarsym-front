<template>
	<div class="newPolygon">
		<div class="tool_header">
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
		<button @click="makeToolOn(index)" v-if="!tool.isOn">تغییر</button>
		<button @click="toolSwitch(index , 'off')" class="btn-green" v-if="tool.isOn">ثبت</button>
	</div>
</template>

<script>
import colorPicker from "@/components/newDoc/colorPicker";
import { mapActions, mapMutations } from "vuex";
export default {
	name: "newPolygon",
	props: ["tool", "index"],
	methods: {
		...mapActions(["deleteTool", "makeToolOn", "toolSwitch"]),
		...mapMutations(["CHANGE_TOOLTIP"])
	},
	components: {
		colorPicker
	}
};
</script>

<style>
</style>