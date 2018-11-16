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
                    <span><h1 style="color:white; display:inline;font-family: quicksand !important;" class="display-2 font-weight-thin mb-3">panel.iobio</h1> <br><br></span>
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
              Panel.iobio allows you to search for one or more disorders, and generates a list of all of genes appearing on panels associated with these disorders. The list is sorted with genes appearing on the most panels at the top. The list can then be filtered based on your own specific requirements.
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
    <br>
    <v-container fluid grid-list-md style="min-height:200px">
    </v-container>
  </div>
</template>


<script>
import { bus } from '../../routes';
import { Typeahead, Btn } from 'uiv';
import d3 from 'd3';
import Model from '../../models/Model';

var model = new Model();

  export default {
    components: {
    },
    props: {
    },
    data(){
      return {
        gradient: 'to top,  #0D47A1,#42A5F5',
        panelsDefinitionValues: [20, 45]
      }
    },
    updated(){

    },
    watch: {
    },
    methods:{
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
