<template>
    <div class="sendverifyCode">
        <h1>ارسال کد</h1>
        <form @submit.prevent="sendCode()">
            <div class="verifyCode">
                <div class="textField">
                    <label for="code">کد احراز هویت</label>
                    <input
                        id="code"
                        type="text"
                        inputmode="numeric"
                        placeholder="123***789"
                        v-model="verifyCode"
                        maxlength="8"
                        autocomplete="one-time-code"
                    />
                    <span>{{ timeLeft }}</span>
                </div>
            </div>
            <button
                class="btn btn-blue"
                type="submit"
                :disabled="verifyCode.length < 6"
            >
                ارسال کد
            </button>
        </form>
        <button
            :class="timeLeft == '00:00' ? 'active' : ''"
            @click="resetPassword()"
            :disabled="!buttonsSituation"
        >
            ارسال دوباره کد
        </button>
        <button
            :class="timeLeft == '00:00' ? 'active' : ''"
            @click="resetPasswordPage = true"
            :disabled="!buttonsSituation"
        >
            تغییر نام کاربری
        </button>
    </div>
</template>

<script>
let intervalTimer;

export default {
    name: "verifyMobilePage",
    metaInfo() {
        return {
            title: `ترسیم - تایید شماره همراه`,
            meta: [{ name: "robots", content: "noindex, nofollow" }],
        };
    },
    data() {
        return {
            status: null,
            username: null,
            verifyCode: "",
            selectedTime: 0,
            timeLeft: "00:00",
            buttonsSituation: false,
        };
    },
    methods: {
        resetPassword() {
            this.$store.dispatch("resetPassword", this.username);
        },
        async sendCode() {
            if (this.verifyCode.length < 6) return;
            const params = {
                username: this.username,
                code: this.verifyCode.trim(),
            };
            await this.$axios
                .delete("/expiring-data", { params })
                .then(async ({ data }) => {
                    // * login
                    if (this.status === "changePass") {
                        await this.$store.dispatch("set_user_data", data);
                        this.$toasted.info("پسورد خود را تغییر دهید ...");
                    }
                    this.$router.push(`/profile/${this.username}/setting`);
                })
                .catch((error) => {
                    const errMsg = error.response.data.message;
                    if (
                        errMsg == "validation failed" ||
                        errMsg == "Error 9568"
                    ) {
                        this.$toasted.error("درخواست شما معتبر نمیباشد ...");
                        return;
                    }
                    this.$store.dispatch("handleAxiosError", error);
                });
        },
        setTime(seconds) {
            clearInterval(intervalTimer);
            this.timer(seconds);
        },
        timer(seconds) {
            const now = Date.now();
            const end = now + seconds * 1000;
            this.displayTimeLeft(seconds);

            this.selectedTime = seconds;
            // this.initialTime = seconds;
            this.countdown(end);
        },
        countdown(end) {
            this.buttonsSituation = false;
            // this.initialTime = this.selectedTime;
            intervalTimer = setInterval(() => {
                const secondsLeft = Math.round((end - Date.now()) / 1000);

                if (secondsLeft < 0) {
                    clearInterval(intervalTimer);
                    this.buttonsSituation = true;
                    return;
                }
                this.displayTimeLeft(secondsLeft);
            }, 1000);
        },
        displayTimeLeft(secondsLeft) {
            const minutes = Math.floor((secondsLeft % 3600) / 60);
            const seconds = secondsLeft % 60;

            this.timeLeft = `${zeroPadded(minutes)}:${zeroPadded(seconds)}`;
        },
    },
    created() {
        const { username, status } = this.$router.currentRoute.query;
        if (!username) {
            this.$toasted.error(
                "فقط از طریق لینک های معتبر میتوانید از این صفحه استفاده کنید ..."
            );
            // this.$router.push("/");
        }
        this.username = username;
        this.status = status;
        this.setTime(120);
    },
};
function zeroPadded(num) {
    // 4 --> 04
    return num < 10 ? `0${num}` : num;
}
</script>

<style lang="stylus" scope>
.sendverifyCode {
    .verifyCode {
        input {
            display: inline-block;
            letter-spacing: 10px;
            text-align: left;
            direction: ltr;
        }

        span {
            // margin-left: 44px;
            // top: -20px;
            display: block;
            margin: 15px auto 0;
            width: 40px;
        }
    }

    button {
        color: gray;
    }

    button.active {
        cursor: pointer;
        color: black;
    }
}
</style>