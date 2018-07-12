<template>
  <div>
    <div style="background-color:#f9fbff">
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
        <v-layout row wrap style="margin-top:-5px;">
          <v-flex d-flex xs12>
            <v-card>
              <v-card-text style="margin-bottom:-5px">
                <v-layout row wrap>
                  <v-flex xs12 sm12 md12 lg8>
                    <!-- {{ multipleSearchTerms }} -->
                    <div id="phenotype-input" style="display:inline-block;padding-top:5px;">
                      <label>Enter Phenotype</label>
                      <input
                        :disabled="checked"
                        id="phenotype-term"
                        class="form-control"
                        type="text"
                        autocomplete="off"
                        placeholder="Search phenotype (E.g. lactic acidosis)"
                        v-model="phenotypeTermEntered">

                      <typeahead
                        v-model="phenotypeTerm"
                        hide-details="false"
                        force-select match-start
                        :limit="typeaheadLimit"
                        :async-function="phenotypeLookup"
                        target="#phenotype-term"
                        item-key="value"/>
                    </div>

                    <v-btn
                        style="margin-top:-0.35px; text-transform: none"
                        class="btnColor"
                        v-on:click="getPhenotypeData">
                      Generate Gene List
                    </v-btn>

                    <div v-if="phenolyzerStatus!==null">
                      <br>
                      <center>
                        <v-progress-circular :width="2" indeterminate color="primary"></v-progress-circular>
                        The phenolyzer is <strong>{{ phenolyzerStatus }}</strong>
                      </center>
                    </div>
                    <div v-if="multipleSearchTerms.length">
                      <br>
                        Phenotypes Searched:
                      <v-chip disabled outline color="blue-grey darken-3" close v-for="(searchItem, i) in multipleSearchTerms" :key="i" @input="remove(searchItem)">
                        {{ i+1 }}. {{ searchItem }}
                      </v-chip>
                    </div>
                    <div v-if="noResultsArr.length">
                      <br>
                      Searches with no results:
                      <v-chip disabled v-for="(searchItem, i) in noResultsArr" :key="i">
                        {{ searchItem }}
                      </v-chip>
                    </div>
                    <p v-if="checked"><v-progress-linear  height="3" color="cyan darken-2" :indeterminate="true"></v-progress-linear></p>

                  </v-flex>
                  <v-flex xs12 sm12 md12 lg4 >
                    <div style="display:inline-block; padding-top:5px;">
                      <label>Genes</label>
                      <input
                        :disabled="multipleSearchTerms.length<1"
                        id="top-genes-input"
                        class="form-control"
                        type="text"
                        v-model="genesTop"
                        autocomplete="off"
                        list="genes"
                        placeholder="50">
                        <datalist id="genes">
                          <option v-for="genesCount in genesTopCounts">
                            {{ genesCount }}
                          </option>
                        </datalist>
                    </div>

                    <v-btn
                        :disabled="multipleSearchTerms.length<1"
                        style="margin-top:-0.35px"
                        class="btnColor"
                        v-on:click.prevent="selectNumberOfTopPhenolyzerGenes">
                      Go
                    </v-btn>

                  </v-flex>

                </v-layout>
              </v-card-text>
              <br>
            </v-card>
          </v-flex>

          <v-flex xs12 >
            <v-card >
              <div v-if="!phenotypeSearchedByUser">
                <v-card-title>
                    <h3>{{ IntroductionTextData.Title }}</h3>
                </v-card-title>
                <v-card-text v-html="IntroductionTextData.Content"></v-card-text>
              </div>
            </v-card>
          </v-flex>


          <v-flex d-flex xs12 >
            <v-layout row wrap>

              <!-- Start data table  -->
              <v-flex xs8>
                <v-card v-if="multipleSearchTerms.length">
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
                      <tr :active="props.selected">
                      <!-- <tr :active="props.selected" @click="props.selected = !props.selected"> -->
                        <td>
                          <v-checkbox
                            primary
                            hide-details
                            v-model="props.selected"
                            :input-value="props.selected"
                          ></v-checkbox>
                        </td>
                        <!-- <td></td> -->
                        <!-- <td>{{ props.item.rank }}</td> -->
                        <td >
                          <div id="app">
                            <div>
                              <v-menu open-on-hover top offset-y>
                                <span style="font-size:14px; font-weight:600; margin-top:2px" slot="activator">{{ props.item.geneName }}</span>
                                  <div >
                                    <v-card>
                                      <v-card-text style="margin-top:-25px">
                                        <center ><h3>{{ props.item.geneName }}</h3></center>
                                        <hr>
                                        <div style="width:600px"><strong>Resources: </strong></div>
                                        <ul style="margin-left:25px; margin-top:5px">
                                          <li><a v-bind:href="props.item.omimSrc" target="_blank">OMIM</a></li>
                                          <li><a v-bind:href="props.item.medGenSrc" target="_blank">MedGen</a></li>
                                          <li><a v-bind:href="props.item.geneCardsSrc" target="_blank">Gene Cards</a></li>
                                          <li><a v-bind:href="props.item.ghrSrc" target="_blank">Genetics Home Reference</a></li>
                                        </ul>
                                      </v-card-text>
                                    </v-card>
                                  </div>
                              </v-menu>
                            </div>
                          </div>
                          <!-- <span style="font-size:13px; margin-top:2px" >{{ props.item.geneName }}</span></td> -->
                          <td>
                            <span v-for="x in props.item.searchTermIndex">
                              <span v-html="x"></span>
                            </span>
                          </td>

                        <!-- <td >
                          <center>{{ props.item.sources }} of {{ multipleSearchTerms.length }}</center>

                          <span>
                            <v-progress-circular
                              :size="25"
                              :width="5"
                              :rotate="-90"
                              :value="props.item.sources / multipleSearchTerms.length * 100"
                              color="light-blue darken-1"
                            >
                            </v-progress-circular>
                          </span>


                        </td> -->
                        <td ><span v-html="props.item.htmlData"></span></td>
                        <!-- <td>{{ props.item.sources}}</td> -->
                        <td style="font-size:0px;">{{ props.item.score }}</td>
                        <td>
                          <v-menu bottom offset-y style="color:black">
                            <v-icon slot="activator" style="padding-right:4px">more_horiz</v-icon>

                            <v-list style="width:250px">
                              <v-list-tile >
                                <v-list-tile-title><strong> Links: </strong></v-list-tile-title>
                              </v-list-tile>
                              <hr>
                              <v-list-tile >
                                <v-list-tile-title><a v-bind:href="props.item.omimSrc" target="_blank">OMIM</a></v-list-tile-title>
                              </v-list-tile>
                              <v-list-tile >
                                <v-list-tile-title><a v-bind:href="props.item.medGenSrc" target="_blank">MedGen</a></v-list-tile-title>
                              </v-list-tile>
                              <v-list-tile >
                                <v-list-tile-title><a v-bind:href="props.item.geneCardsSrc" target="_blank">Gene Cards</a></v-list-tile-title>
                              </v-list-tile>
                              <v-list-tile >
                                <v-list-tile-title><a v-bind:href="props.item.ghrSrc" target="_blank">Genetics Home Reference</a></v-list-tile-title>
                              </v-list-tile>
                              <v-list-tile >
                                <v-list-tile-title><a v-bind:href="props.item.clinGenLink" target="_blank">ClinGen</a></v-list-tile-title>
                              </v-list-tile>
                            </v-list>
                          </v-menu>
                        </td>
                      </tr>
                    </template>
                    <template slot="footer">
                    <!-- <td colspan="100%">
                      <strong>{{ selected.length}} of {{ items.length }} results selected</strong>
                    </td> -->
                  </template>
                  </v-data-table>
                </v-card>
              </v-flex>
              <!-- End data table -->

              <!-- start sidebar -->
              <v-flex xs4 class="pr-2 pl-1">

                <div class="d-flex mb-2 xs12">
                  <v-card v-if="multipleSearchTerms.length">
                    <v-card-title primary-title>
                      <v-text-field
                        append-icon="search"
                        label="Search Genes"
                        single-line
                        hide-details
                        v-model="search"
                      ></v-text-field>
                    </v-card-title>
                    <br>
                  </v-card>
                </div>
                <br>

                <div class="d-flex mt-1 mb-2 xs12">
                  <v-card v-bind:class="[chartComponent===null ? 'activeCardBox' : '']" v-if="multipleSearchTerms.length">
                    <v-card-title primary-title>
                     <div>
                       <div style="font-size:16px">
                         GENES
                         <Dialogs
                           id="genesDialog"
                           class="dialogBox"
                           :HeadlineText="HelpDialogsData[0].HeadlineText"
                           :ContentText="HelpDialogsData[0].Content">
                         </Dialogs>
                       </div>
                       <span style="margin-top:0px; margin-bottom:0px; font-size:26px"><strong>{{ selected.length }}</strong></span>
                       <div>of {{ items.length }} selected</div>
                     </div>
                   </v-card-title>
                  </v-card>
                </div>

              </v-flex>

            </v-layout>
          </v-flex>

        </v-layout>
      </v-container>







      <v-container fluid grid-list-md style="min-height:500px">
        <v-layout row wrap style="margin-top: -20px;margin-left: -20px;margin-right: -20px;">
          <v-flex d-flex xs12 sm12 md12 lg12>
            <v-card-text>
              <v-layout row wrap>

                <v-flex v-if="false" d-flex xs12 sm12 md12 lg12>
                  <v-layout row wrap>
                    <v-flex d-flex xs12 sm12 md12 lg12>
                      <v-card>
                        <v-card-text style="padding:5px">
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

                <!-- <v-flex d-flex xs12 sm12 md12>
                  <v-card style="margin-top:4px" >
                    <v-card-title primary class="title" >
                      <span class="text-xs-center" v-if="multipleSearchTerms.length"><v-chip outline color="primary">{{ selectedGenesText }}</v-chip></span>
                      <span  v-if="multipleSearchTerms.length" style="margin-left:20px;display: ">
                        v-if="items.length>1"
                        <strong>
                          Select top &nbsp; <input v-on:focusout="selectNumberOfTopPhenolyzerGenes" type="number" style="width:18%; padding: 5px ;border: 1px solid #c6c6c6 ; font-size:16px" v-model="NumberOfTopPhenolyzerGenes"> &nbsp; genes
                          &nbsp;<a><v-icon v-on:click="selectNumberOfTopPhenolyzerGenes">navigate_next</v-icon></a>
                        </strong>
                        <span id="genes-top-input" class="emphasize" style="vertical-align:bottom;display:inline-block;max-width:150px;width:150px;margin-left:25px;padding-top:4px">
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


                      </span>
                    </v-card-title>

                    <v-card-text style="padding-top:0px;" v-if="multipleSearchTerms.length">

                    </v-card-text>

                  </v-card>
                </v-flex> -->
                <br>
                <br>
             </v-layout>
            </v-card-text>
          </v-flex>

        </v-layout>
      </v-container>
    </div>
  </div>
