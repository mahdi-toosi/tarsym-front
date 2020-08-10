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
	created() {
		document.addEventListener("PWAupdatefound", () => {
			let msg = "آپدیتی برای اپلیکیشن ارائه شد. در حال دانلود ...";
			this.$toasted.info(msg, {
				position: "bottom-left",
				duration: 5 * 1000,
				keepOnHover: true,
				iconPack: "fontawesome",
				icon: "fa-code",
			});
		});
		document.addEventListener("PWAupdated", () => {
			let msg =
				"آپدیت به پایان رسید ، نیاز به هارد رفرش کردن صفحه است ... ctrl + F5";
			this.$toasted.info(msg, {
				position: "bottom-left",
				duration: 10 * 1000,
				keepOnHover: true,
				iconPack: "fontawesome",
				icon: "fa-info-circle",
			});
		});
		document.addEventListener("PWAoffline", () => {
			let msg = "مشکل در ارتباط با سرور، اینترنت خود را بررسی کنید ...";
			this.$toasted.error(msg, {
				position: "bottom-left",
				duration: 5 * 1000,
				keepOnHover: true,
				iconPack: "fontawesome",
				icon: "fa-times-circle",
			});
		});
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
