<template>
  <div style="">
    <span style="padding-right:4px">Disorder</span>
      <div style="display:inline-block; padding-top:5px;">
        <input
          id="input"
          class="form-control"
          type="text"
          autocomplete="off"
          placeholder="Search Disorder (E.g. Treacher Collins Syndrome)">
        <typeahead
          match-start
          v-model="search"
          target="#input"
          :data="conditions"
          :limit="parseInt(100)"
          item-key="DiseaseName"/>

      </div>

      <v-btn
          style="margin-top:-0.35px"
          color="blue darken-1"
          class="btnColor"
          v-on:click.prevent="performSearch">
        Go
      </v-btn>
    <p v-if="checked" ><v-progress-linear height="3" color="cyan darken-2" :indeterminate="true"></v-progress-linear></p>
    <p>
      <v-alert  color="warning" dismissible v-model="alert">
        Sorry, the following search term returns no data!
      </v-alert>
    </p>
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

import Model from '../../models/Model';
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
        selectedGene: {},
        allGenes: geneData,
        enterCount: 0,
        DiseaseDataArray: [],
        checked:false,
        alert:false
      }
    },
    watch: {
      search: function() {
        if (this.search && this.search.DiseaseName) {
          this.performSearch();
        }
      }
    },

    mounted: function() {
       $("#search-gene-name").attr('autocomplete', 'off');
       $("#search-gene-name1").attr('autocomplete', 'off');
    },
    computed:  {

      conditions: function() {
        return conditions.data.sort(function(a,b) {
          if (a.DiseaseName < b.DiseaseName) {
            return -1;
          } else if (a.DiseaseName > b.DiseaseName) {
            return 1;
          } else {
            return 0;
          }
        });
      }
    },
    methods:{
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
        this.$emit('search-gtr', searchTerm);

        var diseases;
        model.promiseGetDiseases(searchTerm)
        .then(function(data){
          console.log("data got from promise : " , data)
          diseases = data.diseases;
          var promises = [];
          var filteredDiseases;

          data.diseases.forEach(function (disease){
            var p = model.promiseGetGenePanels(disease)
            .then(function (data){
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
        }

      },
      methodA(){
        alert("you are in method A")
      },
      methodB(filteredDiseases){
      },
    }
  }
</script>

<style scoped>
 .btnColor{
   color: white;
 }
 .btn{
   padding: 0px;
   height:34px;
 }
 .form-control{
   font-size: 15px;
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
