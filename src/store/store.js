import Vue from 'vue';
import Vuex from 'vuex';
import ui from './modules/ui';
import auth from './modules/auth';
import config from './modules/config';
import calendar from './modules/calendar';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    config,
    calendar,
    ui,
  },
  state: {
  },
  getters: {
  },
  actions: {
  },
  mutations: {
  },
});
