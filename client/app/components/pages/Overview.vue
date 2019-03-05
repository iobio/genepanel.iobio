<template>
  <div id="overview-panel">
    <v-layout row wrap style="margin-top:-10px;">
      <v-flex d-flex xs12>
        <v-card>
          <v-jumbotron class="overview-jumbotron" :gradient="gradient" dark>
            <v-container fill-height>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-flex text-xs-center style="margin-top:50px">
                    <span><h1 style="color:white; display:inline;font-family: quicksand !important;" class="display-2 font-weight-thin mb-3">genepanel.iobio</h1> <br><br></span>
                    <h4  class="subheading" style="font-size:17px !important">Generate list of genes based on suspected conditions and phenotypes.</h4>
                    <br><br><br>
                    <v-layout row wrap>
                      <v-flex xs12 md1 lg3 xl3>
                      </v-flex>
                      <v-flex xs12 md5 lg3 xl3>
                        <v-flex text-xs-center>
                          <h4 style="color:white; display:inline">Suspected Conditions </h4>
                          <v-tooltip top>
                            <span style="cursor:pointer" slot="activator" ><v-icon small>help</v-icon></span>
                            <span>Generate a gene list for suspected condition (Eg. Treacher Collins Syndrome)</span>
                          </v-tooltip>
                          <br><br>
                          <v-btn  round color="white" style="color:#0D47A1" @click="getStarted('gtr')">
                            Genetic Testing Registry <v-icon>play_arrow</v-icon>
                          </v-btn>
                        </v-flex>
                      </v-flex>
                      <div class="vl"></div>

                      <v-flex xs12 md5 lg3 xl3>
                        <v-flex text-xs-center>
                          <div class="hl">
                          </div>
                          <div class="phenolyzer-button-div">
                            <h4 style="color:white; display:inline">Suspected Phenotypes </h4>
                            <v-tooltip top>
                              <span style="cursor:pointer" slot="activator" ><v-icon small>help</v-icon></span>
                              <v-container grid-list-xs,sm,md,lg,xl>
                                <span style="margin:auto; margin-left:20px; margin-right:20px">Generate a gene list for suspected phenotype (Eg. Lactic acidosis) using the Phenolyzer. </span>
                              </v-container>
                            </v-tooltip>
                            <br><br>
                            <v-btn  round color="white" style="color:#0D47A1" @click="getStarted('phenolyzer')">
                              Phenolyzer <v-icon>play_arrow</v-icon>
                            </v-btn>
                          </div>
                        </v-flex>
                      </v-flex>
                      <v-flex xs12 md1 lg3 xl3>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-flex>
              </v-layout>
            </v-container>
          </v-jumbotron>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap style="margin-left:15px; margin-right:15px;" id="gtr">
      <v-flex xs12 md12 sm12 lg6 xl6 >
        <v-flex  style="margin-top:40px">
          <v-container >
            <h2  text-xs-center class="font-weight-thin mb-3"><img src="../assets/images/ncbi.png" alt="NCBI logo" style="height:65px; width:55px;"> Genetic Testing Registry</h2>
            <p style="text-align: justify; font-size:14px">
              The Genetic Testing Registry (GTR®) is an NCBI resource that compiles genetic test information that has been voluntarily submitted by multiple providers. <br>
              Genepanel.iobio allows you to search for one or more disorders, and generates a list of all of genes appearing on panels associated with these disorders. The list is sorted with genes appearing on the most panels at the top. The list can then be filtered based on your own specific requirements.
            </p>
            <br>
            <a href="http://iobio.io/user_guides/2018/10/28/how-to-use-gtr/" target="_blank">
              <v-btn color="white" style="color:#0D47A1">
              Learn More
              </v-btn>
            </a>
            <a href="https://www.ncbi.nlm.nih.gov/gtr/" target="_blank">
              <v-btn color="primary">
                About GTR
              </v-btn>
            </a>
            <v-btn color="primary" @click="getStarted('gtr')">
              Get Started
            </v-btn>
          </v-container>
        </v-flex>
      </v-flex>

      <v-flex xs12 md12 sm12 lg5 xl5>
        <v-flex text-xs-center>
            <img style="margin-top:68px; right: 0; width:590px;" src="../assets/images/gtrBackground.svg" alt="Gtr background image">
        </v-flex>
      </v-flex>


    </v-layout>
    <v-divider></v-divider>
    <v-layout row wrap style="margin-left:5px; margin-right:15px;" id="phenolyzer">
      <v-flex xs12 md12 sm12 lg6 xl6 order-md2 order-sm2 order-xs2 order-lg1 order-xl1>
        <v-flex text-xs-center>
            <img style="margin-top:68px; right: 0; width:600px;" src="../assets/images/phenolyzer1bg.svg" alt="Phenolyzer background image">
        </v-flex>
      </v-flex>
      <v-flex xs12 md12 sm12 lg5 xl5 order-md-1 order-sm1 order-xs1 order-lg2 order-xl2>
        <v-flex  style="margin-top:40px; margin-left:15px">
          <v-container >
            <h2  text-xs-center class="font-weight-thin mb-3"><img src="../assets/images/phenolyzer_icon_active.svg" alt="NCBI logo" style="height:65px; width:55px;"> Phenolyzer</h2>
            <p   style="text-align: justify; font-size:14px">
              Phenolyzer is a tool from the <a href="http://wglab.org/" target='_blank'>Wang Genomics lab</a>, that converts discrete phenotype terms into a list of candidate genes.
              <br>This is achieved by interpreting the phenotype term into a set of disease names.
              Then, all genes having a reported association with these diseases are found, then expands this list by considering gene-gene relation databases.
              Finally, all this information is integrated to generate a weighted score for each gene.
            </p>
            <br>
            <a href="http://iobio.io/user_guides/2018/10/27/how-to-use-phenolyzer/" target="_blank">
              <v-btn color="white" style="color:#0D47A1">
              Learn More
              </v-btn>
            </a>
            <a href="http://phenolyzer.wglab.org/" target="_blank">
              <v-btn color="primary">
                About Phenolyzer
              </v-btn>
            </a>
            <v-btn color="primary" @click="getStarted('phenolyzer')">
              Get Started
            </v-btn>
          </v-container>
        </v-flex>
      </v-flex>
    </v-layout>

    <!-- <div v-if="this.HpoTerms.length>0">
      <div v-for="term in HpoTerms">
        {{term.hpoNumber}} - {{term.phenotype}}
      </div>
    </div> -->
    <div id="venn"></div>
    <button v-on:click="drawVenn"> Click </button>
    <v-container fluid grid-list-md style="min-height:200px">
    </v-container>

  </div>
