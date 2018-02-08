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
      v-bind:DiseasePanelData="diseases">
    </disease-panel>
    <hr>
    <gene-panel
      v-bind:DiseasePanelData="diseases">
    </gene-panel>

    <hr>
    <!-- <typeaheadExample></typeaheadExample> -->
</div>
</template>

<script>
import Gtr from './Gtr.vue';
import DiseasesPanel from './DiseasesPanel.vue';
import GenePanel from './GenePanel.vue';
import typeaheadExample from './typeahead-example.vue';
import datatableExample from './datatable-example.vue';
import multiSelectExample from './MultiSelectExample.vue';
import d3Example from './d3Example.vue';


export default {
  components: { //Registering locally for nesting!
    'app-gtr': Gtr,
    'disease-panel': DiseasesPanel,
    'gene-panel': GenePanel,
    'typeaheadExample':typeaheadExample,
    'datatableExample':datatableExample,
    'multiSelectExample':multiSelectExample,
    'd3Example':d3Example
  },
  name: 'home',
  props: [],
  data() {
    return {
      diseases: []
    }
  },
  methods: {
    addDiseases: function(e){
      this.diseases = e;
    }
  }
}
</script>
