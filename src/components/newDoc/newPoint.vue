<template>
	<div class="newPoint">
		<div class="tool_header">
			<icon-picker :index="index" />
			<input
				type="text"
				class="tooltip"
				placeholder="توضیح کوتاه آیکن"
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
		...mapMutations(["CHANGE_RANG_INPUT", "CHANGE_TOOLTIP"]),
	},
	computed: {
		logo() {
			const thisDocLayer = this.$store.state.newDocProp.index;
			const thisDoc = this.$store.state.newDocs[thisDocLayer];
			const thisTool = thisDoc.tools[this.index];
			return thisTool.iconName;
		},
	},
	components: {
		iconPicker,
		colorPicker,
	},
};
</script>

<style>
</style>