<template>
  <div>
    <v-dialog
       v-model="dialog"
       width="650px"
     >
       <v-card>
         <v-card-title class="headline"><span>{{ HeadlineText }}</span></v-card-title>

         <v-card-text>
           <p v-html="ContentText"></p>
         </v-card-text>

         <v-card-actions>
           <v-spacer></v-spacer>
           <v-btn
             color="blue darken-1"
             flat="flat"
             @click="dialog = false"
           >
             Close
           </v-btn>
         </v-card-actions>
       </v-card>
     </v-dialog>
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
    props:{
      dialogState:{
        type: Boolean,
      },
      HeadlineText: {
        type: String
      },
      ContentText: {
        type: String
      }
    },
    data(){
      return {
        dialog: true
      }
    },
    mounted(){
    },
    updated(){
      this.$emit("closeDialog")
    },
    watch: {
      dialogState: function(){
        this.dialog = this.dialogState;
      }
    },
    methods:{
    }
  }

</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Open+Sans');

</style>
