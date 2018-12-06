<template>
  <div id="app">
    {{ message }}
  </div>
</template>

<script>
import { bus } from '../../routes';
import { Typeahead, Btn } from 'uiv';
import d3 from 'd3';
import Model from '../../models/Model';

var model = new Model();

  export default {
    data(){
      return {
        message: 'Hello Vue!',
        bars: null,
      }
    },
    mounted(){
      this.drawBars();
    },
    updated(){

    },
    watch: {
    },
    methods:{

    }
  }


</script>

<style lang="sass">
@import ../assets/sass/variables
@import url('https://fonts.googleapis.com/css?family=Open+Sans')

.genepanelsRect
  fill: $rect-bar
  pointer-events: all
  stroke: white
  stroke-width: 2

.grayRect
  fill: $trailing-rect-bar
  stroke: white
  stroke-width: 2

</style>
