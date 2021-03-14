<template>
    <div class="resetPassword">
        <h1>ریست پسورد</h1>
        <form @submit.prevent="resetPassword()">
            <div class="textField">
                <label for="username">نام کاربری</label>
                <input
                    type="text"
                    id="username"
                    v-model="username"
                    placeholder="mohammadAli.Cley"
                    name="username"
                    autocomplete="username"
                    dir="ltr"
                    autofocus
                    required
                />
            </div>
            <button class="btn btn-green" type="submit">ارسال</button>
        </form>
    </div>
</template>

<script>
export default {
    name: "resetPassword",
    metaInfo() {
        return {
            title: `ترسیم - ریست رمز عبور`,
            meta: [{ name: "robots", content: "noindex, nofollow" }],
        };
    },
    data() {
        return {
            username: "",
        };
    },
    methods: {
        resetPassword() {
            console.log();
            this.$store.dispatch("resetPassword", { username: this.username });
        },
    },
};
</script>

<style lang="stylus">
.sendverifyCode {
    background: #f4f3fb;
}

.resetPassword {
    width: 100%;
    height: 100%;

    h1 {
        text-align: center;
    }
}
</style>