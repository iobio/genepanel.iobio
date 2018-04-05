<template>
  <div>
    <div id="app">
      <v-app id="inspire">
        <v-container fluid grid-list-md>
          <v-layout row wrap>
            <v-flex d-flex xs12 sm12 md12 lg12>
                <v-card-text>
                  <v-layout row wrap>
                    <v-flex d-flex xs12 sm12 md12>
                      <v-card>
                        <v-card-text >
                          <center>
                            <div id="phenotype-input" style="display:inline-block; padding-top:5px;">
                              <input
                                id="phenotype-term"
                                class="form-control"
                                type="text"
                                autocomplete="off"
                                placeholder="Search phenotype (E.g. lacticacidosis)"
                                v-model="phenotypeTermEntered">

                              <typeahead
                               v-model="phenotypeTerm"
                              hide-details="false"
                              force-select match-start
                              target="#phenotype-term"
                              async-src="http://nv-blue.iobio.io/hpo/hot/lookup/?term=" item-key="value"/>
                            </div>

                            <v-btn
                                style="margin-top:-0.35px"
                                color="blue darken-1"
                                class="btnColor"
                                v-on:click="onSearchPhenolyzerGenes">
                              Go
                            </v-btn>
                          </center>
                          <div v-if="phenolyzerStatus!==null">
                            {{ phenolyzerStatus }}
                          </div>
                          <p v-if="checked"><v-progress-linear :indeterminate="true"></v-progress-linear></p>
                          <p>
                            <v-alert outline color="warning" icon="priority_high" dismissible v-model="alert">
                              Sorry, the following search term returns no data!
                            </v-alert>
                          </p>
                        </v-card-text>
                      </v-card>
                    </v-flex>


                    <v-flex d-flex xs12 sm12 md12>
                      <v-card style="margin-top:4px">
                        <v-card-title primary class="title">
                          Results &nbsp;
                          <span class="text-xs-center" v-if="selectedGenesText.length>1"><v-chip outline color="primary">{{ selectedGenesText }}</v-chip></span>
                        </v-card-title>
                        <div v-if="items.length">
                        <v-card-title>
                          <strong>
                            Select top &nbsp; <input v-on:focusout="selectNumberOfTopPhenolyzerGenes" type="number" style="width:18%; padding: 5px ;border: 1px solid #c6c6c6 ; font-size:16px" v-model="NumberOfTopPhenolyzerGenes"> &nbsp; genes
                            &nbsp;<a><v-icon v-on:click="selectNumberOfTopPhenolyzerGenes">navigate_next</v-icon></a>
                          </strong>
                          <v-spacer></v-spacer>
                          <v-text-field
                            append-icon="search"
                            label="Search"
                            single-line
                            hide-details
                            v-model="search"
                          ></v-text-field>
                        </v-card-title>
                        <v-card-text>
                          <v-data-table
                              v-model="selected"
                              v-bind:headers="headers"
                              v-bind:items="items"
                              select-all
                              v-bind:pagination.sync="pagination"
                              item-key="geneName"
                              class="elevation-1"
                              v-bind:search="search"
                              no-data-text="No pheotype genes Available Currently"
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
                                <!-- <td>{{ props.item.rank }}</td> -->
                                <td><p style="font-size:13px; margin-top:2px" ><strong>{{ props.item.geneName }}</strong></p></td>
                                <td><span v-html="props.item.htmlData"></span></td>
                                <td>{{ props.item.score }}</td>
                              </tr>
                            </template>
                            <template slot="footer">
                            <td colspan="100%">
                              <strong>{{ selected.length}} of {{ items.length }} results selected</strong>
                            </td>
                          </template>
                          </v-data-table>
                        </v-card-text>
                        </div>
                      </v-card>
                    </v-flex>
                    <br>
                    <br>
                 </v-layout>
                </v-card-text>
            </v-flex>

          </v-layout>
        </v-container>
      </v-app>
    </div>

    <!-- url: https://7z68tjgpw4.execute-api.us-east-1.amazonaws.com/dev/phenolyzer/?term=lacticacidosis@treacher_collins -->
    <!-- <NavigationBar></NavigationBar> -->

  </div>
</template>


<script>
import { bus } from '../../routes';

import { Typeahead, Btn } from 'uiv';
import NavigationBar from './NavigationBar.vue';

