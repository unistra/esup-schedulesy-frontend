import moment from 'moment';

export default {
  namespaced: true,
  state: {
    isNavDrawerOpen: false,
    snackbar: {
      isVisible: false,
      color: '',
      message: '',
      timeout: 0,
    },
    calendar: {
      customType: 'week',
      now: moment().format().substring(0, 10),
      intervalHeight: 20,
      firstInterval: 14,
      intervalMinutes: 30,
      intervalCount: 26,
    },
  },
  getters: {
    getIsNavDrawerOpen: state => state.isNavDrawerOpen,
    getSnackbar: state => state.snackbar,
    getCalendarCustomType: state => state.calendar.customType,
  },
  actions: {
    updateDrawerState: ({ commit }, payload) => commit('UPDATE_DRAWER_STATE', payload),
    openNavDrawer: ({ commit }) => commit('UPDATE_DRAWER_STATE', true),
    updateSnackbar: ({ commit }, payload) => commit('UPDATE_SNACKBAR', payload),
    updateCalendarCustomType: ({ commit }, payload) => commit('UPDATE_CALENDAR_CUSTOM_TYPE', payload),
  },
  mutations: {
    UPDATE_DRAWER_STATE: (state, payload) => { state.isNavDrawerOpen = payload; },
    UPDATE_SNACKBAR: (state, payload) => { state.snackbar = payload; },
    UPDATE_CALENDAR_CUSTOM_TYPE: (state, payload) => { state.calendar.customType = payload; },
  },
};
