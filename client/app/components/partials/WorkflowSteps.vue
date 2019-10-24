<template>
  <v-flex xs12 >
    <v-card >
      <v-card-title>
          <h4>How this works?</h4>
          <v-spacer></v-spacer>
          <v-icon flat icon @click="closeButton">close</v-icon>
      </v-card-title>
      <v-card-text>
        <v-stepper class="ml-2 mr-2">
          <v-stepper-header>
            <v-stepper-step complete step="1">Enter a clinical note or select a condition</v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step complete  step="2">Review the terms and submit </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step complete step="3">App compiles a comprehensive gene list</v-stepper-step>
          </v-stepper-header>
        </v-stepper>

      </v-card-text>
    </v-card>
  </v-flex>
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
      }
    },
    mounted(){

    },
    updated(){

    },
    watch: {
    },
    methods:{
      closeButton(){
        bus.$emit("closeWorkflowSteps")
      }
    }
  }


</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Open+Sans');

</style>
