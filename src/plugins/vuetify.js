import Vue from "vue";
import Vuetify, {
  VApp,
  VContent, 
  VContainer,
} from "vuetify/lib";
import ru from "vuetify/es5/locale/ru";

Vue.use(Vuetify, {
  components: {
    VApp,
    VContent,
    VContainer,
  }
});

export default new Vuetify({
  lang: {
    locales: { ru },
    current: "ru"
  },
  icons: {
    iconfont: "mdi"
  }
});
