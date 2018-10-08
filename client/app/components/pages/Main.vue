<template>
  <div id="app" style="background-color:#f9fbff">
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
        <v-btn flat color="white" @click.native="snackbar = false">Close</v-btn>
      </v-snackbar>

      <v-layout row justify-center>
        <v-dialog v-if="byPassedGenesDialog" v-model="byPassedGenesDialog" max-width="400">
          <v-card>
            <v-card-title class="headline">Warning</v-card-title>
            <v-card-text>
              <p v-if="byPassedGenes.length>2">
                Bypassing unknown genes: {{ byPassedGenes }}
              </p>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn style="float:right" @click.native="byPassedGenesDialog = false">
                OK
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>

    <v-navigation-drawer
      permanent
      app
      :class="launchedFromClin ? 'clin' : '' "
    >
    <br>
     <v-list dense class="pt-0">
       <v-list-tile
         v-bind:class="[component==='OverviewPage' ? 'activeTab' : '']"
         @click="selectComponent('OverviewPage')">
         <v-list-tile-action v-bind:class="[component==='OverviewPage' ? 'margin_ActiveTab' : '']">
           <span v-if="component==='OverviewPage'"><v-icon color="primary darken-1">library_books</v-icon></span>
           <span v-else color="blue-grey darken-2"><v-icon>library_books</v-icon></span>
         </v-list-tile-action>
         <v-list-tile-content>
           <v-list-tile-title v-bind:class="[component==='OverviewPage' ? 'activeTabText' : '']">
             Overview
           </v-list-tile-title>
         </v-list-tile-content>
       </v-list-tile>

       <v-list-tile
          v-bind:class="[component==='GeneticTestingRegistry' ? 'activeTab' : '']"
          @click="selectComponent('GeneticTestingRegistry')">
         <v-list-tile-action v-bind:class="[component==='GeneticTestingRegistry' ? 'margin_ActiveTab' : '']">
           <span v-if="component==='GeneticTestingRegistry'"><v-icon color="primary darken-1">sort</v-icon></span>
           <span v-else><v-icon color="blue-grey darken-2">sort</v-icon></span>
         </v-list-tile-action>
         <v-list-tile-content>
           <v-list-tile-title v-bind:class="[component==='GeneticTestingRegistry' ? 'activeTabText' : '']">
             Genetic Testing Registry
             <v-badge color="primary darken-1" right class="badge-bg-color">
               <span  slot="badge">{{ NumberOfGenesSelectedFromGTR }}</span>
             </v-badge>
           </v-list-tile-title>
         </v-list-tile-content>
       </v-list-tile>

       <v-list-tile
          v-bind:class="[component==='Phenolyzer' ? 'activeTab' : '']"
          @click="selectComponent('Phenolyzer')">
         <v-list-tile-action v-bind:class="[component==='Phenolyzer' ? 'margin_ActiveTab' : '']">
           <!-- <span v-if="component==='Phenolyzer'"><v-icon color="primary darken-1">dashboard</v-icon></span> -->
           <span v-if="component==='Phenolyzer'">
             <img src="../assets/images/phenolyzer2.svg" alt="" height="28px" width="28px" >
           </span>
           <span v-else><img src="../assets/images/phenolyzer1.svg" height="28px" width="28px" style="margin-left:-4px"></span>
         </v-list-tile-action>
         <v-list-tile-content>
           <v-list-tile-title v-bind:class="[component==='Phenolyzer' ? 'activeTabText' : '']">
             Phenolyzer
             <v-badge color="primary" right class="badge-bg-color">
              <span slot="badge">{{ NumberOfGenesSelectedFromPhenolyzer }}</span>
            </v-badge>
           </v-list-tile-title>

         </v-list-tile-content>
       </v-list-tile>

       <v-list-tile
          v-bind:class="[component==='AddGenes' ? 'activeTab' : '']"
          @click="selectComponent('AddGenes')">
         <v-list-tile-action v-bind:class="[component==='AddGenes' ? 'margin_ActiveTab' : '']">
           <span v-if="component==='AddGenes'"><v-icon color="primary darken-1">playlist_add</v-icon></span>
           <span v-else><v-icon color="blue-grey darken-2">playlist_add</v-icon></span>
        </v-list-tile-action>
         <v-list-tile-content>
           <v-list-tile-title v-bind:class="[component==='AddGenes' ? 'activeTabText' : '']">
             Add Genes
             <v-badge color="primary" right class="badge-bg-color">
              <span slot="badge">{{ manuallyAddedGenes.length }}</span>
            </v-badge>
           </v-list-tile-title>

         </v-list-tile-content>
       </v-list-tile>


       <v-list-tile
          v-bind:class="[component==='SummaryTab' ? 'activeTab' : '']"
          @click="selectComponent('SummaryTab')">
         <v-list-tile-action v-bind:class="[component==='SummaryTab' ? 'margin_ActiveTab' : '']">
           <span v-if="component==='SummaryTab'"><v-icon style="transform: rotate(90deg)" color="primary darken-1">merge_type</v-icon></span>
           <span v-else><v-icon style="transform: rotate(90deg)" color="blue-grey darken-2">merge_type</v-icon></span>
         </v-list-tile-action>
         <v-list-tile-content>
           <v-list-tile-title v-bind:class="[component==='SummaryTab' ? 'activeTabText' : '']">
             Summary
             <v-badge color="primary" right class="badge-bg-color">
              <span slot="badge">{{ NumberOfAllGenes }}</span>
            </v-badge>
           </v-list-tile-title>
         </v-list-tile-content>
       </v-list-tile>

       <!-- <v-divider></v-divider> -->
     </v-list>

    </v-navigation-drawer>

    <Footer></Footer>

    <v-toolbar
      :class="launchedFromClin ? 'clin' : '' "
      dark
      :height="launchedFromClin ? 45 : 64"
      :clipped-left="$vuetify.breakpoint.mdAndUp"
      fixed
    >
      <v-toolbar-title >
        <span >panel.iobio</span>
      </v-toolbar-title>

      <span style="margin-left:130px">
      </span>
      <v-spacer></v-spacer>
      <!-- <a @click="sendGenesUsingSocket" v-show="uniqueGenes.length>1" href="http://localhost:4026" target="_blank"><v-btn color="primary">Analyze Genes</v-btn></a> -->
      <v-menu bottom offset-y style="color:black">
        <v-btn flat slot="activator" :class="launchedFromClin ? 'clinButtonColor' : '' "
        ><v-icon v-if="!launchedFromClin" style="padding-right:4px">input</v-icon>
          Export
        </v-btn>
        <v-list>
          <div v-if="component==='GeneticTestingRegistry'">
            <v-list-tile @click="copyGtrGenes">
              <v-list-tile-title><v-icon>content_copy</v-icon>&nbsp; &nbsp;Copy GTR genes to clipboard</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="exportGtrGenes">
              <v-list-tile-title><v-icon>input</v-icon>&nbsp; &nbsp;Export GTR genes to file</v-list-tile-title>
            </v-list-tile>
            <!-- <v-list-tile @click="saveGtrGenesAsCSV">
              <v-list-tile-title><v-icon>save</v-icon>&nbsp; &nbsp;Save GTR genes as CSV</v-list-tile-title>
            </v-list-tile> -->
            <hr>
          </div>
          <div v-else-if="component==='Phenolyzer'">
            <v-list-tile @click="copyPhenolyzerGenes">
              <v-list-tile-title><v-icon>content_copy</v-icon>&nbsp; &nbsp;Copy Phenolyzer genes to clipboard</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="exportPhenolyzerGenes">
              <v-list-tile-title><v-icon>input</v-icon>&nbsp; &nbsp;Export Phenolyzer genes to file</v-list-tile-title>
            </v-list-tile>
            <hr>
          </div>
          <v-list-tile @click="copyAllGenes">
            <v-list-tile-title><v-icon>content_copy</v-icon>&nbsp; &nbsp;Copy all genes to clipboard</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="exportAllGenes">
            <v-list-tile-title><v-icon>input</v-icon>&nbsp; &nbsp;Export all genes to file</v-list-tile-title>
          </v-list-tile>
          <v-list-tile v-show="component==='SummaryTab'" @click="exportGenesAsCSV">
            <v-list-tile-title><v-icon>save</v-icon>&nbsp; &nbsp;Export genes as CSV</v-list-tile-title>
          </v-list-tile>

        </v-list>
      </v-menu>
      <span>
        <v-dialog v-model="newAnalysisDialog" persistent max-width="350">
          <v-btn :class="launchedFromClin ? 'clinButtonColor' : '' " flat slot="activator">
          <v-icon v-if="!launchedFromClin">autorenew</v-icon>Clear All</v-btn>
          <v-card>
            <v-card-title class="headline">Are you sure you want to clear all?</v-card-title>
            <v-card-text>Clicking "Yes" will clear results from all pages and begin a new analysis.</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click.native="forceReload">Yes</v-btn>
              <v-btn color="blue darken-1" flat @click.native="newAnalysisDialog = false">No</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </span>
      <HelpMenu v-bind:launchedFromClin="launchedFromClin"></HelpMenu>
      <AppsMenu v-show="!launchedFromClin"></AppsMenu>

    </v-toolbar>

    <div>
      <v-content style="padding: 0px 0px 0px 300px" :class="launchedFromClin ? 'clin' : '' ">
        <div class="header-nav-bar" >
          <v-card-text>
            <p></p>
          </v-card-text>
        </div>
        <div style="background:white; height:auto">
          <keep-alive>
              <!-- <AddGenes></AddGenes> -->
              <Overview v-show="component==='OverviewPage'"></Overview>
            </keep-alive>
            <keep-alive>
              <GeneticTestingRegistry
                v-show="component==='GeneticTestingRegistry'"
                v-on:vendorListCB="updateVendors($event)"
                v-bind:selectedVendorsListCB="selectedVendorsList"
                v-on:diseasesCB=addDiseases($event)
                v-on:disorderNamesListCB="updateDisorderNames($event)"
                v-on:modeOfInheritanceData="modeOfInheritanceData($event)"
                v-on:GeneMembershipData="GeneMembershipData($event)"
                v-bind:selectedDisordersListCB="selectedDisordersList"
                v-on:UpdateNumberOfGenesSelectedFromGTR="updateGtrTabBadge($event)"
                v-on:UpdateListOfSelectedGenesGTR="updateGtrGenes($event)"
                :chartColor="ordinalColor"
                :barColor="barColor"
                @search-gtr="onSearchGTR"
                v-bind:launchedFromClin="launchedFromClin"
                v-bind:browser="browser"
                v-bind:clinSearchedGtr="clinGtrSearchTerm"
                v-bind:clinFetchingGtr="clinFetchingGtr"
                v-bind:clinGenes="clinGenesGtr"
                v-bind:isMobile="isMobile">
              </GeneticTestingRegistry>
            </keep-alive>

            <keep-alive>
                <Phenolyzer
                v-show="component==='Phenolyzer'"
                v-on:NoOfGenesSelectedFromPhenolyzer="updatePhenolyzerTabBadge($event)"
                v-on:SelectedPhenolyzerGenesToCopy="updatePhenolyzerGenes($event)"
                @search-phenotype="onSearchPhenotype"
                @phenotypeSearchTermArray="phenotypeSearchTermArray"
                v-bind:launchedFromClin="launchedFromClin"
                v-bind:browser="browser"
                v-bind:isMobile="isMobile"
                v-bind:clinsearchedPhenolyzer="clinPhenolyzerSeachTerm"
                v-bind:clinGenes="clinGenesPhenolyzer"
                v-bind:SearchTheDisorderInPhenolyzer="SearchTheDisorderInPhenolyzer">
              </Phenolyzer>
            </keep-alive>

            <keep-alive>
              <AddGenes
                v-show="component==='AddGenes'"
                v-bind:launchedFromClin="launchedFromClin"
                v-bind:clinGenesManual="clinGenesManual"
                v-on:importedGenes="importedGenes">
              </AddGenes>
            </keep-alive>

            <keep-alive>
              <SummaryTab
                v-show="component==='SummaryTab'"
                v-bind:NumberOfGtrGenes="NumberOfGenesSelectedFromGTR"
                v-bind:NumberOfPhenolyzerGenes="NumberOfGenesSelectedFromPhenolyzer"
                v-bind:GtrGenesForSummary="selectedGtrGenes"
                v-bind:searchTermGTR="searchTermGTR"
                v-bind:PhenolyzerGenesForSummary="selectedPhenolyzerGenes"
                v-bind:onSearchPhenotype="phenotypeSearches"
                v-bind:manuallyAddedGenes="manuallyAddedGenes"
                :chartColor="ordinalColor"
                v-bind:browser="browser"
                v-bind:isMobile="isMobile">
              </SummaryTab>
            </keep-alive>

        </div>
      </v-content>
    </div>

  </v-app>
