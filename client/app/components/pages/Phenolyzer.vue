<template>
  <div>

    <!-- url: https://7z68tjgpw4.execute-api.us-east-1.amazonaws.com/dev/phenolyzer/?term=lacticacidosis@treacher_collins -->
    <!-- Navbar -->
    <div style="position: relative; overflow: hidden;">
      <v-toolbar
        absolute
        color="blue-grey darken-4"
        dark
        scroll-off-screen
        scroll-target="#scrolling-techniques"
      >
        <v-toolbar-title>geneLists.iobio</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <div
        style="max-height: 600px; color:red"
        class="scroll-y"
        id="scrolling-techniques"
      >
        <v-container style="height: 100px;"></v-container>
      </div>
    </div>

    <div id="phenotype-input" style="display:inline-block;">
      <!-- <v-text-field id="phenotype-term" hide-details v-model="phenotypeTermEntered"
      label="enter phenotype">
      </v-text-field> -->
      <input
        id="phenotype-term"
        class="form-control"
        type="text"
        style="width: 650px"
        placeholder="Search Term..."
        v-model="phenotypeTermEntered">
      <typeahead
       v-model="phenotypeTerm"
      hide-details="false"
      force-select match-start
      target="#phenotype-term"
      async-src="http://nv-blue.iobio.io/hpo/hot/lookup/?term=" item-key="value"/>
    </div>
    <btn v-on:click="onSearchPhenolyzerGenes">go</btn>

    <div v-if="phenotypeTermEntered.length>0">
      Search term: {{ phenotypeTermEntered }}
    </div>
    <div v-if="phenolyzerStatus!==null">
      {{ phenolyzerStatus }}
    </div>
    <br>
    <v-app>
      <v-data-table
          v-model="selected"
          v-bind:headers="headers"
          v-bind:items="items"
          select-all
          v-bind:pagination.sync="pagination"
          item-key="geneName"
          class="elevation-1"
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
            <td>{{ props.item.rank }}</td>
            <td>{{ props.item.geneName }}</td>
            <td>{{ props.item.score }}</td>
          </tr>
        </template>
        <template slot="footer">
        <td colspan="100%">
          <strong>{{ selected.length}} of {{ items.length }} results selected</strong>
        </td>
      </template>
      </v-data-table>
    </v-app>
    <strong>Genes </strong>
    <ul v-if="geneList.length>0">
      <li v-for="gene in geneList">
        {{gene.rank}} -- {{gene.geneName}} -- {{gene.score}}
      </li>
    </ul>

  </div>
</template>


<script>
import { Typeahead, Btn } from 'uiv';
import GeneModel from './GeneModel';
var geneModel = new GeneModel();

  export default {
    components: {
      Typeahead
    },
    data(){
      return {
        showGenesMenu: null,

        genesToApply: null,

        phenolyzerTopCounts: [30, 50, 80, 100],
        phenolyzerTop: 50,
        phenotypeTerm: "",
        phenotypeTermEntered: "",
        allPhenotypeTerms: [],
        phenolyzerStatus: null,
        geneList: [],
        //DataTable
        pagination: {
          sortBy: 'rank'
        },
        selected: [],
        headers: [
          {
            text: 'Rank',
            align: 'left',
            value: 'rank'
          },
          {
            text: 'Gene',
            align: 'left',
            value: 'geneName'
          },
           {
             text: 'Score',
             align: 'left',
             value: 'score'
            },
        ],
        items: []
      }
    },
    methods: {
      toggleAll () { //Data Table
        if (this.selected.length) this.selected = []
        else this.selected = this.items.slice()
      },
      changeSort (column) { //Data Table
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending
        } else {
          this.pagination.sortBy = column
          this.pagination.descending = false
        }
      },
      onSearchPhenolyzerGenes: function() {
        let self = this;
        self.phenolyzerStatus = null;
        self.genesToApply = "";
        var searchTerm = self.phenotypeTerm.value;
        self.phenotypeTermEntered = self.phenotypeTerm.value;
        geneModel.searchPhenolyzerGenes(searchTerm, this.phenolyzerTop,
        function(status, error) {
          if (status == 'done') {
            if (geneModel.phenolyzerGenes.length == 0) {
              self.phenolyzerStatus = "no genes found."
              self.genesToApply = "";
            } else {
              console.log("geneModel.phenolyzerGenes", geneModel.phenolyzerGenes)
              var geneCount = geneModel.phenolyzerGenes.filter(function(gene) {
                return gene.selected;
              }).length;
              self.genesToApply = geneModel.phenolyzerGenes
              .filter(function(gene) {
              //  console.log(gene)
                return gene.selected;
              })
              .map( function(gene) {
                return gene.geneName;
              })
              .join(", ");

              var x = geneModel.phenolyzerGenes
              .filter(function(gene) {
                return gene.selected;
              })
              .map( function(gene) {
                return gene;
              })

              self.items = geneModel.phenolyzerGenes
              .filter(function(gene) {
                return gene.selected;
              })
              .map( function(gene) {
                return gene;
              })

              //console.log(x);
              var tempArr = [];

              tempArr.push(x);
              self.geneList = tempArr[0]
              console.log("genelist", self.geneList)

              self.phenolyzerStatus = geneCount + " genes shown.";
              console.log(self.phenolyzerStatus)
            }
          } else {
            self.phenolyzerStatus = status;
          }
        });
      }
    }
  }
</script>



<style scoped>
  .toolbar__title{
    color: #66D4ED;
  }
</style>
