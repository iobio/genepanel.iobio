<template>
  <div>
    Hello from Gene Panel!
    <btn type="primary" v-on:click.prevent="AddGenePanelData">Show Gene panel</btn>
    <br><br>
    <!-- <div class="control-group">
			<label for="select-vendors">Vendors:</label>
			<select id="select-vendors" placeholder="Select Vendors..."></select>
		</div> -->

    <br>
    <br>

    <!-- Selecting vendor using multi select  -->
    <v-card color="secondary" flat>
      <v-card-text>
        <v-container fluid>
          <v-layout>
            <v-flex>
              <v-select
                label="Select Vendors"
                autocomplete
                :loading="loading"
                dark
                multiple
                cache-items
                chips
                required
                :items="multiSelectItems"
                :rules="[() => select.length > 0 || 'You must choose at least one']"
                :search-input.sync="search"
                v-model="select"
              ></v-select>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
    <br>


    <h2> Table Data </h2>
    <!-- <table id="gene-panel-table" class="display"></table> -->
    <!-- <h2> Raw Data </h2> -->

    <v-app id="inspire">
      <!-- {{ selected }} -->
      <v-data-table
          v-model="selected"
          v-bind:headers="headers"
          v-bind:items="items"
          select-all
          v-bind:pagination.sync="pagination"
          item-key="testname"
          class="elevation-1"
          no-data-text="No Panels Available Currently"
        >
        <template slot="headers" slot-scope="props">
          <tr>
            <th>
              <v-checkbox
                primary
                hide-details
                @click.native="toggleAll"
                :input-value="props.all"
                :indeterminate="props.indeterminate"
              ></v-checkbox>
            </th>
            <th v-for="header in props.headers" :key="header.text"
              :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
              @click="changeSort(header.value)"
            >
              <v-icon>arrow_upward</v-icon>
              {{ header.text }}
            </th>
          </tr>
        </template>
        <template slot="items" slot-scope="props">
          <tr :active="props.selected" @click="props.selected = !props.selected">
            <td>
              <v-checkbox
                primary
                hide-details
                :input-value="props.selected"
              ></v-checkbox>
            </td>
              <!-- <td></td> -->
              <td>{{ props.item.genecount }}</td>
              <td>{{ props.item.offerer }}</td>
              <td>{{ props.item.testname }}</td>
              <td>{{ props.item._conditionNames }}</td>
              <td>{{ props.item._diseaseCount }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-app>


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
        loading: false, //multiselect
        multiSelectItems: [],   //multiselect
        search: null,  //multiselect
        select: [],  //multiselect
        Genes: [],  //multiselect
        DiseasePanel: [],
        demo: "this is demo",
        mergedGene : [],
        vendorList: [],
        pagination: {     //Data tables
          sortBy: 'testname'
        },
        selected: [],    //Data tables
        headers: [    //Data tables
          {
            text: 'genecount',
            align: 'left',
            value: 'genecount'
          },
          { text: 'Vendor', align: 'left', value: 'offerer' },
          { text: 'Name', value: 'testname' },
          { text: 'Conditions', value: '_conditionNames' },
          { text: 'Selected diseases', value: '_diseaseCount' },
        ],
        items: []   //Data tables
      }
    },
    watch: {
      search (val) {
        val && this.querySelections(val)
      }
    },
    mounted(){
      console.log("GenePanel: I am mounted now!");
      console.log("this.mergedGene from mounted() : ", this.mergedGene)
    },
    updated(){

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
        // var x = [];
        // x.push(this.DiseasePanelData[0]);
        // this.DiseasePanel= x;

        this.DiseasePanel = this.DiseasePanelData
        console.log(this.DiseasePanel)
        var mergedGenePanels = model.mergeGenePanelsAcrossDiseases(this.DiseasePanel);
        console.log("mergedGenePanels", mergedGenePanels)
        this.mergedGene = mergedGenePanels
        console.log("this.mergedGenes", this.mergedGene);

        this.items = mergedGenePanels;
        console.log("this.items : ", this.items)

        let vendors = model.getGenePanelVendors(mergedGenePanels);
        console.log("vendor list", vendors);

        this.vendorList = vendors;
        console.log("this.vendorList", this.vendorList);

        // $('#select-vendors')[0].selectize.clearOptions();
        // vendors.forEach(function(vendor) {
        //   $('#select-vendors')[0].selectize.addOption({value: vendor});
        // })

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
      },
      querySelections (v) { //for multi select
        this.loading = true
        // Simulated ajax query
        setTimeout(() => {
          this.multiSelectItems = this.vendorList.filter(e => {
            return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1
          })
          this.loading = false
        }, 500)
      },
      toggleAll () { //for vuetify tables
        if (this.selected.length) this.selected = []
        else this.selected = this.items.slice()
      },
      changeSort (column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending
        } else {
          this.pagination.sortBy = column
          this.pagination.descending = false
        }
      },
    }
  }
</script>

<style scoped>
  #inspire {
    height: 600px;
  }
</style>
