<template>
    <div class="signupForm">
        <h1>ثبت نام در ترسیم</h1>
        <form @submit.prevent="signup()">
            <div class="textField">
                <label for="name">نام و نام خانوادگی</label>
                <input
                    type="text"
                    id="name"
                    placeholder="امین هاشمی"
                    v-model="user.name"
                    name="name"
                    autocomplete="name"
                    autofocus
                    dir="rtl"
                    required
                />
            </div>
            <div class="textField">
                <label for="username">نام کاربری</label>
                <input
                    type="text"
                    id="username"
                    placeholder="aminHashemi"
                    v-model="user.username"
                    name="username"
                    autocomplete="username"
                    dir="ltr"
                    required
                />
            </div>
            <div class="textField">
                <label for="mobile">شماره تلفن همراه</label>
                <input
                    id="mobile"
                    type="tel"
                    placeholder="0915****123"
                    v-model="user.mobile"
                    name="mobile"
                    autocomplete="tel"
                    dir="ltr"
                    required
                />
            </div>
            <div class="textField">
                <label for="password">رمز عبور</label>
                <input
                    id="password"
                    type="password"
                    placeholder="$amin*****%@jh"
                    v-model="user.password"
                    name="new-password"
                    autocomplete="new-password"
                    dir="auto"
                    required
                />
            </div>
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
    name: "signupPage",
    metaInfo() {
        return {
            title: `ترسیم - ثبت نام`,
            meta: [{ name: "robots", content: "noindex, nofollow" }],
        };
    },
    data() {
        return {
            user: {
                name: "",
                username: "",
                mobile: "",
                password: "",
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