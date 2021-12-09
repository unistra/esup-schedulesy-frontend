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
    meta: {
      unistraCasAuthentication: true,
    },
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
    path: '/public/:resourceId',
    name: 'publicResource',
    component: () => import(/* webpackChunkName: "publicResource" */ '@/views/PublicResource'),
    props: (route) => ({
      resourceId: route.params.resourceId,
      type: route.query.type,
      layout: route.query.layout,
      intervalHeight: route.query.interval_height,
    }),
  },
  {
    path: '/public/:resourceId/:type',
    name: 'publicResourceType',
    component: () => import(/* webpackChunkName: "publicResource" */ '@/views/PublicResource'),
    props: true,
  },
  {
    path: '/public/:resourceId/:type/:layout',
    name: 'publicResourceTypeLayout',
    component: () => import(/* webpackChunkName: "publicResource" */ '@/views/PublicResource'),
    props: true,
  },
  {
    path: '/public/:resourceId/:type/:layout/:intervalHeight',
    name: 'publicResourceFull',
    component: () => import(/* webpackChunkName: "publicResource" */ '@/views/PublicResource'),
    props: true,
  },
  {
    path: '/auth/cas/logout',
    name: 'cas-auth-logout',
  },
];
