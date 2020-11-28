<template>
    <div class="signupForm auth">
        <h1>تنظیمات حساب کاربری</h1>
        <form @submit.prevent="updateUserData()">
            <div class="profileAvatar">
                <img
                    class="profile-pic"
                    :src="avatar || '/img/profileAvatar.png'"
                />
                <div class="image_input">
                    <i
                        class="fa fa-camera"
                        @click="$refs.avatarInput.click()"
                    ></i>
                    <input
                        class="file-upload"
                        type="file"
                        ref="avatarInput"
                        accept="image/png,image/jpg,image/jpeg"
                        @change="uploadAvatar"
                    />
                </div>
            </div>

            <input
                type="text"
                placeholder="نام کاربری"
                :value="user.username"
                disabled
            />
            <input
                type="text"
                placeholder="نام و نام خانوادگی"
                v-model="user.name"
            />
            <input
                type="number"
                placeholder="کد ملی"
                v-model="user.nationalCode"
            />
            <input type="text" placeholder="شهر" v-model="user.city" />
            <input type="text" placeholder="شغل" v-model="user.job" />

            <button
                class="btn btn-green"
                type="submit"
                v-text="
                    user.role < 35 ? 'ارتقاء به نقشه ساز' : 'بروزرسانی اطلاعات'
                "
            ></button>
        </form>
        <form @submit.prevent="changeMobileNum()" class="changePassFrom">
            <input
                type="password"
                placeholder="شماره موبایل"
                v-model="mobile"
            />
            <button class="btn btn-blue" type="submit">
                تغییر شماره موبایل
            </button>
        </form>
        <form @submit.prevent="changePass()" class="changePassFrom">
            <input type="password" placeholder="رمز عبور" v-model="password" />
            <input
                type="password"
                placeholder="تکرار رمز عبور"
                v-model="rpassword"
            />
            <button class="btn btn-blue" type="submit">تغییر رمز عبور</button>
        </form>
    </div>
</template>

<script>
export default {
    name: "SettingPage",
    data() {
        return {
            user: {
                _id: "",
                name: "",
                username: "",
                job: "",
                city: "",
                role: 3,
                nationalCode: null,
                avatar: "",
            },
            mobile: "",
            password: "",
            rpassword: "",
        };
    },
    computed: {
        avatar() {
            const avatar = this.user.avatar;
            if (!avatar) return false;
            if (process.env.NODE_ENV === "production") return avatar;
            return process.env.VUE_APP_DOMAIN + avatar;
        },
    },
    methods: {
        async updateUserData() {
            if (!this.validateSignupForm()) return;
            const { _id, city, job, nationalCode, role } = this.user;
            await this.$axios
                .patch(`/users/${_id}`, {
                    _id,
                    city,
                    job,
                    nationalCode,
                })
                .then(({ data }) => {
                    this.storeUserData(data);
                    // * show result message
                    let msg;
                    if (role < 35)
                        msg =
                            "پس از بررسی اطلاعات شما ، شما به نقشه ساز ارتقاء خواهید یافت";
                    else msg = "اطلاعات شما با موفقیت بروزرسانی شد";
                    this.$toasted.success(msg);
                })
                .catch((error) => {
                    if (
                        error.response.data.message ===
                        "You don't have permission"
                    ) {
                        this.$toasted.error("شما دسترسی لازم را ندارید");
                        return;
                    }
                    this.$store.dispatch("handleAxiosError", error);
                });
        },
        validateSignupForm() {
            const user = this.user;
            let errors = [];
            this.TrimUserData();
            if (user.name.length < 5)
                errors.push("نام و نام خانوادگی معتبر نمی باشد");
            if (!user.nationalCode || user.nationalCode.length < 9)
                errors.push("کد ملی معتبر نمی باشد");
            // if (user.city.length < 1) errors.push("نام شهر معتبر نمی باشد");
            // if (user.job.length < 2) errors.push("شغل معتبر نمی باشد");
            // user.imgURL &&
            if (!errors.length) return true; // has no error
            errors.forEach((error) => this.$toasted.error(error));
            return false;
        },
        TrimUserData() {
            const user = this.user;
            for (const key in user) {
                const element = user[key];
                if (typeof element === "number" || element === null) continue;
                user[key] = element.trim();
            }
        },
        changePass() {
            this.password = this.password.trim();
            const password = this.password;
            if (password.length < 5) {
                this.$toasted.error("پسورد به اندازه کافی قوی نیست");
                return;
            }
            if (password !== this.rpassword) {
                this.$toasted.error(
                    "فیلد های پسورد و تکرار پسورد یکسان نیستند"
                );
                return;
            }
            this.$axios
                .patch(`/users/${this.user._id}`, { password })
                .then(() => {
                    this.$toasted.success("پسورد با موفقیت تغییر کرد");
                    this.$store.commit(
                        "LOGOUT",
                        `/profile/${this.user.username}`
                    );
                })
                .catch((error) => {
                    this.$store.dispatch("handleAxiosError", error);
                });
        },
        async uploadAvatar(event) {
            const avatar = event.target.files[0];
            if (!avatar) return;
            if (avatar.size > 2e5) {
                this.$toasted.error("حجم آواتار حداکثر 200kb میتواند باشد");
                return;
            }
            // create form data
            const fd = new FormData();
            // just add file instance to form data normally
            fd.append("avatar", avatar);

            await this.$axios
                .post("/uploadAvatarImage", fd, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then(({ data }) => this.storeUserData({ avatar: data.url }))
                .catch(() => {
                    this.$toasted.error(
                        "آپلود عکس با مشکل روبرو شده. لطفا دوباره امتحان کنید ..."
                    );
                    return false;
                });
            // clear input value to make selecting the same image work
            event.target.value = "";
        },
        storeUserData(data) {
            this.user = { ...this.user, ...data };
            this.$store.state.user = { ...this.$store.state.user, ...data };
            // * add to localStorage
            const userData = JSON.parse(localStorage.getItem("sjufNEbjDmE")); // sjufNEbjDmE = userData
            userData.user = { ...userData.user, ...data };
            localStorage.setItem("sjufNEbjDmE", JSON.stringify(userData));
        },
    },
    mounted() {
        this.user = { ...this.user, ...this.$store.state.user };
        delete this.user.accessToken;
        const routeUsername = this.$router.currentRoute.params.username;
        if (this.user.username !== routeUsername)
            this.$router.push(`/profile/${this.user.username}/setting`);
    },
};
</script>

