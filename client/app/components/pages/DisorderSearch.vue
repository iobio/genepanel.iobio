<template>
  <div>
    <v-snackbar
      :timeout="snackbarTimeout"
      :top="y === 'top'"
      :bottom="y === 'bottom'"
      :right="x === 'right'"
      :left="x === 'left'"
      :multi-line="mode === 'multi-line'"
      :vertical="mode === 'vertical'"
      v-model="snackbar"
    >
      {{ snackbarText }}
      <v-btn flat color="pink" @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>
      <div style="display:inline-block; padding-top:5px;">
        <label>Enter Condition</label>
        <input
          :disabled="checked"
          id="input"
          class="form-control"
          type="text"
          autocomplete="off"
          v-on:focus="ClearInputForNewSearch"
          v-on:keydown="EnterForSearch"
          placeholder="Search condition (E.g. Treacher Collins Syndrome)">
        <typeahead
          match-start
          v-model="search"
          target="#input"
          :data="DiseaseNames"
          :limit="parseInt(100)"
          :preselect="false"
          item-key="DiseaseName"/>

      </div>

      <v-btn
          style="margin-top:-0.35px; text-transform: none"
          class="btnColor"
          v-on:click.prevent="performSearch">
        Generate Gene List
      </v-btn>
      <br>
      <!-- <v-tooltip bottom>
        <v-btn
          slot="activator"
          v-if="multipleSearchTerms.length"
          :disabled="checked===true"
          flat icon color="primary"
          v-on:click="ClearInputForNewSearch"
        >
          <v-icon>add_circle</v-icon>
        </v-btn>
        <span>Enter New Condition</span>
      </v-tooltip> -->

      <div v-if="multipleSearchTerms.length">
        <br>
          Conditions Searched:
        <v-chip disabled  color="primary" text-color="white" close v-for="(searchItem, i) in multipleSearchTerms" :key="i" @input="remove(searchItem)">
          {{ i+1 }}. {{ searchItem }}
        </v-chip>
      </div>

    <p v-if="checked" ><v-progress-linear height="3" color="primary" :indeterminate="true"></v-progress-linear></p>
    <p>
      <v-alert  color="warning" dismissible v-model="alert">
        Sorry, the following search term returns no data! <a v-on:click="searchInPhenolyzer">  <strong> Try in Phenolyzer</strong></a>
      </v-alert>
    </p>
  </div>
</template>


<script>

