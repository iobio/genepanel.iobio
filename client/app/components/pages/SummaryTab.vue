<template>
  <div>
    <div id="app">
      <v-app id="inspire" style="background-color:#f9fbff">
        <v-container fluid grid-list-md>
          <v-layout row wrap style="margin-top:-5px;">

            <!-- show description -->
            <v-flex xs12>
              <v-card>
                <div v-if="GtrGenesArr.length===0 && PhenolyzerGenesArr.length===0">
                  <v-card-title>
                      <h3>Summary</h3>
                  </v-card-title>
                  <v-card-title>
                    This page summaries the genes from both the sources: Genetic Testing Registry and phenolyzer.
                      <br><br>
                  </v-card-title>
                </div>
              </v-card>
            </v-flex>
            <!-- End description -->

            <!-- show main content -->
            <v-flex  d-flex xs12 >
              <v-layout row wrap>
                <!-- show data table -->
                <v-flex xs8>
                  <v-card>
                    <SummaryDataTable
                      v-if="GtrGenesArr.length>1 || PhenolyzerGenesArr.length>1"
                      v-on:TotalSummaryGenes="TotalSummaryGenes($event)"
                      v-on:TotalSummarySelectedGenes="TotalSummarySelectedGenes($event)"
                      v-bind:geneSearch="geneSearch"
                      v-bind:summaryTableData="summaryTableArray">
                    </SummaryDataTable>
                  </v-card>
                </v-flex>
                <!-- end data table -->

                <!-- start side bar -->
                <v-flex xs4 class="pr-2 pl-1">

                  <div class="d-flex mb-2 xs12">
                    <v-card v-if="GtrGenesArr.length>1 || PhenolyzerGenesArr.length>1">
                      <v-card-title primary-title>
                        <v-text-field
                          append-icon="search"
                          label="Search Genes"
                          single-line
                          hide-details
                          v-model="geneSearch"
                        ></v-text-field>
                      </v-card-title>
                      <br>
                    </v-card>
                  </div>
                  <br>
                  <div class="d-flex mt-1 mb-2 xs12">
                    <v-card v-bind:class="[chartComponent===null ? 'activeCardBox' : '']" v-if="GtrGenesArr.length>1 || PhenolyzerGenesArr.length>1">
                      <v-card-title primary-title>
                       <div>
                         <div style="font-size:16px">
                           GENES
                           <v-dialog v-model="dialog" width="600px">
                             <p style="cursor:pointer" slot="activator" ><v-icon small>help</v-icon></p>
                             <v-card>
                               <v-card-title>
                                 <span class="headline">Genes</span>
                               </v-card-title>
                               <v-card-text>
                                 Help information text
                               </v-card-text>
                               <v-card-actions>
                                 <v-spacer></v-spacer>
                                 <v-btn color="green darken-1" flat="flat" @click="dialog = false">Close</v-btn>
                               </v-card-actions>
                             </v-card>
                           </v-dialog>
                         </div>
                         <span style="margin-top:0px; margin-bottom:0px; font-size:26px"><strong>{{ selectedGenes }}</strong></span>
                         <div>of {{ totalGenes }} selected</div>
                       </div>
                     </v-card-title>
                    </v-card>
                  </div>
                  <br>
                  <div class="d-flex mb-2 xs12">
                      <v-card v-if="GtrGenesArr.length>1 && PhenolyzerGenesArr.length>1">
                        <SummaryPieChart
                          v-bind:summaryPieChartData="pieChartdataArr"
                          :color="chartColor">
                        </SummaryPieChart>
                      </v-card>
                  </div>

                </v-flex>

                <!-- end side bar -->
              </v-layout>
            </v-flex>

            <!-- end main content -->
          </v-layout>
        </v-container>
       </v-app>
    </div>
  </div>
</template>

