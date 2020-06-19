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
		<div v-if="newPoint.length > 0">
			<section class="searchbar shadow">
				<v-select
					:options="categories"
					:value="category"
					@input="setCategory"
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
				<button @click="addNewDoc(newDocProp.id)" class="btn btn-blue">add child</button>
				<ul>
					<li v-for="(child, index) in newDocChilds" :key="index">
						<button @click="goToChild(child.id)" class="btn btn-green">{{ child.id }}</button>
					</li>
				</ul>
				<input type="text" placeholder="توضیح" v-model="newPointDescription" />
				<br />
				<ul class="tools">
					<li v-for="(tool, index) in newDocLayer.tools" :key="index">
						<input type="text" :placeholder="`new ${tool.type}`" :index="index" @input="changeTooltip" />
						<chrome-color-picker :value="tool.color" :index="index" />
						<chrome-color-picker
							:value="tool.color"
							:index="index"
							:fillColor="true"
							v-if="tool.type == 'Polygon' "
						/>
						<button @click="makeToolOn(index)" v-if="!tool.isOn">تغییر</button>
						<button @click="toolSwitch(index , 'off')" class="btn-green" v-if="tool.isOn">ثبت</button>
						<button @click="deleteTool(index)" class="btn-red">حذف</button>
					</li>
				</ul>
				<button @click="setTool('Point')">set point</button>
				<button @click="setTool('Polygon')">set Polygon</button>
				<button @click="setTool('Polyline')">set Polyline</button>

				<!-- <tinymce-editor
					:init="{
						plugins: 'image link media autolink ',
						directionality: 'rtl',
						language: 'fa_IR',
						language_url: 'http://localhost:3030/js/fa_IR.js',
						content_css: 'http://localhost:3030/css/tinymceStyles.css',
						toolbar:
							'alignright  aligncenter alignleft alignjustify bold italic underline link | image media  formatselect | forecolor | template  ',
						menubar: '',
						automatic_uploads: true,
						file_picker_types: 'image media',
						images_upload_url: 'upload.php',
						images_upload_credentials: true,
						images_upload_handler: function() {},
						height: '60vh',
					}"
					v-model="newPointDescription"
				></tinymce-editor>-->
			</section>
		</div>
	</div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import ChromeColorPicker from "@/components/sidebar/chrome";
// * tinymce
// import Editor from "@tinymce/tinymce-vue";
export default {
	data() {
		return {
			defaultColor: "#FF0000"
		};
	},
	methods: {
		...mapMutations(["closeNewPointMarker", "UPDATE_ON_TOOL"]),
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
			"newPoint",
			"newDocProp",
			"polygonTool",
			"polylineTool"
		]),
		...mapGetters(["newDocLayer", "lastAddedDocID", "newDocChilds"]),
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
		ChromeColorPicker
	}
};
</script>

<style lang="stylus">
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
