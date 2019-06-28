<template>
  <div>
    <v-layout row wrap>
      <v-flex xs11 style="margin-top:-30px">
        <v-text-field
          label="Search for gene"
          single-line
          hide-details
          v-model="search"
          style="min-height:20px !important"
        ></v-text-field>
      </v-flex>
    <v-flex xs1 style="margin-top:-5px; margin-left:-22px; ">
      <v-icon style="opacity:2; color:#222;">search</v-icon>
    </v-flex>
  </v-layout>
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
        search: '',
      }
    },
    mounted(){
      bus.$on("newAnalysis", ()=>{
        this.search = "";
      })
    },
    updated(){

    },
    watch: {
      search: function(){
        this.$emit("search", this.search)
      }
    },
    methods:{
    }
  }

</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Open+Sans');

</style>
