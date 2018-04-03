<template>
  <div>
    <v-card-title primary class="title">Gene membership in panels</v-card-title>
    <div id="gene-histogram-box" >
      <svg id="gene-histogram-chart1"></svg>
    </div>


    <!-- <v-app id="inspire"> -->

    <!-- </v-app> -->
  </div>
</template>


<script>
import { bus } from '../../routes';
import { Typeahead, Btn } from 'uiv';
import d3 from 'd3';
import PieChartSelector from './PieChartSelector.vue'
import GeneDistribution from './GeneDistribution.vue';
import GenePanelDistribution from './GenePanelDistribution.vue';
import ConditionsDistribution from './ConditionsDistribution.vue';
import Model from './Model';
var model = new Model();

  export default {
    components: {
      'PieChartSelector': PieChartSelector,
      'GeneDistribution': GeneDistribution,
      'GenePanelDistribution': GenePanelDistribution,
      'ConditionsDistribution': ConditionsDistribution
    },
    //props: ['GeneData'],
    props: {
      modeOfInheritanceData: {
        type: Array
      },
      GeneData: {
        type: Array
      },
    },
    data(){
      return {
        geneHistogramChart: {},
        geneBarChart: {},
        GetGeneData : [],
        GenesToDisplay: [],
        selected: [],
        items: [],
        GenesFromD3Bars: [],
        dataForTables:[],
        modeOfInheritanceList: [],
        countForEmit:0,
        modeOfInheritanceProps: [],
        flagForNumberOfGenesSelected: false,
        NumberOfGenesSelectedFromFilter: 50,
        CountBrushSelection: 0,

      }
    },
    mounted(){
      // alert("modeOfInheritance length " + this.modeOfInheritanceData.length)
      this.modeOfInheritanceProps = this.modeOfInheritanceData;
      this.CountBrushSelection = 0;
      this.draw();
      this.AddGeneData();
      // this.drawSimpleViz();


    },
    updated(){


    },
    watch: {
      GeneData: function(){
        this.CountBrushSelection = 0;
        console.log("watch genes : " , this.GeneData);
        this.AddGeneData();
      },
      modeOfInheritanceData: function(){
        console.log("Watch modeOfInheritanceData from show-gene-panel1: ", this.modeOfInheritanceData)
      }
    },
    methods:{
      draw(){
        //Drawing histogram chart
        this.geneHistogramChart = HistogramChart()
            .width(390)
            .height(150)
            .widthPercent("100%")
            .heightPercent("270px")
            .margin( {left: 45, right: 15, top: 10, bottom: 30})
            .yAxisLabel( "# of genes" )
            .xAxisLabel( "# of Panels" )
            .on("barselect", function(selectedGeneNames){
              console.log("bars selected ", selectedGeneNames);
              addSelectedFromHistogramChart(selectedGeneNames);
            })
        var addSelectedFromHistogramChart = (data)=>{
          this.CountBrushSelection++;
          //alert(this.CountBrushSelection)
          //this.selected = data;
          bus.$emit("updateFromGenesHistogram", data, this.CountBrushSelection)
        }

        //Drawing horizontal bar chart
        // console.log("bar chart before mounting", this.geneBarChart)
        // this.geneBarChart = HorizontalBarChart()
        //     .width(650)
        //     .height(1000)
        //     .widthSmall(80)
        //     // .on("barselect", function(selectedGeneNames){
        //     //   console.log("bars selected ", selectedGeneNames);
        //     //   addSelectedGeneFunction(selectedGeneNames);
        //     // })
        //  var addSelectedGeneFunction=(selectedGeneNames)=>{
        //   this.addSelectedGenesFromD3(selectedGeneNames);
        // }
      },
      addSelectedGenesFromD3(selectedGeneNames){
        this.GenesFromD3Bars = selectedGeneNames;
        console.log("this.GenesFromD3Bars", this.GenesFromD3Bars)
      },


      AddGeneData: function(){
        this.GetGeneData = this.GeneData;
        console.log("this.GetGeneData", this.GetGeneData);

        this.modeOfInheritanceList = this.modeOfInheritanceData;

        var mergedGenes = model.mergeGenesAcrossPanels(this.GetGeneData);
        console.log("mergedGenes", mergedGenes);

        this.GenesToDisplay = mergedGenes;
        console.log("GenesToDisplay",this.GenesToDisplay);

        var selection = d3.select('#gene-histogram-chart1').datum(model.mergedGenes);
        this.geneHistogramChart(selection, {'logScale': true, 'descendingX': true, 'selectTop': 50});

        let data = model.getGeneBarChartData(mergedGenes);
        console.log("model.getGeneBarChartData(mergedGenes)", model.getGeneBarChartData(mergedGenes).slice(0,50));
        // console.log("bar char", this.geneBarChart)
        this.items = data;
        this.selected = data.slice(0,50);

        console.log("this.selected from Show Genes ", this.selected )
       // this.geneBarChart(d3.select('#gene-bar-chart'), data);
        // console.log("bar chart1", this.geneBarChart)
        this.dataForTables = data.slice(0,10);
        console.log("dataForTables: ", this.dataForTables)

      },
      selectAllGenes: function(){
        this.selected = this.items.slice()
      },
      deSelectAllGenes: function(){
        this.selected = []
      },

    }
  }

  function HistogramChart() {

    let svg = null;

    let margin = {top: 30, right: 20, bottom: 20, left: 50};

    let width = 200;
    let height = 100;
    let widthPercent = "95%";
    let heightPercent = "95%";

    let brush = null;

    let defaults = {outliers: true, averageLine: true};

    let xValue = function(d) { return d[0]; };
    let yValue = function(d) { return d[1]; };

    let formatXTick = null;

    let xAxisLabel = null;
    let yAxisLabel = null;

    var dispatch = d3.dispatch("barselect");

    let tooltip = d3.select("#tooltip");
    let tooltipText = function(d, i) {
          return d[0] + ", " + d[1];
    };

    let onSelected = function(selected) {
      console.log(selected);
      dispatch.barselect(selected);
    }

    // A formatter for counts.
    let formatCount = d3.format(",.0f");

    let logFormat = function(d, i) {
      if (d < 1) {
        return "";
      } else {
        console.log("d :" , d, " i : ", i, " i/2 : ",  i/2)
        if(i%2===0){
          var x = Math.log(d) / Math.log(10) + 1e-6;
          console.log(Math.abs(x - Math.floor(x)))
          return Math.abs(x - Math.floor(x)) < 1.1 ? formatCount(d) : "";
        }
      }
    }

    let brushEnd = function() {
      var start = brush.extent()[0];
      var end   = brush.extent()[1];
      svg.selectAll(".bar")
         .classed("selected", function(d,i) {

            var inBrushExtent = d.x >= Math.floor(start) && d.x <= Math.ceil(end);
            // console.log("inBrushExtent", inBrushExtent)
            return inBrushExtent;
         })

      var selected = [];
      svg.selectAll(".bar.selected").data().forEach(function(selectedBarData) {
        selected = selected.concat(Array.from(selectedBarData));
        // console.log("selected", selected)
      })
      onSelected(selected);
    }


    function chart(selection, options) {
      d3.select("#gene-histogram-chart1").select("svg").remove();
      console.log("options in chart", options)
      // merge options and defaults
      options = $.extend(defaults,options);
      let innerHeight = height - margin.top - margin.bottom;
      let innerWidth  = width  - margin.left - margin.right;


      selection.each(function(dataOrig) {
        console.log("dataOrig" , dataOrig)
        // set svg element
        svg = d3.select(this);
        svg.attr("width", widthPercent)
          .attr("height", heightPercent)
          .attr('viewBox', "0 0 " + parseInt(width) + " " + parseInt(height))
          .attr("preserveAspectRatio", "none");

        svg.select("g").remove();

        if (dataOrig == null || dataOrig.length == 0) {
          return;
        }
        var group = svg.append("g")
                       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        var max = d3.max(dataOrig, function(d){ return d._genePanelCount;});
        var min = d3.min(dataOrig, function(d){ return d._genePanelCount;});
        var x = d3.scale.linear()
              .domain([min, max+1])
              .range([0, innerWidth]);  //.range(options.descendingX ? [innerWidth, 0] : [0, innerWidth]);


              // console.log("x.ticks(max)", x.ticks(max))
              console.log("dataOrig.length : " , dataOrig.length)

        // Generate a histogram using twenty uniformly-spaced bins.
        if(dataOrig.length>2000){
          var data = d3.layout.histogram()
              .bins(20)
              .value(function(d){return d._genePanelCount;})
              (dataOrig);
        }
        else {
          var data = d3.layout.histogram()
              .bins(x.ticks(max))
              .value(function(d){return d._genePanelCount;})
              (dataOrig);
        }


        var dataForBrush = d3.layout.histogram()
            .bins(x.ticks(max))
            .value(function(d){return d._genePanelCount;})
            (dataOrig);



        console.log("data in histogram", data)



        var yMax = d3.max(data, function(d){return d.length});
        var yMin = d3.min(data, function(d){return d.length});


        var y = null;
        if (options.logScale) {
          y = d3.scale.log()
            .clamp(true)
            .base(2)
            .domain([.1, yMax])
            .range([innerHeight, 0])
            .nice();
        } else {
          y = d3.scale.linear()
            .domain([0, yMax])
            .range([innerHeight, 0])
        }

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickFormat(function(tickValue) {
              return tickValue;
            })
            .ticks(10) //max/1.5


        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(5)
            .tickFormat(options.logScale ? logFormat : d3.format("i"))



        var barGroup = group.append("g")
                            .attr("transform", "translate(0,0)");

        var bar = barGroup.selectAll(".bar")
            .data(data)
            .enter().append("g")
            .attr("class", "bar")
            .attr("transform", function(d) { return "translate(" + x(d.x) + "," + innerHeight + ")"; });

        bar.append("rect")
            .attr("x", 1)
            .attr("width", Math.abs((x(data[0].dx) - x(0))) - 1)
            .attr("height", function(d) { return 0; })
            // .attr("x", options.descendingX ? x(data[0].dx) - x(0) : 0)
            // .attr("fill", function(d){
            //   if(d.length>0){
            //     console.log(d[0].name);
            //     if(d[0].name==="MVK"){
            //       return "red";
            //     }
            //     else {
            //       return "green"
            //     }
            //   }
            //   else {
            //     return "green"
            //   }
            // })
        // bar.append("text")
        //     .attr("dy", ".75em")
        //     .attr("y", -9)
        //     .attr("x", (x(data[0].dx) - x(0)) / 2)
        //     .attr("text-anchor", "middle")
        //     .text(function(d) { return formatCount(d.y) <= 0 ? "" : formatCount(d.y) });


        group.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(" + 0 + "," + innerHeight + ")")  //((x(data[0].dx) - x(0)) / 2)
            .call(xAxis);


        // All of the ticks were shifted left to be in the bar's center.  So get rid of the last tick.
        group.selectAll('.x.axis .tick').filter(function(d, i) {
            return i === data.length;
        }).remove()

        group.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        // Add the text label for the x axis
        //gEnter.selectAll("g.xaxis label")
        if (xAxisLabel) {
          group.selectAll("g.x axis label").remove();
          group.append("text")
            .attr("class", "x axis label")
            .attr("transform", "translate(" + (width / 2) + " ," + (y.range()[0]  + margin.bottom) + ")")
            .style("text-anchor", "end")
            .text(xAxisLabel);
        }

        // Add the text label for the Y axis
        if (yAxisLabel) {
        group.selectAll("g.y axis label").remove();
        group.append("text")
            .attr("class", "y axis label")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "start")
            .text(yAxisLabel);

        }



        // Update bars.
        bar.transition()
           .duration(1000)
           .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

        bar.selectAll('rect')
           .transition()
           .duration(1000)
           .attr("height", function(d) { return innerHeight - y(d.y); })

        brush = d3.svg.brush().x(x);


        // Select all bars to equal total count of 100
        if (options.selectTop) {
          console.log("options", options);
          console.log("options selectTop", options.selectTop);
          console.log("data", dataForBrush)
          var maxX = dataForBrush.length+1;
          var minX = null;
          var total = 0;
          for (let i = dataForBrush.length-1; i >= 0; i-- ) {
            let d = dataForBrush[i];
            total += d.y;
            if (minX == null && total >= options.selectTop) {
              minX = i+1;
            }
          }
          if (minX == null) {
            minX = dataForBrush.length;
          }
          console.log('minX' , minX , "  maxX " , maxX)
          brush.extent([minX, maxX]);
        }

        let brushHeight = innerHeight + margin.top;
        let brushY = (margin.top-1) * -1;
        group.selectAll("g.x.brush").remove();
        let brushGroup = group.selectAll("g.x.brush").data([0]);
        brushGroup.enter().append("g")
            .attr("class", "x brush")
            .transition()
            .duration(1000)
            .call(brush)
            .selectAll("rect")
            .attr("y", brushY)
            .attr("height", brushHeight);




        brushGroup.selectAll(".resize")
          .append("line")
          .style("visibility", options.selectTop ? "visible" : "hidden")
          .attr("y2", innerHeight);

        brushGroup.selectAll(".resize")
          .append("path")
          .style("visibility", options.selectTop ? "visible" : "hidden")
          .attr("d", d3.svg.symbol().type("triangle-up").size(20))
          .attr("transform", function(d,i) {
            return i ?  "translate(-4," + (innerHeight/2) + ") rotate(-90)" : "translate(4," + (innerHeight/2) + ") rotate(90)";
          });

        brush.on("brushend", function() {
          brushEnd();
        });
        brush.on("brush", function() {
          svg.selectAll(".x.brush .resize line")
             .style("visibility", "visible");
          svg.selectAll(".x.brush .resize path")
             .style("visibility", "visible");
        })

        if (options.selectTop) {
          d3.select("g.x.brush")
            .transition()
            .duration(1000)
            .call(brushEnd);
        }






      });


    }

    chart.margin = function(_) {
      if (!arguments.length) return margin;
      margin = _;
      return chart;
    };

    chart.width = function(_) {
      if (!arguments.length) return width;
      width = _;
      return chart;
    };

    chart.height = function(_) {
      if (!arguments.length) return height;
      height = _;
      return chart;
    };

    chart.xValue = function(_) {
      if (!arguments.length) return xValue;
      xValue = _;
      return chart;
    };

    chart.yValue = function(_) {
      if (!arguments.length) return yValue;
      yValue = _;
      return chart;
    };

    chart.x = function(_) {
      if (!arguments.length) return x;
      x = _;
      return chart;
    };

    chart.y = function(_) {
      if (!arguments.length) return y;
      y = _;
      return chart;
    };

    chart.xAxis = function(_) {
      if (!arguments.length) return xAxis;
      xAxis = _;
      return chart;
    };

    chart.yAxis = function(_) {
      if (!arguments.length) return yAxis;
      yAxis = _;
      return chart;
    };

    chart.formatXTick = function(_) {
      if (!arguments.length) return formatXTick;
      formatXTick = _;
      return chart;
    }

    chart.xAxisLabel = function(_) {
      if (!arguments.length) return xAxisLabel;
      xAxisLabel = _;
      return chart;
    }

    chart.yAxisLabel = function(_) {
      if (!arguments.length) return yAxisLabel;
      yAxisLabel = _;
      return chart;
    }

    chart.brush = function(_) {
      if (!arguments.length) return brush;
      brush = _;
      return chart;
    };

    chart.widthPercent = function(_) {
      if (!arguments.length) return widthPercent;
      widthPercent = _;
      return chart;
    };

    chart.heightPercent = function(_) {
      if (!arguments.length) return heightPercent;
      heightPercent = _;
      return chart;
    };

    chart.tooltipText = function(_) {
      if (!arguments.length) return tooltipText;
      tooltipText = _;
      return chart;
    };

    chart.onSelected = function(_) {
      if (!arguments.length) return onSelected;
      onSelected = _;
      return chart;
    };


    d3.rebind(chart, dispatch, "on");
    return chart;
  }
