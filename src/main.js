import Vue from "vue";

// * NProgress
import NProgress from 'nprogress'
import 'nprogress/nprogress.css';

// * add axios and configs
import axios from "axios";
axios.defaults.baseURL = process.env.VUE_APP_DOMAIN
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('kemskDJobjgR')}` // kemskDJobjgR = access key
axios.interceptors.request.use(config => {
    NProgress.start()
    return config
})
axios.interceptors.response.use(response => {
    NProgress.done()
    return response
})
Vue.prototype.$axios = axios;

// * vuex and vue router
import router from "./router";
import store from "./store";

// * vue select
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
Vue.component('v-select', vSelect);

// * vue toasted
import Toasted from 'vue-toasted';
Vue.use(Toasted, {
    position: "bottom-left",
    duration: 5 * 1000,
    keepOnHover: true,
    iconPack: "fontawesome",
    icon: "fa-times-circle"
})

// *  vue slider styles , component register locally
import 'vue-slider-component/theme/antd.css'

// * add route data in vuex
import vuexSyncWithRouter from 'vuex-router-sync'
vuexSyncWithRouter.sync(store, router)

// * add PWA
import './registerServiceWorker'

Vue.config.productionTip = false;

// * add root component and 
import App from "./App.vue";

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");