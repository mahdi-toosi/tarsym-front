<template>
    <div class="loginForm">
        <h1>ورود به ترسیم</h1>
        <form @submit.prevent="login()">
            <input type="email" placeholder="email" v-model="user.email" />
            <input
                type="password"
                placeholder="password"
                v-model="user.password"
            />
            <input class="btn btn-green" type="submit" value="ورود" />
        </form>
        <router-link to="/Auth/signup">ثبت نام</router-link>
        <router-link to="/Auth/reset-password">فراموشی رمز عبور</router-link>
    </div>
</template>

<script>
export default {
    data() {
        return {
            user: { email: "", password: "" },
        };
    },
    methods: {
        async login() {
            if (!this.validateLoginForm()) return;
            this.$store.dispatch("login", this.user);
        },
        validateLoginForm() {
            const user = this.user;
            let errors = [];
            if (!this.validEmail(user.email))
                errors.push("ایمیل معتبر نمیباشد");
            if (user.password.length < 5) errors.push("پسورد معتبر نمیباشد");
            if (!errors.length) return true;
            else {
                errors.forEach((error) => {
                    this.$toasted.error(error);
                });
                return false;
            }
        },
        validEmail(email) {
            var regx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return regx.test(email);
        },
    },
};
</script>

<style>
</style>