import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store/store';
import Vuetify from '@/plugins/vuetify';

Vue.use(VueRouter);

const environment = process.env.VUE_APP_DEPLOYMENT_ENV.substr(0, 6);
const home = environment === 'ernest'
  ? () => import(/* webpackChunkName: "home" */ '@/views/core/CoreRootAppErnest.vue')
  : () => import(/* webpackChunkName: "home" */ '@/views/core/CoreRootApp.vue');

const checkUserCustomizationLoaded = (to, from, next) => {
  console.log('************************');
  console.log('BEFOREENTER COREROOTAPP ');
  console.log('************************');
  const proceed = () => {
    if (store.state.config.isUserCustomizationLoaded) {
      if (to.name !== 'home') {
        next();
      } else if (!store.state.config.userCustomization.resources) {
        next({ name: 'config' });
      } else if (Vuetify.framework.breakpoint.smAndDown
                 && 'displayMode' in store.state.config.userCustomization.configuration
                 && store.state.config.userCustomization.configuration.displayMode === 'list') {
        next({ name: 'list' });
      } else {
        next({ name: 'calendar' });
      }
    }
  };
  if (!store.state.config.isUserCustomizationLoaded) {
    store.watch(
      state => state.config.isUserCustomizationLoaded,
      (value) => {
        if (value === true) {
          proceed();
        }
      },
    );
  } else {
    proceed();
  }
};

const loadUserEvents = (to, from, next) => {
  console.log('************************');
  console.log('BEFOREENTER VIEWER');
  console.log('************************');
  store.dispatch('calendar/loadUserEvents').then(() => {
    next();
  });
};

const checkUserEventsLoaded = (to, from, next) => {
  console.log('************************');
  console.log('BEFOREENTER VIEWER CALENDAR OR LIST');
  console.log('************************');
  const proceed = () => {
    if (store.state.calendar.areUserEventsLoaded) {
      next();
    }
  };
  if (!store.state.calendar.areUserEventsLoaded) {
    console.log('IN USER EVENTS WATCHER');
    store.watch(
      state => state.calendar.areUserEventsLoaded,
      (value) => {
        if (value === true) {
          proceed();
        }
      },
    );
  } else {
    console.log('USER EVENTS LOADED - IN WATCHER');
    proceed();
  }
};

export default new VueRouter({
  mode: 'history',
  base: process.env.VUE_APP_BASE_URL_ROUTER,
  routes: [
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
  ],
});
