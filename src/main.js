import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import 'element-ui/lib/theme-chalk/index.css';
import "@/static/index.scss";

Vue.config.productionTip = false;

import { Popover, Slider, Loading } from "element-ui";

Vue.use(Popover);
Vue.use(Slider);
Vue.use(Loading.directive);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
