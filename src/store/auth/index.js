import Vue from "vue";
import router from "../../router";
import axios from "axios";

export default {
    namespaced: true,
    state: {
        user: {},
    },
    mutations: {
        SET_USER(state, user) {
            state.user = user;
        },
        SET_USER_ACCESS_TOKEN(state, token) {
            if (state.user) state.user.accessToken = token;
        },
        CLEAR_USER(state) {
            state.user = {};
        },
        UPDATE_USER(state, data) {
            state.user = { ...state.user, ...data };
            // * add to localStorage
            const userData = JSON.parse(localStorage.getItem("sjufNEbjDmE")); // sjufNEbjDmE = userData
            userData.user = { ...userData.user, ...data };
            localStorage.setItem("sjufNEbjDmE", JSON.stringify(userData));
        },
    },
    actions: {
        async login({ dispatch, commit }, user) {
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

                    commit("SHOW_SIDEBAR", null, { root: true });
                })
                .catch((error) => {
                    if (error == "Error: Request failed with status code 401") {
                        Vue.toasted.error("نام کاربری یا رمز عبور اشتباه است ...");
                        return;
                    }
                    dispatch("handleAxiosError", error, { root: true });
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
                    dispatch("handleAxiosError", error, { root: true });
                });
        },
        logout({ commit }, redirect) {
            localStorage.removeItem("sjufNEbjDmE"); // sjufNEbjDmE = userData
            localStorage.removeItem("kemskDJobjgR"); // kemskDJobjgR = access key
            commit("CLEAR_USER");
            router.push({ path: "/Auth", query: { redirect } });
            commit("HIDE_SIDEBAR", null, { root: true });
        },
    },
};
