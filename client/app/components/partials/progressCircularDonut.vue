<template>
  <div>
    <div class="text-xs-center">
     <v-progress-circular
       :rotate="-90"
       :size="115"
       :width="15"
       :value="value"
       color="primary"
     >
       {{ value }}%
     </v-progress-circular>
   </div>
  </div>
</template>


<script>
import { bus } from '../../routes';
import { Typeahead, Btn } from 'uiv';
import d3 from 'd3';
import Model from '../../models/Model';

var model = new Model();

  export default {
    components: {
    },
    props:{
      selectedNumber:{
        type: Number,
      },
      totalNumber: {
        type: Number
      },
    },
    data(){
      return {
        value: 0,
      }
    },
    mounted(){
      this.calculateValue();
    },
    updated(){
      this.$emit("closeDialog")
    },
    watch: {
      totalNumber: function(){
        this.calculateValue();
      },
      selectedNumber: function(){
        this.calculateValue();
      },
    },
    methods:{
      calculateValue(){
        this.value =  parseInt((this.selectedNumber/ this.totalNumber)*100);
      }
    }
  }


</script>

<style lang="sass">
@import ../assets/sass/variables
@import url('https://fonts.googleapis.com/css?family=Open+Sans')
.v-progress-circular__info
  font-size: 18px


</style>
