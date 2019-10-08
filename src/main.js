import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import vuetify from "./plugins/vuetify";
import { auth } from "./firebaseConfig.js";

import "./styles/style.css";

Vue.config.productionTip = false;

if (process.env.NODE_ENV !== "production") {
  Vue.config.performance = true;
  Vue.config.devtools = true;
  Vue.config.warnHandler = (msg, vm, trace) => {
    console.group();
    console.warn(msg);
    console.log(vm);
    console.log(trace);
    console.groupEnd();
  };
}
Vue.config.errorHandler = (err, vm, info) => {
  console.group();
  console.error(err);
  console.log(vm);
  console.log(info);
  console.groupEnd();
};

let app;
auth.onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount("#app");
  }
});
