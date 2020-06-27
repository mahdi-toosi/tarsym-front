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
// * vue toasted
import Toasted from 'vue-toasted';
Vue.use(Toasted)

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");