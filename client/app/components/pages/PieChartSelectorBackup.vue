<template>
  <div>
    <v-card-title primary class="title">Genes inheritance modes</v-card-title>
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

        var widthPercent = "75%";
        var heightPercent = "220px";
        var width = 400,
          height = 240,
          radius = Math.min(width, height) / 2;

        var color = d3.scale.ordinal()
          .range(["#3F91CE", "#2D7BB7", "#296A9D", "#1D5280", ]);

        var arcOver = d3.svg.arc()
          .outerRadius(radius - 20)
          .innerRadius(radius - height/2);

        var arc = d3.svg.arc().outerRadius(radius).innerRadius(radius - height/2);

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
            .attr('viewBox', "0 0 " + parseInt(width) + " " + parseInt(height))
            .attr("preserveAspectRatio", "none")
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


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

          var path = g.append("path")
            .attr("d", arc)
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



          g.append("text")
            .attr("transform", function(d) {
              var _d = arc.centroid(d);
                _d[0] *= 1.6;	//multiply by a constant factor
                _d[1] *= 1.7;	//multiply by a constant factor
                return "translate(" + _d + ")";
            })
            .attr("dy", ".70em")
            .style("text-anchor", "middle")
            .text(function(d) {
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
      // console.log(" modeOfInheritanceData from PieChartSelector ", this.modeOfInheritanceData)
    },
    updated(){

    },
    created(){

    }
  }
</script>

<style>
</style>
