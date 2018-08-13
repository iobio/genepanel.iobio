<template>
  <div id="app">
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

    <v-navigation-drawer
      permanent
      app
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

       <v-divider></v-divider>
     </v-list>

    </v-navigation-drawer>
    <v-toolbar
      :class="launchedFromClin ? 'clin' : '' "
      dark
      :clipped-left="$vuetify.breakpoint.mdAndUp"
      fixed
    >
      <v-toolbar-title >
        <span >panel.iobio</span>
      </v-toolbar-title>

      <span style="margin-left:130px">
      </span>
      <v-spacer></v-spacer>
      <v-menu bottom offset-y style="color:black">
        <v-btn flat slot="activator"
        ><v-icon style="padding-right:4px">input</v-icon>
          <strong>Export</strong>
        </v-btn>
        <v-list>
          <div v-if="component==='GeneticTestingRegistry'">
            <v-list-tile @click="copyGtrGenes">
              <v-list-tile-title><v-icon>content_copy</v-icon>&nbsp; &nbsp;Copy GTR genes to clipboard</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="exportGtrGenes">
              <v-list-tile-title><v-icon>input</v-icon>&nbsp; &nbsp;Export GTR genes to file</v-list-tile-title>
            </v-list-tile>
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
        </v-list>
      </v-menu>
      <span>
        <v-dialog v-model="newAnalysisDialog" persistent max-width="350">
          <v-btn flat slot="activator"><v-icon>autorenew</v-icon><strong>Clear All</strong></v-btn>
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
      <HelpMenu></HelpMenu>
      <AppsMenu></AppsMenu>

    </v-toolbar>

    <div>
      <v-content>
        <div class="header-nav-bar" >
          <v-card-text>
            <p></p>
          </v-card-text>
        </div>
        <div style="background:white; height:auto">
          <keep-alive>
            <Overview v-if="component==='OverviewPage'"></Overview>
            <GeneticTestingRegistry
              v-if="component==='GeneticTestingRegistry'"
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
              @search-gtr="onSearchGTR">
            </GeneticTestingRegistry>
            <Phenolyzer
              v-if="component==='Phenolyzer'"
              v-on:NoOfGenesSelectedFromPhenolyzer="updatePhenolyzerTabBadge($event)"
              v-on:SelectedPhenolyzerGenesToCopy="updatePhenolyzerGenes($event)"
              @search-phenotype="onSearchPhenotype"
              @phenotypeSearchTermArray="phenotypeSearchTermArray">
            </Phenolyzer>
            <SummaryTab
              v-else-if="component==='SummaryTab'"
              v-bind:NumberOfGtrGenes="NumberOfGenesSelectedFromGTR"
              v-bind:NumberOfPhenolyzerGenes="NumberOfGenesSelectedFromPhenolyzer"
              v-bind:GtrGenesForSummary="selectedGtrGenes"
              v-bind:searchTermGTR="searchTermGTR"
              v-bind:PhenolyzerGenesForSummary="selectedPhenolyzerGenes"
              v-bind:onSearchPhenotype="phenotypeSearches"
              :chartColor="ordinalColor">
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
// import HomePage from './HomePage.vue';
import SummaryTab from './SummaryTab.vue';
var FileSaver = require('file-saver');
import DisorderSearch from './DisorderSearch.vue';
import IntroductionText from '../../../data/IntroductionText.json';
import AppsMenu from '../partials/AppsMenu.vue';
import HelpMenu from '../partials/HelpMenu.vue';
import Overview from './Overview.vue'

  export default {
    components: {
      'GeneticTestingRegistry': GeneticTestingRegistry,
      'Phenolyzer': Phenolyzer,
      'SummaryTab': SummaryTab,
      'DisorderSearch': DisorderSearch,
      'AppsMenu': AppsMenu,
      'HelpMenu': HelpMenu,
      'Overview':Overview
    },
    data(){
      return{
        component: 'OverviewPage',
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
        clinIobioUrls: ["http://localhost:4030", "http://clin.iobio.io"],
        clinIobioUrl: null,
        launchedFromClin: false,
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

      }
    },
    created(){
      this.IntroductionTextData = IntroductionText.data;
      window.addEventListener('scroll', this.handleScroll);
    },
    mounted(){
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
      window.addEventListener("message", this.receiveClin, false);
    },
    updated(){
    },
    methods: {
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
        this.selectedGtrGenes = e;
        if(e.length<=0){
          this.NumberOfGenesSelectedFromGTR = 0;
        }
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

        console.log("clinData GTR", clinData)
        var geneNamesToString = geneNames.toString();
        var genesToCopy = geneNamesToString.replace(/,/gi , ' ');
        this.$clipboard(genesToCopy);

        this.sendClin({
          'type': 'apply-genes',
          source: 'gtr',
          data: clinData,
          genes: geneNames,
          searchTerms: [this.searchTermGTR]
        });

        if(this.selectedGtrGenes.length>0){
          this.snackbarText = " Number of Genes Copied : " + this.selectedGtrGenes.length + " ";
        }
        this.snackbar=true;
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
        console.log("clinData phenolyzer" , clinData)
        var geneNamesToString = geneNames.toString();
        var genesToCopy = geneNamesToString.replace(/,/gi , ' ');
        this.$clipboard(genesToCopy);

        this.sendClin({
          'type': 'apply-genes',
          source: 'phenotype-driven',
          genes: geneNames,
          data: clinData,
          searchTerms: [this.searchTermPhenotype]
        });

        if(this.selectedPhenolyzerGenes.length>0){
          this.snackbarText = " Number of Genes Copied : " + this.selectedPhenolyzerGenes.length + " ";
        }
        this.snackbar=true;
      },
      copyAllGenes: function(){
        let self = this;
        var genesToCopy = this.uniqueGenes.toString();

        var clinData = this.summaryGenes.map(gene=> {
          return {
            name: gene.name,
            source: gene.sources,
            gtr: gene.isGtr,
            pheno: gene.isPheno
          }
        })
        console.log("clinData", clinData)
        this.$clipboard(genesToCopy);

        this.sendClin({
          type: 'apply-genes',
          source: 'all',
          genes: self.uniqueGenes,
          data: clinData,
          searchTerms:  [this.searchTermGTR, this.searchTermPhenotype]
        });

        if(this.uniqueGenes.length>0){
          this.snackbarText = " Number of Genes Copied : " + this.uniqueGenes.length + " ";
        }
        this.snackbar=true;
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
        this.summaryGenes = data;
        var allGenes = data.map(x=>{
          return x.name;
        });
        this.uniqueGenes = allGenes;
        this.NumberOfAllGenes = this.uniqueGenes.length
      },
      receiveClin: function(event) {
        // Do we trust the sender of this message?
        // Do we trust the sender of this message?
        if (this.clinIobioUrls.indexOf(event.origin) == -1) {
          // console.log("genepanel.iobio: Message not from trusted sender. Event.origin is " + event.origin );
          return;
        }
        this.launchedFromClin = true;
        this.clinIobioUrl = event.origin;

        var clinObject = JSON.parse(event.data);

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
      }

    }

  }
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Open+Sans');