</template>


<script>
import { bus } from '../../routes';
import { Typeahead, Btn } from 'uiv';
import d3 from 'd3';
import Model from '../../models/Model';
import hpo_genes from '../../../data/hpo_genes.json';
import genesJsonp from './genes.json';
// import venn from "venn.js"
// require('venn.js')
var model = new Model();
// import initVenn from '../../d3/venn';
// var Venn = new initVenn();

  export default {
    components: {
    },
    props: {
    },
    data(){
      return {
        gradient: 'to top,  #0D47A1,#42A5F5',
        panelsDefinitionValues: [20, 45],
        notes: "",
        HpoTerms: [],
        multipleSearchTerms: [],
        HpoGenesData: null,
        items: [],
        setsData: [],
      }
    },
    mounted(){
      this.HpoGenesData = hpo_genes;
      console.log(this.HpoGenesData["HP:0003803"]);
      this.setsData = genesJsonp.data
      console.log("venn", venn)
    },
    updated(){

    },
    watch: {
    },
    methods:{
      drawVenn: function(){
        var x = require('venn.js')
        var chart = x.VennDiagram()
                 .width(500)
                 .height(500);

      var div = d3.select("#venn")
      div.datum(this.setsData).call(chart);

      var tooltip = d3.select("body").append("div")
          .attr("class", "venntooltip");

      div.selectAll("path")
          .style("stroke-opacity", 0)
          .style("stroke", "#fff")
          .style("stroke-width", 3)

      div.selectAll("g")
          .on("mouseover", function(d, i) {
              // sort all the areas relative to the current item
              x.sortAreas(div, d);

              // Display a tooltip with the current size
              tooltip.transition().duration(400).style("opacity", .9);
              tooltip.text(d.size + " genes");

              // highlight the current path
              var selection = d3.select(this).transition("tooltip").duration(400);
              selection.select("path")
                  .style("fill-opacity", d.sets.length == 1 ? .4 : .1)
                  .style("stroke-opacity", 1);
          })

          .on("mousemove", function() {
              tooltip.style("left", (d3.event.pageX) + "px")
                     .style("top", (d3.event.pageY - 28) + "px");
          })

          .on("mouseout", function(d, i) {
              tooltip.transition().duration(400).style("opacity", 0);
              var selection = d3.select(this).transition("tooltip").duration(400);
              selection.select("path")
                  .style("fill-opacity", d.sets.length == 1 ? .25 : .0)
                  .style("stroke-opacity", 0);
          });

      },
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
                  componentSource: "ClinPhen"
                })
              }
              else if(genes.includes(gene_name)){
                var idx = genes.indexOf(gene_name);
                console.log("gene_name", gene_name)
                console.log("this.items[idx].hpoTerm", this.items[idx].hpoTerm)
                console.log("term", term);
                console.log("check equality", this.items[idx].hpoTerm===term)
                if(this.items[idx].hpoTerm!==term){
                  this.items[idx].searchTermIndex.push(i+1);
                  this.items[idx].hpoTerm.push(term);
                }
              }
            })

          }
        })
        console.log("this.items", this.items)
        this.noOfSourcesSvg();
      },
      noOfSourcesSvg: function(){
        this.items.map((x, i)=>{
          x.searchTermIndexSVG = x.searchTermIndex.map(y=>{
            return `<svg height="30" width="30">
                  <circle class="sourceIndicator"/>
                  <text class="sourceIndicatorText" x="12" y="15" font-weight="600" font-size="10"  dy=".3em">${y}</text>
                </svg> `
          })
        });
      },
      getStarted: function(component){
        if(component==='gtr'){
          bus.$emit('openGtrComponent');
        }
        else if(component==='phenolyzer'){
          bus.$emit('openPhenolyzer')
        }
      }
    }
  }

</script>

<style>
</style>

<style lang="sass">

@import ../assets/sass/variables
@import url('https://fonts.googleapis.com/css?family=Open+Sans')

.overview-jumbotron
  height: 370px !important

.vl
    border-left: 1px solid #d8d8d8
    height: 100px


@media screen and (max-width: 959px)
  .vl
    height: 0

  .overview-jumbotron
    height: 540px !important

  .phenolyzer-button-div
    margin-top: 30px

  .hl
    border-top: 2px solid #d8d8d8
    margin: auto
    width: 70%
    margin-top: 30px

div.polaroid
  width: 400px
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)
  text-align: center

.abc
  border-radius: 16px

#overview-panel
  center, span, h1, h2, h3, h4
    font-family: $app-font

  h1, h4
    color: white

  h2, h3
    color: black

</style>
