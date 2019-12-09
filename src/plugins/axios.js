import Vue from 'vue';
import Axios from 'axios';
import VueAxios from 'vue-axios';

const axios = Axios.create();

Vue.use(VueAxios, axios);

export default axios;
