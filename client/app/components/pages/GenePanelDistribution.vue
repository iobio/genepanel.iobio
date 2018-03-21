<template>
  <div>
    <div>
      <div id="genePanel-distribution-chart"></div>
      <div id="abcd"></div>
    </div>
  </div>
</template>

<script>
import { bus } from '../../routes';

  export default {
    props:["distributionData"],
    data(){
      return{
        GeneDistData: [],
        GeneDataForChart: [],
      }
    },
    watch:{
      distributionData: function(){
        this.GeneDataForChart = this.distributionData;
        this.draw(this.GeneDataForChart.slice());
      }
    },
    methods:{
      draw(dataArray){
        var margin = {top: 20, right: 20, bottom: 40, left: 50};

        var height = 350- margin.left - margin.right;
        var width = 700 - margin.top - margin.bottom;


         dataArray.sort(function(a,b){
           return a.genecount - b.genecount
         })
         console.log('dataArray', dataArray.map(x=>{
           return x.genecount
         }))

         console.log( d3.max(dataArray, function(d) { return d.genecount; }))

         d3.select("#genePanel-distribution-chart").select("svg").remove();

         var chart = d3.select('#genePanel-distribution-chart')
                      .append('svg')
                      .attr("height", height + margin.top + margin.bottom)
                      .attr("width", width + margin.right + margin.left)
                      .append('g')

                      // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var area = d3.svg.area()
                        .x(function(d,i){
                          return i*4;
                        })
                        .y0(height)
                        .y1(function(d){
                          return height-d.genecount*2;
                        })
                        .interpolate("basis")

            chart.append('path').attr('transform', 'translate('+margin.left+','+margin.top+')').attr('d', area(dataArray)).attr("fill", 'rgb(87, 157, 208)').attr("stroke", "blue").attr("stroke-width", "1px");

            // var max = Math.max.apply(Math,dataArray.map(function(o){return o.value;}));

            var yScale = d3.scale.linear()
                           .domain([0, d3.max(dataArray, function(d) { return d.genecount; })])
                           .range([height, 0]);

           var yAxis = d3.svg.axis()
                     .scale(yScale)
                     .orient("left")
                     .ticks(5)



           chart.append("g")
                 .attr("class", "y axis")
                 .attr("stroke", "black")
                 .attr("transform",'translate('+margin.left+','+margin.top+')')
                 .call(yAxis)







      }
    },
    mounted(){
    },
    updated(){
    }
  }

</script>

<style>
</style>
