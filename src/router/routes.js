export default [
  {
    path: '/',
    name: 'root',
    component: () => import(/* webpackChunkName: "unistraschedule" */ '@/layouts/Default.vue'),
    meta: {
      unistraCasAuthentication: true,
    },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import(/* webpackChunkName: "schedule" */ '@/views/ScheduleView.vue'),
      },
      {
        path: 'config',
        name: 'config',
        component: () => import(/* webpackChunkName: "configurator" */ '@/views/ConfigView.vue'),
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
