<template>
	<div class="newpoint">
		<header>
			<button class="btn btn-red ml1" @click="closeNewPointMarker">
				منصرف شدم
				<i class="fas fa-times"></i>
			</button>
			<button class="btn btn-green" @click="CreateNewPointMarker">
				ثبت
				<i class="fas fa-save"></i>
			</button>
			<!-- back button -->
			<button class="btn btn-back" @click="goBack()" v-if="newDocProp.id !== newDocProp.rootID">
				<i class="fas fa-arrow-left"></i>
			</button>
		</header>
		<div v-if="newDocs.length > 0">
			<section class="shadow">
				<input class="title" type="text" placeholder="عنوان" v-model="newPointTitle" />
				<quill-editor v-model="newPointDescription" :options="quillEditorOptions" />
			</section>
			<section class="tag_date_section">
				<v-select
					:options="allTags"
					:value="chosenTags"
					@input="SET_CHOSEN_TAG"
					label="name"
					placeholder="تگ ..."
					multiple
					taggable
					push-tags
					class="tags"
				/>
				<date-picker class="datepicker" :docLayer="newDocProp.index" />
			</section>
			<section class="tools shadow">
				<br />
				<div class="tabs">
					<span @click="tabContent = 'tools'" :class="tabContent == 'tools' ? 'activeTab' : ''">tools</span>
					<span @click="tabContent = 'layers'" :class="tabContent == 'layers' ? 'activeTab' : ''">layers</span>
				</div>
				<div class="content">
					<div class="tools-content" v-show="tabContent == 'tools'">
						<ul class="tools">
							<li v-for="(tool, index) in newDocLayer.tools" :key="index">
								<div class="tool_header">
									<icon-picker :index="index" v-if="tool.type !== 'Polygon' " />
									<input
										type="text"
										class="tooltip"
										:placeholder="`new ${tool.type}`"
										:index="index"
										@input="changeTooltip"
									/>
									<button @click="deleteTool(index)" class="delete_button">
										<i class="far fa-trash-alt"></i>
									</button>
								</div>
								<color-picker :value="tool.color" :index="index" />
								<color-picker
									:value="tool.color"
									:index="index"
									:type="tool.type"
									:secondaryColor="true"
									v-if="tool.type !== 'Point' "
								/>
								<input
									dir="ltr"
									type="range"
									:index="index"
									v-if="tool.type == 'Polyline' "
									min="10"
									max="45"
									value="35"
									@input="CHANGE_ICON_SIZE"
								/>
								<input
									dir="ltr"
									type="range"
									:index="index"
									v-if="tool.type !== 'Polygon' "
									min="0"
									max="360"
									value="0"
									@input="CHANGE_ICON_ANGLE"
								/>
								<input
									dir="ltr"
									type="range"
									:index="index"
									v-if="tool.type == 'Polyline' "
									min="2"
									max="100"
									value="30"
									@input="CHANGE_ICON_REPEAT"
								/>
								<button @click="makeToolOn(index)" v-if="!tool.isOn">تغییر</button>
								<button @click="toolSwitch(index , 'off')" class="btn-green" v-if="tool.isOn">ثبت</button>
							</li>
						</ul>
						<gooey-menu />
					</div>
					<div class="layers-content" v-show="tabContent == 'layers'">
						<ul>
							<li v-for="(child, index) in newDocChilds" :key="index">
								<button
									@click="goToChild(child.id)"
									class="btn btn-green"
								>{{ child.title ? child.title : child.id }}</button>
							</li>
						</ul>
						<button @click="addNewDoc(newDocProp.id)" class="btn btn-blue">add child</button>
					</div>
				</div>
			</section>
		</div>
	</div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import colorPicker from "@/components/sidebar/colorPicker";
import datePicker from "@/components/sidebar/datePicker";
import iconPicker from "@/components/sidebar/iconPicker";
import gooeyMenu from "@/components/sidebar/gooeyMenu";
// * quill Editor
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import { quillEditor } from "vue-quill-editor";

