<template>
  <div>
    <div id="app">
      <v-app id="inspire" style="background-color:#f9fbff">
        <v-container fluid grid-list-md>
          <v-layout row wrap style="margin-top:-20px;">

            <!-- show description -->
            <v-flex xs12>
              <v-card>
                <div v-if="GtrGenesArr.length===0 && PhenolyzerGenesArr.length===0">
                  <v-card-title>
                      <h3>{{ IntroductionTextData.Title }}</h3>
                  </v-card-title>
                  <v-card-text v-html="IntroductionTextData.Content"></v-card-text>
                </div>
                <div v-else>
                  <v-flex  d-flex xs12 >
                    <v-layout row wrap>
                      <v-flex xs6>
                        <v-card-text>
                          <strong>Disorders:</strong>
                          <br>
                          <div v-if="GtrGenesArr.length===0">
                            <v-chip
                                color="orange"
                                text-color="white"
                                disabled>
                                <v-icon left>error_outline</v-icon>
                                No disorders searched
                             </v-chip>
                          </div>
                          <v-chip disabled outline color="blue-grey darken-3" v-for="(searchItem, i) in GtrSearchTerms" :key="i">
                            {{ i+1 }}. {{ searchItem }}
                          </v-chip>
                          <!-- <div v-if="GtrSearchTerms.length>0">
                          <v-chip disabled outline color="blue-grey darken-3" v-for="(searchItem, i) in GtrSearchTerms" :key="i">
                            {{ i+1 }}. {{ searchItem }}
                          </v-chip>
                        </div>
                        <div v-else>
                          <v-chip
                              color="orange"
                              text-color="white"
                              disabled>
                              <v-icon left>error_outline</v-icon>
                              No disorders searched
                           </v-chip>
                        </div> -->
                        </v-card-text>
                      </v-flex>
                      <v-flex xs6>
                        <v-card-text>
                          <strong>Phenotypes:</strong>
                          <div v-if="PhenolyzerSearchTerms.length>0">
                          <v-chip disabled outline color="blue-grey darken-3" v-for="(searchItem, i) in PhenolyzerSearchTerms" :key="i">
                            {{ i+1 }}. {{ searchItem }}
                          </v-chip>
                        </div>
                        <div v-else>
                          <v-chip
                              color="orange"
                              text-color="white"
                              disabled>
                              <v-icon left>error_outline</v-icon>
                              No phenotypes searched
                           </v-chip>
                        </div>
                        </v-card-text>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </div>
              </v-card>
            </v-flex>
            <!-- End description -->

            <!-- show main content -->
            <v-flex  d-flex xs12 >
              <v-layout row wrap>
                <!-- show data table -->
                <v-flex xs8>
                  <v-card>
                    <SummaryDataTable
                      v-if="GtrGenesArr.length>1 || PhenolyzerGenesArr.length>1"
                      v-on:TotalSummaryGenes="TotalSummaryGenes($event)"
                      v-on:TotalSummarySelectedGenes="TotalSummarySelectedGenes($event)"
                      v-bind:geneSearch="geneSearch"
                      v-bind:summaryTableData="summaryTableArray">
                    </SummaryDataTable>
                  </v-card>
                </v-flex>
                <!-- end data table -->

                <!-- start side bar -->
                <v-flex xs4 class="pr-2 pl-1">

                  <div class="d-flex mb-2 xs12">
                    <v-card v-if="GtrGenesArr.length>1 || PhenolyzerGenesArr.length>1">
                      <v-card-title primary-title>
                        <v-text-field
                          append-icon="search"
                          label="Search Genes"
                          single-line
                          hide-details
                          v-model="geneSearch"
                        ></v-text-field>
                      </v-card-title>
                      <br>
                    </v-card>
                  </div>
                  <br>
                  <div class="d-flex mt-1 mb-2 xs12">
                    <v-card v-bind:class="[chartComponent===null ? 'activeCardBox elevation-4' : 'rightbarCard']" v-if="GtrGenesArr.length>1 || PhenolyzerGenesArr.length>1">
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
                           <strong class="Rightbar_card_content_heading">{{ selectedGenes }}</strong>  of {{ totalGenes }} selected</span>
                       </center>
                       <SvgBar
                        class="SvgBarClass"
                        id="genesSvgBox"
                        :selectedNumber="selectedGenes"
                        :totalNumber="totalGenes">
                       </SvgBar>
                     </v-card-text>
                    </v-card>
                       </div>

                  <br>
                  <div class="d-flex mb-2 xs12">
                    <v-card class="rightbarCard" v-if="GtrGenesArr.length>1 && PhenolyzerGenesArr.length>1">
                      <v-card-text>
                        <center>
                          <span class="Rightbar_CardHeading">
                          GENES SUMMARY
                          </span>
                          <v-divider class="Rightbar_card_divider"></v-divider>
                        </center>
                        <v-layout row wrap v-for="(item, i) in pieChartdataArr" :key="i">
                          <v-flex xs6>
                            <div class="Rightbar_card_content_subheading">
                              {{ item.name }}
                            </div>
                          </v-flex>
                          <v-flex xs6>
                            <div>
                              <SummarySvgBar
                               class="SvgBarClass"
                               id="genesbar"
                               :selectedNumber="item.count"
                               :totalNumber="totalGenes">
                              </SummarySvgBar>
                            </div>
                          </v-flex>
                        </v-layout>
                      </v-card-text>
                    </v-card>
                  </div>
                  <br>
                  <!-- <div class="d-flex mb-2 xs12">
                      <v-card v-if="GtrGenesArr.length>1 && PhenolyzerGenesArr.length>1">
                        <SummaryPieChart
                          v-bind:summaryPieChartData="pieChartdataArr"
                          :color="chartColor">
                        </SummaryPieChart>
                      </v-card>
                  </div> -->

                </v-flex>

                <!-- end side bar -->
              </v-layout>
            </v-flex>

            <!-- end main content -->
          </v-layout>
        </v-container>
       </v-app>
    </div>
  </div>
