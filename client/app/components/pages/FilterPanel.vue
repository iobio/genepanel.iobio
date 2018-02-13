<template>
  <div>


    <h4>Genes</h4>
    <!-- <btn v-on:click="SelectAllGenes"> Select All Genes</btn>
    <btn v-on:click="deSelectAllGenes"> De Select All Genes</btn> -->
    <input type="radio" name="genesSelection" value="selectAllGenes" v-on:click="SelectAllGenes">&nbsp; Select All Genes &nbsp;&nbsp;
    <input type="radio" name="genesSelection" value="deSelectAllGenes" v-on:click="deSelectAllGenes">&nbsp; Deselect All Genes


    <br><br>

    <h4>Disorders</h4>
    <!-- <btn v-on:click="SelectAllDisorders"> Select All Disorders</btn>
    <btn v-on:click="deSelectAllDisorders"> De Select All Disorders</btn> -->

    <input type="radio" name="disorderSelection" value="selectAllDisorders" v-on:click="SelectAllDisorders">&nbsp; Select All Disorders &nbsp;&nbsp;
    <input type="radio" name="disorderSelection" value="deSelectAllDisorders" v-on:click="deSelectAllDisorders">&nbsp; Deselect All Disorders

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
