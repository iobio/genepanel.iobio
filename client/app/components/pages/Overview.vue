<template>
  <div>
    <v-container fluid grid-list-md>
      <v-layout row wrap style="margin-top:-20px;">
        <v-flex d-flex xs12>
          <v-card>
            <v-jumbotron color="white" dark>
              <v-container fill-height>
                <v-layout align-center>
                  <v-flex text-xs-center>
                    <h3 class="display-3">Custom Color</h3>
                    <h1 class="display-2 font-weight-thin mb-3">Vuetify.js</h1>
                    <h4  class="subheading">Build your application today!</h4>
                    <div class="polaroid">
                      <img src="../assets/images/bg.png" alt="bg">
                    </div>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-jumbotron>
            <v-parallax
              dark
            >
              <v-layout
                align-center
                column
                justify-center
              >
                <h1 style="color:black" class="display-2 font-weight-thin mb-3">Vuetify.js</h1>
                <h4  style="color:black" class="subheading">Build your application today!</h4>
              </v-layout>
            </v-parallax>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>


<script>
import { bus } from '../../routes';
import { Typeahead, Btn } from 'uiv';
import d3 from 'd3';
import Model from '../../models/Model';
import img from '../assets/images/bg.png'

var model = new Model();

  export default {
    components: {
    },
    props: {
    },
    data(){
      return {
      }
    },
    mounted(){

    },
    updated(){

    },
    watch: {
    },
    methods:{

    }
  }


</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Open+Sans');

div.polaroid {
  width: 400px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  text-align: center;
}
</style>
