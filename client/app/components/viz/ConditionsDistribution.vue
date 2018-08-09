<template>
  <div>
    <div  class="chart-title">Conditions distribution across panels</div>
    <div>
      <div id="conditions-distribution-chart"></div>
    </div>
    <v-btn small v-on:click="clearFilters">Clear filters</v-btn>
  </div>
</template>

<script>
import { bus } from '../../routes';

  export default {
    props:{
      distributionData: null,
      color: null
    },
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
      clearFilters(){
        bus.$emit("clearConditionFilters")
      },
      draw(data){
        let self = this;
        // console.log("data in draw is ", data);
        var widthPercent = "100%";
        var heightPercent = "100%";
        var margin = {top: 20, right: 20, bottom: 40, left: 50};

        var height = 250- margin.top - margin.bottom;
        var width = 500 - margin.left - margin.right;
        var padding = 50;

        data.sort(function(a,b){
          return a - b
        })

        var dispatch = d3.dispatch("barselect");


        let onSelected = function(start, end) {
          // console.log("dispatch", start, end);
          dispatch.barselect(start, end);
          if(start !== end){
            bus.$emit("conditionsOnBarSelect", start, end);
          }
        }

        d3.select("#conditions-distribution-chart").select("svg").remove();
        // console.log("data length in conditions", data.length)

        if(data.length>1000){
          var histogram = d3.layout.histogram()
                          .bins(30)
                          (data)
        }
        else{
          var histogram = d3.layout.histogram()
                          .bins(20)
                          (data)
        }
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
                    .ticks(6)

        var xAxis = d3.svg.axis()
                    .scale(x)
                    .ticks(10)
                    .orient("bottom");

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
                            .attr("class", "y axis ")
                            // .attr("stroke", "black")

                    group1.append("text")
                          .attr("class", "y axis label")
                          .attr("transform", "rotate(-90)")
                          .attr("y", 0 - margin.left -3.5)
                          .attr("x",0 - ((height / 2) + 30))
                          .attr("dy", "1em")
                          .style("text-anchor", "start")
                          .text('# of Panels');

        canvas.selectAll(".bar")
                              .data(histogram)
                              .enter()
                              .append("g")
                              .append("rect")
                              // .attr("clip-path", "url(#clip)")
                              .attr("class", "bar")
                              .attr("x", function(d){return x(d.x)})
                              .attr("y", function(d){return y(d.y)})
                              .attr("width", function(d){return x(d.dx)})
                              .attr("height", function(d){return height-y(d.y)})
                              .attr("fill", self.color.selected)
                              .attr("stroke", "#1f5d7a")
                              .attr("stroke-width", 1)

                    var brushEnd = function(){
                      var start = brush.extent()[0];
                      var end   = brush.extent()[1];
                      // console.log("start", Math.round(start));
                      // console.log("end", Math.round(end));

                      onSelected(Math.round(start), Math.round(end))
                    }
                    var brush = d3.svg.brush()
                      .x(x)
                      .on("brushend", function(){
                        brushEnd();
                      })
                      .on("brush", brushed);

                      function brushed(){
                        var e = brush.extent();
                        canvas.selectAll("rect").classed("bar1", function(d,id) {
                              return(d.x >= e[0] && d.x <= e[1] ?  false: true )
                          });
                      }


                      canvas.append("g")
                        .attr("class", "x brush")
                        .call(brush) //call the brush function, causing it to create the rectangles
                        .selectAll("rect") //select all the just-created rectangles
                        .attr("y", 0)
                        .attr("height", (height + margin.top - 20)) //set their height

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
@import url('https://fonts.googleapis.com/css?family=Open+Sans');


.bar {
}

.bar1 {
  stroke-width: .5;
  opacity: .7;
}

.brush .extent {
  fill: steelblue
}

</style>
