<template>
  <div>
    <v-card>
      <v-card-text>
        <center>
          <span v-if="multipleSearchTerms[0]!=='Summary data'" class="Rightbar_CardHeading">
          GENES
          </span>
        <v-divider v-if="multipleSearchTerms[0]!=='Summary data'" class="Rightbar_card_divider"></v-divider>
        <span class="Rightbar_card_content_subheading">
          <v-tooltip bottom>
            <span slot="activator">
              <div style="display:inline-block; padding-top:5px; width:25%">
                <input
                  :disabled="multipleSearchTerms.length<1"
                  class="form-control editTextInput"
                  type="number"
                  min="0"
                  max="10000"
                  v-model="genesTop"
                  autocomplete="off"
                  >
              </div>
            </span>
            <span>Change the number of genes selected </span>
          </v-tooltip>
            of {{ items }} genes selected
        </span>
        </center>
        <div class="text-xs-center">
          <progressCircularDonut
            v-if="items>0"
            :selectedNumber="selected"
            :totalNumber="items"
          >
          </progressCircularDonut>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { bus } from '../../routes';
import { Typeahead, Btn } from 'uiv';
import d3 from 'd3';
import Model from '../../models/Model';
import progressCircularDonut from './progressCircularDonut.vue';

var model = new Model();

  export default {
    components: {
      'progressCircularDonut': progressCircularDonut
    },
    props: {
      items:{
        type: Number
      },
      selected: {
        type: Number
      },
      multipleSearchTerms: {
        type: Array
      }
    },
    data(){
      return {
        genesTop: null,
      }
    },
    mounted(){
      this.genesTop = this.selected;
    },
    updated(){

    },
    watch: {
      genesTop(){
        this.$emit("selectNgenes", this.genesTop)
      },
      selected(){
        this.genesTop = this.selected;
      }
    },
    methods:{
    }
  }

</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Open+Sans');

</style>
