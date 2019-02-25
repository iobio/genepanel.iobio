<template>
  <div>
    <div style="background-color:#f9fbff">

      <v-container fluid grid-list-md>
        <v-layout row wrap style="margin-top:-20px;">
          <v-flex d-flex xs12>
            <v-card>
              <v-card-text style="margin-bottom:-5px">
                <h3>ClinPhen</h3>
                <v-layout row wrap>
                  <v-flex xs12 sm12 md12 lg8 xl8>
                    <v-textarea
                             solo
                             v-model="notes"
                             name="input-7-4"
                             label="Enter clinical notes"
                    ></v-textarea>
                    <v-btn v-on:click="fetchHpoTerm" color="primary">submit</v-btn>

                    <p></p>
                    <!-- <div v-if="this.HpoTerms.length>0">
                      <div v-for="term in HpoTerms">
                        {{term.hpoNumber}} - {{term.phenotype}}
                      </div>
                    </div> -->
                    <div v-if="this.HpoTerms.length">
                      <br>
                        HPO Terms:
                      <v-chip disabled  color="primary" text-color="white" close v-for="(term, i) in HpoTerms" :key="i" @input="remove(term)">
                        {{ i+1 }}. <b> {{ term.hpoNumber }} </b> &nbsp; <i> ({{term.phenotype}}) </i>
                      </v-chip>
                    </div>
                  </v-flex>

                  <v-flex xs12 sm12 md12 lg4 xl4>
                    <v-layout row wrap>
                      <v-flex style="margin-left:20px">
                        <div v-if="items.length>0">
                          <v-card>
                            <v-card-text>
                              <center>
                                <span class="Rightbar_CardHeading" style="font-size:15px">
                                  GENES
                                </span>
                                <v-divider class="Rightbar_card_divider"></v-divider>
                                <span class="Rightbar_card_content_subheading">
                                  <strong class="Rightbar_card_content_heading">{{ selected.length }}</strong> of {{ items.length }} genes selected
                                </span>
                              </center>
                              <div class="text-xs-center">
                                <progressCircularDonut
                                  v-if="items.length>0"
                                  :selectedNumber="selected.length"
                                  :totalNumber="items.length"
                                >
                                </progressCircularDonut>
                              </div>
                            </v-card-text>
                          </v-card>
                        </div>
                      </v-flex>
                    </v-layout>
                  </v-flex>

                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>

          <v-flex xs12 >
            <v-card >

            </v-card>
          </v-flex>

          <v-flex d-flex xs12 >
            <v-layout row wrap>
              <!-- Start data table  -->
              <v-flex xs8>
                <v-card>
                  <!-- <ContentLoaderPlaceholder v-show="checked===true"></ContentLoaderPlaceholder> -->
                </v-card>
              </v-flex>

              <!-- Datatable goes here -->
              <v-flex xs12>
                <v-card v-if="items.length">
                  <v-data-table
                      id="clinphen-genes-table"
                      v-model="selected"
                      v-bind:headers="headers"
                      v-bind:items="items"
                      select-all
                      v-bind:pagination.sync="pagination"
                      item-key="gene"
                      class="elevation-1"
                      v-bind:search="search"
                      no-data-text="No pheotype genes Available Currently"
                    >
                    <template slot="headers" slot-scope="props">
                      <tr>
                        <th>
                          <v-checkbox
                            primary
                            hide-details
                            @click.native="toggleAll"
                            :input-value="props.all"
                            :indeterminate="props.indeterminate"
                          ></v-checkbox>
                        </th>
                        <th v-for="header in props.headers" :key="header.text"
                          :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                        >
                          {{ header.text }}
                        </th>
                      </tr>
                    </template>
                    <template slot="items" slot-scope="props">
                      <tr :active="props.selected">
                        <td>
                          <v-checkbox
                            primary
                            hide-details
                            v-model="props.selected"
                            :input-value="props.selected"
                          ></v-checkbox>
                        </td>
                        <td>{{ props.item.index }}</td>
                        <td >
                          <span style="font-size:14px; font-weight:600; margin-top:2px" slot="activator">{{ props.item.gene }}</span>
                        </td>
                          <td >
                            <span v-for="x in props.item.searchTermIndexSVG">
                              <span v-html="x"></span>
                            </span>
                          </td>
                      </tr>
                    </template>
                    <template slot="footer">
                  </template>
                  </v-data-table>
                </v-card>
              </v-flex>
              <!-- End data table -->


            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>

      <v-container fluid grid-list-md style="min-height:500px">
        <v-layout row wrap style="margin-top: -20px;margin-left: -20px;margin-right: -20px;">
          <v-flex d-flex xs12 sm12 md12 lg12>

          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </div>
</template>


