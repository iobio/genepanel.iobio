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
                <!-- <div v-bind:class="[(browser==='Chrome' && isMobile===false) || (browser==='Firefox' && isMobile===false) ? 'flex xs12 sm12 md4 lg4 pr-2 pl-2': 'flex xs12 sm12 md2 lg3 pr-2 pl-2']" >
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
                </div> -->

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
      },
      clinPhenSelectedGenes: {
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
        else {
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

        }
      })

      //Check if the gene is in Phenolyzer
      uniqueGenes.map((x,i)=>{
        if(phenolyzerGenes.includes(x)){
          var idx = phenolyzerGenes.indexOf(x);
          summaryGenes[i].isPheno = true;
          summaryGenes[i].noOfSources++;
          summaryGenes[i].sources.push("Pheno");
          summaryGenes[i].geneId =  this.PhenolyzerGenes[idx].geneid;
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
        }
        else {
          summaryGenes[i].isPheno = false;
          summaryGenes[i].score =  "";
          summaryGenes[i].searchTermPheno =  [];
          summaryGenes[i].searchTermIndex =  [];
          summaryGenes[i].sourcePheno =  [];
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

      this.createSummaryTableData(summaryGenes)

      },
      createSummaryTableData(summaryGenes){
        var allSourcesGenes = [];
        var threeSourcesGenes = [];
        var twoSourcesGenes = [];
        var uniquePheno = [];
        var uniqueGTR =[];
        var uniqueClinPhen = [];
        var uniqueAddedGenes = [];


        for(var i=0; i<summaryGenes.length; i++){
          console.log("summaryGenes[i].sources.length", summaryGenes[i].sources[0])
          if(summaryGenes[i].sources.length===4){
            allSourcesGenes.push(summaryGenes[i]);
            summaryGenes.splice(i, 1);
                i--;
          }
          else if(summaryGenes[i].sources.length===3){
            threeSourcesGenes.push(summaryGenes[i]);
            summaryGenes.splice(i, 1);
                i--;
          }
          else if(summaryGenes[i].sources.length===2){
            twoSourcesGenes.push(summaryGenes[i]);
            summaryGenes.splice(i, 1);
                i--;
          }
          else if(summaryGenes[i].sources.length===1 && summaryGenes[i].sources[0]==="ImportedGenes"){
            uniqueAddedGenes.push(summaryGenes[i]);
            summaryGenes.splice(i, 1);
                i--;
          }
          else if(summaryGenes[i].sources.length===1 && summaryGenes[i].sources[0]==="GTR"){
            uniqueGTR.push(summaryGenes[i]);
            summaryGenes.splice(i, 1);
                i--;
          }
          else if(summaryGenes[i].sources.length===1 && summaryGenes[i].sources[0]==="ClinPhen"){
            uniqueClinPhen.push(summaryGenes[i]);
            summaryGenes.splice(i, 1);
                i--;
          }
          else if(summaryGenes[i].sources.length===1 && summaryGenes[i].sources[0]==="Pheno"){
            uniquePheno.push(summaryGenes[i]);
            summaryGenes.splice(i, 1);
                i--;
          }
        }

        var tableGenes = [...allSourcesGenes, ...threeSourcesGenes, ...twoSourcesGenes, ...uniqueAddedGenes, ...uniqueGTR, ...uniqueClinPhen, ...uniquePheno];
        console.log("tableGenes", tableGenes);
        this.summaryTableArray = tableGenes;

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
