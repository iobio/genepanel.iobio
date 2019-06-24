<template>
  <div>
    {{ gene }}
    <br>
    NCBI Summary:
    <br>
    {{ncbiSummary.summary}}
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
      gene: {
        type: String
      },
      ncbiSummary: {
        type: Object
      }
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
