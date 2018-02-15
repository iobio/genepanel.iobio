<template>
  <div>

    <div id="phenotype-input" style="display:inline-block;">
      <!-- <v-text-field id="phenotype-term" hide-details v-model="phenotypeTermEntered"
      label="enter phenotype">
      </v-text-field> -->
      <input
        id="phenotype-term"
        class="form-control"
        type="text"
        placeholder="Search Term..."
        v-model="phenotypeTermEntered">
      <typeahead
       v-model="phenotypeTerm"
      hide-details="false"
      force-select match-start
      target="#phenotype-term"
      async-src="http://nv-blue.iobio.io/hpo/hot/lookup/?term=" item-key="value"/>
    </div>
    <btn v-on:click="onSearchPhenolyzerGenes">go</btn>

    <div v-if="phenotypeTermEntered.length>0">
      Search term: {{ phenotypeTermEntered }}
    </div>
    <div v-if="phenolyzerStatus!==null">
      {{ phenolyzerStatus }}
    </div>
    <br>
    <strong>Genes </strong>
    <ul v-if="geneList.length>0">
      <li v-for="gene in geneList">
        {{gene.rank}} -- {{gene.geneName}} -- {{gene.score}}
      </li>
    </ul>

  </div>
</template>


<script>
import { Typeahead, Btn } from 'uiv';
import GeneModel from './GeneModel';
var geneModel = new GeneModel();

  export default {
    components: {
      Typeahead
    },
    data(){
      return {
        showGenesMenu: null,

        genesToApply: null,

        phenolyzerTopCounts: [30, 50, 80, 100],
        phenolyzerTop: 50,
        phenotypeTerm: "",
        phenotypeTermEntered: "",
        allPhenotypeTerms: [],
        phenolyzerStatus: null,
        geneList: [],
      }
    },
    methods: {
      onSearchPhenolyzerGenes: function() {
        let self = this;
        self.phenolyzerStatus = null;
        self.genesToApply = "";
        var searchTerm = self.phenotypeTerm.value;
        self.phenotypeTermEntered = self.phenotypeTerm.value;
        geneModel.searchPhenolyzerGenes(searchTerm, this.phenolyzerTop,
        function(status, error) {
          if (status == 'done') {
            if (geneModel.phenolyzerGenes.length == 0) {
              self.phenolyzerStatus = "no genes found."
              self.genesToApply = "";
            } else {
              var geneCount = geneModel.phenolyzerGenes.filter(function(gene) {
                return gene.selected;
              }).length;
              self.genesToApply = geneModel.phenolyzerGenes
              .filter(function(gene) {
                console.log(gene)
                return gene.selected;
              })
              .map( function(gene) {
                return gene.geneName;
              })
              .join(", ");

              var x = geneModel.phenolyzerGenes
              .filter(function(gene) {
                return gene.selected;
              })
              .map( function(gene) {
                return gene;
              })

              //console.log(x);
              var tempArr = [];

              tempArr.push(x);
              self.geneList = tempArr[0]
              console.log("genelist", self.geneList)

              self.phenolyzerStatus = geneCount + " genes shown.";
              console.log(self.phenolyzerStatus)
            }
          } else {
            self.phenolyzerStatus = status;
          }
        });
      }
    }
  }
</script>