export default {
	data() {
		const toolbarOptions = [
			["blockquote", "italic", "underline", "bold"], // toggled buttons
			[
				"image",
				{ background: [] },
				{ color: [] },
				{ align: [] },
				{ direction: "rtl" }
			],
			[{ header: [2, 3, false] }],
			["clean"]
		];
		return {
			tabContent: "tools",
			quillEditorOptions: {
				modules: { toolbar: toolbarOptions },
				theme: "snow",
				placeholder: "توضیحات ..."
			},
			defaultColor: "#FF0000"
		};
	},
	methods: {
		...mapMutations([
			"closeNewPointMarker",
			"UPDATE_ON_TOOL",
			"SET_CHOSEN_TAG",
			"CHANGE_ICON_SIZE",
			"CHANGE_ICON_ANGLE",
			"CHANGE_ICON_REPEAT"
		]),
		...mapActions([
			"CreateNewPointMarker",
			"setCategory",
			"addNewDoc",
			"goBack",
			"goToChild"
		]),
		updateTooltips() {
			this.newDocLayer.tools.forEach((element, index) => {
				const input = `input[index="${index}"]`;
				const thisInput = document.querySelector(input);
				thisInput.value = element.tooltip;
			});
		},
		async deleteTool(index) {
			await this.delete_polyine_decorator(index);
			await this.newDocLayer.tools.splice(index, 1);
			await this.updateTooltips();
			await this.UPDATE_ON_TOOL();
		},
		delete_polyine_decorator(index) {
			const thisTool = this.newDocLayer.tools[index];
			if (thisTool.type !== "Polyline") return;
			thisTool.coordinates = [];
		},
		changeTooltip(tag) {
			const index = tag.target.attributes.index.value;
			const val = tag.target.value;
			this.newDocLayer.tools[index].tooltip = val;
		},

		toolSwitch(index, off = "on") {
			const thisTool = this.newDocLayer.tools[index];
			if (thisTool.isOn || off == "off") {
				thisTool.isOn = false;
				this.UPDATE_ON_TOOL();
			} else {
				this.makeToolOn(index);
			}
		},
		alertSaveTheData() {
			const msg = "ابتدا دیتا های وارد شده قبلی را ذخیره کنید";
			this.$toasted.error(msg, {
				position: "bottom-left",
				duration: 5 * 1000,
				keepOnHover: true,
				iconPack: "fontawesome",
				icon: "fa-close"
			});
		},
		makeToolOn(index) {
			if (this.newDocProp.OnTool.condition) {
				this.alertSaveTheData();
				return;
			} else {
				const thisTool = this.newDocLayer.tools[index];
				thisTool.isOn = true;
				this.UPDATE_ON_TOOL();
			}
		},
		keyPressed(e) {
			const OnTool = this.newDocProp.OnTool;
			if (e.keyCode === 27 && OnTool.condition) {
				this.toolSwitch(OnTool.index);
				return;
			} else return;
		},
		documentClick() {
			// var el = this.$refs.colorpicker,
			// 	target = e.target;
			// if (el !== target && !el.contains(target)) {
			// 	this.colorpickerSwitch("off");
			// }
		}
	},
	computed: {
		...mapState([
			"categories",
			"category",
			"newDocs",
			"newDocProp",
			"polygonTool",
			"polylineTool",
			"allTags"
		]),
		...mapGetters([
			"newDocLayer",
			"lastAddedDocID",
			"newDocChilds",
			"chosenTags"
		]),
		newPointTitle: {
			get() {
				return this.newDocLayer.title;
			},
			set(val) {
				return (this.newDocLayer.title = val);
			}
		},
		newPointDescription: {
			get() {
				return this.newDocLayer.description;
			},
			set(val) {
				return (this.newDocLayer.description = val);
			}
		}
	},
	async created() {
		const lastAddedDocID = this.lastAddedDocID;
		const routeID = this.$route.params.id;
		if (routeID !== lastAddedDocID) {
			await this.addNewDoc();
			return;
		}
		document.addEventListener("keyup", this.keyPressed);
	},
	mounted() {},
	components: {
		colorPicker,
		datePicker,
		iconPicker,
		quillEditor,
		gooeyMenu
	}
};
</script>

<style scoped lang="stylus">
.tools {
	padding: 0px;

	li {
		border-top: 1px solid gray;
		border-bottom: 1px solid gray;
		padding: 5px;
		list-style-type: none;
	}
}
</style>
