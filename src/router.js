import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const environment = process.env.VUE_APP_DEPLOYMENT_ENV.substr(0, 6);
const home = environment === 'ernest'
  ? () => import(/* webpackChunkName: "home" */ '@/views/core/CoreRootAppErnest.vue')
  : () => import(/* webpackChunkName: "home" */ '@/views/core/CoreRootApp.vue');

export default new VueRouter({
  mode: 'history',
  base: process.env.VUE_APP_BASE_URL_ROUTER,
  routes: [
    {
      path: '',
      name: 'home',
      component: home,
      children: [
        {
          path: 'config',
          name: 'config',
          component: () => import(/* webpackChunkName: "configurator" */ '@/views/ScheduleConfigurator.vue'),
        },
        {
          path: 'consult',
          name: 'consult',
          component: () => import(/* webpackChunkName: "viewer" */ '@/views/ScheduleViewer.vue'),
        },
      ],
    },
    {
      path: '/auth/cas/logout',
      name: 'cas-auth-logout',
    },
  ],
});
