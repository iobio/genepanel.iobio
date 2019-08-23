<template>
  <div>
    <div style="background-color:#f9fbff">
      <v-container fluid grid-list-md>
        <v-layout row wrap style="margin-top:-20px;">
          <v-flex d-flex xs12>
            <v-card>
              Hey world!
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </div>
</template>

<script>
import { bus } from '../../routes';
import { Typeahead, Btn } from 'uiv';
import d3 from 'd3';
import Model from '../../models/Model';

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

</style>
