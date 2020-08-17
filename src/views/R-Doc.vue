<template>
	<div class="allpoints">
		<header>
			<!-- back button -->
			<button class="btn btn-back" @click="backToAllPoints">
				<i class="fas fa-arrow-left"></i>
			</button>
		</header>
		<article class="point shadow readPoint">
			<header>
				<img :src="readPoint.user.image" alt />
				<div class="nameandsituation">
					<a href="#" v-text="readPoint.user.name"></a>
					<a href="#" v-text="readPoint.user.situation"></a>
				</div>
				<time>
					<vue-moments-ago prefix suffix="قبل" :date="readPoint.createdAt" lang="fa" />
				</time>
			</header>
			<main v-html="readPoint.excerpt"></main>
			<footer>
				<!-- <ul>
						<li
							v-for="(media, index) in point.contentMedia"
							:key="index"
							:class="mediaClass(media.type)"
						>
							<i class="fas" :class="mediaImage(media.type)"></i>
							<span v-text="media.num"></span>
							{{ mediaText(media.type) }}
						</li>
				</ul>-->
			</footer>
		</article>
		<section class="newPoint shadow" v-show="situations.newPoint">
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
</template>

<script>
import { mapState, mapMutations } from "vuex";

// * Human readable time component
import VueMomentsAgo from "@/components/moments-ago.vue";
export default {
	name: "readPointComponent",
	data() {
		return {};
	},
	computed: {
		...mapState(["readPoint"])
	},
	methods: {
		...mapMutations(["backToAllPoints"])
	},
	mounted() {},
	components: {
		VueMomentsAgo
	}
};
</script>

<style lang="stylus"></style>
