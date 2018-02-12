<template>
  <div>
  

    <h4>Genes</h4>
    <btn v-on:click="SelectAllGenes"> Select All Genes</btn>
    <btn v-on:click="deSelectAllGenes"> De Select All Genes</btn>

    <br><br>

    <h4>Disorders</h4>
    <btn v-on:click="SelectAllDisorders"> Select All Disorders</btn>
    <btn v-on:click="deSelectAllDisorders"> De Select All Disorders</btn>
  </div>
</template>


<script>
import { bus } from '../../routes';

  export default {
    methods: {
      deSelectAllDisorders: function(){
        bus.$emit('deSelectAllDisordersBus');
      },
      SelectAllDisorders: function(){
        bus.$emit('SelectAllDisordersBus');
      },
      deSelectAllGenes: function(){
        bus.$emit('deSelectAllGenesBus');
      },
      SelectAllGenes: function(){
        bus.$emit('SelectAllGenesBus');
      },
    }
  }
</script>