</div>
</template>

<script>
import { bus } from '../../routes';
import GeneticTestingRegistry from './GeneticTestingRegistry.vue';
import Phenolyzer from './Phenolyzer.vue';
import AddGenes from './AddGenes.vue';
// import HomePage from './HomePage.vue';
import SummaryTab from './SummaryTab.vue';
var FileSaver = require('file-saver');
import DisorderSearch from './DisorderSearch.vue';
import IntroductionText from '../../../data/IntroductionText.json';
import AppsMenu from '../partials/AppsMenu.vue';
import HelpMenu from '../partials/HelpMenu.vue';
import Overview from './Overview.vue';
import Footer from '../partials/Footer.vue';
import { ExportToCsv } from 'export-to-csv';
import knownGenes from '../../../data/knownGenes'

// var fs = require('fs');

  export default {
    components: {
      'GeneticTestingRegistry': GeneticTestingRegistry,
      'Phenolyzer': Phenolyzer,
      'SummaryTab': SummaryTab,
      'DisorderSearch': DisorderSearch,
      'AppsMenu': AppsMenu,
      'HelpMenu': HelpMenu,
      'Overview':Overview,
      'Footer': Footer,
      'AddGenes': AddGenes
    },
    props: {
      paramLaunchedFromClin: null
    },
    data(){
      let self = this;
      return{
        component: self.paramLaunchedFromClin == 'true' ? 'GeneticTestingRegistry' : 'GeneticTestingRegistry',
        GtrScrollY:0,
        PhenolyzerScrollY:0,
        SummaryScrollY:0,
        drawer: false,
        newAnalysisDialog: false,
        vendorList:[],
        selectedVendorsList:[],
        disorderList:[],
        selectedDisordersList: [],
        NumberOfGenesSelectedFromGTR: 0,
        NumberOfGenesSelectedFromPhenolyzer: 0,
        NumberOfAllGenes: 0,
        selectedGtrGenes: [],
        selectedPhenolyzerGenes: [],
        snackbar: false,
        y: 'top',
        x: null,
        mode: '',
        snackbarTimeout: 4000,
        snackbarText:"You need to select Genes inorder to copy them",
        AllSourcesGenes:[],
        uniqueGenes:[],
        showDisclaimer: false,
        showVersion: false,
        searchTermGTR: null,
        searchTermPhenotype: [],
        phenotypeSearches: [],
        modeOfInheritanceProps: [],
        GeneMembershipProps: [],
        IntroductionTextData: null,

        clinIobioUrls: ["http://localhost:4030", "http://clin.iobio.io", "https://clin.iobio.io", "https://dev.clin.iobio.io", "http://dev.clin.iobio.io"],
        clinIobioUrl: null,
        launchedFromClin: self.paramLaunchedFromClin == 'true' ? true : false,

        ordinalColorCyan: d3.scale.ordinal().range([
          '#0097A7',
          '#00ACC1',
          '#26C6DA',
          '#80DEEA',
          '#4DD0E1'
        ]),
        ordinalColor: d3.scale.ordinal().range([
          '#576E97', '#7CA8CF', '#A4D3A7', '#70A6B7', '#4EA395', '#DAC87A'
        ]),
        barColor: {
          selected: '#7CA8CF',
          notselected: 'lightgrey'
        },
        browser: null,
        isMobile: false,
        setDefaultLandingPage: false,
        GtrGenesArr: [],
        PhenolyzerGenesArr: [],
        commonGtrPhenoGenes: [],
        uniqueGtrGenes: [],
        uniqueGtrData: [],
        uniquePheno: [],
        UniquePhenoData: [],
        summaryClinTableArray: [],
        SearchTheDisorderInPhenolyzer: "",
        manuallyAddedGenes: [],
        clinSearchedGtr: [],
        clinsearchedPhenolyzer: [],
        clinGenes: [],
        clinGenesGtr: [],
        clinGenesPhenolyzer: [],
        clinGenesManual: [],
        clinGenesData: [],
        clinSearchedGtrIndex: 0,
        clinSearchedPhenolyzerIndex: 0,
        clinGtrSearchTerm: [],
        clinPhenolyzerSeachTerm: [],
        clinFetchingGtr: false,
        completeClinGtrIteration: false,
        byPassedGenes: "",
        byPassedGenesDialog: false,
      }
    },
    watch: {
      selectedGtrGenes: function(){
        // console.log("selectedGtrGenes changing");
        if(this.launchedFromClin){
          if(this.clinSearchedGtr.length===1){
            bus.$emit("clearClinGenesArray");
            this.clinFetchingGtr = false;
          }
          else{
            this.clinSearchedGtrIndex++;
            if(this.clinSearchedGtrIndex<this.clinSearchedGtr.length){
              this.clinGtrSearchTerm=[this.clinSearchedGtr[this.clinSearchedGtrIndex]]
            }
            else if (this.clinSearchedGtrIndex===this.clinSearchedGtr.length || this.clinSearchedGtrIndex===this.clinSearchedGtr.length+1) {
              bus.$emit("clearClinGenesArray");
              this.clinFetchingGtr = false;
              this.completeClinGtrIteration = true;
            }
            // console.log("clinSearchedGtrIndex", this.clinSearchedGtrIndex)

          }
        }
      },
      completeClinGtrIteration: function(){
        if(this.clinsearchedPhenolyzer.length>0){
          this.clinPhenolyzerSeachTerm = [this.clinsearchedPhenolyzer[0]]
        }
      },
      selectedPhenolyzerGenes: function(){
        // console.log(this.selectedPhenolyzerGenes)
        if(this.launchedFromClin){
          if(this.clinsearchedPhenolyzer.length===1){
            // bus.$emit("clearClinGenesPhenolyzerArray");
            // this.clinFetchingGtr = false;
          }
          else{
            this.clinSearchedPhenolyzerIndex++;
            if(this.clinSearchedPhenolyzerIndex<this.clinsearchedPhenolyzer.length){
              this.clinPhenolyzerSeachTerm=[this.clinsearchedPhenolyzer[this.clinSearchedPhenolyzerIndex]]
            }
            else if (this.clinSearchedPhenolyzerIndex===this.clinsearchedPhenolyzer.length || this.clinSearchedPhenolyzerIndex===this.clinsearchedPhenolyzer.length+1) {
              bus.$emit("clearClinGenesPhenolyzerArray");
              // this.clinFetchingGtr = false;
            }
          }
        }
      },
    },
    created(){
      this.IntroductionTextData = IntroductionText.data;
      this.knownGenesData = knownGenes;
      window.addEventListener('scroll', this.handleScroll);
      this.detectBrowser();
      this.checkIfMobile();
    },
    mounted(){
      window.addEventListener("message", this.receiveClin, false);
      bus.$on("searchDisorderInPhenolyzer", (disorder) =>{
        this.SearchTheDisorderInPhenolyzer = disorder;
        this.component = "Phenolyzer";
      })
      bus.$on("openGtrComponent", ()=>{
        window.scrollTo(0,0);
        this.component = "GeneticTestingRegistry";
      })
      bus.$on("openPhenolyzer", ()=>{
        window.scrollTo(0,0);
        this.component = "Phenolyzer";
      })
      bus.$on("updateAllGenes", (data)=>{
        this.updateAllGenesFromSelection(data);
      });
      bus.$on("exportSummaryGenesAsCSV", ()=>{
        this.exportGenesAsCSV();
      })
    },
    updated(){
    },
    methods: {
      checkIfMobile: function(){
        this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      },
      detectBrowser: function(){
        if(navigator.userAgent.indexOf('Chrome') > -1){
          this.browser = "Chrome";
        }
        else if(navigator.userAgent.indexOf('Firefox') > -1) {
          this.browser = "Firefox";
        }
        else if(navigator.userAgent.indexOf('Safari') > -1){
          this.browser = "Safari";
        }
        else if(navigator.userAgent.indexOf('MSIE') > -1){
          this.browser = "IE";
        }
        else {
          this.browser = "Chrome";
        }
      },
      handleScroll (event) {
        if(this.component === 'GeneticTestingRegistry'){
          this.GtrScrollY = window.scrollY;
        }
        else if(this.component === 'Phenolyzer'){
          this.PhenolyzerScrollY = window.scrollY;
        }
        else if(this.component === 'SummaryTab'){
          this.SummaryScrollY = window.scrollY;
        }
      },
      selectComponent(componentName){
        this.component = componentName;
        if(componentName === 'GeneticTestingRegistry'){
          window.scrollTo(0,this.GtrScrollY);
        }
        else if(componentName === 'Phenolyzer'){
          window.scrollTo(0,this.PhenolyzerScrollY);
        }
        else if(componentName === 'SummaryTab'){
          window.scrollTo(0,this.SummaryScrollY);
        }
      },
      forceReload: function(){
        this.newAnalysisDialog = false;
        bus.$emit("newAnalysis");
        window.scrollTo(0,0);
      },
      onShowDisclaimer: function() {
        this.showDisclaimer = true;
      },
      onShowVersion: function(){
        this.showVersion = true;
      },
      addDiseases: function(e){
        if(e.length<= 0){
          this.vendorList=[];
          this.disorderList=[];
          this.NumberOfGenesSelectedFromGTR=0;
        }
      },
      updateVendors: function(e){
        this.vendorList = e;
      },
      updateSelectedVendors: function(e){
        this.selectedVendorsList = e;
      },
      updateDisorderNames: function(e){
        this.disorderList = e;
      },
      updateSelectedDisorders: function(e){
        this.selectedDisordersList = e;
      },
      updateGtrTabBadge: function(e){
        this.NumberOfGenesSelectedFromGTR = e;
      },
      updatePhenolyzerTabBadge: function(e){
        this.NumberOfGenesSelectedFromPhenolyzer = e;
      },
      modeOfInheritanceData: function(e){
        this.modeOfInheritanceProps = e;
      },
      GeneMembershipData: function(e){
        this.GeneMembershipProps = e;
      },
      clickFuncTemp: function(){
        var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, "hello world.txt");

      },
      updateGtrGenes: function(e){
        // console.log("selectedGtrGenes", e)
        this.selectedGtrGenes = e;
        if(e.length<=0){
          this.NumberOfGenesSelectedFromGTR = 0;
        }

        // if(this.launchedFromClin){
        //   if(this.clinSearchedGtr.length===1){
        //     bus.$emit("clearClinGenesArray");
        //     // this.clinFetchingGtr = false;
        //   }
        //   else{
        //     this.clinSearchedGtrIndex++;
        //     if(this.clinSearchedGtrIndex<this.clinSearchedGtr.length){
        //       this.clinGtrSearchTerm=[this.clinSearchedGtr[this.clinSearchedGtrIndex]]
        //     }
        //     else if (this.clinSearchedGtrIndex===this.clinSearchedGtr.length+1) {
        //       bus.$emit("clearClinGenesArray");
        //       // this.clinFetchingGtr = false;
        //     }
        //     console.log("clinSearchedGtrIndex", this.clinSearchedGtrIndex)
        //
        //   }
        // }
        var gtrGenes = this.selectedGtrGenes.map(gene => {
          return gene.name
        })

        var phenolyzerGenes = this.selectedPhenolyzerGenes.map(gene => {
          return gene.geneName
        })

        var allGenes = [...gtrGenes, ...phenolyzerGenes];
        this.AllSourcesGenes = allGenes;

        this.uniqueGenes = Array.from(new Set(this.AllSourcesGenes));
        this.NumberOfAllGenes = this.uniqueGenes.length
      },
      updatePhenolyzerGenes:function(e){
        this.selectedPhenolyzerGenes = e;
        var gtrGenes = this.selectedGtrGenes.map(gene => {
          return gene.name
        })

        var phenolyzerGenes = this.selectedPhenolyzerGenes.map(gene => {
          return gene.geneName
        })

        var allGenes = [...gtrGenes, ...phenolyzerGenes];
        this.AllSourcesGenes = allGenes;

        this.uniqueGenes = Array.from(new Set(this.AllSourcesGenes));
        this.NumberOfAllGenes = this.uniqueGenes.length
      },
      copyGtrGenes: function(){
        // window.open('http://localhost:4000');
        var geneNames = this.selectedGtrGenes.map(gene => {
          return gene.name
        })

        var clinData = this.selectedGtrGenes.map(gene => {
          return {
            name: gene.name,
            searchTerms: gene.searchTermArray,
            conditions: gene.conditions,
            genePanels: gene.value,
            geneid: gene.geneid
          }
        })

        // console.log("clinData GTR", clinData)
        var geneNamesToString = geneNames.toString();
        var genesToCopy = geneNamesToString.replace(/,/gi , ' ');
        this.$clipboard(genesToCopy);

        // var socket = io.connect('http://localhost:4026');
        //
        // socket.emit('geneData', {
        //     message: "Genes",
        //     handle: genesToCopy
        // });

        if(this.selectedGtrGenes.length>0){
          this.snackbarText = " Number of Genes Copied : " + this.selectedGtrGenes.length + " ";
        }
        this.snackbar=true;

        this.sendClin({
          'type': 'apply-genes',
          source: 'gtr',
          data: clinData,
          genes: geneNames,
          searchTerms: [this.searchTermGTR]
        });
      },
      saveGtrGenesAsCSV: function(){
        var clinData = this.selectedGtrGenes.map(gene => {
          return {
            name: gene.name,
            searchTerms: gene.searchTermArray,
            conditions: gene.conditions,
            genePanels: gene.value,
            geneid: gene.geneid
          }
        })

        const options = {
          fieldSeparator: ',',
          quoteStrings: '"',
          decimalseparator: '.',
          showLabels: true,
          showTitle: true,
          title: 'GTR Genes',
          useBom: true,
          useKeysAsHeaders: true,
          filename: 'GTR_Genes'
        };
        const csvExporter = new ExportToCsv(options);
        csvExporter.generateCsv(clinData);

      },
      exportGenesAsCSV: function(){
        // console.log("this.summaryGenes", this.summaryGenes)
        var clinData = this.summaryGenes.map(gene => {
          return {
            Rank: gene.SummaryIndex,
            Gene_name: gene.name,
            sources: gene.sources,
            GTR_SearchTerms: gene.searchTermArrayGTR.join(),
            Phenolyzer_searchTerms: gene.searchTermPheno.join(),
            gene_id: gene.geneId,
            Gtr: gene.isGtr,
            Phenolyzer: gene.isPheno,
            AddedGene: gene.isImportedGenes
          }
        })

        const options = {
          fieldSeparator: ',',
          quoteStrings: '"',
          decimalseparator: '.',
          showLabels: true,
          showTitle: true,
          title: 'Genes',
          useBom: true,
          useKeysAsHeaders: true,
          filename: 'Genes'
        };
        const csvExporter = new ExportToCsv(options);
        csvExporter.generateCsv(clinData);

      },
      copyPhenolyzerGenes: function(){
        var geneNames = this.selectedPhenolyzerGenes.map(gene => {
          return gene.geneName
        })

        var clinData = this.selectedPhenolyzerGenes.map(gene => {
          return {
            name: gene.geneName,
            searchTerms: gene.searchTerm,
            score: gene.score,
          }
        })
        var geneNamesToString = geneNames.toString();
        var genesToCopy = geneNamesToString.replace(/,/gi , ' ');
        this.$clipboard(genesToCopy);

        if(this.selectedPhenolyzerGenes.length>0){
          this.snackbarText = " Number of Genes Copied : " + this.selectedPhenolyzerGenes.length + " ";
        }
        this.snackbar=true;

        this.sendClin({
          'type': 'apply-genes',
          source: 'phenotype-driven',
          genes: geneNames,
          data: clinData,
          searchTerms: [this.searchTermPhenotype]
        });

      },
      sendGenesUsingSocket: function(){
        // let self = this;
        var genesToCopy = this.uniqueGenes.toString();
        // console.log("genesToCopy", genesToCopy);
        var socket = io.connect('http://localhost:4026');

        socket.emit('geneData', {
            message: "Genes",
            handle: genesToCopy
        });

      },
      checkForUnknownGenes: function(){
        let self = this;
        var filteredKnownGenes = [];
        var byPassedGenesArr = [];

        self.uniqueGenes.map(x=>{
          if(self.knownGenesData.includes(x.toUpperCase())) {
            filteredKnownGenes.push(x)
          }
          else {
            byPassedGenesArr.push(x.toUpperCase());
          }
        })

        if(byPassedGenesArr.length>0){
          console.log("" + byPassedGenesArr.join(" , ") + "  ");
          self.byPassedGenes = "" + byPassedGenesArr.join(" , ") + "  ";
          self.byPassedGenesDialog = true;
          // setTimeout(()=>{
          //   self.copyAllGenes();
          //   self.byPassedGenesDialog = false;
          // }, 5000)
        }
        else {
          self.copyAllGenes();
        }


      },
      copyAllGenes: function(){
        let self = this;
        var genesToCopy = this.uniqueGenes.toString();
        // console.log("this.uniqueGenes from copy", this.uniqueGenes);
        // console.log("this.summaryGenes", this.summaryGenes)
        this.organizeClinData();
        var clinData = this.summaryClinTableArray.map(gene=> {
          return {
            name: gene.name,
            source: gene.sources,
            geneId: gene.geneId,
            score: gene.score,
            genePanels: gene.value,
            // searchTermsPhenolyzer: gene.searchTermPheno,
            searchTermsPhenolyzer: gene.phenotypeSearches,
            searchTermsGtr: gene.searchTermArrayGTR
          }
        })
        // console.log("clinData", clinData);
        // console.log("this.GtrGenesArr", this.GtrGenesArr)
        // console.log("this.PhenolyzerGenesArr", this.PhenolyzerGenesArr)
        this.$clipboard(genesToCopy);

        if(this.uniqueGenes.length>0){
          this.snackbarText = " Number of Genes Copied : " + this.uniqueGenes.length + " ";
        }
        this.snackbar=true;

        var filteredKnownGenes = [];
        var byPassedGenesArr = [];
        var duplicateGenes = [];

        console.log("self.knownGenesData", self.knownGenesData)
        self.uniqueGenes.map(x=>{
          if(self.knownGenesData.includes(x.toUpperCase())) {
            filteredKnownGenes.push(x)
          }
          else {
            byPassedGenesArr.push(x.toUpperCase());
          }
        })

        // if(byPassedGenesArr.length>0){
        //   console.log("" + byPassedGenesArr.join(" , ") + "  ");
        //   self.byPassedGenes = "" + byPassedGenesArr.join(" , ") + "  ";
        //   self.byPassedGenesDialog = true;
        // }

        this.sendClin({
          type: 'apply-genes',
          source: 'all',
          genes: filteredKnownGenes,
          genesGtr: this.GtrGenesArr,
          genesPhenolyzer: this.PhenolyzerGenesArr,
          genesManual: this.manuallyAddedGenes,
          genesReport: clinData,
          // searchTerms:  [this.searchTermGTR, this.searchTermPhenotype]
          searchTerms:  [this.searchTermGTR, this.phenotypeSearches]

        });

      },
      autoSaveGenes(){
        console.log("autosaving genes")

        let self = this;
        var genesToCopy = this.uniqueGenes.toString();
        this.organizeClinData();
        var clinData = this.summaryClinTableArray.map(gene=> {
          return {
            name: gene.name,
            source: gene.sources,
            geneId: gene.geneId,
            score: gene.score,
            genePanels: gene.value,
            // searchTermsPhenolyzer: gene.searchTermPheno,
            searchTermsPhenolyzer: gene.phenotypeSearches,
            searchTermsGtr: gene.searchTermArrayGTR
          }
        })

          var filteredKnownGenes = [];
          self.uniqueGenes.map(x=>{
            if(self.knownGenesData.includes(x.toUpperCase())) {
              filteredKnownGenes.push(x)
            }
          })

          this.sendClin({
            type: 'apply-genes',
            source: 'all',
            genes: filteredKnownGenes,
            genesGtr: this.GtrGenesArr,
            genesPhenolyzer: this.PhenolyzerGenesArr,
            genesManual: this.manuallyAddedGenes,
            genesReport: clinData,
            // searchTerms:  [this.searchTermGTR, this.searchTermPhenotype]
            searchTerms:  [this.searchTermGTR, this.phenotypeSearches]
          });

      },
      exportGtrGenes: function(){
        var geneNames = this.selectedGtrGenes.map(gene => {
          return gene.name
        })
        var geneNamesToExport = geneNames.toString();
        if(this.selectedGtrGenes.length>0){
          var blob = new Blob([geneNamesToExport], {type: "text/plain;charset=utf-8"});
          FileSaver.saveAs(blob, "GTR Genes.txt");
        }
        else {
          this.snackbarText = "You need to select genes inorder to use this feature";
          this.snackbar=true;
        }
      },
      exportPhenolyzerGenes: function(){
        var geneNames = this.selectedPhenolyzerGenes.map(gene => {
          return gene.geneName
        })
        var geneNamesToExport = geneNames.toString();
        if(this.selectedPhenolyzerGenes.length>0){
          var blob = new Blob([geneNamesToExport], {type: "text/plain;charset=utf-8"});
          FileSaver.saveAs(blob, "Phenolyzer Genes.txt");
        }
        else {
          this.snackbarText = "You need to select genes inorder to use this feature";
          this.snackbar=true;
        }
      },
      exportAllGenes: function(){
          var geneNamesToExport = this.uniqueGenes.toString();
          if(this.uniqueGenes.length>0){
            var blob = new Blob([geneNamesToExport], {type: "text/plain;charset=utf-8"});
            FileSaver.saveAs(blob, "All Genes.txt");
          }
          else {
            this.snackbarText = "You need to select genes inorder to use this feature";
            this.snackbar=true;
          }
      },
      updateAllGenesFromSelection(data){
        // console.log("this.summaryGenes", this.summaryGenes)
        this.summaryGenes = data;
        var allGenes = data.map(x=>{
          return x.name;
        });
        this.uniqueGenes = allGenes;
        this.NumberOfAllGenes = this.uniqueGenes.length
      },
      receiveClin: function(event) {
        // Do we trust the sender of this message?
        if (this.clinIobioUrls.indexOf(event.origin) == -1) {
          console.log("genepanel.iobio: Message not from trusted sender. Event.origin is " + event.origin );
          return;
        }
        this.clinIobioUrl = event.origin;


        var clinObject = JSON.parse(event.data);
        // setInterval(()=>{
        //   if (this.uniqueGenes && this.uniqueGenes.length > 0) {
        //     this.autoSaveGenes();
        //   }
        // },3000)

        // Clin is requesting the selected genes, so send them.
        if (clinObject.type == 'request-genes') {
          if (this.uniqueGenes && this.uniqueGenes.length > 0) {
            // this.checkForUnknownGenes();
            this.copyAllGenes();
            // setInterval(()=>{
            //   if (this.uniqueGenes && this.uniqueGenes.length > 0) {
            //     this.autoSaveGenes();
            //   }
            // },3000)

          }
        }

        //Clin is sending data to set the state
        else if(clinObject.type == 'set-data'){
          if (clinObject.genes && clinObject.genes.length > 0 && clinObject.phenotypes && clinObject.phenotypes.length > 0) {
            this.clinSearchedGtr = clinObject.phenotypes[0];
            this.clinsearchedPhenolyzer = clinObject.phenotypes[1];
            this.clinGenes = clinObject.genes;
            this.clinGenesGtr = clinObject.genesGtr;
            this.clinGenesPhenolyzer = clinObject.genesPhenolyzer;
            this.clinGenesManual = clinObject.genesManual;
            this.clinGenesData = clinObject.genesData;
            if(this.clinSearchedGtr && this.clinSearchedGtr.length>0){
              this.clinGtrSearchTerm = [this.clinSearchedGtr[0]];
              this.clinFetchingGtr = true;
            }
            if(this.clinsearchedPhenolyzer && this.clinsearchedPhenolyzer.length>0){
              this.clinPhenolyzerSeachTerm = [this.clinsearchedPhenolyzer[0]]
            }

          }
        }

        var responseObject = {success: true, type: 'message-received', sender: 'genepanel.iobio.io'};
        window.parent.postMessage(JSON.stringify(responseObject), this.clinIobioUrl);
      },
      sendClin: function(obj) {
        var theObject = $.extend({}, obj);
        theObject.sender = 'genepanel.iobio.io';
        window.parent.postMessage(JSON.stringify(theObject), this.clinIobioUrl);
      },
      onSearchGTR: function(searchTerm)  {
        this.searchTermGTR = searchTerm;
      },
      onSearchPhenotype: function(searchTermObject)  {
        this.searchTermPhenotype.push(searchTermObject.label);
      },
      phenotypeSearchTermArray: function(searchTerms){
        this.phenotypeSearches = searchTerms;
      },
      importedGenes: function(genes){
        this.manuallyAddedGenes = genes;
      },
      organizeClinData: function(){
        this.summaryClinTableArray = [];
        this.GtrGenesArr = [];
        this.PhenolyzerGenesArr = [];
        this.commonGtrPhenoGenes = [];
        this.uniqueGtrGenes = [];
        this.uniqueGtrData = [];
        this.uniquePheno = [];
        this.UniquePhenoData = [];

        var gtrGenes = this.selectedGtrGenes.map(gene => {
          return gene.name
        })
        this.GtrGenesArr = gtrGenes;

        var phenolyzerGenes = this.selectedPhenolyzerGenes.map(gene => {
          return gene.geneName
        })
        this.PhenolyzerGenesArr = phenolyzerGenes;

        var gtrSet = new Set(this.GtrGenesArr);
        var phenolyzerSet = new Set(this.PhenolyzerGenesArr);
        var intersectGtrPhenolyzer = new Set([...gtrSet].filter(x => phenolyzerSet.has(x)));
        this.commonGtrPhenoGenes = [...intersectGtrPhenolyzer];
        // console.log("this.commonGtrPhenoGenes",this.commonGtrPhenoGenes)

        var uniqueGtr = new Set([...gtrSet].filter(x => !phenolyzerSet.has(x)));
        this.uniqueGtrGenes = [...uniqueGtr];

        this.uniqueGtrGenes.map(x=>{
          this.selectedGtrGenes.map(y=>{
            if(x===y.name){
              this.uniqueGtrData.push({
                name: y.name,
                sourceGTR: y.searchTermIndexSVG,
                searchTermArrayGTR: y.searchTermArray,
                searchTermIndexGTR: y.searchTermIndex,
                isAssociatedGene: y.isAssociatedGene,
                geneid: y.geneid,
                geneIdLink: y.geneIdLink,
                value: y.value
              })
            }
          })
        })

        var uniquePheno = new Set([...phenolyzerSet].filter(x => !gtrSet.has(x)));
        this.uniquePheno = [...uniquePheno];

        this.uniquePheno.map(x=>{
          this.selectedPhenolyzerGenes.map(y=>{
            if(x===y.geneName){
              this.UniquePhenoData.push({
                name:y.geneName,
                sourcePheno: y.searchTermIndexSVG,
                searchTermPheno: y.searchTerm,
                searchTermIndex: y.searchTermIndex,
                geneId: y.geneId,
                geneIdLink: y.geneIdLink,
                score: y.score,
              })
            }
          })
        })

        var tempA = [];

        for(var i=0; i<this.commonGtrPhenoGenes.length; i++){
          for(var j=0; j<this.selectedPhenolyzerGenes.length; j++){
            if(this.commonGtrPhenoGenes[i]===this.selectedPhenolyzerGenes[j].geneName){
              tempA.push({
                name:this.selectedPhenolyzerGenes[j].geneName,
                rank: parseInt(this.selectedPhenolyzerGenes[j].rank),
                sourcePheno: this.selectedPhenolyzerGenes[j].searchTermIndexSVG,
                searchTermPheno: this.selectedPhenolyzerGenes[j].searchTerm,
                geneId: this.selectedPhenolyzerGenes[j].geneId,
                geneIdLink: this.selectedPhenolyzerGenes[j].geneIdLink,
                score: this.selectedPhenolyzerGenes[j].score,
              })
            }
          }
        }

        tempA.sort(function(a, b){
          return a.rank - b.rank;
        });

        for(var i=0; i<tempA.length; i++){
          for(var j=0; j<this.selectedGtrGenes.length; j++){
            if(tempA[i].name===this.selectedGtrGenes[j].name){
              tempA[i].sourceGTR = this.selectedGtrGenes[j].searchTermIndexSVG
              tempA[i].isAssociatedGene = this.selectedGtrGenes[j].isAssociatedGene
              tempA[i].searchTermArrayGTR = this.selectedGtrGenes[j].searchTermArray
              tempA[i].value = this.selectedGtrGenes[j].value
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
            isAssociatedGene: x.isAssociatedGene,
            geneIdLink: x.geneIdLink,
            geneId: x.geneId,
            searchTermArrayGTR: x.searchTermArrayGTR,
            searchTermPheno: x.searchTermPheno,
            value: x.value,
            score: x.score,
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
            sourcePheno: [],
            isAssociatedGene: x.isAssociatedGene,
            geneId: x.geneid,
            geneIdLink: x.geneIdLink,
            searchTermArrayGTR: x.searchTermArrayGTR,
            searchTermPheno: [],
            value: x.value,
            score: ""
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
            sourceGTR: [],
            isAssociatedGene: false,
            geneIdLink: x.geneIdLink,
            geneId: x.geneId,
            searchTermPheno: x.searchTermPheno,
            searchTermArrayGTR: [],
            score: x.score,
            value: ""
          }
        }))

        var tempSummaryTableArray = [];
        tempSummaryTableArray = [...arr[0],...arr[1],...arr[2]];

        var associatedGenes = [];
        var nonAssociatedGenes = [];

        tempSummaryTableArray.map(x=>{
          if(x.isAssociatedGene===true){
            associatedGenes.push(x);
          }
          else{
            nonAssociatedGenes.push(x);
          }
        })
        this.associatedGenesData = associatedGenes;

        if(associatedGenes.length){
          this.summaryClinTableArray = [...associatedGenes, ...nonAssociatedGenes];
        }
        else {
          this.summaryClinTableArray = tempSummaryTableArray;
        }
      },


    }

  }
