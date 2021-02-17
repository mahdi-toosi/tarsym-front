import Vue from "vue";
import router from "../router";
import axios from "axios";
import NProgress from "nprogress";

export default {
    update_zoom({ commit }, zoom) {
        commit("map/UPDATE_ZOOM", zoom);
        commit("docs/UPDATE_ZOOM", zoom);
    },
    update_center({ commit }, center) {
        commit("map/UPDATE_CENTER", center);
        commit("docs/UPDATE_CENTER", center);
    },
    update_layer({ commit }, layerIndex) {
        commit("map/UPDATE_LAYER", layerIndex);
        commit("docs/UPDATE_LAYER", layerIndex);
    },
    change_map_layers({ commit, state, rootState }, mainMap) {
        if (mainMap) {
            commit("map/SET_MAIN_LAYER");
            return;
        }
        const docs = rootState.route.name === "read doc" ? state.docs.readDoc : state.docs.newDocs;
        const doc = docs[state.docs.DocProp.index];
        if (!doc) return;

        commit("map/SET_THIS_LAYER", doc.map_animate.layerIndex);
    },
    // !  handleAxiosError
    handleAxiosError({ dispatch }, error) {
        NProgress.done();
        console.log(error);
        let msg;
        if (error == "Error: Network Error") {
            msg = "مشکل در برقراری ارتباط با سرور";
            Vue.toasted.error(msg);
            return;
        }
        if (error.response) {
            const { status } = error.response;
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            if (status >= 500) msg = "مشکل در برقراری ارتباط با سرور";
            else if (status == 400) msg = "درخواست شما معتبر نمیباشد";
            else if (status == 404) msg = "دیتای درخواستی پیدا نشد ...";
            else if (status == 401) {
                msg = "شما دسترسی لازم را ندارید ...";
                dispatch("logout");
            } else {
                msg = "response get error , check the console";
                console.log("response get error => ", error);
            }
            Vue.toasted.error(msg);
        } else if (error.request) {
            console.log("request get error => ", error);
            Vue.toasted.error("request get error , check the console");
        } else {
            console.log("Error", error);
            Vue.toasted.error("check the console");
        }
    },
    async login({ dispatch }, { userData, redirectTo }) {
        const data = {
            strategy: "local",
            ...userData,
        };

        await axios
            .post("/authentication", data)
            .then(async (res) => {
                // * suspension
                if (res.data.user.role === 1) {
                    Vue.toasted.error("در حال حاضر حساب کاربری شما به حالت تعلیق در آمده");
                    return;
                }

                await dispatch("set_user_data", res.data);

                await router.push(redirectTo);
            })
            .catch((error) => {
                if (error == "Error: Request failed with status code 401") {
                    Vue.toasted.error("نام کاربری یا رمز عبور اشتباه است ...");
                    return;
                }
                dispatch("handleAxiosError", error);
            });
    },
    async sendVerifyCode({ dispatch }, { username, mobile }) {
        return await axios
            .post("/expiring-data", { username, mobile })
            .then(({ data }) => {
                Vue.toasted[data.type](data.msg);
                return true;
            })
            .catch((error) => {
                const errMsg = error.response.data.message;
                const alreadysended = "کد اعتبار سنجی قبلا برای شما ارسال شده است ...";

                if (errMsg == "id: value already exists.") {
                    Vue.toasted.info(alreadysended);
                    return false;
                } else if (errMsg == "username not found") {
                    Vue.toasted.info("با این نام کاربری ثبت نام نکرده اید");
                    return false;
                } else if (error == "Error: Request failed with status code 409") {
                    Vue.toasted.info(alreadysended);
                    return false;
                }
                dispatch("handleAxiosError", error);
                return false;
            });
    },
    set_user_data({ commit }, data) {
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

        commit("SET_USER", data.user);
        commit("SET_USER_ACCESS_TOKEN", data.accessToken);
    },
    async signup({ dispatch }, userData) {
        await axios
            .post("/users", userData)
            .then()
            .catch((error) => {
                if (error == "Error: Request failed with status code 409") {
                    Vue.toasted.error("نام کاربری قبلا به ثبت رسیده است");
                    return;
                }
                dispatch("handleAxiosError", error);
            });

        await dispatch("login", { userData, redirectTo: "/verify-mobile" });
    },
    logout({ commit }, redirect) {
        localStorage.removeItem("sjufNEbjDmE"); // sjufNEbjDmE = userData
        localStorage.removeItem("kemskDJobjgR"); // kemskDJobjgR = access key
        commit("CLEAR_USER");
        router.push({ path: "/Auth", query: { redirect } });
    },
    set_user_if_exist({ state, commit }, minimumRole) {
        const userData = JSON.parse(localStorage.getItem("sjufNEbjDmE")); // sjufNEbjDmE = userData
        if (!userData) return false;
        const now = new Date().getTime();
        commit("SET_USER", userData.user);
        commit("SET_USER_ACCESS_TOKEN", userData.accessToken);

        if (userData && userData.expire > now) {
            // * add user
            // * validate user role for route
            if (minimumRole <= state.user.role) return true;
            else {
                // Vue.toasted.error("اکانت شما دسترسی لازم برای استفاده از این صفحه را نداشت   ...");
                return false;
            }
        }
        return false;
    },
};
