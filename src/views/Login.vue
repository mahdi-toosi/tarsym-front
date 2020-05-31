<template>
	<div>
		<form @submit.prevent="login" class="testFrom">
			<input type="email" placeholder="email" v-model="user.email" />
			<input type="password" placeholder="password" v-model="user.password" />
			<input type="submit" value="submit" :disabled="!validateLoginForm" />
		</form>
	</div>
</template>

<script>
import { mapState } from "vuex";

export default {
	name: "app",
	data() {
		return {
			user: {
				email: "mahdi@toosi.com",
				password: "2647187",
			},
		};
	},
	methods: {
		login() {
			if (this.validateLoginForm) {
				this.$store
					.dispatch("auth/authenticate", {
						strategy: "local",
						...this.user,
					})
					.then(console.log("were loged in"));
			}
		},
		validEmail: function(email) {
			var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(email);
		},
		validLength(L) {
			if (L.length >= 3) {
				return true;
			}
		},
	},
	computed: {
		...mapState("users", { loading: "isCreatePending" }),
		validateLoginForm() {
			const u = this.user;
			if (
				// this.validLength(u.name) &&
				// u.imgURL &&
				this.validEmail(u.email) &&
				this.validLength(u.password)
				// u.password === u.rpassword
			)
				return true;
			return false;
		},
	},
	mounted() {},
};
</script>

<style lang="stylus">
.testFrom input, .testFrom button {
	display: block;
	margin: 20px auto;
	text-align: left;
	padding: 5px;
	border-radius: 3px;
	border: 1px solid gray;
	direction: ltr;
}
</style>
