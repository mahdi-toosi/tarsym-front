<template>
	<div class="ReadDoc_wrapper">
		<header>
			<button
				class="btn btn-back"
				style="position: relative"
				@click="hasHistory() ? $router.go(-1) : $router.push('/')"
			>
				<i class="fas fa-arrow-left"></i>
			</button>
		</header>
		<article class="point readPoint" v-if="DocLayer">
			<header>
				<h1 v-text="DocLayer.title"></h1>
				<time>{{ DocLayer.date | date }}</time>
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
import { mapActions, mapGetters } from "vuex";

export default {
	name: "readDocument",
	data() {
		return {};
	},
	computed: {
		...mapGetters(["DocLayer"]),
	},
	methods: {
		...mapActions(["read_this_doc"]),
		hasHistory() {
			return window.history.length > 2;
		},
	},
	filters: {
		date(val) {
			const day = String(val).slice(-2);
			const month = String(val).slice(-4, -2);
			const year = String(val).slice(0, -4);
			return `${year}/${month}/${day}`;
		},
	},
	created() {
		this.read_this_doc();
	},
	mounted() {},
	components: {},
};
</script>

<style lang="stylus">
.ReadDoc_wrapper {
	direction: ltr;
	height: 95vh;
	overflow-y: auto;
	border-radius: 5px;
	background: #fff;
}
</style>
