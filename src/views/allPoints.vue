<template>
	<div class="allpoints">
		<header>
			<button class="btn btn-blue" @click="CreateNewPointForm">
				نقطه ی جدید ایجاد کن
				<i class="fas fa-plus"></i>
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
				/>
				{{ search }}
				<a href="#">
					<i class="fas fa-search"></i>
				</a>
			</div>
		</section>
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
	</div>
</template>

<script>
import debounce from "v-debounce";
import { mapState, mapMutations, mapActions } from "vuex";

// * Human readable time component
import VueMomentsAgo from "@/components/sidebar/moments-ago.vue";
export default {
	name: "allPoint",
	directives: { debounce },
	data() {
		return {
			search: "",
			delay: 500
		};
	},
	computed: {
		...mapState(["allPoints", "categories", "category"])
	},
	methods: {
		...mapActions(["getAllPoints", "setCategory"]),
		...mapMutations(["readThisPoint", "newPointMarker"]),
		fetchSearchResult() {
			console.log(this.search.length);
			const url = "/point/search/" + this.search;
			this.$axios
				.get(url)
				// .then(response => (this.results = response.data))
				.then(response => console.log(response.data))
				.catch(error => {
					console.log(error);
				});
		},
		CreateNewPointForm() {
			this.newPointMarker();
		}
	},
	async created() {
		// await this.getAllPoints();
	},
	watch: {
		search() {
			if (this.search.length >= 3) {
				this.fetchSearchResult();
			}
		}
	},
	mounted() {},
	components: {
		VueMomentsAgo
	}
};
</script>

<style lang="stylus"></style>
