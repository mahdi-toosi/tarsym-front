import axios from "axios";
import Vue from "vue";
import router from "../router";

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
    logout({ commit }, redirect) {
        localStorage.removeItem("sjufNEbjDmE"); // sjufNEbjDmE = userData
        localStorage.removeItem("kemskDJobjgR"); // kemskDJobjgR = access key
        commit("auth/CLEAR_USER");
        router.push({ path: "/Auth", query: { redirect } });
        commit("HIDE_SIDEBAR");
    },
    // !  handleAxiosError
    handleAxiosError({ commit }, error) {
        let msg;
        if (error == "Error: Network Error") msg = "مشکل در برقراری ارتباط با سرور";
        // else if (error == "Error: Request failed with status code 409") msg = "مختصات شاخص قبلا به ثبت رسیده است";
        else if (error == "Error: Request failed with status code 503") msg = "مشکل در برقراری ارتباط با سرور";
        else if (error == "Error: Request failed with status code 400") msg = "درخواست شما معتبر نمیباشد";
        else if (error == "Error: Request failed with status code 500") msg = "مشکلی در سرور بوجود آمده است";
        else if (error == "Error: Request failed with status code 404") msg = "دیتای درخواستی پیدا نشد ...";
        else if (error == "Error: Request failed with status code 401") {
            // msg = "نام کاربری یا رمز عبور اشتباه است"
            commit("LOGOUT");
        } else {
            msg = error;
            // msg = "مشکلی در ارتباط با سرور بوجود آمده، لطفا چند دقیقه بعد دوباره امتحان کنید";
            console.log("request get error => ", msg);
        }
        Vue.toasted.error(msg);
    },

    // !  searchData
    async searchData(store) {
        const route = router.currentRoute;
        const url = "/searchInDocs";
        const options = {
            params: {},
        };
        if (route.query.area) options.params.area = route.query.area;
        if (route.query.text) options.params.text = route.query.text;
        await axios
            .get(url, options)
            .then((response) => console.log("response.data => ", response.data))
            .catch((error) => {
                if (error == "Error: Request failed with status code 415") {
                    Vue.toasted.error("محدوده ای که مشخص کرده اید معتبر نمیباشد ...");
                    return;
                }
                store.dispatch("handleAxiosError", error);
            });
    },
};
