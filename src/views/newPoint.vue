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
			<button class="btn btn-back" @click="backToAllPoints">
				<i class="fas fa-arrow-left"></i>
			</button>
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
		...mapMutations(["backToAllPoints", "closeNewPointMarker"]),
		...mapActions(["CreateNewPointMarker", "setCategory"])
	},
	computed: {
		...mapState(["categories", "category", "newPoint"]),
		newPointTitle: {
			get() {
				return this.$store.getters.newPointTitle;
			},
			set(val) {
				return this.$store.dispatch("updateNewPointTitle", val);
			}
		}
	}
};
</script>

<style>
</style>