</script>


<style lang="sass">
@import url('https://fonts.googleapis.com/css?family=Open+Sans|Poppins')
@import ../assets/sass/variables

.conditionsBox
  width: 285px
  overflow-wrap: break-word

.margin_ActiveTab
  margin-left: -8px

.container
  padding: 12px

.toolbar__side-icon
  /* margin-top: -3px; */

.tabs__slider
  height: 4px

a
  color: #1976d2

a:hover
  text-decoration: none

.badge__badge, .v-badge__badge
  height: 23px
  width: 23px
  background-color: #66d4ed
  top: -16px
  right: -25px
  /* color: black; */

.badge, .v-badge
  font-weight: 200


.badge__badge, .badge__badge .icon, .v-badge__badge, .v-badge__badge .icon
  font-size: 11px


.primary
  background-color: #66d4ed !important


.toolbar__extension
  height: 25px !important
  background-color: #2c3e50

.application .theme--dark.tabs__bar, .theme--dark .tabs__bar
  background-color: #2c3e50

.positionModal
  position: absolute !important
  right: 0 !important
  margin-right: -1px

aside
  margin-top: 64px !important
  max-height: calc(100% - 64px) !important


@media screen and (max-width: 1270px)
  aside
    margin-top: 64px !important
    max-height: calc(100% - 0px) !important

