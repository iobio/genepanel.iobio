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
      // if(typeof this.selectedNumber===Number && typeof this.totalNumber === Number){
      //   this.drawBars();
      // }
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
        var wdth = $('.SvgDiv').innerWidth();
        if(wdth<=0){
          wdth = 400;
        }
        var svgWidth = wdth - 20;
        var multiplicationFactor = svgWidth / this.totalNumber;
        var selectedgenesWidth = Math.abs(this.selectedNumber * multiplicationFactor);
        var grayBarWidth = Math.abs(svgWidth - selectedgenesWidth);

        this.bars = `<svg width="${svgWidth}" height="18" xmlns="http://www.w3.org/2000/svg">
                      <rect class="genepanelsRect"
                            x="10" y="1" rx="5" width="${selectedgenesWidth}" height="12"/>
                      <rect class="grayRect"
                            x="${selectedgenesWidth+10}" y="1" rx="5" width="${grayBarWidth}" height="12"/>
                  </svg>`
      }
    }
  }


</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Open+Sans');

.genepanelsRect{
  fill: #4e7ad3;
  pointer-events: all;
  stroke: white;
  stroke-width: 2;
}

.grayRect{
  fill: #e8ebed;
  stroke: white;
  stroke-width: 2;
}


</style>
