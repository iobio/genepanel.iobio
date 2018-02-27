import 'babel-polyfill';
import jQuery from 'jquery';
import 'd3';
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import axios from 'axios';
import { Typeahead } from 'uiv';

import * as uiv from 'uiv';
Vue.use(uiv)


import Clipboard from 'v-clipboard'


window.jQuery = jQuery;
window.$ = jQuery;

import Vuetify from 'vuetify';
require('../../node_modules/vuetify/dist/vuetify.min.css') ;


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


Vue.config.devtools = false;
Vue.config.productionTip = false;

beforeEach(() => {
  window.sandbox = sinon.sandbox.create();
});

afterEach(() => {
  window.sandbox.restore();
});