.conditionsBox {
  width: 285px;
  overflow-wrap: break-word;
}

.margin_ActiveTab{
  margin-left: -8px
}

.tabs__container{
  height:50px;
  font-family: 'Open Sans', sans-serif;
  padding-top: 5px;
}

.container {
  padding: 12px;
}


.toolbar__side-icon{
  /* margin-top: -3px; */
}

.card__title, .card__text{
  font-family: 'Open Sans', sans-serif;
}

.list__tile__title{
  font-family: 'Open Sans', sans-serif;
}

.tabs__slider { /* This is for the tabs slider */
  height:4px;

}

a{
  color: #1976d2
}
a:hover {
  text-decoration: none;

}

.badge__badge, .v-badge__badge{
  height:23px;
  width: 23px;
  background-color: #66d4ed;
  top: -16px;
  right: -25px;
  /* color: black; */
}


.badge, .v-badge{
  font-weight: 200
}

.badge__badge, .badge__badge .icon, .v-badge__badge, .v-badge__badge .icon{
  font-size: 11px;
}

.primary{
  background-color: #66d4ed !important;
}

.toolbar__extension{
  height: 25px !important;
  background-color: #2c3e50 /* Removes the small line between nav and tabs*/
}


.application .theme--dark.tabs__bar, .theme--dark .tabs__bar{
  background-color: #2c3e50;
}


aside {
  margin-top: 64px !important;
  max-height: calc(100% - 64px) !important;
}

@media screen and (max-width: 1270px){
  aside {
    margin-top: 64px !important;
    max-height: calc(100% - 0px) !important;
  }
}

.v-list--dense .v-list__tile .v-icon {
  font-size: 24px;
}

</style>

<style lang="sass">

@import ../assets/sass/variables

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

  &.clin
    background-color: $app-color !important

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
      font-family: Quicksand !important
      font-weight: 400 !important

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
  font-family: Open sans

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
</style>
