<template>
  <div>
    <v-card>
      <v-card-text>
        <center>
          <span class="Rightbar_CardHeading">
          GENES
          </span>
        <v-divider class="Rightbar_card_divider"></v-divider>
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
            <span>Click to edit the number of genes selected </span>
          </v-tooltip>
            of {{ items.length }} genes selected
        </span>
        </center>
        <div class="text-xs-center">
          <progressCircularDonut
            v-if="items.length>0"
            :selectedNumber="selected.length"
            :totalNumber="items.length"
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
        type: Array
      },
      selected: {
        type: Array
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
      this.genesTop = this.selected.length;
    },
    updated(){

    },
    watch: {
      genesTop(){
        this.$emit("selectNgenes", this.genesTop)
      }
    },
    methods:{
    }
  }

</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Open+Sans');

</style>
