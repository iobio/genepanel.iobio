import 'babel-polyfill'
import jQuery from 'jquery'
global.jQuery = jQuery
global.$ = jQuery
import d3 from 'd3'
import Vue from 'vue'
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import axios from 'axios';
import jQueryUi from 'jquery-ui'
import App from './App.vue'
import GeneticTestingRegistry from './components/pages/GeneticTestingRegistry.vue';
import Main from './components/pages/Main.vue'
import phenolyzer from './components/pages/Phenolyzer.vue'

import { Typeahead } from 'uiv';

import * as uiv from 'uiv';

import Clipboard from 'v-clipboard';
var FileSaver = require('file-saver');

Vue.use(uiv)

import Vuetify from 'vuetify'
require('../../node_modules/vuetify/dist/vuetify.min.css') // Ensure you are using css-loader
require('../app/components/assets/css/siteVuetify.css');

//Selectize
require('../app/components/assets/js/selectize.js')

//Use vuetify
// Vue.use(Vuetify)

//Use typeahead
Vue.use(Typeahead)


//Use router
Vue.use(VueRouter);

// Use vue-resource package
Vue.use(VueResource);

//Use Axios
// Vue.use(axios);


//Use copy to clipboard
//Link: https://github.com/euvl/v-clipboard
Vue.use(Clipboard)

// Back to top button
// Vue.use(BackToTop);

Vue.use(Vuetify, {
  theme: {
    primary: '#4267b2',
    secondary: '#b0bec5',
    accent: '#8c9eff',
    error: '#b71c1c',
  }
})


//Route
const routes = [
  {
    path: '/',
    component: Main,
  }
]

const router = new VueRouter({
  'mode':  'history',
  'base': '/',
  'routes': routes
})

//Registering component globally for nesting.
// Vue.component('iobio', Iobio);

export const bus = new Vue();


new Vue({
  el: '#app',
  render: h => h(App),
  router
})
