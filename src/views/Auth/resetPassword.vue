<template>
    <div
        class="flip-card-inner"
        :class="resetPasswordPage ? '' : 'sendverifyCodePage'"
    >
        <div class="resetPassword">
            <h1>ریست پسورد</h1>
            <form @submit.prevent="resetPassword()">
                <input type="text" placeholder="username" v-model="username" />
                <input class="btn btn-green" type="submit" value="ارسال" />
            </form>
        </div>
        <div class="sendverifyCode">
            <h1>ارسال کد</h1>
            <form @submit.prevent="sendCode()">
                <div class="verifyCode">
                    <input
                        type="text"
                        placeholder="code ..."
                        v-model="verifyCode"
                        maxlength="8"
                    />
                    <span>{{ timeLeft }}</span>
                </div>
                <input class="btn btn-blue" type="submit" value="ارسال کد" />
            </form>
            <button
                :class="timeLeft == '00:00' ? 'active' : ''"
                @click="resetPassword()"
            >
                ارسال دوباره کد
            </button>
            <button
                :class="timeLeft == '00:00' ? 'active' : ''"
                @click="resetPasswordPage = timeLeft == '00:00' ? true : false"
            >
                تغییر نام کاربری
            </button>
        </div>
    </div>
</template>

<script>
var intervalTimer;

export default {
    data() {
        return {
            username: "",
            verifyCode: "",
            resetPasswordPage: true,
            selectedTime: 0,
            timeLeft: "00:00",
        };
    },
    methods: {
        resetPassword() {
            const url = "/reset-password";
            this.$axios
                .post(url, { username: this.username })
                .then((res) => {
                    console.log({ res });
                    this.$toasted.info(res.data.msg);
                    this.resetPasswordPage = false;
                    this.setTime(120);
                })
                .catch((error) => {
                    const msg = error.response.data.message;
                    if (msg == "id: value already exists.") {
                        this.$toasted.info(
                            "کد اعتبار سنجی قبلا برای شما ارسال شده است ..."
                        );
                        return;
                    } else if (msg == "username not found") {
                        this.$toasted.info(
                            "با این نام کاربری ثبت نام نکرده اید"
                        );
                        return;
                    } else {
                        this.$store.dispatch("handleAxiosError", error);
                    }
                });
        },
        sendCode() {
            const url = "/reset-password",
                options = {
                    params: {
                        username: this.username,
                        random_num: String(this.verifyCode),
                    },
                };

            this.$axios
                .delete(url, options)
                .then(async ({ data }) => {
                    await this.$store.dispatch(
                        "addDataToAxiosAndLocalStorage",
                        data
                    );
                    this.$router.push(
                        `/profile/${this.username}/change-password`
                    );
                })
                .catch((error) => {
                    if (error.response.data.message == "validation failed") {
                        this.$toasted.error("درخواست شما معتبر نمیباشد ...");
                        return;
                    } else {
                        this.$store.dispatch("handleAxiosError", error);
                    }
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
            // this.initialTime = this.selectedTime;
            intervalTimer = setInterval(() => {
                const secondsLeft = Math.round((end - Date.now()) / 1000);

                if (secondsLeft < 0) {
                    clearInterval(intervalTimer);
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
};
function zeroPadded(num) {
    // 4 --> 04
    return num < 10 ? `0${num}` : num;
}
</script>

<style lang="stylus">
.sendverifyCode {
    background: #f4f3fb;
}

.flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.6s;
    transform-style: preserve-3d;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}

.flip-card {
    background-color: transparent;
    perspective: 1000px;
}

.flip-card-inner.sendverifyCodePage {
    transform: rotateY(180deg);
}

.resetPassword, .sendverifyCode {
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
}

.sendverifyCode {
    transform: rotateY(180deg);

    .verifyCode {
        input {
            display: inline-block;
            letter-spacing: 10px;

            &::placeholder {
                letter-spacing: 1px;
            }
        }

        span {
            margin-left: 44px;
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