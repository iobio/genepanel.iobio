<template>
  <div>
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
  </div>
</template>

<script>
import Gtr from './Gtr.vue';
import DiseasesPanel from './DiseasesPanel.vue';
import GenePanel from './GenePanel.vue';

export default {
  components: { //Registering locally for nesting!
    'app-gtr': Gtr,
    'disease-panel': DiseasesPanel,
    'gene-panel': GenePanel
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
