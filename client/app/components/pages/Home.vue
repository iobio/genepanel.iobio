<template>
  <div>
    <!-- <datatableExample></datatableExample> -->
    <!-- <multiSelectExample></multiSelectExample> -->
    <!-- <d3Example></d3Example> -->

    <div id="app">
      <v-app id="inspire">
        <v-container fluid grid-list-md>

          <!-- <v-layout row justify-center>
          <v-flex xs12 sm12 md12 lg12 margin-top:4px>
            <v-card >
              <v-card-text>
                <app-gtr
                  v-on:showDiseases="addDiseases($event)">
                </app-gtr>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout> -->

          <v-layout row wrap style="margin-top:-30px;">
            <!-- <v-flex d-flex xs12 sm12 md3 lg3>
              <v-card >
                <v-card-title primary class="title">Filters</v-card-title>
                <v-card-text>
                  <FilterPanel
                    v-bind:vendorsData="vendorList"
                    v-bind:disordersData="disorderNamesList"
                    v-on:setSelectedVendors="updateSelectedVendors($event)"
                    v-on:setSelectedDisorders="updateSelectedDisorders($event)">
                  </FilterPanel>
                </v-card-text>
              </v-card>
            </v-flex> -->


            <v-flex d-flex xs12 sm12 md12 lg12>
                <v-card-text>
                  <v-layout row wrap>
                    <v-flex d-flex xs12 sm12 md12>
                      <v-card>
                        <v-card-text style="margin-bottom:-20px">
                          <app-gtr
                            v-on:showDiseases="addDiseases($event)">
                          </app-gtr>
                        </v-card-text>
                      </v-card>
                    </v-flex>


                    <v-flex d-flex xs12 sm12 md12>
                      <v-card style="margin-top:4px">
                       <v-card-title primary class="title">Results &nbsp; <span class="text-xs-center" v-if="selectedGenesText.length>1"><v-chip outline color="primary">{{ selectedGenesText }}</v-chip></span></v-card-title></center>
                        <!-- <span v-if="selectedGenesText.length>1"><strong><center>{{ selectedGenesText }}</center></strong></span> -->
                        <!-- <span>
                          <strong>
                            <center>
                              Select top &nbsp; <input v-on:focusout="selectNumberOfTopGenes" type="number" style="width:5%; padding: 5px ;border: 1px solid #c6c6c6 ;" v-model="NumberOfTopGenes"> genes
                              &nbsp;<a><v-icon v-on:click="selectNumberOfTopGenes">navigate_next</v-icon></a>
                            </center>
                          </strong>
                          </span> -->
                        <v-card-text>

                          <v-layout row wrap>
                            <v-flex d-flex xs12 sm12 md4>
                              <center>
                                <PieChartSelectorBackup
                                    v-if="diseases.length &&modeOfInheritanceProps.length"
                                    v-bind:modeOfInheritanceData="modeOfInheritanceProps">
                                  </PieChartSelectorBackup>
                                </center>
                            </v-flex>
                            <v-flex d-flex xs12 sm12 md4>
                                <center>
                                  <GeneMembership
                                  v-if="geneProps.length && diseasesProps.length &&modeOfInheritanceProps.length"
                                  v-bind:GeneData="geneProps">
                                </GeneMembership>
                              </center>
                            </v-flex>
                            <v-flex d-flex xs12 sm12 md4>
                                <center>
                                  <ConditionsDistribution
                                    v-if="geneProps.length && diseasesProps.length"
                                    v-bind:distributionData="geneProps">
                                </ConditionsDistribution>
                              </center>
                            </v-flex>

                          </v-layout>

                          <!-- <v-layout row wrap>
                            <v-flex d-flex xs12 sm6 md6>
                              <v-card >
                                <v-card-title primary class="title">Gene distribution across panels</v-card-title>
                                <GenePanelDistribution
                                    v-if="geneProps.length && diseasesProps.length"
                                    v-bind:distributionData="geneProps">
                                </GenePanelDistribution>
                              </v-card>
                            </v-flex>
                            <v-flex d-flex xs12 sm6 md6>
                              <v-card >
                                <v-card-title primary class="title">Conditions distribution across panels</v-card-title>
                                <ConditionsDistribution
                                    v-if="geneProps.length && diseasesProps.length"
                                    v-bind:distributionData="geneProps">
                                </ConditionsDistribution>
                              </v-card>
                            </v-flex>

                          </v-layout> -->

                          <show-gene-panel1
                          v-if="geneProps.length && diseasesProps.length &&modeOfInheritanceProps.length"
                            v-bind:GeneData="geneProps"
                            v-bind:modeOfInheritanceData="modeOfInheritanceProps"
                            v-on:UpdateSelectedGenesText="ChangeSelectedGenesText($event)"
                            v-on:NoOfGenesSelectedFromGTR="UpdateNoOfGenesSelectedFromGTR($event)"
                            v-on:SelectedGenesToCopy="UpdateListOfSelectedGenes($event)">
                          </show-gene-panel1>
                        </v-card-text>
                      </v-card>
                    </v-flex>

                    <br>
                    <v-flex d-flex xs12 sm12 md12 style="visibility:hidden; height:0px">
                      <v-card >
                        <v-card-title primary class="title">Disorders</v-card-title>
                        <v-card-text>
                          <disease-panel
                            v-if="diseases.length"
                            v-bind:DiseasePanelData="diseases"
                            v-on:selectedDiseases="selectDiseases($event)"
                            v-on:setDisorderNamesList="updateDisorderNamesList($event)"
                            v-on:PieChartSelectorData="PieChartSelectorData($event)"
                            v-bind:selectedDisordersProps="selectedDisordersList">
                          </disease-panel>
                        </v-card-text>
                      </v-card>
                    </v-flex>
                    <br>

                    <v-flex d-flex xs12 sm12 md12 style="visibility:hidden; height:0px">
                      <v-card >
                        <v-card-title primary class="title">Panels</v-card-title>
                        <v-card-text>
                          <gene-panel
                            v-if="diseasesProps.length"
                            v-bind:DiseasePanelData="diseasesProps"
                            v-on:selectedPanels="selectPanels($event)"
                            v-on:setVendorList="updateVendorList($event)"
                            v-bind:selectedVendorsProps="selectedVendorsList">
                          </gene-panel>
                        </v-card-text>
                      </v-card>
                    </v-flex>

                    <br>


                 </v-layout>
                </v-card-text>
            </v-flex>

          </v-layout>
        </v-container>
      </v-app>
    </div>

