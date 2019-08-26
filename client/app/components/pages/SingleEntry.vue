<template>
  <div>
    <div style="background-color:#f9fbff">
      <v-container fluid grid-list-md>
        <v-layout row wrap style="margin-top:-20px;">
          <v-flex d-flex xs12>
            <v-card>
              <v-card-text>
                <h3>Single Term Entry</h3>
                <v-layout row wrap>
                  <v-flex xs12 sm12 md12 lg8 xl8>
                    <div id="SingleEntryInput" style="display:inline-block; padding-top:5px;">
                      <label>Enter Clinical Conditions or Phenotypes</label>
                      <input
                        id="single-entry-input"
                        class="form-control"
                        type="text"
                        autocomplete="off"
                        placeholder="Search condition (E.g. Treacher Collins Syndrome)">
                      <typeahead
                        match-start
                        v-model="search"
                        target="#single-entry-input"
                        :data="DiseaseNames"
                        :limit="parseInt(100)"
                        :preselect="false"
                        item-key="DiseaseName"/>
                    </div>
                    <v-btn
                        style="margin-top:-0.35px; text-transform: none"
                        class="btnColor"
                        v-on:click.prevent="checkBeforeAddTerm">
                      Add
                    </v-btn>

                    <br>

                    <div v-if="multipleSearchTerms.length">
                      <br>
                        Conditions Searched:
                        <span id="conditionChips" v-for="(searchItem, i) in multipleSearchTerms">
                          <v-chip slot="activator" color="primary" text-color="white" close :key="i">
                            {{ i+1 }}. {{ searchItem }}
                          </v-chip>
                        </span>
                    </div>

                    <br>

                    <v-btn color="primary" @click="performSearchEvent">Search</v-btn>

                    <br>

                    <div v-if="multipleSearchTerms.length">
                      <div v-for="(item, i) in searchTermsObj">
                        {{ item.DiseaseName }}
                        <span v-if="item.gtrSearchStatus==='Searching'">
                          <v-progress-circular
                            :width="3"
                            :size="30"
                            indeterminate
                            color="primary"
                          ></v-progress-circular>
                        </span>
                        <span v-else-if="item.gtrSearchStatus==='Completed'"><v-icon large color="green">done_outline</v-icon></span>
                        <span v-else> <v-icon color="gray">queue</v-icon>  </span>

                        <span v-if="item.phenolyzerSearchStatus==='Searching'">
                          <v-progress-circular
                            :width="3"
                            :size="30"
                            indeterminate
                            color="primary"
                          ></v-progress-circular>
                        </span>
                        <span v-else-if="item.phenolyzerSearchStatus==='Completed'"><v-icon large color="green">done_outline</v-icon></span>
                        <span v-else> <v-icon color="gray">queue</v-icon> </span>

                      </div>
                    </div>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </div>
</template>

<script>
import { bus } from '../../routes';
import { Typeahead, Btn } from 'uiv';
import d3 from 'd3';
import Model from '../../models/Model';
import DiseaseNames from '../../../data/DiseaseNames.json'

var model = new Model();

  export default {
    components: {
    },
    props: {

    },
    data(){
      return {
        search: '',
        multipleSearchTerms: [],
        searchTermsObj: [],
        idx: 0,
        gtrFetchCompleted: false,
        phenolyzerFetchCompleted: false
      }
    },
    mounted(){
      bus.$on("completeFetchRequest", (component)=>{
        if(component === "GTR"){
          console.log(" GTR completed!")
          this.searchTermsObj[this.idx].gtrSearchStatus = "Completed";
          this.gtrFetchCompleted = true;
        }
        else if(component = "Phenolyzer"){
          console.log("Phenolyzer completed!");
          this.searchTermsObj[this.idx].phenolyzerSearchStatus = "Completed"
          this.phenolyzerFetchCompleted = true;
        }
        console.log("searchTermsObj", this.searchTermsObj)
        if(this.gtrFetchCompleted && this.phenolyzerFetchCompleted){
          this.searchTermsObj[this.idx].status = "Completed";
          this.idx++;
          if(this.idx < this.multipleSearchTerms.length){
            this.performSearchEvent();
          }
        }
      })
    },
    updated(){

    },
    watch: {
      searchTermsObj(){
        console.log("searchTermsObj changing")
      }
    },
    methods:{
      checkBeforeAddTerm(){
        this.addTerm();
      },
      performSearchEvent(){
        this.gtrFetchCompleted = false;
        this.phenolyzerFetchCompleted = false;
        console.log("searching term: ", this.searchTermsObj[this.idx].DiseaseName);
        // this.searchTermsObj[this.idx].status = "Searching";
        // this.searchTermsObj[this.idx].gtrSearchStatus = "Searching";
        this.$set(this.searchTermsObj[this.idx], 'status', "Searching");
        this.$set(this.searchTermsObj[this.idx], 'gtrSearchStatus', "Searching");
        this.$set(this.searchTermsObj[this.idx], 'phenolyzerSearchStatus', "Searching");
        // this.searchTermsObj[this.idx].phenolyzerSearchStatus = "Searching";
        bus.$emit("singleTermSearchGTR", this.searchTermsObj[this.idx]);
        bus.$emit("singleTermSearchPhenolyzer", this.multipleSearchTerms[this.idx]);
      },
      addTerm(){
        var searchTerm ="";
        var conceptId = ""
        searchTerm = this.search.DiseaseName;
        conceptId = this.search.ConceptID;
        this.$set(this.search, 'status', "Not started");
        this.$set(this.search, 'gtrSearchStatus', "Not started");
        this.$set(this.search, 'phenolyzerSearchStatus', "Not started");
        // this.search.status = "Not started";
        // this.search.gtrSearchStatus = "Not started";
        // this.search.phenolyzerSearchStatus = "Not started";
        if(!this.multipleSearchTerms.includes(searchTerm) && searchTerm!==undefined){
          if(searchTerm.length>1){
            this.multipleSearchTerms.push(searchTerm);
            this.searchTermsObj.push(this.search);
          }
        }
      },
    },
    computed: {
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
      },
    }
  }

</script>

<style lang="sass">
@import url('https://fonts.googleapis.com/css?family=Open+Sans')
@import ../assets/sass/variables
.form-control
  font-size: 15px

#single-entry-input
  width: 600px
  height: 40px
  margin-top: 4px
  background-color: $search-box-color
  border-color: $search-box-color


@media screen and (max-width: 1620px)
  #single-entry-input
    width: 420px
    height: 40px
    margin-top: 4px

@media screen and (max-width: 1050px)
  #single-entry-input
    width: 450px
    height: 40px
    margin-top: 4px

@media screen and (max-width: 950px)
  #single-entry-input
    width: 290px
    height: 40px
    margin-top: 4px

@media screen and (max-width: 700px)
  #single-entry-input
    width: 300px
    height: 40px
    margin-top: 4px
    box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)

.v-progress-circular
  margin: 1rem
</style>
