<template>
  <div>
    <div id="pie-chart-box1"></div>

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
        var data = dataForModeOfInheritance

        var width = 400,
          height = 220,
          radius = Math.min(width, height) / 2;

        var color = d3.scale.ordinal()
          .range(["#BBDEFB", "#90CAF9", "#64B5F6", "#42A5F5", "#2196F3", "#1E88E5", "#1976D2"]);

        var arcOver = d3.svg.arc()
          .outerRadius(radius - 10)
          .innerRadius(radius - 110);

        var arc = d3.svg.arc().outerRadius(radius + 10).innerRadius(radius - 108);

        var pie = d3.layout.pie()
          .sort(null)
          .value(function(d) {
            return d._geneCount;
          });

          var svg = d3.select("#pie-chart-box1").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

          var g = svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

          var path = g.append("path")
            .attr("d", arc)
            .attr("stroke", "white")
            .attr("stroke-width", 3)
            .style("box-shadow", "10px -10px  rgba(0,0,0,0.6)")
            .style("fill", function(d) {
              return color(d.data._modeOfInheritance);
            });

              path.on("click", function(d){
                // alert(d.data._modeOfInheritance)
                if(d.data.selected){
                  d3.select(this)
                      .transition()
                      .duration(200)
                      .attr("stroke", "white")
                      .attr("stroke-width", 1)
                      .attr("d", arcOver);

                  d.data.selected = !d.data.selected;
                  bus.$on('updateModeOfInheritance', d.data._modeOfInheritance, d.data.selected);
                  pieChartSomething(d.data._modeOfInheritance, d.data.selected)
                }
                else {
                  d3.select(this).transition()
                       .duration(200)
                       .attr("d", arc)
                       .attr("stroke", "white")
                       .attr("stroke-width", 3)

                       d.data.selected = !d.data.selected;
                       pieChartSomething(d.data._modeOfInheritance, d.data.selected)

                }
                // d.data.selected = !d.data.selected
                // pieChartSomething(d.data._modeOfInheritance, d.data.selected)
              })

          g.append("text")
            .attr("transform", function(d) {
              return "translate(" + arc.centroid(d) + ")";
            })
            .attr("dy", ".35em")
            .style("text-anchor", "middle")
            .text(function(d) {
              return d.data._modeOfInheritance;
            })
            .on('click', function(d){
              if(d.data.selected){
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("d", arcOver);

                d.data.selected = !d.data.selected
                pieChartSomething(d.data._modeOfInheritance, d.data.selected)
              }
              else {
                d3.select(this).transition()
                     .duration(200)
                     .attr("d", arc)


                     d.data.selected = !d.data.selected
                     pieChartSomething(d.data._modeOfInheritance, d.data.selected)

              }
              // d.data.selected = !d.data.selected
              // pieChartSomething(d.data._modeOfInheritance, d.data.selected)
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
