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
          <span v-if="!openEditBox"><strong class="Rightbar_card_content_heading">{{ selected.length }}</strong> </span>
          <span v-else>
            <div style="display:inline-block; padding-top:5px;">
              <input
                :disabled="multipleSearchTerms.length<1"
                id="top-genes-phenolyzer"
                class="form-control"
                style="margin-bottom:8px; width:82%"
                type="text"
                v-model="NumberOfTopGenes"
                autocomplete="off"
                list="genes">
                <datalist id="genes">
                  <option v-for="genesCount in genesTopCounts">
                    {{ genesCount }}
                  </option>
                </datalist>
            </div>
          </span>
            of {{ items.length }} genes selected
            <v-tooltip bottom v-if="!openEditBox">
             <v-icon
               slot="activator"
               v-on:click="openGenesSelectionBox"
             >
               edit
             </v-icon>
             <span>Edit the number of genes selected</span>
           </v-tooltip>
           <v-tooltip bottom v-else>
            <v-icon
              slot="activator"
              v-on:click="openEditBox=false"
            >
              close
            </v-icon>
            <span>Close the edit box</span>
          </v-tooltip>
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
        genesTopCounts: [5, 10, 30, 50, 80, 100],
        openEditBox: false,
        NumberOfTopGenes: 10,

      }
    },
    mounted(){

    },
    updated(){

    },
    watch: {
      NumberOfTopGenes(){
        this.$emit("selectNgenes", this.NumberOfTopGenes);
      }
    },
    methods:{
      openGenesSelectionBox(){
        this.openEditBox = true;
        this.NumberOfTopGenes = this.selected.length;
      }
    }
  }

</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Open+Sans');

</style>
