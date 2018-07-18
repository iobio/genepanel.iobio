<template>
  <div>
    <div id="app">
      <v-app id="inspire" style="background-color:#f9fbff">
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
        <button v-on:click="scrollToTop" v-if="GoToTop" id="GoToTopBtn">Top</button>
        <v-container fluid grid-list-md>
          <v-layout row wrap style="margin-top:-5px;">
            <v-flex d-flex xs12>
              <v-card>
                <v-card-text style="margin-bottom:-5px">
                  <v-layout row wrap>
                    <v-flex xs12 sm12 md12 lg8>
                      <DisorderSearch
                        v-bind:DisordersPropsBackArr="DisordersPropsBackArr"
                        v-on:showDiseases="addDiseases($event)"
                        v-on:multipleSearchData="multipleSearchData($event)"
                        @search-gtr="onSearchGTR">
                      </DisorderSearch>
                    </v-flex>

                    <v-flex xs12 sm12 md12 lg4 >
                      <div style="display:inline-block; padding-top:5px;">
                        <label>Genes</label>
                        <input
                          :disabled="geneProps.length<1"
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
                          :disabled="geneProps.length<1"
                          style="margin-top:-0.35px"
                          class="btnColor"
                          v-on:click.prevent="selectNumberOfTopGenes">
                        Go
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-flex>

            <v-flex xs12 >
              <v-card >
                <div v-if="!disordersSearchedByUser">
                  <v-card-title>
                      <h3>{{ IntroductionTextData.Title }}</h3>
                  </v-card-title>
                  <v-card-text v-html="IntroductionTextData.Content"></v-card-text>
                </div>
              </v-card>

            </v-flex>

            <v-flex d-flex xs12  >
                  <v-layout row wrap>

                    <v-flex  xs8 >
                      <v-card>
                        <show-gene-panel1
                        v-if="geneProps.length && diseasesProps.length && modeOfInheritanceProps.length && multipleSearchItems.length"
                          v-bind:GeneData="geneProps"
                          v-bind:modeOfInheritanceData="modeOfInheritanceProps"
                          v-on:UpdateSelectedGenesText="ChangeSelectedGenesText($event)"
                          v-on:NoOfGenesSelectedFromGTR="UpdateNoOfGenesSelectedFromGTR($event)"
                          v-on:TotalNoOfGenesFromGTR="TotalNoOfGenesFromGTR($event)"
                          v-on:SelectedGenesToCopy="UpdateListOfSelectedGenes($event)"
                          v-bind:multipleSearchItems="multipleSearchItems"
                          v-bind:geneSearch="geneSearch">
                        </show-gene-panel1>
                      </v-card>
                    </v-flex>


                   <v-flex xs4 class="pr-2 pl-2" >

                     <div class="d-flex mb-2 xs12">
                       <v-card v-if="geneProps.length">
                        <v-card-title primary-title>
                          <v-text-field
                            append-icon="search"
                            label="Search Genes"
                            single-line
                            hide-details
                            v-model="geneSearch"
                          ></v-text-field>
                        </v-card-title>
                        <br>
                       </v-card>
                     </div>

                     <div class="d-flex mt-1 mb-2 xs12 mt-4">
                       <v-card v-bind:class="[chartComponent===null ? 'activeCardBox elevation-5' : 'rightbarCard ']" v-if="geneProps.length">
                         <v-card-text>
                           <center>
                             <span class="Rightbar_CardHeading">
                             GENES
                             </span>
                             <Dialogs
                               id="genesDialog"
                               class="dialogBox"
                               :HeadlineText="HelpDialogsData[0].HeadlineText"
                               :ContentText="HelpDialogsData[0].Content">
                             </Dialogs>

                           <v-divider class="Rightbar_card_divider"></v-divider>
                           <span class="Rightbar_card_content_subheading">
                             <strong class="Rightbar_card_content_heading">{{ GtrGenesTabNumber }}</strong> of {{ TotalGtrGenes }} selected
                           </span>
                           </center>
                           <SvgBar
                            class="SvgBarClass"
                            id="genesSvgBox"
                            :selectedNumber="GtrGenesTabNumber"
                            :totalNumber="TotalGtrGenes">
                           </SvgBar>
                         </v-card-text>
                       </v-card>
                     </div>

                  <div class="mt-4">
                    <v-layout wrap>
                    <v-flex xs12>
                    <div v-if="diseases.length && modeOfInheritanceProps.length > 0">
                      <v-card v-bind:class="[chartComponent==='disorders' ? 'activeCardBox elevation-5' : 'rightbarCard ']">
                        <v-card-text>
                          <center>
                            <span class="Rightbar_CardHeading">
                              ASSOCIATED DISORDERS & MODES OF INHERITANCE
                            </span>
                            <Dialogs
                              id="disordersDialog"
                              class="dialogBox"
                              :HeadlineText="HelpDialogsData[2].HeadlineText"
                              :ContentText="HelpDialogsData[2].Content">
                            </Dialogs>
                            <v-divider class="Rightbar_card_divider"></v-divider>

                           <div v-bind:class="[chartComponent==='disorders' ? 'disabledClass' : 'activeClass']">
                             <span class="Rightbar_card_content_subheading">
                               <strong class="Rightbar_card_content_heading">{{ selectDisorders.length }}</strong> of {{ multiSelectDisorder.length }} disorders selected
                             </span>
                             <SvgBar
                              class="SvgBarClass"
                              id="disordersSvgBox"
                              :selectedNumber="selectDisorders.length"
                              :totalNumber="multiSelectDisorder.length">
                             </SvgBar>
                             <br>
                             <span class="Rightbar_card_content_subheading">
                               <strong class="Rightbar_card_content_heading">{{ selectedModesOfInheritance.length }}</strong> of {{ modeOfInheritanceProps.length }} modes of inheritance selected
                             </span>
                             <SvgBar
                              class="SvgBarClass"
                              id="ModesOfInheritanceSvgBox"
                              :selectedNumber="selectedModesOfInheritance.length"
                              :totalNumber="modeOfInheritanceProps.length">
                             </SvgBar>
                             <br>
                             <v-btn :disabled="geneProps.length<1" outline color="primary darken-1" dark class="viewFilterButton" v-on:click="showChartComponent('disorders')">
                               View & Filter
                             </v-btn>
                         </div>
                       </center>
                        </v-card-text>
                      <div v-bind:class="[chartComponent==='disorders' ? 'activeClass' : 'disabledClass']">
                          <v-card flat >
                            <v-card-text style="margin-left:5px" v-on:click="DisordersAndModesComponent='disorders'">
                              <v-checkbox
                                v-for="(item, i) in multiSelectDisorder"
                                :key="i" :label="item" :value="item" id="disordersBox"
                                style="margin-top:-5px"
                                v-model="selectDisorders">
                              </v-checkbox>
                            </v-card-text>
                              <br>
                            <v-card-text style="margin-left:5px" v-on:click="DisordersAndModesComponent='modes'">
                              <v-checkbox
                                v-for="(item, j) in modeOfInheritanceProps"
                                :key="j" :label="item._modeOfInheritance" :value="item" id="modeBox"
                                style="margin-top:-5px"
                                v-model="selectedModesOfInheritance">
                              </v-checkbox>

                                <v-btn v-show="selectDisorders.length<multiSelectDisorder.length" small v-on:click="SelectAllDisordersButton">Select All Disorders</v-btn>
                            </v-card-text>
                          </v-card>
                        <!-- </v-card-title> -->
                        <center>
                          <v-btn color="primary darken-1" flat="flat" v-on:click="closeComponent">Close</v-btn>
                        </center>
                        <br>
                      </div>
                    </v-card>
                  </div>
                </v-flex>
        </v-layout>
                </div>

                    <div class="d-flex mb-2 xs12 mt-4">
                      <div v-if="geneProps.length && diseasesProps.length && modeOfInheritanceProps.length"">
                        <v-card v-bind:class="[chartComponent==='GeneMembership' ? 'activeCardBox elevation-5' : 'rightbarCard ']">
                          <v-card-text>
                            <center>
                            <span class="Rightbar_CardHeading">
                              PANELS
                            </span>
                            <Dialogs
                              id="GeneMembershipDialog"
                              class="dialogBox"
                              :HeadlineText="HelpDialogsData[3].HeadlineText"
                              :ContentText="HelpDialogsData[3].Content">
                            </Dialogs>
                            <v-divider class="Rightbar_card_divider"></v-divider>

                             <div v-bind:class="[chartComponent==='GeneMembership' ? 'disabledClass' : 'activeClass']">
                               <span class="Rightbar_card_content_subheading">
                                 <strong class="Rightbar_card_content_heading">{{ genePanelsCount }}</strong> Present
                               </span>
                               <v-btn outline color="primary darken-1" dark class="viewFilterButton" v-on:click="showChartComponent('GeneMembership')">
                                 View & Filter
                               </v-btn>
                             </div>
                           </center>
                          </v-card-text>
                          <div v-bind:class="[chartComponent==='GeneMembership' ? 'activeClass' : 'disabledClass']">
                              <GeneMembership
                                v-bind:GeneData="geneProps"
                                :color="barColor">
                              </GeneMembership>
                              <br>
                              <center>
                                <v-btn color="primary darken-1" flat="flat" v-on:click="chartComponent=null">Close</v-btn>
                              </center>
                              <br>
                          </div>
                        </v-card>
                      </div>
                    </div>

                    <!-- start vendor cars -->
                    <div class="mt-4">
                    <v-layout wrap>
                    <v-flex xs12>
                      <div v-if=" diseasesProps.length && modeOfInheritanceProps.length"">
                        <v-card v-bind:class="[chartComponent==='Vendors' ? 'activeCardBox elevation-5' : 'rightbarCard ']">
                          <v-card-text primary-title>
                            <center>
                              <span class="Rightbar_CardHeading">
                                VENDORS
                              </span>
                              <Dialogs
                                id="vendorsDialog"
                                class="dialogBox"
                                :HeadlineText="HelpDialogsData[4].HeadlineText"
                                :ContentText="HelpDialogsData[4].Content">
                              </Dialogs>
                              <v-divider class="Rightbar_card_divider"></v-divider>

                             <div v-bind:class="[chartComponent==='Vendors' ? 'disabledClass' : 'activeClass']">
                               <span class="Rightbar_card_content_subheading">
                                 <strong class="Rightbar_card_content_heading">{{ vendorsSelect.length }}</strong> of {{ vendorList.length }} selected
                               </span>
                               <v-btn outline color="primary darken-1" dark class="viewFilterButton" v-on:click="showChartComponent('Vendors')">View & Filter</v-btn>
                             </div>
                            </center>
                          </v-card-text>
                          <div v-bind:class="[chartComponent==='Vendors' ? 'activeClass' : 'disabledClass']">
                            <v-card flat v-if="vendorList.length">
                              <v-card-text >
                                <div class="vendorsCardClass">
                                  <v-checkbox
                                    v-for="(item, i) in multiSelectItems"
                                    :key="i" :label="item" :value="item"
                                    style="margin-top:-5px"
                                    v-model="vendorsSelect">
                                  </v-checkbox>
                                </div>

                              </v-card-text>
                            </v-card>
                            <v-btn v-show="vendorsSelect.length<multiSelectItems.length" small v-on:click="SelectAllVendors">Select All vendors</v-btn>
                            <br>
                            <center>
                              <v-btn color="primary darken-1" flat="flat" v-on:click="chartComponent=null">Close</v-btn>
                            </center>
                            <br>
                          </div>
                        </v-card>
                      </div>
                    </v-flex>
                  </v-layout wrap>
                </div>
                    <!-- end vendor card -->

                   </v-flex>
                  </v-layout>
            </v-flex>

            <v-flex d-flex xs12 sm12 md12 >
              <v-card >
                <v-card-title primary class="title">Disorders</v-card-title>
                <v-card-text>
                  <disease-panel
                    v-if="diseases.length && removeSearchTermFlag===false"
                    v-bind:DiseasePanelData="diseases"
                    v-on:selectedDiseases="selectDiseases($event)"
                    v-on:setDisorderNamesList="updateDisorderNamesList($event)"
                    v-on:PieChartSelectorData="PieChartSelectorData($event)"
                    v-bind:selectedDisordersProps="selectDisordersProps"
                    v-bind:selectedModesOfInheritance="selectedModesOfInheritanceProps"
                    v-on:ModesSelectedData="ModesSelectedData($event)"
                    v-on:disordersSelectedData="disordersSelectedData($event)">
                  </disease-panel>
                </v-card-text>
              </v-card>
            </v-flex>
            <br>
