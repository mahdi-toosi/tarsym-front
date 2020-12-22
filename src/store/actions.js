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
    change_map_layers({ commit, state }, mainMap) {
        if (mainMap) {
            commit("map/SET_MAIN_LAYER");
            return;
        }
        const docs = router.currentRoute.name === "read doc" ? state.docs.readDoc : state.docs.newDocs;
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
            dispatch("auth/logout");
        } else {
            msg = error;
            // msg = "مشکلی در ارتباط با سرور بوجود آمده، لطفا چند دقیقه بعد دوباره امتحان کنید";
            console.log("request get error => ", msg);
        }
        Vue.toasted.error(msg);
    },
};
