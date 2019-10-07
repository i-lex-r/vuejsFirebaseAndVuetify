import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

if (process.env.NODE_ENV !== "production") {
  Vue.config.performance = true;
  Vue.config.warnHandler = function(msg, vm, trace) {
    console.group();
    console.warn(msg);
    console.log(vm);
    console.log(trace);
    console.groupEnd();
  };
}
Vue.config.errorHandler = function(err, vm, info) {
  console.group();
  console.error(err);
  console.log(vm);
  console.log(info);
  console.groupEnd();
};

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
