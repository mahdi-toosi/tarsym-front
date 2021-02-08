<template>
    <div class="resetPassword">
        <h1>ریست پسورد</h1>
        <form @submit.prevent="resetPassword()">
            <input type="text" placeholder="username" v-model="username" />
            <button class="btn btn-green" type="submit">ارسال</button>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            username: "",
        };
    },
    methods: {
        async resetPassword() {
            const username = this.username;
            if (username.length < 5) {
                this.$toasted.error(
                    "نام کاربری حداقل 6 کاراکتر باید داشته باشد"
                );
                return;
            }
            const res = await this.$store.dispatch("sendVerifyCode", {
                username,
            });
            if (!res) return;
            this.$router.push({
                path: "/auth/verify-mobile",
                query: { username, status: "changePass" },
            });
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
}
</style>