<script>
import { bus } from '../../routes';
import { Typeahead, Btn } from 'uiv';
import GeneModel from '../../models/GeneModel';
var geneModel = new GeneModel();
import IntroductionText from '../../../data/IntroductionText.json'
import Dialogs from '../partials/Dialogs.vue';
import HelpDialogs from '../../../data/HelpDialogs.json';
import SvgBar from '../viz/SvgBar.vue'
import progressCircularDonut from '../partials/progressCircularDonut.vue';
import ContentLoaderPlaceholder from '../partials/ContentLoaderPlaceholder.vue';
import ContentLoaderSidebar from '../partials/ContentLoaderSidebar.vue';
import hpo_genes from '../../../data/hpo_genes.json'

  export default {
    components: {
      'Dialogs': Dialogs,
      'SvgBar': SvgBar,
      'progressCircularDonut': progressCircularDonut,
      'ContentLoaderPlaceholder': ContentLoaderPlaceholder,
      'ContentLoaderSidebar': ContentLoaderSidebar,
      Typeahead
    },
    props: {
      isMobile: {
        type: Boolean
      },
      browser: {
        type: String
      },
      launchedFromClin: {
        type: Boolean
      }
    },
    data(){
      let self = this;
      return {
        notes: "",
        HpoTerms: [],
        multipleSearchTerms: [],
        HpoGenesData: null,
        items: [],
        selected: [],
        //DataTable
        pagination: {
          sortBy: 'index',
          // descending: true,
          rowsPerPage: 25
        },
        search: '',
        selected: [],
        headers: [
          {
            text: 'Number',
            value: 'index',
            sortable: false,
            align: 'left',
          },
          {
            text: 'Gene Name',
            align: 'left',
            value: 'gene',
            sortable: false,
          },
          { text: 'Search Terms', align: 'left', sortable: false, value: 'searchTermIndexSVG' },
        ],
      }
    },
    beforeCreate(){
    },
    created(){
    },
    mounted(){
      this.HpoGenesData = hpo_genes;
      console.log(this.HpoGenesData["HP:0003803"])
    },
    updated(){
    },
    watch: {
    },
    methods: {
      fetchHpoTerm: function(){
        this.HpoTerms = [];
        console.log("notes", this.notes);
        var u = `http://nv-dev-new.iobio.io/clinphen/?cmd=${this.notes}`
        console.log("url", u)
        return fetch(`http://nv-dev-new.iobio.io/clinphen/?cmd=${this.notes}`)
          .then((response) => {
            response.body
              .getReader()
              .read()
              .then((value, done) => {
                // console.log(value.value) //gets the unit8Array
                var decoder = new TextDecoder('utf-8');
                // console.log(decoder.decode(value.value));
                var res = decoder.decode(value.value);
                this.parseTerms(res);
              });
          });
      },
      parseTerms: function(res){
        var count = 0;
        var hpoTermArr = [];
        var terms = [];
        console.log("parseTerms called", res)
        res.split("\n").forEach(function(rec){
          // console.log("rec", rec)
          var fields = rec.split("\t");
          if(fields.length===5){
            var hpoNumber = fields[0];
            var phenotype = fields[1];
            terms.push(hpoNumber)
            hpoTermArr.push({hpoNumber:hpoNumber, phenotype:phenotype})
          }
        })
        hpoTermArr.shift();
        terms.shift();
        this.multipleSearchTerms = terms;
        console.log("this.multipleSearchTerms", this.multipleSearchTerms)
        console.log("hpoTermArr",hpoTermArr);
        this.HpoTerms = hpoTermArr;
        this.getGenesForHpoTerms();
      },
      getGenesForHpoTerms: function(){
        var genes = [];
        this.items = [];
        this.selected = [];
        this.multipleSearchTerms.map((term, i)=>{
          if(this.HpoGenesData[term]!==undefined){
            // this.items = [...this.items, ...this.HpoGenesData[x].gene_symbol]
            this.HpoGenesData[term].gene_symbol.map(gene_name=>{
              if(!genes.includes(gene_name)){
                genes.push(gene_name);
                this.items.push({
                  gene: gene_name,
                  searchTermIndex: [i+1],
                  hpoTerm: [term],
                  componentSource: "ClinPhen",
                  hpoSource:1,
                })
              }
              else if(genes.includes(gene_name)){
                var idx = genes.indexOf(gene_name);
                if(this.items[idx].hpoTerm!==term){
                  this.items[idx].searchTermIndex.push(i+1);
                  this.items[idx].hpoTerm.push(term);
                  this.items[idx].hpoSource = this.items[idx].hpoSource+1;
                }
              }
            })

          }
        })
        console.log("this.items", this.items);
        this.items.sort((a,b)=> b.hpoSource - a.hpoSource );
        this.noOfSourcesSvg();
        this.selected = this.items.slice();
      },
      noOfSourcesSvg: function(){
        this.items.map((x, i)=>{
          x.index = i+1;
          x.searchTermIndexSVG = x.searchTermIndex.map(y=>{
            return `<svg height="30" width="30">
                  <circle class="sourceIndicator"/>
                  <text class="sourceIndicatorText" x="12" y="15" font-weight="600" font-size="10"  dy=".3em">${y}</text>
                </svg> `
          })
        });
      },
      remove(term){
        var idx = this.multipleSearchTerms.indexOf(term.hpoNumber);
        this.HpoTerms.splice(idx,1);
        this.HpoTerms = [...this.HpoTerms];
        this.multipleSearchTerms.splice(idx,1);
        this.multipleSearchTerms = [...this.multipleSearchTerms];
        this.getGenesForHpoTerms();
      }
    }
  }
</script>

<style>

</style>

<style lang="sass">

  @import ../assets/sass/variables


</style>
