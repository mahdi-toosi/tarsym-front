<template>
	<div id="app">
		<leaflet-oprator-map />
		<sidebar />
	</div>
</template>
<script>
import leafletOpratorMap from "@/components/oprator map";
import sidebar from "@/components/sidebar";
// import feathersClient from "@/store/feathers-client/feathers-client.js";

export default {
	name: "app",
	components: {
		leafletOpratorMap,
		sidebar
	},
	computed: {
		// sockedDisonnected() {
		// 	return !feathersClient.io.connected;
		// }
	},
	methods: {
		// sendToast() {
		// 	if (this.sockedDisonnected) {
		// 		this.$toasted.error("you are Disconnected", {
		// 			position: "bottom-left",
		// 			duration: 5 * 1000,
		// 			keepOnHover: true,
		// 			containerClass: "info",
		// 			iconPack: "fontawesome",
		// 			icon: "fa-close"
		// 		});
		// console.log("you are disconnected");
		// }
		// }
	},
	mounted() {
		this.$store.dispatch("get_All_Tag");
		// setInterval(() => {
		// 	this.sendToast();
		// }, 8 * 1000);
	}
};
</script>

<style lang="stylus">
@import './assets/styles/main.styl';

.toasted-primary {
	border-radius: 5px !important;
	box-shadow: 0px 0px 16px 0px rgba(5, 108, 158, 0.52) !important;
}
</style>
