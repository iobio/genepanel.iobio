<template>
  <div>
      <div id="pie-chart-box"></div>
      <v-data-table
          v-model="selected"
          v-bind:headers="headers"
          v-bind:items="items"
          select-all
          v-bind:pagination.sync="pagination"
          item-key="Title"
          class="elevation-1"
          v-bind:search="search"
          no-data-text="No Disorders Available Currently"
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
            <td>{{ props.item.Title }}</td>
            <td>{{ props.item._omim }}</td>
            <td>{{ props.item._modeOfInheritance }}</td>
            <td>{{ props.item._genePanelCount }}</td>
            <td>{{ props.item._geneCount }}</td>
          </tr>
        </template>
        <template slot="footer">
        <td colspan="100%">
          <strong>{{ selected.length}} of {{ items.length }} results selected</strong>
        </td>
      </template>
      </v-data-table>
    <br>
    <br>
  </div>
</template>


<script>
import { bus } from '../../routes';
import dt from 'datatables.net';
import jQuery from 'jquery'
global.jQuery = jQuery
global.$ = jQuery;

import Model from '../../models/Model';
var model = new Model();


  export default {
    props: {
      DiseasePanelData: {
        type: Array
      },
      selectedDisordersProps: {
        type: Array
      },
      selectedModesOfInheritance:{
        type:Array
      }
    },
    data(){
        return {
          propsData : [],
          tmp: '',
          search: '',
          pagination: {
            sortBy: 'Title'
          },
          selected: [],
          headers: [
            {
              text: 'Title',
              align: 'left',
              value: 'Title'
            },
            {
              text: 'OMIM',
              align: 'left',
              value: '_omim'
             },
            { text: 'Mode Of Inheritance', align: 'left', value: '_modeOfInheritance' },
            { text: 'Gene Panels', align: 'left', value: '_genePanelCount' },
            { text: 'Genes', align: 'left', value: '_geneCount' },
          ],
          items: [],
          tempItems: [],
          modeOfInheritanceData: [],
          disorderNamesList:[],
          piechart : {},
          selectedDisordersFromFilterPanel: [],
          tempDisorders: [],
          flagForDisorderFilter: false,
          pieChartFlag: false,
        }
      },
    methods:{
        alertIndex: function(i, title){
          alert(i);
        },
        toggleAll () {
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
        showDiseasesData: function(){

          //New code that updates the data properly.
          this.items = this.DiseasePanelData;
          console.log(this.items)
          this.items.forEach(x=>{
            if(x._modeOfInheritance===""){
              x._modeOfInheritance= "Not provided";
            }
          })
          this.tempItems = this.DiseasePanelData;
          this.tempDisorders = this.DiseasePanelData;
          // this.getDisorderNames();
          this.modeOfInheritanceData = model.filterItemsForModeOfInheritance(this.items);
          this.$emit("PieChartSelectorData", this.modeOfInheritanceData); //Emit
                                            // the mode of Inheritance back to parent so it can be used as props in summary panel
          this.selected = this.items.slice();
          this.$emit('setDisorderNamesList', this.items)
        },
        getDisorderNames(){
          var namesOfDisorders = model.filterItemsForDisorderNames(this.items);
          this.disorderNamesList = Array.from(new Set(namesOfDisorders))
          this.$emit('setDisorderNamesList', this.disorderNamesList)
        },
        selectAllDisorders: function(){
          this.selected = this.items.slice()
        },
        deSelectAllDisorders: function(){
          this.selected = []
        },
        updateTableOnSelectedModes: function(){
          console.log("selectedModesOfInheritance", this.selectedModesOfInheritance);
          var tempA = [];
          var a;
          var b=[];
          b = this.selectedModesOfInheritance
          console.log(b)
          var tempA = [];
          var a;
          var b;
          this.items.map(x=>{
            a = x._modeOfInheritance.split(", ");
            if(a.some(r=>b.includes(r))){
              tempA.push(x);
            }
          })
          this.selected = tempA;
          this.$emit('disordersSelectedData', this.selected)
        },
        updateDisordersTableOnSelectedDisorders: function(){
          var modeData = [];
            this.selected = this.selectedDisordersFromFilterPanel;
            modeData = model.filterItemsForModeOfInheritance(this.selected); //Update the select pie chart data when dropdown item selected.
            this.$emit("ModesSelectedData", modeData);
        },
        sendModeOfInheritanceData(){
          bus.$emit("PieChartSelectorData");
        },
        updateFromPieChart(modeOfInheritance, selection){
          if(modeOfInheritance === "Not provided"){
            modeOfInheritance="";
          }
          var tempArr = [];
          var splitHelperArr = [];
          if(!selection){
            for(var i=0; i<this.items.length; i++){

              if(modeOfInheritance!==this.items[i]._modeOfInheritance && this.items[i]._modeOfInheritance.split(", ").length===1){
                tempArr.push(this.items[i])
              }
              else if(this.items[i]._modeOfInheritance.split(", ").length >1){
                splitHelperArr = this.items[i]._modeOfInheritance.split(", ");
                if(!splitHelperArr.includes(modeOfInheritance)){
                  tempArr.push(this.items[i])
                }
              }
            }
            this.items = tempArr;
            this.selected = this.items.slice();
            this.getDisorderNames(); //Update the select disorders dropdown when pie chart wedge is selected.
          }
          else if(selection){
            tempArr = this.items;
            for(var i=0; i<this.tempItems.length; i++){
              if(modeOfInheritance===this.tempItems[i]._modeOfInheritance && this.tempItems[i]._modeOfInheritance.split(", ").length===1){
                tempArr.push(this.tempItems[i])
              }
              else if(this.tempItems[i]._modeOfInheritance.split(", ").length >1){
                splitHelperArr = this.tempItems[i]._modeOfInheritance.split(", ");
                if(splitHelperArr.includes(modeOfInheritance)){
                  tempArr.push(this.tempItems[i])
                }
              }
            }
            this.items = tempArr;
            this.selected = this.items.slice();
            this.getDisorderNames(); //Update the select disorders dropdown when pie chart wedge is selected.
          }
        }


    },
    mounted(){
      // this.draw();
      this.showDiseasesData()
      bus.$on("RequestModeOfInheritanceData", ()=>{
        this.sendModeOfInheritanceData();
      });
      bus.$on("updateModeOfInheritance", (modeOfInheritance, selection)=>{
        this.updateFromPieChart(modeOfInheritance, selection);
        this.pieChartFlag = true
      });
      bus.$on("removeSearchTerm", ()=>{
        this.flagForDisorderFilter = false; //Sets the flag to false because removing a terms clears the selection.
      });
      bus.$on("updatedFromDisorders", ()=>{
        this.pieChartFlag = false;
      });
      bus.$on("newSearch", ()=>{
        this.pieChartFlag = false;
      });
      bus.$on("resetDisordersBus", ()=>{
        this.pieChartFlag = false;
        this.flagForDisorderFilter = false;
        this.selected = this.tempDisorders.slice();
        this.items = this.tempDisorders;
        this.getDisorderNames();
        this.modeOfInheritanceData = model.filterItemsForModeOfInheritance(this.items);  //Update the select pie chart data when dropdown item selected.
        this.$emit("PieChartSelectorData", this.modeOfInheritanceData);
        return this.items;
      });
    },
    updated(){
      this.$emit('selectedDiseases', this.selected);

      bus.$on('deSelectAllDisordersBus', ()=>{
        this.deSelectAllDisorders();
      });

      bus.$on('SelectAllDisordersBus', ()=>{
        this.selectAllDisorders();
      });

    },
    watch: {
      DiseasePanelData: function(){
        this.showDiseasesData();
      },
      selectedDisordersProps: function(){
        this.selectedDisordersFromFilterPanel = this.selectedDisordersProps;
        if(this.selectedDisordersProps.length>0){
          this.flagForDisorderFilter = true;
        }
        else {
          this.flagForDisorderFilter = false;
        }
        this.updateDisordersTableOnSelectedDisorders();
        bus.$emit("disordersFilter");
      },
      selectedModesOfInheritance: function(){
        this.updateTableOnSelectedModes();
      }
    }

  }
</script>

<style scoped>
</style>
