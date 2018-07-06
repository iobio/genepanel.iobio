<template>
  <div>
    <v-alert
        v-model="alert"
        :type="alertType"
        :transition="alertTransition"
        outline
        dismissible
      >
      {{ alertText }}
    </v-alert>
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
        alert: true,
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

</style>
