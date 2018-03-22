<!-- https://repl.it/@adityaekawade/HeartfeltScientificRooster  for filter multi select-->

<template>
  <div>
    <!-- Hello from Gene Panel! -->
    <!-- <btn type="primary" v-on:click.prevent="AddGenePanelData">Show Gene panel</btn> -->
    <!-- <br><br> -->
    <!-- <div class="control-group">
			<label for="select-vendors">Vendors:</label>
			<select id="select-vendors" placeholder="Select Vendors..."></select>
		</div> -->
<!--
    <br>
    <br>


    <h2> Panels </h2> -->

    <!-- <v-app id="inspire"> -->
      <!-- placeholder for the multi select -->
      <!-- <v-card color="secondary" flat>
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
      </v-card> -->
      <!-- <br> -->
      <!-- {{ selected }} -->
      <v-data-table
          v-model="selected"
          v-bind:headers="headers"
          v-bind:items="items"
          :search="search"
          select-all
          v-bind:pagination.sync="pagination"
          item-key="testname"
          class="elevation-1"
          no-data-text="No Panels Available Currently"
          :custom-filter="customFilter"
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
              <td>{{ props.item.testname }}</td>
              <td>{{ props.item.genecount }}</td>
              <td>{{ props.item.offerer }}</td>

              <td>{{ props.item._conditionNames }}</td>
              <td>{{ props.item._diseaseCount }}</td>
            </tr>
          </template>
          <template slot="footer">
          <td colspan="100%">
            <strong>{{ selected.length}} of {{ items.length }} panels selected</strong>
          </td>
        </template>
        </v-data-table>
      <!-- </v-app> -->


    <!-- Gene- panel- table  -->


    <!-- <div> -->
      <!-- <show-gene-panel
        v-if="selected.length"
        v-bind:GeneData="selected">
      </show-gene-panel> -->
    <!-- </div> -->

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

// var tempArr = [];

