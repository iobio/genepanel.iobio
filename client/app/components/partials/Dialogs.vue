<template>
    <v-dialog v-model="dialog" width="600px">
      <span style="cursor:pointer" slot="activator" ><v-icon small>help</v-icon></span>
      <v-card>
        <v-card-title class="headline grey lighten-2">
          <span>{{ HeadlineText }}</span>
        </v-card-title>
        <v-card-text>
            <p v-html="ContentText"></p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat="flat" @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      HeadlineText: {
        type: String
      },
      ContentText: {
        type: String
      }
    },
    data(){
      return {
        dialog: false,
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
