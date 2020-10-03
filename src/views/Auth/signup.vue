<template>
    <div class="signupForm">
        <h1>ثبت نام در ترسیم</h1>
        <form @submit.prevent="signup()">
            <!-- <input type="text" placeholder="name" v-model="user.name" /> -->
            <input type="email" placeholder="email" v-model="user.email" />
            <!-- <input
                        type="text"
                        placeholder="imgURL"
                        v-model="user.imgURL"
                    /> -->
            <input
                type="password"
                placeholder="password"
                v-model="user.password"
            />
            <input
                type="password"
                placeholder="repeat password"
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
                email: "",
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
            if (!this.validEmail(user.email))
                errors.push("ایمیل معتبر نمیباشد");
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
        validEmail(email) {
            var regx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return regx.test(email);
        },
    },
};
</script>

<style>
</style>