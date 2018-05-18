export default function HistogramChart() {

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

  let color = null;

  var dispatch = d3.dispatch("barselect");

  let tooltip = d3.select("#tooltip");
  let tooltipText = function(d, i) {
        return d[0] + ", " + d[1];
  };

  let onSelected = function(selected) {
    // console.log(selected);
    dispatch.barselect(selected);
  }

  // A formatter for counts.
  let formatCount = d3.format(",.0f");

  let logFormat = function(d, i) {
    if (d < 1) {
      return "";
    } else {
      // console.log("d :" , d, " i : ", i, " i/2 : ",  i/2)
      if(i%2===0){
        var x = Math.log(d) / Math.log(10) + 1e-6;
        // console.log(Math.abs(x - Math.floor(x)))
        return Math.abs(x - Math.floor(x)) < 1.1 ? formatCount(d) : "";
      }
    }
  }

  let brushEnd = function() {
    var start = brush.extent()[0];
    var end   = brush.extent()[1];
    // console.log("start", Math.round(start));
    // console.log("end", Math.round(end));
    if(Math.round(start) === Math.round(end)){
      svg.selectAll(".bar").classed("selected", true);
    }
    else {
      svg.selectAll(".bar")
         .classed("selected", function(d,i) {
            var inBrushExtent = d.x >= Math.round(start) && d.x <= Math.round(end);
            // console.log("inBrushExtent", inBrushExtent)
            return inBrushExtent;
         })
    }


    svg.selectAll(".bar rect").attr("fill", color.notselected);
    svg.selectAll(".bar.selected rect").attr("fill", color.selected);


    var selected = [];
    svg.selectAll(".bar.selected").data().forEach(function(selectedBarData) {
      selected = selected.concat(Array.from(selectedBarData));
      // console.log("selected", selected)
    })
    onSelected(selected);
  }


  function chart(selection, options) {
    d3.select("#gene-histogram-chart1").select("svg").remove();
    // console.log("options in chart", options)
    // merge options and defaults
    options = $.extend(defaults,options);
    let innerHeight = height - margin.top - margin.bottom;
    let innerWidth  = width  - margin.left - margin.right;


    selection.each(function(dataOrig) {
      // console.log("dataOrig" , dataOrig)
      // set svg element
      svg = d3.select(this);
      svg.attr("width", widthPercent)
        .attr("height", heightPercent)
        .attr('viewBox', "0 0 " + parseInt(width+10) + " " + parseInt(height))
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
            // console.log("dataOrig.length : " , dataOrig.length)

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
          .attr("fill", 'lightgrey')
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
          .attr("transform", "translate(" +((x(data[0].dx) - x(0)) / 2) + "," + innerHeight + ")")  //((x(data[0].dx) - x(0)) / 2)
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
        // console.log("options", options);
        // console.log("options selectTop", options.selectTop);
        // console.log("data", dataForBrush)
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
        // console.log('minX' , minX , "  maxX " , maxX)
        brush.extent([minX, maxX]);
      }

      // console.log("data", dataForBrush)
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




      // brushGroup.selectAll(".resize")
      //   .append("line")
      //   .style("visibility", options.selectTop ? "visible" : "hidden")
      //   .attr("y2", innerHeight);

      // brushGroup.selectAll(".resize")
      //   .append("path")
      //   .style("visibility", options.selectTop ? "visible" : "hidden")
      //   .attr("d", d3.svg.symbol().type("triangle-up").size(20))
      //   .attr("transform", function(d,i) {
      //     return i ?  "translate(-4," + (innerHeight/2) + ") rotate(-90)" : "translate(4," + (innerHeight/2) + ") rotate(90)";
      //   });

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


  chart.color = function(_) {
    if (!arguments.length) return color;
    color = _;
    return chart;
  };

  d3.rebind(chart, dispatch, "on");
  return chart;
}
