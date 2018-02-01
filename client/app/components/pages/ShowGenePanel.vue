<template>
  <div>
    <hr>

    Hello from Show Gene Panel !
    <br>
    <button v-on:click.prevent="AddGeneData">Show Genes</button>
    <br><br>

    <ul>
      <li v-for="(gene, index) in GenesToDisplay"> {{ gene._rowNumber}}--
        {{ gene.name}} -- {{ gene._genePanelCount }} -- {{ gene._diseaseCount}}
        -- {{ gene._conditionNames }}
      </li>
    </ul>

  </div>
</template>


<script>
import { bus } from '../../routes';
import Model from './Model';
var model = new Model();

  export default {
    props: ['GeneData'],
    data(){
      return {
        GetGeneData : [],
        GenesToDisplay: []
      }
    },

    methods:{
      AddGeneData: function(){
        this.GetGeneData = this.GeneData;
        console.log("this.GetGeneData", this.GetGeneData);

        var mergedGenes = model.mergeGenesAcrossPanels(this.GetGeneData);
        console.log("mergedGenes", mergedGenes);

        this.GenesToDisplay = mergedGenes;
        console.log("GenesToDisplay",this.GenesToDisplay)

      }
    }
  }
</script>

<style>
</style>
