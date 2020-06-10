<template>
	<div id="app">
		<leaflet-oprator-map />
		<sidebar />
	</div>
</template>
<script>
import leafletOpratorMap from "@/components/oprator map";
import sidebar from "@/components/sidebar/sidebar";
import feathersClient from "@/store/feathers-client/feathers-client.js";

export default {
	name: "app",
	components: {
		leafletOpratorMap,
		sidebar
	},
	data() {
		const Toast = this.$swal.mixin({
			toast: true,
			position: "bottom-start",
			showConfirmButton: false,
			showCloseButton: true,
			background: "#facea8",
			onOpen: toast => {
				toast.addEventListener("mouseenter", this.$swal.stopTimer);
				toast.addEventListener("mouseleave", this.$swal.resumeTimer);
			}
		});
		return {
			Toast
		};
	},
	computed: {
		sockedDisonnected() {
			return !feathersClient.io.connected;
		}
	},
	methods: {
		sendToast() {
			if (this.sockedDisonnected) {
				this.Toast.fire({
					icon: "error",
					title: "you are Disconnected"
				});
				console.log("you are disconnected");
			}
		}
	},
	mounted() {
		setInterval(() => {
			this.sendToast();
		}, 8000);
	}
};
</script>

<style lang="stylus">
@import './assets/styles/main.styl';
</style>
