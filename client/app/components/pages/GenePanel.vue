<template>
  <div>
    Hello from Gene Panel!
    <btn type="primary" v-on:click.prevent="AddGenePanelData">Show Gene panel</btn>
    <br><br>
    <div class="control-group">
			<label for="select-vendors">Vendors:</label>
			<select id="select-vendors" placeholder="Select Vendors..."></select>
		</div>
    <h2> Table Data </h2>
    <table id="gene-panel-table" class="display"></table>
    <!-- <h2> Raw Data </h2> -->
    <div>
      <!-- <p v-for="(g, index) in mergedGene">{{ index+1 }} --
         {{ g.testname }} -- {{ g._diseaseNames}} --
        {{ g._diseaseCount }} -- {{ g._conditionNames }} -- {{ g.offerer}}
     </p> -->
    </div>

    <!-- Gene- panel- table  -->


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
      console.log("this.mergedGene from mounted() : ", this.mergedGene)


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
      console.log("GenePanel: I am updated now!");
      console.log("this.mergedGene from updated() : ", this.mergedGene)

      var data = [
        {
            "name":       "Tiger Nixon",
            "position":   "System Architect",
            "salary":     "$3,120",
            "start_date": "2011/04/25",
            "office":     "Edinburgh",
            "extn":       "5421"
        },
        {
            "name":       "Garrett Winters",
            "position":   "Director",
            "salary":     "$5,300",
            "start_date": "2011/07/25",
            "office":     "Edinburgh",
            "extn":       "8422"
        }
    ]

    console.log("data from updated()", data)

      var genePanelTable = $('#gene-panel-table').DataTable({
        data:this.mergedGene,
            columns: [
          { title: "No. ", data: '_rowNumber' },
          { title: "Genes", data: 'genecount' },
          { title: "Vendor", data: 'offerer' },
          { title: "Name", data: 'testname' },
          { title: "Conditions", data: '_conditionNames' },
          { title: "Selected diseases", data: '_diseaseCount' },
      ],
      "order": [[ 1, "desc" ], [ 2, "asc" ]],
      });

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
