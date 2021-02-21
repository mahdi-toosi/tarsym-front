<template>
    <div class="loginForm">
        <h1>ورود به ترسیم</h1>
        <form @submit.prevent="login()">
            <!-- <div class="text-field"> -->
            <!-- <label for="username">نام کاربری</label> -->
            <input
                type="text"
                id="username"
                placeholder="mahditoosi"
                v-model="user.username"
                dir="auto"
                name="username"
                autocomplete="username"
                autofocus
                required
            />
            <input
                type="password"
                placeholder="رمز عبور"
                v-model="user.password"
                name="current-password"
                autocomplete="current-password"
                required
            />
            <button class="btn btn-green" type="submit">ورود</button>
        </form>
        <router-link to="/Auth/signup" tag="button">ثبت نام</router-link>
        <router-link to="/Auth/reset-password" tag="button">
            فراموشی رمز عبور
        </router-link>
    </div>
</template>

<script>
export default {
    data() {
        return {
            user: { username: null, password: null },
        };
    },
    methods: {
        async login() {
            if (!this.validateLoginForm()) return;
            this.$store.dispatch("login", {
                userData: this.user,
                redirectTo: "/",
            });
        },
        validateLoginForm() {
            const user = this.user;
            let errors = [];
            if (user.username.length < 5)
                errors.push("نام کاربری معتبر نمیباشد");
            if (user.password.length < 5) errors.push("رمز عبور معتبر نمیباشد");
            if (!errors.length) return true;
            else {
                errors.forEach((error) => {
                    this.$toasted.error(error);
                });
                return false;
            }
        },
    },
};
</script>

<style>
</style>