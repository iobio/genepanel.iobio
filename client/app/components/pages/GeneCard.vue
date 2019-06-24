<template>
  <div>
    {{ gene }}
    <br>
    NCBI Summary:
    <br>
    {{ncbiSummary.summary}}
    <div id="ideo-container"></div>
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
      this.drawChromosome();
    },
    updated(){

    },
    watch: {
      ncbiSummary: function(){
        this.drawChromosome();
      }
    },
    methods:{
      drawChromosome: function(){
        var config = {
          organism: 'human',
          container: '#ideo-container',
          chromosome: this.ncbiSummary.chromosome,
          chrHeight: 700,
          orientation: 'horizontal',
          annotations: [{
            name: this.gene,
            chr: this.ncbiSummary.chromosome,
            start: this.ncbiSummary.genomicinfo[0].chrstart,
            stop: this.ncbiSummary.genomicinfo[0].chrstop
          }]
        };
        var ideogram = new Ideogram(config);
        return ideogram;
      }
    }
  }

</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Open+Sans');
#ideo-container {
  height: 300px;
}
</style>
