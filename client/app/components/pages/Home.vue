<template>
  <div>
    <!-- <datatableExample></datatableExample> -->
    <!-- <multiSelectExample></multiSelectExample> -->
    <!-- <d3Example></d3Example> -->
    <app-gtr
      v-on:showDiseases="addDiseases($event)">
    </app-gtr>

    <hr>
    <disease-panel
      v-if="diseases.length"
      v-bind:DiseasePanelData="diseases"
      v-on:selectedDiseases="selectDiseases($event)">
    </disease-panel>
    <hr>
    <gene-panel
      v-if="diseasesProps.length"
      v-bind:DiseasePanelData="diseasesProps"
      v-on:selectedPanels="selectPanels($event)">
    </gene-panel>

    <hr>
    <show-gene-panel
      v-if="geneProps.length"
      v-bind:GeneData="geneProps">
    </show-gene-panel>

    <!-- <typeaheadExample></typeaheadExample> -->
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
import d3Example from './d3Example.vue';


export default {
  components: { //Registering locally for nesting!
    'app-gtr': Gtr,
    'disease-panel': DiseasesPanel,
    'gene-panel': GenePanel,
    'show-gene-panel': ShowGenePanel,
    'typeaheadExample':typeaheadExample,
    'datatableExample':datatableExample,
    'multiSelectExample':multiSelectExample,
    'd3Example':d3Example
  },
  name: 'home',
  props: [],
  data() {
    return {
      diseases: [],
      diseasesProps: [],
      geneProps: []
    }
  },
  methods: {
    addDiseases: function(e){
      console.log("e is from home: addDiseases ", e)
      this.diseases = e;
    },
    selectDiseases: function(e){
      console.log("e is from home: ", e)
      this.diseasesProps = e;
    },
    selectPanels: function(e){
      console.log("e is from home for selected panels: ", e)
      this.geneProps = e;
    }
  }
}
</script>
