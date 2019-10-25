import jwt_decode from 'jwt-decode';

const getCookie = (name) => {
  const v = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);
  return v ? v[2] : null;
};
export default {
  namespaced: true,
  state: {
    accessToken: localStorage.getItem('JWT__access__token') || getCookie('jwt_refresh') || '',
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
