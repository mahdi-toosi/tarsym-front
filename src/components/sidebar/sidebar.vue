<template>
	<div class="panel">
		<router-view />
		<footer style="text-align: center">footer</footer>
	</div>
</template>
<script>
import { mapState, mapActions } from "vuex";

export default {
	name: "sidebar",
	props: {},
	data() {
		return {};
	},
	computed: {
		...mapState(["User"])
	},
	methods: {
		...mapActions(["getAllCategories", "getTheCurrentUser"]),
		mediaText(media) {
			switch (media) {
				case "img":
					return "عکس";
				case "video":
					return "فیلم";
			}
		},
		mediaImage(media) {
			switch (media) {
				case "img":
					return "fa-image";
				case "video":
					return "fa-video";
			}
		},
		mediaClass(media) {
			switch (media) {
				case "img":
					return "";
				case "video":
					return "video";
			}
		}
	},

	async created() {
		// await this.getAllCategories();
		// await this.getTheCurrentUser();
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus"></style>
