<template>
	<div class="allpoints">
		<header>
			<a class="btn btn-blue" @click="addNewDoc()" v-if="$route.name == 'my docs'">
				نقطه ی جدید ایجاد کن
				<i class="fas fa-plus" />
			</a>
		</header>
<<<<<<< HEAD:src/views/allDocs.vue
		<section class="searchbar shadow">
			<div class="searchInput">
				<input
					type="search"
					placeholder="جستجو"
					class="searchBox"
					v-model.lazy="search"
					v-debounce="delay"
				/>
				<a href="#">
					<i class="fas fa-search" />
				</a>
			</div>
		</section>
=======
		<search-field />
>>>>>>> addCategory:src/views/ListDocs.vue
		<section class="points">
			<span v-if="!allDocs.data.length" class="notingToShow">داکیومنتی برای نمایش دادن نیست</span>
			<div
				class="point shadow"
				v-for="doc in allDocs.data "
				:key="doc._id"
				@click="showThisDoc(doc)"
				style="cursor: pointer"
			>
				<header>
					<i
						class="logo"
						:class=" (doc.tools[0].iconName || 'fas fa-map-marker-alt') "
						:style="{ color : 
										doc.tools[0].iconName 
										?  
										(doc.tools[0].secondaryColor.hex8 || doc.tools[0].secondaryColor) 
										: 
										'#277696' 
									}"
						aria-hidden="true"
					/>
					<div class="nameandsituation">
						<a href="#" v-text="doc.title"></a>
						<!-- <a href="#" v-text="point.user.situation"></a> -->
					</div>
					<time>{{ doc.date | date }}</time>
					<button
						class="editDoc"
						@click="$router.push(`/update/${doc._id}`)"
						v-if="$route.name == 'my docs'"
					>
						<i class="far fa-edit"></i>
					</button>
					<button
						@click="Delete_this_Document(doc._id)"
						class="editDoc"
						v-if="$route.name == 'my docs'"
						style="margin-right: 5px;"
					>
						<i class="far fa-trash-alt"></i>
					</button>
				</header>
<<<<<<< HEAD:src/views/allDocs.vue
				<main v-html="doc.excerpt">{{doc.excerpt}}</main>
=======
				<main v-text="doc.excerpt"></main>
>>>>>>> addCategory:src/views/ListDocs.vue
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
import searchField from "@/components/searchField";
import { mapActions } from "vuex";

export default {
	name: "ListDocs",
	computed: {
		allDocs() {
			return this.$store.state.allDocs;
		},
	},
	methods: {
		showThisDoc(doc) {
			if (this.$route.name == "all docs")
				this.$router.push(`/read/${doc._id}`);
		},
		...mapActions([
			"getAllDocs",
			"addNewDoc",
			"Delete_this_Document",
			"get_All_Taxanomies",
			"searchData",
		]),
	},
	filters: {
		date(val) {
			const day = String(val).slice(-2);
			const month = String(val).slice(-4, -2);
			const year = String(val).slice(0, -4);
			return `${year}/${month}/${day}`;
		},
	},
	beforeRouteEnter(to, from, next) {
<<<<<<< HEAD:src/views/allDocs.vue
		next((vm) => {
			const condition =
				from.name == "create doc" ||
				from.name == "update doc" ||
				!vm.$store.state.allDocs.data.length;
			if (condition) vm.getAllDocs();
		});
	},
	async created() {},
=======
		next(async (vm) => {
			vm.$store.state.map.zoom = 5;
			if (from.name == "create doc" || from.name == "update doc")
				await vm.get_All_Taxanomies(false); //* withCache = false
			if (to.name == "all docs" || to.name == "my docs")
				await vm.getAllDocs();
			if (to.name == "search") {
				await vm.searchData();
			}
		});
	},
	components: { searchField },
>>>>>>> addCategory:src/views/ListDocs.vue
};
</script>