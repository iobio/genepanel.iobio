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
        <v-layout row wrap style="margin-top:-20px;">
          <v-flex d-flex xs12>
            <v-card>
              <v-card-text style="margin-bottom:-5px">
                <h3>Phenolyzer</h3>
                <v-layout row wrap>
                  <v-flex xs12 sm12 md12 lg8>
                    <div id="phenotype-input" style="display:inline-block;padding-top:5px;">
                      <label>Enter Phenotype</label>
                      <input
                        :disabled="checked"
                        id="phenotype-term"
                        class="form-control"
                        type="text"
                        autocomplete="off"
                        v-on:focus="ClearInputForNewSearch"
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
                        style="margin-top:-0.35px; text-transform: none; color:white"
                        class="btnColor"
                        v-on:click="getPhenotypeData">
                      Generate Gene List
                    </v-btn>

                    <!-- <v-tooltip bottom>
                      <v-btn
                        v-if="multipleSearchTerms.length"
                        slot="activator"
                        :disabled="checked===true"
                        flat icon color="primary"
                        v-on:click="ClearInputForNewSearch"
                      >
                        <v-icon>add_circle</v-icon>
                      </v-btn>
                      <span>Enter New Phenotype</span>
                    </v-tooltip> -->


                    <div v-if="phenolyzerStatus!==null">
                      <center>
                        <!-- <v-progress-circular :width="2" indeterminate color="primary"></v-progress-circular> -->
                        Phenolyzer is <strong>{{ phenolyzerStatus }}</strong>
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
                    <p v-if="checked"><v-progress-linear  height="3" color="primary" :indeterminate="true"></v-progress-linear></p>
                    <p></p>
                  </v-flex>
                  <v-flex >
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
                        style="margin-top:-0.35px; text-transform: none; color:white"
                        class="btnColor"
                        v-on:click.prevent="selectNumberOfTopPhenolyzerGenes">
                      Select
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card-text>
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
                      id="genes-table"
                      v-model="selected"
                      v-bind:headers="headers"
                      v-bind:items="items"
                      select-all
                      v-bind:pagination.sync="pagination"
                      item-key="geneName"
                      class="elevation-1"
                      v-bind:search="search"
                      no-data-text="No pheotype genes Available Currently"
                      :custom-filter="filterItemsOnSearchPhenolyzer"
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
                        >
                          {{ header.text }}
                        </th>
                      </tr>
                    </template>
                    <template slot="items" slot-scope="props">
                      <tr :active="props.selected">
                        <td>
                          <v-checkbox
                            primary
                            hide-details
                            v-model="props.selected"
                            :input-value="props.selected"
                          ></v-checkbox>
                        </td>
                        <td>{{ props.item.indexVal }}</td>
                        <td >
                          <span style="font-size:14px; font-weight:600; margin-top:2px" slot="activator">{{ props.item.geneName }}</span>
                          <td v-if="multipleSearchTerms.length>1">
                            <span v-for="x in props.item.searchTermIndexSVG">
                              <span v-html="x"></span>
                            </span>
                          </td>
                        <td ><span v-html="props.item.htmlData"></span></td>
                        <td style="font-size:0px;">{{ props.item.score }}</td>
                        <td>
                          <v-menu bottom offset-y style="color:black">
                            <v-icon slot="activator" style="padding-right:4px">more_vert</v-icon>
                            <v-card>
                              <div class="conditionsBox">
                                <v-list>
                                  <div class="v-list__group__header">
                                    <v-list-tile>
                                      <v-list-tile-content>
                                        <v-list-tile-title><strong>  &nbsp;  Gene Resource Links &nbsp;<i>( {{ props.item.geneName }} )</i> </strong></v-list-tile-title>
                                      </v-list-tile-content>
                                    </v-list-tile>
                                  </div>
                                  <a v-bind:href="props.item.medGenSrc" target="_blank">
                                    <v-list-tile style="font-size:14px; height:36px" @click="">
                                      <v-list-tile-content style="margin-left:10px">
                                        <v-list-tile-title><v-icon>arrow_right</v-icon>MedGen</v-list-tile-title>
                                      </v-list-tile-content>
                                    </v-list-tile>
                                  </a>

                                  <a v-bind:href="props.item.omimSrc" target="_blank">
                                    <v-list-tile style="font-size:14px; height:36px" @click="">
                                      <v-list-tile-content style="margin-left:10px">
                                        <v-list-tile-title><v-icon>arrow_right</v-icon>OMIM</v-list-tile-title>
                                      </v-list-tile-content>
                                    </v-list-tile>
                                    </a>

                                  <a v-bind:href="props.item.geneCardsSrc" target="_blank">
                                    <v-list-tile style="font-size:14px; height:36px" @click="">
                                      <v-list-tile-content style="margin-left:10px">
                                        <v-list-tile-title><v-icon>arrow_right</v-icon>Gene Cards</v-list-tile-title>
                                      </v-list-tile-content>
                                    </v-list-tile>
                                    </a>

                                  <a v-bind:href="props.item.ghrSrc" target="_blank">
                                    <v-list-tile style="font-size:14px; height:36px" @click="">
                                      <v-list-tile-content style="margin-left:10px">
                                        <v-list-tile-title><v-icon>arrow_right</v-icon>Genetics Home Reference</v-list-tile-title>
                                      </v-list-tile-content>
                                    </v-list-tile>
                                    </a>

                                  <a v-bind:href="props.item.clinGenLink" target="_blank">
                                    <v-list-tile style="font-size:14px; height:38px" @click="">
                                      <v-list-tile-content style="margin-left:10px">
                                        <v-list-tile-title><v-icon>arrow_right</v-icon>ClinGen</v-list-tile-title>
                                      </v-list-tile-content>
                                    </v-list-tile>
                                  </a>
                                  <br>
                                </v-list>
                              </div>
                            </v-card>
                          </v-menu>
                        </td>
                      </tr>
                    </template>
                    <template slot="footer">
                  </template>
                  </v-data-table>
                </v-card>
              </v-flex>
              <!-- End data table -->

              <!-- start sidebar -->
              <div v-bind:class="[(browser==='Chrome' && isMobile===false) || (browser==='Firefox' && isMobile===false) ? 'flex xs4 pr-2 pl-2': 'flex xs3 pr-2 pl-2']" >
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

                <div class="d-flex mt-3 mb-2 xs12">
                  <v-card v-bind:class="[chartComponent===null ? 'activeCardBox elevation-5' : 'rightbarCard ']" v-if="multipleSearchTerms.length">
                    <v-card-text>
                      <center>
                        <span class="Rightbar_CardHeading">
                        GENES
                        </span>
                        <Dialogs
                          id="genesDialog"
                          class="dialogBox"
                          :HeadlineText="HelpDialogsData[0].HeadlineText"
                          :ContentText="HelpDialogsData[0].Content">
                        </Dialogs>

                      <v-divider class="Rightbar_card_divider"></v-divider>
                      <span class="Rightbar_card_content_subheading">
                        <strong class="Rightbar_card_content_heading">{{ selected.length }}</strong> of {{ items.length }} genes selected</span>
                      </center>
                      <SvgBar
                       class="SvgBarClass"
                       id="genesSvgBox"
                       :selectedNumber="selected.length"
                       :totalNumber="items.length">
                      </SvgBar>
                    </v-card-text>
                  </v-card>
                </div>
              </div>
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
import SvgBar from '../viz/SvgBar.vue'


  export default {
    components: {
      'PhenolyzerPieChart': PhenolyzerPieChart,
      'Dialogs': Dialogs,
      'SvgBar': SvgBar,
      Typeahead
    },
    props: {
      isMobile: {
        type: Boolean
      },
      browser: {
        type: String
      }
    },
    data(){
      return {
        showGenesMenu: null,
        enterCount: 0,
        genesToApply: null,
        genesTopCounts: [5, 10, 30, 50, 80, 100],
        genesTop: null,
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
          {
            text: 'Index',
            value: 'indexVal',
            sortable: false,
            align: 'left',
          },
          {
            text: 'Gene',
            align: 'left',
            value: 'geneName',
            sortable: false,
          },
         {
           text: 'Phenolyzer score',
           align: 'left',
           value: 'score',
           sortable: false,
          },
          {
            text: '',
            align: 'left',
            value: 'htmlData',
            sortable: false,
          },
          {
            text: '',
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
      bus.$on("newAnalysis", ()=>{
        this.multipleSearchTerms = [];
        this.items = [];
        this.selected = [];
        this.dictionaryArr = [];
        this.phenotypeTerm = "";
        this.phenotypeTermEntered = "";
        this.phenolyzerStatus = null;
        this.checked = false;
        this.$emit("SelectedPhenolyzerGenesToCopy", []);
        this.$emit("NoOfGenesSelectedFromPhenolyzer", 0);
        this.phenotypeSearchedByUser = false;
        geneModel.StopAjaxCall();
        this.genesTop = null;
      });
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
      filterItemsOnSearchPhenolyzer(items, search, filter) {
        search = search.toString().toLowerCase()
        return items.filter(row => filter(row["geneName"], search));
      },
      updateTableHeaders(){
        if(this.multipleSearchTerms.length>1){
          this.headers = [
            {
              text: 'Index',
              value: 'indexVal',
              sortable: false,
              align: 'left',
            },
            {
              text: 'Gene',
              align: 'left',
              value: 'geneName',
              sortable: false,
            },
            { text: 'Search Terms', align: 'left', sortable: false, value: 'searchTermIndexSVG' },
             {
               text: 'Phenolyzer score',
               align: 'left',
               value: 'score',
               sortable: false,
              },
            {
              text: '',
              align: 'left',
              value: 'htmlData',
              sortable: false,
            },
            {
              text: '  ',
              align: 'left',
              sortable: false,
              value: ['haploScore', 'value', 'omimSrc', 'clinGenLink', '', 'rank']
            }
          ];
        }
        else if(this.multipleSearchTerms.length<=1){
          this.headers = [
            {
              text: 'Index',
              value: 'indexVal',
              sortable: false,
              align: 'left',
            },
            {
              text: 'Gene',
              align: 'left',
              value: 'geneName',
              sortable: false,
            },
               {
                 text: 'Phenolyzer score',
                 align: 'left',
                 value: 'score',
                 sortable: false,
                },
              {
                text: '',
                align: 'left',
                value: 'htmlData',
                sortable: false,
              },
              {
                text: '  ',
                align: 'left',
                sortable: false,
                value: ['haploScore', 'value', 'omimSrc', 'clinGenLink', '', 'rank']
              }
          ]
        }
      },
      SelectAllPhenolyzerGenes(data){
        this.selected = this.items.slice();
      },
      DeSelectAllPhenolyzerGenes(data){
        this.selected = [];
      },
      filterGenesOnSelectedNumber(data){
        this.selected = this.items.slice(0,data)
      },
      ClearInputForNewSearch: function(){
        if(this.checked===false){
          this.phenotypeTerm = "";
          document.getElementById("phenotype-term").value="";
          document.getElementById("phenotype-term").focus();
        }
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
        this.$emit('phenotypeSearchTermArray', this.multipleSearchTerms);
        var combinedList = this.combineList(this.dictionaryArr);
        var createdObj = this.createObj(combinedList);
        var averagedData = this.performMeanOperation(combinedList, createdObj);
        var sortedPhenotypeData = this.sortTheOrder(averagedData);

        if(this.multipleSearchTerms.length>0){
          let data = this.drawSvgBars(sortedPhenotypeData);
          this.items = data;
          this.noOfSourcesSvg();
          this.selected = this.items.slice(0,50);
          this.phenolyzerStatus = null;
          this.selectedGenesText= ""+ this.selected.length + " of " + this.items.length + " genes selected";
          this.$emit("UpdatePhenolyzerSelectedGenesText", this.selectedGenesText);
          this.$emit("NoOfGenesSelectedFromPhenolyzer", this.selected.length);
          this.$emit("SelectedPhenolyzerGenesToCopy", this.selected);
        }
        else {
          this.items = [];
          this.selected = [];
          this.phenolyzerStatus = null;
          this.selectedGenesText= ""+ this.selected.length + " of " + this.items.length + " genes selected";
          this.$emit("UpdatePhenolyzerSelectedGenesText", this.selectedGenesText);
          this.$emit("NoOfGenesSelectedFromPhenolyzer", this.selected.length);
          this.$emit("SelectedPhenolyzerGenesToCopy", this.selected);
        }


      },
      selectNumberOfTopPhenolyzerGenes: function(){
        if(this.genesTop>0){
          bus.$emit('SelectNumberOfPhenolyzerGenes', this.genesTop);
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
      getPhenotypeData(){
        let self = this;
        self.phenotypeSearchedByUser = true;
        if(self.phenotypeTerm.value.length>1 && !this.checked){
          self.checked = true;
          var searchTerm = self.phenotypeTerm.value;
          if(!self.multipleSearchTerms.includes(searchTerm)){
            self.$emit('search-phenotype', self.phenotypeTerm);
            self.$emit('phenotypeSearchTermArray', self.multipleSearchTerms);
            self.phenotypeTermEntered = self.phenotypeTerm.value;
            self.selectedGenesText = "";
            self.phenolyzerStatus = null;
            self.genesToApply = "";
            self.NoOfGenesSelectedFromPhenolyzer = 0;
            this.$emit("SelectedPhenolyzerGenesToCopy", this.selected);
            self.phenotypeTermEntered = self.phenotypeTerm.value;
            geneModel.newSearchCall();
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

                  self.multipleSearchTerms.push(searchTerm);
                  self.updateTableHeaders();
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

      drawSvgBars: function(tempItems){
        console.log("widthOFtable", $('#genes-table').innerWidth())
        var svgWidth = 250;
        var firstBarWidth = tempItems[0].score * 220;
        tempItems.map(function(gene){
          gene.htmlData = `<svg width="${svgWidth}" height="25" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="MyGradient">
                                    <stop offset="5%"  stop-color="#7CA8CF"/>
                                    <stop offset="95%" stop-color="#576E97"/>
                                </linearGradient>
                            </defs>

                            <rect fill="#4e7ad3"
                                  x="1" y="3" rx="5" width="${gene.score * 220}" height="16"/>
                            <rect fill="#e8ebed" stroke="white" stroke-width="2"
                                  x="${(gene.score * 220)+3}" y="3" rx="5" width="${(firstBarWidth - (gene.score * 220))}" height="16"/>

                          </svg>`;
          gene.omimSrc = `https://www.ncbi.nlm.nih.gov/omim/?term=${gene.geneName}`;
          gene.medGenSrc = `https://www.ncbi.nlm.nih.gov/medgen/?term=${gene.geneName}`;
          gene.geneCardsSrc = `https://www.genecards.org/cgi-bin/carddisp.pl?gene=${gene.geneName}`;
          gene.ghrSrc = `https://ghr.nlm.nih.gov/gene/${gene.geneName}`;
          gene.clinGenLink = `https://www.ncbi.nlm.nih.gov/projects/dbvar/clingen/clingen_gene.cgi?sym=${gene.geneName}`;

        })
        return tempItems
      },
      noOfSourcesSvg: function(){
        this.items.map((x, i)=>{
          x.indexVal = i+1;
          x.searchTermIndexSVG = x.searchTermIndex.map(y=>{
            return `<svg height="30" width="30">
                  <circle fill="#ffffff00" stroke-width="2" stroke="#455A64" cx="12" cy="15" r="10"  />
                  <text x="12" y="15" text-anchor="middle" fill="#455A64" font-weight="600" font-size="10px" font-family="Arial" dy=".3em">${y}</text>
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

<style>
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

<style lang="sass">

  @import ../assets/sass/variables

  .btnColor
    color: white
    background-color: $search-button-color !important

  .accent--text
    color: $accent-text-color !important

</style>
