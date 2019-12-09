import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from '@/router/routes';

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  base: process.env.VUE_APP_BASE_URL_ROUTER,
  routes,
});
