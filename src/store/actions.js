import Vue from "vue";
import router from "../router";
import axios from "axios";

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
        let msg;
        if (error == "Error: Network Error") msg = "مشکل در برقراری ارتباط با سرور";
        // else if (error == "Error: Request failed with status code 409") msg = "مختصات شاخص قبلا به ثبت رسیده است";
        else if (error == "Error: Request failed with status code 503") msg = "مشکل در برقراری ارتباط با سرور";
        else if (error == "Error: Request failed with status code 400") msg = "درخواست شما معتبر نمیباشد";
        else if (error == "Error: Request failed with status code 500") msg = "مشکلی در سرور بوجود آمده است";
        else if (error == "Error: Request failed with status code 404") msg = "دیتای درخواستی پیدا نشد ...";
        else if (error == "Error: Request failed with status code 401") {
            // msg = "نام کاربری یا رمز عبور اشتباه است"
            dispatch("logout");
        } else {
            msg = error;
            // msg = "مشکلی در ارتباط با سرور بوجود آمده، لطفا چند دقیقه بعد دوباره امتحان کنید";
            console.log("request get error => ", msg);
        }
        Vue.toasted.error(msg);
    },
    async login({ dispatch }, user) {
        const data = {
            strategy: "local",
            ...user,
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

                //  router.currentRoute.query.redirect ||
                await router.push("/");
            })
            .catch((error) => {
                if (error == "Error: Request failed with status code 401") {
                    Vue.toasted.error("نام کاربری یا رمز عبور اشتباه است ...");
                    return;
                }
                dispatch("handleAxiosError", error, { root: true });
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
    },
};
