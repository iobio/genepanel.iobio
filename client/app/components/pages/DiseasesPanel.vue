<template>
  <div>
    Hello from DiseasesPanel!
    <ul>
      <li v-for="(disease,index) in DiseasePanelData" v-on:click.prevent="alertIndex(index, disease.Title)">{{ index +1}}..{{ disease.Title }} -- {{ disease._geneCount}} -- {{ disease._modeOfInheritance }}</li>
    </ul>
    <br><br>
    <!-- <table id="disease-table" class="display"></table> -->
    <!-- <v-app id="inspire">
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
              "
            >
              <v-icon>arrow_upward</v-icon>
              {{ header.text }}
            </th>
          </tr>
        </template>
        </v-data-table>
    </v-app> -->
  </div>
</template>


<script>
import { bus } from '../../routes';
import dt from 'datatables.net';
import jQuery from 'jquery'
global.jQuery = jQuery
global.$ = jQuery
//
// var $  = require( 'jquery' );
// var dt = require( 'datatables.net' )( window, $ );
// $(document).ready( function () {
//   var diseaseTable = $('#disease-table').DataTable({
//     scrollY:        170,
//     scrollCollapse: true,
//     //scrollResize: true,
//     paging: false,
//     data: [],
//     columns: [
//       { title: "",     data: "_rowNumber"},
//       { title: "Name", data: "Title" },
//       { title: "OMIM", data:  "_omim" },
//       { title: "Mode of Inheritance", data: "_modeOfInheritance" },
//       { title: "Gene Panels", data:  "_genePanelCount"  },
//       { title: "Genes", data:  "_geneCount"  },
//     ]
//   });
//
// } );



  export default {
    props: ['DiseasePanelData'],
    data(){
      return {
        headers: [
          {
            text: 'Title',
            align: 'left',
            value: 'Title'
          },
          { text: '_geneCount', value: '_geneCount' },
          { text: '_modeOfInheritance', value: '_modeOfInheritance' }
        ],
      }
    },
    methods:{
        alertIndex: function(i, title){
          alert(i);
          console.log( "i" , i , " and title is : ", title)
        }
    },
    mounted(){
      console.log("DiseasePanel: I am mounted!")
    },
    updated(){
      console.log("DiseasePanel: I am updated!")
    }
  }
</script>

<style>
</style>
