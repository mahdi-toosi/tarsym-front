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
				<time v-html="filterdate(DocLayer.date) "></time>
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
		filterdate(val) {
			const day = String(val).slice(-2);
			const month = String(val).slice(-4, -2);
			const year = String(val).slice(0, -4);
			const yearIsNegetive = /[-]/.test(year);
			const currectYear = yearIsNegetive
				? year.replace(/[-]/gi, "")
				: year;
			return `${day}/${month}/${currectYear}${
				yearIsNegetive ? "<span>-</span>" : ""
			}`;
		},
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
