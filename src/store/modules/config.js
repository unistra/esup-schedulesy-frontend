import axios from 'axios';

export default {
  namespaced: true,
  state: {
    resources: [],
    displayTypes: [],
    userCustomization: {},
    icsParams: {},
  },
  getters: {
    getResources: state => state.resources,
    getDisplayTypes: state => state.displayTypes,
    getUserDisplayType: state => state.userCustomization.display_configuration,
    getUserResources: state => state.userCustomization.resources,
    getICSParams: state => state.icsParams,
  },
  actions: {
    loadResources: ({ commit }) => {
      console.log('IN LOADRESOURCES');
      const resourceTypes = [
        'trainee',
        'instructor',
        'classroom',
        'category5',
      ];
      return new Promise((resolve, reject) => {
        resourceTypes.forEach((type) => {
          console.log('IN PROMISE');
          console.log(type);
          axios
            .get(`${process.env.VUE_APP_BACKEND_API_URL}/resource/${type}.json`)
            .then((response) => {
              console.log('FETCHING DATA');
              commit('LOAD_RESOURCE', response.data);
              resolve();
            }).catch(error => reject(error));
        });
      });
    },
  },
  mutations: {
    LOAD_RESOURCE: (state, payload) => state.resources.push(payload),
  },
};
