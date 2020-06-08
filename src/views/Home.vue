<template>
	<div>
		<leaflet-oprator-map />
		<sidebar />
	</div>
</template>

<script>
import leafletOpratorMap from "@/components/oprator map";
import sidebar from "@/components/sidebar/sidebar.vue";

export default {
	name: "app",
	components: {
		leafletOpratorMap,
		sidebar
	},
	data() {
		return {};
	},
	methods: {},
	mounted() {}
};
</script>

<style lang="stylus"></style>