</template>


<script>
import { bus } from '../../routes';

import { Typeahead, Btn } from 'uiv';
import PhenolyzerPieChart from '../viz/PhenolyzerPieChart.vue';
import GeneModel from '../../models/GeneModel';
var geneModel = new GeneModel();
import IntroductionText from '../../../data/IntroductionText.json'
import Dialogs from '../partials/Dialogs.vue';
import HelpDialogs from '../../../data/HelpDialogs.json';

  export default {
    components: {
      'PhenolyzerPieChart': PhenolyzerPieChart,
      'Dialogs': Dialogs,
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
        hpoLookupUrl:  "http://nv-prod.iobio.io/hpo/hot/lookup/?term=",
        typeaheadLimit: parseInt(100),
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
            text: 'Gene',
            align: 'left',
            value: 'geneName'
          },
          { text: 'Search Terms', align: 'left', value: 'searchTermIndex' },

            // {
            //   text: 'Matched search terms',
            //   align: 'left',
            //   value: ['sources', 'omimSrc', 'ghrSrc', 'medGenSrc', 'geneCardsSrc']
            //  },
             {
               text: 'Phenolyzer score',
               align: 'left',
               value: 'score'
              },
            {
              text: '',
              align: 'left',
              value: 'htmlData'
            },
            {
              text: 'More',
              align: 'left',
              sortable: false,
              value: ['haploScore', 'value', 'omimSrc', 'clinGenLink', '', 'rank']
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
        pieChartdataArr: [],
        phenotypeSearchedByUser: false,
        chartComponent: null,
        genesTopCounts: [5, 10, 30, 50, 80, 100],
        dialog: false,
        IntroductionTextData: null,
        HelpDialogsData: null,
      }
    },
    created(){
      this.IntroductionTextData = IntroductionText.data[1];
    },
    mounted(){
      this.HelpDialogsData = HelpDialogs.data;
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
    watch: {
      genesTop: function() {
        this.selectNumberOfTopPhenolyzerGenes();
      },
      phenotypeTerm: function() {
        if (this.phenotypeTerm && this.phenotypeTerm.label) {
          this.getPhenotypeData();
        }
      }
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
      phenotypeLookup: function(term, done) {
        let self = this;

        $.ajax({
            url: self.hpoLookupUrl + encodeURIComponent(term),
            type: 'GET',
            error: function() {
                done([])
            },
            success: function(res) {
              if (!res.length) {
                done([]);
              }
              var sortedTerms = res.sort(function(a,b) {
                if (a.label < b.label) {
                  return -1;
                } else if (a.label > b.label) {
                  return 1;
                } else {
                  return 0;
                }
              });
              done(sortedTerms);
            }
        });
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
      getPhenotypeData(){
        let self = this;
        self.phenotypeSearchedByUser = true;
        if(self.phenotypeTerm.value.length>1 && !this.checked){
          self.checked = true;
          var searchTerm = self.phenotypeTerm.value;
          if(!self.multipleSearchTerms.includes(searchTerm)){
            self.$emit('search-phenotype', self.phenotypeTerm);
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
                } else {
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

                  let data = self.drawSvgBars(sortedPhenotypeData);
                  self.items = data;
                  self.noOfSourcesSvg();
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
          }
          else if(self.multipleSearchTerms.includes(searchTerm)){
            self.checked = false;
            self.snackbarText = "This phenotype term is already searched.";
            self.snackbar = true;
          }
          // self.multipleSearchTerms.push(self.phenotypeTerm.value);

        }
      },
      combineList(arr){
        var temp =[];
          for(var i=0; i<arr.length; i++){
            for(var j=0; j<arr[i].data.length; j++){
              temp.push({
                geneName: arr[i].data[j].geneName,
                geneIntoleranceScore: arr[i].data[j].geneIntoleranceScore,
                score: Number(arr[i].data[j].score),
                searchTerm: [arr[i].name],
                searchTermIndex: [this.multipleSearchTerms.indexOf(arr[i].name)+1]
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
        var uniqueGenes = Object.keys(obj);
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
                  sources: 1,
                  searchTerm: arr[j].searchTerm,
                  searchTermIndex: arr[j].searchTermIndex,
                }
              }
              else {
                obj[uniqueGenes[i]]= {
                  geneName: arr[j].geneName,
                  total: Number(obj[uniqueGenes[i]].total) + Number(arr[j].Score),
                  // score: (Number(Number(obj[uniqueGenes[i]].score + Number(arr[j].score)))),
                  score: (Number(Number(obj[uniqueGenes[i]].score + Number(arr[j].score)))/(Number(obj[uniqueGenes[i]].sources) + 1)),
                  sources: Number(obj[uniqueGenes[i]].sources) + 1,
                  searchTerm: [...obj[uniqueGenes[i]].searchTerm, ...arr[j].searchTerm],
                  searchTermIndex: [...obj[uniqueGenes[i]].searchTermIndex, ...arr[j].searchTermIndex]
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
          if (a.score===b.score){
             return (b.score-a.score);
          } else if(a.score<b.score){
             return 1;
          } else if(a.score>b.score){
             return -1;
          }
            // if (a.sources===b.sources){
            //    return (b.score-a.score);
            // } else if(a.sources<b.sources){
            //    return 1;
            // } else if(a.sources>b.sources){
            //    return -1;
            // }
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
      },
      // onSearchPhenolyzerGenes: function() {
      //   let self = this;
      //   self.multipleSearchTerms.push(self.phenotypeTerm.value);
      //   self.items = [];
      //   self.checked = true;
      //   self.alert = false;
      //   self.selectedGenesText = "";
      //   self.phenolyzerStatus = null;
      //   self.genesToApply = "";
      //   self.selected = [];
      //   self.NoOfGenesSelectedFromPhenolyzer = 0;
      //   this.$emit("SelectedPhenolyzerGenesToCopy", this.selected);
      //   var searchTerm = self.phenotypeTerm.value;
      //   self.phenotypeTermEntered = self.phenotypeTerm.value;
      //   geneModel.searchPhenolyzerGenes(searchTerm, this.phenolyzerTop,
      //   function(status, error) {
      //     if (status == 'done') {
      //       if (geneModel.phenolyzerGenes.length == 0) {
      //         self.phenolyzerStatus = "no genes found."
      //         self.genesToApply = "";
      //         self.checked = false;
      //         self.alert = true;
      //       } else {
      //         self.tempItems = geneModel.phenolyzerGenes;
      //         self.addSearchTermProperty();
      //         self.checked = false;
      //         if(self.multipleSearchTerms.length===1){
      //           self.multipleSearchArray = self.tempItems;
      //         }
      //         else if(self.multipleSearchTerms.length>1){
      //           self.multipleSearchArray = [...self.multipleSearchArray, ...self.tempItems]
      //         }
      //         let data = self.drawSvgBars(self.multipleSearchArray);
      //         self.items = data;
      //         self.selected = self.items.slice(0,50);
      //         self.phenolyzerStatus = null;
      //         self.selectedGenesText= ""+ self.selected.length + " of " + self.items.length + " genes selected";
      //         self.$emit("UpdatePhenolyzerSelectedGenesText", self.selectedGenesText);
      //         self.$emit("NoOfGenesSelectedFromPhenolyzer", self.selected.length);
      //         self.$emit("SelectedPhenolyzerGenesToCopy", self.selected);
      //       }
      //     } else {
      //       self.phenolyzerStatus = status;
      //     }
      //   });
      // },
      drawSvgBars: function(tempItems){
        var svgWidth = 350;
        //<stop offset="5%"  stop-color="#36D1DC"/>
        //<stop offset="95%" stop-color="#5B86E5"/>
        var firstBarWidth = tempItems[0].score * 320;
        tempItems.map(function(gene){
          gene.htmlData = `<svg width="${svgWidth}" height="25" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="MyGradient">
                                    <stop offset="5%"  stop-color="#7CA8CF"/>
                                    <stop offset="95%" stop-color="#576E97"/>
                                </linearGradient>
                            </defs>

                            <rect fill="#4e7ad3"
                                  x="10" y="1" rx="5" width="${gene.score * 320}" height="18"/>
                            <rect fill="#e8ebed" stroke="white" stroke-width="2"
                                  x="${(gene.score * 320)+12}" y="1" rx="5" width="${(firstBarWidth - (gene.score * 320))}" height="16"/>

                          </svg>`;
          gene.omimSrc = `https://www.ncbi.nlm.nih.gov/omim/?term=${gene.geneName}`;
          gene.medGenSrc = `https://www.ncbi.nlm.nih.gov/medgen/?term=${gene.geneName}`;
          gene.geneCardsSrc = `https://www.genecards.org/cgi-bin/carddisp.pl?gene=${gene.geneName}`;
          gene.ghrSrc = `https://ghr.nlm.nih.gov/gene/${gene.geneName}`;
        })
        // <text x="${gene.score * 400}" y="20" font-family="Verdana" font-size="14" fill="white">${gene.score}</text>

        //console.log(tempItems.slice(0,5));
        //self.items = tempItems;
        return tempItems
      },
      noOfSourcesSvg: function(){
        this.items.map(x=>{
          x.searchTermIndex = x.searchTermIndex.map(y=>{
            // console.log(y)
            return `<svg height="30" width="30">
                  <circle fill="#ffffff00" stroke-width="2" stroke="#ffa828" cx="12" cy="15" r="10"  />
                  <text x="12" y="15" text-anchor="middle" fill="#ffa828" font-weight="600" font-size="10px" font-family="Arial" dy=".3em">${y}</text>
                </svg> `
          })
        });
      },
      addSearchTermProperty: function(){
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
}


.headerWidth{
  width: 1%;
  color: red
}

#phenotype-term{
  width: 600px;
  height:40px;
  margin-top: 4px;
  background-color: #F4F4F4;
  border-color: #F4F4F4;
}

#top-genes-input{
  width: 200px;
  height:40px;
  margin-top: 4px;
  background-color: #F4F4F4;
  border-color: #F4F4F4;
}

/* Media Queries */

@media screen and (max-width:1600px){
  #top-genes-input{
    width: 120px;
    height:40px;
    margin-top: 4px;
  }
}

@media screen and (max-width: 1620px){
  #phenotype-term{
    width: 420px;
    height:40px;
    margin-top: 4px;
  }
}

@media screen and (max-width: 1050px){
  #phenotype-term{
    width: 450px;
    height:40px;
    margin-top: 4px;
  }
}

@media screen and (max-width: 950px){
  #phenotype-term{
    width: 290px;
    height:40px;
    margin-top: 4px;
  }
}

@media screen and (max-width: 700px){
  #phenotype-term{
    width: 300px;
    height:40px;
    margin-top: 4px;
    box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)
  }
  .btnColor{
    margin-top: 2px
  }
}

.genepanelsRect{
  fill: #4e7ad3;
  pointer-events: all;
  stroke: #4e7ad3;
  stroke-width: 2;
}
</style>

<style lang="sass" scoped>

  @import ../assets/sass/variables

  .btnColor
    color: white
    background-color: $search-button-color !important

</style>
