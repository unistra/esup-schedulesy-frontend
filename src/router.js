import Vue from 'vue';
import VueRouter from 'vue-router';
import ScheduleConfigurator from '@/views/ScheduleConfigurator.vue';

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  base: '',
  routes: [
    {
      path: '/config',
      alias: '',
      component: ScheduleConfigurator,
    },
  ],
});
