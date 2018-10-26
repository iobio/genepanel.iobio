<template>
  <div>
    <v-container fluid grid-list-md>
      <v-layout row wrap style="margin-top:-20px;">
        <v-flex d-flex xs12>
          <v-card>
            <v-card-text style="margin-bottom:-5px">
              <h3>Genetic Testing Registry</h3>
              <v-layout row wrap>
                <v-flex xs12 sm12 md12 lg12 xl12>
                  <ContentLoaderSearch></ContentLoaderSearch>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <br>
      <v-flex d-flex xs12  >
        <v-layout row wrap>
          <v-flex  xs8 >
            <v-card>
              <ContentLoaderPlaceholder></ContentLoaderPlaceholder>
            </v-card>
          </v-flex>
          <v-flex xs4>
            <div>
              <v-flex xs12>
                <v-card >
                  <ContentLoaderSidebar ></ContentLoaderSidebar>
                </v-card>
              </v-flex>
            </div>
            <div>
              <v-flex xs12>
                <v-card >
                  <ContentLoaderSidebar ></ContentLoaderSidebar>
                </v-card>
              </v-flex>
            </div>
            <div>
              <v-flex xs12>
                <v-card >
                  <ContentLoaderSidebar ></ContentLoaderSidebar>
                </v-card>
              </v-flex>
            </div>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-container>
  </div>
</template>


<script>
import { bus } from '../../routes';
import { Typeahead, Btn } from 'uiv';
import d3 from 'd3';
import Model from '../../models/Model';

var model = new Model();
import { ContentLoader } from "vue-content-loader";
import ContentLoaderPlaceholder from '../partials/ContentLoaderPlaceholder.vue';
import ContentLoaderSidebar from '../partials/ContentLoaderSidebar.vue';
import ContentLoaderSearch from '../partials/ContentLoaderSearch.vue'


  export default {
    components: {
      'ContentLoader': ContentLoader,
      'ContentLoaderPlaceholder': ContentLoaderPlaceholder,
      'ContentLoaderSidebar': ContentLoaderSidebar,
      'ContentLoaderSearch': ContentLoaderSearch,
    },
    props:{
    },
    data(){
      return {
        value: 0,
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

<style lang="sass">
@import ../assets/sass/variables
@import url('https://fonts.googleapis.com/css?family=Open+Sans')
</style>
