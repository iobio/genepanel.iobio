<template>
  <div>
    <br>
    <label>Search Genes</label>
    <input
      id="input"
      class="form-control"
      type="text"
      autocomplete="off"
      v-on:focus="ClearInputForNewSearch"
      placeholder="Search condition (E.g. Treacher Collins Syndrome)">
    <typeahead
      match-start
      v-model="search"
      target="#input"
      :data="genesData"
      :limit="parseInt(100)"
      item-key="gene_name"/>
      <br>
      Genes:
      <br>
      <v-chip disabled  color="primary" text-color="white" close v-for="(gene, i) in genes" :key="i" @input="remove(gene)">
        {{ i+1 }}. {{ gene }}
      </v-chip>

  </div>
</template>


<script>
import { bus } from '../../routes';
import { Typeahead, Btn } from 'uiv';
import d3 from 'd3';
import Model from '../../models/Model';
import genes from '../../../data/genes.json';

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
        search: "",
        genesData: null,
        genes:[],
      }
    },
    mounted(){
      this.genesData = genes;
    },
    updated(){

    },
    watch: {
      search: function() {
        if (this.search && this.search.gene_name) {
          this.addGeneToList();
        }
      },

    },
    methods:{
      addGeneToList(){
        if(!this.genes.includes(this.search.gene_name)){
          document.getElementById("input").blur();
          this.genes.push(this.search.gene_name);
          this.$emit("importedGenes", this.genes); 
        }
        else{
          alert("term already added");
        }
      },
      ClearInputForNewSearch: function(){
        this.search = "";
        document.getElementById("input").value="";
        document.getElementById("input").focus();
      },
      remove(gene){
        this.genes.splice(this.genes.indexOf(gene), 1)
        this.genes = [...this.genes];

      }
    }
  }


</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Open+Sans');

</style>
