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
                name="username"
                v-model="user.username"
            />
            <input
                type="text"
                placeholder="شماره تلفن همراه"
                v-model="user.mobile"
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
            <p>
                شما با ثبت نام در ترسیم،
                <a href="#">شرایط استفاده از خدمات</a> را می‌پذیرید.
            </p>
            <button class="btn btn-blue" type="submit">ثبت نام</button>
        </form>
        <router-link to="/Auth" tag="button">قبلا ثبت نام کردم</router-link>
    </div>
</template>

<script>
export default {
    data() {
        return {
            user: {
                name: "",
                username: "",
                mobile: "",
                password: "",
                rpassword: "",
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
            if (user.name.length < 5)
                errors.push("نام و نام خانوادگی معتبر نمی باشد");
            if (user.username.length < 5)
                errors.push("نام کاربری حداقل 6 کاراکتر باید داشته باشد");
            if (!user.mobile.match(/^(\+98|0)?9\d{9}$/g))
                errors.push("شماره تلفن همراه معتبر نمیباشد");
            if (user.password.length < 5)
                errors.push("پسورد به اندازه کافی قوی نیست");
            if (user.password !== user.rpassword)
                errors.push("فیلد های پسورد یکسان نیستند");
            // this.validLength(user.name) &&
            // user.imgURL &&
            if (!errors.length) return true;
            errors.forEach((error) => this.$toasted.error(error));
            return false;
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