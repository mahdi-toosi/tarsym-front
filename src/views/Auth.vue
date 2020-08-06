<template>
	<div class="flip-card">
		<div class="flip-card-inner" :class="loginPage ? '' : 'signupPage'">
			<div class="loginForm">
				<h1>ورود به ترسیم</h1>
				<form @submit.prevent="login" class="registrationForm">
					<input type="email" placeholder="email" v-model="user.email" />
					<input type="password" placeholder="password" v-model="user.password" />
					<input class="btn btn-green" type="submit" value="ورود" />
				</form>
				<button @click="loginPage = false ">ثبت نام</button>
			</div>
			<div class="signupForm">
				<h1>ثبت نام در ترسیم</h1>
				<form @submit.prevent="signup" class="registrationForm">
					<!-- <input type="text" placeholder="name" v-model="user.name" /> -->
					<input type="email" placeholder="email" v-model="user.email" />
					<!-- <input type="text" placeholder="imgURL" v-model="user.imgURL" /> -->
					<input type="password" placeholder="password" v-model="user.password" />
					<input type="password" placeholder="repeat password" v-model="user.rpassword" />
					<input class="btn btn-blue" type="submit" value="ثبت نام" />
				</form>
				<button @click="loginPage = true ">قبلا ثبت نام کردم</button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "app",
	data() {
		return {
			user: {
				email: null,
				password: null,
				rpassword: null,
			},
			loginPage: true,
		};
	},
	methods: {
		async signup() {
			if (!this.validateSignupForm()) return;
			let url = `/users`;
			await this.$axios
				.post(url, this.user)
				.then(async () => {
					await this.login();
				})
				.catch((error) => {
					this.$store.dispatch("handleAxiosError", error);
				});
		},
		async login() {
			if (!this.validateLoginForm()) return;
			const data = {
					strategy: "local",
					...this.user,
				},
				url = `/authentication`;

			await this.$axios
				.post(url, data)
				.then(async (res) => {
					const day = 60 * 60 * 1000 * 24;
					res.data.expire = new Date().getTime() + day;
					const encryptUser = btoa(JSON.stringify(res.data));
					localStorage.setItem("userData", encryptUser);
					localStorage.setItem("accessToken", res.data.accessToken);
					this.$axios.defaults.headers.common[
						"Authorization"
					] = `Bearer ${localStorage.getItem("accessToken")}`;
					await this.$router.push("/");
				})
				.catch((error) => {
					this.$store.dispatch("handleAxiosError", error);
				});
		},

		sendError(msg) {
			this.$toasted.error(msg, {
				position: "bottom-left",
				duration: 5 * 1000,
				keepOnHover: true,
				iconPack: "fontawesome",
				icon: "fa-close",
			});
		},
		validEmail: function (email) {
			var regx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return regx.test(email);
		},
		validLength(L) {
			if (L.length >= 3) {
				return true;
			}
		},
		validateLoginForm() {
			const user = this.user;
			let errors = [];
			if (!this.validEmail(user.email))
				errors.push("ایمیل معتبر نمیباشد");
			if (!this.validLength(user.password))
				errors.push("پسورد به اندازه کافی قوی نیست");
			if (!errors.length) return true;
			else {
				errors.forEach((error) => {
					this.sendError(error);
				});
				return false;
			}
		},
		validateSignupForm() {
			const user = this.user;
			let errors = [];
			if (!this.validEmail(user.email))
				errors.push("ایمیل معتبر نمیباشد");
			if (!this.validLength(user.password))
				errors.push("پسورد به اندازه کافی قوی نیست");
			if (user.password !== user.rpassword)
				errors.push("فیلد های پسورد یکسان نیستند");
			// this.validLength(user.name) &&
			// user.imgURL &&
			if (!errors.length) return true;
			else {
				errors.forEach((error) => {
					this.sendError(error);
				});
				return false;
			}
		},
	},
};
</script>

<style lang="stylus">
.registrationForm {
	background: #f4f3fb;
}

.registrationForm input, .registrationForm button {
	display: block;
	margin: 20px auto;
	text-align: left;
	border-radius: 3px;
	direction: ltr;
}

.registrationForm input[type='email'], .registrationForm input[type='password'] {
	border-radius: 0;
	background: transparent;
	border: none;
	border-bottom: 2px solid #cacaca;
	line-height: 1.5;
}

.flip-card {
	background-color: transparent;
	perspective: 1000px;
}

.flip-card button, .flip-card [type='submit'] {
	cursor: pointer;
}

.flip-card-inner {
	position: relative;
	width: 100%;
	height: 100%;
	text-align: center;
	transition: transform 0.6s;
	transform-style: preserve-3d;
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);

	h1 {
		margin: 2.5rem;
	}
}

.flip-card-inner.signupPage {
	transform: rotateY(180deg);
}

.loginForm, .signupForm {
	position: absolute;
	width: 100%;
	height: 100%;
	-webkit-backface-visibility: hidden;
	backface-visibility: hidden;
}

.loginForm {
}

.signupForm {
	transform: rotateY(180deg);
}
</style>
