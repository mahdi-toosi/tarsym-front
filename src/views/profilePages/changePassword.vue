<template>
    <form @submit.prevent="changePass()" class="changePassFrom">
        <input type="password" placeholder="password" v-model="password" />
        <input
            type="password"
            placeholder="repeat password"
            v-model="rpassword"
        />
        <input class="btn btn-blue" type="submit" value="تغییر رمز عبور" />
    </form>
</template>

<script>
export default {
    data() {
        return {
            password: "",
            rpassword: "",
        };
    },
    methods: {
        changePass() {
            const url = `/users/${this.$store.state.user._id}`;
            if (this.password !== this.rpassword) {
                this.$toasted.error(
                    "فیلد های پسورد و تکرار پسورد یکسان نیستند"
                );
                return;
            }
            this.$axios
                .patch(url, { password: this.password })
                .then(async () => {
                    this.$toasted.success("پسورد با موفقیت تغییر کرد");
                    await this.$store.commit("LOGOUT");
                    await this.$router.push("/Auth");
                })
                .catch((error) => {
                    this.$store.dispatch("handleAxiosError", error);
                });
        },
    },
};
</script>

<style lang="stylus">
.changePassFrom {
    display: flex;
    flex-direction: column;
    margin: 20%;

    input {
        margin: 10px;
    }
}
</style>