import GeneModel from './GeneModel';
var geneModel = new GeneModel();

  export default {
    components: {
      'NavigationBar': NavigationBar,
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
          sortBy: 'score',
          descending: true,
          rowsPerPage: 25
        },
        search: '',
        selected: [],
        headers: [
          // {
          //   text: 'Rank',
          //   align: 'left',
          //   value: 'rank'
          // },
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
            {
              text: 'Score Viz',
              align: 'left',
              value: 'htmlData'
            }
        ],
        tempItems: [],
        items: [],
        NumberOfTopPhenolyzerGenes: 50,
        selectedGenesText: "",
        checked: false,
        alert:false,
      }
    },
    updated(){
      bus.$on('SelectNumberOfPhenolyzerGenes', (data)=>{
        this.filterGenesOnSelectedNumber(data);
        this.selectedGenesText= ""+ this.selected.length + " of " + this.items.length + " genes selected";
        this.$emit("UpdatePhenolyzerSelectedGenesText", this.selectedGenesText);
        this.$emit("NoOfGenesSelectedFromPhenolyzer", this.selected.length);
        this.$emit("SelectedPhenolyzerGenesToCopy", this.selected);
      })

      this.$emit("UpdatePhenolyzerSelectedGenesText", this.selectedGenesText);
      this.$emit("NoOfGenesSelectedFromPhenolyzer", this.selected.length);
      this.$emit("SelectedPhenolyzerGenesToCopy", this.selected);
    },
    methods: {
      filterGenesOnSelectedNumber(data){
        this.selected = this.items.slice(0,data)
      },
      selectNumberOfTopPhenolyzerGenes: function(){
        if(this.NumberOfTopPhenolyzerGenes>0){
          bus.$emit('SelectNumberOfPhenolyzerGenes', this.NumberOfTopPhenolyzerGenes);
        }
      },
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
        self.items = [];
        self.checked = true;
        self.alert = false;
        self.selectedGenesText = "";
        self.phenolyzerStatus = null;
        self.genesToApply = "";
        self.selected = [];
        self.NoOfGenesSelectedFromPhenolyzer = 0;
        this.$emit("SelectedPhenolyzerGenesToCopy", this.selected);
        var searchTerm = self.phenotypeTerm.value;
        self.phenotypeTermEntered = self.phenotypeTerm.value;
        geneModel.searchPhenolyzerGenes(searchTerm, this.phenolyzerTop,
        function(status, error) {
          if (status == 'done') {
            if (geneModel.phenolyzerGenes.length == 0) {
              self.phenolyzerStatus = "no genes found."
              self.genesToApply = "";
              self.checked = false;
              self.alert = true;
            } else {
              console.log("geneModel.phenolyzerGenes", geneModel.phenolyzerGenes);
              self.tempItems = geneModel.phenolyzerGenes;
              self.checked = false;
              // self.items = geneModel.phenolyzerGenes;
              // self.selected = self.items.slice(0,50);
              let data = self.doSomething(self.tempItems);
              self.items = data;
              self.selected = self.items.slice(0,50);
              self.phenolyzerStatus = null;
              self.selectedGenesText= ""+ self.selected.length + " of " + self.items.length + " genes selected";
              self.$emit("UpdatePhenolyzerSelectedGenesText", self.selectedGenesText);
              self.$emit("NoOfGenesSelectedFromPhenolyzer", self.selected.length);
              self.$emit("SelectedPhenolyzerGenesToCopy", self.selected);
              // var geneCount = geneModel.phenolyzerGenes.filter(function(gene) {
              //   return gene.selected;
              // }).length;
              // self.genesToApply = geneModel.phenolyzerGenes
              // .filter(function(gene) {
              // //  console.log(gene)
              //   return gene.selected;
              // })
              // .map( function(gene) {
              //   return gene.geneName;
              // })
              // .join(", ");

              // var x = geneModel.phenolyzerGenes
              // .filter(function(gene) {
              //   return gene.selected;
              // })
              // .map( function(gene) {
              //   return gene;
              // })
              //
              // self.items = geneModel.phenolyzerGenes
              // .filter(function(gene) {
              //   return gene.selected;
              // })
              // .map( function(gene) {
              //   return gene;
              // })
              //
              // //console.log(x);
              // var tempArr = [];
              //
              // tempArr.push(x);
              // self.geneList = tempArr[0]
              // console.log("genelist", self.geneList)
              //
              // self.phenolyzerStatus = geneCount + " genes shown.";
              // console.log(self.phenolyzerStatus)
            }
          } else {
            self.phenolyzerStatus = status;
          }
        });
      },
      doSomething: function(tempItems){
        tempItems.map(function(gene){
          gene.htmlData = `<svg width="${gene.score * 800}" height="25" xmlns="http://www.w3.org/2000/svg">
  <defs>
      <linearGradient id="MyGradient">
          <stop offset="5%"  stop-color="#36D1DC"/>
          <stop offset="95%" stop-color="#5B86E5"/>
      </linearGradient>
  </defs>

  <rect fill="url(#MyGradient)"
        x="10" y="5" width="${gene.score * 800}" height="25"/>
  <text x="${gene.score * 400}" y="20" font-family="Verdana" font-size="14" fill="white">${gene.score}</text>
</svg>`
        })
        //console.log(tempItems.slice(0,5));
        //self.items = tempItems;
        return tempItems
      }
    }
  }
</script>



<style scoped>
.btnColor, .btn__content{
  color: white;
}
.btn{
  padding: 0px
}
.form-control{
  font-size: 15px;
  font-weight: 800
}

table.table tbody td, table.table tbody th{
  height: 7px;
}

.headerWidth{
  width: 1%;
  color: red
}

#phenotype-term{
  width: 850px;
  height:35px;
  margin-top: 4px;
}

/* Media Queries */

@media screen and (max-width: 1050px){
  #phenotype-term{
    width: 800px;
    height:35px;
    margin-top: 4px;
  }
}

@media screen and (max-width: 950px){
  #phenotype-term{
    width: 600px;
    height:35px;
    margin-top: 4px;
  }
}

@media screen and (max-width: 700px){
  #phenotype-term{
    width: 400px;
    height:35px;
    margin-top: 4px;
  }
}

</style>
