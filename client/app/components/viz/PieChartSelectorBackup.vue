<template>
  <div>
    <div class="chart-title">Genes inheritance modes</div>
    <div id="pie-chart-box2"></div>
  </div>
</template>

<script>
import { bus } from '../../routes';

  export default {
    props: {
      modeOfInheritanceData: {
        type: Array
      },
    },
    data(){
      return {
        modesOfInheritance: []
      }
    },
    methods:{
      draw(dataForModeOfInheritance){
        console.log("dataForModeOfInheritance: ", dataForModeOfInheritance)
        var data = dataForModeOfInheritance;

        // var dispatch = d3.dispatch("backupEvent");

        d3.select("#pie-chart-box2").select("svg").remove();

        var widthPercent = "100%";
        var heightPercent = "100%";
        var width = 400,
          height = 260,
          radius = Math.min(width, height) / 2;

      //   var color = d3.scale.ordinal()
      //     .range([
			// 	"#2484c1", "#65a620", "#7b6888", "#a05d56", "#961a1a", "#d8d23a", "#e98125", "#d0743c", "#635222", "#6ada6a",
			// 	"#0c6197", "#7d9058", "#207f33", "#44b9b0", "#bca44a", "#e4a14b", "#a3acb2", "#8cc3e9", "#69a6f9", "#5b388f",
			// 	"#546e91", "#8bde95", "#d2ab58", "#273c71", "#98bf6e", "#4daa4b", "#98abc5", "#cc1010", "#31383b", "#006391",
			// 	"#c2643f", "#b0a474", "#a5a39c", "#a9c2bc", "#22af8c", "#7fcecf", "#987ac6", "#3d3b87", "#b77b1c", "#c9c2b6",
			// 	"#807ece", "#8db27c", "#be66a2", "#9ed3c6", "#00644b", "#005064", "#77979f", "#77e079", "#9c73ab", "#1f79a7"
			// ]); //["#3F91CE", "#2D7BB7", "#296A9D", "#1D5280", ]

      var color = d3.scale.ordinal()
        .range([
       "#1999d3", "#107dac", "#014f73", "#02344b", "#8bb3c6", "#2b6178", "#005b96"
    ]);

        var arcOver = d3.svg.arc()
          .outerRadius(radius - 30)
          .innerRadius(radius - height/2);

        var arc = d3.svg.arc().outerRadius(radius- 15).innerRadius(radius - height/2);

        var pie = d3.layout.pie()
          .sort(null)
          .value(function(d) {
            return d._geneCount;
          });

          // var svg = d3.select("#pie-chart-box2").append("svg")
          //   .attr("width", width)
          //   .attr("height", height)
          //   .append("g")
          //   .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

          var svg = d3.select("#pie-chart-box2").append("svg")
            .attr("height", heightPercent)
            .attr("width", widthPercent)
            .attr('viewBox', "0 0 " + parseInt(width * 1.5) + " " + parseInt(height))
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
            .style("fill", function(d) {
              return color(d.data._modeOfInheritance);
            });

            //On click events
              path.on("click", function(d){
                if(d.data.selected){
                  d3.select(this)
                      .transition()
                      .duration(200)
                      .attr("stroke", "white")
                      .attr("stroke-width", 0)
                      .attr("d", arcOver);

                  d.data.selected = !d.data.selected;
                  bus.$on('updateModeOfInheritance', d.data._modeOfInheritance, d.data.selected);
                  pieChartSomething(d.data._modeOfInheritance, d.data.selected);
                }
                else {
                  d3.select(this).transition()
                       .duration(200)
                       .attr("d", arc)
                       .attr("stroke", "rgb(245, 245, 245)")
                       .attr("stroke-width", 0.5)

                       d.data.selected = !d.data.selected;
                       pieChartSomething(d.data._modeOfInheritance, d.data.selected);
                }
              })


            //Mouse over event
              path.on("mouseover", function(d){
                // console.log(d3.select(this).attr("id"))
                if(d.data.selected){
                  d3.select(this)
                      .transition()
                      .duration(200)
                      .attr("stroke", "white")
                      .attr("stroke-width", 0)
                      .attr("d", arcOver);
                }
                else {
                  d3.select(this).transition()
                       .duration(200)
                       .attr("d", arc)
                       .attr("stroke", "rgb(245, 245, 245)")
                }
              })

            //Mouse out event
            path.on("mouseout", function(d){
              if(!d.data.selected){
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("stroke", "white")
                    .attr("stroke-width", 0)
                    .attr("d", arcOver);
              }
              else if(d.data.selected) {
                d3.select(this).transition()
                     .duration(200)
                     .attr("d", arc)
                     .attr("stroke", "rgb(245, 245, 245)")
              }
            })


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
              .style("fill", function(d) {
                return color(d.data._modeOfInheritance);
              });
            legend.append("text")
                .attr("y", function(d,i){
                  return i * 20 + 5;
                })
                .attr("x", 25)
                .text(function(d){
                  return d.data._modeOfInheritance;
                })
                .style("font-size", "1.1em")


                legend.on("mouseover", function(d){
                  var oarc = d3.select("#pie-chart-box2 #arc-" + $(this).attr("legend-id"));
                  // console.log(oarc[0][0].__data__.data.selected)
                  // console.log(oarc[0][0].__data__.data._modeOfInheritance)
                  if(oarc[0][0].__data__.data.selected){
                    oarc.style("opacity", 0.7)
                    .attr("stroke", "red")
                    .transition()
                    .duration(200)
                    // .attr("d", arcOver)
                    .attr("stroke-width", 1)
                  }
                  else {
                    oarc.style("opacity", 0.7)
                    .attr("stroke", "red")
                    .transition()
                    .duration(200)
                    // .attr("d", arc)
                    .attr("stroke-width", 1)
                  }

                })

                legend.on("mouseout", function(d){
                  var oarc = d3.select("#pie-chart-box2 #arc-" + $(this).attr("legend-id"));
                  if(oarc[0][0].__data__.data.selected){
                    oarc.style("opacity", 1)
                    .attr("stroke", "white")
                    .transition()
                    .duration(200)
                    // .attr("d", arcOver)
                    .attr("stroke-width", 1)
                  }
                  else {
                    oarc.style("opacity", 1)
                    .attr("stroke", "white")
                    .transition()
                    .duration(200)
                    // .attr("d", arc)
                    .attr("stroke-width", 1)
                  }
                  oarc.style("opacity", 1)
                  .attr("stroke", "white")
                  .transition()
                  .duration(200)
                  // .attr("d", arcOver)
                  // .attr("stroke-width", 1)
                })
                //tooltip
                path.append("svg:title")
                  .text(function(d){
                    return d.data._modeOfInheritance;
                  })



          // g.append("text")
          //   .attr("transform", function(d) {
          //     var _d = arc.centroid(d);
          //       _d[0] *= 1.6;	//multiply by a constant factor
          //       _d[1] *= 1.7;	//multiply by a constant factor
          //       return "translate(" + _d + ")";
          //   })
          //   .attr("dy", ".70em")
          //   .style("text-anchor", "middle")
          //   .text(function(d) {
          //     return d.data._modeOfInheritance;
          //   })

          var pieChartSomething =(modeOfInheritance, selection)=>{
            this.updateFromPieChart(modeOfInheritance, selection)
          }
      },
      updateFromPieChart(modeOfInheritance, selection){
        bus.$emit('updateModeOfInheritance',modeOfInheritance, selection);

      }
    },
    mounted(){
      this.modesOfInheritance = this.modeOfInheritanceData
      this.draw(this.modesOfInheritance)
      // console.log(" modeOfInheritanceData from PieChartSelector ", this.modeOfInheritanceData)
    },
    updated(){

    },
    created(){

    }
  }
</script>

<style lang="sass">
.chart-title
  font-size: 16px
  font-family:  "Open sans"


</style>
