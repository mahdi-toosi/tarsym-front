<template>
    <div class="signupForm">
        <h1>ثبت نام در ترسیم</h1>
        <form @submit.prevent="signup()">
            <input
                type="text"
                placeholder="نام و نام خانوادگی"
                v-model="user.name"
            />
            <input
                type="text"
                placeholder="نام کاربری"
                v-model="user.username"
            />
            <input
                type="password"
                placeholder="رمز عبور"
                v-model="user.password"
            />
            <input
                type="password"
                placeholder="تکرار رمز عبور"
                v-model="user.rpassword"
            />
            <input class="btn btn-blue" type="submit" value="ثبت نام" />
        </form>
        <router-link to="/Auth">قبلا ثبت نام کردم</router-link>
    </div>
</template>

<script>
export default {
    data() {
        return {
            user: {
                name: "مهدی طوسی",
                username: "mahditoosi",
                password: "123456",
                rpassword: "123456",
            },
        };
    },
    methods: {
        async signup() {
            if (!this.validateSignupForm()) return;
            this.$store.dispatch("signup", this.user);
        },
        validateSignupForm() {
            const user = this.user;
            let errors = [];
            this.TrimUserData();
            if (user.name.length < 5) errors.push("نام معتبر نمی باشد");
            if (user.username.length < 5)
                errors.push("نام کاربری حداقل 6 کاراکتر باید داشته باشد");
            if (user.password.length < 5)
                errors.push("پسورد به اندازه کافی قوی نیست");
            if (user.password !== user.rpassword)
                errors.push("فیلد های پسورد یکسان نیستند");
            // this.validLength(user.name) &&
            // user.imgURL &&
            if (!errors.length) return true;
            else {
                errors.forEach((error) => {
                    this.$toasted.error(error);
                });
                return false;
            }
        },
        TrimUserData() {
            const user = this.user;
            for (const key in user) {
                const element = user[key];
                user[key] = element.trim();
            }
        },
    },
};
</script>

<style>
</style>