<template>
  <div>
    <div style="background-color:#f9fbff">
      <v-container fluid grid-list-md>
        <v-layout row wrap style="margin-top:-20px;">
          <v-flex d-flex xs12>
            <v-card v-if="!searchComplete">
              <v-card-text>
                <h3>Dashboard</h3>
                <v-layout row wrap class="mt-3">
                  <v-flex xs1 sm1 md1 lg1 xl1>

                  </v-flex>
                  <v-flex xs12 sm12 md12 lg2 xl2>
                    <!-- <div id="dropdown-example">
                      <v-overflow-btn
                         :items="dropdown_tool"
                         label="Select tool"
                         hint="Select the tool"
                         persistent-hint
                         target="#dropdown-example"
                         v-model="dropdown_tool_value"
                       ></v-overflow-btn>
                    </div> -->
                  </v-flex>
                  <v-flex xs12 sm12 md12 lg9 xl9>
                    <div id="SingleEntryInput" style="display:inline-block; padding-top:5px;">
                      <input
                        v-show="inputVal.length<10"
                        v-model="inputVal"
                        id="single_entry_input"
                        ref="single_entry_input"
                        class="form-control"
                        type="text"
                        autocomplete="off"
                        placeholder="Enter Clinical Conditions or Phenotypes">
                        <v-textarea
                          solo
                          v-show="inputVal.length>=10"
                          v-model="inputVal"
                          ref="single_entry_input_textarea"
                          id="single_entry_input_textarea"
                          name="input-7-4"
                          rows="4"
                        ></v-textarea>
                      <typeahead
                        v-model="search"
                        hide-details="false"
                        target="#single_entry_input"
                        force-select :force-clear="true"
                        :data="DiseaseNames"
                        :limit="parseInt(100)"
                        v-on:keydown="EnterForSearch"
                        v-on:input="mouseSelect"
                        item-key="DiseaseName"/>
                    </div>

                     <v-btn class="mx-2" fab dark small color="primary" v-on:click.prevent="putFocus">
                      <v-icon color="white">add</v-icon>
                    </v-btn>

                    <br>
                    <div v-if="multipleSearchTerms.length">
                      <br>
                        <span id="conditionChips" v-for="(searchItem, i) in searchTermsObj">
                          <v-chip slot="activator" outline color="primary" text-color="primary" close :key="i" @input="remove(searchItem)">
                            {{ i+1 }}. {{ searchItem.DiseaseName }}  &nbsp;
                            <span v-if="searchItem.tool_to_search==='All resources'"> <i> * </i> </span>
                            <span v-if="searchItem.tool_to_search==='GTR'"> <i> ( G ) </i> </span>
                            <span v-if="searchItem.tool_to_search==='Phenolyzer'"> <i> ( P ) </i> </span>

                          </v-chip>
                        </span>
                    </div>
                    <br>
                    <div>
                      <v-btn class="btnColor" :disabled="!multipleSearchTerms.length" @click="performSearchEvent">Search</v-btn>

                    </div>

                  </v-flex>

                </v-layout>
              </v-card-text>
            </v-card>

          </v-flex>
        </v-layout>

      </v-container>


      <v-container fluid grid-list-md>
        <v-layout row wrap style="margin-top:-20px;">
          <v-flex d-flex xs12>
            <v-expansion-panel v-if="searchStatus" expand v-model="expansionpanlExpand">
              <v-expansion-panel-content>
                <template v-slot:header>
                  <div>Search Status</div>
                </template>
                <v-card>
                  <v-card-text>
                    <!-- Datatable -->
                    <v-data-table
                      v-if="searchStatus"
                      :headers="searchTermsObjHeaders"
                      :items="searchTermsObj"
                      hide-actions=false
                    >
                      <template v-slot:items="props">
                        <td>{{ props.item.DiseaseName }}</td>
                        <td >
                          <span v-if="props.item.gtrSearchStatus==='Searching'">
                            <v-progress-circular
                              :width="2"
                              :size="20"
                              indeterminate
                              color="primary"
                            ></v-progress-circular>
                          </span>
                          <span v-else-if="props.item.gtrSearchStatus==='Completed'"><v-icon color="green">done</v-icon></span>
                          <span v-else-if="props.item.gtrSearchStatus==='NoGenes'"><v-icon color="red">error</v-icon></span>
                          <span v-else-if="props.item.gtrSearchStatus==='NotAvailable'"><v-icon>indeterminate_check_box</v-icon></span>
                          <span v-else> <v-icon color="gray lighten-4">error</v-icon>  </span>
                        </td>
                        <td >
                          <span v-if="props.item.phenolyzerSearchStatus==='Searching'">
                            <v-progress-circular
                              :width="2"
                              :size="20"
                              indeterminate
                              color="primary"
                            ></v-progress-circular>
                          </span>
                          <span v-else-if="props.item.phenolyzerSearchStatus==='Completed'"><v-icon color="green">done</v-icon></span>
                          <span v-else-if="props.item.phenolyzerSearchStatus==='NoGenes'"><v-icon color="red">error</v-icon></span>
                          <span v-else-if="props.item.phenolyzerSearchStatus==='NotAvailable'"><v-icon>indeterminate_check_box</v-icon></span>
                          <span v-else> <v-icon color="gray lighten-4">error</v-icon> </span>
                        </td>
                      </template>
                    </v-data-table>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-card>
              <v-dialog
                v-model="alertWarning"
                scrollable
                persistent
                :overlay="false"
                max-width="800px"
                transition="dialog-transition"
              >
                <v-card>
                  <v-card-text>
                    <v-alert
                       :value="true"
                       color="info"
                       icon="info"
                       outline
                     >
                        This search term is too general to search in GTR. Please select a more specific term from the options below:
                        <br>
                     </v-alert>
                    <br>
                    <li style="cursor: pointer" v-if="generalTermsHint.length>0" v-for="(hint, i) in generalTermsHint" :key="i" v-on:click="selectNewTerm(hint)" > {{hint.Title}} <br> </li>
                    <hr>
                    New option selected: {{ NewOptionFromGeneralTerm }}
                  </v-card-text>
                  <v-card-actions>
                    <div class="flex-grow-1"></div>
                    <v-btn small color="blue darken-1" round outline dark text @click="skipGtrSearch">Skip search in GTR</v-btn>
                    <v-btn small color="blue darken-1" round outline dark text @click="setInputValueFromHint">Confirm</v-btn>
                  </v-card-actions>

                </v-card>
              </v-dialog>
            </v-card>


            <!-- Loading dialog box -->
            <v-dialog
              v-model="loadingDialog"
              hide-overlay
              persistent
              width="300"
            >
              <v-card
                color="primary"
                dark
              >
                <v-card-text>
                    <p style="color:white">Fetching terms for review...</p>
                  <v-progress-linear
                    indeterminate
                    color="white"
                    class="mb-0"
                  ></v-progress-linear>
                </v-card-text>
              </v-card>
            </v-dialog>
            <!-- End Loading dialog box -->


            <!-- Terms review dialog box -->
            <v-card>
              <v-dialog
                v-model="termsReviewDialog"
                scrollable
                persistent :overlay="false"
                max-width="600px"
                transition="dialog-transition"
              >
                <v-card>
                  <v-card-title class="headline">Review Terms</v-card-title>
                  <v-card-title v-if="termsReviewDialogPage===1">Select the terms to be searched in GTR:</v-card-title>
                  <v-card-title v-if="termsReviewDialogPage===2">Select the terms to be searched in Phenolyzer:</v-card-title>

                  <v-card-text style="height: 430px;">
                    <!-- termsReviewDialogPage: {{ termsReviewDialogPage }}
                    Gtr terms: {{ GtrReviewTerms.length }}
                    Phenolyzer terms: {{ phenolyzerReviewTerms.length }}

                    <hr>
                    GTR terms added:
                    <span v-for="(term, i) in GtrTermsAdded">
                      <v-chip slot="activator" outline color="primary" text-color="primary"  :key="term.DiseaseName" >
                        {{ term.DiseaseName }}
                      </v-chip>
                    </span>
                    <hr>
                    Phenolyzer terms added:
                    <span v-for="(term, i) in phenolyzerTermsAdded">
                      <v-chip slot="activator" outline color="primary" text-color="primary"  :key="term" >
                        {{ term.value }}
                      </v-chip>
                    </span> -->
                    <!-- <div v-if="GtrReviewTerms.length && termsReviewDialogPage===1" v-for="(term, i) in GtrReviewTerms" :key="i" v-on:click="selectGtrTerm(term)">
                      {{ term.DiseaseName }}
                    </div> -->

                    <!-- <div v-if="phenolyzerReviewTerms.length && termsReviewDialogPage===2" v-for="(term, i) in phenolyzerReviewTerms" :key="term.value" v-on:click="selectPhenolyzerTerm(term)">
                      {{ term.value }}
                    </div> -->


                    <!-- GTR review terms table -->
                    <div v-if="GtrReviewTerms.length && termsReviewDialogPage===1">
                      <table class="table table-hover">
                        <thead>
                          <tr>
                            <!-- <th scope="col">Selection</th>
                            <th scope="col">Term</th> -->
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(term, i) in GtrReviewTerms" :key="i">
                            <th scope="row">
                              <v-checkbox color="primary" style="margin-top:8px; margin-bottom:-12px;" v-model="GtrTermsAdded" :value="term"></v-checkbox>
                            </th>
                            <td>{{ term.DiseaseName }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <!-- Phenolyzer review terms table -->
                    <div v-if="phenolyzerReviewTerms.length && termsReviewDialogPage===2">
                      <table class="table table-hover">
                        <thead>
                          <tr>
                            <!-- <th scope="col">Selection</th>
                            <th scope="col">Term</th> -->
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(term, i) in phenolyzerReviewTerms" :key="i">
                            <th scope="row">
                              <v-checkbox color="primary" style="margin-top:8px; margin-bottom:-12px;" v-model="phenolyzerTermsAdded" :value="term"></v-checkbox>
                            </th>
                            <td>{{ term.value }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>


                  </v-card-text>
                  <v-card-actions>
                    <div class="flex-grow-1"></div>
                    <!-- <v-btn small color="blue darken-1" round outline dark text @click="termsReviewDialog=false">Skip</v-btn> -->
                    <v-btn :disabled="termsReviewDialogPage===1" small color="blue darken-1" flat @click="--termsReviewDialogPage">Back</v-btn>
                    <v-btn :disabled="termsReviewDialogPage>1" small color="blue darken-1" flat @click="++termsReviewDialogPage">Next</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn :disabled="termsReviewDialogPage!==2" small color="blue darken-1" flat @click="selectReviewTerms">Done</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>

      <v-container fluid grid-list-md>
        <v-layout row wrap>
          <v-flex d-flex xs12>
            <!-- <v-card>
              <v-card-text> -->
                <v-layout row wrap>
                  <div class="col-md-12" style="padding-right:4px; padding-left:4px">
                    <!-- <v-card>
                      <v-card-text> -->
                        <div class="col-md-4">
                          <v-card v-if="searchComplete">
                            <v-card-text class="text-md-center">
                              <strong>GTR Genes: </strong>
                              <br>
                              {{selectedGtrGenes.length}} of {{gtrCompleteGeneList.length}} selected
                              <v-card class="mt-3">
                                <div v-if="!selectedGtrGenes.length">
                                  <v-card-text>
                                    No conditions searched in GTR...
                                  </v-card-text>
                                </div>
                                <div v-else>
                                  <progressCircularDonut
                                    :selectedNumber="selectedGtrGenes.length"
                                    :totalNumber="gtrCompleteGeneList.length"
                                  >
                                  </progressCircularDonut>
                                </div>
                              </v-card>
                              <br>
                              <v-card class="mb-2" v-if="gtrGenes.length">
                                <BarChartSingleEntry
                                  idValue="GtrChart"
                                  label="# of Genepanels (Top 5 genes)"
                                  :VizData="gtrGenes">
                                </BarChartSingleEntry>
                              </v-card>
                              <!-- <v-btn round small style="text-transform:none" outline color="primary" @click="selectComponent('gtr')"> Add/ Update in GTR </v-btn> -->
                            </v-card-text>
                          </v-card>

                          <v-card v-if="searchComplete" class="mt-4">
                            <v-card-text>
                              <div class="text-md-center">
                                <strong>Search terms summary</strong>
                              </div>
                              <v-card class="mt-3 mb-3 pl-3 pr-3 pt-3 pb-3">
                                <DoughnutChartSingleEntry
                                  :GtrTermsLength="GtrTermsAdded.length"
                                  :PhenolyzerTermsLength="phenolyzerTermsAdded.length">
                                </DoughnutChartSingleEntry>
                              </v-card>
                            </v-card-text>
                          </v-card>
                        </div>
                        <div class="col-md-4">
                          <v-card v-if="searchComplete">
                            <v-card-text class="text-md-center">
                              <strong>Phenolyzer Genes: </strong>
                              <br>
                              {{selectedPhenolyzerGenes.length}} of {{phenolyzerCompleteGeneList.length}} selected
                              <v-card class="mt-3">
                                <div v-if="!selectedPhenolyzerGenes.length">
                                  <v-card-text>
                                    No phenotypes searched in Phenolyzer...
                                  </v-card-text>
                                </div>
                                <div v-else>
                                  <progressCircularDonut
                                    :selectedNumber="selectedPhenolyzerGenes.length"
                                    :totalNumber="phenolyzerCompleteGeneList.length"
                                  >
                                  </progressCircularDonut>
                                </div>
                              </v-card>
                              <br>
                              <v-card class="mb-2" v-if="phenolyzerGenes.length">
                                <HorizontalBarChartSingleEntry
                                  idValue="phenolyzerChart"
                                  label="Phenolyzer score (Top 5 genes)"
                                  :VizData="phenolyzerGenes">
                                </HorizontalBarChartSingleEntry>
                              </v-card>
                              <!-- <v-btn round small style="text-transform:none" outline color="primary" @click="selectComponent('phenolyzer')"> Add/ Update in Phenolyzer </v-btn> -->
                            </v-card-text>
                          </v-card>
                        </div>
                        <div class="col-md-4">
                          <v-card v-if="searchComplete">
                            <v-card-text>
                              <div class="text-md-center">
                                <strong>Summary Genes: </strong>
                                <br>
                                {{TotalSummarySelectedGenes}} of {{TotalSummaryGenes}} selected
                              </div>
                              <v-card class="mt-3">
                                <progressCircularDonut
                                  :selectedNumber="TotalSummarySelectedGenes"
                                  :totalNumber="TotalSummaryGenes"
                                >
                                </progressCircularDonut>
                              </v-card>
                              <br>
                              <div v-if="summaryGenes.length">
                                <v-btn small v-on:click="exportGenesCSV"><v-icon>save</v-icon>&nbsp; &nbsp;Export genes</v-btn>
                              </div>
                              <v-card >
                                <v-card-text>
                                  <!-- Datatable -->
                                  <v-data-table
                                    :headers="summaryGenesHeader"
                                    :items="summaryGenes"
                                    class="elevation-1"
                                    hide-actions=false
                                  >
                                    <template v-slot:items="props">
                                      <td>{{ props.item.name }}</td>
                                    </template>
                                  </v-data-table>
                                </v-card-text>
                              </v-card>
                              <div class="text-md-center mt-3">
                                <v-btn round small outline style="text-transform:none" color="primary" @click="selectComponent('summary')"> View all genes in Summary </v-btn>
                              </div>
                            </v-card-text>
                          </v-card>
                        </div>
<!--
                        <div class="col-md-4">
                          <v-card v-if="searchComplete">
                            <v-card-text>
                              <div class="text-md-center">
                                <strong>Search terms summary</strong>
                              </div>
                              <v-card class="mt-3 mb-3 pl-3 pr-3 pt-3 pb-3">
                                <DoughnutChartSingleEntry
                                  :GtrTermsLength="GtrTermsAdded.length"
                                  :PhenolyzerTermsLength="phenolyzerTermsAdded.length">
                                </DoughnutChartSingleEntry>
                              </v-card>
                            </v-card-text>
                          </v-card>
                        </div> -->

                  </div>
                </v-layout>
              <!-- </v-card-text>
            </v-card> -->
          </v-flex>
        </v-layout>
      </v-container>
      <v-container fluid grid-list-md style="min-height:300px">
      </v-container>

    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { bus } from '../../routes';
import { Typeahead, Btn } from 'uiv';
import d3 from 'd3';
import Model from '../../models/Model';
import DiseaseNamesData from '../../../data/DiseaseNames.json'
import DiseaseNames from '../../../data/DiseaseNamesCleaned.json'
import progressCircularDonut from '../partials/progressCircularDonut.vue';
import Chart from 'chart.js';
import BarChartSingleEntry from '../viz/BarChartSingleEntry.vue';
import HorizontalBarChartSingleEntry from '../viz/HorizontalBarChartSingleEntry.vue';
import DoughnutChartSingleEntry from '../viz/DoughnutChartSingleEntry.vue';
var model = new Model();

  export default {
    components: {
      'progressCircularDonut': progressCircularDonut,
      'BarChartSingleEntry': BarChartSingleEntry,
      'HorizontalBarChartSingleEntry': HorizontalBarChartSingleEntry,
      'DoughnutChartSingleEntry': DoughnutChartSingleEntry
    },
    props: {
      selectedGtrGenes: {
        type: Array
      },
      gtrCompleteGeneList: {
        type: Array
      },
      selectedPhenolyzerGenes: {
        type: Array
      },
      phenolyzerCompleteGeneList: {
        type: Array
      }
    },
    data(){
      return {
        search: '',
        multipleSearchTerms: [],
        searchTermsObj: [],
        idx: 0,
        gtrFetchCompleted: false,
        phenolyzerFetchCompleted: false,
        searchTermsObjHeaders: [
          {text: 'Search Term', sortable: false, value: 'DiseaseName'},
          {text: 'GTR Search status', sortable: false, value: 'gtrSearchStatus'},
          {text: 'Phenolyzer Search status', sortable: false, value: 'phenolyzerSearchStatus'},
        ],
        summaryGenes: [],
        gtrGenes: [],
        phenolyzerGenes: [],
        searchStatus: false,
        summaryGenesHeader: [
          {text: 'Gene', sortable: false, value: 'name'},
        ],
        alertWarning: false,
        termsReviewDialog: false,
        termsReviewDialogPage: 0,
        generalTermsHint: [],
        gtrVizData: {},
        phenolyzerVizData: {},
        expansionpanlExpand: ['true'],
        dropdown_tool: ['All resources', 'GTR', 'Phenolyzer'],
        dropdown_tool_value: 'All resources',
        TotalSummaryGenes: 0,
        TotalSummarySelectedGenes: 0,
        searchComplete: false,
        NewOptionFromGeneralTerm: '',
        GtrReviewTerms: [],
        phenolyzerReviewTerms: [],
        hpoLookupUrl:  "https://nv-prod.iobio.io/hpo/hot/lookup/?term=",
        GtrTermsAdded: [],
        phenolyzerTermsAdded: [],
        loadingDialog: false,
        inputVal: ''
      }
    },
    mounted(){
      bus.$on("newAnalysis", ()=>{
        this.multipleSearchTerms = [];
        this.searchTermsObj = [];
        this.idx = 0;
        this.gtrFetchCompleted = false;
        this.phenolyzerFetchCompleted = false;
        this.summaryGenes = [];
        this.gtrGenes = [];
        this.phenolyzerGenes = [];
        this.searchStatus = false;
        this.alertWarning = false;
        this.generalTermsHint = [];
        this.gtrVizData = {};
        this.phenolyzerVizData = {};
        this.expansionpanlExpand = ['true'];
        this.dropdown_tool = ['All resources', 'GTR', 'Phenolyzer'];
        this.dropdown_tool_value = 'All resources',
        this.TotalSummaryGenes = 0;
        this.TotalSummarySelectedGenes = 0;
        this.searchComplete = false;
        this.NewOptionFromGeneralTerm = ''

      })
      bus.$on("completeFetchRequest", (component)=>{
        if(component === "GTR"){
          console.log(" GTR completed!")
          this.searchTermsObj[this.idx].gtrSearchStatus = "Completed";
          this.gtrFetchCompleted = true;
        }
        else if(component === "Phenolyzer"){
          console.log("Phenolyzer completed!");
          this.searchTermsObj[this.idx].phenolyzerSearchStatus = "Completed"
          this.phenolyzerFetchCompleted = true;
        }
        else if(component === "noGenePanels"){
          // console.log("here")
          this.searchTermsObj[this.idx].gtrSearchStatus = "NoGenes"
          this.gtrFetchCompleted = true;
        }
        else if(component === "noPhenolyzerGenes"){
          // console.log("Phenolyzer completed!");
          this.searchTermsObj[this.idx].phenolyzerSearchStatus = "NoGenes"
          this.phenolyzerFetchCompleted = true;
        }
        else if(component === "skipGtr"){
          // this.$set(this.searchTermsObj[this.idx], 'gtrSearchStatus', "NotAvailable");
          this.searchTermsObj[this.idx].gtrSearchStatus = "NotAvailable"
          this.gtrFetchCompleted = true;
        }
        console.log("searchTermsObj", this.searchTermsObj)
        if(this.gtrFetchCompleted && this.phenolyzerFetchCompleted){
          this.searchTermsObj[this.idx].status = "Completed";
          this.idx = this.idx + 1;
          if(this.idx < this.multipleSearchTerms.length){
            this.performSearchEvent();
          }
          else {
            this.summaryGenes = this.getSummaryGenes.slice(0,12) // Gets data from store
            this.expansionpanlExpand = [];
            this.searchComplete = true;
          }
        }
      })

      bus.$on("handleGeneralTermsInSingleEntry", (diseases)=>{
        this.alertWarning = true;
        this.generalTermsHint = diseases;
      })

      bus.$on("TotalGenesInSummary", (genes)=>{
        this.TotalSummaryGenes = genes;
      })

      bus.$on("TotalSelectedGenesInSummary", (genes) =>{
        this.TotalSummarySelectedGenes = genes;
      })
    },
    updated(){
    },
    watch: {
      inputVal(){
        if(this.inputVal.length===10){
          setTimeout(()=>{
            this.$refs.single_entry_input_textarea.focus();
          },10)
        }
        else if(this.inputVal.length===9){
          setTimeout(()=>{
            this.$refs.single_entry_input.focus();
          },10)
        }
      },
      searchTermsObj(){
      },
      getGtrGenes(){
        this.gtrGenes = this.getGtrGenes.slice(0, 5);
        var geneNames = [];
        var genepanelCounts = [];
        this.gtrGenes.map(gene => {
          geneNames.push(gene.name);
          genepanelCounts.push(gene.value)
        })
        this.gtrVizData.geneNames = geneNames;
        this.gtrVizData.genepanelCounts = genepanelCounts;
      },
      getPhenolyzerGenes(){
        console.log(":getPhenolyzerGenes: ", this.getPhenolyzerGenes)
        // var sortedGenes = this.sortOrder(this.getPhenolyzerGenes);
        //
        // this.phenolyzerGenes = sortedGenes.slice(0,5);
        this.phenolyzerGenes = this.getPhenolyzerGenes.slice(0,5);
        console.log("this.phenolyzerGenes", this.phenolyzerGenes)
        this.$set(this.phenolyzerVizData, 'geneNames', [])
        this.$set(this.phenolyzerVizData, 'genepanelCounts', [])

        var geneNames = [];
        var genepanelCounts = [];
        this.phenolyzerGenes.map(gene => {
          geneNames.push(gene.geneName);
          genepanelCounts.push(gene.score)
        })
        this.$set(this.phenolyzerVizData, 'geneNames', geneNames)
        this.$set(this.phenolyzerVizData, 'genepanelCounts', genepanelCounts)

        // this.phenolyzerVizData.geneNames = geneNames;
        // this.phenolyzerVizData.genepanelCounts = genepanelCounts;
        // console.log("phenolyzerVizData", this.phenolyzerVizData)
      },
      getSummaryGenes(){
        console.log("changing!!")
        this.summaryGenes = this.getSummaryGenes.slice(0,12) // Gets data from store
      },
      phenolyzerVizData(){
        console.log("phenolyzerVizData is changing")
      }
    },
    methods:{
      setPhenolyzerTerms(str){
        return fetch(`https://nv-prod.iobio.io/hpo/hot/lookup/?term=${str}`)
            .then(response => response.json())
            .then(data => data)
      },
      mouseSelect(){
        if(this.search!==undefined){
          this.loadingDialog = true;
          // this.checkBeforeAddTerm();
          setTimeout(()=>{
            // this.checkBeforeAddTerm();
            this.openReviewDialog();
          }, 1000)
        }
      },
      EnterForSearch(){
        if(event.key === 'Enter') {
          setTimeout(()=>{
            // this.checkBeforeAddTerm();
            this.openReviewDialog();
          }, 1000)
        }
      },
      openReviewDialog(){
        this.GtrReviewTerms = [];

        var term = this.search.DiseaseName.toLowerCase();
        term = term.replace("disease", "");
        term = term.replace("syndrome", "");
        term = term.trim();
        DiseaseNamesData.data.forEach(x => {
          // if(x.DiseaseName.toLowerCase().split(' ').includes(term)){
          //   this.GtrReviewTerms.push(x);
          // }
          if(x.DiseaseName.toLowerCase().includes(term)){
            this.GtrReviewTerms.push(x);
          }
        })

        var str = this.search.DiseaseName.replace(/-/g, " ").replace(/\s\s+/g, ' ').toLowerCase();
        str = str.replace("disease", "");
        str = str.replace("syndrome", "");
        str = str.trim();

        var data = this.setPhenolyzerTerms(str);
        data.then(res => {
          this.phenolyzerReviewTerms = res;
        })

      setTimeout(()=>{
          this.termsReviewDialog = true;
          this.termsReviewDialogPage = 1;
          this.loadingDialog = false;
      },500)

      },
      closeReviewDialog(){
        this.termsReviewDialog=false;
        this.termsReviewDialogPage = 0;
      },
      remove(item){
        var idxOf = this.multipleSearchTerms.indexOf(item);
        this.multipleSearchTerms.splice(this.multipleSearchTerms.indexOf(item), 1)
        this.multipleSearchTerms = [...this.multipleSearchTerms];
        this.searchTermsObj.splice(idxOf, 1)
        this.searchTermsObj = [...this.searchTermsObj];
      },
      sortOrder(arr){
        arr.sort(function(a,b){
          if (a.score===b.score){
             return (b.score-a.score);
          } else if(a.score<b.score){
             return 1;
          } else if(a.score>b.score){
             return -1;
          }
         })
         return arr;
      },
      exportGenesCSV: function(){
        bus.$emit("exportSummaryGenesAsCSV")
      },
      selectComponent(component){
        if(component==='gtr'){
          bus.$emit('openGtrComponent');
        }
        else if(component==='phenolyzer'){
          bus.$emit('openPhenolyzer')
        }
        else if(component==='clinphen'){
          bus.$emit('openClinphen')
        }
        else if(component==='summary'){
          bus.$emit('openSummary')
        }
      },
      checkBeforeAddTerm(){
        this.addTerm();
      },
      performSearchEvent(){
        this.searchStatus = true;
        var str = this.multipleSearchTerms[this.idx].replace("-", " ").replace(/\s\s+/g, ' ').toLowerCase();

        if(this.searchTermsObj[this.idx].tool_to_search === "All resources"){
          this.gtrFetchCompleted = false;
          this.phenolyzerFetchCompleted = false;
          this.$set(this.searchTermsObj[this.idx], 'status', "Searching");
          this.$set(this.searchTermsObj[this.idx], 'gtrSearchStatus', "Searching");
          this.$set(this.searchTermsObj[this.idx], 'phenolyzerSearchStatus', "Searching");
          // var str = this.multipleSearchTerms[this.idx].replace("-", " ").replace(/\s\s+/g, ' ').toLowerCase();
          bus.$emit("singleTermSearchGTR", this.searchTermsObj[this.idx]);
          bus.$emit("singleTermSearchPhenolyzer", str);
        }
        else if(this.searchTermsObj[this.idx].tool_to_search === "GTR"){
          this.gtrFetchCompleted = false;
          this.$set(this.searchTermsObj[this.idx], 'status', "Searching");
          this.$set(this.searchTermsObj[this.idx], 'gtrSearchStatus', "Searching");
          this.$set(this.searchTermsObj[this.idx], 'phenolyzerSearchStatus', "NotAvailable");
          this.phenolyzerFetchCompleted = true;
          bus.$emit("singleTermSearchGTR", this.searchTermsObj[this.idx]);
        }
        else if(this.searchTermsObj[this.idx].tool_to_search === "Phenolyzer"){
          // this.searchStatus = true;
          // this.gtrFetchCompleted = false;
          this.phenolyzerFetchCompleted = false;
          this.$set(this.searchTermsObj[this.idx], 'status', "Searching");
          this.$set(this.searchTermsObj[this.idx], 'gtrSearchStatus', "NotAvailable");
          this.$set(this.searchTermsObj[this.idx], 'phenolyzerSearchStatus', "Searching");
          this.gtrFetchCompleted = true;
          bus.$emit("singleTermSearchPhenolyzer", str);
        }
      },
      addTerm(){
        var searchTerm ="";
        var conceptId = ""
        searchTerm = this.search.DiseaseName;
        conceptId = this.search.ConceptID;
        this.$set(this.search, 'status', "Not started");
        this.$set(this.search, 'gtrSearchStatus', "Not started");
        this.$set(this.search, 'phenolyzerSearchStatus', "Not started");
        this.$set(this.search, 'tool_to_search', this.dropdown_tool_value);
        if(!this.multipleSearchTerms.includes(searchTerm) && searchTerm!==undefined){
          if(searchTerm.length>1){
            this.multipleSearchTerms.push(searchTerm);
            this.searchTermsObj.push(this.search);
            this.search = '';
          }
        }
      },
      selectGtrTerm(term){
        if(this.GtrTermsAdded.length>=4){
          alert("Max terms added in Gtr")
        }
        else {
          var searchTerm ="";
          var conceptId = ""
          searchTerm = term.DiseaseName;
          conceptId = term.ConceptID;
          this.$set(term, 'status', "Not started");
          this.$set(term, 'gtrSearchStatus', "Not started");
          this.$set(term, 'phenolyzerSearchStatus', "Not started");
          this.$set(term, 'tool_to_search', 'GTR');

          if(!this.multipleSearchTerms.includes(searchTerm) && searchTerm!==undefined){
            if(searchTerm.length>1){
              this.multipleSearchTerms.push(searchTerm);
              this.searchTermsObj.push(term);
              this.GtrTermsAdded.push(searchTerm);
              this.search = '';
            }
          }
        }
      },
      selectPhenolyzerTerm(term){
        console.log("Term", term)
        var searchTerm ="";
        searchTerm = term.value;
        console.log("searchTerm", searchTerm)
        this.$set(term, 'status', "Not started");
        this.$set(term, 'gtrSearchStatus', "Not started");
        this.$set(term, 'phenolyzerSearchStatus', "Not started");
        this.$set(term, 'tool_to_search', 'Phenolyzer');
        this.$set(term, 'DiseaseName', term.value);
        if(!this.multipleSearchTerms.includes(searchTerm) && searchTerm!==undefined){
          if(searchTerm.length>1){
            this.multipleSearchTerms.push(searchTerm);
            this.searchTermsObj.push(term);
            this.phenolyzerTermsAdded.push(searchTerm);
            this.search = '';
          }
        }
        console.log("multipleSearchTerms", this.multipleSearchTerms)
      },
      selectReviewTerms(){

        this.GtrTermsAdded.map(term=>{
          var searchTerm ="";
          var conceptId = ""
          searchTerm = term.DiseaseName;
          conceptId = term.ConceptID;
          this.$set(term, 'status', "Not started");
          this.$set(term, 'gtrSearchStatus', "Not started");
          this.$set(term, 'phenolyzerSearchStatus', "Not started");
          this.$set(term, 'tool_to_search', 'GTR');

          if(!this.multipleSearchTerms.includes(searchTerm) && searchTerm!==undefined){
            if(searchTerm.length>1){
              this.multipleSearchTerms.push(searchTerm);
              this.searchTermsObj.push(term);
            }
          }
        })

        this.phenolyzerTermsAdded.map(term => {
          var searchTerm ="";
          searchTerm = term.value;
          this.$set(term, 'status', "Not started");
          this.$set(term, 'gtrSearchStatus', "Not started");
          this.$set(term, 'phenolyzerSearchStatus', "Not started");
          this.$set(term, 'tool_to_search', 'Phenolyzer');
          this.$set(term, 'DiseaseName', term.value);
          if(!this.multipleSearchTerms.includes(searchTerm) && searchTerm!==undefined){
            if(searchTerm.length>1){
              this.multipleSearchTerms.push(searchTerm);
              this.searchTermsObj.push(term);
            }
          }
        })
        this.termsReviewDialog = false;
        this.search = '';
        this.termsReviewDialogPage = 0;
      },
      selectNewTerm(hint){
        this.NewOptionFromGeneralTerm = hint.Title;
        this.searchTermsObj[this.idx].DiseaseName = hint.Title;
        this.searchTermsObj[this.idx].ConceptID = hint.ConceptId;
      },
      setInputValueFromHint(){
        // this.searchTermsObj[this.idx].DiseaseName = hint.Title;
        // this.searchTermsObj[this.idx].ConceptID = hint.ConceptId;
        bus.$emit("singleTermSearchGTR", this.searchTermsObj[this.idx]);
        this.alertWarning = false;
        this.NewOptionFromGeneralTerm = '';
      },
      skipGtrSearch(){
        this.alertWarning = false;
        bus.$emit("completeFetchRequest", "skipGtr")
      }
    },
    computed: {
      ...mapGetters(['getSummaryGenes', 'getGtrGenes', 'getPhenolyzerGenes']),
      DiseaseNames: function() {
        return DiseaseNames.data.sort(function(a,b) {
          if (a.DiseaseName < b.DiseaseName) {
            return -1;
          } else if (a.DiseaseName > b.DiseaseName) {
            return 1;
          } else {
            return 0;
          }
        });
      },
    }
  }

</script>

<style lang="sass">
@import url('https://fonts.googleapis.com/css?family=Open+Sans')
@import ../assets/sass/variables
.form-control
  font-size: 15px

#single_entry_input
  width: 600px
  height: 49px
  margin-top: 7px
  // background-color: $search-box-color
  border-bottom-color: #949494
  border-right-color: #e9e9e9
  border-top-color: #e9e9e9
  border-left-color: #e9e9e9
  // border-color: #e9e9e9

#single_entry_input_textarea
  width: 600px
  margin-top: 7px
  // // background-color: $search-box-color
  // border-bottom-color: #949494
  // border-right-color: #e9e9e9
  // border-top-color: #e9e9e9
  // border-left-color: #e9e9e9

@media screen and (max-width: 1620px)
  #single_entry_input
    width: 420px
    height: 40px
    margin-top: 4px

@media screen and (max-width: 1050px)
  #single_entry_input
    width: 450px
    height: 40px
    margin-top: 4px

@media screen and (max-width: 950px)
  #single_entry_input
    width: 290px
    height: 40px
    margin-top: 4px

@media screen and (max-width: 700px)
  #single_entry_input
    width: 300px
    height: 40px
    margin-top: 4px
    box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)

.v-progress-circular
  margin: 1rem

.review-table
  display: block
  height: 300px
  overflow-y: scroll
</style>
