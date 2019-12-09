import {
  loadUserEvents,
  checkUserCustomizationLoaded,
  checkUserEventsLoaded
} from '@/utils/router';

const environment = process.env.VUE_APP_DEPLOYMENT_ENV.substr(0, 6);
const home = environment === 'ernest'
  ? () => import(/* webpackChunkName: "home" */ '@/views/core/CoreRootAppErnest.vue')
  : () => import(/* webpackChunkName: "home" */ '@/views/core/CoreRootApp.vue');

export default [
  {
    path: '',
    name: 'home',
    component: home,
    beforeEnter: checkUserCustomizationLoaded,
    children: [
      {
        path: 'config',
        name: 'config',
        component: () => import(/* webpackChunkName: "configurator" */ '@/views/ScheduleConfigurator.vue'),
      },
      {
        path: 'consult',
        name: 'consult',
        beforeEnter: loadUserEvents,
        component: () => import(/* webpackChunkName: "viewer" */ '@/views/ScheduleViewer.vue'),
        children: [
          {
            path: 'calendar',
            name: 'calendar',
            beforeEnter: checkUserEventsLoaded,
            component: () => import(/* webpackChunkName: "viewer" */ '@/views/viewer/ViewerCalendar.vue'),
          },
          {
            path: 'list',
            name: 'list',
            beforeEnter: checkUserEventsLoaded,
            component: () => import(/* webpackChunkName: "viewer" */ '@/views/viewer/ViewerList.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/auth/cas/logout',
    name: 'cas-auth-logout',
  },
];
