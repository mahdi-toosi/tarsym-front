<template>
	<section class="points">
		<div
			class="point shadow"
			v-for="point in allPoints"
			:key="point._id"
			@click="readThisPoint(point.location.coordinates)"
		>
			<header>
				<img :src="point.user.image" alt />
				<div class="nameandsituation">
					<a href="#" v-text="point.user.name"></a>
					<a href="#" v-text="point.user.situation"></a>
				</div>
				<time>
					<vue-moments-ago prefix suffix="قبل" :date="point.createdAt" lang="fa" />
				</time>
			</header>
			<main v-html="point.excerpt"></main>
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
		</div>
	</section>
</template>

<script>
// * Human readable time component
import VueMomentsAgo from "./moments-ago.vue";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
	name: "allPoint",
	components: {},
	data() {
		return {};
	},
	computed: {
		...mapState(["allPoints"])
	},
	methods: {
		...mapActions(["getAllPoints"]),
		...mapMutations(["readThisPoint"])
	},
	async created() {
		// await this.getAllPoints();
	},
	mounted() {},
	components: {
		VueMomentsAgo
	}
};
</script>

<style lang="stylus"></style>