.v-list--dense .v-list__tile .v-icon
  font-size: 24px

.conditionsBox
  width: 470px
  overflow-wrap: break-word
  height:  370px
  overflow-y: scroll

.tabs__container
  height: 50px
  font-family: $app-font
  padding-top: 5px

.card__title, .card__text
  font-family: $app-font


.list__tile__title
  font-family: $app-font


.Rightbar_CardHeading
  font-size: 16px
  font-weight: 550

.Rightbar_card_content_subheading
  margin-top: 0px
  margin-bottom: 0px
  font-size: 16px

.Rightbar_card_content_heading
  font-size: 26px

.Rightbar_card_divider
  margin-top: 10px
  margin-bottom: 10px

.activeCardBox
    border-bottom: 6px solid $activeCard-border
    border-top-right-radius: 8px
    border-top-left-radius: 8px

.rightbarCard
  border-top-right-radius: 8px
  border-top-left-radius: 8px

nav.toolbar, nav.v-toolbar
  background-color: $app-color !important
  font-weight: 300 !important

  .toolbar__side-icon.btn.btn--icon, .v-toolbar__side-icon.v-btn.v-btn--icon
    max-width: 40px
    min-width: 40px

  .toolbar__items, .v-toolbar__items
    width: 60%

  .btn, .v-btn
    margin: 0px
    min-width: 120px
    height: 40px
    font-weight: 600

    .btn__content, .v-btn__content
      padding: 0 0px


  i.material-icons
    margin-right: 2px



  .toolbar__title, .v-toolbar__title
    font-size: 24px
    margin-right: 5px
    margin-left: 5px
    padding-bottom: 5px
    min-width: 130px

    span
      font-family: $iobio-font
      font-weight: 400


