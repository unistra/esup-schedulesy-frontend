import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './store/store';

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  base: '',
  routes: [
    {
      path: '/config',
      alias: '',
      name: 'config',
      component: () => import(/* webpackChunkName: "configurator" */ '@/views/ScheduleConfigurator.vue'),
    },
    {
      path: '/consult',
      name: 'consult',
      component: () => import(/* webpackChunkName: "viewer" */ '@/views/ScheduleViewer.vue'),
    },
    {
      path: '/auth/cas/logout',
      name: 'cas-auth-logout',
    },
  ],
});