</script>

<style>

#gene-histogram-chart1 .bar rect {
    fill:   #7dc2e5;
    stroke: #1f5d7a;
    stroke-width: .5;
}

#gene-histogram-chart1 .bar.selected rect {
    fill: #2d8fc1;
}

#gene-histogram-chart1 .bar text {
    font-size: 10px;
}

#gene-histogram-chart1 .x.axis {
  font-size: 10px;
}
#gene-histogram-chart1 .y.axis {
  font-size: 10px !important;
}
#gene-histogram-chart1 .axis .label {
  font-size: 12px !important;
}


div.tooltip {
  position: absolute;
  text-align: center;
  z-index:20;
  color:white;
  padding: 4px 6px 4px 6px;
  font: 11px arial;
  background: rgb(80,80,80);
  border: 0px;
  border-radius: 4px;
  pointer-events: none;
}

/*                           */
/* Gene horizontal barchart  */
/*                           */
#gene-bar-chart #title {
  font-size: 20px;
  padding-bottom: 10px;
  padding-top: 20px;
  font-weight: 300;
}



/*                      */
/*  Any svg chart       */
/*                      */
.y.axis line {
  fill: none;
  stroke: #e0e0e0;
  shape-rendering: crispEdges;
}

.x.axis line {
  fill: none;
  stroke: #e0e0e0;
  shape-rendering: crispEdges;
}

.axis path {
  fill: none;
  stroke: #848383;
  shape-rendering: crispEdges;
}

.axis .label {
  font-size: 12px;
}

.brush .extent {
  fill-opacity: .125;
  shape-rendering: crispEdges;
}

.resize {
  display: inline !important; /* show when empty */
  fill: #7A7A7A;
  fill-opacity: 1;
  stroke: #7A7A7A;
  stroke-width: 2px;
}

.input-group__input{
  min-height: 3px;
}

table.table tbody td, table.table tbody th{
  height: 7px;
}

.headerWidth{
  width: 1%;
  color: red
}
</style>