.list__tile__title, .v-list__tile__title
  .icon
    font-size: 17px

.tabTitle
  color: $text-color !important
  font-size: 18px
  text-transform: none
  font-weight: normal


.tabs__item
  .badge
    background-color: white !important

.tabs__slider.accent
  background-color: $app-color-secondary !important
  border-color: $app-color-secondary !important

button.btnColor.blue.darken-1
  background-color: $app-color-primary !important
  border-color: $app-color-primary !important

.tabs__item
  .badge__badge
    color: white !important
    font-size: 13px !important

.chip.chip--outline.primary.primary--text
  background-color: $app-color-primary !important
  border-color: $app-color-primary !important
  color: white !important


  font-size: 15px
  font-weight: bold
  font-family: $app-font

.checkbox.input-group.input-group--selection-controls.accent--text
  color: $app-gray !important
  // color:  $default-cb-accent !important
  // color: #9babff !important

.accent--text
  color: $accent-text-color !important
  // color: $app-color-primary !important

.emphasize
  .input-group--select
    label
      color: $app-color-primary !important

.filter-icon
  color: rgba(0,0,0,.54)
  fill: rgba(0,0,0,.54)

.alert.warning
  background-color: $info-color !important
  color: $text-color !important
  width: 400px

.fixed-top-tabs
  position: fixed
  top: 64px
  width: 100%

