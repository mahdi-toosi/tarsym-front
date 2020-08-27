<template>
	<div class="allpoints">
		<header>
			<a class="btn btn-blue" @click="addNewDoc()" v-if="$route.name == 'my docs'">
				نقطه ی جدید ایجاد کن
				<i class="fas fa-plus" />
			</a>
		</header>
		<search-field />
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
				<main v-text="doc.excerpt"></main>
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
	name: "all-Docs",

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
			"read_this_doc",
			"get_All_Taxanomies",
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
		next(async (vm) => {
			const condition =
				from.name == "create doc" ||
				from.name == "update doc" ||
				!vm.$store.state.allDocs.data.length;
			if (condition) {
				await vm.get_All_Taxanomies(false); //* withCache = false
				await vm.getAllDocs();
			}
		});
	},
	components: { searchField },
};
</script>