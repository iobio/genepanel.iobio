<template>
  <div>
    <br><br>
    <center>
      <SummaryPieChart
        v-if="GtrGenesArr.length>1 || PhenolyzerGenesArr.length>1"
        v-bind:summaryPieChartData="pieChartdataArr">
      </SummaryPieChart>
      <strong>Number of GTR Genes selected: {{ GtrGenesCount }}</strong>
      <br>
      <strong>Number of Phenolyzer Genes selected: {{ phenolyzerGenesCount }}</strong>
    </center>
  </div>
</template>

<script>
import SummaryPieChart from './SummaryPieChart.vue';
  export default {
    components: {
      'SummaryPieChart': SummaryPieChart
    },
    props:{
      NumberOfGtrGenes:{
        type: Number
      },
      NumberOfPhenolyzerGenes:{
        type:Number
      },
      GtrGenesForSummary:{
        type:Array
      },
      PhenolyzerGenesForSummary:{
        type:Array
      },
    },
    data: () => ({
      gradient: 'to top, #7B1FA2, #E1BEE7',
      GtrGenesCount: 0,
      phenolyzerGenesCount:0,
      GtrGenes:[],
      PhenolyzerGenes: [],
      GtrGenesArr:[],
      PhenolyzerGenesArr:[],
      AllSourcesGenes:[],
      commonGtrPhenoGenes:[],
      uniqueGtrGenes:[],
      uniquePhenoGenes:[],
      pieChartdataArr:[],
    }),
    watch: {
      NumberOfGtrGenes: function(){
        this.GtrGenesCount = this.NumberOfGtrGenes;
      },
      NumberOfPhenolyzerGenes:function(){
        this.phenolyzerGenesCount = this.NumberOfPhenolyzerGenes;
      },
      GtrGenesForSummary:function(){
        this.GtrGenes = this.GtrGenesForSummary;
        this.performSetOperations();
      },
      PhenolyzerGenesForSummary: function(){
        this.PhenolyzerGenes = this.PhenolyzerGenesForSummary;
        this.performSetOperations();
      }
    },
    mounted(){
      this.GtrGenesCount = this.NumberOfGtrGenes;
      this.phenolyzerGenesCount = this.NumberOfPhenolyzerGenes;
      this.GtrGenes = this.GtrGenesForSummary;
      this.PhenolyzerGenes = this.PhenolyzerGenesForSummary;
      this.performSetOperations();
    },
    methods: {
      performSetOperations: function(){
        var gtrGenes = this.GtrGenes.map(gene => {
          return gene.name
        })
        this.GtrGenesArr = gtrGenes;

        var phenolyzerGenes = this.PhenolyzerGenes.map(gene => {
          return gene.geneName
        })
        this.PhenolyzerGenesArr = phenolyzerGenes;

        var allGenes = [...gtrGenes, ...phenolyzerGenes];
        this.AllSourcesGenes = allGenes;

        var gtrSet = new Set(this.GtrGenesArr);
        var phenolyzerSet = new Set(this.PhenolyzerGenesArr);
        var intersectGtrPhenolyzer = new Set([...gtrSet].filter(x => phenolyzerSet.has(x)));
        this.commonGtrPhenoGenes = [...intersectGtrPhenolyzer];

        var uniqueGtr = new Set([...gtrSet].filter(x => !phenolyzerSet.has(x)));
        this.uniqueGtrGenes = [...uniqueGtr];

        var uniquePheno = new Set([...phenolyzerSet].filter(x => !gtrSet.has(x)));
        this.uniquePheno = [...uniquePheno];

        this.setPieChartData();
      },
      setPieChartData(){
        this.pieChartdataArr = [
          {
            name: "Unique to GTR",
            count: this.uniqueGtrGenes.length
          },
          {
            name: "Unique to Phenolyzer",
            count: this.uniquePheno.length
          },
          {
            name: "GTR and Phenolyzer",
            count: this.commonGtrPhenoGenes.length
          }
        ]
      },
    }
  }
</script>
