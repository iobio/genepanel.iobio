<template>
  <div>
    <v-card-title primary class="title">Conditions distribution across panels</v-card-title>
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
        console.log("data in draw is ", data);
        var widthPercent = "100%";
        var heightPercent = "270px";
        var margin = {top: 20, right: 20, bottom: 40, left: 50};

        var height = 250- margin.top - margin.bottom;
        var width = 500 - margin.left - margin.right;
        var padding = 50;

        data.sort(function(a,b){
          return a - b
        })
        d3.select("#conditions-distribution-chart").select("svg").remove();
        var histogram = d3.layout.histogram()
                          .bins(30)
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
                    .ticks(10)
                    .orient("bottom");


        // var canvas = d3.select("#conditions-distribution-chart").append("svg")
        //                     .attr("height", height + margin.top + margin.bottom)
        //                     .attr("width", width + margin.right + margin.left)
        //                     .append("g")
        //                       .attr('transform', 'translate('+margin.left+','+margin.top+')')

        var ht = height + margin.top + margin.bottom;
        var wdth = width + margin.right + margin.left
        var canvas = d3.select("#conditions-distribution-chart").append("svg")
                            .attr("height", heightPercent)
                            .attr("width", widthPercent)
                            .attr('viewBox', "0 0 " + parseInt(wdth) + " " + parseInt(ht))
                            .attr("preserveAspectRatio", "none")
                            .append("g")
                              .attr('transform', 'translate('+margin.left+','+margin.top+')')


        var group = canvas.append("g")
                          .attr('transform', 'translate(0,'+ height +')')
                              .call(xAxis)
                              .attr("class", "x axis")

                    group.append("text")
                        .attr("class", "x axis label")
                        .attr('transform', 'translate('+ (width / 2) +',37)')
                        .style("text-anchor", "end")
                        .text("# of Conditions");



        var group1 = canvas.append("g")
                            // .attr("transform",'translate('+margin.left+','+margin.top+')')
                            .call(yAxis)
                            .attr("class", "y axis")
                            // .attr("stroke", "black")

                    group1.append("text")
                          .attr("class", "y axis label")
                          .attr("transform", "rotate(-90)")
                          .attr("y", 0 - margin.left)
                          .attr("x",0 - (height / 2))
                          .attr("dy", "1em")
                          .style("text-anchor", "start")
                          .text('# of Panels');

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
                    .attr("stroke", "#1f5d7a")
                    .attr("stroke-width", 1)

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

<style scoped>
.axis .label {
  font-size: 17px;
}
</style>
