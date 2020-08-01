<template>
	<div class="flip-card">
		<div class="flip-card-inner" :class="loginPage ? '' : 'signupPage'">
			<div class="loginForm">
				<h1>ورود به ترسیم</h1>
				<form @submit.prevent="login" class="registrationForm">
					<input type="email" placeholder="email" v-model="user.email" />
					<input type="password" placeholder="password" v-model="user.password" />
					<input class="btn btn-green" type="submit" value="ورود" :disabled="!validateLoginForm" />
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
					<input class="btn btn-blue" type="submit" value="ثبت نام" :disabled="!validateSignupForm" />
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
				email: "mahdi@toosi.com",
				password: "2647187",
				rpassword: "2647187",
			},
			loginPage: true,
		};
	},
	methods: {
		signup() {
			if (this.validateSignupForm) {
				const { User } = this.$FeathersVuex.api;
				const user = new User(this.user);
				user.save().then(() => {
					this.login();
				});
			}
		},
		async login() {
			if (this.validateLoginForm) {
				const data = {
					strategy: "local",
					...this.user,
				};
				try {
					await this.$store
						.dispatch("auth/authenticate", data)
						.then(async (res) => {
							const day = 60 * 60 * 24;
							res.expire = new Date().getTime() + day;
							localStorage.setItem(
								"userData",
								JSON.stringify(res)
							);
							await this.$router.push("/");
						});
				} catch (error) {
					let msg;
					if (error.code == 401) {
						msg = "ایمیل یا رمز عبور اشتباه است";
					} else {
						msg = "خطا در اتصال به سرور";
					}
					this.$toasted.error(msg, {
						position: "bottom-left",
						duration: 5 * 1000,
						keepOnHover: true,
						iconPack: "fontawesome",
						icon: "fa-close",
					});
				}
			}
		},
		validEmail: function (email) {
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
		validateLoginForm() {
			const u = this.user;
			if (this.validEmail(u.email) && this.validLength(u.password))
				return true;
			return false;
		},
		validateSignupForm() {
			const u = this.user;
			if (
				// this.validLength(u.name) &&
				// u.imgURL &&
				this.validEmail(u.email) &&
				this.validLength(u.password) &&
				u.password === u.rpassword
			)
				return true;
			return false;
		},
	},
	mounted() {},
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