.tab-content
  margin-top: 120px

.activeTab
  background-color: $activeTab-background-color
  color: $app-utilities-color
  border-left: 8px solid $app-color

.activeTabText
  font-weight: 600

.close-button
  padding-right: 0px
  position: absolute
  right: 0px
  display: inline-block
  margin-left: 0px
  min-width: 22px
  top: 0px

  i.material-icons
    font-size: 22px
    color: $text-color !important

.badge-bg-color
    background-color: #fff0
    font-size: 18px

.header-nav-bar
  height: 64px
  background: white


.dropdown-menu
  .active
    a
      background-color: $app-color

.clinButtonColor
  color: #717171 !important



//
// Clin specific styling
//
nav.toolbar, nav.v-toolbar
  &.clin
    font-family: $app-font-clin !important
    text-color:  $text-color-clin
    background-color: $nav-color-clin !important
    color: $app-color-clin !important
    .v-toolbar__content
      padding-left: 10px
      .v-btn
        text-transform:  none !important
        font-weight: normal
        font-size: 14px

    .v-toolbar__title
      span
        font-size: 18px
        font-family: $iobio-font-clin

    -webkit-box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.05), 0px 1px 1px 0px rgba(0,0,0,0.03), 0px 1px 3px 0px rgba(0,0,0,0.01) !important
    box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.05), 0px 1px 1px 0px rgba(0,0,0,0.03), 0px 1px 3px 0px rgba(0,0,0,0.01) !important

