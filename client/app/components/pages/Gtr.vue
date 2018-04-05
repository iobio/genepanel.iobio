<template>
  <div>
    <!-- <h1>GTR!</h1> -->
    <!-- <input type="text" v-model="search" placeholder="Search term" /> -->
    <center>
      <div style="display:inline-block; padding-top:5px;">
        <!-- <label>Disorders :</label> -->
        <!-- <form v-on:keyup.prevent="submitOnEnter"> -->
        <!-- v-on:keyup.prevent="submitOnEnter" -->
        <!-- <form v-on:submit.prevent="submitOnEnter"> -->
        <input
          id="input"
          class="form-control"
          type="text"
          autocomplete="off"
          v-on:keyup.prevent="submitOnEnter"
          placeholder="Search Disorder (E.g. Treacher Collins)">
        <!-- </form> -->
        <!-- </form> -->
        <typeahead
          match-start
          v-model="search"
          target="#input"
          :data="conditions"
          item-key="DiseaseName"/>

      </div>

      <v-btn
          style="margin-top:-0.35px"
          color="blue darken-1"
          class="btnColor"
          v-on:click.prevent="performSearch">
        Go
      </v-btn>
    </center>
    <!-- <img style="display:hidden" src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" height="70px" width="70px"> -->
    <p v-if="checked"><v-progress-linear :indeterminate="true"></v-progress-linear></p>
    <p>
      <v-alert outline color="warning" icon="priority_high" dismissible v-model="alert">
        Sorry, the following search term returns no data!
      </v-alert>
    </p>
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
        allGenes: geneData,
        enterCount: 0,
        DiseaseDataArray: [],
        checked:false,
        alert:false
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
      submitOnEnter: function(e){
        if (e.keyCode === 13) {
          this.enterCount++;
          if(this.enterCount===2){
            document.getElementById("input").blur();
            this.performSearch();
            this.enterCount = 0;
          }
        }
      },
      performSearch: function(){
        this.$emit('showDiseases', []);
        this.checked = true;
        this.alert=false;

        var searchTerm =""
        if(this.search.DiseaseName!==undefined){
          searchTerm = this.search.DiseaseName;
        }
        else if(this.search.DiseaseName===undefined) {
          searchTerm = this.search;
        }

        var diseases;
        model.promiseGetDiseases(searchTerm)
        .then(function(data){
          console.log("data got from promise : " , data)
          diseases = data.diseases;
          var promises = [];
          var filteredDiseases;

          console.log("diseasesss : ", diseases);
          // this.DiseaseDataArray = ["abcd"];
          // console.log("this.DiseaseDataArray", this.DiseaseDataArray)


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
          if (filteredDiseases.length===0) {

            this.alert= true;
          }
          this.checked=false;
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
      // filteredDiseasesForProps(filteredDiseases){
      //   var arr =[];
      //   console.log(filteredDiseases);
      //   for(var i=0; i<filteredDiseases.length; i++){
      //     //console.log("ConceptId ", filteredDiseases[i].ConceptId)
      //     arr.push({
      //       ConceptId: filteredDiseases[i].ConceptId,
      //       Title: filteredDiseases[i].Title,
      //       _geneCount: filteredDiseases[i]._geneCount,
      //       _genePanelCount: filteredDiseases[i]._genePanelCount,
      //       _modeOfInheritance: filteredDiseases[i]._modeOfInheritance,
      //       _omim: filteredDiseases[i]._omim,
      //       genePanels: filteredDiseases[i].genePanels
      //     })
      //   }
      //   console.log(arr);
      // //  this.diseaseData = arr;
      // //  this.$emit('showDiseases', arr)
      // }
    }
  }
</script>

<style scoped>
 .btnColor{
   color: white;
 }
 .btn{
   padding: 0px;
 }
 .form-control{
   font-size: 15px;
   font-weight: 800;
 }
#input{
  width: 850px;
  height:35px;
  margin-top: 4px;
}

/* Media Queries */

@media screen and (max-width: 1050px){
  #input{
    width: 800px;
    height:35px;
    margin-top: 4px;
  }
}

@media screen and (max-width: 950px){
  #input{
    width: 500px;
    height:35px;
    margin-top: 4px;
  }
}

@media screen and (max-width: 700px){
  #input{
    width: 400px;
    height:35px;
    margin-top: 4px;
    box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)
  }
  .btnColor{
    margin-top: 2px
  }
}

</style>
