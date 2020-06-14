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
			<router-link class="btn btn-back" to="/">
				<i class="fas fa-arrow-left"></i>
			</router-link>
		</header>
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
			<input type="text" placeholder="توضیح" v-model="newPointDescription" />
			<br />
			<ul>
				<li v-for="(point, index) in newPoint.Points" :key="index">
					<input
						type="text"
						placeholder="new point"
						:toolType="'Points'"
						:index="index"
						@input="changeTooltip"
					/>
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
				<li v-for="(polygon, index) in newPoint.Polygons" :key="index">
					<input
						type="text"
						placeholder="new polygon"
						:toolType="'Polygons'"
						:index="index"
						@input="changeTooltip"
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
				<li v-for="(polyline, index) in newPoint.Polylines" :key="index">
					<input
						type="text"
						placeholder="new polyline"
						:toolType="'Polylines'"
						:index="index"
						@input="changeTooltip"
					/>
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
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";

// * tinymce
// import Editor from "@tinymce/tinymce-vue";
export default {
	methods: {
		...mapMutations(["closeNewPointMarker", "UPDATE_ON_TOOL"]),
		...mapActions([
			"CreateNewPointMarker",
			"setCategory",
			"setTool",
			"turnOnThisPoint"
		]),
		updateTooltips(type) {
			const thisType = this.newPoint[type];
			thisType.forEach((element, index) => {
				const input = `input[toolType="${type}"][index="${index}"]`;
				const thisInput = document.querySelector(input);
				thisInput.value = element.tooltip;
			});
		},
		deleteTool(type, index) {
			this.newPoint[type].splice(index, 1);
			this.updateTooltips(type);
			this.UPDATE_ON_TOOL();
		},
		changeTooltip(tag) {
			const type = tag.target.attributes.toolType.value;
			const key = tag.target.attributes.index.value;
			const val = tag.target.value;
			this.newPoint[type][key].tooltip = val;
		},
		savePointCoordinate(key) {
			const thisPoint = this.newPoint.Points[key];
			thisPoint.coordinates = this.newPoint.pointLastChangedCoordinate;
			thisPoint.isOn = false;
			this.UPDATE_ON_TOOL();
		},
		toolSwitch(type, index, off = "on") {
			const thisTool = this.newPoint[type][index];
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
			if (this.newPoint.OnTool.condition) {
				this.alertSaveTheData();
				return;
			} else {
				const thisTool = this.newPoint[type][index];
				thisTool.isOn = true;
				this.UPDATE_ON_TOOL();
			}
		},
		keyPressed(e) {
			const onTool = this.newPoint.OnTool;
			if (e.keyCode === 27 && onTool.condition) {
				this.toolSwitch(onTool.type, onTool.index);
				return;
			} else return;
		}
	},
	computed: {
		...mapState([
			"categories",
			"category",
			"newPoint",
			"polygonTool",
			"polylineTool"
		]),
		newPointTitle: {
			get() {
				return this.newPoint.title;
			},
			set(val) {
				return this.$store.commit("updateNewPointTitle", val);
			}
		},
		newPointDescription: {
			get() {
				return this.newPoint.description;
			},
			set(val) {
				return this.$store.commit("updateNewPointDescription", val);
			}
		}
	},
	created() {
		document.addEventListener("keyup", this.keyPressed);
	}
};
</script>

<style></style>
