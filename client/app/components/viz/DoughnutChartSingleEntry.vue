<template>
  <div>
    <canvas id="doughnutChartSearchTerms" width="300" height="300"></canvas>
  </div>
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
      GtrTermsLength: {
        type: Number,
      },
      PhenolyzerTermsLength: {
        type: Number
      },
      HpoTermsLength: {
        type: Number
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
      GtrTermsLength(){
        setTimeout(()=>{
          this.drawChart();
        },1200)
      },
      PhenolyzerTermsLength(){
        setTimeout(()=>{
          this.drawChart();
        },1200)
      },
      HpoTermsLength(){
        setTimeout(()=>{
          this.drawChart();
        },1200)
      }
    },
    methods:{
      drawChart(){

        if(this.myChart!==null){
          this.myChart.destroy();
        }

        var ctx = document.getElementById("doughnutChartSearchTerms");
        this.myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels: [
                    'Gtr Terms',
                    'Phenolyzer Terms',
                    'HPO Terms'
                ],
                datasets: [{
                    data: [this.GtrTermsLength, this.PhenolyzerTermsLength, this.HpoTermsLength],
                    backgroundColor: [
                      'rgb(255, 159, 64, 0.4)',
                      'rgba(54, 162, 235, 0.4)',
                      'rgba(255, 195, 51, 0.4)'

                    ],
                    borderColor: [
                      'rgb(255, 159, 64, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 195, 51, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
              cutoutPercentage: 65,
              maintainAspectRatio: false
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
