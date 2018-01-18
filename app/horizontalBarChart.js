function HorizontalBarChart() {

  var container;
  var data = []

  var margin = {top: 10, right: 10, bottom: 30, left: 60};
  var width  = 300;
  var height = 400;

  var marginSmall = {top: 10, right: 10, bottom: 30, left: 10};
  var widthSmall = 100;

  var svg = null;
  var defs = null;

  var gBrush = null;
  var brush = null;

  var xScale = null;
  var xScaleMini = null;
  var yScale = null;

  var yScaleMini = null;
  var yZoom = null;

  var xAxis = null;
  var yAxis = null;

  var widthSmallChart = null;
  var textScale = null;

  var dispatch = d3.dispatch("barselect");


  function chart(theContainer, theData, options) {

    container = theContainer;
    data = theData;



    /////////////////////////////////////////////////////////////
    ///////////////// Set-up SVG and wrappers ///////////////////
    /////////////////////////////////////////////////////////////

    var widthChart  = width - widthSmall - margin.left - margin.right;
    var heightChart = height - margin.top - margin.bottom;

    var heightSmallChart = heightChart - marginSmall.top - marginSmall.bottom;
    var widthSmallChart  = widthSmall - marginSmall.left - marginSmall.right;

    container.select("svg").remove();

    if (theData = null || theData.length == 0) {
      return;
    }

    svg = container.append("svg")
        .attr("class", "svgWrapper")
        .attr("width", widthChart + margin.left + margin.right + widthSmallChart + marginSmall.left + marginSmall.right)
        .attr("height", heightChart + margin.top + margin.bottom)
        .on("mousedown.zoom", null)
        .on("touchstart.zoom", null)
        .on("touchmove.zoom", null)
        .on("touchend.zoom", null);

    var mainGroup = svg.append("g")
            .attr("class","mainGroupWrapper")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")")
            .append("g") //another one for the clip path - due to not wanting to clip the labels
            .attr("clip-path", "url(#clip)")
            .style("clip-path", "url(#clip)")
            .attr("class","mainGroup")

    var miniGroup = svg.append("g")
            .attr("class","miniGroup")
            .attr("transform","translate(" + (margin.left + widthChart + margin.right + marginSmall.left) + "," + marginSmall.top + ")");

    var brushGroup = svg.append("g")
            .attr("class","brushGroup")
            .attr("transform","translate(" + (margin.left + widthChart + margin.right + marginSmall.left) + "," + marginSmall.top + ")");

    /////////////////////////////////////////////////////////////
    ////////////////////// Initiate scales //////////////////////
    /////////////////////////////////////////////////////////////

    xScale = d3.scale.linear().range([0, widthChart]);
    xScaleMini = d3.scale.linear().range([0, widthSmallChart]);

    yScale = d3.scale.ordinal().rangeBands([0, heightChart], 0.4, 0);
    yScaleMini = d3.scale.ordinal().rangeBands([0, heightSmallChart], 0.4, 0);

    //Based on the idea from: http://stackoverflow.com/questions/21485339/d3-brushing-on-grouped-bar-chart
    yZoom = d3.scale.linear()
        .range([0, heightChart])
        .domain([0,heightChart]);

    //Create x axis object
    xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom")
      .ticks(4)
      //.tickSize(0)
      .outerTickSize(0);

    //Add group for the x axis
    d3.select(".mainGroupWrapper").append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + 0 + "," + (heightChart) + ")");

    //Create y axis object
    yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left")
      .tickSize(0)
      .outerTickSize(0);

    // Add the text label for the x axis
    d3.select(".mainGroupWrapper").append("text")
        .attr("transform", "translate(" + ((widthChart / 2)) + " ," + (heightChart + margin.bottom) + ")")
        .style("text-anchor", "middle")
        .text("Gene Panels");


    //Add group for the y axis
    mainGroup.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(-5,0)");

    /////////////////////////////////////////////////////////////
    /////////////////////// Update scales ///////////////////////
    /////////////////////////////////////////////////////////////

    //Update the scales
    xScale.domain([0, d3.max(data, function(d) { return d.value; })]);
    xScaleMini.domain([0, d3.max(data, function(d) { return d.value; })]);
    yScale.domain(data.map(function(d) { return d.name; }));
    yScaleMini.domain(data.map(function(d) { return d.name; }));

    //Create the visual part of the y axis
    d3.select(".mainGroup").select(".y.axis").call(yAxis);
    d3.select(".mainGroupWrapper").select(".x.axis").call(xAxis);

    /////////////////////////////////////////////////////////////
    ///////////////////// Label axis scales /////////////////////
    /////////////////////////////////////////////////////////////

    textScale = d3.scale.linear()
      .domain([15,50])
      .range([12,6])
      .clamp(true);

    /////////////////////////////////////////////////////////////
    ///////////////////////// Create brush //////////////////////
    /////////////////////////////////////////////////////////////

    //What should the first extent of the brush become
    var brushExtent = 50;
    var yExtentEnd = brushExtent >= data.length ? yScaleMini.rangeExtent()[1] : yScaleMini(data[brushExtent].name);

    brush = d3.svg.brush()
        .y(yScaleMini)
        .extent([yScaleMini(data[0].name), yExtentEnd])
        .on("brush", brushmove)
        //.on("brushend", brushend);

    //Set up the visual part of the brush
    gBrush = d3.select(".brushGroup").append("g")
      .attr("class", "brush")
      .call(brush);

    gBrush.selectAll(".resize")
      .append("line")
      .attr("x2", widthSmallChart);

    gBrush.selectAll(".resize")
      .append("path")
      .attr("d", d3.svg.symbol().type("triangle-up").size(20))
      .attr("transform", function(d,i) {
        return i ? "translate(" + (widthSmallChart/2) + "," + 4 + ") rotate(180)" : "translate(" + (widthSmallChart/2) + "," + -4 + ") rotate(0)";
      });

    gBrush.selectAll("rect")
      .attr("width", widthSmallChart);

    //On a click recenter the brush window
    gBrush.select(".background")
      .on("mousedown.brush", brushcenter)
      .on("touchstart.brush", brushcenter);

    ///////////////////////////////////////////////////////////////////////////
    /////////////////// Create a rainbow gradient - for fun ///////////////////
    ///////////////////////////////////////////////////////////////////////////

    defs = svg.append("defs")

    //Create two separate gradients for the main and mini bar - just because it looks fun
    createGradient("gradient-rainbow-main", "60%");
    createGradient("gradient-rainbow-mini", "13%");

    //Add the clip path for the main bar chart
    defs.append("clipPath")
      .attr("id", "clip")
      .append("rect")
	    .attr("x", -margin.left)
      .attr("width", widthChart + margin.left)
      .attr("height", heightChart);

    /////////////////////////////////////////////////////////////
    /////////////// Set-up the mini bar chart ///////////////////
    /////////////////////////////////////////////////////////////

    //The mini brushable bar
    //DATA JOIN
    var barMini = d3.select(".miniGroup").selectAll(".bar")
      .data(data, function(d) { return d.key; });

    //UDPATE
    barMini
      .attr("width", function(d) { return xScaleMini(d.value); })
      .attr("y", function(d,i) { return yScaleMini(d.name); })
      .attr("height", yScaleMini.rangeBand());

    //ENTER
    barMini.enter().append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("width", function(d) { return xScaleMini(d.value); })
      .attr("y", function(d,i) { return yScaleMini(d.name); })
      .attr("height", yScaleMini.rangeBand())
      .style("fill", "url(#gradient-rainbow-mini)");

    //EXIT
    barMini.exit()
      .remove();

    //Start the brush
    gBrush.call(brush.event);

  }//init

  //Function runs on a brush move - to update the big bar chart
  var update = function() {
    /////////////////////////////////////////////////////////////
    ////////// Update the bars of the main bar chart ////////////
    /////////////////////////////////////////////////////////////
    //DATA JOIN
    var bar = d3.select(".mainGroup").selectAll(".bar")
        .data(data, function(d) { return d.key; });

    //UPDATE
    bar
      .attr("x", 0)
      .attr("width", function(d) { return xScale(d.value); })
      .attr("y", function(d,i) { return yScale(d.name); })
      .attr("height", yScale.rangeBand());

    //ENTER
    bar.enter().append("rect")
      .attr("class", "bar")
      .style("fill", "url(#gradient-rainbow-main)")
      .attr("x", 0)
      .attr("width", function(d) { return xScale(d.value); })
      .attr("y", function(d,i) { return yScale(d.name); })
      .attr("height", yScale.rangeBand());

    //EXIT
    bar.exit()
      .remove();

  }//update

  /////////////////////////////////////////////////////////////
  ////////////////////// Brush functions //////////////////////
  /////////////////////////////////////////////////////////////

  //First function that runs on a brush move
  var brushmove = function() {

    var extent = brush.extent();

    //Reset the part that is visible on the big chart
    var originalRange = yZoom.range();
    yZoom.domain( extent );

    /////////////////////////////////////////////////////////////
    ///////////////////// Update the axis ///////////////////////
    /////////////////////////////////////////////////////////////

    //Update the domain of the x & y scale of the big bar chart
    yScale.domain(data.map(function(d) { return d.name; }));
    yScale.rangeBands( [ yZoom(originalRange[0]), yZoom(originalRange[1]) ], 0.4, 0);

    //Update the y axis of the big chart
    svg.select(".mainGroup")
      .select(".y.axis")
      .call(yAxis);

    /////////////////////////////////////////////////////////////
    /////////////// Update the mini bar fills ///////////////////
    /////////////////////////////////////////////////////////////

    //Update the colors within the mini bar chart
    var selected = yScaleMini.domain()
      .filter(function(d) { return (extent[0] - yScaleMini.rangeBand() + 1e-2 <= yScaleMini(d)) && (yScaleMini(d) <= extent[1] - 1e-2); });

    //Update the colors of the mini chart - Make everything outside the brush grey
    svg.select(".miniGroup").selectAll(".bar")
      .style("fill", function(d, i) { return selected.indexOf(d.name) > -1 ? "url(#gradient-rainbow-mini)" : "#a3a3a3"; });

    //Update the label size
    svg.selectAll(".y.axis text")
      .style("font-size", textScale(selected.length));

    dispatch.barselect(selected);

    //Update the big bar chart
    update();

  }//brushmove

  /////////////////////////////////////////////////////////////
  ////////////////////// Click functions //////////////////////
  /////////////////////////////////////////////////////////////

  //Based on http://bl.ocks.org/mbostock/6498000
  //What to do when the user clicks on another location along the brushable bar chart
  var brushcenter = function() {

    var target = d3.event.target,
        extent = brush.extent(),
        size = extent[1] - extent[0],
        range = yScaleMini.range(),
        y0 = d3.min(range) + size / 2,
        y1 = d3.max(range) + yScaleMini.rangeBand() - size / 2,
        center = Math.max( y0, Math.min( y1, d3.mouse(target)[1] ) );

    d3.event.stopPropagation();

    gBrush
        .call(brush.extent([center - size / 2, center + size / 2]))
        .call(brush.event);

  }//brushcenter


  /////////////////////////////////////////////////////////////
  ///////////////////// Helper functions //////////////////////
  /////////////////////////////////////////////////////////////

  //Create a gradient
  var createGradient = function(idName, endPerc) {

    var colors = [ '#7fcdbb','#41b6c4','#1d91c0','#225ea8','#0c2c84'];

    defs.append("linearGradient")
      .attr("id", idName)
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", endPerc).attr("y2", "0%")
      .selectAll("stop")
      .data(colors)
      .enter().append("stop")
      .attr("offset", function(d,i) { return i/(colors.length-1); })
      .attr("stop-color", function(d) { return d; });
  }//createGradient


  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };
  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };
  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };
  chart.marginSmall = function(_) {
    if (!arguments.length) return marginSmall;
    marginSmall = _;
    return chart;
  };
  chart.widthSmall = function(_) {
    if (!arguments.length) return widthSmall;
    widthSmall = _;
    return chart;
  };

  d3.rebind(chart, dispatch, "on");
  return chart;
}