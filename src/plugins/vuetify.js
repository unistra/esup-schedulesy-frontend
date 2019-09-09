import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import fr from 'vuetify/es5/locale/fr';

Vue.use(Vuetify);

export default new Vuetify({
  lang: {
    locales: { fr },
    current: 'fr',
  },
  icons: {
    iconfont: 'mdi',
  },
});
