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
        <v-btn flat color="pink" @click.native="snackbar = false">Close</v-btn>
      </v-snackbar>
    <v-navigation-drawer
      fixed
      width=325
      :clipped="$vuetify.breakpoint.mdAndUp"
      app
      v-model="drawer"
    >
    <v-list>
          <v-list-tile>
            <v-list-tile-title class="title">
              Filters
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
    <v-list dense>
        <!-- <v-card >
          <v-card-title primary class="title">Filters</v-card-title>
          <v-card-text> -->
            <keep-alive>
              <FilterGTR
                v-if="component==='Home'"
                v-bind:vendorsData="vendorList"
                v-on:setSelectedVendors="updateSelectedVendors($event)"
                v-bind:disordersData="disorderList"
                v-on:setSelectedDisorders="updateSelectedDisorders($event)">
              </FilterGTR>
              <FilterPhenolyzer
                v-else-if="component==='Phenolyzer'">
              </FilterPhenolyzer>
              <FilterSummary
                v-else-if="component='SummaryTab'">
              </FilterSummary>
            </keep-alive>
          <!-- </v-card-text>
        </v-card> -->
    </v-list>
    </v-navigation-drawer>
    <v-toolbar
      color="blue darken-3"
      dark
      app
      :clipped-left="$vuetify.breakpoint.mdAndUp"
      fixed
    >
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span class="hidden-sm-and-down">panel.iobio</span>
      </v-toolbar-title>
      <!-- <v-text-field
        flat
        solo-inverted
        prepend-icon="search"
        label="Search"
        class="hidden-sm-and-down"
      ></v-text-field> -->
      <v-spacer></v-spacer>
      <v-menu bottom offset-y>
          <v-btn flat slot="activator"><v-icon >input</v-icon>&nbsp; Export</v-btn>
          <v-list>
            <div v-if="component==='Home'">
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

        <v-menu bottom offset-y style="margin-left: -15px;">
            <v-btn icon slot="activator"><v-icon>help</v-icon></v-btn>
            <v-list>
              <v-list-tile @click="onShowDisclaimer">
                <v-list-tile-title>Disclaimer</v-list-tile-title>
              </v-list-tile>
              <v-list-tile @click="onShowVersion">
                <v-list-tile-title>Version</v-list-tile-title>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-title>Software and Resources</v-list-tile-title>
              </v-list-tile>

              <v-divider></v-divider>

              <v-list-tile >
                <v-list-tile-title><a style="color: rgba(0,0,0,.87)" href="http://iobio.io/tags/gene.iobio/" target="_iobio">Blog</a></v-list-tile-title>
              </v-list-tile>
              <v-list-tile >
                <v-list-tile-title><a style="color: rgba(0,0,0,.87)" href="http://gene.iobio.io/help_resources.html" target="_iobio">Tutorials</a></v-list-tile-title>
              </v-list-tile>
              <v-list-tile >
              <v-list-tile-title><a style="color: rgba(0,0,0,.87)" href="http://iobio.io" target=")iobio">iobio</a></v-list-tile-title>
              </v-list-tile>
              <v-list-tile >
                <v-list-tile-title><a style="color: rgba(0,0,0,.87)" href="http://iobio.io/support.html" target=")iobio">Support the iobio project</a></v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>


        <v-btn icon>
          <v-icon >apps</v-icon>
        </v-btn>
        &nbsp; &nbsp; &nbsp; &nbsp;
      <v-tabs style="box-shadow: 0px 3px 1px #2c3e50"
        dark tabs
        color="#2c3e50"
        slot="extension"
        grow
      >
      <v-tab v-on:click="component='HomePage'" >
        <div class="text-xs-center">
        <v-badge left style="background-color:#fff0; font-size:20px">
          <span class="tabTitle"><strong>Home</strong></span>
        </v-badge>
      </div>
      </v-tab>
        <v-tabs-slider color="cyan"></v-tabs-slider>
        <v-tab v-on:click="component='Home'">
          <div class="text-xs-center">
            <v-badge color="cyan" right style="background-color:#fff0; font-size:20px">
              <span style="paddin:20px" slot="badge">{{ NumberOfGenesSelectedFromGTR }}</span>
              <span class="tabTitle"><strong>GTR</strong></span>
            </v-badge>
          </div>
        </v-tab>

        <v-tab v-on:click="component='Phenolyzer'">
          <div class="text-xs-center">
          <v-badge color="cyan" right style="background-color:#fff0; font-size:20px">
            <span slot="badge">{{ NumberOfGenesSelectedFromPhenolyzer }}</span>
            <span class="tabTitle"><strong>Phenolyzer</strong></span>
          </v-badge>
          </div>
        </v-tab>
        <v-tab v-on:click="component='SummaryTab'">
          <div class="text-xs-center">
          <v-badge color="cyan" right style="background-color:#fff0; font-size:20px">
            <span slot="badge">{{ NumberOfAllGenes }}</span>
            <span class="tabTitle"><strong>Summary</strong></span>
          </v-badge>
          </div>
        </v-tab>

      </v-tabs>
    </v-toolbar>
    <v-content>
      <div>

        <!-- <v-tabs-items>
          <keep-alive>
            <component v-bind:is="component"></component>
          </keep-alive>
        </v-tabs-items> -->
        <v-tabs-items>
          <keep-alive>
            <Home
              v-if="component==='Home'"
              v-on:vendorListCB="updateVendors($event)"
              v-bind:selectedVendorsListCB="selectedVendorsList"
              v-on:diseasesCB=addDiseases($event)
              v-on:disorderNamesListCB="updateDisorderNames($event)"
              v-bind:selectedDisordersListCB="selectedDisordersList"
              v-on:UpdateNumberOfGenesSelectedFromGTR="updateGtrTabBadge($event)"
              v-on:UpdateListOfSelectedGenesGTR="updateGtrGenes($event)">
            </Home>
            <HomePage v-else-if="component==='HomePage'"></HomePage>
            <Phenolyzer
              v-else-if="component==='Phenolyzer'"
              v-on:NoOfGenesSelectedFromPhenolyzer="updatePhenolyzerTabBadge($event)"
              v-on:SelectedPhenolyzerGenesToCopy="updatePhenolyzerGenes($event)">
            </Phenolyzer>
            <SummaryTab
              v-else-if="component==='SummaryTab'"
              v-bind:NumberOfGtrGenes="NumberOfGenesSelectedFromGTR"
              v-bind:NumberOfPhenolyzerGenes="NumberOfGenesSelectedFromPhenolyzer"
              v-bind:GtrGenesForSummary="selectedGtrGenes"
              v-bind:PhenolyzerGenesForSummary="selectedPhenolyzerGenes">
            </SummaryTab>
          </keep-alive>
        </v-tabs-items>
      </div>
    </v-content>

    <v-dialog v-model="showDisclaimer" max-width="600">
        <v-card>
          <v-card-title class="headline">Disclaimer</v-card-title>
          <v-card-text>
                  The University of Utah makes no claims that iobio applications, including gene.iobio are approved for clinical use. All users of iobio applications including gene.iobio understand and accept that any information gained by using these applications, whether the information comes from visualization, processing, internal or external databases, or analysis, may not in any way be used for clinical purposes. The University of Utah makes no representation that iobio or gene.iobio is either safe or effective for any intended use for which research may currently be performed.
                  <br><br>
                  iobio, or any iobio applications ARE TO BE USED FOR RESEARCH PURPOSES ONLY. USE FOR CLINICAL PURPOSES IS EXPRESSLY FORBIDDEN. Approval of iobio applications for clinical use has neither been applied for, nor received, in any country, including the United States of America.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn raised  @click.native="showDisclaimer = false">Close</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="showVersion" max-width="600">
        <v-card>
          <v-card-title class="headline">Version</v-card-title>
          <v-card-text>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                  <br><br>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn raised  @click.native="showVersion = false">Close</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>


  </v-app>
