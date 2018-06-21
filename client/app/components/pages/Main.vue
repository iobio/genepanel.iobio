<template>
  <div id="app">
  <v-app id="inspire">
    <!-- <back-to-top text="Back to top" visibleoffset="500"></back-to-top> -->

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
          v-bind:class="[component==='GeneticTestingRegistry' ? 'activeTab' : '']"
          @click="component='GeneticTestingRegistry'">
         <v-list-tile-action v-bind:class="[component==='GeneticTestingRegistry' ? 'margin_ActiveTab' : '']">
           <span v-if="component==='GeneticTestingRegistry'"><v-icon color="primary darken-1">dashboard</v-icon></span>
           <span v-else><v-icon>dashboard</v-icon></span>
         </v-list-tile-action>
         <v-list-tile-content>
           <v-list-tile-title>
             Genetic Testing Registry
             <v-badge color="primary darken-1" right class="badge-bg-color">
               <span  slot="badge">{{ NumberOfGenesSelectedFromGTR }}</span>
             </v-badge>
           </v-list-tile-title>
         </v-list-tile-content>
       </v-list-tile>

       <v-list-tile
          v-bind:class="[component==='Phenolyzer' ? 'activeTab' : '']"
          @click="component='Phenolyzer'">
         <v-list-tile-action v-bind:class="[component==='Phenolyzer' ? 'margin_ActiveTab' : '']">
           <span v-if="component==='Phenolyzer'"><v-icon color="primary darken-1">dashboard</v-icon></span>
           <span v-else><v-icon>dashboard</v-icon></span>
         </v-list-tile-action>
         <v-list-tile-content>
           <v-list-tile-title>
             Phenolyzer
             <v-badge color="primary" right class="badge-bg-color">
              <span slot="badge">{{ NumberOfGenesSelectedFromPhenolyzer }}</span>
            </v-badge>
           </v-list-tile-title>

         </v-list-tile-content>
       </v-list-tile>

       <v-list-tile
          v-bind:class="[component==='SummaryTab' ? 'activeTab' : '']"
          @click="component='SummaryTab'">
         <v-list-tile-action v-bind:class="[component==='SummaryTab' ? 'margin_ActiveTab' : '']">
           <span v-if="component==='SummaryTab'"><v-icon color="primary darken-1">dashboard</v-icon></span>
           <span v-else><v-icon>dashboard</v-icon></span>
         </v-list-tile-action>
         <v-list-tile-content>
           <v-list-tile-title>
             Summary
             <v-badge color="primary" right class="badge-bg-color">
              <span slot="badge">{{ NumberOfAllGenes }}</span>
            </v-badge>
           </v-list-tile-title>
         </v-list-tile-content>
       </v-list-tile>

       <v-divider></v-divider>
       <v-list-tile @click="">
         <v-list-tile-action>
           <v-icon>settings</v-icon>
         </v-list-tile-action>
         <v-list-tile-content>
           <v-list-tile-title>Settings</v-list-tile-title>
         </v-list-tile-content>
       </v-list-tile>
       <v-list-tile @click="">
         <v-list-tile-action>
           <v-icon>help</v-icon>
         </v-list-tile-action>
         <v-list-tile-content>
           <v-list-tile-title>Help</v-list-tile-title>
         </v-list-tile-content>
       </v-list-tile>
     </v-list>

    </v-navigation-drawer>
    <v-toolbar
      :class="launchedFromClin ? 'clin' : '' "
      dark
      :clipped-left="$vuetify.breakpoint.mdAndUp"
      fixed
      style="width:300px"
    >
      <v-toolbar-title >
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span >panel.iobio</span>
      </v-toolbar-title>

    </v-toolbar>

    <div>
      <v-content>
            <div style="width:100%; height:64px; background:white">
              <v-card-text>
                <span v-if="component==='GeneticTestingRegistry'" style="font-size:18px">
                  Genetic Testing Registry
                  <v-menu open-on-hover top offset-y>
                    <p style="font-size:13px;" slot="activator"><v-icon small  >help</v-icon></p>
                      <v-card>
                        <v-card-text >
                          <br>
                          <strong>The Genetic Testing Registry (GTR®)</strong> provides a central location for voluntary submission of genetic test information by providers.
                          <br>
                          The scope includes the test's purpose, methodology, validity, evidence of the test's usefulness, and laboratory contacts and credentials.
                          <br>
                          The overarching goal of the GTR is to advance the public health and research into the genetic basis of health and disease.
                          <br><br>
                        </v-card-text>
                      </v-card>
                  </v-menu>
                </span>
                <span v-else-if="component==='Phenolyzer'" style="font-size:18px">
                  Phenolyzer
                  <v-menu open-on-hover top offset-y>
                    <p style="font-size:13px;" slot="activator"><v-icon small  >help</v-icon></p>
                      <v-card>
                        <v-card-text >
                          <br>
                          Enter phenotype terms in the search box below to use the Phenolyzer tool to generate list of genes.
                          <br>
                          <strong>Phenolyzer</strong> stands for Phenotype Based Gene Analyzer, a tool focusing on discovering genes based on user-specific disease/phenotype terms.
                          <br>
                          <a href="http://phenolyzer.wglab.org/">Read more</a>
                          <br><br>
                        </v-card-text>
                      </v-card>
                  </v-menu>
                </span>
                <span v-else-if="component==='SummaryTab'" style="font-size:18px">
                  Summary
                  <v-menu open-on-hover top offset-y>
                    <p style="font-size:13px;" slot="activator"><v-icon small  >help</v-icon></p>
                      <v-card>
                        <v-card-text >
                          <br>
                          <strong>The Genetic Testing Registry (GTR®)</strong> provides a central location for voluntary submission of genetic test information by providers.
                          <br>
                          The scope includes the test's purpose, methodology, validity, evidence of the test's usefulness, and laboratory contacts and credentials.
                          <br>
                          The overarching goal of the GTR is to advance the public health and research into the genetic basis of health and disease.
                          <br><br>
                        </v-card-text>
                      </v-card>
                  </v-menu>
                </span>
                <p class="text-xs-right" style="margin-top:-37px">
                  <v-menu bottom offset-y style="color:black">
                    <v-btn flat slot="activator"
                    ><v-icon style="padding-right:4px">input</v-icon>
                      <strong style="color:#222">Export</strong>
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


                  <v-menu bottom offset-y style="color:black">
                    <v-btn flat slot="activator"
                      ><v-icon style="padding-right:4px">apps</v-icon>
                    </v-btn>
                    <v-list>
                      <v-list-tile >
                        <v-list-tile-title><a href="http://gene.iobio.io/">gene.iobio</a> </v-list-tile-title>
                      </v-list-tile>
                      <v-list-tile >
                        <v-list-tile-title><a href="http://bam.iobio.io/">bam.iobio</a> </v-list-tile-title>
                      </v-list-tile>
                      <v-list-tile >
                        <v-list-tile-title><a href="http://vcf.iobio.io/">vcf.iobio</a> </v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>

                </p>
              </v-card-text>

            </div>
          <!-- </v-card>

        </v-flex> -->
        <div style="background:white; height:auto">
          <keep-alive>

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
            <!--
              <HomePage v-else-if="component==='HomePage'"></HomePage>
            -->
              <Phenolyzer
                v-if="component==='Phenolyzer'"
                v-on:NoOfGenesSelectedFromPhenolyzer="updatePhenolyzerTabBadge($event)"
                v-on:SelectedPhenolyzerGenesToCopy="updatePhenolyzerGenes($event)"
                @search-phenotype="onSearchPhenotype">
              </Phenolyzer>
              <SummaryTab
                v-else-if="component==='SummaryTab'"
                v-bind:NumberOfGtrGenes="NumberOfGenesSelectedFromGTR"
                v-bind:NumberOfPhenolyzerGenes="NumberOfGenesSelectedFromPhenolyzer"
                v-bind:GtrGenesForSummary="selectedGtrGenes"
                v-bind:PhenolyzerGenesForSummary="selectedPhenolyzerGenes"
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
import FilterGTR from './FilterGTR.vue';
import FilterPhenolyzer from './FilterPhenolyzer.vue';
import FilterSummary from './FilterSummary.vue';
var FileSaver = require('file-saver');
import DisorderSearch from './DisorderSearch.vue';


  export default {
    components: {
      'GeneticTestingRegistry': GeneticTestingRegistry,
      'Phenolyzer': Phenolyzer,
      // 'HomePage': HomePage,
      'SummaryTab': SummaryTab,
      'FilterGTR': FilterGTR,
      'DisorderSearch': DisorderSearch,
      'FilterPhenolyzer': FilterPhenolyzer,
      'FilterSummary': FilterSummary,
    },
    data(){
      return{
        component: 'GeneticTestingRegistry',
        drawer: false,
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
        searchTermPhenotype: null,
        modeOfInheritanceProps: [],
        GeneMembershipProps: [],
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
    mounted(){
      bus.$on("updateAllGenes", (data)=>{
        this.updateAllGenesFromSelection(data);
      });
      // bus.$on("openNavDrawer", ()=>{
      //   this.drawer = true;
      // })
      window.addEventListener("message", this.receiveClin, false);
    },
    updated(){
    },
    methods: {
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
        var geneNamesToString = geneNames.toString();
        var genesToCopy = geneNamesToString.replace(/,/gi , ' ');
        this.$clipboard(genesToCopy);

        this.sendClin({'type': 'apply-genes', source: 'gtr', genes: geneNames, searchTerms: [this.searchTermGTR]});

        if(this.selectedGtrGenes.length>0){
          this.snackbarText = " Number of Genes Copied : " + this.selectedGtrGenes.length + " ";
        }
        this.snackbar=true;
      },
      copyPhenolyzerGenes: function(){
        var geneNames = this.selectedPhenolyzerGenes.map(gene => {
          return gene.geneName
        })
        var geneNamesToString = geneNames.toString();
        var genesToCopy = geneNamesToString.replace(/,/gi , ' ');
        this.$clipboard(genesToCopy);

        this.sendClin({'type': 'apply-genes', source: 'phenotype-driven', genes: geneNames, searchTerms: [this.searchTermPhenotype]});

        if(this.selectedPhenolyzerGenes.length>0){
          this.snackbarText = " Number of Genes Copied : " + this.selectedPhenolyzerGenes.length + " ";
        }
        this.snackbar=true;
      },
      copyAllGenes: function(){
        let self = this;
        var genesToCopy = this.uniqueGenes.toString();

        this.$clipboard(genesToCopy);

        this.sendClin({
          type: 'apply-genes',
          source: 'all',
          genes: self.uniqueGenes,
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
        var allGenes = data.map(x=>{
          return x.name;
        })
        this.uniqueGenes = allGenes;
        this.NumberOfAllGenes = this.uniqueGenes.length
      },
      receiveClin: function(event) {
        // Do we trust the sender of this message?
        // Do we trust the sender of this message?
        if (this.clinIobioUrls.indexOf(event.origin) == -1) {
          console.log("genepanel.iobio: Message not from trusted sender. Event.origin is " + event.origin );
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
        this.searchTermPhenotype = searchTermObject.label;
      }

    }

  }
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Open+Sans');

/* .activeTab{
  background-color:#D8D8D8;
  color:#ED8059;
  border-left: 8px solid #ED8059;
} */

.margin_ActiveTab{
  margin-left: -8px
}


.tabs__container{
  height:50px;
  font-family: 'Open Sans', sans-serif;
  padding-top: 5px;
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

.badge__badge{
  height:23px;
  width: 23px;
  background-color: #66d4ed;
  /* color: black; */
}


.badge{
  font-weight: 200
}

.badge__badge, .badge__badge .icon{
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



/* .navigation-drawer .navigation-drawer--clipped .navigation-drawer--fixed .navigation-drawer--open{
  margin-top: 112px !important;
} */


aside {
  margin-top: 64px !important;
  max-height: calc(100% - 64px) !important;
}
/* .btn .btn__content .icon {
  color:#66d4ed
} */

@media screen and (max-width: 1270px){
  aside {
    margin-top: 0px !important;
    max-height: calc(100% - 0px) !important;
  }
}
</style>

<style lang="sass">

@import ../assets/sass/variables

nav.toolbar
  background-color: $app-color !important
  font-weight: 300 !important

  &.clin
    background-color: $app-color-clin !important

  .toolbar__side-icon.btn.btn--icon
    max-width: 40px
    min-width: 40px

  .toolbar__items
    width: 60%

  .btn
    margin: 0px
    min-width: 120px
    height: 40px
    font-weight: 600

    .btn__content
      padding: 0 0px


  i.material-icons
    margin-right: 2px

  .toolbar__title
    font-size: 24px
    margin-right: 5px
    margin-left: 5px
    padding-bottom: 5px
    min-width: 130px

    span
      font-family: Quicksand !important
      font-weight: 400 !important

.list__tile__title
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
  color:  $default-cb-accent !important

.accent--text
  color: $app-color-primary !important

.emphasize
  .input-group--select
    label
      color: $app-color-primary !important

.filter-icon
  color: rgba(0,0,0,.54)
  fill: rgba(0,0,0,.54)

.alert.warning
  background-color: $info-color !important;
  color: $text-color !important;
  width: 400px

.fixed-top-tabs
  position: fixed
  top: 64px
  width: 100%

.tab-content
  margin-top: 120px

.activeTab
  background-color: $activeTab-background-color
  color: #e53935
  font-weight: 400
  border-left: 8px solid $app-color

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

</style>
