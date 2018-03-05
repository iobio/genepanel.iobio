<template>
  <div>
    <!-- Hello from DiseasesPanel! -->
    <!-- <btn type="primary" v-on:click.prevent="showDiseasesData">Show Diseases</btn> -->

    <!-- <ul>
      <li v-for="(disease,index) in DiseasePanelData" v-on:click.prevent="alertIndex(index, disease.Title)">{{ index +1}}..{{ disease.Title }} -- {{ disease._geneCount}} -- {{ disease._modeOfInheritance }}</li>
    </ul> -->
    <!-- <v-app id="inspire"> -->
      <!-- <v-card-title>
        Disease Table -->
        <!-- <btn v-on:click.prevent="selectAllDisorders">Select All</btn> -->
        <!-- <btn v-on:click.prevent="deSelectAllDisorders">De Select All</btn> -->
        <!-- <v-spacer></v-spacer>
        <v-text-field
          append-icon="search"
          label="Search"
          single-line
          hide-details
          v-model="search"
        ></v-text-field>
      </v-card-title> -->
      <!-- <ul>
        <li v-for="item in items "> {{item._modeOfInheritance}}
        </li>
      </ul> -->
      <svg id="pie-chart-box"></svg>
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
            <!-- <td></td> -->
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
    <!-- </v-app> -->

    <br>
    <br>

    <!-- {{ selected.Title }} -->


  </div>
</template>


<script>
import { bus } from '../../routes';
import dt from 'datatables.net';
import jQuery from 'jquery'
global.jQuery = jQuery
global.$ = jQuery;

import Model from './Model';
var model = new Model();


  export default {
    props: ['DiseasePanelData'],
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
          modeOfInheritanceData: [],
          piechart : {}
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
          console.log("propsData from showDiseasesData: ", this.propsData);
          this.items = this.DiseasePanelData;
          console.log("this.items  : ", this.items);
          this.modeOfInheritanceData = model.filterItemsForModeOfInheritance(this.items);
          console.log(" modeOfInheritanceData from Disease Panel ", this.modeOfInheritanceData)
          //if (this.selected.length) this.selected = []
           this.selected = this.items.slice()
          console.log("this.selected from showDiseases ", this.selected )
          //this.toggleAll();
        },
        selectAllDisorders: function(){
          this.selected = this.items.slice()
        },
        deSelectAllDisorders: function(){
          this.selected = []
        },

    },
    mounted(){
      //this.draw();
      console.log("DiseasePanel: I am mounted!");
      this.showDiseasesData()
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
      }
    }

  }
</script>

<style scoped>
 /* #inspire {
   height: 500px;
 } */
</style>