import { Typeahead, Btn } from 'uiv';
import conditions from '../../../data/conditions.json';
import DiseaseNames from '../../../data/DiseaseNames.json'
import geneData from '../../../data/genes.json';
import HelpDialogs from '../../../data/HelpDialogs.json';
import HierarchyData from '../../../data/HierarchyData.json';
import HierarchyParentIds from '../../../data/HierarchyParentIds';

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
    props: {
      DisordersPropsBackArr: {
        type: Array
      }
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
        alert:false,
        multipleSearchTerms:[],
        filteredDiseasesItems:[],
        snackbar: false,
        snackbarText: "",
        y: 'top',
        x: null,
        mode: '',
        snackbarTimeout: 4000,
        HelpDialogsData: null,
        HierarchyRelations: null,
        HierarchyParentData: null,
        enterPressed: false,
      }
    },
    watch: {
      search: function() {
        if (this.search && this.search.DiseaseName) {
          // this.EnterForSearch();
        }
      },
      DisordersPropsBackArr: function() {
        this.filteredDiseasesItems = this.DisordersPropsBackArr;
      }
    },

    mounted: function() {
      console.log("HierarchyParentIds", HierarchyParentIds.length);
      this.HierarchyParentData = HierarchyParentIds;
      this.HierarchyRelations = HierarchyData;
      console.log("HierarchyData", HierarchyData.length)
      this.HelpDialogsData = HelpDialogs.data;
       $("#search-gene-name").attr('autocomplete', 'off');
       $("#search-gene-name1").attr('autocomplete', 'off');
       bus.$on("newAnalysis", ()=>{
         this.multipleSearchTerms = [];
         this.$emit('showDiseases', []);
         this.search = "";
         this.alert = false;
       });
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
      },
      DiseaseNames: function() {
        return DiseaseNames.data.sort(function(a,b) {
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
      EnterForSearch(){
        if(event.key === 'Enter') {
          this.enterPressed = true;
          setTimeout(()=>{
            console.log("this.search", this.search);
            console.log("this.search.DiseaseName", this.search.DiseaseName);
            this.performSearch();
          }, 10)
        }
      },
      searchInPhenolyzer(){
        bus.$emit("searchDisorderInPhenolyzer", this.search.DiseaseName)
      },
      remove(item){
        bus.$emit("removeSearchTerm");
        this.removeItem(item);
      },
      removeItem(item){

        this.multipleSearchTerms.splice(this.multipleSearchTerms.indexOf(item), 1)
        this.multipleSearchTerms = [...this.multipleSearchTerms];
        var temp = [];
        this.filteredDiseasesItems.map(x=>{
          if(x["searchTermArray"].includes(item) && x["searchTermArray"].length>1){
            temp.push(x);
          }
          else if(!x["searchTermArray"].includes(item)){
            temp.push(x);
          }
        })

        temp.map(x=>{
          if(x["searchTermArray"].includes(item)){
            x["searchTermArray"].splice(x["searchTermArray"].indexOf(item), 1)
            x["searchTermArray"] = [...x["searchTermArray"]];
          }
        })

        temp.map(x=>{
          x["searchTermIndex"] = [];
          x["searchTermArray"].map(y=>{
            x["searchTermIndex"].push(this.multipleSearchTerms.indexOf(y)+1)
          })
        })

        this.filteredDiseasesItems = temp;
        if(!this.checked){
          this.$emit('showDiseases', this.filteredDiseasesItems);
        }
        else if(this.checked){
          this.checked = false;
        }

      },
      getConcpetId: function(term){
        var cleanTerm = term.trim().toLowerCase();
        var cID =""
        this.DiseaseNames.map(x=>{
          if(cleanTerm===x.DiseaseName.toLowerCase()){
            cID =  x.ConceptID
          }
        });
        return cID;
      },
      ClearInputForNewSearch: function(){
        if(this.checked===false){
          this.search = "";
          document.getElementById("input").value="";
          document.getElementById("input").focus();
        }
      },
      performSearch: function(){
        // this.$emit('showDiseases', []);
        console.log("this search", this.search)
        var searchTerm ="";
        var conceptId = ""
        if(this.search.DiseaseName!==undefined){
          searchTerm = this.search.DiseaseName;
          conceptId = this.search.ConceptID;
        }
        else if(this.search.DiseaseName===undefined) {
          searchTerm = this.search.trim();
          conceptId = this.getConcpetId(this.search);
        }
        console.log("searchTerm", searchTerm)
        if(searchTerm.length>1 && !this.checked){
          this.checked = true;
          this.alert=false;

          if(!this.multipleSearchTerms.includes(searchTerm)){
            this.multipleSearchTerms.push(searchTerm); //Store search terms in an array

            // this.$emit('search-gtr', searchTerm);
            // console.log("this.multipleSearchTerms", this.multipleSearchTerms);
            this.$emit('multipleSearchData', this.multipleSearchTerms);
            this.$emit('search-gtr', this.multipleSearchTerms);
            var diseases;
            model.promiseGetDiseases(searchTerm, conceptId, this.HierarchyRelations, this.HierarchyParentData)
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
              if (filteredDiseases.length===0) {
                this.alert= true;
              }
              this.checked=false;
              if(this.multipleSearchTerms.includes(searchTerm)){ //this avoids adding an index when the term is deleted
                filteredDiseases.map(x=>{
                  x["searchTerm"]="ip"+searchTerm+"ip";
                  x["searchTermArray"] = [searchTerm];
                  x["searchTermIndex"] = [this.multipleSearchTerms.indexOf(searchTerm)+1];
                  this.filteredDiseasesItems.push(x);
                });
              }

              if(this.multipleSearchTerms.includes(searchTerm)){
                bus.$emit("newSearch")
                this.$emit('showDiseases', this.filteredDiseasesItems)
              }

            }

          }
          else if(this.multipleSearchTerms.includes(searchTerm)){
            this.checked = false;
            this.snackbarText = "This disorder is already searched before"
            this.snackbar = true;
          }
        }


      },
    }
  }
</script>


<style lang="sass" scoped>

  @import ../assets/sass/variables

  .btnColor
    color: white
    background-color: $search-button-color !important

  .btn
    padding: 0px
    height: 39px

  .form-control
    font-size: 15px

  #input
    width: 600px
    height: 40px
    margin-top: 4px
    background-color: #F4F4F4
    border-color: #F4F4F4


  @media screen and (max-width: 1620px)
    #input
      width: 420px
      height: 40px
      margin-top: 4px

  @media screen and (max-width: 1050px)
    #input
      width: 450px
      height: 40px
      margin-top: 4px

  @media screen and (max-width: 950px)
    #input
      width: 290px
      height: 40px
      margin-top: 4px

  @media screen and (max-width: 700px)
    #input
      width: 300px
      height: 40px
      margin-top: 4px
      box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)

    .btnColor
      margin-top: 2px

  .input-box
    background: #00ACC1
    box-shadow: 0 1px 4px 0 rgba(0,0,0,0.50)
    height: 60px
    padding-left: 30px
    padding-top: 15px
</style>
