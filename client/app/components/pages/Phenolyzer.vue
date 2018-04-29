<template>
  <div>
    <div id="app">
      <v-app id="inspire">
        <v-snackbar
            :timeout="snackbarTimeout"
            :top="y === 'top'"
            :bottom="y === 'bottom'"
            :right="x === 'right'"
            :left="x === 'left'"
            :multi-line="mode === 'multi-line'"
            :vertical="mode === 'vertical'"
            v-model="snackbar"
          >
            {{ snackbarText }}
            <v-btn flat color="pink" @click.native="snackbar = false">Close</v-btn>
          </v-snackbar>
        <v-container fluid grid-list-md>
          <v-layout row wrap style="margin-top:-30px;">
            <v-flex d-flex xs12 sm12 md12 lg12>
                <v-card-text>
                  <v-layout row wrap>
                    <v-flex d-flex xs12 sm12 md12>
                      <v-card>
                        <v-card-text >
                          <v-card-title primary class="title">Description &nbsp;</v-card-title>
                          <div style="margin-left:30px; margin-right: 30px;">
                            Enter phenotype terms in the search box below to use the Phenolyzer tool to generate list of genes.
                          </div>
                          <br>
                          <span style="font-size: 20px; margin-left:12px; font-weight:500">Phenotype: &nbsp; &nbsp; </span>
                            <div id="phenotype-input" style="display:inline-block; padding-top:5px;">
                              <input
                                id="phenotype-term"
                                class="form-control"
                                type="text"
                                autocomplete="off"
                                v-on:keyup.prevent="submitOnEnter"
                                placeholder="Search phenotype (E.g. lactic acidosis)"
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
                                v-on:click="getPhenotypeData">
                              Go
                            </v-btn>
                          <div v-if="phenolyzerStatus!==null">
                            {{ phenolyzerStatus }}
                          </div>
                          <br><br>
                          <div v-if="multipleSearchTerms.length">
                            <v-chip close v-for="(searchItem, i) in multipleSearchTerms" :key="i" @input="remove(searchItem)">
                              {{ searchItem }}
                            </v-chip>
                          </div>
                          <div v-if="noResultsArr.length">
                            <br>
                            Searches with no results:
                            <v-chip disabled v-for="(searchItem, i) in noResultsArr" :key="i">
                              {{ searchItem }}
                            </v-chip>
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

                      <v-flex d-flex xs12 sm12 md12 lg12>
                          <v-layout row wrap>
                            <v-flex d-flex xs12 sm12 md12 lg12>
                              <v-card>
                                <v-card-text>
                                  <v-layout row wrap>
                                    <v-flex d-flex xs12 sm12 md4 lg4>
                                        <center>
                                          <!-- put the pie chart component here  -->
                                          <PhenolyzerPieChart
                                            v-if="pieChartdataArr.length"
                                            v-bind:PhenolyzerPieChartData="pieChartdataArr">
                                          </PhenolyzerPieChart>
                                        </center>
                                    </v-flex>

                                    <v-flex d-flex xs12 sm12 md4 lg4>
                                    </v-flex>

                                    <v-flex d-flex xs12 sm12 md4 lg4>
                                    </v-flex>

                                 </v-layout>
                                </v-card-text>
                              </v-card>
                            </v-flex>
                          </v-layout>
                      </v-flex>

                    <v-flex d-flex xs12 sm12 md12>
                      <v-card style="margin-top:4px" >
                        <v-card-title primary class="title" >

                          Results &nbsp;
                          <span class="text-xs-center" v-if="multipleSearchTerms.length"><v-chip outline color="primary">{{ selectedGenesText }}</v-chip></span>
                        </v-card-title>
                        <div v-if="multipleSearchTerms.length">
                        <v-card-title >
                          <!-- v-if="items.length>1" -->
                          <!-- <strong>
                            Select top &nbsp; <input v-on:focusout="selectNumberOfTopPhenolyzerGenes" type="number" style="width:18%; padding: 5px ;border: 1px solid #c6c6c6 ; font-size:16px" v-model="NumberOfTopPhenolyzerGenes"> &nbsp; genes
                            &nbsp;<a><v-icon v-on:click="selectNumberOfTopPhenolyzerGenes">navigate_next</v-icon></a>
                          </strong> -->
                          <span id="genes-top-input" style="display:inline-block;max-width:130px;width:130px;margin-left:25px;padding-top:4px">
                            <v-select
                            v-model="genesTop"
                            label="Select Genes"
                            hide-details
                            hint="Genes"
                            combobox
                            :items="genesTopCounts"
                            >
                            </v-select>
                          </span>
                          <span style="padding-top:22px">
                            <v-btn v-on:click="selectNumberOfTopPhenolyzerGenes" flat icon color="indigo">
                              <v-icon>navigate_next</v-icon>
                            </v-btn>
                          </span>
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
                                <td style="padding-top: 10px;">{{ props.item.rank}}</span></td>
                                <td style="padding-top: 10px;"><p style="font-size:13px; margin-top:2px" ><strong>{{ props.item.geneName }}</strong></p></td>
                                <td style="padding-top: 10px;">
                                  <span>
                                    <v-progress-circular
                                      :size="25"
                                      :width="5"
                                      :rotate="-90"
                                      :value="props.item.sources /multipleSearchTerms.length * 100"
                                      color="light-blue darken-1"
                                    >
                                    </v-progress-circular>
                                  </span>
                                </td>
                                <td style="padding-top: 10px;"><span v-html="props.item.htmlData"></span></td>
                                <!-- <td>{{ props.item.sources}}</td> -->


                                <td style="font-size:0px;">{{ props.item.score }}</td>
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
import PhenolyzerPieChart from '../viz/PhenolyzerPieChart.vue';
import GeneModel from '../../models/GeneModel';
var geneModel = new GeneModel();

  export default {
    components: {
      'NavigationBar': NavigationBar,
      'PhenolyzerPieChart': PhenolyzerPieChart,
      Typeahead
    },
    data(){
      return {
        showGenesMenu: null,
        enterCount: 0,
        genesToApply: null,
        genesTopCounts: [5, 10, 30, 50, 80, 100],
        genesTop: 50,
        phenolyzerTopCounts: [30, 50, 80, 100],
        phenolyzerTop: 50,
        phenotypeTerm: "",
        phenotypeTermEntered: "",
        allPhenotypeTerms: [],
        phenolyzerStatus: null,
        geneList: [],
        //DataTable
        pagination: {
          sortBy: 'rank',
          // descending: true,
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
              text: 'sources',
              align: 'left',
              value: 'sources'
             },
             {
               text: 'Score',
               align: 'left',
               value: 'score'
              },
            {
              text: '',
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
        snackbar: false,
        snackbarText: "",
        multipleSearchTerms: [],
        multipleSearchArray: [],
        y: 'top',
        x: null,
        mode: '',
        snackbarTimeout: 4000,
        dictionaryArr: [],
        noResultsArr: [],
        pieChartdataArr: []
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

      bus.$on('deSelectAllPhenolyzerGenesBus', (data)=>{
        this.DeSelectAllPhenolyzerGenes(data);
      })

      bus.$on('SelectAllPhenolyzerGenesBus', (data)=>{
        this.SelectAllPhenolyzerGenes(data);
      })

      this.$emit("UpdatePhenolyzerSelectedGenesText", this.selectedGenesText);
      this.$emit("NoOfGenesSelectedFromPhenolyzer", this.selected.length);
      this.$emit("SelectedPhenolyzerGenesToCopy", this.selected);
      this.selectedGenesText= ""+ this.selected.length + " of " + this.items.length + " genes selected";
    },
    methods: {
      SelectAllPhenolyzerGenes(data){
        this.selected = this.items.slice();
      },
      DeSelectAllPhenolyzerGenes(data){
        this.selected = [];
      },
      filterGenesOnSelectedNumber(data){
        this.selected = this.items.slice(0,data)
      },
      remove (item) {
        this.items = [];
        this.selected = [];
        this.multipleSearchTerms.splice(this.multipleSearchTerms.indexOf(item), 1)
        this.multipleSearchTerms = [...this.multipleSearchTerms];
        this.dictionaryArr = this.dictionaryArr.filter(term=>term.name!==item);

        var combinedList = this.combineList(this.dictionaryArr);
        var createdObj = this.createObj(combinedList);
        var averagedData = this.performMeanOperation(combinedList, createdObj);
        var sortedPhenotypeData = this.sortTheOrder(averagedData);

        let data = this.drawSvgBars(sortedPhenotypeData);
        this.items = data;
        console.log("items ", this.items)
        this.selected = this.items.slice(0,50);
        this.phenolyzerStatus = null;
        this.selectedGenesText= ""+ this.selected.length + " of " + this.items.length + " genes selected";
        this.$emit("UpdatePhenolyzerSelectedGenesText", this.selectedGenesText);
        this.$emit("NoOfGenesSelectedFromPhenolyzer", this.selected.length);
        this.$emit("SelectedPhenolyzerGenesToCopy", this.selected);
      },
      selectNumberOfTopPhenolyzerGenes: function(){
        setTimeout(()=>{
          if(this.genesTop>0){
            bus.$emit('SelectNumberOfPhenolyzerGenes', this.genesTop);
            this.snackbarText = "Top " + this.genesTop + " genes selected";
            this.snackbar = true;
          }
        }, 1200);

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
      submitOnEnter: function(e){
        if (e.keyCode === 13) {
          this.enterCount++;
          if(this.enterCount===2){
            document.getElementById("phenotype-term").blur();
            this.getPhenotypeData();
            this.enterCount = 0;
          }
        }
      },
      getPhenotypeData(){
        let self = this;
        self.checked = true;
        // self.multipleSearchTerms.push(self.phenotypeTerm.value);
        var searchTerm = self.phenotypeTerm.value;
        self.phenotypeTermEntered = self.phenotypeTerm.value;
        self.selectedGenesText = "";
        self.phenolyzerStatus = null;
        self.genesToApply = "";
        self.NoOfGenesSelectedFromPhenolyzer = 0;
        this.$emit("SelectedPhenolyzerGenesToCopy", this.selected);
        self.phenotypeTermEntered = self.phenotypeTerm.value;
        geneModel.searchPhenolyzerGenes(searchTerm, this.phenolyzerTop,
        (status, error)=> {
          if (status == 'done') {
            if (geneModel.phenolyzerGenes.length == 0) {
              self.phenolyzerStatus = "no genes found."
              self.genesToApply = "";
              self.checked = false;
              self.alert = true;
              self.noResultsArr.push(searchTerm);
              console.log("noResultsArr", self.noResultsArr)
            } else {
              console.log("geneModel.phenolyzerGenes", geneModel.phenolyzerGenes);
              self.tempItems = geneModel.phenolyzerGenes;
              self.multipleSearchTerms.push(searchTerm)
              self.checked = false;
              self.alert = false;
              self.dictionaryArr.push(({
                name: searchTerm,
                data: self.tempItems
              }))
              var combinedList = self.combineList(self.dictionaryArr);
              var createdObj = self.createObj(combinedList);
              var averagedData = self.performMeanOperation(combinedList, createdObj);
              var sortedPhenotypeData = self.sortTheOrder(averagedData);
              self.pieChartdataArr = self.dataForPieChart(sortedPhenotypeData)
              console.log("pieChartdataArr", self.pieChartdataArr)

              let data = self.drawSvgBars(sortedPhenotypeData);
              self.items = data;
              console.log("items ", self.items)
              self.selected = self.items.slice(0,50);
              self.phenolyzerStatus = null;
              self.selectedGenesText= ""+ self.selected.length + " of " + self.items.length + " genes selected";
              self.$emit("UpdatePhenolyzerSelectedGenesText", self.selectedGenesText);
              self.$emit("NoOfGenesSelectedFromPhenolyzer", self.selected.length);
              self.$emit("SelectedPhenolyzerGenesToCopy", self.selected);

            }
          } else {
            self.phenolyzerStatus = status;
          }
        });
      },
      combineList(arr){
        var temp =[];
          for(var i=0; i<arr.length; i++){
            for(var j=0; j<arr[i].data.length; j++){
              temp.push({
                geneName: arr[i].data[j].geneName,
                geneIntoleranceScore: arr[i].data[j].geneIntoleranceScore,
                score: Number(arr[i].data[j].score),
                searchTerm: arr[i].name
              })
            }
          }
          return temp;
      },
      createObj(arr){
        let obj={};
        for(var i=0; i<arr.length; i++){
          if(obj[arr[i].geneName]===undefined){
            obj[arr[i].geneName] = 1;
          }
          else {
            obj[arr[i].geneName]++;
          }
        }
        console.log("obj" , obj);
        var uniqueGenes = Object.keys(obj);
        console.log("uniqueGenes", uniqueGenes);
        return uniqueGenes
      },
      performMeanOperation: function(arr, uniqueGenes){
        var obj ={};
        for(var i=0; i<uniqueGenes.length; i++){
          for(var j=0; j<arr.length; j++){
            if(uniqueGenes[i]===arr[j].geneName){
              if(obj[uniqueGenes[i]]===undefined){
                obj[uniqueGenes[i]]= {
                  geneName: arr[j].geneName,
                  score: Number(arr[j].score),
                  total: Number(arr[i].score),
                  sources: 1
                }
              }
              else {
                // console.log("obj[uniqueGenes[i]].sources + 1 is ", obj[uniqueGenes[i]].sources + 1)
                console.log("arr[j].score",typeof Number(arr[j].score));
                console.log("obj[uniqueGenes[i]].total",typeof obj[uniqueGenes[i]].total)
                obj[uniqueGenes[i]]= {
                  geneName: arr[j].geneName,
                  total: Number(obj[uniqueGenes[i]].total) + Number(arr[j].Score),
                  score: (Number(Number(obj[uniqueGenes[i]].score + Number(arr[j].score)))/(Number(obj[uniqueGenes[i]].sources) + 1)),
                  sources: Number(obj[uniqueGenes[i]].sources) + 1
                }
              }
            }
          }
        }

        var withAvgArr = Object.values(obj);
        return withAvgArr;
        // sortTheOrder(withAvgArr)
      },
      sortTheOrder(arr){
        arr.sort(function(a,b){
            if (a.sources===b.sources){
               return (b.score-a.score);
            } else if(a.sources<b.sources){
               return 1;
            } else if(a.sources>b.sources){
               return -1;
            }
         })
         for(var i=0; i<arr.length; i++){
           arr[i].rank = i+1;
         }
         return arr;
      },
      dataForPieChart(arr){
        var obj = {};
        for(var i=0; i<arr.length; i++){
          if(obj[arr[i].sources]===undefined){
            obj[arr[i].sources] = 1;
          }
          else {
            obj[arr[i].sources]++;
          }
        }
        var dataArray = [];
        var textToAppend = "Genes present in ";
        for (var data in obj){
          dataArray.push({
            name: textToAppend + data + " sources",
            count: obj[data]
          })
        }
        return dataArray;
      },
      createDictionaryOfSearches(){
        this.multipleSearchTerms.push(this.phenotypeTerm.value);
        var dictionaryObj = [];
        for(var i=0; i<this.multipleSearchTerms.length; i++){
          dictionaryObj.push({
            name: this.multipleSearchTerms[i],
            data: this.getPhenotypeData(this.multipleSearchTerms[i])
          })
        }
        console.log(dictionaryObj)
      },
      onSearchPhenolyzerGenes: function() {
        let self = this;
        self.multipleSearchTerms.push(self.phenotypeTerm.value);
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
              self.addSearchTermProperty();
              self.checked = false;
              if(self.multipleSearchTerms.length===1){
                self.multipleSearchArray = self.tempItems;
              }
              else if(self.multipleSearchTerms.length>1){
                self.multipleSearchArray = [...self.multipleSearchArray, ...self.tempItems]
              }
              let data = self.drawSvgBars(self.multipleSearchArray);
              self.items = data;
              self.selected = self.items.slice(0,50);
              self.phenolyzerStatus = null;
              self.selectedGenesText= ""+ self.selected.length + " of " + self.items.length + " genes selected";
              self.$emit("UpdatePhenolyzerSelectedGenesText", self.selectedGenesText);
              self.$emit("NoOfGenesSelectedFromPhenolyzer", self.selected.length);
              self.$emit("SelectedPhenolyzerGenesToCopy", self.selected);
            }
          } else {
            self.phenolyzerStatus = status;
          }
        });
      },
      drawSvgBars: function(tempItems){
        var svgWidth = 800;
        tempItems.map(function(gene){
          gene.htmlData = `<svg width="${svgWidth}" height="25" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="MyGradient">
                                    <stop offset="5%"  stop-color="#36D1DC"/>
                                    <stop offset="95%" stop-color="#5B86E5"/>
                                </linearGradient>
                            </defs>

                            <rect fill="url(#MyGradient)"
                                  x="10" y="5" width="${gene.score * 800}" height="25"/>
                          </svg>`
        })
        // <text x="${gene.score * 400}" y="20" font-family="Verdana" font-size="14" fill="white">${gene.score}</text>

        //console.log(tempItems.slice(0,5));
        //self.items = tempItems;
        return tempItems
      },
      addSearchTermProperty: function(){
        console.log()
        this.tempItems.map(x=>{
          if(x["phenotypeSearchTerm"]===undefined){
            x["phenotypeSearchTerm"]=this.phenotypeTerm.value
          }
        });
      }
    }
  }
</script>



<style scoped>
.btnColor, .btn__content{
  color: white;
}
.btn{
  padding: 0px;
  height: 34px;
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
