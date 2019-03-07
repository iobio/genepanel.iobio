<template>
  <div>
    <div id="app">
      <v-app id="inspire" style="background-color:#f9fbff">
        <v-container fluid grid-list-md>
          <v-layout row wrap style="margin-top:-20px;">
            <!-- show description -->
            <v-flex xs12 style="margin-bottom:5px">
              <v-card>
                <div v-if="GtrGenesArr.length===0 && PhenolyzerGenesArr.length===0 && manuallyAddedGenes.length===0">
                  <v-card-text>
                      <center><h3>{{ IntroductionTextData.Title }}</h3></center>
                  </v-card-text>
                  <center><v-card-text v-html="IntroductionTextData.Content"></v-card-text></center>
                </div>
                <div v-else-if="GtrGenesArr.length>0 || PhenolyzerGenesArr.length>0 || manuallyAddedGenes.length>0">
                  <v-flex  d-flex xs12 >
                    <v-layout row wrap>
                      <v-flex xs6>
                        <v-card-text>
                          <strong>GTR Conditions:</strong>
                          <br>
                          <div v-if="GtrGenesArr.length===0">
                            <v-chip
                                color="orange"
                                text-color="white"
                                disabled>
                                <v-icon left>error_outline</v-icon>
                                No conditions
                             </v-chip>
                          </div>
                          <!-- outline color="blue-grey darken-3" -->
                          <v-chip v-if="GtrGenesArr.length>0" disabled color="primary" text-color="white" v-for="(searchItem, i) in GtrSearchTerms" :key="i">
                            {{ i+1 }}. {{ searchItem }}
                          </v-chip>
                        </v-card-text>
                      </v-flex>
                      <v-flex>
                        <v-card-text>
                          <strong>Phenolyzer:</strong>
                          <div v-if="PhenolyzerSearchTerms.length>0">
                          <v-chip disabled color="primary" text-color="white" v-for="(searchItem, i) in PhenolyzerSearchTerms" :key="i">
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
                <v-flex xs12 sm12 md8 lg8>
                  <v-card>
                    <SummaryDataTable
                      v-show="GtrGenesArr.length>0 || PhenolyzerGenesArr.length>0 || manuallyAddedGenes.length>0"
                      v-on:TotalSummaryGenes="TotalSummaryGenes($event)"
                      v-on:TotalSummarySelectedGenes="TotalSummarySelectedGenes($event)"
                      v-bind:geneSearch="geneSearch"
                      v-bind:clinGenesSummary="clinGenesSummary"
                      v-bind:launchedFromClin="launchedFromClin"
                      v-bind:summaryTableData="summaryTableArray">
                    </SummaryDataTable>
                  </v-card>
                </v-flex>
                <!-- end data table -->

                <!-- start side bar -->
                <div v-bind:class="[(browser==='Chrome' && isMobile===false) || (browser==='Firefox' && isMobile===false) ? 'flex xs12 sm12 md4 lg4 pr-2 pl-2': 'flex xs12 sm12 md2 lg3 pr-2 pl-2']" >
                  <div class="d-flex mb-2 xs12">
                    <v-card v-if="GtrGenesArr.length>0 || PhenolyzerGenesArr.length>0 ||  manuallyAddedGenes.length>0"">
                      <v-card-title primary-title>
                        <v-text-field
                          append-icon="search"
                          label="Search for Gene"
                          single-line
                          hide-details
                          v-model="geneSearch"
                        ></v-text-field>
                      </v-card-title>
                      <br>
                    </v-card>
                  </div>
                  <div class="d-flex mt-3 mb-2 xs12">
                    <v-card v-bind:class="[chartComponent===null ? 'activeCardBox' : 'rightbarCard']" v-if="GtrGenesArr.length>0 || PhenolyzerGenesArr.length>0">
                      <v-card-text>
                      <center>
                        <span class="Rightbar_CardHeading">
                        GENES SUMMARY
                        </span>
                        <Dialogs
                          id="genesDialog"
                          class="dialogBox"
                          :HeadlineText="HelpDialogsData[5].HeadlineText"
                          :ContentText="HelpDialogsData[5].Content">
                        </Dialogs>
                        <v-divider class="Rightbar_card_divider"></v-divider>


                         <span class="Rightbar_card_content_subheading">
                           <span v-if="!openEditBox"><strong class="Rightbar_card_content_heading">{{ selectedGenes }}</strong></span>
                           <span v-else>
                             <div style="display:inline-block; padding-top:5px;">
                               <input
                                 id="top-genes-summary"
                                 class="form-control"
                                 style="margin-bottom:8px; width:82%"
                                 type="text"
                                 v-model="genesTop"
                                 placeholder="10"
                                 autocomplete="off"
                                 list="genes">
                                 <datalist id="genes">
                                   <option v-for="genesCount in genesTopCounts">
                                     {{ genesCount }}
                                   </option>
                                 </datalist>
                             </div>
                           </span>
                           of {{ totalGenes }} genes selected
                           <v-tooltip bottom v-if="!openEditBox">
                            <v-icon
                              slot="activator"
                              v-on:click="openEditBox=true"
                            >
                              edit
                            </v-icon>
                            <span>Edit the number of genes selected</span>
                          </v-tooltip>
                          <v-tooltip bottom v-else>
                           <v-icon
                             slot="activator"
                             v-on:click="openEditBox=false"
                           >
                             close
                           </v-icon>
                           <span>Close the edit box</span>
                         </v-tooltip>
                         </span>
                       </center>
                       <SvgBar
                       v-if="totalGenes"
                        class="SvgBarClass"
                        id="genesSvgBox"
                        :selectedNumber="selectedGenes"
                        :totalNumber="totalGenes">
                       </SvgBar>
                       <br>
                       <div v-if="GtrGenesArr.length>0 && PhenolyzerGenesArr.length>0">
                         <v-layout row wrap v-for="(item, i) in pieChartdataArr" :key="i">
                           <v-flex xs6>
                             <div class="Rightbar_card_content_subheading" style="margin-left:10px">
                               {{ item.name }}
                             </div>
                           </v-flex>
                           <v-flex xs6>
                             <div>
                               <SummarySvgBar
                               v-if="totalGenes"
                                class="SvgBarClass"
                                id="genesbar"
                                :selectedNumber="item.count"
                                :totalNumber="totalGenes">
                               </SummarySvgBar>
                             </div>
                           </v-flex>
                         </v-layout>
                       </div>
                     </v-card-text>
                    </v-card>
                  </div>
                  <br>
                </div>

                <!-- end side bar -->
              </v-layout>
            </v-flex>

            <!-- end main content -->
          </v-layout>
        </v-container>
        <v-container fluid grid-list-md style="min-height:200px">
        </v-container>

       </v-app>
    </div>
  </div>