</template>

<script>
import SummaryPieChart from '../viz/SummaryPieChart.vue';
import SummaryDataTable from './SummaryDataTable.vue';
import { bus } from '../../routes';
import FilterSummary from './FilterSummary.vue';
import IntroductionText from '../../../data/IntroductionText.json';
import HelpDialogs from '../../../data/HelpDialogs.json';
import Dialogs from '../partials/Dialogs.vue';
import SvgBar from '../viz/SvgBar.vue'
import Alerts from '../partials/Alerts.vue';
import SummarySvgBar from '../viz/SummarySvgBar.vue';


  export default {
    components: {
      'SummaryPieChart': SummaryPieChart,
      'SummaryDataTable': SummaryDataTable,
      'FilterSummary': FilterSummary,
      'Dialogs': Dialogs,
      'SvgBar': SvgBar,
      'Alerts': Alerts,
      'SummarySvgBar': SummarySvgBar
    },
    props:{
      NumberOfGtrGenes:{
        type: Number
      },
      NumberOfPhenolyzerGenes:{
        type:Number
      },
      GtrGenesForSummary:{
        type:Array
      },
      PhenolyzerGenesForSummary:{
        type:Array
      },
      searchTermGTR: {
        type:Array
      },
      onSearchPhenotype: {
        type: Array
      },
      chartColor: null
    },
    data: () => ({
      gradient: 'to top, #7B1FA2, #E1BEE7',
      GtrGenesCount: 0,
      phenolyzerGenesCount:0,
      GtrGenes:[],
      PhenolyzerGenes: [],
      GtrGenesArr:[],
      PhenolyzerGenesArr:[],
      AllSourcesGenes:[],
      commonGtrPhenoGenes:[],
      uniqueGtrGenes:[],
      uniqueGtrData: [],
      uniquePhenoGenes:[],
      UniquePhenoData: [],
      pieChartdataArr:[],
      uniqueGenes: [],
      summaryTableArray:[],
      geneSearch: '',
      selectedGenes: 0,
      totalGenes: 0,
      chartComponent: null,
      dialog: false,
      IntroductionTextData: null,
      HelpDialogsData: null,
      GtrSearchTerms: [],
      PhenolyzerSearchTerms: [],
    }),
    watch: {
      GtrGenesForSummary:function(){
        console.log("watch: this.GtrGenesForSummary", this.GtrGenesForSummary, "this.PhenolyzerGenesForSummary" , this.PhenolyzerGenesForSummary);
        this.GtrGenes = [];
        this.uniqueGtrData = [];
        this.UniquePhenoData = [];
        this.GtrGenes = this.GtrGenesForSummary;
        this.summaryTableArray=[];
        this.performSetOperations();
      },
      PhenolyzerGenesForSummary: function(){
        console.log(" watch : this.PhenolyzerGenesForSummary" , this.PhenolyzerGenesForSummary, "this.GtrGenesForSummary", this.GtrGenesForSummary)
        this.PhenolyzerGenes = [];
        this.UniquePhenoData = [];
        this.uniqueGtrData = [];
        this.PhenolyzerGenes = this.PhenolyzerGenesForSummary;
        this.summaryTableArray=[];
        this.performSetOperations();
      },
      searchTermGTR: function(){
        this.GtrSearchTerms = this.searchTermGTR;
      },
      onSearchPhenotype: function(){
        this.PhenolyzerSearchTerms = this.onSearchPhenotype;
      }
    },
    created(){
      this.IntroductionTextData = IntroductionText.data[2];
    },
    mounted(){
      console.log(" mounted :  this.GtrGenesForSummary", this.GtrGenesForSummary, "this.PhenolyzerGenesForSummary", this.PhenolyzerGenesForSummary);
      console.log("GtrSearchTerms", this.onSearchPhenotype)
      this.HelpDialogsData = HelpDialogs.data;
      this.GtrGenes = this.GtrGenesForSummary;
      this.PhenolyzerGenes = this.PhenolyzerGenesForSummary;
      this.performSetOperations();
      this.GtrSearchTerms = this.searchTermGTR;
      this.PhenolyzerSearchTerms = this.onSearchPhenotype;
      bus.$on("newAnalysis", ()=>{
        this.PhenolyzerSearchTerms = [];
        this.GtrSearchTerms = [];
      });
    },
    methods: {
      TotalSummaryGenes: function(e){
        this.totalGenes = e;
      },
      TotalSummarySelectedGenes: function(e){
        this.selectedGenes = e;
      },
      performSetOperations: function(){
        var gtrGenes = this.GtrGenes.map(gene => {
          return gene.name
        })
        this.GtrGenesArr = gtrGenes;

        var phenolyzerGenes = this.PhenolyzerGenes.map(gene => {
          return gene.geneName
        })
        this.PhenolyzerGenesArr = phenolyzerGenes;

        var allGenes = [...gtrGenes, ...phenolyzerGenes];
        this.AllSourcesGenes = allGenes;

        var gtrSet = new Set(this.GtrGenesArr);
        var phenolyzerSet = new Set(this.PhenolyzerGenesArr);
        var intersectGtrPhenolyzer = new Set([...gtrSet].filter(x => phenolyzerSet.has(x)));
        this.commonGtrPhenoGenes = [...intersectGtrPhenolyzer];

        var uniqueGtr = new Set([...gtrSet].filter(x => !phenolyzerSet.has(x)));
        this.uniqueGtrGenes = [...uniqueGtr];

        this.uniqueGtrGenes.map(x=>{
          this.GtrGenes.map(y=>{
            if(x===y.name){
              this.uniqueGtrData.push({
                name: y.name,
                sourceGTR: y.searchTermIndexSVG,
                searchTermArrayGTR: y.searchTermArray,
                searchTermIndexGTR: y.searchTermIndex,
              })
            }
          })
        })

        var uniquePheno = new Set([...phenolyzerSet].filter(x => !gtrSet.has(x)));
        this.uniquePheno = [...uniquePheno];

        this.uniquePheno.map(x=>{
          this.PhenolyzerGenes.map(y=>{
            if(x===y.geneName){
              this.UniquePhenoData.push({
                name:y.geneName,
                sourcePheno: y.searchTermIndexSVG,
                searchTermPheno: y.searchTerm,
                searchTermIndex: y.searchTermIndex,
              })
            }
          })
        })

        this.uniqueGenes = Array.from(new Set(this.AllSourcesGenes));

        this.setPieChartData();
        this.setSummaryTableData();
      },
      setPieChartData(){
        this.pieChartdataArr = [
          {
            name: "Unique to GTR",
            count: this.uniqueGtrGenes.length
          },
          {
            name: "Unique to Phenolyzer",
            count: this.uniquePheno.length
          },
          {
            name: "GTR and Phenolyzer",
            count: this.commonGtrPhenoGenes.length
          },
        ]
      },
      setSummaryTableData(){
        var tempA = [];

        for(var i=0; i<this.commonGtrPhenoGenes.length; i++){
          for(var j=0; j<this.PhenolyzerGenes.length; j++){
            if(this.commonGtrPhenoGenes[i]===this.PhenolyzerGenes[j].geneName){
              tempA.push({
                name:this.PhenolyzerGenes[j].geneName,
                rank: parseInt(this.PhenolyzerGenes[j].rank),
                sourcePheno: this.PhenolyzerGenes[j].searchTermIndexSVG,
                omimSrc: `https://www.ncbi.nlm.nih.gov/omim/?term=${this.PhenolyzerGenes[j].geneName}`,
                medGenSrc: `https://www.ncbi.nlm.nih.gov/medgen/?term=${this.PhenolyzerGenes[j].geneName}`,
                geneCardsSrc: `https://www.genecards.org/cgi-bin/carddisp.pl?gene=${this.PhenolyzerGenes[j].geneName}`,
                ghrSrc: `https://ghr.nlm.nih.gov/gene/${this.PhenolyzerGenes[j].geneName}`,
              })
            }
          }
        }

        tempA.sort(function(a, b){
          return a.rank - b.rank;
        });

        for(var i=0; i<tempA.length; i++){
          for(var j=0; j<this.GtrGenes.length; j++){
            if(tempA[i].name===this.GtrGenes[j].name){
              tempA[i].sourceGTR = this.GtrGenes[j].searchTermIndexSVG
            }
          }
        }


        var arr=[];
        arr.push(tempA.map(x=>{
          return {
            name: x.name,
            isGtr: true,
            isPheno: true,
            sources: "GTR and Phenolyzer",
            noOfSources: 2,
            sourceGTR: x.sourceGTR,
            sourcePheno: x.sourcePheno,
          }
        }))

        arr.push(this.uniqueGtrData.map(x=>{
          return {
            name: x.name,
            isGtr: true,
            isPheno: false,
            sources: "GTR",
            noOfSources: 1,
            sourceGTR: x.sourceGTR,
            sourcePheno: []
          }
        }))


        arr.push(this.UniquePhenoData.map(x=>{
          return {
            name: x.name,
            isGtr: false,
            isPheno: true,
            sources: "Phenolyzer",
            noOfSources: 1,
            sourcePheno: x.sourcePheno,
            sourceGTR: []
          }
        }))

        var tempSummaryTableArray = [];
        // console.log("summaryTableArray", this.summaryTableArray)
        tempSummaryTableArray = [...arr[0],...arr[1],...arr[2]];
        tempSummaryTableArray.map((x,i)=>{
          x["indexVal"]=i+1;
          x["omimSrc"]= `https://www.ncbi.nlm.nih.gov/omim/?term=${x.name}`;
          x["medGenSrc"]= `https://www.ncbi.nlm.nih.gov/medgen/?term=${x.name}`;
          x["geneCardsSrc"]= `https://www.genecards.org/cgi-bin/carddisp.pl?gene=${x.name}`;
          x["ghrSrc"] = `https://ghr.nlm.nih.gov/gene/${x.name}`;
          this.summaryTableArray.push(x);
        })

        console.log(this.summaryTableArray)

      }
    }
  }
</script>

<style lang="sass">
@import ../assets/sass/variables

.activeCardBox
    border-bottom: 6px solid $activeCard-border

</style>
