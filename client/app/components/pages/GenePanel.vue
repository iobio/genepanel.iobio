<template>
  <div>
    Hello from Gene Panel!
    <button v-on:click.prevent="AddGenePanelData">Show Gene panel</button>
    <!-- <ul>
      <li v-for="(disease,index) in DiseasePanelData" v-on:click.prevent="addGenes(disease)">
        {{ disease.Title }}
      </li>
    </ul> -->
    <br><br>
    <!-- <button v-on:click.prevent="checkProps">check props</button> -->
    <!-- <div>
      <p v-for="d in DiseasePanel">{{d.Title }}</p>
    </div> -->
    <div>
      <p v-for="(g, index) in mergedGene">{{ index+1 }} --
         {{ g.testname }} -- {{ g._diseaseNames}} --
        {{ g._diseaseCount }} -- {{ g._conditionNames }} -- {{ g.offerer}}
     </p>
    </div>
    <div>
      <show-gene-panel
        v-bind:GeneData="mergedGene">
      </show-gene-panel>

    </div>
  </div>
</template>


<script>
import { bus } from '../../routes';
import Model from './Model';
var model = new Model();

import ShowGenePanel from './ShowGenePanel.vue';

  export default {
    components: {
      'show-gene-panel': ShowGenePanel
    },
    props: ['DiseasePanelData'],
    data(){
      return {
        Genes: [],
        DiseasePanel: [],
        demo: "this is demo",
        mergedGene : []
      }
    },
    mounted(){
      console.log("GenePanel: I am mounted now!")
    },
    updated(){
      console.log("GenePanel: I am updated now!")
    },
    // updated(){
    //     this.DiseasePanel = this.DiseasePanelData;
    //     console.log("this . diseaspanel", this.DiseasePanel);
    //     this.MergeGenes(this.DiseasePanel)
    //     // var mergedGenePanels = model.mergeGenePanelsAcrossDiseases(this.DiseasePanel);
    //     // console.log("mergedGenePanels", mergedGenePanels);
    //     // this.mergedGene = mergedGenePanels;
    //     // console.log("this merged Gens ", this.mergedGene)
    // },
    methods:{
      // MergeGenes(diseases){
      //   var mergedGenePanels = model.mergeGenePanelsAcrossDiseases(diseases);
      //   this.mergedGene = mergedGenePanels;
      //   console.log("this merged Gens ", this.mergedGene)
      //   console.log("this merged Gens ", this.mergedGene[0].offerer)
      //   console.log("this merged Gens ", this.mergedGene[0].genecount)
      //   console.log("this merged Gens ", this.mergedGene[0].testname)
      //   console.log("this merged Gens ", this.mergedGene[0]._conditionNames)
      //   console.log("this merged Gens ", this.mergedGene[0]._diseaseCount)
      // },
      AddGenePanelData: function(){
        this.DiseasePanel = this.DiseasePanelData
        console.log(this.DiseasePanel)
        var mergedGenePanels = model.mergeGenePanelsAcrossDiseases(this.DiseasePanel);
        console.log("mergedGenePanels", mergedGenePanels)
        this.mergedGene = mergedGenePanels
        console.log("this.mergedGenes", this.mergedGene)
      },
      addGenes: function(d){
        d.genePanels.map(x=>{
           x._genes.map(y=>{
             // console.log("y is" , y.name)
             this.Genes.push(y.name)
           })
        })
      },
      checkProps: function(){
        console.log("props", this.DiseasePanelData);
        this.DiseasePanel = this.DiseasePanelData
        console.log(this.DiseasePanel)
      }
    }
  }
</script>

<style>
</style>
