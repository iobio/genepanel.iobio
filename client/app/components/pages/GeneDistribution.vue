<template>
  <div>
    Gene Distribution Component
    <div>
      <div id="gene-distribution-chart"></div>
    </div>
  </div>
</template>

<script>
import { bus } from '../../routes';

  export default {
    props:['GeneData'],
    data(){
      return {
        geneDistributChart:{},
        GeneDistData: [],
        GeneDataForChart: [],
        count: 0,
      }
    },
    watch: {
      GeneData: function(){
        // alert("I am watching");
        //
        // console.log("watch genes from GeneDistribution: " , this.GeneData);
        // this.GeneDataForChart = this.GeneData.slice(0,50);
        // console.log("this.GeneDataForChart", this.GeneDataForChart);
        // this.count++;
        // if(this.count===1){
        //   this.doSomething();
        //   this.count=0
        // }


        this.GeneDataForChart = this.GeneData.slice(0,50);
        // alert(this.GeneDataForChart[0].value)
        this.draw(this.GeneData.slice(0,50))


      },
    },
    methods:{
      drawProperly(dataArray){
        console.log("data Array from drawProperly", dataArray)
        this.count++
        // alert(this.count)
        // let svg = null;
        // var dataArray = [{gene:'TCOF1', _genePanelCount:40}, {gene:'POLR1D', _genePanelCount:33}, {gene:'POLR1C', _genePanelCount: 33}, {gene:'DHODH', _genePanelCount:12},
        //   {gene:'EFTUD2', _genePanelCount:12},{gene:'EFTUD2', _genePanelCount:9},{gene:'EFTUD2', _genePanelCount:9},{gene:'EFTUD2', _genePanelCount:9},{gene:'EFTUD2', _genePanelCount:8}];
        var height = 350;
        var width = 700;
        // if (this.count==1){
          console.log('dataArray', dataArray)
           dataArray.sort(function(a,b){
             return a.value - b.value
           })
           console.log(dataArray);
        // d3.select("#gene-distribution-chart").remove();
        d3.select("#gene-distribution-chart").select("svg").remove();
        var chart = d3.select('#gene-distribution-chart')
                     .append('svg')
                     .attr('height', '400px')
                     .attr('width', '600px');

           var area = d3.svg.area()
                       .x(function(d,i){
                         return i*10;
                       })
                       .y0(height)
                       .y1(function(d){
                         console.log("y data in draw", d.value)
                         return height-d.value*7;
                       })
                       .interpolate("basis")

                       // .curve(d3.curveBasis)

           chart.append('path').attr('d', area(dataArray)).attr("fill", 'steelblue').attr("stroke", "blue").attr("stroke-width", "1px");

      // }
      },
      draw(dataArray){
        //d3.select("#gene-distribution-chart").remove();
        this.drawProperly(dataArray)
        }
      },
      doSomething(){
       this.draw(this.GeneDataForChart);
     },

    mounted(){
      console.log("GeneDistribution is mounted")
      console.log("props in geneDistributChart: ", this.GeneData);

    },
    updated(){
      // alert("GeneDistribution is updated!");
      // this.draw(this.GeneData.slice(0,50))

    },
    created(){
      // bus.$on("GeneDistributionChartData", (data)=> {
      //   this.GeneDataForChart = data.slice(0,50);
      //   console.log("this.GeneDataForChart from bus", this.GeneDataForChart[0].value)
      //  this.draw(this.GeneDataForChart)
      // })
    }
  }

  function AreaChart(){

  }
</script>

<style>
</style>
