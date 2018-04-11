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
      :clipped="$vuetify.breakpoint.mdAndUp"
      app
      v-model="drawer"
    >
    <v-list dense>
        <v-card >
          <v-card-title primary class="title">Filters</v-card-title>
          <v-card-text>
            <keep-alive>
              <FilterGTR
                v-if="component==='Home'"
                v-bind:vendorsData="vendorList"
                v-on:setSelectedVendors="updateSelectedVendors($event)"
                v-bind:disordersData="disorderList"
                v-on:setSelectedDisorders="updateSelectedDisorders($event)">
              </FilterGTR>
            </keep-alive>
          </v-card-text>
        </v-card>
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
import FilterGTR from './FilterGTR.vue'
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
        uniqueGenes:[]
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

.card__title{
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
  height: 19px !important;
  background-color: #2c3e50 /* Removes the small line between nav and tabs*/
}


.application .theme--dark.tabs__bar, .theme--dark .tabs__bar{
  background-color: #2c3e50;
}

.tabTitle{
  color:#66d4ed
}

/* .btn .btn__content .icon {
  color:#66d4ed
} */
</style>