.v-content
  &.clin
    font-family: $app-font-clin !important
    color:  $text-color-clin

    .container.fluid
      background-color: $app-background-clin
    h1, h2, h3, h4, h5, h6, label
      color:  $text-color-clin
      font-family: $app-font-clin !important
    h3
      font-size: 16px
      color: $app-color-clin
    .v-card__text
      color: $text-color-clin
      font-family: $app-font-clin !important
    .header-nav-bar
      height: 45px
      background-color: initial

    .btnColor
      background-color: $app-color-clin !important

    .genepanelsRect
      fill:  $app-color-clin !important

    .activeCardBox
      border-bottom-color:  $active-card-color-clin !important
      border-bottom-width:  4px !important

    #genes-table

    .v-chip.orange
      background-color:  $orange-chip-color-clin !important
      border-color:      $orange-chip-color-clin !important

    .v-card
      -webkit-box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.05), 0px 1px 1px 0px rgba(0,0,0,0.03), 0px 1px 3px 0px rgba(0,0,0,0.01) !important
      box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.05), 0px 1px 1px 0px rgba(0,0,0,0.03), 0px 1px 3px 0px rgba(0,0,0,0.01) !important

    .v-chip:not(.orange)
      background-color:  $app-color-clin !important
      color: white !important
      border-color: $app-color-clin !important

    .primary--text
      color: $app-color-clin !important
aside
  font-family: $app-font-clin !important
  text-color:  $text-color-clin
  &.clin
    margin-top: 45px !important

    .v-badge__badge.primary
      background-color: $app-color-clin !important
      border-color: $app-color-clin !important

    .activeTab
      border-left-color: $app-color-clin !important

</style>
