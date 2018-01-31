<template>
  <div>
    <app-gtr
      v-on:showDiseases="addDiseases($event)">
    </app-gtr>
    <disease-panel
      v-bind:DiseasePanelData="diseases">
    </disease-panel>
  </div>
</template>

<script>
import Gtr from './Gtr.vue';
import DiseasesPanel from './DiseasesPanel.vue';

export default {
  components: { //Registering locally for nesting!
    'app-gtr': Gtr,
    'disease-panel': DiseasesPanel
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
