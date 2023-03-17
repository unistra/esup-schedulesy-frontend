import Vue from 'vue';
import Vuex from 'vuex';
import ui from './modules/ui';
import config from './modules/config';
import calendar from './modules/calendar';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
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
