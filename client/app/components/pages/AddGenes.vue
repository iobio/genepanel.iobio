<template>
  <div>
    <div style="background-color:#f9fbff">
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

      <v-container fluid grid-list-md>
        <v-layout row wrap style="margin-top:-20px;">
          <v-flex d-flex xs12>
            <v-card>
              <v-card-text style="margin-bottom:-5px">
                <h3>Add Genes</h3>
                <v-layout row wrap>
                  <v-flex xs12 sm12 md12 lg8>
                    <div id="add-genes-input" style="display:inline-block;padding-top:5px;">
                      <label>Search Genes</label>
                      <input
                        id="input"
                        class="form-control"
                        type="text"
                        autocomplete="off"
                        v-on:focus="ClearInputForNewSearch"
                        placeholder="Search gene (E.g. TCOF1)">
                      <typeahead
                        match-start
                        v-model="search"
                        target="#input"
                        :data="genesData"
                        :limit="parseInt(100)"
                        item-key="gene_name"/>
                        <br>
                        <br>
                        <div id="enter-genes-input">
                          <v-textarea
                            id="copy-paste-genes"
                            multi-line
                            rows="12"
                            label="Enter gene names"
                            v-model="genesToApply"
                          >
                        </v-textarea>
                        </div>
                        <v-btn style="float:right" @click="onApplyGenes">
                          Apply
                        </v-btn>
                      <br>
                    </div>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12>
            <v-card>
              <div v-if="genes.length===0">
                <v-card-title>
                    <h3>{{ IntroductionTextData.Title }}</h3>
                </v-card-title>
                <v-card-text v-html="IntroductionTextData.Content"></v-card-text>
              </div>
              <div v-else>
                <v-card-text>
                  Genes:
                  <br>
                  <v-chip disabled  color="primary" text-color="white" close v-for="(gene, i) in genes" :key="i" @input="remove(gene)">
                    {{ i+1 }}. {{ gene }}
                  </v-chip>

                </v-card-text>
              </div>
            </v-card>
          </v-flex>
        </v-layout>

        <v-layout row justify-center>
          <v-dialog v-model="dialog" max-width="400">
            <v-card>
              <v-card-title class="headline">Warning</v-card-title>
              <v-card-text>
                <p v-if="byPassedGenes.length>2">
                  Bypassing unknown genes: {{ byPassedGenes }}
                </p>
                <p v-if="dupGenes.length>2">
                  Bypassing duplicate genes: {{ dupGenes }}
                </p>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn style="float:right" @click.native="dialog = false">
                  OK
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
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
import GeneModel from '../../models/GeneModel'
import genes from '../../../data/genes.json';
import IntroductionText from '../../../data/IntroductionText.json'
import knownGenes from '../../../data/knownGenes'

var model = new Model();
var geneModel = new GeneModel();

  export default {
    components: {
    },
    props: {
      alertType:{
        type: String
      },
      alertTransition: {
        type: String
      },
      alertText: {
        type: String
      }
    },
    data(){
      return {
        search: "",
        genesData: null,
        genes:[],
        snackbar: false,
        snackbarText: "",
        multipleSearchTerms: [],
        multipleSearchArray: [],
        y: 'top',
        x: null,
        mode: '',
        snackbarTimeout: 4000,
        IntroductionTextData: null,
        genesToApply: null,
        knownGenesData: null,
        dialog: false,
        byPassedGenes: "",
        dupGenes: ""
      }
    },
    mounted(){
      this.genesData = genes;
      this.knownGenesData = knownGenes;
    },
    created(){
      this.IntroductionTextData = IntroductionText.data[3];

    },
    updated(){

    },
    watch: {
      search: function() {
        if (this.search && this.search.gene_name) {
          this.addGeneToList();
        }
      },

    },
    methods:{
      addGeneToList(){
        if(!this.genes.includes(this.search.gene_name)){
          document.getElementById("input").blur();
          this.genes.push(this.search.gene_name);
          this.$emit("importedGenes", this.genes);
        }
        else{
          this.snackbarText = "This gene is already added.";
          this.snackbar = true;
        }
      },
      ClearInputForNewSearch: function(){
        this.search = "";
        document.getElementById("input").value="";
        document.getElementById("input").focus();
      },
      remove(gene){
        this.genes.splice(this.genes.indexOf(gene), 1)
        this.genes = [...this.genes];
      },
      onApplyGenes(){
        console.log(this.knownGenesData.includes("dbfhjdb"));
        this.genesToApply = this.genesToApply.trim();
        this.genesToApply =  this.genesToApply.replace(/\n/g, " ");
        this.genesToApply =  this.genesToApply.replace(/,/g, " ");
        this.genesToApply = this.genesToApply.replace(/\s+/g, " ");
        var arr = this.genesToApply.split(" ");
        var byPassedGenes = "";
        var byPassedGenesArr = [];
        var duplicateGenes = [];

        arr.map(x=>{
          if(this.knownGenesData.includes(x.toUpperCase()) && !this.genes.includes(x.toUpperCase()) ){
            this.genes.push(x.toUpperCase());
          }
          else if(this.genes.includes(x.toUpperCase()) && !duplicateGenes.includes()){
            duplicateGenes.push(x.toUpperCase())
          }
          else {
            byPassedGenesArr.push(x.toUpperCase());
          }
        })

        if(byPassedGenesArr.length>0){
          console.log("" + byPassedGenesArr.join(" , ") + "  ");
          this.byPassedGenes = "" + byPassedGenesArr.join(" , ") + "  ";
        }
        if(duplicateGenes.length>0){
          console.log("" + duplicateGenes.join(" , ") + "  ");
          this.dupGenes = "" + duplicateGenes.join(" , ") + "  ";
        }

        if(byPassedGenesArr.length>0 || duplicateGenes.length>0){
          this.dialog = true;
        }
        this.$emit("importedGenes", this.genes);
      }
    }
  }


</script>

<style lang="sass">
@import url('https://fonts.googleapis.com/css?family=Open+Sans')
@import ../assets/sass/variables

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

</style>
