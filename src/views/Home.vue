<template>
	<div>
		<leaflet-map />
		<!-- <sidebar /> -->
	</div>
</template>

<script>
import leafletMap from "@/components/map";
// import sidebar from "@/components/sidebar/sidebar.vue";

export default {
	name: "app",
	components: {
		leafletMap
		// sidebar
	},
	data() {
		return {};
	},
	methods: {},
	mounted() {}
};
</script>

<style lang="stylus"></style>