// import ShowGenePanel from './ShowGenePanel.vue';

  export default {
    // components: {
    //   'show-gene-panel': ShowGenePanel
    // },
    // props: ['DiseasePanelData'],
    props: {
      DiseasePanelData:{
        type: Array
      },
      selectedVendorsProps: {
        type: Array
      }
    },
    data(){
      return {
        loading: false, //multiselect
        multiSelectItems: [],   //multiselect
        search: null,  //multiselect
        select: [],  //multiselect
        Genes: [],  //multiselect
        DiseasePanel: [],
        tempArr: [],
        demo: "this is demo",
        mergedGene : [],
        vendorList: [],
        pagination: {     //Data tables
          sortBy: 'testname'
        },
        selected: [],    //Data tables
        headers: [    //Data tables
          { text: 'Name', align:'left', value: 'testname' },
          {
            text: 'genecount',
            align: 'left',
            value: 'genecount'
          },
          { text: 'Vendor', align: 'left', value: 'offerer' },
          // { text: 'Name', value: 'testname' },
          { text: 'Conditions', value: '_conditionNames' },
          { text: 'Selected diseases', value: '_diseaseCount' },
        ],
        selectedVendorsFromFilterPanel: [],
        flagForVendorFilter: false,
        tempItems: [],
        items: []   //Data tables
      }
    },
    watch: {
      search (val) {
        val && this.querySelections(val);
      },
      DiseasePanelData: function(){
        console.log("DiseasePanelData from props - Genepanel")
        this.AddGenePanelData();
      },
      selectedVendorsProps: function(){
        console.log("selectedVendorsProps in genepanel ", this.selectedVendorsProps);
        this.selectedVendorsFromFilterPanel = this.selectedVendorsProps;
        this.flagForVendorFilter = true;
        this.updatePanelsOnSelectedVendors();
      }

    },
    mounted(){
      console.log("GenePanel: I am mounted now!");
      console.log("this.mergedGene from mounted() : ", this.mergedGene)
      this.AddGenePanelData();
    },
    updated(){
      console.log("Hello I am gene panel and I am updated!");


      //Emit the this.selected array back to the home.vue so it can be passed as props
      this.$emit('selectedPanels', this.selected);

      bus.$on('SelectNumberOfPanel', (data)=> {
        this.filterGenePanelsOnSelectedNumber(data);
        //this.selected = [];
      })

      bus.$on('selectNumberOfConditionsInPanel', (data)=>{
        this.filterPanelsOnSelectedConditions(data);
      })
    },

    methods:{
      updatePanelsOnSelectedVendors: function(){
        var tempArr = [];
        this.items = this.tempItems;
        console.log("items in updatePanelsOnSelectedVendors", this.items)
        if(this.selectedVendorsFromFilterPanel.length>0){
          this.selected = [];
          for(var i=0; i<this.selectedVendorsFromFilterPanel.length; i++){
            for(var j=0; j<this.items.length; j++){
              if( this.selectedVendorsFromFilterPanel[i] === this.items[j].offerer ){
                tempArr.push(this.items[j]);

              }
            }
          }
          console.log("tempArr in gene panel ", tempArr)
          this.items = tempArr;
          this.selected = this.items.slice()
          return this.items;
        }
        else {
          this.selected = this.tempItems.slice();
          this.items = this.tempItems
          return this.items
        }
      },
      filterPanelsOnSelectedConditions: function(data){
        var tempArrForConditions = [];
        this.items.map(x=>{
          if(x.genecount<=data){
            tempArrForConditions.push(x);
          }
        })
        console.log(tempArrForConditions)
        this.selected = tempArrForConditions;
      },
      filterGenePanelsOnSelectedNumber: function(data){
        console.log("filterGenePanelsOnSelectedNumber", this.items)
        this.items  = this.items.filter(item => {
          return item.genecount < data;
        })
        this.selected = this.items.slice();
      },
      customFilter: function(items, search, filter){
        var tempArr = [];

        if(this.select.length>0){
            console.log("true")
            for(var i=0; i<this.select.length; i++){
              for(var j=0; j<items.length; j++){
                if( this.select[i] === items[j].offerer ){
                  tempArr.push(items[j]);

                }
              }
            }

            items = tempArr;
            return items;
          }
          else {
            return items;
          }
      },
      AddGenePanelData: function(){

        if(!this.flagForVendorFilter){
          this.DiseasePanel = this.DiseasePanelData
          console.log(this.DiseasePanel)
          var mergedGenePanels = model.mergeGenePanelsAcrossDiseases(this.DiseasePanel);
          console.log("mergedGenePanels", mergedGenePanels)
          this.mergedGene = mergedGenePanels
          console.log("this.mergedGenes", this.mergedGene);

          this.items = mergedGenePanels;
          this.tempItems = mergedGenePanels
          console.log("this.items : ", this.items)

          let vendors = model.getGenePanelVendors(mergedGenePanels);

          this.vendorList = vendors;
          console.log("this.vendorList", this.vendorList);
          console.log("this.vendorList", this.vendorList.sort());

          this.$emit('setVendorList', this.vendorList.sort()); //Emit the vendor list
                              //back to the parent so it can be used as props in filterpanel

          this.selected = this.items.slice()
        }
        else if(this.flagForVendorFilter){
          this.DiseasePanel = this.DiseasePanelData
          console.log(this.DiseasePanel)
          var mergedGenePanels = model.mergeGenePanelsAcrossDiseases(this.DiseasePanel);
          console.log("mergedGenePanels", mergedGenePanels)
          this.mergedGene = mergedGenePanels
          console.log("this.mergedGenes", this.mergedGene);

          this.items = mergedGenePanels;
          this.tempItems = mergedGenePanels
          console.log("this.items : ", this.items);
          this.updatePanelsOnSelectedVendors();

          // var tempArrForVendorFilter = [];
          // var secondTempArr = [];
          // secondTempArr = this.items;
          // console.log("this items", this.items);
          // console.log("this selected vendors", this.selectedVendorsFromFilterPanel);
          // if(this.selectedVendorsFromFilterPanel.length>0){
          //   this.selected = [];
          //   for(var i=0; i<this.selectedVendorsFromFilterPanel.length; i++){
          //     for(var j=0; j<this.items.length; j++){
          //       if( this.selectedVendorsFromFilterPanel[i] === this.items[j].offerer ){
          //         tempArrForVendorFilter.push(this.items[j]);
          //       }
          //     }
          //   }
          //   this.items = tempArrForVendorFilter;
          //   this.selected = this.items.slice();
          // }
        }



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
