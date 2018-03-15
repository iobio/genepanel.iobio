<template>
  <div>
    <!-- <datatableExample></datatableExample> -->
    <!-- <multiSelectExample></multiSelectExample> -->
    <!-- <d3Example></d3Example> -->

    <NavigationBar></NavigationBar>
    <div id="app">
      <v-app id="inspire">
        <v-container fluid grid-list-md>
          <v-layout row wrap>
            <v-flex d-flex xs12 sm12 md3>
              <v-card >
                <v-card-title primary class="title">Filters</v-card-title>
                <v-card-text>
                  <FilterPanel
                    v-bind:vendorsData="vendorList"
                    v-on:setSelectedVendors="updateSelectedVendors($event)">
                  </FilterPanel>
                </v-card-text>
              </v-card>
            </v-flex>


            <v-flex d-flex xs12 sm12 md9>
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
                            v-on:PieChartSelectorData="PieChartSelectorData($event)">
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
    'NavigationBar': NavigationBar
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
      modeOfInheritanceProps: []
    }
  },
  mounted(){
  },
  methods: {
    addDiseases: function(e){
      console.log("e is from home: addDiseases ", e)
      this.diseases = e;
      if(e.length<= 0){
        this.geneProps = [];
        this.diseasesProps = [];
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
      console.log("modeOfInheritance data callback to home ", e);
      this.modeOfInheritanceProps = e;
      console.log("this.modeOfInheritanceData", this.modeOfInheritanceProps)
    }

  }
}
</script>

<style scoped>
  .toolbar__title{
    color: #66D4ED;
  }
</style>
