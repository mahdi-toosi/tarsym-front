import Vue from "vue";
import router from "../../router";
import axios from "axios";

export default {
    async login({ dispatch, state }, user) {
        const data = {
            strategy: "local",
            ...user,
        };

        await axios
            .post("/authentication", data)
            .then(async (res) => {
                // * suspension
                if (res.data.user.role === 1) {
                    Vue.toasted.error("در حال حاضر اکانت شما توسط ادمین به حالت تعلیق در آمده");
                    return;
                }

                await dispatch("addDataToAxiosAndLocalStorage", res.data);

                await router.push(router.currentRoute.query.redirect || "/");

                state.showSidebarNav = true;
            })
            .catch((error) => {
                if (error == "Error: Request failed with status code 401") {
                    Vue.toasted.error("نام کاربری یا رمز عبور اشتباه است ...");
                    return;
                }
                dispatch("handleAxiosError", error);
            });
    },
    addDataToAxiosAndLocalStorage(store, data) {
        // * clean the data
        delete data.authentication;
        ["createdAt", "updatedAt", "__v"].forEach((element) => {
            delete data.user[element];
        });
        // * add Data To Axios And Local Storage
        const day = 60 * 60 * 1000 * 24; //* 24 hours
        data.expire = new Date().getTime() + day;
        localStorage.setItem("sjufNEbjDmE", JSON.stringify(data)); //* sjufNEbjDmE = userData
        localStorage.setItem("kemskDJobjgR", data.accessToken); //* kemskDJobjgR = access key
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
    },
    async signup({ dispatch }, userData) {
        await axios
            .post("/users", userData)
            .then(async () => await dispatch("login", userData))
            .catch((error) => {
                if (error == "Error: Request failed with status code 409") {
                    Vue.toasted.error("نام کاربری قبلا به ثبت رسیده است");
                    return;
                }
                dispatch("handleAxiosError", error);
            });
    },
};
