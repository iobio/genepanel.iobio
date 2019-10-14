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
      <div id="conditionsInput" style="display:inline-block; padding-top:5px;">
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
          v-on:keydown="EnterForSearch"
          item-key="DiseaseName"/>

      </div>

      <v-btn
          style="margin-top:-0.35px; text-transform: none"
          class="btnColor"
          v-on:click.prevent="checkBeforePerformSearch">
        Search
      </v-btn>
      <br>
      <v-menu  style="box-shadow: 0 6px 12px rgba(0,0,0,.175); border-radius:4px; border:1px solid rgba(0,0,0,.15) " v-model="singleItemTypeAhead" bottom offset-y>
      <div style="margin-top:-18px" slot="activator"></div>
      <v-list v-if="singleItemTypeAhead">
       <v-list-tile
         @click=""
         style="background: #4267b2; height:26px; min-width:140px"
       >
         <li class="active" style="font-size:14px; margin-top:-22px; color:white"><span>Search on: <strong>{{search}}</strong></span></li><hr>
       </v-list-tile>
     </v-list>
     </v-menu>

      <div v-if="multipleSearchTerms.length">
        <br>
          Conditions Searched:
          <span id="conditionChips" v-for="(searchItem, i) in multipleSearchTerms">
              <v-chip slot="activator" color="primary" text-color="white" close :key="i" @input="remove(searchItem)">
                {{ i+1 }}. {{ searchItem }}
                <v-tooltip v-model="showToolTipDefinition" bottom :z-index="[tooltipDefinition=== null ? '-1' : '4']">
                  <v-btn class="conditionChip" icon slot="activator" @mouseover="showTooltip(searchItem)" @mouseout="hideToolTip(searchItem)">
                        <v-icon size="20" style="color:#aebcdb!important">info</v-icon>
                       </v-btn>
                       <span v-show="tooltipDefinition!== null">
                         <div style="width:600px" v-model="tooltipDefinition">
                           {{ tooltipDefinition }}
                         </div>
                       </span>
                  </v-tooltip>
                <!-- <v-tooltip bottom :z-index="[tooltipDefinition=== null ? '-1' : '4']">
                  <span v-show="tooltipDefinition!== null">
                    <div style="width:600px" v-model="tooltipDefinition">
                      {{ tooltipDefinition }}
                    </div>
                  </span>
                </v-tooltip> -->
              </v-chip>

          </span>
      </div>

    <p v-if="checked" ><v-progress-linear height="3" color="primary" :indeterminate="true"></v-progress-linear></p>
    <p>
      <v-alert  color="warning" dismissible v-model="alert">
        Sorry, the following search term returns no gene panels! <a v-on:click="searchInPhenolyzer">  <strong> Try in Phenolyzer</strong></a>
      </v-alert>
      <v-alert v-if="alertWarningHints && warningHints.length>0"  color="info" outline dismissible v-model="alertWarningHints">
        Sorry, This search term is too general. Please try a more specific term. <br><br> Example: <li style="cursor: pointer" v-if="warningHints.length>0" v-for="(hint, i) in warningHints" :key="i" v-on:click="setInputValueFromHint(hint)" > {{hint.Title}} </li>
      </v-alert>
      <v-alert  color="warning" dismissible v-model="alertWarning" outline>
        <a v-on:click="searchInPhenolyzer">  <strong> Try in Phenolyzer</strong></a>
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
        canClearClinGenes: false,
        warningHints: [],
        alertWarningHints: false,
        definitionObj: {},
        tooltipDefinition: null,
        showToolTipDefinition: false,
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
          if($('.dropdown-menu').parents("#conditionsInput").length===1){
            $("#conditionsInput").find(".dropdown-menu").attr('id', 'dropdown-menu-gtr');
            $("#dropdown-menu-gtr").prepend(`<li id='addedterm' class="active"><a href="#"><span>Search on: <strong>${this.search}</strong></span></a><hr style="margin-top:5px; margin-bottom:5px"></li>`);
            if($('ul li').length===1 && this.search.DiseaseName===undefined && !this.launchedFromClin){
              this.singleItemTypeAhead = true;
            }
            else {
              this.singleItemTypeAhead = false;
            }

          }
        }
      },
      DisordersPropsBackArr: function() {
        this.filteredDiseasesItems = this.DisordersPropsBackArr;
      }
    },
    updated: function(){
    },
    mounted: function() {
      this.launchedFromClin = this.launchedFromClinProps;
      this.HierarchyParentData = HierarchyParentIds;
      this.HierarchyRelations = HierarchyData;

      this.HelpDialogsData = HelpDialogs.data;
       $("#search-gene-name").attr('autocomplete', 'off');
       $("#search-gene-name1").attr('autocomplete', 'off');
       bus.$on("newAnalysis", ()=>{
         this.multipleSearchTerms = [];
         this.$emit('showDiseases', []);
         this.search = "";
         this.alert = false;
         this.alertWarningHints = false;
         this.checked = false;
         bus.$emit("hideContentLoader");
       });
       bus.$on("singleTermSearchGTR", (x)=>{
         this.search = x;
         this.checked = false;
         this.checkBeforePerformSearch();
       });
      bus.$on("removeGtrTerm", (item)=>{
        this.remove(item);
      })
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
            this.checkBeforePerformSearch();
          }, 10)
        }
        else if(event.key == 'ArrowDown') {
          $("#addedterm").removeClass("active");
          this.enterCount = 0;

        }
        else if(event.key == 'ArrowUp') {
          $("#addedterm").removeClass("active");
          $($("ul.dropdown-menu li")[0]).addClass("");
          $($("ul.dropdown-menu li")[0]).removeClass("active");
          if($($("ul.dropdown-menu li")[1]).hasClass("active")){
            this.enterCount++
            if(this.enterCount>0){
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
      setInputValueFromHint: function(hint){
        document.getElementById("input").value= hint.Title;
        this.search = hint.Title;
      },
      searchInPhenolyzer(){
        var searchTerm = this.search.DiseaseName? this.search.DiseaseName : this.search
        bus.$emit("searchDisorderInPhenolyzer", searchTerm)
      },
      remove(item){
        bus.$emit("removeSearchTerm");
        this.removeItem(item);
      },
      showTooltip(item){
        if(this.definitionObj.hasOwnProperty(item)){
          this.tooltipDefinition = this.definitionObj[item];
          this.showToolTipDefinition = true;
        }
        else {
          this.tooltipDefinition = null;
        }
      },
      hideToolTip(item){
        this.tooltipDefinition = null;
        this.showToolTipDefinition = false;
      },
      removeItem(item){
        bus.$emit("removeClinGenesArray");
        bus.$emit("clearSearchInput");
        this.multipleSearchTerms.splice(this.multipleSearchTerms.indexOf(item), 1)
        this.multipleSearchTerms = [...this.multipleSearchTerms];
        this.$emit('search-gtr', this.multipleSearchTerms);
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
          bus.$emit("hideContentLoader");
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
          this.checkBeforePerformSearch();
        })
        // this.canClearClinGenes = true;

      },
      checkBeforePerformSearch(){
        if(this.multipleSearchTerms.length<5){
          this.performSearch();
        }
        else {
          this.snackbarText = "You can search for maximum 4 conditions";
          this.snackbar = true;

        }
      },
      performSearch: function(){
        // this.$emit('showDiseases', []);
        this.singleItemTypeAhead = false;
        $("#addedterm").remove();
        var searchTerm ="";
        var conceptId = "";
        if(this.search.DiseaseName!==undefined && this.search.ConceptID===undefined){
          searchTerm = this.search.DiseaseName;
          conceptId = this.getConcpetId(searchTerm);
        }
        else if(this.search.DiseaseName!==undefined){
          searchTerm = this.search.DiseaseName;
          conceptId = this.search.ConceptID;
        }
        else if(this.search.DiseaseName===undefined) {
          searchTerm = this.search.trim();
          conceptId = this.getConcpetId(this.search);
        }
        if(searchTerm.length>1 && !this.checked){
          this.checked = true;
          if(this.multipleSearchTerms.length<1){
            bus.$emit("showContentLoader");
          }
          this.alert=false;
          this.alertWarningHints = false;

          if(!this.multipleSearchTerms.includes(searchTerm)){
            this.multipleSearchTerms.push(searchTerm); //Store search terms in an array
            this.$ga.event('SearchTerm', 'GTR', searchTerm); //Emit event for Google analytics
            this.$emit("currentSearchTerm", searchTerm)
            this.$emit('multipleSearchData', this.multipleSearchTerms);
            this.$emit('search-gtr', this.multipleSearchTerms);
            bus.$emit("clearSearchInput");
            var diseases;
            var dataMain;
            model.promiseGetDiseases(searchTerm, conceptId, this.HierarchyRelations, this.HierarchyParentData)
            .then(function(data){
            // fetch(`http://localhost:4046/conditions/?term=${searchTerm}`).then(res => res.json())
            // .then(function(dataItem){
            //   var data = dataItem.Item
            //   console.log(dataItem)
              createDefinitionsObj(data)
              dataMain = data;
              diseases = data.diseases;
              var promises = [];
              var filteredDiseases;
              var maxDiseasesLimit = false;
              // if(diseases.length>7){
              if(diseases.length>70){
                maxDiseasesLimit = true;
                comeOutOfPromise1(diseases);
              }
              else {
                if(diseases.length>0){
                  data.diseases.forEach((disease, i) => {
                    ((ind) =>{
                      setTimeout(() =>{
                        var p = model.promiseGetGenePanelsUsingSearchTerm(disease)
                          .then((data)=>{
                              var filteredGenePanels = model.processGenePanelData(data.genePanels);
                              data.disease.genePanels = filteredGenePanels;
                          },
                          function(error) {
                            console.log("error", error)
                          })
                          promises.push(p);
                          if(ind===diseases.length-1){
                            checkPromisesLength(promises);
                          }
                      }, 1000 + (1000 * ind));
                    })(i);

                  })
                }
                else {
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
                    var p = model.promiseGetGenePanelsUsingSearchTerm(disease)
                    .then(function (data){
                      if(data.genePanels.length>1){
                        var filteredGenePanels = model.processGenePanelData(data.genePanels);
                        data.disease.genePanels = filteredGenePanels;
                      }
                    },
                    function(error) {
                      console.log("error", error)
                    })
                     promises.push(p);
                      // checkPromisesLength(promises);
                  })

                }
              }

              var checkPromisesLength = (promises)=>{
                Promise.all(promises).then(function(){
                  if(diseases.length===1 && diseases[0].genePanels===undefined){
                    comeOutOfPromise();
                  }
                  else {
                    filteredDiseases = model.processDiseaseData(diseases);
                    if(filteredDiseases.length<1 && diseases.length<8){
                      filteredDiseases = tryByUsingConceptId();
                    }
                    else if(!maxDiseasesLimit){
                      addFilteredDiseases(filteredDiseases);
                    }
                  }
                })

              }
              // Promise.all(promises).then(function(){
              //   console.log("four")
              //
              //   if(diseases.length===1 && diseases[0].genePanels===undefined){
              //     comeOutOfPromise();
              //   }
              //   else {
              //     console.log("five")
              //     filteredDiseases = model.processDiseaseData(diseases);
              //     if(filteredDiseases.length<1 && diseases.length<8){
              //       filteredDiseases = tryByUsingConceptId();
              //     }
              //     else if(!maxDiseasesLimit){
              //       addFilteredDiseases(filteredDiseases);
              //     }
              //   }
              // })
            })

            var callAfunction = (promises)=>{
              var filteredDiseases;
              Promise.all(promises).then(function(){
                if(diseases.length===1 && diseases[0].genePanels===undefined){
                  comeOutOfPromise();
                }
                else {
                  filteredDiseases = model.processDiseaseData(diseases);
                  if(filteredDiseases.length<1){
                    filteredDiseases = tryByUsingConceptId();
                  }
                  else {
                    addFilteredDiseases(filteredDiseases);
                  }
                }
              })
            }


            var comeOutOfPromise =()=>{
              this.alert = true;
              this.checked=false;
              bus.$emit("hideContentLoader");
            }

            var comeOutOfPromise1 =(diseases)=>{
              bus.$emit("handleGeneralTermsInSingleEntry", diseases);
              this.warningHints = diseases.slice(3, 7);
              this.alertWarningHints = true
              this.checked=false;
              bus.$emit("hideContentLoader");
              this.remove(this.search)
              this.alert = false;
            }

            var createDefinitionsObj = (data)=>{
              searchTerm = data.searchTerm;
              if(this.definitionObj[searchTerm]===undefined && data.diseases.length>0){
                if(data.diseases[0].Title === searchTerm && data.diseases[0].Definition.length>10){
                  this.definitionObj[searchTerm] = data.diseases[0].Definition;
                }
              }
            }



            var tryByUsingConceptId = () =>{
              var promises1 = [];
              dataMain.diseases.forEach(function (disease){
                var p = model.promiseGetGenePanels(disease)
                .then(function (dataMain){
                    var filteredGenePanels = model.processGenePanelData(dataMain.genePanels);
                    dataMain.disease.genePanels = filteredGenePanels;
                },
                function(error) {
                  console.log("error", error)
                })
                 promises1.push(p);
              })

              Promise.all(promises1).then(function(){
                 var a  = model.processDiseaseData(diseases);
                 addFilteredDiseases(a);
              })
            }

            var x = [];

            var addFilteredDiseases = (filteredDiseases) =>{
              if (filteredDiseases.length===0) {
                this.alert= true;
                bus.$emit("completeFetchRequest", "noGenePanels");
              }
              this.checked=false;
              bus.$emit("hideContentLoader");
              bus.$emit("completeFetchRequest", "GTR");
              if(this.multipleSearchTerms.includes(searchTerm)){ //this avoids adding an index when the term is deleted
                filteredDiseases.map(x=>{
                  x["searchTerm"]="ip"+searchTerm+"ip";
                  x["searchTermArray"] = [searchTerm];
                  x["searchTermIndex"] = [this.multipleSearchTerms.indexOf(searchTerm)+1];
                  this.filteredDiseasesItems.push(x);
                });
                this.$emit("searchTermDiseases", filteredDiseases)
              }

              if(this.multipleSearchTerms.includes(searchTerm)){
                bus.$emit("newSearch")
                this.$emit('showDiseases', this.filteredDiseasesItems);
                this.filteredDiseasesItems = [];
                filteredDiseases = null;
              }

            }

          }
          else if(this.multipleSearchTerms.includes(searchTerm)){
            this.checked = false;
            bus.$emit("hideContentLoader");
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

  .conditionChip
    cursor: help !important
    margin: 0
    margin-right: -6px

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
    background-color: $search-box-color
    border-color: $search-box-color


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

</style>
