<template>
	<div class="allpoints">
		<header>
			<button class="btn btn-back" @click="backToAllPoints">
				<i class="fas fa-arrow-left"></i>
			</button>
		</header>
		<article class="point shadow readPoint" v-if="DocLayer">
			<header>
				<h1 v-text="DocLayer.title"></h1>
				<!-- <time v-text="DocLayer.title"></time> -->
			</header>
			<main v-html="DocLayer.description"></main>
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
	</div>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from "vuex";

export default {
	name: "readDocument",
	data() {
		return {};
	},
	computed: {
		...mapGetters(["DocLayer"]),
	},
	methods: {
		...mapMutations(["backToAllPoints"]),
		...mapActions(["read_this_doc"]),
	},
	created() {
		this.read_this_doc();
	},
	mounted() {},
	components: {},
};
</script>

<style lang="stylus"></style>