<script>
import SummaryPieChart from '../viz/SummaryPieChart.vue';
import SummaryDataTable from './SummaryDataTable.vue';
import { bus } from '../../routes';
import FilterSummary from './FilterSummary.vue'
  export default {
    components: {
      'SummaryPieChart': SummaryPieChart,
      'SummaryDataTable': SummaryDataTable,
      'FilterSummary': FilterSummary
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
      chartColor: null
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
      summaryTableArray:[],
      geneSearch: '',
      selectedGenes: 0,
      totalGenes: 0,
      chartComponent: null,
      dialog: false,
    }),
    watch: {
      GtrGenesForSummary:function(){
        this.GtrGenes = this.GtrGenesForSummary;
        this.summaryTableArray=[];
        this.performSetOperations();
      },
      PhenolyzerGenesForSummary: function(){
        this.PhenolyzerGenes = this.PhenolyzerGenesForSummary;
        this.summaryTableArray=[];
        this.performSetOperations();
      }
    },
    mounted(){
      this.GtrGenes = this.GtrGenesForSummary;
      this.PhenolyzerGenes = this.PhenolyzerGenesForSummary;
      this.performSetOperations();
    },
    methods: {
      TotalSummaryGenes: function(e){
        this.totalGenes = e;
      },
      TotalSummarySelectedGenes: function(e){
        this.selectedGenes = e;
      },
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
        ]
      },
      setSummaryTableData(){
        var tempA = [];

        for(var i=0; i<this.commonGtrPhenoGenes.length; i++){
          for(var j=0; j<this.PhenolyzerGenes.length; j++){
            if(this.commonGtrPhenoGenes[i]===this.PhenolyzerGenes[j].geneName){
              tempA.push({
                name:this.PhenolyzerGenes[j].geneName,
                rank: parseInt(this.PhenolyzerGenes[j].rank),
                omimSrc: `https://www.ncbi.nlm.nih.gov/omim/?term=${this.PhenolyzerGenes[j].geneName}`,
                medGenSrc: `https://www.ncbi.nlm.nih.gov/medgen/?term=${this.PhenolyzerGenes[j].geneName}`,
                geneCardsSrc: `https://www.genecards.org/cgi-bin/carddisp.pl?gene=${this.PhenolyzerGenes[j].geneName}`,
                ghrSrc: `https://ghr.nlm.nih.gov/gene/${this.PhenolyzerGenes[j].geneName}`,
              })
            }
          }
        }

        tempA.sort(function(a, b){
          return a.rank - b.rank;
        });

        var arr=[];
        arr.push(tempA.map(x=>{
          return {
            name: x.name,
            isGtr: true,
            isPheno: true,
            sources: "GTR and Phenolyzer",
            noOfSources: 2
          }
        }))

        arr.push(this.uniqueGtrGenes.map(x=>{
          return {
            name: x,
            isGtr: true,
            isPheno: false,
            sources: "GTR",
            noOfSources: 1
          }
        }))


        arr.push(this.uniquePheno.map(x=>{
          return {
            name: x,
            isGtr: false,
            isPheno: true,
            sources: "Phenolyzer",
            noOfSources: 1
          }
        }))

        var tempSummaryTableArray = [];
        // console.log("summaryTableArray", this.summaryTableArray)
        tempSummaryTableArray = [...arr[0],...arr[1],...arr[2]];
        tempSummaryTableArray.map((x,i)=>{
          x["indexVal"]=i+1;
          x["omimSrc"]= `https://www.ncbi.nlm.nih.gov/omim/?term=${x.name}`;
          x["medGenSrc"]= `https://www.ncbi.nlm.nih.gov/medgen/?term=${x.name}`;
          x["geneCardsSrc"]= `https://www.genecards.org/cgi-bin/carddisp.pl?gene=${x.name}`;
          x["ghrSrc"] = `https://ghr.nlm.nih.gov/gene/${x.name}`;
          this.summaryTableArray.push(x);
        })

        // console.log(this.summaryTableArray)

      }
    }
  }
</script>

<style lang="sass">
@import ../assets/sass/variables

.activeCardBox
    border-bottom: 6px solid $activeCard-border

</style>
