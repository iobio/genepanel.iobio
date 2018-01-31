<template>
  <div>
    <h1>GTR!</h1>
    <input type="text" v-model="search" placeholder="Search term" />
    <button v-on:click.prevent="performSearch"> Go </button>
    {{ search }}
    <hr>
    <ul>
      <li v-for="d in diseaseData">{{ d.Title }}</li>
    </ul>
  </div>
</template>

<script>
import { bus } from '../../routes';

import Model from './Model';
var model = new Model();

  export default {
    data(){
      return {
        search: "",
        diseaseData : []
      }
    },
    created() {
    },
    methods:{
      performSearch: function(){
        var searchTerm = this.search;
        
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

<style>
</style>
