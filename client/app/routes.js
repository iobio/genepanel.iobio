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
import Main from './components/pages/Main.vue'
import HomeTest from './components/pages/HomeTest.vue';
import phenolyzer from './components/pages/Phenolyzer.vue'

import { Typeahead } from 'uiv';

import * as uiv from 'uiv';

import Clipboard from 'v-clipboard'


Vue.use(uiv)

import Vuetify from 'vuetify'
// import 'vuetify/dist/vuetify.css'
// import '../assets/css/siteVuetify.css'
// import 'vuetify/dist/vuetify.css'
// index.js or main.js
require('../../node_modules/vuetify/dist/vuetify.min.css') // Ensure you are using css-loader
// require('/Users/adityaekawade/Desktop/genepanel/client/app/components/assets/css/siteVuetify.css');

//Selectize
require('../app/components/assets/js/selectize.js')

//Datatables
// require('/Users/adityaekawade/Desktop/genepanel/client/app/components/assets/js/dataTables.scrollResize.js')


//Use vuetify
Vue.use(Vuetify)



//Use typeahead
Vue.use(Typeahead)




//Use router
Vue.use(VueRouter);

// Use vue-resource package
Vue.use(VueResource);

//Use Axios
Vue.use(axios);


//Use copy to clipboard
//Link: https://github.com/euvl/v-clipboard
Vue.use(Clipboard)



//Route
const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/app',
    component: App
  },
  {
    path: '/phenolyzer',
    component: phenolyzer
  },
  {
    path: '/main',
    component: Main
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
