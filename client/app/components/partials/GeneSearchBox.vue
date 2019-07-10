<template>
  <div>
    <v-layout row wrap>
      <v-flex xs11 :style="search.length===0 ? 'margin-top:-30px' : 'margin-top:-20px'">
        <v-text-field
          label="Gene name..."
          single-line
          hide-details
          v-model="search"
          style="min-height:20px !important"
        ></v-text-field>
      </v-flex>
    <v-flex xs1 style="margin-top:-5px; ">
      <div v-if="search.length>0">
        <v-btn flat icon style="margin-left:-12px"  v-on:click="clearSearch">
          <v-icon style="opacity:2; color:#222; cursor:pointer;">close</v-icon>
        </v-btn>
      </div>
      <div v-else-if="search.length===0" >
        <v-icon style="opacity:2; color:#222;; margin-left:-16px">search</v-icon>
      </div>
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
      bus.$on("clearSearchInput", ()=>{
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
      clearSearch: function(){
        this.search = "";
      }
    }
  }

</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Open+Sans');

</style>
