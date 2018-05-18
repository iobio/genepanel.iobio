<template>
  <div>
    <div id="app">
      <v-app id="inspire">
        <v-container fluid grid-list-md>
          <v-layout row wrap style="margin-top:-5px;">
            <v-flex d-flex xs12>
              <v-card>
                <v-card-text style="margin-bottom:-5px">
                  <div class="mb-1">
                    The Genetic Testing Registry (GTR®) provides a central location for voluntary submission of genetic test information by providers. The scope includes the test's purpose, methodology, validity, evidence of the test's usefulness, and laboratory contacts and credentials. The overarching goal of the GTR is to advance the public health and research into the genetic basis of health and disease.
                  </div>

                  <DisorderSearch
                    v-on:showDiseases="addDiseases($event)"
                    @search-gtr="onSearchGTR">
                  </DisorderSearch>

                </v-card-text>
              </v-card>
            </v-flex>

            <v-flex d-flex xs12 >
              <v-card >
                <v-card-title primary class="title" style="padding-bottom:">
                   <span class="pl-1 text-xs-center" v-if="selectedGenesText.length>1">
                      <v-chip outline color="primary">{{ selectedGenesText }}</v-chip>
                   </span>
                </v-card-title>

                  <v-layout row wrap>
                   <v-flex xs4 class="pr-4 pl-5" >
                    <!-- <div class="d-flex mt-1 mb-2 xs12">

                      <PieChartSelectorBackup
                        v-if="diseases.length && modeOfInheritanceProps.length > 1"
                        v-bind:modeOfInheritanceData="modeOfInheritanceProps"
                        :color="chartColor">
                      </PieChartSelectorBackup>

                    </div> -->
                    <div class="d-flex mb-2 xs12">

                      <!-- <GeneMembership
                        v-if="geneProps.length && diseasesProps.length && modeOfInheritanceProps.length"
                        v-bind:GeneData="geneProps"
                        :color="barColor">
                      </GeneMembership> -->

                    </div>

                    <div class="d-flex xs12">

                      <!-- <ConditionsDistribution
                          v-if="geneProps.length && diseasesProps.length"
                          v-bind:distributionData="geneProps"
                          :color="barColor">
                      </ConditionsDistribution> -->

                    </div>
                   </v-flex>

                   <v-flex  xs12 >
                      <show-gene-panel1
                      v-if="geneProps.length && diseasesProps.length && modeOfInheritanceProps.length"
                        v-bind:GeneData="geneProps"
                        v-bind:modeOfInheritanceData="modeOfInheritanceProps"
                        v-on:UpdateSelectedGenesText="ChangeSelectedGenesText($event)"
                        v-on:NoOfGenesSelectedFromGTR="UpdateNoOfGenesSelectedFromGTR($event)"
                        v-on:SelectedGenesToCopy="UpdateListOfSelectedGenes($event)">
                      </show-gene-panel1>
                   </v-flex>
                  </v-layout>
              </v-card>
            </v-flex>

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
          </v-layout>
        </v-container>
      </v-app>
    </div>

</div>
</template>

<script>
import DisorderSearch from './DisorderSearch.vue';
import DiseasesPanel from './DiseasesPanel.vue';
import GenePanel from './GenePanel.vue';
import ShowGenePanel1 from './ShowGenePanel1.vue';
import { bus } from '../../routes';
import PieChartSelectorBackup from '../viz/PieChartSelectorBackup.vue';
import ConditionsDistribution from '../viz/ConditionsDistribution.vue';
import GeneMembership from '../viz/GeneMembership.vue'

export default {
  components: { //Registering locally for nesting!
    'DisorderSearch': DisorderSearch,
    'disease-panel': DiseasesPanel,
    'gene-panel': GenePanel,
    'show-gene-panel1': ShowGenePanel1,
    'PieChartSelectorBackup': PieChartSelectorBackup,
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
    },
    chartColor: null,
    barColor: null
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
      this.$emit("GeneMembershipData", e);
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
      this.$emit("modeOfInheritanceData", e);
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
    },
    onSearchGTR: function(genes, phenotype) {
      this.$emit('search-gtr', genes, phenotype)
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
