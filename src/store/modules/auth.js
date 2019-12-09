import Vue from 'vue';
import jwt_decode from 'jwt-decode';

export default {
  namespaced: true,
  state: {
    accessToken: localStorage.getItem('JWT__access__token') || '',
    uuid: [],
    isUuidLoaded: false,
  },
  getters: {
    getLogin: state => (state.accessToken ? jwt_decode(state.accessToken).user_id : ''),
    getDirectoryId: state => (state.accessToken ? jwt_decode(state.accessToken).directory_id : ''),
    getOrganization: state => (state.accessToken ? jwt_decode(state.accessToken).organization : ''),
    getUuid: state => state.uuid[0].key,
  },
  actions: {
    loadUuid: ({ dispatch, commit, rootGetters }) => new Promise((resolve, reject) => {
      Vue.axios
        .get(`${process.env.VUE_APP_BACKEND_API_URL}/customization/${rootGetters['auth/getLogin']}/uuid.json`)
        .then(
          (response) => {
            commit('LOAD_UUID', response.data);
            resolve(response.data);
          },
          (error) => {
            const snackbarErrorMessage = {
              isVisible: true,
              color: 'error',
              message: 'Une erreur est survenue.',
              timeout: 6000,
            };
            dispatch('ui/updateSnackbar', snackbarErrorMessage, { root: true });
            reject(error);
          },
        );
    }),
  },
  mutations: {
    LOAD_UUID: (state, payload) => {
      state.uuid = payload;
      state.isUuidLoaded = true;
    },
  },
};
