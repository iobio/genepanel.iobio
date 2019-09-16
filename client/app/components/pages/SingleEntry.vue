<template>
  <div>
    <div style="background-color:#f9fbff">
      <v-container fluid grid-list-md>
        <v-layout row wrap style="margin-top:-20px;">
          <v-flex d-flex xs12>
            <v-card v-if="!searchComplete">
              <v-card-text>
                <h3>Dashboard</h3>
                <v-layout row wrap>
                  <v-flex xs12 sm12 md12 lg2 xl2>
                    <div id="dropdown-example">
                      <v-overflow-btn
                         :items="dropdown_tool"
                         label="Select tool"
                         hint="Select the tool"
                         persistent-hint
                         target="#dropdown-example"
                         v-model="dropdown_tool_value"
                       ></v-overflow-btn>
                    </div>
                  </v-flex>
                  <v-flex xs12 sm12 md12 lg10 xl10>
                    <div id="SingleEntryInput" style="display:inline-block; padding-top:5px;">
                      <input
                        id="single-entry-input"
                        class="form-control"
                        type="text"
                        autocomplete="off"
                        placeholder="Enter Clinical Conditions or Phenotypes">
                      <typeahead
                        match-start
                        v-model="search"
                        target="#single-entry-input"
                        :data="DiseaseNames"
                        :limit="parseInt(100)"
                        :preselect="false"
                        item-key="DiseaseName"/>
                    </div>
                    <v-btn class="mx-2" fab dark small color="primary" v-on:click.prevent="checkBeforeAddTerm">
                      <v-icon color="white">add</v-icon>
                    </v-btn>

                    <v-btn class="btnColor" @click="performSearchEvent">Search</v-btn>
                    <br>
                    <div v-if="multipleSearchTerms.length">
                      <br>
                        <span id="conditionChips" v-for="(searchItem, i) in multipleSearchTerms">
                          <v-chip slot="activator" outline color="primary" text-color="primary" close :key="i">
                            {{ i+1 }}. {{ searchItem }}
                          </v-chip>
                        </span>
                    </div>
                    <br>

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
                max-width="500px"
                transition="dialog-transition"
              >
                <v-card>
                  <v-card-text>
                    Show dialog:
                    <br>
                    <li style="cursor: pointer" v-if="generalTermsHint.length>0" v-for="(hint, i) in generalTermsHint" :key="i" v-on:click="setInputValueFromHint(hint)" > {{hint.Title}} </li>
                  </v-card-text>
                  <v-card-actions>
                    <div class="flex-grow-1"></div>
                    <v-btn color="green" text @click="alertWarning = false">Disagree</v-btn>
                    <v-btn color="green" text @click="alertWarning = false">Agree</v-btn>
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
                                <progressCircularDonut
                                  :selectedNumber="selectedGtrGenes.length"
                                  :totalNumber="gtrCompleteGeneList.length"
                                >
                                </progressCircularDonut>
                              </v-card>
                              <br>
                              <v-card class="mb-2">
                                <BarChartSingleEntry
                                  v-if="Object.entries(gtrVizData).length !== 0"
                                  idValue="GtrChart"
                                  label="# of Genepanels (Top 5 genes)"
                                  :VizData="gtrVizData">
                                </BarChartSingleEntry>
                              </v-card>
                              <v-btn round small outline color="primary" @click="selectComponent('gtr')"> Change in GTR </v-btn>
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
                                <progressCircularDonut
                                  :selectedNumber="selectedPhenolyzerGenes.length"
                                  :totalNumber="phenolyzerCompleteGeneList.length"
                                >
                                </progressCircularDonut>
                              </v-card>
                              <br>
                              <v-card class="mb-2" v-if="phenolyzerVizData.geneNames.length">
                                <HorizontalBarChartSingleEntry
                                  idValue="phenolyzerChart"
                                  label="Phenolyzer score (Top 5 genes)"
                                  :VizData="phenolyzerVizData">
                                </HorizontalBarChartSingleEntry>
                              </v-card>
                              <v-btn round small outline color="primary" @click="selectComponent('phenolyzer')"> Change in Phenolyzer </v-btn>
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
                                :hide-actions=false
                              >
                                <template v-slot:items="props">
                                  <td>{{ props.item.name }}</td>
                                </template>
                              </v-data-table>
                            </v-card-text>
                          </v-card>

                          <div class="text-md-center">
                            <v-btn round small outline color="primary" @click="selectComponent('summary')"> View all genes in Summary </v-btn>
                          </div>
                        </v-card-text>
                      </v-card>

                        </div>

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
import DiseaseNames from '../../../data/DiseaseNamesCleaned.json'
import progressCircularDonut from '../partials/progressCircularDonut.vue';
import Chart from 'chart.js';
import BarChartSingleEntry from '../viz/BarChartSingleEntry.vue';
import HorizontalBarChartSingleEntry from '../viz/HorizontalBarChartSingleEntry.vue'

var model = new Model();

  export default {
    components: {
      'progressCircularDonut': progressCircularDonut,
      'BarChartSingleEntry': BarChartSingleEntry,
      'HorizontalBarChartSingleEntry': HorizontalBarChartSingleEntry
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
        generalTermsHint: [],
        gtrVizData: {},
        phenolyzerVizData: {},
        expansionpanlExpand: ['true'],
        dropdown_tool: ['All resources', 'GTR', 'Phenolyzer'],
        dropdown_tool_value: 'All resources',
        TotalSummaryGenes: 0,
        TotalSummarySelectedGenes: 0,
        searchComplete: false,
      }
    },
    mounted(){
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
        console.log("searchTermsObj", this.searchTermsObj)
        if(this.gtrFetchCompleted && this.phenolyzerFetchCompleted){
          this.searchTermsObj[this.idx].status = "Completed";
          this.idx = this.idx + 1;
          if(this.idx < this.multipleSearchTerms.length){
            this.performSearchEvent();
          }
          else {
            this.summaryGenes = this.getSummaryGenes.slice(0,15) // Gets data from store
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
        console.log("phenolyzerVizData", this.phenolyzerVizData)
      },
      getSummaryGenes(){
        this.summaryGenes = this.getSummaryGenes.slice(0,15) // Gets data from store
      },
      phenolyzerVizData(){
        console.log("phenolyzerVizData is changing")
      }
    },
    methods:{
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
          }
        }
      },
      setInputValueFromHint(hint){
        this.searchTermsObj[this.idx].DiseaseName = hint.Title;
        this.searchTermsObj[this.idx].ConceptID = hint.ConceptId;
        bus.$emit("singleTermSearchGTR", this.searchTermsObj[this.idx]);
        this.alertWarning = false;
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

#single-entry-input
  width: 600px
  height: 49px
  margin-top: 7px
  // background-color: $search-box-color
  border-bottom-color: #949494
  border-right-color: white
  border-top-color: #e9e9e9
  border-left-color: white


@media screen and (max-width: 1620px)
  #single-entry-input
    width: 420px
    height: 40px
    margin-top: 4px

@media screen and (max-width: 1050px)
  #single-entry-input
    width: 450px
    height: 40px
    margin-top: 4px

@media screen and (max-width: 950px)
  #single-entry-input
    width: 290px
    height: 40px
    margin-top: 4px

@media screen and (max-width: 700px)
  #single-entry-input
    width: 300px
    height: 40px
    margin-top: 4px
    box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)

.v-progress-circular
  margin: 1rem
</style>
