import jwt_decode from 'jwt-decode';

export default {
  namespaced: true,
  state: {
    accessToken: localStorage.getItem('JWT__access__token') || '',
  },
  getters: {
    isLogged: state => state.accessToken.length > 0,
    getLogin: state => (state.accessToken ? jwt_decode(state.accessToken).user_id : ''),
    getDirectoryId: state => (state.accessToken ? jwt_decode(state.accessToken).directory_id : ''),
  },
  actions: {
  },
  mutations: {
  },
};
