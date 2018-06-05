<template>
  <div>
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
        <v-container fluid grid-list-md>
          <v-layout row wrap style="margin-top:-5px;">
            <v-flex d-flex xs12>
              <v-card>
                <v-card-text style="margin-bottom:-5px">
                  <!-- <div class="mb-1">
                    The Genetic Testing Registry (GTR®) provides a central location for voluntary submission of genetic test information by providers. The scope includes the test's purpose, methodology, validity, evidence of the test's usefulness, and laboratory contacts and credentials. The overarching goal of the GTR is to advance the public health and research into the genetic basis of health and disease.
                  </div> -->
                  <v-layout row wrap>
                    <v-flex  xs7 >
                      <DisorderSearch
                        v-bind:DisordersPropsBackArr="DisordersPropsBackArr"
                        v-on:showDiseases="addDiseases($event)"
                        @search-gtr="onSearchGTR">
                      </DisorderSearch>
                    </v-flex>

                    <v-flex  xs3 >
                      <div style="display:inline-block; padding-top:5px;">
                        <label>Genes</label>
                        <input
                          id="top-genes-input"
                          class="form-control"
                          type="text"
                          v-model="NumberOfTopGenes"
                          autocomplete="off"
                          list="genes"
                          placeholder="50">
                          <datalist id="genes">
                            <option v-for="genesCount in genesTopCounts">
                              {{ genesCount }}
                            </option>
                          </datalist>
                      </div>

                      <v-btn
                          style="margin-top:-0.35px"
                          color="blue darken-1"
                          class="btnColor"
                          v-on:click.prevent="selectNumberOfTopGenes">
                        Go
                      </v-btn>
                    </v-flex>
                    <v-flex  xs2 >
                    </v-flex>
                  </v-layout>

                </v-card-text>
              </v-card>
            </v-flex>

            <v-flex d-flex xs12 >
              <v-card >
                <!-- chip to display number of genes selected  -->
                <!-- <v-card-title primary class="title" style="padding-bottom:">
                   <span class="pl-1 text-xs-center" v-if="selectedGenesText.length>1">
                      <v-chip outline color="primary">{{ selectedGenesText }}</v-chip>
                   </span>
                </v-card-title> -->

                  <v-layout row wrap>
                    <!-- insert here  -->

                    <v-flex  xs8 >
                       <show-gene-panel1
                       v-if="geneProps.length && diseasesProps.length && modeOfInheritanceProps.length"
                         v-bind:GeneData="geneProps"
                         v-bind:modeOfInheritanceData="modeOfInheritanceProps"
                         v-on:UpdateSelectedGenesText="ChangeSelectedGenesText($event)"
                         v-on:NoOfGenesSelectedFromGTR="UpdateNoOfGenesSelectedFromGTR($event)"
                         v-on:TotalNoOfGenesFromGTR="TotalNoOfGenesFromGTR($event)"
                         v-on:SelectedGenesToCopy="UpdateListOfSelectedGenes($event)">
                       </show-gene-panel1>
                    </v-flex>


                   <v-flex xs4 class="pr-2 pl-1" >
                     <div class="d-flex mt-1 mb-2 xs12">
                       <v-card v-if="geneProps.length">
                         <v-card-title primary-title>
                          <div>
                            <div style="font-size:16px">GENES</div>
                            <span style="margin-top:0px; margin-bottom:0px; font-size:26px"><strong>{{ GtrGenesTabNumber }}</strong></span>
                            <div>of {{ TotalGtrGenes }} selected</div>
                          </div>
                        </v-card-title>
                       </v-card>
                     </div>

                    <div class="d-flex mt-1 mb-2 xs12">
                      <div v-if="diseases.length && modeOfInheritanceProps.length > 1">
                        <v-card v-bind:class="[chartComponent==='PieChartSelector' ? 'activeCardBox' : '']">
                          <v-card-title primary-title>
                             <div v-bind:class="[chartComponent==='PieChartSelector' ? 'disabledClass' : 'activeClass']">
                               <div style="font-size:16px">DISORDERS</div>
                               <span style="margin-top:0px; margin-bottom:0px; font-size:26px">
                                 <strong v-if="selectDisorders.length===0">{{ multiSelectDisorder.length }}</strong>
                                 <strong v-else>{{ selectDisorders.length }}</strong>
                               </span>
                               <span class="FilterAndViewBtn"
                                v-on:click="showChartComponent('PieChartSelector')">
                               View and Filter
                               </span>
                               <div>of {{ multiSelectDisorder.length }} selected</div>
                             </div>
                          </v-card-title>
                        <div v-bind:class="[chartComponent==='PieChartSelector' ? 'activeClass' : 'disabledClass']">
                          <v-card-title>
                            <PieChartSelectorBackup
                              v-bind:modeOfInheritanceData="modeOfInheritanceProps"
                              :color="chartColor">
                            </PieChartSelectorBackup>
                            <br>
                            <v-card flat >
                              <v-card-text>
                                  <v-layout>
                                      <v-select
                                        v-model="selectDisorders"
                                        label="Select Disorders"
                                        chips
                                        tags
                                        :items="multiSelectDisorder"
                                      ></v-select>
                                  </v-layout>
                              </v-card-text>
                            </v-card>
                          </v-card-title>
                          <center>
                            <span class="FilterAndViewBtn"
                              v-on:click="chartComponent=null">
                              Exit
                            </span>
                          </center>
                          <br>
                        </div>
                      </v-card>
                    </div>
                  </div>

                    <div class="d-flex mb-2 xs12">
                      <div v-if="geneProps.length && diseasesProps.length && modeOfInheritanceProps.length"">
                        <v-card v-bind:class="[chartComponent==='GeneMembership' ? 'activeCardBox' : '']">
                          <v-card-title primary-title>
                             <div v-bind:class="[chartComponent==='GeneMembership' ? 'disabledClass' : 'activeClass']">
                               <div style="font-size:16px">PANELS</div>
                               <span style="margin-top:0px; margin-bottom:0px; font-size:26px"><strong>{{ genePanelsCount }}</strong></span>
                               <span class="FilterAndViewBtn"
                                v-on:click="showChartComponent('GeneMembership')">
                               View and Filter
                               </span>
                               <div>present</div>
                             </div>
                          </v-card-title>
                          <div v-bind:class="[chartComponent==='GeneMembership' ? 'activeClass' : 'disabledClass']">
                              <GeneMembership
                                v-bind:GeneData="geneProps"
                                :color="barColor">
                              </GeneMembership>
                              <center>
                                <span class="FilterAndViewBtn"
                                  v-on:click="chartComponent=null">
                                  Exit
                                </span>
                              </center>
                              <br>
                          </div>
                        </v-card>
                      </div>
                    </div>

                    <div class="d-flex xs12">
                      <div v-if="geneProps.length && diseasesProps.length && modeOfInheritanceProps.length"">
                        <v-card v-bind:class="[chartComponent==='Vendors' ? 'activeCardBox' : '']">
                          <v-card-title primary-title>
                             <div v-bind:class="[chartComponent==='Vendors' ? 'disabledClass' : 'activeClass']">
                               <div style="font-size:16px">VENDORS</div>
                               <span style="margin-top:0px; margin-bottom:0px; font-size:26px">
                                 <strong v-if="vendorsSelect.length===0">{{ vendorList.length }}</strong>
                                 <strong v-else>{{ vendorsSelect.length }}</strong>
                               </span>
                               </span>
                               <span class="FilterAndViewBtn"
                                v-on:click="showChartComponent('Vendors')">
                               View and Filter
                               </span>
                               <div>of {{ vendorList.length}} selected</div>
                             </div>
                          </v-card-title>
                          <div v-bind:class="[chartComponent==='Vendors' ? 'activeClass' : 'disabledClass']">
                            <v-card flat v-if="vendorList.length">
                              <v-card-text>
                                  <v-layout>
                                      <v-select
                                        v-model="vendorsSelect"
                                        label="Select Vendors"
                                        chips
                                        tags
                                        :items="multiSelectItems"
                                      ></v-select>
                                  </v-layout>
                              </v-card-text>
                            </v-card>
                            <v-btn v-show="vendorsSelect.length" small v-on:click="ClearVendors">Clear vendors</v-btn>
                            <br>
                            <center>
                              <span class="FilterAndViewBtn"
                                v-on:click="chartComponent=null">
                                Exit
                              </span>
                            </center>
                            <br>
                          </div>
                        </v-card>
                      </div>
                    </div>

                    <!-- <div class="d-flex xs12">

                      <ConditionsDistribution
                          v-if="geneProps.length && diseasesProps.length"
                          v-bind:distributionData="geneProps"
                          :color="barColor">
                      </ConditionsDistribution>

                    </div> -->
                   </v-flex>


                  </v-layout>
              </v-card>
            </v-flex>

            <v-flex d-flex xs12 sm12 md12 style="visibility:hidden; height:0px" >
              <v-card >
                <v-card-title primary class="title">Disorders</v-card-title>
                <v-card-text>
                  <disease-panel
                    v-if="diseases.length"
                    v-bind:DiseasePanelData="diseases"
                    v-on:selectedDiseases="selectDiseases($event)"
                    v-on:setDisorderNamesList="updateDisorderNamesList($event)"
                    v-on:PieChartSelectorData="PieChartSelectorData($event)"
                    v-bind:selectedDisordersProps="selectDisorders">
                  </disease-panel>
                </v-card-text>
              </v-card>
            </v-flex>
            <br>
