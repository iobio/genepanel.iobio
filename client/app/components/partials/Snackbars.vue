<template>
  <div>
    <v-snackbar
      :timeout="snackbarTimeout"
      :top="y === 'top'"
      :bottom="y === 'bottom'"
      :right="x === 'right'"
      :left="x === 'left'"
      :multi-line="mode === 'multi-line'"
      :vertical="mode === 'vertical'"
      v-model="snackbar"
    >
      {{ text }}
      <v-btn flat color="pink" @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>
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
      snackbarFlag: {
        type: Boolean,
      },
      snackbarText: {
        type: String,
      }
    },
    data(){
      return {
        snackbar: false,
        text: "",
        y: 'top',
        x: null,
        mode: '',
        snackbarTimeout: 4000,
      }
    },
    mounted(){
      this.snackbar = this.snackbarFlag;
      this.text = this.snackbarText;
    },
    updated(){

    },
    watch: {
      snackbarFlag(){
        this.snackbar = this.snackbarFlag;
      },
      snackbarText(){
        this.text = this.snackbarText; 
      }
    },
    methods:{
    }
  }

</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Open+Sans');

</style>
