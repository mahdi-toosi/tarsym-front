<template>
	<div>
		<form @submit.prevent="sendData" class="testFrom">
			<!-- <input type="text" placeholder="name" v-model="user.name" /> -->
			<input type="email" placeholder="email" v-model="user.email" />
			<!-- <input type="text" placeholder="imgURL" v-model="user.imgURL" /> -->
			<input type="password" placeholder="password" v-model="user.password" />
			<!-- <input type="password" placeholder="repeat password" v-model="user.rpassword" /> -->
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
				name: "",
				email: "mahdi@toosi.com",
				imgURL: "",
				password: "2647187",
				rpassword: ""
			}
		};
	},
	methods: {
		sendData() {
			if (this.validateLoginForm) {
				const { User } = this.$FeathersVuex.api;
				const user = new User(this.user);
				user.save().then(u => {
					console.log("m", u);
				});
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
		}
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
		}
	},
	mounted() {}
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
