import moment from 'moment';
import chroma from 'chroma-js';

import { getUsername } from '@/services/authService';
import { getUserEvents } from '@/services/eventsService';

export default {
  namespaced: true,
  state: {
    userEvents: {},
  },
  getters: {
    events: (state) => state.userEvents,
    getEvents: (state) => {
      if (state.userEvents.events && state.userEvents.events.length) {
        return state.userEvents.events.map(event => ({
          ...event,
          ...{
            start: `${moment(event.date, 'DD/MM/YYYY').format().substring(0, 10)} ${event.startHour}`,
            end: `${moment(event.date, 'DD/MM/YYYY').format().substring(0, 10)} ${event.endHour}`,
          },
        }));
      }
      return [];
    },
    getEventsInstructors: state => (state.userEvents.instructors ? state.userEvents.instructors : null),
    getEventsClassrooms: state => (state.userEvents.classrooms ? state.userEvents.classrooms : null),
    getEventsTrainees: state => (state.userEvents.trainees ? state.userEvents.trainees : null),
    getEventsCategory5s: state => (state.userEvents.category5s ? state.userEvents.category5s : null),
  },
  actions: {
    loadUserEvents: async ({ commit, rootGetters }) => {
      let events
      const username = getUsername()
      try {
        events = await getUserEvents(username)
      } catch (error) {
        if (error?.response?.status === 413) throw new Error('Limite d\'évènements à afficher atteinte. Veuillez sélectionner moins de ressources')
      }

      const userHasResources = rootGetters['config/userHasResources']
      const noEvents = !events.events.length
      if (userHasResources && noEvents) throw new Error('Les ressources que vous avez sélectionnées ne contiennent plus d\'évènements. Veuillez vérifier votre sélection de ressources.')

      const pastelize = (toPastelize) => {
        const isWhite = toPastelize === '#ffffff'
        if (isWhite) return toPastelize
        return chroma(toPastelize).set('hsl.s', '*0.8').set('hsl.l', '0.9').hex();
      }
      const pastelizeEvents = () => {
        const pastelColors = new Map()
        events.events.forEach((event) => {
          const oldColor = event.color
          if (pastelColors.has(oldColor)) event.color = pastelColors.get(oldColor)
          else {
            const newColor = pastelize(oldColor)
            event.color = newColor
            pastelColors.set(oldColor, newColor)
          }
        })
      }

      const needPastelize = rootGetters['config/userTheme'] === 'pastel'
      if (needPastelize) pastelizeEvents()

      commit('LOAD_USER_EVENTS', events)
    },
  },
  mutations: {
    LOAD_USER_EVENTS: (state, payload) => {
      state.userEvents = payload;
    },
  },
};