<!-- style="visibility:hidden; height:0px" -->

            <v-flex d-flex xs12 sm12 md12 style="visibility:hidden; height:0px">
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
import ShowGenePanel from './ShowGenePanel.vue';
import { bus } from '../../routes';
import PieChartSelector from '../viz/PieChartSelector.vue';
import ConditionsDistribution from '../viz/ConditionsDistribution.vue';
import GeneMembership from '../viz/GeneMembership.vue';
import Alerts from '../partials/Alerts.vue';
import Dialogs from '../partials/Dialogs.vue';
import HelpDialogs from '../../../data/HelpDialogs.json';
import IntroductionText from '../../../data/IntroductionText.json';
import SvgBar from '../viz/SvgBar.vue'


export default {
  components: { //Registering locally for nesting!
    'DisorderSearch': DisorderSearch,
    'disease-panel': DiseasesPanel,
    'gene-panel': GenePanel,
    'show-gene-panel1': ShowGenePanel,
    'PieChartSelector': PieChartSelector,
    'ConditionsDistribution': ConditionsDistribution,
    'GeneMembership': GeneMembership,
    'Alerts': Alerts,
    'Dialogs': Dialogs,
    'SvgBar': SvgBar,
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
      selectDisordersProps:[],
      multiSelectDisorder: [],
      snackbar: false,
      snackbarText: "",
      y: 'top',
      x: null,
      mode: '',
      snackbarTimeout: 4000,
      genesTopCounts: [5, 10, 30, 50, 80, 100],
      dialog: false,
      DisordersDialog: false,
      geneSearch: '',
      GoToTop: false,
      disordersSearchedByUser: false,
      multipleSearchItems:[],
      removeSearchTermFlag: false,
      filterFeed: [],
      saveSelectedVendorsCount: 0,
      saveSelectedVendors: [],
      newSearchFlag: false,
      lastVendorItem: [],
      HelpDialogsData: null,
      IntroductionTextData: null,
      selectedModesOfInheritance: [],
      selectedModesOfInheritanceProps: [],
      DisordersAndModesComponent: "",
    }
  },
  watch:{
    selectedVendorsListCB: function(){
      this.selectedVendorsList = this.selectedVendorsListCB
    },
    selectedDisordersListCB: function(){
      this.selectedDisordersList = this.selectedDisordersListCB
    },
    vendorsSelect(val) {
      var diff = this.multiSelectItems.length - this.vendorsSelect.length;
      var lastItem = [];
      if(diff>0 ){ //because everytime a new term is searched this difference will be zero.
        this.saveSelectedVendorsCount = this.multiSelectItems.length - this.vendorsSelect.length;
        this.saveSelectedVendors = this.multiSelectItems.filter( vendor => !this.vendorsSelect.includes(vendor));
      }
    },
    selectDisorders(val) {
      if(this.DisordersAndModesComponent==="disorders"){
        this.selectDisordersProps = this.selectDisorders;
      }
      // if(this.chartComponent==="disorders"){
      //   bus.$emit("updatedFromDisorders")
      // }
      // if(this.selectDisorders.length > this.multiSelectDisorder.length){
      //    this.selectDisorders= this.multiSelectDisorder
      // }
    },
    selectedModesOfInheritance(val){
      if(this.DisordersAndModesComponent==="modes"){
        this.selectedModesOfInheritanceProps = this.selectedModesOfInheritance;
      }
    }
  },
  mounted(){
    this.HelpDialogsData = HelpDialogs.data;
    bus.$on("lastVendor", ()=>{
      this.snackbarText = "It is required that atleast one vendor is kept selected";
      this.snackbar = true;
      this.vendorsSelect = [this.multiSelectItems[0]];
    });
    bus.$on("lastDisorder", ()=>{
      this.snackbarText = "It is required that atleast one disorder is kept selected";
      this.snackbar = true;
      this.selectDisorders = [this.multiSelectDisorder[0]];
    });
    bus.$on("newSearch", ()=>{
      this.newSearchFlag = true;
    })
    bus.$on("removeSearchTerm", ()=>{
      this.selectDisorders = [];
      // this.vendorsSelect = [];
      this.vendorsSelect = this.multiSelectItems;
      this.removeSearchTermFlag = true;
    });
    bus.$on("updateModeOfInheritance", (modeOfInheritance, selection)=>{
      this.filterFeed.unshift("Mode of inheritance")
    });
    bus.$on("vendorsFilter", ()=>{
      if(this.chartComponent==='Vendors'){
        this.filterFeed.unshift("Vendors")
      }
    });
    bus.$on("disordersFilter", ()=>{
      if(this.chartComponent==='disorders'){
        this.filterFeed.unshift("Disorders");
      }
    });
    bus.$on("updateFromGenesHistogram", (data, count)=>{
      if(this.chartComponent==='GeneMembership'){
        this.filterFeed.unshift("Gene Membership")
      }
    });
    bus.$on("newAnalysis", ()=>{
      this.disordersSearchedByUser= false;
      this.NumberOfTopGenes = null;
    });
  },
  created () {
    this.IntroductionTextData = IntroductionText.data[0];
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll);
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
      console.log("addDiseases", e)
      this.removeSearchTermFlag = false;
      this.disordersSearchedByUser= true;
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
      // console.log(e);
      this.DisordersPropsBackArr = e;
      this.showSummaryComponent = true
      this.diseases = e;
      // this.selectDisorders = [];
      this.$emit("diseasesCB", e);
      if(e.length<= 0){
        this.geneProps = [];
        this.diseasesProps = [];
        this.vendorList=[];
        this.disorderNamesList=[];
        this.modeOfInheritanceProps=[];
        this.selectedGenesText = "";
        this.$emit("UpdateListOfSelectedGenesGTR", []);
      }
    },
    selectDiseases: function(e){
    //  console.log("e is from home: ", e)
      this.diseasesProps = e;
    },
    selectPanels: function(e){
      this.geneProps = e;
      // this.scrollDown();
      this.$emit("GeneMembershipData", e);
    },
    updateVendorList: function(e){
      // console.log("vendor list as callback to home", e);
      this.vendorList = e;
      this.multiSelectItems = e;
      this.vendorsSelect = this.multiSelectItems;
      this.$emit("vendorListCB", e);
      this.checkForDeselectedVendor();
    },
    checkForDeselectedVendor: function(){
      if(this.saveSelectedVendors.length===0){
        this.vendorsSelect = this.multiSelectItems;
      }
      else if(this.saveSelectedVendors.length>0){
        this.vendorsSelect = this.multiSelectItems.filter( vendor => !this.saveSelectedVendors.includes(vendor))
      }
    },
    updateSelectedVendors: function(e){
      // console.log("selected vendors from callback to home", e);
      this.selectedVendorsList = e;
    },
    PieChartSelectorData: function(e){
      this.modeOfInheritanceProps = e;
      var x = e;
      this.selectedModesOfInheritance = e;
      this.$emit("modeOfInheritanceData", e);
    },
    ModesSelectedData:function(e){
      this.selectedModesOfInheritance = e;
    },
    updateDisorderNamesList: function(e){
      // console.log("disorderNamesList from callback to home", e);
      this.disorderNamesList = e;
      this.multiSelectDisorder = e;
      this.selectDisorders = this.multiSelectDisorder;
      this.$emit("disorderNamesListCB", e)
    },
    disordersSelectedData:function(e){
      this.selectDisorders = e;
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
    SelectAllVendors: function(){
      this.vendorsSelect=this.multiSelectItems;
      this.saveSelectedVendors = [];
    },
    SelectAllDisordersButton: function(){
      this.selectDisorders = this.multiSelectDisorder;
      bus.$emit("updatedFromDisorders");
    },
    resetDisorders: function(){
      this.selectDisorders = [];
      bus.$emit("resetDisordersBus");
      // bus.$emit("updatedFromDisorders");
    },
    scrollDown: function(){
      window.scrollTo(0, 120);
      // $vuetify.goTo(120)
    },
    handleScroll (event) {
      if(window.scrollY>=120){
        this.GoToTop=true;
      }
      else if(window.scrollY<120){
        this.GoToTop=false;
      }
    },
    scrollToTop: function(){
      window.scrollTo(0,0);
    },
    multipleSearchData: function(e){
      this.multipleSearchItems = e;
    },
    closeComponent: function(){
      this.chartComponent=null;
      this.DisordersAndModesComponent = "";
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
  /* .activeCardBox{
    border-bottom: 4px solid #F16335;
    box-shadow: 0 2px 2px 0 #CC423F;
  } */
  .btnColor{
    color: white;
    background-color: #4e7ad3 !important;
    /* border-radius: 5px; */
  }
  .btn{
    padding: 0px;
    height:39px;
  }
  .form-control{
    font-size: 15px;
  }
 #top-genes-input{
   width: 200px;
   height:40px;
   margin-top: 4px;
   background-color: #F4F4F4;
   border-color: #F4F4F4;
 }



 .chip_fontSize{
   overflow-wrap: break-word;
   word-break: break-word;
   overflow-x:hidden;
   display:inline-block;
   text-overflow: ellipsis;
   max-width: 370px;
   font-size: 11px;
 }

 @media screen and (max-width:1700px){
   .chip_fontSize{
     overflow-wrap: break-word;
     word-break: break-word;
     overflow-x:hidden;
     display:inline-block;
     text-overflow: ellipsis;
     max-width: 300px;
     font-size:10.5px;
   }
 }

 @media screen and (max-width:1520px){
   .chip_fontSize{
     overflow-wrap: break-word;
     word-break: break-word;
     overflow-x:hidden;
     display:inline-block;
     text-overflow: ellipsis;
     max-width: 250px;
     font-size:10.5px;
   }
 }

 @media screen and (max-width:1210px){
   .chip_fontSize{
     overflow-wrap: break-word;
     word-break: break-word;
     overflow-x:hidden;
     display:inline-block;
     text-overflow: ellipsis;
     max-width: 150px;
     font-size:10.5px;
   }
 }

 @media screen and (max-width:1000px){
   .chip_fontSize{
     overflow-wrap: break-word;
     word-break: break-word;
     overflow-x:hidden;
     display:inline-block;
     text-overflow: ellipsis;
     max-width: 100px;
     font-size:9px;
   }
 }


 @media screen and (max-width:1600px){
   #top-genes-input{
     width: 120px;
     height:40px;
     margin-top: 4px;
   }
 }
</style>

<style lang="sass">
@import ../assets/sass/variables

// .activeCardBox
//   box-shadow: 0 2px 6px 0 $app-color

#GoToTopBtn
  position: fixed
  bottom: 20px
  right: 30px
  z-index: 99
  font-size: 18px
  border: none
  outline: none
  background-color: $app-color
  color: white
  cursor: pointer
  padding: 15px
  border-radius: 4px

#GoToTopBtn:hover
  background-color: #555

// .btnColor
//   color: white
//   background-color: $search-button-color !important
  // border-radius: 5px

.rightbarCard
  border-top-right-radius: 8px
  border-top-left-radius: 8px

.activeCardBox
    border-bottom: 6px solid $activeCard-border
    border-top-right-radius: 8px
    border-top-left-radius: 8px

.filterFeed
  height: 175px
  overflow: auto

.dialogBox
  margin-top: -20px

.vendorsCardClass
  height: 355px
  overflow: scroll



.SvgBarClass
  margin-top: 5px

.viewFilterButton
  height: 30px
  margin-top: -2px

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

.disordersCheckbox
  margin-top: 0px
  font-size: 14px
  font-weight: 200
</style>
