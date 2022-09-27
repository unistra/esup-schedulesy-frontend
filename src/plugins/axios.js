import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';

const authAxios = axios.create()
Vue.use(VueAxios, authAxios);

export default authAxios;
