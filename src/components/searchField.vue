<template>
	<section class="searchbar shadow">
		<div class="searchInput">
			<button style="font-size: 22px; " @click="fetchSearchResult()">
				<i class="fas fa-search" />
			</button>
			<input
				type="search"
				placeholder="جستجو ..."
				class="searchBox"
				v-model.lazy="search"
				v-debounce="delay"
				:style="{borderBottom: showOptions ? '1px solid silver' : 'none' }"
			/>
			<button style="font-size: 25px;" @click="showOptions = !showOptions">
				<i class="fas fa-sliders-h"></i>
			</button>
		</div>
		<div class="options" v-show="showOptions">
			<button @click="$store.commit('CHANGE_SEARCH_POLYGON_SITUATION')">select polygon</button>
		</div>
	</section>
</template>

<script>
import debounce from "v-debounce";

export default {
	name: "searchComponent",
	directives: { debounce },

	data() {
		return {
			search: "",
			delay: 500,
			showOptions: false,
		};
	},
	methods: {
		fetchSearchResult() {
			// console.log(this.search.length);
			const url = "/search/" + this.search;
			this.$axios
				.get(url)
				// .then(response => (this.results = response.data))
				.then((response) => console.log(response.data))
				.catch((error) => {
					console.log(error);
				});
		},
	},
	computed: {
		searchPolygon() {
			return this.$store.state.searchPolygon;
		},
	},
};
</script>

<style lang="stylus">
.searchbar {
	padding: 9px 15px;
	background: white;
	border-radius: 5px;

	.searchInput {
		width: 100%;
		display: flex;
		align-items: center;

		button {
			color: #8d96ac;
			height: 27px;
			cursor: pointer;
		}

		input {
			width: 86%;
			line-height: 2;
			border: 0;
			padding: 0px 10px 4px;
			// width: 180px;
		}
	}

	.options {
		margin-top: 10px;
	}
}
</style>