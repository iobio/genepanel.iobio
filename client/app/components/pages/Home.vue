<template>
  <div>
    <!-- <datatableExample></datatableExample> -->
    <!-- <multiSelectExample></multiSelectExample> -->
    <!-- <d3Example></d3Example> -->

    <div id="app">
      <v-app id="inspire">
        <v-container fluid grid-list-md>
          <v-layout row wrap>
            <v-flex d-flex xs12 sm12 md3 lg3>
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
            </v-flex>


            <v-flex d-flex xs12 sm12 md9 lg9>
                <v-card-text>
                  <v-layout row wrap>
                    <v-flex d-flex xs12 sm12 md12>
                      <v-card >
                        <v-card-title primary class="title">Search</v-card-title>
                        <v-card-text>
                          <app-gtr
                            v-on:showDiseases="addDiseases($event)">
                          </app-gtr>
                        </v-card-text>
                      </v-card>
                    </v-flex>

                    <v-flex d-flex xs12 sm12 md12>
                      <v-card >
                        <v-card-title primary class="title">Summary</v-card-title>
                        <v-card-text>
                          <!-- <PieChartSelectorBackup
                            v-if="modeOfInheritanceProps.length"
                            v-bind:modeOfInheritanceData="modeOfInheritanceProps">
                          </PieChartSelectorBackup> -->

                          <show-gene-panel1
                          v-if="geneProps.length && diseasesProps.length &&modeOfInheritanceProps.length"
                            v-bind:GeneData="geneProps"
                            v-bind:modeOfInheritanceData="modeOfInheritanceProps">
                          </show-gene-panel1>
                        </v-card-text>
                      </v-card>
                    </v-flex>

                    <br>
                    <v-flex d-flex xs12 sm12 md12>
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

                    <v-flex d-flex xs12 sm12 md12>
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
import PieChartSelectorBackup from './PieChartSelectorBackup.vue'
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
    'PieChartSelectorBackup': PieChartSelectorBackup
  },
  name: 'home',
  props: [],
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
    }
  },
  mounted(){
  },
  methods: {
    addDiseases: function(e){
      console.log("e is from home: addDiseases ", e)
      this.showSummaryComponent = true
      // alert(e.length)
      this.diseases = e;
      if(e.length<= 0){
        this.geneProps = [];
        this.diseasesProps = [];
        this.vendorList=[];
        this.disorderNamesList=[];
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
    },
    updateSelectedDisorders: function(e){
      // console.log("selected disorders from callback to home ", e)
      this.selectedDisordersList = e;
    }
  }
}
</script>

<style scoped>
  .toolbar__title{
    color: #66D4ED;
  }
</style>
