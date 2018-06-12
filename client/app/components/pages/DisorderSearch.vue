<template>
  <div style="">
    <!-- <span style="padding-right:4px">Disorder</span> -->

      <div style="display:inline-block; padding-top:5px;">
        <label>Search Disorder</label>
        <input
          id="input"
          class="form-control"
          type="text"
          autocomplete="off"
          placeholder="Treacher Collins Syndrome">
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
          class="btnColor"
          v-on:click.prevent="performSearch">
        Go
      </v-btn>
      <div v-if="multipleSearchTerms.length">
        <v-chip disabled outline color="red darken-1" close v-for="(searchItem, i) in multipleSearchTerms" :key="i" @input="remove(searchItem)">
          {{ i+1 }}. {{ searchItem }}
        </v-chip>
      </div>
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
      }
    },
    watch: {
      search: function() {
        if (this.search && this.search.DiseaseName) {
          this.performSearch();
        }
      },
      DisordersPropsBackArr: function() {
        // console.log("this.DisordersPropsBackArr", this.DisordersPropsBackArr)
        this.filteredDiseasesItems = this.DisordersPropsBackArr;
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
      remove(item){
        bus.$emit("removeSearchTerm")
        // console.log("this.filteredDiseasesItems", this.filteredDiseasesItems)
        this.multipleSearchTerms.splice(this.multipleSearchTerms.indexOf(item), 1)
        this.multipleSearchTerms = [...this.multipleSearchTerms];
        // item = "ip"+item+"ip";
        var temp = [];
        this.filteredDiseasesItems.map(x=>{
          console.log(x["searchTermArray"]);
          // if(x.searchTerm!== item){
          //   temp.push(x);
          // }
          console.log("item", item)
          console.log(x["searchTermArray"].includes(item))
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

        // temp.map(x=>{
        //   // console.log("temp search", x.searchTerm);
        //   // console.log(item)
        //   x.searchTerm = x.searchTerm.replace(item, "");
        //   if(x.searchTerm[0]===" "){
        //     x.searchTerm = x.searchTerm.slice(1);
        //   }
        // })
        console.log("temp" , temp)
        this.filteredDiseasesItems = temp;
        this.$emit('showDiseases', this.filteredDiseasesItems)

      },
      performSearch: function(){
        // this.$emit('showDiseases', []);
        this.checked = true;
        this.alert=false;

        var searchTerm =""
        if(this.search.DiseaseName!==undefined){
          searchTerm = this.search.DiseaseName;
        }
        else if(this.search.DiseaseName===undefined) {
          searchTerm = this.search;
        }

        if(!this.multipleSearchTerms.includes(searchTerm)){
          this.multipleSearchTerms.push(searchTerm); //Store search terms in an array

          this.$emit('search-gtr', searchTerm);
          // console.log("this.multipleSearchTerms", this.multipleSearchTerms);
          this.$emit('multipleSearchData', this.multipleSearchTerms);
          var diseases;
          model.promiseGetDiseases(searchTerm)
          .then(function(data){
            // console.log("data got from promise : " , data)
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
               // console.log("filteredDiseases",filteredDiseases)

              addFilteredDiseases(filteredDiseases);
            })

          })
          var x = [];

          var addFilteredDiseases = (filteredDiseases) =>{
            if (filteredDiseases.length===0) {
              this.alert= true;
            }
            this.checked=false;
            filteredDiseases.map(x=>{
              // console.log(this.multipleSearchTerms.findIndex())
              x["searchTerm"]="ip"+searchTerm+"ip";
              // x["searchTermIndex"] = this.multipleSearchTerms.indexOf(searchTerm)+1;
              x["searchTermArray"] = [searchTerm];
              x["searchTermIndex"] = [this.multipleSearchTerms.indexOf(searchTerm)+1];
              // x["searchTerm"]=this.multipleSearchTerms.indexOf(searchTerm)+1;
              this.filteredDiseasesItems.push(x);
            });
            console.log("this.filteredDiseasesItems",this.filteredDiseasesItems)
            this.$emit('showDiseases', this.filteredDiseasesItems)
          }

        }
        else if(this.multipleSearchTerms.includes(searchTerm)){
          this.checked = false;
          alert("This disorder is already searched before")
        }
      },
    }
  }
</script>

<style scoped>
 .btnColor{
   color: white;
   background-color: #D04F4C !important;
   border-radius: 5px;
 }
 .btn{
   padding: 0px;
   height:39px;
 }
 .form-control{
   font-size: 15px;
 }
#input{
  width: 600px;
  height:40px;
  margin-top: 4px;
  background-color: #F4F4F4;
  border-color: #F4F4F4;
}

/* Media Queries */

@media screen and (max-width: 1620px){
  #input{
    width: 370px;
    height:40px;
    margin-top: 4px;
  }
}

@media screen and (max-width: 1050px){
  #input{
    width: 400px;
    height:40px;
    margin-top: 4px;
  }
}

@media screen and (max-width: 950px){
  #input{
    width: 300px;
    height:40px;
    margin-top: 4px;
  }
}

@media screen and (max-width: 700px){
  #input{
    width: 300px;
    height:40px;
    margin-top: 4px;
    box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)
  }
  .btnColor{
    margin-top: 2px
  }
}

.input-box{
  background: #00ACC1;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.50);
  height:60px;
  padding-left: 30px;
  padding-top: 15px;
}
</style>
