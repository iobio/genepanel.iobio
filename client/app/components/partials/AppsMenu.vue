<template>
    <v-menu bottom offset-y style="color:black">
      <v-btn flat slot="activator"
        ><v-icon style="padding-right:4px">apps</v-icon>
      </v-btn>
      <v-list>
        <v-list-tile >
          <v-list-tile-title><a href="http://gene.iobio.io/">gene.iobio</a> </v-list-tile-title>
        </v-list-tile>
        <v-list-tile >
          <v-list-tile-title><a href="http://bam.iobio.io/">bam.iobio</a> </v-list-tile-title>
        </v-list-tile>
        <v-list-tile >
          <v-list-tile-title><a href="http://vcf.iobio.io/">vcf.iobio</a> </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
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
