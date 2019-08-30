import Vue from 'vue';
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';
import UnistraSchedule from './UnistraSchedule.vue';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

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

new Vue({
  vuetify,
  render: h => h(UnistraSchedule),
}).$mount('#unistra-schedule-container');
