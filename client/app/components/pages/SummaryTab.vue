<template>
  <div>
    <div id="app">
      <v-app id="inspire" style="background-color:#f9fbff">
        <v-container fluid grid-list-md>
          <v-layout row wrap style="margin-top:-20px;">
            <!-- show description -->
            <v-flex xs12 style="margin-bottom:5px">
              <v-card>
                <div v-if="GtrGenesArr.length===0 && PhenolyzerGenesArr.length===0 && manuallyAddedGenes.length===0 && clinPhenSelectedGenes.length===0">
                  <v-card-text>
                      <center><h3>{{ IntroductionTextData.Title }}</h3></center>
                  </v-card-text>
                  <center><v-card-text v-html="IntroductionTextData.Content"></v-card-text></center>
                </div>
                <div v-else-if="GtrGenesArr.length>0 || PhenolyzerGenesArr.length>0 || manuallyAddedGenes.length>0 || HpoTerms.length>0">
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
                    <v-layout row wrap v-if="HpoTerms.length>0">
                      <v-flex>
                        <v-card-text>
                          <strong>HPO Terms: </strong>
                          <div>
                            <v-chip disabled color="primary" text-color="white" v-for="(searchItem, i) in HpoTerms" :key="i">
                              {{ i+1 }}. {{ searchItem.hpoNumber }}  &nbsp; <i> ({{searchItem.phenotype}}) </i>
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
                      v-show="GtrGenesArr.length>0 || PhenolyzerGenesArr.length>0 || manuallyAddedGenes.length>0 || clinPhenSelectedGenes.length>0"
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
                    <div v-if="GtrGenesArr.length>0 || PhenolyzerGenesArr.length>0 || clinPhenGenesArr.length>0">
                      <v-card>
                        <v-card-text>
                        <center>
                          <span class="Rightbar_CardHeading">
                           SUMMARY
                          </span>
                          <Dialogs
                            id="genesDialog"
                            class="dialogBox"
                            :HeadlineText="HelpDialogsData[5].HeadlineText"
                            :ContentText="HelpDialogsData[5].Content">
                          </Dialogs>
                        </center>
                        </v-card-text>
                      </v-card>
                      <GenesSelection
                        :items="totalGenes"
                        :selected="selectedGenes"
                        :multipleSearchTerms="['Summary data']"
                        v-on:selectNgenes="selectNgenes($event)"
                      >
                      </GenesSelection>
                    </div>

                    <!--
                    <v-card v-bind:class="[chartComponent===null ? 'activeCardBox' : 'rightbarCard']" v-if="GtrGenesArr.length>0 || PhenolyzerGenesArr.length>0 || clinPhenGenesArr.length>0">
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
                          <v-tooltip bottom v-if="openEditBox">
                           <v-icon
                             slot="activator"
                             v-on:click="openEditBox=false"
                           >
                             close
                           </v-icon>
                           <span>Close the edit box</span>
                         </v-tooltip>
                         </span>
                         <br>
                         <a v-on:click="openEditBox=true" v-if="!openEditBox"> <i><v-icon style="color:#4267b2">edit</v-icon> Edit the number of genes selected </i></a>
                         <br><br>
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
                    </v-card> -->
                  </div>

                  <div class="d-flex mb-2 xs12"
                    v-show="(GtrGenesArr.length>0 && PhenolyzerGenesArr.length>0) ||
                          (GtrGenesArr.length>0 && clinPhenSelectedGenes.length>0) ||
                          (PhenolyzerGenesArr.length>0 && clinPhenSelectedGenes.length>0) ||
                          (GtrGenesArr.length>0 && PhenolyzerGenesArr.length>0 && clinPhenSelectedGenes.length>0)">
                    <v-card>
                      <div id="venn"></div>
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
import GenesSelection from '../partials/GenesSelection.vue';


  export default {
    components: {
      'SummaryDataTable': SummaryDataTable,
      'Dialogs': Dialogs,
      'SvgBar': SvgBar,
      'Alerts': Alerts,
      'SummarySvgBar': SummarySvgBar,
      'progressCircularDonut': progressCircularDonut,
      'GenesSelection': GenesSelection,
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
      },
      clinPhenSelectedGenes: {
        type: Array
      },
      hpoClinPhenTerms: {
        type: Array
      },
      gtrCompleteGeneList: {
        type: Array
      },
      phenolyzerCompleteGeneList: {
        type: Array
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
      clinPhenGenesArr: [],
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
      vennData: {},
      HpoTerms: [],
      resourcesUsed: {},
      gtrFullGeneList:[],
      summaryTableArrayFullList: [],
      GtrGenesArrFullList: [],
      PhenolyzerFullGeneList: [],
      PhenolyzerGenesArrFullList: [],
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
        // this.resetUniqueGtrPhenoData();
        this.performSetOperations();
      },
      clinPhenSelectedGenes: function(){
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
      },
      hpoClinPhenTerms: function(){
        this.HpoTerms = this.hpoClinPhenTerms;
      },
      gtrCompleteGeneList: function(){
        this.gtrFullGeneList = [];
        this.summaryTableArrayFullList = [];
        this.gtrFullGeneList = this.gtrCompleteGeneList;
        this.performSetOperationsFullList();
      },
      phenolyzerCompleteGeneList: function(){
        this.PhenolyzerFullGeneList = [];
        this.summaryTableArrayFullList = [];
        this.PhenolyzerFullGeneList = this.phenolyzerCompleteGeneList;
        this.performSetOperationsFullList();
      },
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
      this.HpoTerms = this.hpoClinPhenTerms;
      bus.$on("newAnalysis", ()=>{
        this.PhenolyzerSearchTerms = [];
        this.GtrSearchTerms = [];
        this.selected = [];
        this.items = [];
        this.HpoTerms = [];
        this.geneSearch = '';
      });
    },
    methods: {
      selectNgenes: function(data){
        this.genesTop = data;
      },
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
        //Create an array of GTR Gene Names
        var gtrGenes = this.GtrGenes.map(gene => {
          return gene.name
        })
        this.GtrGenesArr = gtrGenes;

        //Create an array of Phenolyzer Gene Names
        var phenolyzerGenes = this.PhenolyzerGenes.map(gene => {
          return gene.geneName
        })
        this.PhenolyzerGenesArr = phenolyzerGenes;

        //Create an array of ClinPhen Gene Names
        var clinPhenGenes = this.clinPhenSelectedGenes.map(x=>{
          return x.gene;
        })
        this.clinPhenGenesArr = clinPhenGenes;

        //Create an array for added geneSearch
        var manualGenes = [];
        this.AddedGenes.map(x=>{
          manualGenes.push(x);
        })

        //Create an array of genes from all sources
        var allGenes = [...manualGenes, ...gtrGenes, ...clinPhenGenes, ...phenolyzerGenes];

        //Get only unique genes from all allSources
        var uniqueGenes= [...new Set(allGenes)];

        var summaryGenes = [];

        //Check if the gene is in addedGenes
        uniqueGenes.map((x,i)=>{
          if(manualGenes.includes(x)){
            summaryGenes.push({
              name: x,
              isImportedGenes: true,
              noOfSources: 1,
              sources: ['ImportedGenes']
            })
          }
          else{
            summaryGenes.push({
              name: x,
              isImportedGenes: false,
              noOfSources: 0,
              sources: []
            })
          }
        })


        //Check if the gene is in GTR
        uniqueGenes.map((x,i)=>{
          if(gtrGenes.includes(x)){
            var idx = gtrGenes.indexOf(x);
            summaryGenes[i].isGtr = true;
            summaryGenes[i].value = this.GtrGenes[idx].value;
            summaryGenes[i].noOfSources++;
            summaryGenes[i].sources.push("GTR");
            summaryGenes[i].searchTermArrayGTR =  this.GtrGenes[idx].searchTermArray; //["Treacher Collins syndrome"]
            summaryGenes[i].searchTermIndexGTR =  this.GtrGenes[idx].searchTermIndex; //[1]
            summaryGenes[i].isAssociatedGene   =  this.GtrGenes[idx].isAssociatedGene;
            summaryGenes[i].sourceGTR =  this.GtrGenes[idx].searchTermIndexSVG; // ["<svg height=\"30\" width=\"30\">\n..."]
            summaryGenes[i].geneId =  this.GtrGenes[idx].geneid;
            summaryGenes[i].omimSrc =  this.GtrGenes[idx].omimSrc;
            summaryGenes[i].medGenSrc =  this.GtrGenes[idx].medGenSrc;
            summaryGenes[i].geneCardsSrc =  this.GtrGenes[idx].geneCardsSrc;
            summaryGenes[i].ghrSrc =  this.GtrGenes[idx].ghrSrc;
            summaryGenes[i].clinGenLink =  this.GtrGenes[idx].clinGenLink;
            summaryGenes[i].geneIdLink =  this.GtrGenes[idx].geneIdLink;
            summaryGenes[i].geneRankGtr = this.GtrGenes[idx].indexVal;
          }
          else {
            summaryGenes[i].isGtr = false;
            summaryGenes[i].value = "";
            summaryGenes[i].searchTermArrayGTR =  [];
            summaryGenes[i].searchTermIndexGTR =  [];
            summaryGenes[i].isAssociatedGene   =  false;
            summaryGenes[i].geneId =  "";
            summaryGenes[i].sourceGTR =  [];
            summaryGenes[i].omimSrc =  "";
            summaryGenes[i].medGenSrc =  "";
            summaryGenes[i].geneCardsSrc =  "";
            summaryGenes[i].ghrSrc =  "";
            summaryGenes[i].clinGenLink =  "";
            summaryGenes[i].geneIdLink =  "";
            summaryGenes[i].geneRankGtr = -1;
          }
        })

        //Check if the gene is in Phenolyzer
        uniqueGenes.map((x,i)=>{
          if(phenolyzerGenes.includes(x)){
            var idx = phenolyzerGenes.indexOf(x);
            summaryGenes[i].isPheno = true;
            summaryGenes[i].noOfSources++;
            summaryGenes[i].sources.push("Pheno");
            // summaryGenes[i].geneId =  this.PhenolyzerGenes[idx].geneid;
            summaryGenes[i].geneId =  summaryGenes[i].geneId === "" ? this.PhenolyzerGenes[idx].geneId : summaryGenes[i].geneId;
            summaryGenes[i].score =  this.PhenolyzerGenes[idx].score;
            summaryGenes[i].searchTermPheno =  this.PhenolyzerGenes[idx].searchTerm;
            summaryGenes[i].searchTermIndex =  this.PhenolyzerGenes[idx].searchTermIndex;
            summaryGenes[i].sourcePheno =  this.PhenolyzerGenes[idx].searchTermIndexSVG;
            summaryGenes[i].omimSrc =  this.PhenolyzerGenes[idx].omimSrc;
            summaryGenes[i].medGenSrc =  this.PhenolyzerGenes[idx].medGenSrc;
            summaryGenes[i].geneCardsSrc =  this.PhenolyzerGenes[idx].geneCardsSrc;
            summaryGenes[i].ghrSrc =  this.PhenolyzerGenes[idx].ghrSrc;
            summaryGenes[i].clinGenLink =  this.PhenolyzerGenes[idx].clinGenLink;
            summaryGenes[i].geneIdLink =  this.PhenolyzerGenes[idx].geneIdLink;
            summaryGenes[i].geneRankPhenolyzer = this.PhenolyzerGenes[idx].indexVal;
          }
          else {
            summaryGenes[i].isPheno = false;
            summaryGenes[i].score =  "";
            summaryGenes[i].searchTermPheno =  [];
            summaryGenes[i].searchTermIndex =  [];
            summaryGenes[i].sourcePheno =  [];
            summaryGenes[i].geneRankPhenolyzer = -1;
          }
        })
        //Check if the gene is in HPO
        uniqueGenes.map((x,i)=>{
          if(clinPhenGenes.includes(x)){
            var idx = clinPhenGenes.indexOf(x);
            summaryGenes[i].isClinPhen = true;
            summaryGenes[i].noOfSources++;
            summaryGenes[i].sources.push("ClinPhen");
            summaryGenes[i].hpoTerm = this.clinPhenSelectedGenes[idx].hpoTerm;
            summaryGenes[i].searchTermIndexHpo = this.clinPhenSelectedGenes[idx].searchTermIndex;
            summaryGenes[i].sourceHPO = this.clinPhenSelectedGenes[idx].searchTermIndexSVG;
          }
          else {
            summaryGenes[i].isClinPhen = false;
            summaryGenes[i].hpoTerm = [];
            summaryGenes[i].searchTermIndexHpo = [];
            summaryGenes[i].sourceHPO = [];
          }
        })

        this.createSummaryTableData(summaryGenes);
      },
      sortGenes(genes, criteria){
        if(criteria==="phenolyzer_score"){
          genes.sort(function(a,b){
            if (a.score===b.score){
               return (b.score-a.score);
            } else if(a.score<b.score){
               return 1;
            } else if(a.score>b.score){
               return -1;
            }
           })
        }
        else if(criteria==="gtr_value"){
          genes.sort(function(a,b){
            if (a.value===b.value){
               return (b.value.value);
            } else if(a.value<b.value){
               return 1;
            } else if(a.value>b.value){
               return -1;
            }
           })
        }
        return genes;
      },
      createSummaryTableData(summaryGenes){
        var allSourcesGenes = [];
        var threeSourcesGenes = [];
        var twoSourcesGenes = [];
        var uniquePheno = [];
        var uniqueGTR =[];
        var uniqueClinPhen = [];
        var uniqueAddedGenes = [];
        var gtrPhenoGenes = [];
        var gtrAddedGenes = [];
        var gtrClinPhenGenes = [];
        var phenoAddedGenes = [];
        var phenoClinPhenGenes = [];
        var AddedClinPhenGenes = [];
        var GtrPhenoAdded = [];
        var GtrPhenoClinPhenGenes = [];
        var GtrAddedClinPhenGenes = [];
        var PhenoAddedClinPhenGenes = [];
        var summaryObj = {
          gtr: {
            count: 0
          },
          phenolyzer: {
            count: 0
          },
          ImportedGenes: {
            count: 0
          },
          ClinPhen: {
            count: 0
          },
          gtr_phenolyzer: {
            count: 0
          },
          gtr_ImportedGenes: {
            count: 0
          },
          gtr_ClinPhen: {
            count: 0
          },
          phenolyzer_ImportedGenes: {
            count: 0
          },
          phenolyzer_ClinPhen: {
            count: 0
          },
          ImportedGenes_ClinPhen: {
            count: 0
          },
          gtr_phenolyzer_ImportedGenes: {
            count: 0
          },
          gtr_phenolyzer_ClinPhen: {
            count: 0
          },
          gtr_ImportedGenes_ClinPhen: {
            count: 0
          },
          phenolyzer_ImportedGenes_ClinPhen: {
            count: 0
          },
          gtr_phenolyzer_ImportedGenes_ClinPhen: {
            count: 0
          }
        }
        for(var i=0; i<summaryGenes.length; i++){
          if(summaryGenes[i].sources.length===4){
            allSourcesGenes.push(summaryGenes[i]);
            summaryObj.gtr_phenolyzer_ImportedGenes_ClinPhen.count++;
            summaryObj.gtr.count++;
            summaryObj.phenolyzer.count++;
            summaryObj.ImportedGenes.count++;
            summaryObj.ClinPhen.count++;
            summaryObj.gtr_phenolyzer_ImportedGenes.count++;
            summaryObj.gtr_phenolyzer_ClinPhen.count++;
            summaryObj.gtr_ImportedGenes_ClinPhen.count++;
            summaryObj.phenolyzer_ImportedGenes_ClinPhen.count++;
            summaryObj.gtr_phenolyzer.count++;
            summaryObj.gtr_ImportedGenes.count++;
            summaryObj.gtr_ClinPhen.count++;
            summaryObj.phenolyzer_ImportedGenes.count++;
            summaryObj.phenolyzer_ClinPhen.count++;
            summaryObj.ImportedGenes_ClinPhen.count++;
            summaryGenes.splice(i, 1);
                i--;
          }
          else if(summaryGenes[i].sources.length===3){
            threeSourcesGenes.push(summaryGenes[i]);
            if(!summaryGenes[i].sources.includes("ClinPhen")){
              GtrPhenoAdded.push(summaryGenes[i])
              summaryObj.gtr_phenolyzer_ImportedGenes.count++;
              summaryObj.phenolyzer.count++;
              summaryObj.gtr.count++;
              summaryObj.ImportedGenes.count++;
              summaryObj.phenolyzer_ImportedGenes.count++;
              summaryObj.gtr_ImportedGenes.count++;
              summaryObj.gtr_phenolyzer.count++;
            }
            else if(!summaryGenes[i].sources.includes("ImportedGenes")){
              GtrPhenoClinPhenGenes.push(summaryGenes[i])
              summaryObj.gtr_phenolyzer_ClinPhen.count++;
              summaryObj.phenolyzer.count++;
              summaryObj.gtr.count++;
              summaryObj.ClinPhen.count++;
              summaryObj.phenolyzer_ClinPhen.count++;
              summaryObj.gtr_ClinPhen.count++;
              summaryObj.gtr_phenolyzer.count++;
            }
            else if(!summaryGenes[i].sources.includes("Pheno")){
              GtrAddedClinPhenGenes.push(summaryGenes[i]);
              summaryObj.gtr_ImportedGenes_ClinPhen.count++;
              summaryObj.gtr.count++;
              summaryObj.ImportedGenes.count++;
              summaryObj.ClinPhen.count++;
              summaryObj.gtr_ClinPhen.count++;
              summaryObj.gtr_ImportedGenes.count++;
              summaryObj.ImportedGenes_ClinPhen.count++;
            }
            else if(!summaryGenes[i].sources.includes("GTR")){
              PhenoAddedClinPhenGenes.push(summaryGenes[i]);
              summaryObj.phenolyzer_ImportedGenes_ClinPhen.count++;
              summaryObj.phenolyzer.count++;
              summaryObj.ImportedGenes.count++;
              summaryObj.ClinPhen.count++;
              summaryObj.ImportedGenes_ClinPhen.count++;
              summaryObj.phenolyzer_ImportedGenes.count++;
              summaryObj.phenolyzer_ClinPhen.count++;
            }
            summaryGenes.splice(i, 1);
                i--;
          }
          else if(summaryGenes[i].sources.length===2){
            twoSourcesGenes.push(summaryGenes[i]);
            if(summaryGenes[i].sources.includes("GTR") && summaryGenes[i].sources.includes("Pheno")){
              gtrPhenoGenes.push(summaryGenes[i]);
              summaryObj.gtr_phenolyzer.count++;
              summaryObj.gtr.count++;
              summaryObj.phenolyzer.count++;
            }
            else if(summaryGenes[i].sources.includes("GTR") && summaryGenes[i].sources.includes("ImportedGenes")){
              gtrAddedGenes.push(summaryGenes[i])
              summaryObj.gtr_ImportedGenes.count++;
              summaryObj.ImportedGenes.count++;
              summaryObj.gtr.count++;
            }
            else if(summaryGenes[i].sources.includes("GTR") && summaryGenes[i].sources.includes("ClinPhen")){
              gtrClinPhenGenes.push(summaryGenes[i])
              summaryObj.gtr_ClinPhen.count++;
              summaryObj.gtr.count++;
              summaryObj.ClinPhen.count++;
            }
            else if(summaryGenes[i].sources.includes("Pheno") && summaryGenes[i].sources.includes("ImportedGenes")){
              phenoAddedGenes.push(summaryGenes[i])
              summaryObj.phenolyzer_ImportedGenes.count++;
              summaryObj.ImportedGenes.count++;
              summaryObj.phenolyzer.count++;
            }
            else if(summaryGenes[i].sources.includes("Pheno") && summaryGenes[i].sources.includes("ClinPhen")){
              phenoClinPhenGenes.push(summaryGenes[i])
              summaryObj.phenolyzer_ClinPhen.count++;
              summaryObj.phenolyzer.count++;
              summaryObj.ClinPhen.count++;
            }
            else if(summaryGenes[i].sources.includes("ImportedGenes") && summaryGenes[i].sources.includes("ClinPhen")){
              AddedClinPhenGenes.push(summaryGenes[i])
              summaryObj.ImportedGenes_ClinPhen.count++;
              summaryObj.ImportedGenes.count++;
              summaryObj.ClinPhen.count++;
            }
            summaryGenes.splice(i, 1);
                i--;
          }
          else if(summaryGenes[i].sources.length===1 && summaryGenes[i].sources[0]==="ImportedGenes"){
            uniqueAddedGenes.push(summaryGenes[i]);
            summaryObj.ImportedGenes.count++;
            summaryGenes.splice(i, 1);
                i--;
          }
          else if(summaryGenes[i].sources.length===1 && summaryGenes[i].sources[0]==="GTR"){
            uniqueGTR.push(summaryGenes[i]);
            summaryObj.gtr.count++;
            summaryGenes.splice(i, 1);
                i--;
          }
          else if(summaryGenes[i].sources.length===1 && summaryGenes[i].sources[0]==="ClinPhen"){
            uniqueClinPhen.push(summaryGenes[i]);
            summaryObj.ClinPhen.count++;
            summaryGenes.splice(i, 1);
                i--;
          }
          else if(summaryGenes[i].sources.length===1 && summaryGenes[i].sources[0]==="Pheno"){
            uniquePheno.push(summaryGenes[i]);
            summaryObj.phenolyzer.count++;
            summaryGenes.splice(i, 1);
                i--;
          }
        }
        // var tableGenes = [...allSourcesGenes, ...threeSourcesGenes, ...twoSourcesGenes, ...uniqueAddedGenes, ...uniqueGTR, ...uniqueClinPhen, ...uniquePheno];
        var tableGenes = [
          ...this.sortGenes(allSourcesGenes,"phenolyzer_score"),
          ...this.sortGenes(GtrPhenoAdded,"phenolyzer_score"), ...this.sortGenes(GtrAddedClinPhenGenes,"gtr_value"), ...this.sortGenes(PhenoAddedClinPhenGenes, "phenolyzer_score"),
          ...this.sortGenes(gtrAddedGenes,"gtr_value"), ...this.sortGenes(phenoAddedGenes,"phenolyzer_score"), ...AddedClinPhenGenes,
          ...uniqueAddedGenes,...this.sortGenes(GtrPhenoClinPhenGenes, "phenolyzer_score"),
          ...this.sortGenes(gtrPhenoGenes, "phenolyzer_score"), ...gtrClinPhenGenes,
          ...this.sortGenes(phenoClinPhenGenes, "phenolyzer_score"),
          ...uniqueGTR, ...uniqueClinPhen, ...uniquePheno
        ]
        this.summaryTableArray = tableGenes;
        this.generateVennDiagramData(summaryObj);
        this.pieChartdataArr = [
          {
            name: "Unique to GTR",
            count: uniqueGTR.length
          },
          {
            name: "Unique to Phenolyzer",
            count: uniquePheno.length
          },
          {
            name: "Unique Added Genes",
            count: uniqueAddedGenes.length
          },
          {
            name: "GTR and Phenolyzer",
            count: gtrPhenoGenes.length
          },
          {
            name: "GTR and Added Genes",
            count: gtrAddedGenes.length
          },
          {
            name: "Phenolyzer and Added Genes",
            count: phenoAddedGenes.length
          },
          {
            name: "All sources",
            count: GtrPhenoAdded.length
          }
        ]

      },
      generateVennDiagramData(summaryObj){
        this.vennData = {
          "data": [
            {"sets" : [0], "label" : "GTR", "size" : summaryObj.gtr.count},
            {"sets" : [1], "label" : "Phenolyzer", "size": summaryObj.phenolyzer.count},
            {"sets" : [2], "label" : "Added", "size" : summaryObj.ImportedGenes.count},
            {"sets" : [3], "label" : "HPO", "size":summaryObj.ClinPhen.count},
            {"sets" : [0,1], "size":summaryObj.gtr_phenolyzer.count},
            {"sets" : [0,2], "size":summaryObj.gtr_ImportedGenes.count},
            {"sets" : [0,3],  "size":summaryObj.gtr_ClinPhen.count},
            {"sets" : [1,2],  "size":summaryObj.phenolyzer_ImportedGenes.count},
            {"sets" : [1,3],  "size":summaryObj.phenolyzer_ClinPhen.count},
            {"sets" : [2,3],  "size":summaryObj.ImportedGenes_ClinPhen.count},
            {"sets" : [0,2,3], "size":summaryObj.gtr_ImportedGenes_ClinPhen.count},
            {"sets" : [0,1,2],  "size":summaryObj.gtr_phenolyzer_ImportedGenes.count},
            {"sets" : [0,1,3],  "size":summaryObj.gtr_phenolyzer_ClinPhen.count},
            {"sets" : [1,2,3],  "size":summaryObj.phenolyzer_ImportedGenes_ClinPhen.count},
            {"sets" : [0,1,2,3],  "size":summaryObj.gtr_phenolyzer_ImportedGenes_ClinPhen.count}
          ]
        }

        if((this.GtrGenesArr.length>0 && this.PhenolyzerGenesArr.length>0) ||
              (this.GtrGenesArr.length>0 && this.clinPhenSelectedGenes.length>0) ||
              (this.PhenolyzerGenesArr.length>0 && this.clinPhenSelectedGenes.length>0) ||
              (this.GtrGenesArr.length>0 && this.PhenolyzerGenesArr.length>0 && this.clinPhenSelectedGenes.length>0)){
          this.drawVennDiagram();
        }
        else {
          d3.select("#venn").select("svg").remove();
        }
      },
      performSetOperationsFullList: function(){
        //Create an array of GTR Gene Names
        var gtrGenes = this.gtrFullGeneList.map(gene => {
          return gene.name
        })
        this.GtrGenesArrFullList = gtrGenes;

        //Create an array of Phenolyzer Gene Names
        var phenolyzerGenes = this.PhenolyzerFullGeneList.map(gene => {
          return gene.geneName
        })
        this.PhenolyzerGenesArrFullList = phenolyzerGenes;

        //Create an array of ClinPhen Gene Names
        var clinPhenGenes = this.clinPhenSelectedGenes.map(x=>{
          return x.gene;
        })
        this.clinPhenGenesArr = clinPhenGenes;

        //Create an array for added geneSearch
        var manualGenes = [];
        this.AddedGenes.map(x=>{
          manualGenes.push(x);
        })

        //Create an array of genes from all sources
        var allGenes = [...manualGenes, ...gtrGenes, ...clinPhenGenes, ...phenolyzerGenes];

        //Get only unique genes from all allSources
        var uniqueGenes= [...new Set(allGenes)];

        var summaryGenes = [];

        //Check if the gene is in addedGenes
        uniqueGenes.map((x,i)=>{
          if(manualGenes.includes(x)){
            summaryGenes.push({
              name: x,
              isImportedGenes: true,
              noOfSources: 1,
              sources: ['ImportedGenes']
            })
          }
          else{
            summaryGenes.push({
              name: x,
              isImportedGenes: false,
              noOfSources: 0,
              sources: []
            })
          }
        })


        //Check if the gene is in GTR
        uniqueGenes.map((x,i)=>{
          if(gtrGenes.includes(x)){
            var idx = gtrGenes.indexOf(x);
            summaryGenes[i].isGtr = true;
            summaryGenes[i].value = this.gtrFullGeneList[idx].value;
            summaryGenes[i].noOfSources++;
            summaryGenes[i].sources.push("GTR");
            summaryGenes[i].searchTermArrayGTR =  this.gtrFullGeneList[idx].searchTermArray; //["Treacher Collins syndrome"]
            summaryGenes[i].searchTermIndexGTR =  this.gtrFullGeneList[idx].searchTermIndex; //[1]
            summaryGenes[i].isAssociatedGene   =  this.gtrFullGeneList[idx].isAssociatedGene;
            summaryGenes[i].sourceGTR =  this.gtrFullGeneList[idx].searchTermIndexSVG; // ["<svg height=\"30\" width=\"30\">\n..."]
            summaryGenes[i].geneId =  this.gtrFullGeneList[idx].geneid;
            summaryGenes[i].omimSrc =  this.gtrFullGeneList[idx].omimSrc;
            summaryGenes[i].medGenSrc =  this.gtrFullGeneList[idx].medGenSrc;
            summaryGenes[i].geneCardsSrc =  this.gtrFullGeneList[idx].geneCardsSrc;
            summaryGenes[i].ghrSrc =  this.gtrFullGeneList[idx].ghrSrc;
            summaryGenes[i].clinGenLink =  this.gtrFullGeneList[idx].clinGenLink;
            summaryGenes[i].geneIdLink =  this.gtrFullGeneList[idx].geneIdLink;
            summaryGenes[i].geneRankGtr = this.gtrFullGeneList[idx].indexVal;
          }
          else {
            summaryGenes[i].isGtr = false;
            summaryGenes[i].value = "";
            summaryGenes[i].searchTermArrayGTR =  [];
            summaryGenes[i].searchTermIndexGTR =  [];
            summaryGenes[i].isAssociatedGene   =  false;
            summaryGenes[i].geneId =  "";
            summaryGenes[i].sourceGTR =  [];
            summaryGenes[i].omimSrc =  "";
            summaryGenes[i].medGenSrc =  "";
            summaryGenes[i].geneCardsSrc =  "";
            summaryGenes[i].ghrSrc =  "";
            summaryGenes[i].clinGenLink =  "";
            summaryGenes[i].geneIdLink =  "";
            summaryGenes[i].geneRankGtr = -1;
          }
        })

        //Check if the gene is in Phenolyzer
        uniqueGenes.map((x,i)=>{
          if(phenolyzerGenes.includes(x)){
            var idx = phenolyzerGenes.indexOf(x);
            summaryGenes[i].isPheno = true;
            summaryGenes[i].noOfSources++;
            summaryGenes[i].sources.push("Pheno");
            // summaryGenes[i].geneId =  this.PhenolyzerFullGeneList[idx].geneId;
            summaryGenes[i].geneId =  summaryGenes[i].geneId === "" ? this.PhenolyzerFullGeneList[idx].geneId : summaryGenes[i].geneId;
            summaryGenes[i].score =  this.PhenolyzerFullGeneList[idx].score;
            summaryGenes[i].searchTermPheno =  this.PhenolyzerFullGeneList[idx].searchTerm;
            summaryGenes[i].searchTermIndex =  this.PhenolyzerFullGeneList[idx].searchTermIndex;
            summaryGenes[i].sourcePheno =  this.PhenolyzerFullGeneList[idx].searchTermIndexSVG;
            summaryGenes[i].omimSrc =  this.PhenolyzerFullGeneList[idx].omimSrc;
            summaryGenes[i].medGenSrc =  this.PhenolyzerFullGeneList[idx].medGenSrc;
            summaryGenes[i].geneCardsSrc =  this.PhenolyzerFullGeneList[idx].geneCardsSrc;
            summaryGenes[i].ghrSrc =  this.PhenolyzerFullGeneList[idx].ghrSrc;
            summaryGenes[i].clinGenLink =  this.PhenolyzerFullGeneList[idx].clinGenLink;
            summaryGenes[i].geneIdLink =  this.PhenolyzerFullGeneList[idx].geneIdLink;
            summaryGenes[i].geneRankPhenolyzer = this.PhenolyzerFullGeneList[idx].indexVal;
          }
          else {
            summaryGenes[i].isPheno = false;
            summaryGenes[i].score =  "";
            summaryGenes[i].searchTermPheno =  [];
            summaryGenes[i].searchTermIndex =  [];
            summaryGenes[i].sourcePheno =  [];
            summaryGenes[i].geneRankPhenolyzer = -1;
          }
        })
        //Check if the gene is in HPO
        uniqueGenes.map((x,i)=>{
          if(clinPhenGenes.includes(x)){
            var idx = clinPhenGenes.indexOf(x);
            summaryGenes[i].isClinPhen = true;
            summaryGenes[i].noOfSources++;
            summaryGenes[i].sources.push("ClinPhen");
            summaryGenes[i].hpoTerm = this.clinPhenSelectedGenes[idx].hpoTerm;
            summaryGenes[i].searchTermIndexHpo = this.clinPhenSelectedGenes[idx].searchTermIndex;
            summaryGenes[i].sourceHPO = this.clinPhenSelectedGenes[idx].searchTermIndexSVG;
          }
          else {
            summaryGenes[i].isClinPhen = false;
            summaryGenes[i].hpoTerm = [];
            summaryGenes[i].searchTermIndexHpo = [];
            summaryGenes[i].sourceHPO = [];
          }
        })

        this.createSummaryTableDataFullList(summaryGenes);
      },
      createSummaryTableDataFullList(summaryGenes){
        var allSourcesGenes = [];
        var threeSourcesGenes = [];
        var twoSourcesGenes = [];
        var uniquePheno = [];
        var uniqueGTR =[];
        var uniqueClinPhen = [];
        var uniqueAddedGenes = [];
        var summaryObj = {
          gtr: {
            count: 0
          },
          phenolyzer: {
            count: 0
          },
          ImportedGenes: {
            count: 0
          },
          ClinPhen: {
            count: 0
          },
          gtr_phenolyzer: {
            count: 0
          },
          gtr_ImportedGenes: {
            count: 0
          },
          gtr_ClinPhen: {
            count: 0
          },
          phenolyzer_ImportedGenes: {
            count: 0
          },
          phenolyzer_ClinPhen: {
            count: 0
          },
          ImportedGenes_ClinPhen: {
            count: 0
          },
          gtr_phenolyzer_ImportedGenes: {
            count: 0
          },
          gtr_phenolyzer_ClinPhen: {
            count: 0
          },
          gtr_ImportedGenes_ClinPhen: {
            count: 0
          },
          phenolyzer_ImportedGenes_ClinPhen: {
            count: 0
          },
          gtr_phenolyzer_ImportedGenes_ClinPhen: {
            count: 0
          }
        }
        for(var i=0; i<summaryGenes.length; i++){
          if(summaryGenes[i].sources.length===4){
            allSourcesGenes.push(summaryGenes[i]);
            summaryObj.gtr_phenolyzer_ImportedGenes_ClinPhen++;
            summaryObj.gtr.count++;
            summaryObj.phenolyzer.count++;
            summaryObj.ImportedGenes.count++;
            summaryObj.ClinPhen.count++;
            summaryObj.gtr_phenolyzer_ImportedGenes.count++;
            summaryObj.gtr_phenolyzer_ClinPhen.count++;
            summaryObj.gtr_ImportedGenes_ClinPhen.count++;
            summaryObj.phenolyzer_ImportedGenes_ClinPhen.count++;
            summaryObj.gtr_phenolyzer.count++;
            summaryObj.gtr_ImportedGenes.count++;
            summaryObj.gtr_ClinPhen.count++;
            summaryObj.phenolyzer_ImportedGenes.count++;
            summaryObj.phenolyzer_ClinPhen.count++;
            summaryObj.ImportedGenes_ClinPhen.count++;
            summaryGenes.splice(i, 1);
                i--;
          }
          else if(summaryGenes[i].sources.length===3){
            threeSourcesGenes.push(summaryGenes[i]);
            if(!summaryGenes[i].sources.includes("ClinPhen")){
              summaryObj.gtr_phenolyzer_ImportedGenes.count++;
              summaryObj.phenolyzer.count++;
              summaryObj.gtr.count++;
              summaryObj.ImportedGenes.count++;
              summaryObj.phenolyzer_ImportedGenes.count++;
              summaryObj.gtr_ImportedGenes.count++;
              summaryObj.gtr_phenolyzer.count++;
            }
            else if(!summaryGenes[i].sources.includes("ImportedGenes")){
              summaryObj.gtr_phenolyzer_ClinPhen.count++;
              summaryObj.phenolyzer.count++;
              summaryObj.gtr.count++;
              summaryObj.ClinPhen.count++;
              summaryObj.phenolyzer_ClinPhen.count++;
              summaryObj.gtr_ClinPhen.count++;
              summaryObj.gtr_phenolyzer.count++;
            }
            else if(!summaryGenes[i].sources.includes("Pheno")){
              summaryObj.gtr_ImportedGenes_ClinPhen.count++;
              summaryObj.gtr.count++;
              summaryObj.ImportedGenes.count++;
              summaryObj.ClinPhen.count++;
              summaryObj.gtr_ClinPhen.count++;
              summaryObj.gtr_ImportedGenes.count++;
              summaryObj.ImportedGenes_ClinPhen.count++;
            }
            else if(!summaryGenes[i].sources.includes("GTR")){
              summaryObj.phenolyzer_ImportedGenes_ClinPhen.count++;
              summaryObj.phenolyzer.count++;
              summaryObj.ImportedGenes.count++;
              summaryObj.ClinPhen.count++;
              summaryObj.ImportedGenes_ClinPhen.count++;
              summaryObj.phenolyzer_ImportedGenes.count++;
              summaryObj.phenolyzer_ClinPhen.count++;
            }
            summaryGenes.splice(i, 1);
                i--;
          }
          else if(summaryGenes[i].sources.length===2){
            twoSourcesGenes.push(summaryGenes[i]);
            if(summaryGenes[i].sources.includes("GTR") && summaryGenes[i].sources.includes("Pheno")){
              summaryObj.gtr_phenolyzer.count++;
              summaryObj.gtr.count++;
              summaryObj.phenolyzer.count++;
            }
            else if(summaryGenes[i].sources.includes("GTR") && summaryGenes[i].sources.includes("ImportedGenes")){
              summaryObj.gtr_ImportedGenes.count++;
              summaryObj.ImportedGenes.count++;
              summaryObj.gtr.count++;
            }
            else if(summaryGenes[i].sources.includes("GTR") && summaryGenes[i].sources.includes("ClinPhen")){
              summaryObj.gtr_ClinPhen.count++;
              summaryObj.gtr.count++;
              summaryObj.ClinPhen.count++;
            }
            else if(summaryGenes[i].sources.includes("Pheno") && summaryGenes[i].sources.includes("ImportedGenes")){
              summaryObj.phenolyzer_ImportedGenes.count++;
              summaryObj.ImportedGenes.count++;
              summaryObj.phenolyzer.count++;
            }
            else if(summaryGenes[i].sources.includes("Pheno") && summaryGenes[i].sources.includes("ClinPhen")){
              summaryObj.phenolyzer_ClinPhen.count++;
              summaryObj.phenolyzer.count++;
              summaryObj.ClinPhen.count++;
            }
            else if(summaryGenes[i].sources.includes("ImportedGenes") && summaryGenes[i].sources.includes("ClinPhen")){
              summaryObj.ImportedGenes_ClinPhen.count++;
              summaryObj.ImportedGenes.count++;
              summaryObj.ClinPhen.count++;
            }
            summaryGenes.splice(i, 1);
                i--;
          }
          else if(summaryGenes[i].sources.length===1 && summaryGenes[i].sources[0]==="ImportedGenes"){
            uniqueAddedGenes.push(summaryGenes[i]);
            summaryObj.ImportedGenes.count++;
            summaryGenes.splice(i, 1);
                i--;
          }
          else if(summaryGenes[i].sources.length===1 && summaryGenes[i].sources[0]==="GTR"){
            uniqueGTR.push(summaryGenes[i]);
            summaryObj.gtr.count++;
            summaryGenes.splice(i, 1);
                i--;
          }
          else if(summaryGenes[i].sources.length===1 && summaryGenes[i].sources[0]==="ClinPhen"){
            uniqueClinPhen.push(summaryGenes[i]);
            summaryObj.ClinPhen.count++;
            summaryGenes.splice(i, 1);
                i--;
          }
          else if(summaryGenes[i].sources.length===1 && summaryGenes[i].sources[0]==="Pheno"){
            uniquePheno.push(summaryGenes[i]);
            summaryObj.phenolyzer.count++;
            summaryGenes.splice(i, 1);
                i--;
          }
        }
        var tableGenes = [...allSourcesGenes, ...threeSourcesGenes, ...twoSourcesGenes, ...uniqueAddedGenes, ...uniqueGTR, ...uniqueClinPhen, ...uniquePheno];
        this.summaryTableArrayFullList = tableGenes;
        this.$emit('summaryGenesFullList', this.summaryTableArrayFullList);
      },
      drawVennDiagram(){
        d3.select("#venn").select("svg").remove();
        var x = require('venn.js')
        var chart = x.VennDiagram()
                 .width(400)
                 .height(400);
      var div = d3.select("#venn")
      div.datum(this.vennData.data).call(chart);
      var tooltip = d3.select("body").append("div")
          .attr("class", "venntooltip");
      div.selectAll("path")
          .style("stroke-opacity", 0)
          .style("stroke", "#fff")
          .style("stroke-width", 3)
      div.selectAll("g")
          .on("mouseover", function(d, i) {
              // sort all the areas relative to the current item
              x.sortAreas(div, d);
              // Display a tooltip with the current size
              tooltip.transition().duration(400).style("opacity", .9);
              tooltip.text(d.size + " genes");
              // highlight the current path
              var selection = d3.select(this).transition("tooltip").duration(400);
              selection.select("path")
                  .style("fill-opacity", d.sets.length == 1 ? .4 : .1)
                  .style("stroke-opacity", 1);
          })
          .on("mousemove", function() {
              tooltip.style("left", (d3.event.pageX) + "px")
                     .style("top", (d3.event.pageY - 28) + "px");
          })
          .on("mouseout", function(d, i) {
              tooltip.transition().duration(400).style("opacity", 0);
              var selection = d3.select(this).transition("tooltip").duration(400);
              selection.select("path")
                  .style("fill-opacity", d.sets.length == 1 ? .25 : .0)
                  .style("stroke-opacity", 0);
          });
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

.venntooltip
  position: absolute
  text-align: center
  width: 128px
  height: 26px
  background: #333
  color: #ddd
  padding: 2px
  border: 0px
  border-radius: 8px
  opacity: 0

</style>
