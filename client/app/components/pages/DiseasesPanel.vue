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
    // props: ['DiseasePanelData'],
    props: {
      DiseasePanelData: {
        type: Array
      },
      selectedDisordersProps: {
        type: Array
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
        }
      },
    methods:{
        alertIndex: function(i, title){
          alert(i);
          console.log( "i" , i , " and title is : ", title)
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
          this.items = this.DiseasePanelData;
          this.tempItems = this.DiseasePanelData;
          this.tempDisorders = this.DiseasePanelData;
          this.getDisorderNames();
          this.modeOfInheritanceData = model.filterItemsForModeOfInheritance(this.items);
          console.log(" modeOfInheritanceData from Disease Panel ", this.modeOfInheritanceData);
          this.$emit("PieChartSelectorData", this.modeOfInheritanceData); //Emit
                                            // the mode of Inheritance back to parent so it can be used as props in summary panel
          this.selected = this.items.slice()
        },
        getDisorderNames(){
          this.disorderNamesList = model.filterItemsForDisorderNames(this.items);
          this.$emit('setDisorderNamesList', this.disorderNamesList)
        },
        selectAllDisorders: function(){
          this.selected = this.items.slice()
        },
        deSelectAllDisorders: function(){
          this.selected = []
        },
        updateDisordersTableOnSelectedDisorders: function(){
          var tempArray =[];
          this.items = this.tempDisorders;
          if(this.selectedDisordersFromFilterPanel.length>0){
            this.selected=[];
            for(var i=0; i<this.selectedDisordersFromFilterPanel.length; i++){
              for(var j=0; j<this.items.length; j++){
                if(this.selectedDisordersFromFilterPanel[i] === this.items[j].Title){
                  tempArray.push(this.items[j])
                }
              }
            }
            this.items = tempArray;
            this.selected = this.items.slice();
            return this.items;
          }
          else {
            this.selected = this.tempDisorders.slice();
            this.items = this.tempDisorders;
            return this.items;
          }

        },
        sendModeOfInheritanceData(){
          alert(this.modeOfInheritanceData.length)
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
                console.log("splitter array ", this.items[i]._modeOfInheritance.split(", "))
                splitHelperArr = this.items[i]._modeOfInheritance.split(", ");
                if(!splitHelperArr.includes(modeOfInheritance)){
                  tempArr.push(this.items[i])
                }
              }
            }
            console.log("tempArr is ", tempArr)
            this.items = tempArr;
            this.selected = this.items.slice();
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
          }
        }


    },
    mounted(){
      // this.draw();
      console.log("DiseasePanel: I am mounted!");
      this.showDiseasesData()
      bus.$on("RequestModeOfInheritanceData", ()=>{
        this.sendModeOfInheritanceData();
      });
      bus.$on("updateModeOfInheritance", (modeOfInheritance, selection)=>{
        this.updateFromPieChart(modeOfInheritance, selection)
      })
    },
    updated(){
      console.log("DiseasePanel: I am updated!");
      console.log("this.selected from showDiseases updated", this.selected );

      //Emit the this.selected array back to the home.vue so it can be passed as props
      this.$emit('selectedDiseases', this.selected);

      bus.$on('deSelectAllDisordersBus', ()=>{
        this.deSelectAllDisorders();
      });

      bus.$on('SelectAllDisordersBus', ()=>{
        this.selectAllDisorders();
      })

    },
    watch: {
      DiseasePanelData: function(){
        this.showDiseasesData();
      },
      selectedDisordersProps: function(){
        this.selectedDisordersFromFilterPanel = this.selectedDisordersProps;
        this.updateDisordersTableOnSelectedDisorders();
      }
    }

  }
</script>

<style scoped>
</style>
