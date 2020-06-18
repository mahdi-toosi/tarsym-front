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
				<ul>
					<li v-for="(point, index) in newDocLayer.Points" :key="index">
						<input
							type="text"
							placeholder="new point"
							:toolType="'Points'"
							:index="index"
							@input="changeTooltip"
						/>
						<chrome-color-picker :value="point.color" :toolType="'Points'" :index="index" />
						<br />
						<button @click="turnOnThisPoint(index)" v-if="!point.isOn">تغییر مختصات</button>
						<button @click="savePointCoordinate(index)" class="btn-green" v-if="point.isOn">ثبت مختصات</button>
						<button @click="deleteTool( 'Points', index)" class="btn-red">delete Point</button>
					</li>
				</ul>
				<button @click="setTool('Points')">set point</button>
				<br />
				<br />
				<ul>
					<li v-for="(polygon, index) in newDocLayer.Polygons" :key="index">
						<input
							type="text"
							placeholder="new polygon"
							:toolType="'Polygons'"
							:index="index"
							@input="changeTooltip"
						/>
						<chrome-color-picker
							:value="polygon.color"
							:toolType="'Polygons'"
							:index="index"
							:fillColor="false"
						/>
						<chrome-color-picker
							:value="polygon.color"
							:toolType="'Polygons'"
							:index="index"
							:fillColor="true"
						/>
						<br />
						<button @click="toolSwitch( 'Polygons', index )" v-if="!polygon.isOn">redraw the polygon</button>
						<button
							@click="toolSwitch( 'Polygons', index , 'off')"
							class="btn-green"
							v-if="polygon.isOn"
						>save the polygon</button>
						<button @click="deleteTool( 'Polygons', index)" class="btn-red">delete Polygon</button>
					</li>
				</ul>
				<button @click="setTool('Polygons')">set Polygon</button>
				<br />
				<br />
				<!-- // ! polyline section -->
				<ul>
					<li v-for="(polyline, index) in newDocLayer.Polylines" :key="index">
						<input
							type="text"
							placeholder="new polyline"
							:toolType="'Polylines'"
							:index="index"
							@input="changeTooltip"
						/>
						<chrome-color-picker :value="polyline.color" :toolType="'Polylines'" :index="index" />
						<br />
						<button @click="toolSwitch( 'Polylines', index )" v-if="!polyline.isOn">redraw the polyline</button>
						<button
							@click="toolSwitch( 'Polylines', index , 'off')"
							class="btn-green"
							v-if="polyline.isOn"
						>save the polyline</button>
						<button @click="deleteTool( 'Polylines', index)" class="btn-red">delete Polygon</button>
					</li>
				</ul>
				<button @click="setTool('Polylines')">set Polyline</button>
				<br />
				<br />
				<br />
				<br />
				<br />

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
			"turnOnThisPoint",
			"addNewDoc",
			"goBack",
			"goToChild"
		]),
		updateTooltips(type) {
			const thisType = this.newDocLayer[type];
			thisType.forEach((element, index) => {
				const input = `input[toolType="${type}"][index="${index}"]`;
				const thisInput = document.querySelector(input);
				thisInput.value = element.tooltip;
			});
		},
		deleteTool(type, index) {
			this.newDocLayer[type].splice(index, 1);
			this.updateTooltips(type);
			this.UPDATE_ON_TOOL();
		},
		changeTooltip(tag) {
			const type = tag.target.attributes.toolType.value;
			const key = tag.target.attributes.index.value;
			const val = tag.target.value;
			this.newDocLayer[type][key].tooltip = val;
		},
		savePointCoordinate(key) {
			const thisPoint = this.newDocLayer.Points[key];
			thisPoint.isOn = false;
			this.UPDATE_ON_TOOL();
		},
		toolSwitch(type, index, off = "on") {
			const thisTool = this.newDocLayer[type][index];
			if (thisTool.isOn || off == "off") {
				thisTool.isOn = false;
				this.UPDATE_ON_TOOL();
			} else {
				this.makeToolOn(type, index);
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
		makeToolOn(type, index) {
			if (this.newDocProp.OnTool.condition) {
				this.alertSaveTheData();
				return;
			} else {
				const thisTool = this.newDocLayer[type][index];
				thisTool.isOn = true;
				this.UPDATE_ON_TOOL();
			}
		},
		keyPressed(e) {
			const onTool = this.newDocProp.OnTool;
			if (e.keyCode === 27 && onTool.condition) {
				this.toolSwitch(onTool.type, onTool.index);
				return;
			} else return;
		},
		updateFromPicker(e) {
			if (this.polygonTool.isOn) this.polygonTool.color = e.hex;
			if (this.polylineTool.isOn) this.polylineTool.color = e.hex;
		},
		colorpickerSwitch(type, index, off = null) {
			if (off == "off") {
				document.removeEventListener("click", this.documentClick);
				const toolTypes = ["Points", "Polygons", "Polylines"];
				toolTypes.forEach(type => {
					const toolType = toolTypes[type];
					toolType.forEach(tool => {
						tool.colorpicker = false;
					});
				});
				return;
			} else {
				document.addEventListener("click", this.documentClick);
				const thisTool = this.newDocLayer[type][index];
				thisTool.colorpicker = true;
			}
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

<style></style>
