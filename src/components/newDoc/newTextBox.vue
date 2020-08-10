<template>
	<div class="newPoint">
		<div class="tool_header">
			<i class="far fa-comment-alt" style="font-size: 25px; padding: 3px 5px;" />
			<textarea class="tooltip" placeholder="تکست باکس" v-model="toolTipModel" />
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
		<div class="tool_body">
			<div class="backColor">
				<label for="backColor">رنگ زمینه:</label>
				<color-picker id="backColor" :value="tool.color" :index="index" />
			</div>

			<div class="fontColor">
				<label for="fontColor">رنگ فونت:</label>
				<color-picker
					id="fontColor"
					:value="tool.secondaryColor"
					:index="index"
					:secondaryColor="true"
				/>
			</div>

			<div class="fontSize">
				<label for="fontSize">سایز فونت:</label>
				<input
					dir="ltr"
					id="fontSize"
					type="range"
					:index="index"
					min="14"
					max="30"
					value="16"
					@input="CHANGE_RANG_INPUT({ $event, type:'fontSize' })"
				/>
			</div>

			<div class="heightOfbox">
				<label for="heightOfbox">عرض باکس:</label>
				<input
					dir="ltr"
					id="heightOfbox"
					type="range"
					:index="index"
					min="30"
					max="300"
					value="100"
					@input="CHANGE_RANG_INPUT({ $event, type:'height' })"
				/>
			</div>

			<div class="widthOfBox">
				<label for="widthOfBox">طول باکس:</label>
				<input
					dir="ltr"
					id="widthOfBox"
					type="range"
					:index="index"
					min="100"
					max="350"
					value="200"
					v-on:input="CHANGE_RANG_INPUT({ $event , type: 'width' })"
				/>
			</div>
		</div>
	</div>
</template>

<script>
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
	},
};
</script>

<style>
</style>