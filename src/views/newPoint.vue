<template>
	<div class="allpoints">
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
			<section class="searchbar shadow">
				<v-select
					:options="categories"
					:value="category"
					@input="SET_CHOSEN_TAG"
					label="name"
					:searchable="false"
					placeholder="موضوع"
					dir="rtl"
				/>
				<div class="searchInput">
					<input type="text" placeholder="عنوان" v-model="newPointTitle" />
				</div>
			</section>
			<section class="newPoint shadow">
				<quill-editor dir="ltr" v-model="newPointDescription" :options="quillEditorOptions" />
				<v-select
					:options="allTags"
					:value="chosenTags"
					@input="SET_CHOSEN_TAG"
					label="name"
					placeholder="تگ ..."
					multiple
					taggable
					push-tags
					dir="rtl"
				/>
				<date-picker :docLayer="newDocProp.index" />
				<br />
				<ul class="tools">
					<li v-for="(tool, index) in newDocLayer.tools" :key="index">
						<input type="text" :placeholder="`new ${tool.type}`" :index="index" @input="changeTooltip" />
						<color-picker :value="tool.color" :index="index" v-if="!tool.type == 'Point' " />
						<color-picker
							:value="tool.color"
							:index="index"
							:fillColor="true"
							v-if="tool.type == 'Polygon' "
						/>
						<icon-picker :index="index" v-if="tool.type == 'Point' " />
						<button @click="makeToolOn(index)" v-if="!tool.isOn">تغییر</button>
						<button @click="toolSwitch(index , 'off')" class="btn-green" v-if="tool.isOn">ثبت</button>
						<button @click="deleteTool(index)" class="btn-red">حذف</button>
					</li>
				</ul>
				<button @click="setTool('Point')">set point</button>
				<button @click="setTool('Polygon')">set Polygon</button>
				<button @click="setTool('Polyline')">set Polyline</button>
				<button @click="addNewDoc(newDocProp.id)" class="btn btn-blue">add child</button>
				<ul>
					<li v-for="(child, index) in newDocChilds" :key="index">
						<button @click="goToChild(child.id)" class="btn btn-green">{{ child.id }}</button>
					</li>
				</ul>
			</section>
		</div>
	</div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import colorPicker from "@/components/sidebar/colorPicker";
import datePicker from "@/components/sidebar/datePicker";
import iconPicker from "@/components/sidebar/iconPicker";
// * quill Editor
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import { quillEditor } from "vue-quill-editor";

export default {
	data() {
		const toolbarOptions = [
			["bold", "italic", "underline", "blockquote", { align: [] }], // toggled buttons
			[{ color: [] }, { background: [] }],
			[{ header: [2, 3, 4, false] }],
			["image"],
			["clean"]
		];
		return {
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
			"SET_CHOSEN_TAG"
		]),
		...mapActions([
			"CreateNewPointMarker",
			"setCategory",
			"setTool",
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
		deleteTool(index) {
			this.newDocLayer.tools.splice(index, 1);
			this.updateTooltips();
			this.UPDATE_ON_TOOL();
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
		quillEditor
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
