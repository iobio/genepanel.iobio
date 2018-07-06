<!-- https://repl.it/@adityaekawade/HeartfeltScientificRooster  for filter multi select-->

<template>
  <div>
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

  </div>
</template>


<script>
import { bus } from '../../routes';
import { Typeahead, Btn } from 'uiv';

import jQuery from 'jquery';
global.jQuery = jQuery;
global.$ = jQuery;

import Model from '../../models/Model';
var model = new Model();

// var tempArr = [];


  export default {
    // components: {
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
        this.AddGenePanelData();
      },
      selectedVendorsProps: function(){
        this.selectedVendorsFromFilterPanel = this.selectedVendorsProps;
        // console.log(" selectedVendorsProps from gene panel", this.selectedVendorsProps)
        // this.flagForVendorFilter = true;
        this.updatePanelsOnSelectedVendors();
        bus.$emit("vendorsFilter");
      }

    },
    mounted(){
      this.AddGenePanelData();
      bus.$on("removeSearchTerm", ()=>{
        this.flagForVendorFilter = false; //Sets the flag to false because removing a terms clears the selection.
      })
    },
    updated(){
      //Emit the this.selected array back to the home.vue so it can be passed as props
      this.$emit('selectedPanels', this.selected);
      this.$emit('NoOfPanels', this.items);

      bus.$on('SelectNumberOfPanel', (data)=> {
        this.filterGenePanelsOnSelectedNumber(data);
        //this.selected = [];
      })

      bus.$on('selectNumberOfConditionsInPanel', (data)=>{
        this.filterPanelsOnSelectedConditions(data);
      })

      bus.$on("conditionsOnBarSelect", (start, end)=>{
        this.filterPanelsOnBarSelect(start, end);
      })

      bus.$on("clearConditionFilters", ()=>{
        this.selected = this.items.slice()
      })
    },

    methods:{
      updatePanelsOnSelectedVendors: function(){
        var tempArr = [];
        this.items = this.tempItems;
        if(this.selectedVendorsFromFilterPanel.length>0){
          this.selected = [];
          for(var i=0; i<this.selectedVendorsFromFilterPanel.length; i++){
            for(var j=0; j<this.items.length; j++){
              if( this.selectedVendorsFromFilterPanel[i] === this.items[j].offerer ){
                tempArr.push(this.items[j]);

              }
            }
          }
          this.items = tempArr;
          this.selected = this.items.slice()
          // let vendors = model.getGenePanelVendors(mergedGenePanels);
          // this.vendorList = vendors;
          // this.$emit('setVendorList', this.vendorList.sort());
          return this.items;
        }
        else if(this.selectedVendorsFromFilterPanel.length===0){
          // alert("It is required that atleast one vendor is kept selected");
          this.selected = this.items;
          bus.$emit("lastVendor")
          // this.selected = this.items;
          // this.flagForVendorFilter = false;
          // this.selected = this.tempItems.slice();
          // // this.selected = [];
          // this.items = this.tempItems
          // // let vendors = model.getGenePanelVendors(mergedGenePanels);
          // // this.vendorList = vendors;
          // // this.$emit('setVendorList', this.vendorList.sort());
          // return this.items
        }
      },
      filterPanelsOnSelectedConditions: function(data){
        var tempArrForConditions = [];
        this.items.map(x=>{
          if(x.genecount<=data){
            tempArrForConditions.push(x);
          }
        })
        this.selected = tempArrForConditions;
      },
      filterPanelsOnBarSelect: function(start,end){
        var tempBarsSelected = [];
        this.items.map(x=>{
          if(x.conditioncount>=start && x.conditioncount<=end){
            tempBarsSelected.push(x);
          }
        })
        this.selected = tempBarsSelected;
      },
      filterGenePanelsOnSelectedNumber: function(data){
        this.items  = this.items.filter(item => {
          return item.genecount < data;
        })
        this.selected = this.items.slice();
      },
      customFilter: function(items, search, filter){
        var tempArr = [];

        if(this.select.length>0){
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
          var mergedGenePanels = model.mergeGenePanelsAcrossDiseases(this.DiseasePanel);
          this.mergedGene = mergedGenePanels
          this.items = mergedGenePanels;
          this.tempItems = mergedGenePanels;

          let vendors = model.getGenePanelVendors(mergedGenePanels);

          this.vendorList = vendors;
          this.$emit('setVendorList', this.vendorList.sort()); //Emit the vendor list
                              //back to the parent so it can be used as props in filterpanel

          this.selected = this.items.slice()
        }
        else if(this.flagForVendorFilter){
          this.DiseasePanel = this.DiseasePanelData
          var mergedGenePanels = model.mergeGenePanelsAcrossDiseases(this.DiseasePanel);
          this.mergedGene = mergedGenePanels

          this.items = mergedGenePanels;
          this.tempItems = mergedGenePanels;

          let vendors = model.getGenePanelVendors(mergedGenePanels);
          this.vendorList = vendors;
          this.updatePanelsOnSelectedVendors();

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
        this.DiseasePanel = this.DiseasePanelData
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
