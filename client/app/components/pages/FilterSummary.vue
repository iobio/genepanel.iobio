<template>
  <div>
      <v-alert
        style="width:85%"
        type="success"
        :value="alert"
        transition="scale-transition"
      >
        {{alertText}}
      </v-alert>

    <h4>Genes</h4>

    <v-btn small v-on:click="SelectAllGenes">Select All</v-btn>
    <v-btn small v-on:click="deSelectAllGenes">Deselect All</v-btn>
    <br><br>
    <span>
    Select common genes
    &nbsp;<a><v-icon v-on:click="selectCommonGenes">navigate_next</v-icon></a>
    </span>
    <br><br> 

  </div>
</template>


<script>
import { bus } from '../../routes';

  export default {
    props: {
    },
    data() {
      return {
        NumberOfTopGenes: 50,
        alert:false, //To show Alert Text
        alertText: "",
      }
    },
    watch:{
    },
    updated(){
    },
    mounted(){

    },
    methods: {
      deSelectAllGenes: function(){
        bus.$emit('deSelectAllSummaryGenesBus');
        this.alert = true;
        this.alertText = " Deselected All Genes";
        setTimeout(()=>{
          this.alert = false;
        }, 2000);
      },
      SelectAllGenes: function(){
        bus.$emit('SelectAllSummaryGenesBus');
        this.alert = true;
        this.alertText = " Selected All Genes";
        setTimeout(()=>{
          this.alert = false;
        }, 2000);
      },
      selectCommonGenes: function(){
        bus.$emit('selectCommonGenesBus');
        this.alert = true;
        this.alertText = " Selected common genes in both sources";
        setTimeout(()=>{
          this.alert = false;
        }, 2000);
      }
    }
  }
</script>

<style scoped>
  .btnWidth{
    width: 5px
  }
</style>
