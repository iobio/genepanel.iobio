<template>
  <div>
    <div id="summary-pie-chart"></div>
  </div>
</template>

<script>
  export default {
    props:{
      summaryPieChartData:{
        type: Array
      },
      color: null

    },
    data: () => ({
      summaryData: [],
    }),
    watch: {
      summaryPieChartData: function(){
        this.summaryData = this.summaryPieChartData;
        this.draw();
      },

    },
    mounted(){
      console.log("this.summaryPieChartData", this.summaryPieChartData)
      this.summaryData = this.summaryPieChartData;
      this.draw();
    },
    methods: {
      draw(){
        let self = this;
        var data = this.summaryData;
        d3.select("#summary-pie-chart").select("svg").remove();

        var widthPercent = "100%";
        var heightPercent = "100%";
        var width = 400,
          height = 260,
          radius = Math.min(width, height) / 2;

        var arcOver = d3.svg.arc()
          .outerRadius(radius - 30)
          .innerRadius(radius - height/2);

        var arc = d3.svg.arc().outerRadius(radius- 15).innerRadius(radius - height/2);

        var pie = d3.layout.pie()
          .sort(null)
          .value(function(d) {
            return d.count;
          });

          var svg = d3.select("#summary-pie-chart").append("svg")
            .attr("height", heightPercent)
            .attr("width", widthPercent)
            .attr('viewBox', "0 0 " + parseInt(width * 1.2) + " " + parseInt(height))
            .attr("preserveAspectRatio", "none")
            .append("g")
            .attr("transform", "translate(" + width / 3.33 + "," + height / 2 + ")");


            var defs = svg.append("defs");

            // create filter with id #drop-shadow
            // height=130% so that the shadow is not clipped
            var filter = defs.append("filter")
                .attr("id", "drop-shadow")
                .attr("height", "130%");

            // SourceAlpha refers to opacity of graphic that this filter will be applied to
            // convolve that with a Gaussian with standard deviation 3 and store result
            // in blur
            filter.append("feGaussianBlur")
                .attr("in", "SourceAlpha")
                .attr("stdDeviation", 2)
                .attr("result", "blur");

            // translate output of Gaussian blur to the right and downwards with 2px
            // store result in offsetBlur
            filter.append("feOffset")
                .attr("in", "blur")
                .attr("dx", 2)
                .attr("dy", 2)
                .attr("result", "offsetBlur");

            filter.append("feFlood")
                .attr("in", "offsetBlur")
                .attr("flood-color", "#333")
                .attr("flood-opacity", "1")
                .attr("result", "offsetColor");

            filter.append("feComposite")
                .attr("in", "offsetColor")
                .attr("in2", "offsetBlur")
                .attr("operator", "in")
                .attr("result", "offsetBlur");

            // overlay original SourceGraphic over translated blurred opacity by using
            // feMerge filter. Order of specifying inputs is important!
            var feMerge = filter.append("feMerge");

            feMerge.append("feMergeNode")
                .attr("in", "offsetBlur")
            feMerge.append("feMergeNode")
                .attr("in", "SourceGraphic");


          var g = svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

          var count = 0;
          var path = g.append("path")
            .attr("d", arc)
            .attr("id", function(d){
              return "arc-"+ (count++);
            })
            .attr("stroke", "rgb(245, 245, 245)")
            .attr("stroke-width", 0.5)
            .style("filter", "url(#drop-shadow)")
            .style("fill", function(d,i) {
              return self.color(i);
            });



          //Setting legend
          var countt = 0;
          var legend = svg.append("g")
                          .attr("class", "legend")
                          .attr("transform", "translate(150, -105)")
                          .selectAll("g")
                          .data(pie(data))
                          .enter().append("g")
                          .attr("legend-id", function(d){
                            return countt++;
                          })
                          .style("cursor", "pointer")

          legend.append("circle")
              .attr("cy", function(d,i){
                return i*20;
              })
              .attr("r", 5)
              .style("fill", function(d,i) {
                return self.color(i);
              });
            legend.append("text")
                .attr("y", function(d,i){
                  return i * 20 + 5;
                })
                .attr("x", 25)
                .text(function(d){
                  return d.data.name;
                })

                //tooltip
            path.append("svg:title")
              .text(function(d){
                return d.data.name;
              })
      }
    }
  }
</script>
