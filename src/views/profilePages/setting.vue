<template>
    <div class="signupForm auth">
        <h1>تنظیمات حساب کاربری</h1>
        <form @submit.prevent="updateUserData()">
            <div class="profileAvatar">
                <img
                    class="profile-pic"
                    :src="avatar || '/imgs/profileAvatar.png'"
                    :alt="avatar ? user.name : 'پروفایل ترسیم'"
                    width="90"
                    height="90"
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

            <div class="textField">
                <label for="username">نام کاربری</label>
                <input type="text" :value="user.username" disabled />
            </div>
            <div class="textField">
                <label for="name">نام و نام خانوادگی</label>
                <input
                    type="text"
                    v-model="user.name"
                    id="name"
                    placeholder="امین هاشمی"
                    name="name"
                    autocomplete="name"
                    dir="rtl"
                    required
                />
            </div>
            <div class="textField">
                <label for="nationalCode">کد ملی</label>
                <input
                    placeholder="078****215"
                    type="text"
                    inputmode="numeric"
                    dir="ltr"
                    id="nationalCode"
                    v-model="user.nationalCode"
                    required
                />
            </div>
            <div class="textField">
                <label for="city">شهر</label>
                <input
                    type="text"
                    id="city"
                    placeholder="تهران"
                    v-model="user.city"
                />
            </div>
            <div class="textField">
                <label for="job">شغل</label>
                <input
                    type="text"
                    id="job"
                    placeholder="دبیر آموزش پرورش"
                    v-model="user.job"
                />
            </div>

            <button
                class="btn btn-green"
                type="submit"
                v-text="
                    user.role < 35 ? 'ارتقاء به نقشه ساز' : 'بروزرسانی اطلاعات'
                "
            ></button>
        </form>
        <form @submit.prevent="changeMobileNum()" style="margin-top: 1.5rem">
            <div class="textField">
                <label for="mobile">شماره موبایل</label>
                <input
                    id="mobile"
                    type="tel"
                    placeholder="0915****123"
                    name="mobile"
                    autocomplete="tel"
                    dir="ltr"
                    required
                    v-model="mobile"
                />
            </div>
            <button class="btn btn-blue" type="submit">
                تغییر شماره موبایل
            </button>
        </form>
        <form @submit.prevent="changePass()" style="margin-top: 1.5rem">
            <div class="textField">
                <label for="password">رمز عبور</label>
                <input
                    id="password"
                    type="password"
                    placeholder="$amin*****%@jh"
                    name="new-password"
                    autocomplete="new-password"
                    dir="auto"
                    required
                    v-model="password"
                />
            </div>
            <div class="textField">
                <label for="rpassword">تکرار رمز عبور</label>
                <input
                    type="password"
                    id="rpassword"
                    placeholder="$amin*****%@jh"
                    dir="auto"
                    required
                    v-model="rpassword"
                />
            </div>
            <button class="btn btn-blue" type="submit">تغییر رمز عبور</button>
        </form>
    </div>
</template>

<script>
export default {
    name: "SettingPage",
    metaInfo() {
        return {
            title: `ترسیم - تنظیمات حساب کاربری`,
            meta: [{ name: "robots", content: "noindex, nofollow" }],
        };
    },
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
        async changeMobileNum() {
            const mobile = this.mobile;
            const username = this.user.username;
            if (!mobile.match(/^(\+98|0)?9\d{9}$/g)) {
                this.$toasted.error("شماره تلفن همراه معتبر نمیباشد");
                return;
            }
            const res = await this.$store.dispatch("sendVerifyCode", {
                username,
                mobile,
                reason: "reset mobile",
            });
            if (!res) return;

            this.$router.push({
                path: "/auth/verify-mobile",
                query: { username, status: "change mobile num" },
            });
        },
        async updateUserData() {
            if (!this.validateSignupForm()) return;
            const { _id, name, city, job, nationalCode, role } = this.user;
            await this.$axios
                .patch(`/users/${_id}`, {
                    _id,
                    name,
                    city,
                    job,
                    nationalCode,
                })
                .then(({ data }) => {
                    this.updateUser(data);
                    // * show result message
                    let msg;
                    if (role < 35)
                        msg =
                            "پس از بررسی اطلاعات شما ، شما به نقشه ساز ارتقاء خواهید یافت";
                    else msg = "اطلاعات شما با موفقیت بروزرسانی شد";
                    this.$toasted.success(msg, {
                        icon: "fa-check-circle",
                    });
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
            if (
                user.nationalCode ||
                user.nationalCode.length < 9 ||
                typeof +user.nationalCode !== "number"
            )
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
                .patch(`/users/${this.user._id}`, {
                    _id: this.user._id,
                    password,
                })
                .then(() => {
                    this.$toasted.success("پسورد با موفقیت تغییر کرد", {
                        icon: "fa-check-circle",
                    });
                    this.$store.dispatch(
                        "logout",
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
                .then(({ data }) => this.updateUser({ avatar: data.url }))
                .catch(() => {
                    this.$toasted.error(
                        "آپلود عکس با مشکل روبرو شده. لطفا دوباره امتحان کنید ..."
                    );
                    return false;
                });
            // clear input value to make selecting the same image work
            event.target.value = "";
        },
        updateUser(data) {
            this.user = { ...this.user, ...data };
            this.$store.commit("UPDATE_USER", data);
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
<style lang="stylus">
@import '../../assets/styles/libs/auth';
</style>
