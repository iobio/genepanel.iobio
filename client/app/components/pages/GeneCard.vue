<template>
  <div id="gene-card" >
    <span id="gene-card-heading">Full Name:</span> {{ncbiSummary.nomenclaturename}}
    <br><br>
    <span id="gene-card-heading">NCBI Summary:</span>
    <br>
    <span>
      {{ncbiSummary.summary}}
    </span>
    <br><br>
    <span id="gene-card-heading">Chromosome:</span> {{ncbiSummary.chromosome}}
    <br>
    <span id="gene-card-heading">Cytogenetic Location: </span>{{ncbiSummary.maplocation}}
    <div id="ideo-container"></div>
    <span id="gene-card-heading">Molecular Location:</span> base pairs {{ncbiSummary.genomicinfo[0].chrstart}} to {{this.ncbiSummary.genomicinfo[0].chrstop}}
    <br><br>
    <span id="gene-card-heading">Aliases: </span>{{ncbiSummary.otheraliases}}
    <br><br>
    <span id="gene-card-heading">Gene id:</span> {{ncbiSummary.uid}}
    <br><br>
    <div v-if="drugs.length">
      <span id="gene-card-heading">Drugs: </span>
      <span v-for="drug in drugs">
        {{drug}} ,
      </span>
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
      gene: {
        type: String
      },
      ncbiSummary: {
        type: Object
      },
      drugs: {
        type: Array
      }
    },
    data(){
      return {
      }
    },
    mounted(){
      this.drawChromosome();
      console.log("this.drugs", this.drugs)
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
@import url('https://fonts.googleapis.com/css?family=Quicksand:500');

#ideo-container {
  height: 100px;
}

#gene-card{
  font-family: quicksand;
  font-size: 15px;
  text-align: justify;
}

#gene-card-heading{
  color: #36577a;
  font-weight: bold;
}
</style>
