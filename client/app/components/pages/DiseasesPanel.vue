<template>
  <div>
    Hello from DiseasesPanel!
    <btn type="primary" v-on:click.prevent="showDiseasesData">Show Diseases</btn>

    <!-- <ul>
      <li v-for="(disease,index) in DiseasePanelData" v-on:click.prevent="alertIndex(index, disease.Title)">{{ index +1}}..{{ disease.Title }} -- {{ disease._geneCount}} -- {{ disease._modeOfInheritance }}</li>
    </ul> -->
    <br><br>

    <h2> Table data </h2>

    <v-app id="inspire">
      <!-- {{ selected }} -->
      <v-data-table
          v-model="selected"
          v-bind:headers="headers"
          v-bind:items="items"
          select-all
          v-bind:pagination.sync="pagination"
          item-key="name"
          class="elevation-1"
        >
        <template slot="headers" slot-scope="props">
          <tr>
            <th>
              <!-- <v-checkbox
                primary
                hide-details
                @click.native="toggleAll"
                :input-value="props.all"
                :indeterminate="props.indeterminate"
              ></v-checkbox> -->
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
            <!-- <td>
              <v-checkbox
                primary
                hide-details
                :input-value="props.selected"
              ></v-checkbox>
            </td> -->
            <td></td>
            <td>{{ props.item.Title }}</td>
            <td class="text-xs-right">{{ props.item._omim }}</td>
            <td class="text-xs-right">{{ props.item._modeOfInheritance }}</td>
            <td class="text-xs-right">{{ props.item._genePanelCount }}</td>
            <td class="text-xs-right">{{ props.item._geneCount }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-app>

  </div>
</template>


<script>
import { bus } from '../../routes';
import dt from 'datatables.net';
import jQuery from 'jquery'
global.jQuery = jQuery
global.$ = jQuery



  export default {
    props: ['DiseasePanelData'],
    data(){
        return {
          propsData : [],
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
            { text: 'OMIM', value: '_omim' },
            { text: 'Mode Of Inheritance', value: '_modeOfInheritance' },
            { text: 'Gene Panels', value: '_genePanelCount' },
            { text: 'Genes', value: '_geneCount' },
          ],
          items: []
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
          console.log("this.items  : ", this.items)
        },
        // getDiseaseData: function(){
        //   return this.propsData;
        // }
    },
    mounted(){
      console.log("DiseasePanel: I am mounted!")
    },
    updated(){
      console.log("DiseasePanel: I am updated!");
      // if(this.propsData.length<1){
      //   this.propsData = this.DiseasePanelData
      //   console.log("propsData from DiseasePanel: ", this.propsData)
      // }


    },

  }
</script>

<style>
</style>
