<template>
  <div>
    <!-- <h1>GTR!</h1> -->
    <!-- <input type="text" v-model="search" placeholder="Search term" /> -->
    <div style="display:inline-block;">
      <label>Disorders :</label>
      <input
        style="width:650px"
        id="input"
        class="form-control"
        type="text"
        placeholder="Search Term...">
      <typeahead
        match-start
        v-model="search"
        target="#input"
        :data="conditions"
        item-key="DiseaseName"/>
    </div>
    <v-btn
        color="blue darken-1"
        class="btnColor"
        v-on:click.prevent="performSearch">
      Go
    </v-btn>
    <!-- <hr> -->
    <!-- <ul>
      <li v-for="d in diseaseData">{{ d.Title }}</li>
    </ul> -->

    <!-- <v-form >
          <v-text-field id="search-gene-name1" label="Conditions">
          </v-text-field>
          <typeahead v-model="selectedCondition" force-select match-start  target="#search-gene-name" :data="conditionsData" item-key="DiseaseName"/>
    </v-form>

    <v-form >
          <v-text-field id="search-gene-name" label="Gene">
          </v-text-field>
          <typeahead v-model="selectedGene" force-select match-start  target="#search-gene-name" :data="allGenes" item-key="gene_name"/>
    </v-form> -->

  </div>
</template>


<script>

import { Typeahead, Btn } from 'uiv';
import conditions from '../../../data/conditions.json';
import geneData from '../../../data/genes.json';

import { bus } from '../../routes';
import jQuery from 'jquery';
global.jQuery = jQuery;
global.$ = jQuery;
//import typeahead from 'jquery-typeahead'

import Model from './Model';
var model = new Model();

  export default {
    components: {
      Typeahead
    },
    data(){
      return {
        search: "",
        diseaseData : [],
        selectedCondition: {},
        conditions: conditions.data,
        selectedGene: {},
        allGenes: geneData
      }
    },
    // watch: {
    //   selectedCondition: function(a, b) {
    //     if (this.selectedCondition) {
    //       console.log("this.selectedCondition", this.selectedCondition.DiseaseName);
    //       this.search = this.selectedCondition.DiseaseName;
    //       //this.performSearch();
    //     }
    //   }
    // },

    mounted: function() {
       $("#search-gene-name").attr('autocomplete', 'off');
       $("#search-gene-name1").attr('autocomplete', 'off');
    },
    methods:{
      performSearch: function(){
        var searchTerm =""
        if(this.search.DiseaseName!==undefined){
          searchTerm = this.search.DiseaseName;
        }
        else if(this.search.DiseaseName===undefined) {
          searchTerm = this.search;
        }


        model.promiseGetDiseases(searchTerm)
        .then(function(data){
          console.log("data got from promise : " , data)
          var diseases = data.diseases;
          var promises = [];
          var filteredDiseases;

          console.log("diseasesss : ", diseases)


          data.diseases.forEach(function (disease){
             //console.log("disease: ", disease)

            var p = model.promiseGetGenePanels(disease)
            .then(function (data){
              // console.log("data from promiseGetGenePanels ", data);
              //console.log("data.genePanels " , data )

              var filteredGenePanels = model.processGenePanelData(data.genePanels);
              data.disease.genePanels = filteredGenePanels;


            },
            function(error) {

            })

             promises.push(p);

          })

          Promise.all(promises).then(function(){
             filteredDiseases = model.processDiseaseData(diseases);
             console.log("filteredDiseases",filteredDiseases)

            addFilteredDiseases(filteredDiseases);

           // this.$emit('showDiseases', filteredDiseases)
          })

        })
        var x = [];
        var addFilteredDiseases = (filteredDiseases) =>{
          console.log("filteredDiseases : ",filteredDiseases);
          this.$emit('showDiseases', filteredDiseases)
         //this.diseaseData = filteredDiseases;
        //this.filteredDiseasesForProps(filteredDiseases)

        }

      },
      methodA(){
        alert("you are in method A")
      },
      methodB(filteredDiseases){
        console.log(filteredDiseases)
        alert("I am in method B!");
        //this.diseaseData = filteredDiseases
      },
      filteredDiseasesForProps(filteredDiseases){
        var arr =[];
        console.log(filteredDiseases);
        for(var i=0; i<filteredDiseases.length; i++){
          //console.log("ConceptId ", filteredDiseases[i].ConceptId)
          arr.push({
            ConceptId: filteredDiseases[i].ConceptId,
            Title: filteredDiseases[i].Title,
            _geneCount: filteredDiseases[i]._geneCount,
            _genePanelCount: filteredDiseases[i]._genePanelCount,
            _modeOfInheritance: filteredDiseases[i]._modeOfInheritance,
            _omim: filteredDiseases[i]._omim,
            genePanels: filteredDiseases[i].genePanels
          })
        }
        console.log(arr);
      //  this.diseaseData = arr;
      //  this.$emit('showDiseases', arr)
      }
    }
  }
</script>

<style scoped>
 .btnColor{
   color: white;
 }
</style>
