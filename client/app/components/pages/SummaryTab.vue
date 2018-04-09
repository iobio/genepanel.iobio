<template>
  <div>
    <br><br>
    <center>
      <strong>Number of GTR Genes selected: {{ GtrGenesCount }}</strong>
      <br>
      <strong>Number of Phenolyzer Genes selected: {{ phenolyzerGenesCount }}</strong>
    </center>
  </div>
</template>

<script>
  export default {
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
      AllSourcesGenes:[]
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
      },
      PhenolyzerGenesForSummary: function(){
        this.PhenolyzerGenes = this.PhenolyzerGenesForSummary;
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

      }
    }
  }
</script>
