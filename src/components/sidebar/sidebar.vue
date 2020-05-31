<template>
	<div class="panel">
		<div class="allpoints">
			<header>
				<button class="btn btn-blue" @click="CreateNewPointForm" v-show="!situations.newPoint">
					نقطه ی جدید ایجاد کن
					<i class="fas fa-plus"></i>
				</button>
				<button class="btn btn-red ml1" @click="closeNewPointMarker" v-show="situations.newPoint">
					منصرف شدم
					<i class="fas fa-times"></i>
				</button>
				<button class="btn btn-green" @click="CreateNewPointMarker" v-show="situations.newPoint">
					ثبت
					<i class="fas fa-save"></i>
				</button>
				<!-- back button -->
				<button class="btn btn-back" @click="backToAllPoints" v-show="situations.readPoint">
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
					<input
						type="search"
						placeholder="جستجو"
						class="searchBox"
						v-model.lazy="search"
						v-debounce="delay"
						v-show="!situations.newPoint"
					/>
					{{ search }}
					<input
						type="text"
						placeholder="عنوان"
						v-model="newPointTitle"
						v-show="situations.newPoint"
					/>
					<a href="#" v-show="!situations.newPoint">
						<i class="fas fa-search"></i>
					</a>
				</div>
			</section>
			<all-points v-show="situations.allPoints" />
			<read-point v-if="situations.readPoint" />
			<section class="newPoint shadow" v-show="situations.newPoint">
				<tinymce-editor
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
                        height: '60vh'
                    }"
					v-model="newPointDescription"
				></tinymce-editor>
			</section>
			<!--  LOADING -->
			<div class="loading" v-if="situations.loading">
				<div class="lds-ripple">
					<div></div>
					<div></div>
				</div>در حال بارگذاری
			</div>
			<!-- there is no content -->
			<div class="loading" v-if="situations.thereIsNoPoint">
				<h1>404</h1>هیچ نقطه ای ثبت نشده
			</div>
		</div>

		<footer style="text-align: center">footer</footer>
	</div>
</template>
<script>
import debounce from "v-debounce";

// * vue select
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
// * tinymce
import Editor from "@tinymce/tinymce-vue";

import readPoint from "./readPoint.vue";
import allPoints from "./allPoints.vue";
import { mapState, mapMutations, mapActions } from "vuex";

export default {
	name: "sidebar",
	directives: { debounce },
	props: {},
	data() {
		return {
			search: "",
			delay: 500
		};
	},
	computed: {
		...mapState([
			"situations",
			"categories",
			"category",
			"newPoint",
			"User"
		]),
		newPointTitle: {
			get() {
				return this.$store.getters.newPointTitle;
			},
			set(val) {
				return this.$store.dispatch("updateNewPointTitle", val);
			}
		},
		newPointDescription: {
			get() {
				return this.$store.getters.newPointDescription;
			},
			set(val) {
				return this.$store.dispatch("updateNewPointDescription", val);
			}
		}
	},
	methods: {
		...mapMutations([
			"newPointMarker",
			"closeNewPointMarker",
			"backToAllPoints"
		]),
		...mapActions([
			"CreateNewPointMarker",
			"getAllCategories",
			"getTheCurrentUser",
			"setCategory"
		]),
		mediaText(media) {
			switch (media) {
				case "img":
					return "عکس";
				case "video":
					return "فیلم";
			}
		},
		mediaImage(media) {
			switch (media) {
				case "img":
					return "fa-image";
				case "video":
					return "fa-video";
			}
		},
		mediaClass(media) {
			switch (media) {
				case "img":
					return "";
				case "video":
					return "video";
			}
		},
		CreateNewPointForm() {
			if (this.User) {
				this.newPointMarker();
			} else {
				this.$swal({
					// position: "bottom-start",
					title: "شما باید لاگین کنید",
					icon: "info",
					showCloseButton: true,
					showCancelButton: true,
					cancelButtonColor: "#d33",
					cancelButtonText:
						'<i class="fa fa-thumbs-down"></i> منصرف شدم',
					confirmButtonText: '<a href="/login">صفحه ورود</a>'
				});
			}
			// CreateNewPointMarker
			// if (this.newPoint.title || this.newPoint.title.lenght < 2) {
			// 	this.$swal("تایتل کمتر از 2 کاراکتر است مثلا");
			// }
		},
		fetchSearchResult() {
			console.log(this.search.length);
			const url = "/point/search/" + this.search;
			axios
				.get(url)
				// .then(response => (this.results = response.data))
				.then(response => console.log(response.data))
				.catch(error => {
					console.log(error);
				});
		}
	},
	watch: {
		search(after, before) {
			if (this.search.length >= 3) {
				this.fetchSearchResult();
			}
		}
	},
	async created() {
		// await this.getAllCategories();
		// await this.getTheCurrentUser();
	},
	mounted() {},
	components: {
		"tinymce-editor": Editor,
		vSelect,
		allPoints,
		readPoint
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus"></style>
