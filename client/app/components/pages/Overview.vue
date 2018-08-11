<template>
  <div>
      <v-layout row wrap style="margin-top:-10px;">
        <v-flex d-flex xs12>
          <v-card>
            <v-card-text>
              <br><br>
              {{panelsDefinitionValues[0]}} -- {{panelsDefinitionValues[1]}}
      <!-- <div style="width:  400px; margin-left:50px">
        <v-layout row>
          <v-flex class="px-3">
            <v-range-slider
              v-model="panelsDefinitionValues"
              :max="100"
              :min="0"
              :step="1"
              thumb-label="always"
              track-color="green"
              color="yellow"
              thumb-color="blue"
            ></v-range-slider>
          </v-flex>
        </v-layout>
      </div> -->

     </v-card-text>
            <v-jumbotron style="height: 310px;" :gradient="gradient" dark>
              <v-container fill-height>
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-flex text-xs-center style="margin-top:50px">
                      <h1 style="color:white" class="display-2 font-weight-thin mb-3">panel.iobio</h1>
                      <h4  class="subheading" style="font-size:15px">Generate list of genes based on suspected disorders and phenotypes.</h4>
                      <br>
                      <v-btn color="white" style="color:#0D47A1">
                      Learn More
                      </v-btn>
                      <a href="#gtr">
                        <v-btn outline color="white" style="color:#0D47A1">
                          Genetic Testing Registry
                        </v-btn>
                      </a>

                      <a href="#phenolyzer">
                        <v-btn outline color="white" style="color:#0D47A1">
                          Phenolyzer
                        </v-btn>
                      </a>

                    </v-flex>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-jumbotron>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout row wrap style="margin-left:15px; margin-right:15px;" id="gtr">
        <v-flex xs6>
          <v-flex  style="margin-top:40px">
            <v-container >
              <h2  text-xs-center class="font-weight-thin mb-3"><img src="../assets/images/ncbi.png" alt="NCBI logo" style="height:65px; width:55px;"> Genetic Testing Registry</h2>
              <p style="text-align: justify; font-size:14px">
                The Genetic Testing Registry (GTR®) is an NCBI resource that compiles genetic test information that has been voluntarily submitted by multiple providers. <br>
                Panel.iobio allows you to search for one or more disorders, and generates a list of all of genes appearing on panels associated with these disorders. The list is sorted with genes appearing on the most panels at the top. The list can then be filtered based on your own specific requirements.
              </p>
              <br>
              <v-btn color="white" style="color:#0D47A1">
              Learn More
              </v-btn>
              <v-btn color="primary" @click="getStarted('gtr')">
                Get Started
              </v-btn>

            </v-container>
          </v-flex>
        </v-flex>

        <v-flex xs6>
          <v-flex text-xs-center>
              <img style="margin-top:68px; right: 0; width:590px;" src="../assets/images/bg9.svg" alt="bg">
          </v-flex>
        </v-flex>

      </v-layout>
      <v-divider></v-divider>
      <v-layout row wrap style="margin-left:15px; margin-right:15px;" id="phenolyzer">
        <v-flex xs6>
          <v-flex text-xs-center>
              <img style="margin-top:68px; right: 0; width:590px;" src="../assets/images/phenolyzer1bg.svg" alt="bg">
          </v-flex>
        </v-flex>
        <v-flex xs6>
          <v-flex  style="margin-top:40px">
            <v-container >
              <h2  text-xs-center class="font-weight-thin mb-3"><img src="../assets/images/phenolyzer_icon_active.svg" alt="NCBI logo" style="height:65px; width:55px;"> Phenolyzer</h2>
              <p   style="text-align: justify; font-size:14px">
                Phenolyzer stands for Phenotype Based Gene Analyzer, a tool focusing on discovering genes based on user-specific disease/phenotype terms.
                Enter phenotype terms in the search box below to use the Phenolyzer tool to generate list of genes              </p>
              <br>
              <v-btn color="white" style="color:#0D47A1">
              Learn More
              </v-btn>
              <v-btn color="primary" @click="getStarted('phenolyzer')">
                Get Started
              </v-btn>
            </v-container>
          </v-flex>
        </v-flex>



      </v-layout>
    <!-- </v-container> -->
  </div>
</template>


<script>
import { bus } from '../../routes';
import { Typeahead, Btn } from 'uiv';
import d3 from 'd3';
import Model from '../../models/Model';
import img from '../assets/images/bg.png'

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
    mounted(){
      $( `<div class='v-slider__track orange' id="generalSlider" style='left: ${this.panelsDefinitionValues[1]}%; right: auto;'></div>` ).insertAfter( ".v-slider__track-fill " );
      $( `<div class="orange" style='margin-left:-20px; right: auto; width:50px; height:10px; background:orange; display:inline; border-top-right-radius:5px'></div>` ).appendTo( ".v-input__slot " );

    },
    updated(){

    },
    watch: {
      panelsDefinitionValues: function(){
        console.log("value 3 changed", this.panelsDefinitionValues[1]);
        var leftWidth = 100 - this.panelsDefinitionValues[1];
        $('#generalSlider').css('left', `${this.panelsDefinitionValues[1]}%`)
      }
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
@import url('https://fonts.googleapis.com/css?family=Open+Sans');

center, span, h1, h2, h3, h4{
  font-family: 'Open Sans', sans-serif;
}

div.polaroid {
  width: 400px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  text-align: center;
}

.abc {
  border-radius: 10px
}

.v-slider__track__container, .v-slider__track{
  height:10px !important;
  border-radius: 5px
}

.v-slider__track-fill{
  height:10px !important;
}


</style>
