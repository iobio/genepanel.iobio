<template>
  <div>
    <div>
      <div id="conditions-distribution-chart"></div>
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
        ConditionHistogramData: [],
      }
    },
    watch:{
      distributionData: function(){
        this.GeneDataForChart = this.distributionData;
        var a = [];
        this.distributionData.map(x=>{
          a.push(x.conditioncount)
        });
        this.ConditionHistogramData = a;
        this.draw(this.ConditionHistogramData.slice());
      }
    },
    methods:{
      draw(data){
        console.log("data in draw is ", data)
        var margin = {top: 20, right: 20, bottom: 40, left: 50};

        var height = 350- margin.left - margin.right;
        var width = 500 - margin.top - margin.bottom;
        var padding = 50;

        data.sort(function(a,b){
          return a - b
        })
        d3.select("#conditions-distribution-chart").select("svg").remove();
        var histogram = d3.layout.histogram()
                          .bins(20)
                          (data)
        var yDomainArrayLengths=[]
        histogram.map(x=>{
          yDomainArrayLengths.push(x.length)
        })

        var maxArrayLength = d3.max(yDomainArrayLengths)

        var y = d3.scale.linear()
                  .domain([0,maxArrayLength])
                  .range([height, 0])

        var x = d3.scale.linear()
                  .domain([0,d3.max(data)])
                  .range([0,width])

        var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")
                    .ticks(5)

        var xAxis = d3.svg.axis()
                    .scale(x)
                    .ticks(data.length/3)
                    .orient("bottom");


        var canvas = d3.select("#conditions-distribution-chart").append("svg")
                            .attr("height", height + margin.top + margin.bottom)
                            .attr("width", width + margin.right + margin.left)
                            .append("g")
                              .attr('transform', 'translate('+margin.left+','+margin.top+')')

        var group = canvas.append("g")
                          .attr('transform', 'translate(0,'+ height +')')
                              .call(xAxis)
                              .attr("class", "x axis")

        var group1 = canvas.append("g")
                            // .attr("transform",'translate('+margin.left+','+margin.top+')')
                            .call(yAxis)
                            .attr("class", "y axis")
                            // .attr("stroke", "black")

        var bars = canvas.selectAll(".bar")
                              .data(histogram)
                              .enter()
                              .append("g")
                              // .on("click", function(d){
                              //   alert(d)
                              // })

                  bars.append("rect")
                    .attr("x", function(d){return x(d.x)})
                    .attr("y", function(d){return y(d.y)})
                    .attr("width", function(d){return x(d.dx)})
                    .attr("height", function(d){return height-y(d.y)})
                    .attr("fill", "steelblue")

                  // bars.append("text")
                  //   .attr("x", function(d){return x(d.x)-3.5})
                  //   .attr("y", function(d){return y(d.y)-25})
                  //   .attr("dy", "20px")
                  //   .attr("dx", function(d){
                  //     return x(d.dx)/2;
                  //   })
                  //   .attr("fill", "black")
                  //   .text(function(d){ if(d.y!==0){
                  //     return d.y;
                  //   } })

      }
    },
    mounted(){
      this.GeneDataForChart = this.distributionData;
      var a = [];
      this.distributionData.map(x=>{
        a.push(x.conditioncount)
      });
      this.ConditionHistogramData = a;
      this.draw(this.ConditionHistogramData.slice());
    },
    updated(){
    }
  }

</script>

<style>
</style>
