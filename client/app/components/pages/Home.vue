<template>
  <div>
    <!-- <datatableExample></datatableExample> -->
    <!-- <multiSelectExample></multiSelectExample> -->
    <!-- <d3Example></d3Example> -->
  <!-- Navbar  -->
    <div style="position: relative; overflow: hidden;">
      <v-toolbar
        absolute
        color="blue-grey darken-4"
        dark
        scroll-off-screen
        scroll-target="#scrolling-techniques"
      >
        <v-toolbar-title>geneLists.iobio</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <div
        style="max-height: 600px; color:red"
        class="scroll-y"
        id="scrolling-techniques"
      >
        <v-container style="height: 100px;"></v-container>
      </div>
    </div>


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
                          <show-gene-panel
                            v-if="geneProps.length && diseasesProps.length"
                            v-bind:GeneData="geneProps">
                          </show-gene-panel>
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
                            v-on:selectedDiseases="selectDiseases($event)">
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
import typeaheadExample from './typeahead-example.vue';
import datatableExample from './datatable-example.vue';
import multiSelectExample from './MultiSelectExample.vue';
import FilterPanel from './FilterPanel.vue';

import d3Example from './d3Example.vue';
import { bus } from '../../routes';


export default {
  components: { //Registering locally for nesting!
    'app-gtr': Gtr,
    'disease-panel': DiseasesPanel,
    'gene-panel': GenePanel,
    'show-gene-panel': ShowGenePanel,
    'typeaheadExample':typeaheadExample,
    'datatableExample':datatableExample,
    'multiSelectExample':multiSelectExample,
    'd3Example':d3Example,
    'FilterPanel':FilterPanel
  },
  name: 'home',
  props: [],
  data() {
    return {
      diseases: [],
      diseasesProps: [],
      geneProps: [],
      vendorList: [],
      selectedVendorsList: []
    }
  },
  methods: {
    addDiseases: function(e){
      //console.log("e is from home: addDiseases ", e)
      this.diseases = e;
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
      console.log("vendor list as callback to home", e);
      this.vendorList = e;
    },
    updateSelectedVendors: function(e){
      console.log("selected vendors from callback to home", e);
      this.selectedVendorsList = e;
    }

  }
}
</script>

<style scoped>
  .toolbar__title{
    color: #66D4ED;
  }
</style>