</div>
</template>

<script>
import { bus } from '../../routes';
import Home from './Home.vue';
import Phenolyzer from './Phenolyzer.vue';
import NavigationBar from './NavigationBar.vue';
import HomePage from './HomePage.vue';
import SummaryTab from './SummaryTab.vue';
import FilterGTR from './FilterGTR.vue';
import FilterPhenolyzer from './FilterPhenolyzer.vue';
import FilterSummary from './FilterSummary.vue';
var FileSaver = require('file-saver');
import Gtr from './Gtr.vue';


  export default {
    components: {
      'Home': Home,
      'Phenolyzer': Phenolyzer,
      'NavigationBar': NavigationBar,
      'HomePage': HomePage,
      'SummaryTab': SummaryTab,
      'FilterGTR': FilterGTR,
      'app-gtr': Gtr,
      'FilterPhenolyzer': FilterPhenolyzer,
      'FilterSummary': FilterSummary,
    },
    data(){
      return{
        component: 'Home',
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
      }
    },
    mounted(){
      bus.$on("updateAllGenes", (data)=>{
        console.log(data)
        this.updateAllGenesFromSelection(data);
      })
    },
    updated(){
      console.log("updated!")

      // this.NumberOfAllGenes = this.NumberOfGenesSelectedFromGTR + this.NumberOfGenesSelectedFromPhenolyzer
      // var gtrGenes = this.selectedGtrGenes.map(gene => {
      //   return gene.name
      // })
      //
      // var phenolyzerGenes = this.selectedPhenolyzerGenes.map(gene => {
      //   return gene.geneName
      // })
      //
      // var allGenes = [...gtrGenes, ...phenolyzerGenes];
      // this.AllSourcesGenes = allGenes;
      //
      // this.uniqueGenes = Array.from(new Set(this.AllSourcesGenes));
      // this.NumberOfAllGenes = this.uniqueGenes.length
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
      clickFuncTemp: function(){
        // alert("functionality coming soon")
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
        if(this.selectedPhenolyzerGenes.length>0){
          this.snackbarText = " Number of Genes Copied : " + this.selectedPhenolyzerGenes.length + " ";
        }
        this.snackbar=true;
      },
      copyAllGenes: function(){
        // var gtrGenes = this.selectedGtrGenes.map(gene => {
        //   return gene.name
        // })
        //
        // var phenolyzerGenes = this.selectedPhenolyzerGenes.map(gene => {
        //   return gene.geneName
        // })
        //
        // var allGenes = [...gtrGenes, ...phenolyzerGenes];

        var genesToCopy = this.uniqueGenes.toString();
        this.$clipboard(genesToCopy);
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
          // var gtrGenes = this.selectedGtrGenes.map(gene => {
          //   return gene.name
          // })
          //
          // var phenolyzerGenes = this.selectedPhenolyzerGenes.map(gene => {
          //   return gene.geneName
          // })
          //
          // var allGenes = [...gtrGenes, ...phenolyzerGenes];
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
      }
    }

  }

</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Open+Sans');

.tabs__container{
  height:58px;
  font-family: 'Open Sans', sans-serif;
}
/* .toolbar__content{
  background-color: #174065;
} */

.toolbar__content{
  background-color: #2c3e50;
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

.badge__badge{
  height:26.5px;
  width: 26.5px;
  background-color: #66d4ed;
  color: black;
}

.badge__badge, .badge__badge .icon{
  font-size: 10px;
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

.tabTitle{
  color:#66d4ed
}

/* .navigation-drawer .navigation-drawer--clipped .navigation-drawer--fixed .navigation-drawer--open{
  margin-top: 112px !important;
} */


aside {
  margin-top: 112px !important;
  max-height: calc(100% - 112px) !important;
}
/* .btn .btn__content .icon {
  color:#66d4ed
} */
</style>
