import Vue from 'vue';
import { forgeResourcesRoot, childrenEntryGenerator } from '@/utils';

const resourceTypes = {
  trainee: 'Etudiants',
  instructor: 'Enseignants',
  classroom: 'Salles',
  category5: 'Matières',
};

export default {
  namespaced: true,
  state: {
    resources: [],
    userCustomization: {},
    icsParams: {},
  },
  getters: {
    getResources: state => Object.keys(resourceTypes).map(type => state.resources.find(resource => resource.category === type)),
    getDisplayTypes: state => state.displayTypes,
    getUserCustomization: state => state.userCustomization,
    getUserDisplayType: (state) => {
      return state.userCustomization.display_configuration ? state.userCustomization.display_configuration : '';
    },
    getUserResources: state => state.userCustomization.resources,
    getUserResourcesIds: (state) => {
      if (typeof state.userCustomization.resources === 'string' && state.userCustomization.resources.length > 0) {
        return state.userCustomization.resources
          .split(',');
      }
      return [];
    },
    getUserResourcesUrls: (state) => {
      if (typeof state.userCustomization.resources === 'string' && state.userCustomization.resources.length > 0) {
        return state.userCustomization.resources
          .split(',')
          .map(resource => `${process.env.VUE_APP_BACKEND_API_URL}/resource/${resource}.json/`);
      }
      return [];
    },
    getBaseIcsUrl: (state, getters) => {
      if (typeof state.icsParams.base_url === 'string' && state.icsParams.base_url.length > 0) {
        const params = Object.entries(state.icsParams.params).map(param => `${param[0]}=${param[1]}`).join('&');
        const resources = getters.getUserResourcesIds.map(resource => `resources=${resource}`).join('&');
        return `${state.icsParams.base_url}?${params}&${resources}`;
      }
      return '';
    },
  },
  actions: {
    loadResources: ({ commit }) => new Promise((resolve, reject) => {
      Object.keys(resourceTypes).forEach((type) => {
        Vue.axios
          .get(`${process.env.VUE_APP_BACKEND_API_URL}/resource/${type}.json`)
          .then(response => response.data)
          .then((rawResources) => {
            commit('LOAD_RESOURCE', forgeResourcesRoot(rawResources, resourceTypes));
            resolve();
          }).catch(error => reject(error));
      });
    }),
    loadResourceChildren: ({ commit }, payload) => new Promise((resolve, reject) => {
      Vue.axios
        .get(`${payload.id}`)
        .then(response => response.data)
        .then(rawNode => ({
          ...rawNode,
          ...{ children: rawNode.children.map(child => childrenEntryGenerator(child)) },
        })).then((node) => {
          commit('LOAD_CHILDREN', node);
          resolve();
        }).catch(error => reject(error));
    }),
    loadUserCustomization: ({ dispatch, commit, rootGetters }) => new Promise((resolve, reject) => {
      Vue.axios
        .get(`${process.env.VUE_APP_BACKEND_LEGACY_URL}/customization/${rootGetters['auth/getLogin']}.json`)
        .then(response => response.data)
        .then((userCustomization) => {
          commit('LOAD_USER_CUSTOMIZATION', userCustomization);
          if(userCustomization.configuration && userCustomization.configuration.weekdays && userCustomization.configuration.weekdays.length) {
            dispatch('ui/updateCalendarCustomType', 'custom', { root: true });
          }
          resolve();
        }).catch(error => reject(error));
    }),
    patchUserCustomization: ({ dispatch, commit, rootGetters }, payload) => new Promise((resolve, reject) => {
      Vue.axios
        .patch(`${process.env.VUE_APP_BACKEND_LEGACY_URL}/customization/${rootGetters['auth/getLogin']}.json`, payload.changes)
        .then((response) => {
          dispatch('ui/updateSnackbar', payload.snackbar.success, { root: true });
          commit('LOAD_USER_CUSTOMIZATION', response.data);
          resolve();
        }).catch((error) => {
          dispatch('ui/updateSnackbar', payload.snackbar.error, { root: true });
          reject(error);
        });
    }),
    loadIcsParams: ({ commit }) => new Promise((resolve, reject) => {
      Vue.axios
        .get(`${process.env.VUE_APP_BACKEND_API_URL}/ade_config.json`)
        .then(response => response.data)
        .then((icsParams) => {
          commit('LOAD_ICS_PARAMS', icsParams);
          resolve();
        }).catch(error => reject(error));
    }),
  },
  mutations: {
    LOAD_RESOURCE: (state, payload) => state.resources.push(payload),
    LOAD_USER_CUSTOMIZATION: (state, payload) => { state.userCustomization = payload; },
    LOAD_CHILDREN: (state, payload) => {
      const updateChildren = (resources) => {
        resources.forEach((resource) => {
          if (resource.id === `${process.env.VUE_APP_BACKEND_API_URL}/resource/${payload.id}.json/`) {
            resource.children.push(...payload.children);
          } else if (resource.children && resource.children.length) {
            updateChildren(resource.children);
          }
        });
      };
      updateChildren(state.resources);
    },
    LOAD_ICS_PARAMS: (state, payload) => { state.icsParams = payload; },
  },
};
