import Vue from 'vue';
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';
import AsyncComputed from 'vue-async-computed';
import Cas from 'vue-cas-authentication';
import UnistraSchedule from './UnistraSchedule.vue';
import vuetify from '@/plugins/vuetify';
import '@/plugins/leaflet';
import axios from '@/plugins/axios';
import router from '@/router/router';
import store from '@/store/store';

Vue.config.productionTip = false;
const environment = process.env.VUE_APP_DEPLOYMENT_ENV;

if (environment !== 'dev' && environment !== 'ernestDev' && environment !== 'ernestTest') {
  Sentry.init({
    dsn: 'https://e9d82adcf1b04ef8a63915b765fc371f@sentry.app.unistra.fr/6',
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

Vue.use(AsyncComputed);

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

Vue.config.devtools = environment === 'dev' || environment === 'test' || environment === 'ernestDev' || environment === 'ernestTest';

new Vue({
  vuetify,
  router,
  store,
  axios,
  render: h => h(UnistraSchedule),
}).$mount('#unistra-schedule-container');
