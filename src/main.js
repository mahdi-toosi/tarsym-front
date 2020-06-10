import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// * vue select
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
Vue.component('v-select', vSelect);
// * axios
import axios from "axios";
Vue.prototype.$axios = axios;
// * sweet alert
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import 'font-awesome/css/font-awesome.css';
Vue.use(VueSweetalert2);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");