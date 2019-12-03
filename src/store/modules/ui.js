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
    signature: {
      UDS: [
        {
          href: 'https://services-numerique.unistra.fr',
          title: 'Direction du numérique',
          spans: [
            'Direction',
            'du <strong>numérique</strong>',
          ],
        },
        {
          href: 'https://unistra.fr',
          title: 'Université de Strasbourg',
          spans: [
            'Université de Strasbourg',
          ],
        },
      ],
      ENGEES: [
        {
          href: 'https://engees.unistra.fr/',
          title: 'ENGEES',
          spans: [
            '<strong>Ecole nationale</strong>',
            'du génie de l\'<strong>eau</strong>',
          ],
        },
        {
          href: 'https://engees.unistra.fr/',
          title: 'ENGEES',
          spans: [
            'et de l\'<strong>environnement</strong> de Strasbourg',
          ],
        },
      ],
    },
    calendar: {
      displayModes: [
        { label: 'Mois', value: 'month' },
        { label: 'Semaine', value: 'week' },
        { label: 'Personnalisé', value: 'custom' },
        { label: 'Jour', value: 'day' },
        { label: 'Liste', value: 'list' },
      ],
      customType: '',
      ref: 'calendar',
      locale: 'fr-FR',
      color: 'primary darken-1',
      today: moment().format().substring(0, 10),
      eventTextColor: 'onsecondary',
      intervalHeight: 20,
      firstInterval: 14,
      intervalMinutes: 30,
      intervalCount: 26,
    },
    configurator: {
      displayedDays: [
        { label: 'Lundi', value: 1 },
        { label: 'Mardi', value: 2 },
        { label: 'Mercredi', value: 3 },
        { label: 'Jeudi', value: 4 },
        { label: 'Vendredi', value: 5 },
        { label: 'Samedi', value: 6 },
        { label: 'Dimanche', value: 0 },
      ],
    },
  },
  getters: {
    getIsNavDrawerOpen: state => state.isNavDrawerOpen,
    getSnackbar: state => state.snackbar,
    getCalendarSettings: state => state.calendar,
    getCalendarToday: state => state.calendar.today,
    getCalendarDisplayModes: state => state.calendar.displayModes,
    getCalendarCustomType: state => state.calendar.customType,
    getDisplayedDays: state => state.configurator.displayedDays,
    getSignature: state => organization => state.signature[organization],
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
