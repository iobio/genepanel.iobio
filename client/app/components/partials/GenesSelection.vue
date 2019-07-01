<template>
  <div>
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
