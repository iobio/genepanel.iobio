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
          v-on:click="typeaheadClicked"
          v-on:keydown="EnterForSearch"
          item-key="DiseaseName"/>

      </div>

      <v-btn
          style="margin-top:-0.35px; text-transform: none"
          class="btnColor"
          v-on:click.prevent="performSearch">
        Generate Gene List
      </v-btn>
      <br>
      <v-menu  style="box-shadow: 0 6px 12px rgba(0,0,0,.175); border-radius:4px; border:1px solid rgba(0,0,0,.15) " v-model="singleItemTypeAhead" bottom offset-y>
      <div style="margin-top:-20px" slot="activator"></div>
      <v-list v-if="singleItemTypeAhead">
       <v-list-tile
         @click=""
         style="background: #4267b2; height:26px; min-width:300px"
       >
         <!-- <v-list-tile-title>sdjsagk</v-list-tile-title> -->
         <li class="active" style="font-size:14px; margin-top:-22px; color:white"><span>Search on: <strong>{{search}}</strong></span></li><hr>
       </v-list-tile>
     </v-list>
     </v-menu>

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
        Sorry, the following search term returns no gene panels! <a v-on:click="searchInPhenolyzer">  <strong> Try in Phenolyzer</strong></a>
      </v-alert>
      <v-alert  color="warning" dismissible v-model="alertWarning">
        Sorry, we are unable to fetch data for this term! <a v-on:click="searchInPhenolyzer">  <strong> Try in Phenolyzer</strong></a>
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
      },
      launchedFromClinProps: {
        type: Boolean
      },
      clinSearchedGtr: {
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
        alertWarning: false,
        singleItemTypeAhead: false,
        enterCount: 0,
        launchedFromClin: false,
      }
    },
    watch: {
      launchedFromClinProps: function(){
        this.launchedFromClin = this.launchedFromClinProps;
      },
      clinSearchedGtr: function(){
        this.initiateSearchForClinSavedTerms();
      },
      search: function() {
        this.singleItemTypeAhead = false;
        if(this.search.length>0){
          $("#addedterm").remove();
          $(".dropdown-menu").prepend(`<li id='addedterm' class="active"><a href="#"><span>Search on: <strong>${this.search}</strong></span></a><hr style="margin-top:5px; margin-bottom:5px"></li>`);
          if($('ul li').length===1 && this.search.DiseaseName===undefined && !this.launchedFromClin){
            // $(".dropdown").addClass("open")
            this.singleItemTypeAhead = true;
          }
          else {
            this.singleItemTypeAhead = false;
          }
        }
        // if (this.search && this.search.DiseaseName) {
        //   // this.EnterForSearch();
        // }
      },
      DisordersPropsBackArr: function() {
        this.filteredDiseasesItems = this.DisordersPropsBackArr;
      }
    },
    updated: function(){
    },
    mounted: function() {
      this.launchedFromClin = this.launchedFromClinProps;
      // console.log("clinSearchedGtr", this.clinSearchedGtr)
      // console.log("this.launchedFromClinProps ", this.launchedFromClinProps)
      // console.log("HierarchyParentIds", HierarchyParentIds.length);
      this.HierarchyParentData = HierarchyParentIds;
      this.HierarchyRelations = HierarchyData;
      // console.log("HierarchyData", HierarchyData.length)
      this.HelpDialogsData = HelpDialogs.data;
       $("#search-gene-name").attr('autocomplete', 'off');
       $("#search-gene-name1").attr('autocomplete', 'off');
       bus.$on("newAnalysis", ()=>{
         this.multipleSearchTerms = [];
         this.$emit('showDiseases', []);
         this.search = "";
         this.alert = false;
         this.checked = false;
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
      typeaheadClicked(){
      },
      EnterForSearch(){
        if(event.key === 'Enter') {
          // console.log("enter key")
          this.enterPressed = true;
          setTimeout(()=>{
            // console.log("this.search", this.search);
            // console.log("this.search.DiseaseName", this.search.DiseaseName);
            this.performSearch();
          }, 10)
        }
        else if(event.key == 'ArrowDown') {
          // console.log("down key");
          $("#addedterm").removeClass("active");
          // console.log($(this).is(':first-child'));
          // console.log($("ul.dropdown-menu li").length); //checks how many children are there
          // console.log($("ul.dropdown-menu li")[1]);
          this.enterCount = 0;

        }
        else if(event.key == 'ArrowUp') {
          $("#addedterm").removeClass("active");
          if($($("ul.dropdown-menu li")[1]).hasClass("active")){
            // console.log("here")
            this.enterCount++
            if(this.enterCount>1){
              $("#addedterm").addClass("active");
              $($("ul.dropdown-menu li")[1]).removeClass("active");
            }
          }
          else if($($("ul.dropdown-menu li")[0]).hasClass("active")){
            $($("ul.dropdown-menu li")[1]).removeClass("active");
            $("#addedterm").addClass("active");
          }
          else if(!$($("ul.dropdown-menu li")[1]).hasClass("active") && !$($("ul.dropdown-menu li")[0]).hasClass("active") && this.enterCount!==0){
            $("#addedterm").addClass("active");
          }
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
      initiateSearchForClinSavedTerms: function(){
        this.clinSearchedGtr.map(x=>{
          this.search = x;
          this.performSearch();
        })
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
            var dataMain;
            model.promiseGetDiseases(searchTerm, conceptId, this.HierarchyRelations, this.HierarchyParentData)
            .then(function(data){
              // console.log("data got from promise : " , data)
              dataMain = data;
              diseases = data.diseases;
              var promises = [];
              var filteredDiseases;
              // console.log(diseases.length)
              if(diseases.length>100){
                diseases = diseases.slice(0, 30)
              }
              if(diseases.length>0){
                // data.diseases.forEach((disease)=>{
                diseases.forEach((disease)=>{
                    var p = model.promiseGetGenePanelsUsingSearchTerm(disease)
                  .then((data)=>{
                      var filteredGenePanels = model.processGenePanelData(data.genePanels);
                      // console.log("data", data)
                      data.disease.genePanels = filteredGenePanels;
                  },
                  function(error) {
                    console.log("error", error)
                  })
                   promises.push(p);
                })
              }
              else {
                // console.log("data.diseases length is less than 1, so currently I am here!");
                data.diseases = [
                  {
                    ConceptId:"",
                    Title:searchTerm,
                    Definition: "",
                    Merged: "",
                    ModificationDate: "",
                    SemanticId: "",
                    SemanticType: "Disease or Syndrome",
                    Suppressed: "",
                    ConceptMeta: {
                      AssociatedGenes: "",
                      ClinicalFeatures: "",
                      ModesOfInheritance: "",
                      OMIM: "",
                      RelatedDisorders: ""
                    }
                  }]
                diseases = data.diseases;

                data.diseases.forEach(function (disease){
                  console.log("disease data", disease)
                  // var p = model.promiseGetGenePanels(disease)
                  var p = model.promiseGetGenePanelsUsingSearchTerm(disease)
                  .then(function (data){
                    if(data.genePanels.length>1){
                      var filteredGenePanels = model.processGenePanelData(data.genePanels);
                      data.disease.genePanels = filteredGenePanels;
                      // console.log("filteredGenePanels", filteredGenePanels);
                      // console.log("data", data)

                      // console.log("data.disease.genePanels", data.disease.genePanels)
                    }
                  },
                  function(error) {
                    console.log("error", error)
                  })
                   promises.push(p);
                })
              }

              Promise.all(promises).then(function(){
                console.log("diseases", diseases)
                if(diseases.length===1 && diseases[0].genePanels===undefined){
                  console.log("Stoped it");
                  comeOutOfPromise();
                  // this.alert = true;
                  // this.checked=true;
                }
                else {
                  filteredDiseases = model.processDiseaseData(diseases);
                  console.log("filteredDiseases",filteredDiseases);

                  if(filteredDiseases.length<1){
                    filteredDiseases = tryByUsingConceptId();
                  }
                  else {
                    addFilteredDiseases(filteredDiseases);
                  }
                }
              })
            })


            var comeOutOfPromise =()=>{
              this.alert = true;
              this.checked=false;
            }


            var tryByUsingConceptId = () =>{
              var promises1 = [];
              dataMain.diseases.forEach(function (disease){
                console.log("disease data", disease)
                var p = model.promiseGetGenePanels(disease)
                  // var p = model.promiseGetGenePanelsUsingSearchTerm(disease)
                .then(function (dataMain){
                    var filteredGenePanels = model.processGenePanelData(dataMain.genePanels);
                    // console.log("filteredGenePanels", filteredGenePanels);
                    console.log("data", dataMain)
                    dataMain.disease.genePanels = filteredGenePanels;
                },
                function(error) {
                  console.log("error", error)
                })
                 promises1.push(p);
              })

              Promise.all(promises1).then(function(){
                 var a  = model.processDiseaseData(diseases);
                 console.log("filteredDiseases",a);
                 addFilteredDiseases(a);
              })
            }

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
