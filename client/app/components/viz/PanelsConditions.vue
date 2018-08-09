<template>
  <div class="SvgPanelsConditions">
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
        var svgWidth = $('.SvgPanelsConditions').innerWidth() ;
        var absWidth = Math.abs(svgWidth)
        var multiplicationFactor = Math.round(absWidth / this.totalNumber);
        var selectedgenesWidth = Math.abs((this.selectedNumber * multiplicationFactor)-10);
        var grayBarWidth = Math.abs(absWidth - selectedgenesWidth -10);
        var selected_Number = this.selectedNumber;

        this.bars = `<svg viewBox="0 0 ${absWidth} 18" xmlns="http://www.w3.org/2000/svg">
                        <rect class="genepanelsRect"
                              x="1" y="-1" rx="5" width="${selectedgenesWidth}" height="10"/>
                        <rect class="grayRect"
                              x="${selectedgenesWidth+1}" y="-1" rx="5" width="${grayBarWidth}" height="10"/>

                        <text x="${absWidth-6}" y="8" font-family="Verdana" font-size="11" fill="#4267b2">${selected_Number}</text>
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