</div>
</template>

<script>
import Gtr from './Gtr.vue';
import DiseasesPanel from './DiseasesPanel.vue';
import GenePanel from './GenePanel.vue';
import ShowGenePanel from './ShowGenePanel.vue';
import ShowGenePanel1 from './ShowGenePanel1.vue';
import typeaheadExample from './typeahead-example.vue';
import datatableExample from './datatable-example.vue';
import multiSelectExample from './MultiSelectExample.vue';
import FilterPanel from './FilterPanel.vue';
import NavigationBar from './NavigationBar.vue';
import d3Example from './d3Example.vue';
import { bus } from '../../routes';
import PieChartSelectorBackup from '../viz/PieChartSelectorBackup.vue';
import GenePanelDistribution from './GenePanelDistribution.vue';
import ConditionsDistribution from '../viz/ConditionsDistribution.vue';
import GeneMembership from './GeneMembership.vue'

export default {
  components: { //Registering locally for nesting!
    'app-gtr': Gtr,
    'disease-panel': DiseasesPanel,
    'gene-panel': GenePanel,
    'show-gene-panel1': ShowGenePanel1,
    'show-gene-panel': ShowGenePanel,
    'typeaheadExample':typeaheadExample,
    'datatableExample':datatableExample,
    'multiSelectExample':multiSelectExample,
    'd3Example':d3Example,
    'FilterPanel':FilterPanel,
    'NavigationBar': NavigationBar,
    'PieChartSelectorBackup': PieChartSelectorBackup,
    'GenePanelDistribution': GenePanelDistribution,
    'ConditionsDistribution': ConditionsDistribution,
    'GeneMembership': GeneMembership
  },
  name: 'home',
  props: {
    selectedVendorsListCB:{
      type: Array
    },
    selectedDisordersListCB:{
      type: Array
    }
  },
  data() {
    return {
      diseases: [],
      diseasesProps: [],
      geneProps: [],
      vendorList: [],
      selectedVendorsList: [],
      modeOfInheritanceProps: [],
      disorderNamesList: [],
      selectedDisordersList: [],
      showSummaryComponent: false,
      NumberOfTopGenes: 50,
      selectedGenesText: "",
      selectedVendorsListFromFilterCB:[],
      GtrGenesTabNumber: 0,
    }
  },
  watch:{
    selectedVendorsListCB: function(){
      this.selectedVendorsList = this.selectedVendorsListCB
    },
    selectedDisordersListCB: function(){
      this.selectedDisordersList = this.selectedDisordersListCB
    }
  },
  mounted(){
  },
  methods: {
    selectNumberOfTopGenes: function(){
      if(this.NumberOfTopGenes>0){
        bus.$emit('SelectNumberOfGenes', this.NumberOfTopGenes);
        this.flagForNumberOfGenesSelected= true;
      }
      else if (this.NumberOfTopGenes<0) {
        document.getElementById("geneSelection").reset();
      }
    },
    addDiseases: function(e){
      console.log("e is from home: addDiseases ", e)
      this.showSummaryComponent = true
      this.diseases = e;
      this.$emit("diseasesCB", e);
      if(e.length<= 0){
        this.geneProps = [];
        this.diseasesProps = [];
        this.vendorList=[];
        this.disorderNamesList=[];
        this.modeOfInheritanceProps=[];
        this.selectedGenesText = ""
      }
    },
    selectDiseases: function(e){
    //  console.log("e is from home: ", e)
      this.diseasesProps = e;
    },
    selectPanels: function(e){
    //  console.log("e is from home for selected panels: ", e)
      this.geneProps = e;
    },
    updateVendorList: function(e){
      // console.log("vendor list as callback to home", e);
      this.vendorList = e;
      this.$emit("vendorListCB", e);
    },
    updateSelectedVendors: function(e){
      // console.log("selected vendors from callback to home", e);
      this.selectedVendorsList = e;
    },
    PieChartSelectorData: function(e){
      this.modeOfInheritanceProps = e;
    },
    updateDisorderNamesList: function(e){
      // console.log("disorderNamesList from callback to home", e);
      this.disorderNamesList = e;
      this.$emit("disorderNamesListCB", e)
    },
    updateSelectedDisorders: function(e){
      // console.log("selected disorders from callback to home ", e)
      this.selectedDisordersList = e;
    },
    ChangeSelectedGenesText: function(e){
      this.selectedGenesText = e;
    },
    UpdateNoOfGenesSelectedFromGTR: function(e){
      this.GtrGenesTabNumber = e;
      this.$emit("UpdateNumberOfGenesSelectedFromGTR", e)
    },
    UpdateListOfSelectedGenes: function(e){
      this.$emit("UpdateListOfSelectedGenesGTR", e);
    }
  }
}
</script>

<style >
@import url('https://fonts.googleapis.com/css?family=Quicksand:500');
@import url('https://fonts.googleapis.com/css?family=Open+Sans');

  .toolbar__title{
    /* color: #66D4ED; */
    font-family: 'Quicksand', sans-serif;
    font-size: 24px;
  }

  label, strong, th{
    font-family: 'Open Sans', sans-serif;
  }

  center, span, h1, h2, h3, h4{
    font-family: 'Open Sans', sans-serif;
  }

  .btn__content{
    font-family: 'Open Sans', sans-serif;
  }

  .btn{
    padding: 0px
  }
</style>
