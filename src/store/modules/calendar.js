import Vue from 'vue';
import moment from 'moment';
import chroma from 'chroma-js';

import router from '@/router/router';

export default {
  namespaced: true,
  state: {
    userEvents: {},
    areUserEventsLoaded: false,
  },
  getters: {
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
    loadUserEvents: ({ dispatch, commit, rootGetters }) => new Promise((resolve, reject) => {
      commit('UPDATE_ARE_USER_EVENTS_LOADED', false);
      Vue.axios
        .get(`${process.env.VUE_APP_BACKEND_API_URL}/calendar/${rootGetters['auth/getLogin']}.json`)
        .then(
          (response) => {
            let { events } = response.data;
            const pastelize = toPastelize => chroma(toPastelize).set('hsl.s', '*0.8').set('hsl.l', '0.9').hex();
            let eventsColors = {};
            try {
              if (!events.events.length) reject(new Error('Les ressources que vous avez sélectionnées ne contiennent plus d\'évènements. Veuillez vérifier votre sélection de ressources.'));
              events.events.forEach((event) => {
                const userCustomization = rootGetters['config/getUserCustomization'];
                const userTheme = userCustomization.configuration && userCustomization.configuration.theme
                  ? userCustomization.configuration.theme
                  : 'default';
                if (userTheme === 'pastel' && event.color !== '#ffffff') {
                  const color = event.color;
                  if (Object.keys(eventsColors).includes(color.substr(1))) {
                    event.color = eventsColors[color.substr(1)]
                  } else {
                    const newColor = pastelize(color);
                    eventsColors[color.substr(1)] = newColor;
                    event.color = newColor;
                  }
                }
              });
            } catch (error) {
              if (error instanceof TypeError) reject(new Error('Les ressources que vous avez sélectionnées ne contiennent plus d\'évènements. Veuillez vérifier votre sélection de ressources.'));
            } finally {
              commit('LOAD_USER_EVENTS', events);
            };
            resolve(events);
          },
          (error) => {
            if (error.response.status === 413) reject(new Error('Limite d\'évènements à afficher atteinte. Veuillez sélectionner moins de ressources'));
          },
        );
    }),
  },
  mutations: {
    LOAD_USER_EVENTS: (state, payload) => {
      state.userEvents = payload;
      state.areUserEventsLoaded = true;
    },
    UPDATE_ARE_USER_EVENTS_LOADED: (state, payload) => { state.areUserEventsLoaded = payload; },
  },
};