</template>

<script>
import SummaryDataTable from './SummaryDataTable.vue';
import { bus } from '../../routes';
import IntroductionText from '../../../data/IntroductionText.json';
import HelpDialogs from '../../../data/HelpDialogs.json';
import Dialogs from '../partials/Dialogs.vue';
import SvgBar from '../viz/SvgBar.vue'
import Alerts from '../partials/Alerts.vue';
import SummarySvgBar from '../viz/SummarySvgBar.vue';
import progressCircularDonut from '../partials/progressCircularDonut.vue';


  export default {
    components: {
      'SummaryDataTable': SummaryDataTable,
      'Dialogs': Dialogs,
      'SvgBar': SvgBar,
      'Alerts': Alerts,
      'SummarySvgBar': SummarySvgBar,
      'progressCircularDonut': progressCircularDonut,
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
      manuallyAddedGenes: {
        type:Array
      },
      chartColor: null,
      isMobile: {
        type: Boolean
      },
      browser: {
        type: String
      },
      clinGenesSummary: {
        type: Array
      },
      launchedFromClin: {
        type: Boolean
      }
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
      AddedGenes: [],
      finalManualGenes: [],
      GtrPhenoAddedGenes: [],
      GtrAndImported: [],
      PhenolyzerAndImported: [],
      GtrPhenoTempAGenes: [],
      GtrFinalGenes: [],
      PhenolyzerFinalGenes: [],
      genesTopCounts: [5, 10, 30, 50],
      genesTop: null,
      openEditBox: false,
    }),
    watch: {
      genesTop: function(){
        this.selectNumberOfSummaryGenes();
      },
      GtrGenesForSummary:function(){
        this.GtrGenes = [];
        this.uniqueGtrData = [];
        this.UniquePhenoData = [];
        this.GtrGenes = this.GtrGenesForSummary;
        this.summaryTableArray=[];
        this.performSetOperations();
      },
      PhenolyzerGenesForSummary: function(){
        console.log("PhenolyzerGenesForSummary", this.PhenolyzerGenesForSummary)
        this.PhenolyzerGenes = [];
        this.UniquePhenoData = [];
        this.uniqueGtrData = [];
        this.PhenolyzerGenes = this.PhenolyzerGenesForSummary;
        this.summaryTableArray=[];
        this.performSetOperations();
      },
      manuallyAddedGenes: function(){
        this.summaryTableArray=[];
        this.uniqueGtrData = [];
        this.UniquePhenoData = [];
        this.GtrGenes = this.GtrGenesForSummary;
        this.PhenolyzerGenes = this.PhenolyzerGenesForSummary;
        this.AddedGenes = this.manuallyAddedGenes;
        this.resetUniqueGtrPhenoData();
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
    updated(){
    },
    mounted(){
      this.HelpDialogsData = HelpDialogs.data;
      this.GtrGenes = this.GtrGenesForSummary;
      this.PhenolyzerGenes = this.PhenolyzerGenesForSummary;
      this.AddedGenes = this.manuallyAddedGenes;
      this.performSetOperations();
      this.GtrSearchTerms = this.searchTermGTR;
      this.PhenolyzerSearchTerms = this.onSearchPhenotype;
      bus.$on("newAnalysis", ()=>{
        this.PhenolyzerSearchTerms = [];
        this.GtrSearchTerms = [];
        this.selected = [];
        this.items = [];
      });
    },
    methods: {
      selectNumberOfSummaryGenes: function(){
        if(this.genesTop>0){
          bus.$emit('SelectedNumberOfSummaryGenes', this.genesTop);
        }
      },
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
                isAssociatedGene: y.isAssociatedGene,
                geneid: y.geneid,
                geneIdLink: y.geneIdLink,
                value: y.value,
                geneRankGtr: y.indexVal
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
                geneId: y.geneId,
                geneIdLink: y.geneIdLink,
                score: y.score,
                geneRankPhenolyzer: y.indexVal,
              })
            }
          })
        })

        this.uniqueGenes = Array.from(new Set(this.AllSourcesGenes));
        this.setSummaryTableData();
      },
      resetUniqueGtrPhenoData(){
        this.uniqueGtrGenes.map(x=>{
          this.GtrGenes.map(y=>{
            if(x===y.name){
              this.uniqueGtrData.push({
                name: y.name,
                sourceGTR: y.searchTermIndexSVG,
                searchTermArrayGTR: y.searchTermArray,
                searchTermIndexGTR: y.searchTermIndex,
                isAssociatedGene: y.isAssociatedGene,
                geneid: y.geneid,
                geneIdLink: y.geneIdLink,
                value: y.value,
                geneRankGtr: y.indexVal
              })
            }
          })
        })

        this.uniquePheno.map(x=>{
          this.PhenolyzerGenes.map(y=>{
            if(x===y.geneName){
              this.UniquePhenoData.push({
                name:y.geneName,
                sourcePheno: y.searchTermIndexSVG,
                searchTermPheno: y.searchTerm,
                searchTermIndex: y.searchTermIndex,
                geneId: y.geneId,
                geneIdLink: y.geneIdLink,
                score: y.score,
                geneRankPhenolyzer: y.indexVal,
              })
            }
          })
        })

        this.setSummaryTableData();
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
                searchTermPheno: this.PhenolyzerGenes[j].searchTerm,
                searchTermIndex: this.PhenolyzerGenes[j].searchTermIndex,
                omimSrc: `https://www.ncbi.nlm.nih.gov/omim/?term=${this.PhenolyzerGenes[j].geneName}`,
                medGenSrc: `https://www.ncbi.nlm.nih.gov/medgen/?term=${this.PhenolyzerGenes[j].geneName}`,
                geneCardsSrc: `https://www.genecards.org/cgi-bin/carddisp.pl?gene=${this.PhenolyzerGenes[j].geneName}`,
                ghrSrc: `https://ghr.nlm.nih.gov/gene/${this.PhenolyzerGenes[j].geneName}`,
                clinGenLink : `https://www.ncbi.nlm.nih.gov/projects/dbvar/clingen/clingen_gene.cgi?sym=${this.PhenolyzerGenes[j].geneName}`,
                geneId: this.PhenolyzerGenes[j].geneId,
                geneIdLink: this.PhenolyzerGenes[j].geneIdLink,
                score: this.PhenolyzerGenes[j].score,
                geneRankPhenolyzer: this.PhenolyzerGenes[j].indexVal,
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
              tempA[i].sourceGTR = this.GtrGenes[j].searchTermIndexSVG,
              tempA[i].isAssociatedGene = this.GtrGenes[j].isAssociatedGene,
              tempA[i].searchTermArrayGTR = this.GtrGenes[j].searchTermArray,
              tempA[i].searchTermIndexGTR = this.GtrGenes[j].searchTermIndex
              tempA[i].value = this.GtrGenes[j].value,
              tempA[i].geneRankGtr = this.GtrGenes[j].indexVal
            }
          }
        }

        var manualGenes = [];
        this.AddedGenes.map(x=>{
          manualGenes.push(x);
        })

        var allSources = [];

        var tempAarr =[];
        tempA.map(x =>{
          tempAarr.push(x.name);
        })

        tempA.map((x,j)=>{
          manualGenes.map((y,i)=>{
            if(x.name === y){
              allSources.push(x);
            }
          })
        })

        var tempAfinal = [];
        tempAfinal = tempA.filter(x=> !manualGenes.includes(x.name));
        manualGenes = manualGenes.filter(x=> !tempAarr.includes(x));


        this.GtrPhenoTempAGenes = tempAfinal;
        this.GtrPhenoAddedGenes = allSources;

        var gtrAndAddedGenes = [];

        this.uniqueGtrData.map((x,j)=>{
          manualGenes.map((y,i)=>{
            if(x.name === y){
              gtrAndAddedGenes.push(x);
            }
          })
        })

        var gtrFinal = [];
        gtrFinal = this.uniqueGtrData.filter(x=> !manualGenes.includes(x.name));
        manualGenes = manualGenes.filter(x=> !this.uniqueGtrGenes.includes(x));
        this.GtrFinalGenes = gtrFinal;
        this.GtrAndImported = gtrAndAddedGenes;

        var phenoAndAddedGenes = [];
          this.UniquePhenoData.map((x,j)=>{
            manualGenes.map((y,i)=>{
              if(x.name === y){
                phenoAndAddedGenes.push(x);
              }
            })
          })

        var phenoFinal = [];
        phenoFinal = this.UniquePhenoData.filter(x=> !manualGenes.includes(x.name));
        manualGenes = manualGenes.filter(x=> !this.uniquePheno.includes(x));

        this.PhenolyzerFinalGenes = phenoFinal;
        this.PhenolyzerAndImported = phenoAndAddedGenes;
        this.finalManualGenes = manualGenes;
        var arr=[];

        arr.push(allSources.map(x=>{
          return {
            name: x.name,
            isGtr: true,
            isPheno: true,
            isImportedGenes: true,
            sources: "GTR, Phenolyzer and Added Genes",
            noOfSources: 3,
            sourceGTR: x.sourceGTR,
            searchTermArrayGTR: x.searchTermArrayGTR,
            searchTermIndexGTR: x.searchTermIndexGTR,
            sourcePheno: x.sourcePheno,
            searchTermPheno: x.searchTermPheno,
            searchTermIndex: x.searchTermIndex,
            isAssociatedGene: x.isAssociatedGene,
            geneIdLink: x.geneIdLink,
            geneId: x.geneId,
            value: x.value,
            score: x.score,
            geneRankGtr: x.geneRankGtr,
            geneRankPhenolyzer: x.geneRankPhenolyzer,
          }
        }))


      arr.push(tempAfinal.map(x=>{ //GTR and Pheno
        return {
          name: x.name,
          isGtr: true,
          isPheno: true,
          isImportedGenes: false,
          sources: "GTR and Phenolyzer",
          noOfSources: 2,
          sourceGTR: x.sourceGTR,
          searchTermArrayGTR: x.searchTermArrayGTR,
          searchTermIndexGTR: x.searchTermIndexGTR,
          sourcePheno: x.sourcePheno,
          searchTermPheno: x.searchTermPheno,
          searchTermIndex: x.searchTermIndex,
          isAssociatedGene: x.isAssociatedGene,
          geneIdLink: x.geneIdLink,
          geneId: x.geneId,
          value: x.value,
          score: x.score,
          geneRankGtr: x.geneRankGtr,
          geneRankPhenolyzer: x.geneRankPhenolyzer,
        }
      }))

      arr.push(gtrAndAddedGenes.map(x=>{ //Gtr and Added
        return {
          name: x.name,
          isGtr: true,
          isPheno: false,
          isImportedGenes: true,
          sources: "GTR and Added Genes",
          noOfSources: 2,
          sourceGTR: x.sourceGTR,
          searchTermArrayGTR: x.searchTermArrayGTR,
          searchTermIndexGTR: x.searchTermIndexGTR,
          sourcePheno: [],
          searchTermPheno: [],
          searchTermIndex: [],
          isAssociatedGene: x.isAssociatedGene,
          geneId: x.geneid,
          geneIdLink: x.geneIdLink,
          value: x.value,
          score: "",
          geneRankGtr: x.geneRankGtr,
          geneRankPhenolyzer: -1,
        }
      }))

      arr.push(phenoAndAddedGenes.map(x=>{ //Phenolyzer and Added
        return {
          name: x.name,
          isGtr: false,
          isPheno: true,
          isImportedGenes: true,
          sources: "Phenolyzer and Added Genes",
          noOfSources: 2,
          sourcePheno: x.sourcePheno,
          searchTermPheno: x.searchTermPheno,
          searchTermIndex: x.searchTermIndex,
          sourceGTR: [],
          searchTermArrayGTR: [],
          searchTermIndexGTR: [],
          geneIdLink: x.geneIdLink,
          geneId: x.geneId,
          score: x.score,
          value: "",
          geneRankPhenolyzer: x.geneRankPhenolyzer,
          geneRankGtr: -1,
        }
      }))

      arr.push(manualGenes.map(x=>{
        return {
          name: x,
          isGtr: false,
          isPheno: false,
          isImportedGenes: true,
          sources: "Added Genes",
          noOfSources: 1,
          sourcePheno: [],
          sourceGTR: [],
          searchTermArrayGTR: [],
          searchTermIndexGTR: [],
          searchTermPheno: [],
          searchTermIndex: [],
          value: "",
          score: "",
          geneRankGtr: -1,
          geneRankPhenolyzer: -1,
        }
      }))

      arr.push(gtrFinal.map(x=>{
        return {
          name: x.name,
          isGtr: true,
          isPheno: false,
          isImportedGenes: false,
          sources: "GTR",
          noOfSources: 1,
          sourceGTR: x.sourceGTR,
          searchTermArrayGTR: x.searchTermArrayGTR,
          searchTermIndexGTR: x.searchTermIndexGTR,
          sourcePheno: [],
          searchTermPheno: [],
          searchTermIndex: [],
          isAssociatedGene: x.isAssociatedGene,
          geneId: x.geneid,
          geneIdLink: x.geneIdLink,
          value: x.value,
          score: "",
          geneRankGtr: x.geneRankGtr,
          geneRankPhenolyzer: -1,
        }
      }))

      arr.push(phenoFinal.map(x=>{
        return {
          name: x.name,
          isGtr: false,
          isPheno: true,
          isImportedGenes: false,
          sources: "Phenolyzer",
          noOfSources: 1,
          searchTermPheno: x.searchTermPheno,
          searchTermIndex: x.searchTermIndex,
          sourcePheno: x.sourcePheno,
          sourceGTR: [],
          searchTermArrayGTR: [],
          searchTermIndexGTR: [],
          geneIdLink: x.geneIdLink,
          geneId: x.geneId,
          score: x.score,
          value: "",
          geneRankGtr: -1,
          geneRankPhenolyzer: x.geneRankPhenolyzer,
        }
      }))

      var tempSummaryTableArray = [];
      tempSummaryTableArray = [...arr[0],...arr[2],...arr[3],...arr[4],...arr[1],...arr[5],...arr[6]];

      tempSummaryTableArray.map((x,i)=>{
        x["indexVal"]=i+1;
        x["omimSrc"]= `https://www.ncbi.nlm.nih.gov/omim/?term=${x.name}`;
        x["medGenSrc"]= `https://www.ncbi.nlm.nih.gov/medgen/?term=${x.name}`;
        x["geneCardsSrc"]= `https://www.genecards.org/cgi-bin/carddisp.pl?gene=${x.name}`;
        x["ghrSrc"] = `https://ghr.nlm.nih.gov/gene/${x.name}`;
        x["clinGenLink"] = `https://www.ncbi.nlm.nih.gov/projects/dbvar/clingen/clingen_gene.cgi?sym=${x.name}`;
        this.summaryTableArray.push(x);
      })
      this.setPieChartData()
      },
      setPieChartData(){
        this.pieChartdataArr = [
          {
            name: "Unique to GTR",
            count: this.GtrFinalGenes.length
          },
          {
            name: "Unique to Phenolyzer",
            count: this.PhenolyzerFinalGenes.length
          },
          {
            name: "Unique Added Genes",
            count: this.finalManualGenes.length
          },
          {
            name: "GTR and Phenolyzer",
            count: this.GtrPhenoTempAGenes.length
          },
          {
            name: "GTR and Added Genes",
            count: this.GtrAndImported.length
          },
          {
            name: "Phenolyzer and Added Genes",
            count: this.PhenolyzerAndImported.length
          },
          {
            name: "All sources",
            count: this.GtrPhenoAddedGenes.length
          }
        ]
      },
    }
  }
</script>

<style lang="sass">
@import ../assets/sass/variables

.activeCardBox
    border-bottom: 6px solid $activeCard-border
.dialogBox
  margin-top: -20px
</style>
