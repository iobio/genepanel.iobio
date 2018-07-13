<template>
  <div class="SvgDiv">
    <span v-html="bars"></span>
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
    props: {
      selectedNumber:{
        type: Number,
      },
      totalNumber: {
        type: Number,
      }
    },
    data(){
      return {
        bars: null,
      }
    },
    mounted(){
      this.drawBars();
    },
    updated(){

    },
    watch: {
      selectedNumber: function(){
        this.drawBars();
      },
      totalNumber: function(){
        this.drawBars();
      }
    },
    methods:{
      drawBars(){
        var svgWidth = $('.SvgDiv').innerWidth() - 20;
        var multiplicationFactor = svgWidth / this.totalNumber;
        var selectedgenesWidth = Math.abs(this.selectedNumber * multiplicationFactor);
        var grayBarWidth = Math.abs(svgWidth - selectedgenesWidth);

        this.bars = `<svg width="${svgWidth}" height="18" xmlns="http://www.w3.org/2000/svg">
                      <rect class="genepanelsRect"
                            x="10" y="1" rx="5" width="${selectedgenesWidth}" height="16"/>
                      <rect class="grayRect"
                            x="${selectedgenesWidth+10}" y="1" rx="5" width="${grayBarWidth}" height="16"/>
                  </svg>`
      }
    }
  }


</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Open+Sans');

</style>
