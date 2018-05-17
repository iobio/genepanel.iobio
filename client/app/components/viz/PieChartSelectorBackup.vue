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
      color: null
    },
    data(){
      return {
        modesOfInheritance: []
      }
    },
    methods:{
      draw(dataForModeOfInheritance){
        let self = this;
        console.log("dataForModeOfInheritance: ", dataForModeOfInheritance)
        var data = dataForModeOfInheritance;

        // var dispatch = d3.dispatch("backupEvent");

        d3.select("#pie-chart-box2").select("svg").remove();

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
            return d._geneCount;
          });

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
            .style("fill", function(d,i) {
              return self.color(i);
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
              .style("fill", function(d,i) {
                return self.color(i);
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
