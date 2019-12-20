import Vue from 'vue';
import Vuetify from '@/plugins/vuetify';
import { forgeResourcesRoot, childrenEntryGenerator } from '@/utils/store';

const resourceTypes = {
  trainee: 'Etudiants',
  instructor: 'Enseignants',
  classroom: 'Salles',
  category5: 'Matières',
};

const customType = (userCustomization) => {
  if (userCustomization.configuration && userCustomization.configuration.displayMode) {
    switch (userCustomization.configuration.displayMode) {
      case 'month':
        return 'month';
      case 'day':
        return 'day';
      case 'list':
      case 'custom':
        if (userCustomization.configuration
          && userCustomization.configuration.weekdays
          && userCustomization.configuration.weekdays.length) {
          return 'custom';
        }
        return 'week';
      default:
        return 'week';
    }
  }
  return 'week';
};

export default {
  namespaced: true,
  state: {
    resources: [],
    userCustomization: {},
    isUserCustomizationLoaded: false,
    icsParams: {},
  },
  getters: {
    getResources: state => Object.keys(resourceTypes).map(type => state.resources.find(resource => resource.category === type) || {}),
    getDisplayTypes: state => state.displayTypes,
    getUserCustomization: state => state.userCustomization,
    isUserCustomizationLoaded: state => state.isUserCustomizationLoaded,
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
          .then(
            (response) => {
              const rawResources = response.data;
              commit('LOAD_RESOURCE', forgeResourcesRoot(rawResources, resourceTypes));
              resolve();
            },
            error => reject(error),
          );
      });
    }),
    loadResourceChildren: ({ commit }, payload) => new Promise((resolve, reject) => {
      Vue.axios
        .get(`${payload.id}`)
        .then(
          (response) => {
            const rawNode = response.data;
            const node = {
              ...rawNode,
              ...{ children: rawNode.children.filter(child => child.has_children || child.selectable).map(child => childrenEntryGenerator(child)) },
            };
            commit('LOAD_CHILDREN', node);
            resolve();
          },
          error => reject(error),
        );
    }),
    loadUserCustomization: ({ dispatch, commit, rootGetters }) => new Promise((resolve, reject) => {
      Vue.axios
        .get(`${process.env.VUE_APP_BACKEND_LEGACY_URL}/customization/${rootGetters['auth/getLogin']}.json`)
        .then(
          (response) => {
            const userCustomization = response.data;
            commit('LOAD_USER_CUSTOMIZATION', userCustomization);
            if (userCustomization.configuration && userCustomization.configuration.displayMode) {
              switch (userCustomization.configuration.displayMode) {
                case 'month':
                  dispatch('ui/updateCalendarCustomType', 'month', { root: true });
                  break;
                case 'day':
                  dispatch('ui/updateCalendarCustomType', 'day', { root: true });
                  break;
                case 'list':
                case 'custom':
                  if (userCustomization.configuration
                    && userCustomization.configuration.weekdays
                    && userCustomization.configuration.weekdays.length) {
                    dispatch('ui/updateCalendarCustomType', 'custom', { root: true });
                  } else {
                    dispatch('ui/updateCalendarCustomType', 'custom', { root: true });
                  }
                  break;
                default:
                  dispatch('ui/updateCalendarCustomType', 'week', { root: true });
              }
            }
            if (userCustomization.configuration && 'darkMode' in userCustomization.configuration) {
              Vuetify.framework.theme.dark = userCustomization.configuration.darkMode;
            }
            dispatch('auth/loadUuid', null, { root: true });
            resolve(userCustomization);
          },
          (error) => {
            if (error.response.status === 404) {
              const user = {
                username: rootGetters['auth/getLogin'],
                directory_id: rootGetters['auth/getDirectoryId'],
              };
              Vue.axios
                .post(`${process.env.VUE_APP_BACKEND_LEGACY_URL}/customization.json`, user)
                .then(
                  (response) => {
                    const userCustomization = response.data;
                    commit('LOAD_USER_CUSTOMIZATION', userCustomization);
                    dispatch('ui/updateCalendarCustomType', 'week', { root: true });
                    dispatch('auth/loadUuid', null, { root: true });
                    resolve();
                  },
                  postError => reject(postError),
                );
            } else {
              reject(error);
            }
          },
        );
    }),
    patchUserCustomization: ({ dispatch, commit, rootGetters }, payload) => new Promise((resolve, reject) => {
      Vue.axios
        .patch(`${process.env.VUE_APP_BACKEND_LEGACY_URL}/customization/${rootGetters['auth/getLogin']}.json`, payload.changes)
        .then(
          (response) => {
            const userCustomization = response.data;
            dispatch('ui/updateSnackbar', payload.snackbar.success, { root: true });
            commit('LOAD_USER_CUSTOMIZATION', userCustomization);
            dispatch('ui/updateCalendarCustomType', customType(userCustomization), { root: true });
            resolve();
          },
          (error) => {
            dispatch('ui/updateSnackbar', payload.snackbar.error, { root: true });
            reject(error);
          },
        );
    }),
    loadIcsParams: ({ commit }) => new Promise((resolve, reject) => {
      Vue.axios
        .get(`${process.env.VUE_APP_BACKEND_API_URL}/ade_config.json`)
        .then(
          (response) => {
            const icsParams = response.data;
            commit('LOAD_ICS_PARAMS', icsParams);
            resolve();
          },
          error => reject(error),
        );
    }),
  },
  mutations: {
    LOAD_RESOURCE: (state, payload) => state.resources.push(payload),
    LOAD_USER_CUSTOMIZATION: (state, payload) => {
      state.userCustomization = payload;
      state.isUserCustomizationLoaded = true;
    },
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
