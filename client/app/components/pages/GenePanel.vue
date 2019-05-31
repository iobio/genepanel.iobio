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

  export default {
    props: {
      DiseasePanelData:{
        type: Array
      },
      selectedVendorsProps: {
        type: Array
      },
      selectedPanelsInCheckBox: {
        type: Array
      },
      selectedPanelsInCheckBoxPropsOne: {
        type: Array
      },
      selectedPanelFilters: {
        type: Array
      }
      // upperLimitProps: {
      //   type: Number
      // },
      // lowerLimitProps: {
      //   type: Number
      // }
    },
    data(){
      return {
        lowerLimit: 20,
        upperLimit: 45,
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
      },
      selectedPanelsInCheckBox: function(){
        this.updateTableOnSelectedPanels();
      },
      selectedPanelsInCheckBoxPropsOne: function(){
        this.justUpdateTabel();
      },

    },
    mounted(){
      // this.lowerLimit = this.lowerLimitProps;
      // this.upperLimit = this.upperLimitProps;
      this.AddGenePanelData();
      bus.$on("removeSearchTerm", ()=>{
        this.flagForVendorFilter = false; //Sets the flag to false because removing a terms clears the selection.
      });
      bus.$on("ChangeDefinition", (upper, lower)=>{
        this.upperLimit = upper;
        this.lowerLimit = lower;
        this.items.map(x=>{
          if(x.genecount<this.lowerLimit){
            x.filter = "specific";
          }
          else if(x.genecount>=this.lowerLimit && x.genecount<this.upperLimit){
            x.filter = "moderate";
          }
          else if(x.genecount>=this.upperLimit){
            x.filter = "general"
          }
        })
        this.selected = this.items.slice();
      })
    },
    updated(){
      //Emit the this.selected array back to the home.vue so it can be passed as props
      console.log('selectedPanels', this.selected.length)
      this.$emit('selectedPanels', this.selected);
      this.$emit('NoOfPanels', this.items);

      bus.$on('SelectNumberOfPanel', (data)=> {
        this.filterGenePanelsOnSelectedNumber(data);
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
      updateTableOnSelectedPanels: function(){
        this.selected = this.selectedPanelsInCheckBox;

        var nonSelectedItems = [];
        this.items.map(x=>{
          var checkIfExists = obj => obj.testname === x.testname;
          if(!this.selected.some(checkIfExists)){
            nonSelectedItems.push(x)
          }
        })
        var nonSelectedVendors = [];
        nonSelectedItems.map(x=>{
          nonSelectedVendors.push(x.offerer);
        })
        let vendors = model.getGenePanelVendors(this.selected);

        var vendorsToBeSentBack = [];
        vendors.map(x=>{
          if(!nonSelectedVendors.includes(x)){
            vendorsToBeSentBack.push(x);
          }
        })
        this.$emit('selectVendors', vendorsToBeSentBack.sort());
      },
      justUpdateTabel: function(){
        this.selected =this.selectedPanelsInCheckBoxPropsOne;
      },
      updatePanelsOnSelectedVendors: function(){
        var tempArr = [];
          this.selected = [];
          for(var i=0; i<this.selectedVendorsFromFilterPanel.length; i++){
            for(var j=0; j<this.items.length; j++){
              if( this.selectedVendorsFromFilterPanel[i] === this.items[j].offerer ){
                tempArr.push(this.items[j]);
              }
            }
          }
          this.selected = tempArr;
          tempArr = null;
      },
      filterPanelsOnSelectedConditions: function(data){
        var tempArrForConditions = [];
        this.items.map(x=>{
          if(x.genecount<=data){
            tempArrForConditions.push(x);
          }
        })
        this.selected = tempArrForConditions;
        tempArrForConditions = null;
      },
      filterPanelsOnBarSelect: function(start,end){
        var tempBarsSelected = [];
        this.items.map(x=>{
          if(x.conditioncount>=start && x.conditioncount<=end){
            tempBarsSelected.push(x);
          }
        })
        this.selected = tempBarsSelected;
        tempBarsSelected = null;
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
            tempArr = null;
            return items;
          }
          else {
            return items;
          }
      },
      AddGenePanelData: function(){
        //new code
        this.DiseasePanel = this.DiseasePanelData
        // var mergedGenePanels = model.mergeGenePanelsAcrossDiseases(this.DiseasePanel);
        // this.mergedGene = mergedGenePanels
        var mergedGenePanels = model.mergeGenePanelsAcrossDiseases(this.DiseasePanel);
        this.items = mergedGenePanels;
        // this.tempItems = mergedGenePanels;
        this.items.map(x=>{
          if(x.genecount<this.lowerLimit){
            x.filter = "specific";
          }
          else if(x.genecount>=this.lowerLimit && x.genecount<this.upperLimit){
            x.filter = "moderate";
          }
          else if(x.genecount>=this.upperLimit){
            x.filter = "general"
          }
        })

        var temp =[];
        this.selectedPanelFilters.map(x=>{
          this.items.map(y=>{
            if(x === y.filter){
              temp.push(y);
            }
          })
        })
        // console.log("temp", temp)
        let vendors = model.getGenePanelVendors(mergedGenePanels);
        var vendorsToBeSelected = this.getVendorsToBeSelected(temp, vendors);

        this.vendorList = vendors;
        this.selected = this.items.slice();
        this.$emit('setVendorList', this.vendorList.sort()); //Emit the vendor list
                            //back to the parent so it can be used as props in filterpanel
        this.$emit('selectVendors', vendorsToBeSelected);
        temp = null;
        vendorsToBeSelected = null;
        vendors = null;
      },
      getVendorsToBeSelected: function(temp, vendorsPara){
        var nonSelectedItems = [];
        this.items.map(x=>{
          var checkIfExists = obj => obj.testname === x.testname;
          if(!temp.some(checkIfExists)){
            nonSelectedItems.push(x)
          }
        })
        var nonSelectedVendors = [];
        nonSelectedItems.map(x=>{
          nonSelectedVendors.push(x.offerer);
        })
        let vendors = model.getGenePanelVendors(temp);

        var vendorsToBeSentBack = [];
        vendors.map(x=>{
          if(!nonSelectedVendors.includes(x)){
            vendorsToBeSentBack.push(x);
          }
        })
        return vendorsToBeSentBack.sort();
        // this.$emit('selectVendors', vendorsToBeSentBack.sort());
      },
      addGenes: function(d){
        d.genePanels.map(x=>{
           x._genes.map(y=>{
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

<!-- https://repl.it/@adityaekawade/HeartfeltScientificRooster  for filter multi select-->