<!-- style="visibility:hidden; height:0px" -->

            <v-flex d-flex xs12 sm12 md12 style="visibility:hidden; height:0px" >
              <v-card >
                <v-card-title primary class="title">Panels</v-card-title>
                <v-card-text>
                  <gene-panel
                    v-if="diseasesProps.length"
                    v-bind:DiseasePanelData="diseasesProps"
                    v-on:selectedPanels="selectPanels($event)"
                    v-on:NoOfPanels="NoOfPanels($event)"
                    v-on:setVendorList="updateVendorList($event)"
                    v-bind:selectedVendorsProps="vendorsSelect">
                    <!-- v-bind:selectedVendorsProps="selectedVendorsList"> -->
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
      NumberOfTopGenes: null,
      selectedGenesText: "",
      selectedVendorsListFromFilterCB:[],
      GtrGenesTabNumber: 0,
      DisordersPropsBackArr: [],
      chartComponent: null,
      isActive: true,
      TotalGtrGenes: 0,
      genePanelsCount:0,
      loading: false, //multiselect
      multiSelectItems: [],   //multiselect
      search: null,  //multiselect
      vendorsSelect: [],  //multiselect
      Genes: [],  //multiselect
      disordersDataList: [],
      selectDisorders: [],
      multiSelectDisorder: [],
      snackbar: false,
      snackbarText: "",
      y: 'top',
      x: null,
      mode: '',
      snackbarTimeout: 4000,
      genesTopCounts: [5, 10, 30, 50, 80, 100],
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
      if(parseInt(this.NumberOfTopGenes)>0){
        bus.$emit('SelectNumberOfGenes', parseInt(this.NumberOfTopGenes));
        this.flagForNumberOfGenesSelected= true;
        this.snackbarText = "Top " + parseInt(this.NumberOfTopGenes) + " genes selected";
        this.snackbar = true;
      }
      else if (parseInt(this.NumberOfTopGenes)<0) {
        document.getElementById("geneSelection").reset();
      }
    },
    addDiseases: function(e){
      // console.log("E", e);
      for(var i=0; i<e.length; i++){
        for(var j=e.length-1; j>i; j--){
          {
            if(e[i].Title === e[j].Title){
              // var temp = e[i].searchTerm + " , " + e[j].searchTerm;
              e[i].searchTerm = e[i].searchTerm + " " + e[j].searchTerm;
              // e[i].searchTermIndex = e[i].searchTermIndex + " , " + e[j].searchTermIndex;
              e[i].searchTermArray = [...e[i].searchTermArray, ...e[j].searchTermArray];
              e[i].searchTermIndex = [...e[i].searchTermIndex, ...e[j].searchTermIndex];
              // e[j].searchTerm = temp;
              // temp = "";
            }
          }
        }
      }

      //Remove duplicates from the disorders array.
      e = e.filter((disorder, index, self) =>
        index === self.findIndex((t) => (
          t.Title === disorder.Title
        ))
      );
      console.log(e);
      this.DisordersPropsBackArr = e;
      this.showSummaryComponent = true
      this.diseases = e;
      this.selectDisorders = [];
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
     // console.log("e is from home for selected panels: ", e)
      this.geneProps = e;
      this.$emit("GeneMembershipData", e);
    },
    updateVendorList: function(e){
      // console.log("vendor list as callback to home", e);
      this.vendorList = e;
      this.multiSelectItems = e;
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
      this.multiSelectDisorder = e;
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
    },
    showChartComponent: function(chart_component){
      this.chartComponent = chart_component;
    },
    TotalNoOfGenesFromGTR: function(e){
      this.TotalGtrGenes = e;
    },
    NoOfPanels: function(e){
      this.genePanelsCount = e.length;
    },
    ClearVendors: function(){
      this.vendorsSelect=[];
    }
  }
}
</script>

<style scoped>
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
  .cardBoxTitle{
    font-size: 16px;
    color: #000000;
  }

  .activeClass{
    display: visible;
  }
  .disabledClass{
    display: none;
  }
  .FilterAndViewBtn{
    background: #e0e0e0;
    color: rgba(68, 68, 68, 0.87);
    padding:3px 8px;
    border-radius:8px;
    cursor: pointer;
    height:30px;
    margin-left: 8px;
  }
  .activeCardBox{
    border: 1px solid #F16335;
    box-shadow: 0 2px 6px 0 #F16335;
  }
  .btnColor{
    color: white;
  }
  .btn{
    padding: 0px;
    height:34px;
  }
  .form-control{
    font-size: 15px;
  }
 #top-genes-input{
   width: 200px;
   height:35px;
   margin-top: 4px;
 }

</style>
