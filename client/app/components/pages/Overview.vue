<template>
  <div>
    <!-- <v-container fluid grid-list-md> -->
      <v-layout row wrap style="margin-top:-10px;">
        <v-flex d-flex xs12>
          <v-card>
            <v-jumbotron style="height: 410px;" :gradient="gradient" dark>
              <v-container fill-height>
                <v-layout row wrap>
                  <v-flex xs6>
                    <v-flex text-xs-center style="margin-top:50px">
                      <h1 class="display-3 font-weight-light mb-3">panel.iobio</h1>
                      <h4  class="subheading" style="font-size:15px">Generate list of genes based on suspected disorders and phenotypes.</h4>
                      <br>
                      <v-btn color="white" style="color:#0D47A1">
                      Learn More
                      </v-btn>
                      <v-btn outline color="white" style="color:#0D47A1">
                        Genetic Testing Registry
                      </v-btn>
                      <v-btn outline color="white" style="color:#0D47A1">
                        Phenolyzer
                      </v-btn>
                    </v-flex>
                  </v-flex>
                  <v-flex xs1>

                  </v-flex>
                  <v-flex xs5>
                    <v-flex text-xs-center>
                      <!-- <div class="polaroid"> -->
                        <img style="margin-top:68px; right: 0; width:590px;" src="../assets/images/bg8.svg" alt="bg">
                      <!-- </div> -->

                    </v-flex>
                  </v-flex>

                </v-layout>
              </v-container>
            </v-jumbotron>
            <v-parallax
              dark
            >
              <v-layout
                align-center
                column
                justify-center
              >
                <h1 style="color:black" class="display-2 font-weight-thin mb-3">NCBI's Genetic Testing Registry</h1>
                <h4  style="color:black" class="subheading">Explanation of GTR resources with links/ citation!</h4>
                <br>
                <v-btn outline color="blue darken-3" style="color:#0D47A1">
                  Get Started
                </v-btn>
              </v-layout>
            </v-parallax>
          </v-card>
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
        gradient: 'to top,  #0D47A1,#42A5F5'
      }
    },
    mounted(){

    },
    updated(){

    },
    watch: {
    },
    methods:{

    }
  }


</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Open+Sans');

div.polaroid {
  width: 400px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  text-align: center;
}

.abc {
  border-radius: 10px
}

</style>
