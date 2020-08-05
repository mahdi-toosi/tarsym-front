<template>
	<div id="app">
		<tarsym-map />
		<sidebar />
	</div>
</template>
<script>
import tarsymMap from "@/components/map";
import sidebar from "@/components/sidebar";

export default {
	name: "app",
	components: {
		tarsymMap,
		sidebar,
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
