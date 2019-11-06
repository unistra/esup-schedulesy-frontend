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
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: {
          base: '#3e8f93',
          lighten1: '#71c0c3',
          darken1: '#006165',
        },
        onprimary: '#ffffff',
        secondary: {
          base: '#93423e',
          lighten1: '#c76f69',
          darken1: '#611518',
        },
        onsecondary: '#000000',
      },
      dark: {
        primary: {
          base: '#94cad1',
          lighten1: '#c6fdff',
          darken1: '#6499a0',
        },
        onprimary: '#000000',
        secondary: {
          base: '#d19b94',
          lighten1: '#ffccc4',
          darken1: '#9f6d66',
        },
        onsecondary: '#000000',
      },
    },
  },
});
