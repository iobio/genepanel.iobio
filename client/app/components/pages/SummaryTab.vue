<template>
  <div>
    <br><br>
    <center>

      <!-- <strong>Number of GTR Genes selected: {{ GtrGenesCount }}</strong>
      <br>
      <strong>Number of Phenolyzer Genes selected: {{ phenolyzerGenesCount }}</strong> -->
    </center>
    <div id="app">
      <v-app id="inspire">
        <v-container fluid grid-list-md>
          <v-layout row wrap>
            <v-flex d-flex xs12 sm12 md12 lg12>
              <v-card>
                <v-card-text>
                  <v-layout row wrap>
                    <v-flex d-flex xs12 sm12 md4 lg4>
                        <center>
                          <!-- put the pie chart component here  -->
                          <SummaryPieChart
                            v-if="GtrGenesArr.length>1 || PhenolyzerGenesArr.length>1"
                            v-bind:summaryPieChartData="pieChartdataArr">
                          </SummaryPieChart>
                        </center>
                    </v-flex>

                    <v-flex d-flex xs12 sm12 md4 lg4>
                          <!-- put the pie chart component here  -->
                    </v-flex>

                    <v-flex d-flex xs12 sm12 md4 lg4>
                          <!-- put the pie chart component here  -->
                    </v-flex>

                 </v-layout>
                </v-card-text>
              </v-card>
            </v-flex>

          </v-layout>
        </v-container>
      </v-app>
    </div>
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
      uniqueGenes: [],
      summaryTableArray:[]
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

        this.uniqueGenes = Array.from(new Set(this.AllSourcesGenes));

        this.setPieChartData();
        this.setSummaryTableData();
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
          },
          {
            name: "Unique Genes",
            count: this.uniqueGenes.length
          }
        ]
      },
      setSummaryTableData(){
        var tempA = [];

        for(var i=0; i<this.commonGtrPhenoGenes.length; i++){
          for(var j=0; j<this.PhenolyzerGenes.length; j++){
            if(this.commonGtrPhenoGenes[i]===this.PhenolyzerGenes[j].geneName){
              tempA.push({
                name:this.PhenolyzerGenes[j].geneName,
                rank: parseInt(this.PhenolyzerGenes[j].rank)
              })
            }
          }
        }
        console.log("temp A", tempA)
        tempA.sort(function(a, b){
          return a.rank > b.rank;
        });

        var arr=[];
        arr.push(tempA.map(x=>{
          return {
            name: x.name,
            isGtr: true,
            isPheno: true
          }
        }))

        arr.push(this.uniqueGtrGenes.map(x=>{
          return {
            name: x,
            isGtr: true,
            isPheno: false
          }
        }))


        arr.push(this.uniquePheno.map(x=>{
          return {
            name: x,
            isGtr: false,
            isPheno: true
          }
        }))

        this.summaryTableArray = [...arr[0],...arr[1],...arr[2]];
        console.log(this.summaryTableArray)

      }
    }
  }
</script>
