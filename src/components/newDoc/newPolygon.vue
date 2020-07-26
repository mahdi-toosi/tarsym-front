<template>
	<div class="newPolygon">
		<div class="tool_header">
			<i class="fas fa-draw-polygon" style="font-size: 24px; padding: 3px 4px;"></i>
			<input
				type="text"
				class="tooltip"
				placeholder="توضیح کوتاه چند ضلعی"
				:index="index"
				@input="CHANGE_TOOLTIP"
			/>
			<button
				class="editIcon"
				@click="toolSwitch(index)"
				:class="$store.state.newDocProp.OnTool.index == index ? 'tool_is_on' : '' "
			>
				<i class="fas fa-pencil-alt"></i>
			</button>
			<button @click="deleteTool(index)" class="delete_button">
				<i class="far fa-trash-alt"></i>
			</button>
		</div>
		<div class="tool_body">
			<div class="polygonColor">
				<label for="polygonColor">رنگ بیرونی:</label>
				<color-picker :value="tool.color" id="polygonColor" :index="index" />
			</div>
			<div class="polygonSencondaryColor">
				<label for="polygonSencondaryColor">رنگ داخلی</label>
				<color-picker
					:value="tool.color"
					id="polygonSencondaryColor"
					:index="index"
					:secondaryColor="true"
				/>
			</div>
		</div>
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
		...mapMutations(["CHANGE_TOOLTIP"]),
	},
	components: {
		colorPicker,
	},
};
</script>

<style>
</style>