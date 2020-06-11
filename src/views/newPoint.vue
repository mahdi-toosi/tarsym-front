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
						:index="index"
						@input="tooltip"
					/>
					<br />
					<button @click="changeCoordinate(index)" v-if="!point.draggable">
						تغییر مختصات
					</button>
					<button
						@click="saveCoordinate(index)"
						class="btn-green"
						v-if="point.draggable"
					>
						ثبت مختصات
					</button>
				</li>
			</ul>
			<button @click="setIcon">set Icon</button>
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
		...mapMutations(["closeNewPointMarker", "setIcon", "changeCoordinate"]),
		...mapActions(["CreateNewPointMarker", "setCategory"]),
		tooltip(tag) {
			const obj = {
				key: tag.target.attributes.index.value,
				val: tag.target.value,
			};
			this.$store.commit("updateTooltip", obj);
		},
		saveCoordinate(key) {
			const newPoint = this.$store.state.newPoint.Points[key];
			newPoint.coordinates = this.$store.state.newPoint.pointLastChangedCoordinate;
			newPoint.draggable = false;
		},
	},
	computed: {
		...mapState(["categories", "category", "newPoint"]),
		newPointTitle: {
			get() {
				return this.$store.getters.newPointTitle;
			},
			set(val) {
				return this.$store.commit("updateNewPointTitle", val);
			},
		},
		newPointDescription: {
			get() {
				return this.$store.getters.newPointDescription;
			},
			set(val) {
				return this.$store.commit("updateNewPointDescription", val);
			},
		},
	},
};
</script>

<style></style>
