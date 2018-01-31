import jQuery from 'jquery'
global.jQuery = jQuery
global.$ = jQuery
import d3 from 'd3'
import Vue from 'vue'
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import axios from 'axios';

import App from './App.vue'
import Home from './components/pages/Home.vue';



Vue.use(VueRouter);

// Use vue-resource package
Vue.use(VueResource);

//Use Axios
Vue.use(axios);


//Route
const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/app',
    component: App
  }
]

const router = new VueRouter({
  routes,
})

//Registering component globally for nesting.
// Vue.component('iobio', Iobio);

export const bus = new Vue();


new Vue({
  el: '#app',
  render: h => h(App),
  router
})
