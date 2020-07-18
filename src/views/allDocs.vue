<template>
	<div class="allpoints">
		<header>
			<a class="btn btn-blue" @click="addNewDoc()">
				نقطه ی جدید ایجاد کن
				<i class="fas fa-plus" />
			</a>
		</header>
		<section class="searchbar shadow">
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
					<i class="fas fa-search" />
				</a>
			</div>
		</section>
		<section class="points">
			<div class="point shadow" v-for="doc in allDocs.data " :key="doc._id">
				<!-- @click="readThisPoint(doc.coordinates)" -->
				<header>
					<i
						class="logo"
						:class=" doc.tools[0].iconName ? doc.tools[0].iconName : 'fas fa-map-marker-alt' "
						:style="{ color : doc.tools[0].iconName ?  doc.tools[0].color : '#277696' }"
						aria-hidden="true"
					/>
					<div class="nameandsituation">
						<a href="#" v-text="doc.title"></a>
						<!-- <a href="#" v-text="point.user.situation"></a> -->
					</div>
					<time>{{ doc.date | date }}</time>
					<button class="editDoc" @click="$router.push(`/update/doc/${doc._id}`)">
						<i class="far fa-edit"></i>
					</button>
					<button @click="Delete_this_Document(doc._id)" class="delete_button">
						<i class="far fa-trash-alt"></i>
					</button>
				</header>
				<main v-html="doc.description"></main>
				<footer>
					<ul>
						<li v-if="doc.imgsCount">
							<i class="far fa-images" />
							<span v-text="doc.imgsCount"></span>
							تصویر
						</li>
					</ul>
				</footer>
			</div>
		</section>
	</div>
</template>

<script>
import debounce from "v-debounce";
import { mapState, mapMutations, mapActions } from "vuex";

export default {
	name: "all-Docs",
	directives: { debounce },
	data() {
		return {
			search: "",
			delay: 500
		};
	},
	computed: {
		...mapState(["allDocs"]),
		docLayer() {
			return this.$store.getters.docs_list;
		}
	},
	methods: {
		...mapActions(["getAllDocs", "addNewDoc", "Delete_this_Document"]),
		...mapMutations(["readThisPoint"]),
		fetchSearchResult() {
			// console.log(this.search.length);
			const url = "/point/search/" + this.search;
			this.$axios
				.get(url)
				// .then(response => (this.results = response.data))
				.then(response => console.log(response.data))
				.catch(error => {
					console.log(error);
				});
		}
	},
	filters: {
		date(val) {
			const day = String(val).slice(-2);
			const month = String(val).slice(-4, -2);
			const year = String(val).slice(0, -4);
			return `${year}/${month}/${day}`;
		}
	},
	async created() {
		// await this.getAllPoints();
		if (this.$route.name == "my docs") {
			this.getAllDocs();
		}
	},
	watch: {
		search() {
			if (this.search.length >= 3) {
				this.fetchSearchResult();
			}
		}
	},
	mounted() {
		this.docLayer;
	},
	components: {}
};
</script>

<style lang="stylus"></style>
