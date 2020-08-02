<template>
	<div id="app">
		<leaflet-oprator-map />
		<sidebar />
	</div>
</template>
<script>
import leafletOpratorMap from "@/components/map";
import sidebar from "@/components/sidebar";

export default {
	name: "app",
	components: {
		leafletOpratorMap,
		sidebar,
	},
	computed: {},
	methods: {},
	mounted() {
		this.$store.dispatch("get_All_Tag");
	},
};
</script>

<style lang="stylus">
@import './assets/styles/main.styl';

.toasted-primary {
	border-radius: 5px !important;
	box-shadow: 0px 0px 16px 0px rgba(5, 108, 158, 0.52) !important;
}
</style>
