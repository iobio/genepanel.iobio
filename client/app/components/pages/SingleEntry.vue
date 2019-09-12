<template>
  <div>
    <div style="background-color:#f9fbff">
      <v-container fluid grid-list-md>
        <v-layout row wrap style="margin-top:-20px;">
          <v-flex d-flex xs12>
            <v-card>
              <v-card-text>
                <h3>Dashboard</h3>
                <v-layout row wrap>
                  <v-flex xs12 sm12 md12 lg8 xl8>
                    <div id="SingleEntryInput" style="display:inline-block; padding-top:5px;">
                      <label>Enter Clinical Conditions or Phenotypes</label>
                      <input
                        id="single-entry-input"
                        class="form-control"
                        type="text"
                        autocomplete="off"
                        placeholder="Search Clinical Conditions or Phenotypes (E.g. Treacher Collins Syndrome)">
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
                          <span v-else-if="props.item.gtrSearchStatus==='Completed'"><v-icon color="green">done_outline</v-icon></span>
                          <span v-else-if="props.item.gtrSearchStatus==='NoGenes'"><v-icon color="red">error</v-icon></span>
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
                          <span v-else-if="props.item.phenolyzerSearchStatus==='Completed'"><v-icon color="green">done_outline</v-icon></span>
                          <span v-else-if="props.item.phenolyzerSearchStatus==='NoGenes'"><v-icon color="red">error</v-icon></span>
                          <span v-else> <v-icon color="gray lighten-4">error</v-icon> </span>
                        </td>
                      </template>
                    </v-data-table>

                  </v-flex>
                  <v-flex xs12 sm12 md12 lg4 xl4>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>

          </v-flex>
        </v-layout>

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
      </v-container>

      <v-container fluid grid-list-md>
        <v-layout row wrap>
          <v-flex d-flex xs12>
            <!-- <v-card>
              <v-card-text> -->
                <v-layout row wrap>
                  <div class="col-md-12">
                    <!-- <v-card>
                      <v-card-text> -->
                        <div class="col-md-4">
                          <v-card v-if="summaryGenes.length">
                            <v-card-text class="text-md-center">
                              <strong>GTR Genes: </strong>
                              <br>
                              {{selectedGtrGenes.length}} of {{gtrCompleteGeneList.length}} selected
                              <progressCircularDonut
                                :selectedNumber="selectedGtrGenes.length"
                                :totalNumber="gtrCompleteGeneList.length"
                              >
                              </progressCircularDonut>
                              <br>
                              <BarChartSingleEntry
                                v-if="Object.entries(gtrVizData).length !== 0"
                                idValue="GtrChart"
                                label="# of Genepanels (Top 5 genes)"
                                :VizData="gtrVizData">
                              </BarChartSingleEntry>
                              <v-btn round small outline color="primary" @click="selectComponent('gtr')"> Change in GTR </v-btn>
                            </v-card-text>
                          </v-card>
                        </div>
                        <div class="col-md-4">
                          <v-card v-if="summaryGenes.length">
                            <v-card-text class="text-md-center">
                              <strong>Phenolyzer Genes: </strong>
                              <br>
                              {{selectedPhenolyzerGenes.length}} of {{phenolyzerCompleteGeneList.length}} selected
                              <progressCircularDonut
                                :selectedNumber="selectedPhenolyzerGenes.length"
                                :totalNumber="phenolyzerCompleteGeneList.length"
                              >
                              </progressCircularDonut>
                              <v-btn round small outline color="primary" @click="selectComponent('phenolyzer')"> Change in Phenolyzer </v-btn>
                            </v-card-text>
                          </v-card>
                        </div>
                        <div class="col-md-4">
                          <v-card  v-if="summaryGenes.length">
                            <v-card-text>
                              <strong>Summary Genes: </strong>
                              <br>

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
                              <div class="text-md-center">
                                <v-btn round small outline color="primary" @click="selectComponent('summary')"> View all genes in Summary </v-btn>
                              </div>
                            </v-card-text>
                          </v-card>
                        </div>
                      <!-- </v-card-text>
                    </v-card> -->

                  </div>
                </v-layout>
              <!-- </v-card-text>
            </v-card> -->
          </v-flex>
        </v-layout>
      </v-container>
      <v-container fluid grid-list-md style="min-height:800px">
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

var model = new Model();

  export default {
    components: {
      'progressCircularDonut': progressCircularDonut,
      'BarChartSingleEntry': BarChartSingleEntry
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
        searchStatus: false,
        summaryGenesHeader: [
          {text: 'Gene', sortable: false, value: 'name'},
        ],
        alertWarning: false,
        generalTermsHint: [],
        gtrVizData: {},
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
            // console.log("getSummaryGenes in main", this.getSummaryGenes);
            this.summaryGenes = this.getSummaryGenes.slice(0,5) // Gets data from store
          }
        }
      })

      bus.$on("handleGeneralTermsInSingleEntry", (diseases)=>{
        this.alertWarning = true;
        this.generalTermsHint = diseases;
      })


    },
    updated(){
    },
    watch: {
      searchTermsObj(){
      },
      getGtrGenes(){
        this.gtrGenes = this.getGtrGenes.slice(0, 5);
        console.log(this.gtrGenes)
        this.gtrVizData = {};
        var geneNames = [];
        var genepanelCounts = [];
        this.gtrGenes.map(gene => {
          geneNames.push(gene.name);
          genepanelCounts.push(gene.value)
        })
        // this.gtrVizData = {
        //   geneNames,
        //   genepanelCounts
        // }
        this.gtrVizData.geneNames = geneNames;
        this.gtrVizData.genepanelCounts = genepanelCounts;
        console.log("gtrVizData in SingleEntryInput", this.gtrVizData)
      }
    },
    methods:{
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
        this.gtrFetchCompleted = false;
        this.phenolyzerFetchCompleted = false;
        this.$set(this.searchTermsObj[this.idx], 'status', "Searching");
        this.$set(this.searchTermsObj[this.idx], 'gtrSearchStatus', "Searching");
        this.$set(this.searchTermsObj[this.idx], 'phenolyzerSearchStatus', "Searching");
        var str = this.multipleSearchTerms[this.idx].replace("-", " ").replace(/\s\s+/g, ' ').toLowerCase();
        bus.$emit("singleTermSearchGTR", this.searchTermsObj[this.idx]);
        bus.$emit("singleTermSearchPhenolyzer", str);
      },
      addTerm(){
        var searchTerm ="";
        var conceptId = ""
        searchTerm = this.search.DiseaseName;
        conceptId = this.search.ConceptID;
        this.$set(this.search, 'status', "Not started");
        this.$set(this.search, 'gtrSearchStatus', "Not started");
        this.$set(this.search, 'phenolyzerSearchStatus', "Not started");
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
      ...mapGetters(['getSummaryGenes', 'getGtrGenes']),
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
  height: 40px
  margin-top: 4px
  background-color: $search-box-color
  border-color: $search-box-color


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
