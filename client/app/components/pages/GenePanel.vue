<template>
  <div>
    Hello from Gene Panel!
    <btn type="primary" v-on:click.prevent="AddGenePanelData">Show Gene panel</btn>
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
    <div class="control-group">
			<label for="select-vendors">Vendors:</label>
			<select id="select-vendors" placeholder="Select Vendors..."></select>
		</div>
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
import { Typeahead, Btn } from 'uiv';

import jQuery from 'jquery';
global.jQuery = jQuery;
global.$ = jQuery;

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
        mergedGene : [],
        vendorList: []
      }
    },
    mounted(){
      console.log("GenePanel: I am mounted now!");
      // $('#select-vendors').selectize({
			// 		maxItems: null,
			// 		valueField: 'id',
			// 		labelField: 'title',
			// 		searchField: 'title',
			// 		options: [
			// 			{id: 1, title: 'Spectrometer', url: 'http://en.wikipedia.org/wiki/Spectrometers'},
			// 			{id: 2, title: 'Star Chart', url: 'http://en.wikipedia.org/wiki/Star_chart'},
			// 			{id: 3, title: 'Electrical Tape', url: 'http://en.wikipedia.org/wiki/Electrical_tape'}
			// 		],
			// 		create: false
			// 	});
      $('#select-vendors').selectize({
        create: true,
        valueField: 'value',
        labelField: 'value',
        searchField: ['value'],
        maxItems: null,
        allowEmptyOption: true
        });
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
      // },
      AddGenePanelData: function(){
        this.DiseasePanel = this.DiseasePanelData
        console.log(this.DiseasePanel)
        var mergedGenePanels = model.mergeGenePanelsAcrossDiseases(this.DiseasePanel);
        console.log("mergedGenePanels", mergedGenePanels)
        this.mergedGene = mergedGenePanels
        console.log("this.mergedGenes", this.mergedGene);

        let vendors = model.getGenePanelVendors(mergedGenePanels);
        console.log("vendor list", vendors);

        $('#select-vendors')[0].selectize.clearOptions();
        vendors.forEach(function(vendor) {
          $('#select-vendors')[0].selectize.addOption({value: vendor});
        })

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
