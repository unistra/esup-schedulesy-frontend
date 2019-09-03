import Vue from 'vue';
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';
import Cas from 'vue-cas-authentication';
import UnistraSchedule from './UnistraSchedule.vue';
import vuetify from './plugins/vuetify';
import router from '@/router';
import axios from '@/axios';

Vue.config.productionTip = false;

if (process.env.VUE_APP_DEPLOYMENT_ENV !== 'dev') {
  Sentry.init({
    dsn: 'https://74d930ab848d4d40a99c2e8326d5d079@sentry-test.app.unistra.fr/23',
    release: VERSION,
    environment: process.env.VUE_APP_DEPLOYMENT_ENV,
    integrations: [
      new Integrations.Vue({
        Vue,
        attachProps: true,
      }),
    ],
  });
}

const options = {
  appIsAllAuth: true,
  authCasLogoutUrl: 'cas-auth-logout',
  jwtServerUrl: process.env.VUE_APP_JWT_SERVER_URL,
};
Vue.use(Cas, {
  router,
  axios,
  options,
});

new Vue({
  vuetify,
  router,
  axios,
  render: h => h(UnistraSchedule),
}).$mount('#unistra-schedule-container');
