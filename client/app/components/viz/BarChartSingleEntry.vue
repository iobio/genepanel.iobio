<template>
  <canvas :id="idValue" width="400" height="400"></canvas>
</template>


<script>
import Chart from 'chart.js';
import { bus } from '../../routes';
import { Typeahead, Btn } from 'uiv';
import d3 from 'd3';
import Model from '../../models/Model';

var model = new Model();

  export default {
    components: {
    },
    props: {
      idValue: {
        type: String,
      },
      VizData: {
        type: Array
      },
      label: {
        type: String
      }
    },
    data(){
      return {
        myChart: null,
      }
    },
    mounted(){
      this.drawChart();
    },
    updated(){
    },
    watch: {
      VizData(){
        this.drawChart();
      }
    },
    methods:{
      drawChart(){
        var geneNames = [];
        var genepanelCounts = [];
        this.VizData.map(gene => {
          geneNames.push(gene.name);
          genepanelCounts.push(gene.value)
        })
        
        if(this.myChart!==null){
          this.myChart.destroy();
        }

        var ctx = document.getElementById(`${this.idValue}`);
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: geneNames,
                datasets: [{
                    label: this.label,
                    data: genepanelCounts,
                    backgroundColor:'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                    xAxes: [{
                      barThickness: 22  // number (pixels) or 'flex'
                    }]
                }
            }
        });
      }
    }
  }


</script>

<style lang="sass">
@import ../assets/sass/variables
@import url('https://fonts.googleapis.com/css?family=Open+Sans')

</style>
