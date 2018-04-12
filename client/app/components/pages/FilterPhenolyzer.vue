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
    Select top &nbsp; <input v-on:focusout="selectNumberOfTopGenes" type="number" style="width:15%; padding: 5px ;border: 1px solid #c6c6c6 ;" v-model="NumberOfTopGenes"> genes
    &nbsp;<a><v-icon v-on:click="selectNumberOfTopGenes">navigate_next</v-icon></a>
    </span>
    <br>

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
        bus.$emit('deSelectAllPhenolyzerGenesBus');
        this.alert = true;
        this.alertText = " Deselected All Genes";
        setTimeout(()=>{
          this.alert = false;
        }, 2000);
      },
      SelectAllGenes: function(){
        bus.$emit('SelectAllPhenolyzerGenesBus');
        this.alert = true;
        this.alertText = " Selected All Genes";
        setTimeout(()=>{
          this.alert = false;
        }, 2000);
      },
      selectNumberOfTopGenes: function(){
        if(this.NumberOfTopGenes>0){
          bus.$emit('SelectNumberOfPhenolyzerGenes', this.NumberOfTopGenes);
          this.flagForNumberOfGenesSelected= true;
          this.alert = true;
          this.alertText = " Selected top " +this.NumberOfTopGenes + " genes";
          setTimeout(()=>{
            this.alert = false;
          }, 2000);
        }
        else if (this.NumberOfTopGenes<0) {
          document.getElementById("geneSelection").reset();
        }
      },
    }
  }
</script>

<style scoped>
  .btnWidth{
    width: 5px
  }
</style>
