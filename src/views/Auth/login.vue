<template>
    <div class="loginForm">
        <h1>ورود به ترسیم</h1>
        <form @submit.prevent="login()">
            <!-- <div class="text-field"> -->
            <!-- <label for="username">نام کاربری</label> -->
            <div class="textField">
                <label for="username">نام کاربری</label>
                <input
                    type="text"
                    id="username"
                    placeholder="mohammadAli.Cley"
                    v-model="user.username"
                    dir="ltr"
                    name="username"
                    autocomplete="username"
                    autofocus
                    required
                />
            </div>
            <div class="textField">
                <label for="password">رمز عبور</label>
                <input
                    type="password"
                    id="password"
                    placeholder="**********"
                    v-model="user.password"
                    name="current-password"
                    dir="ltr"
                    autocomplete="current-password"
                    required
                />
            </div>
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
    name: "loginPage",
    metaInfo() {
        return {
            title: `ترسیم - ورود`,
            meta: [{ name: "robots", content: "noindex, nofollow" }],
        };
    },
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