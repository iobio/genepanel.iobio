<template>
  <div>
    <!-- <v-text-field label="Gradient" v-model="gradient"></v-text-field> -->
    <br><br>
    <center>
      <strong>Number of GTR Genes selected: {{ GtrGenes }}</strong>
      <br>
      <strong>Number of Phenolyzer Genes selected: {{ phenolyzerGenes }}</strong>
    </center>

    <!-- <v-jumbotron :gradient="gradient" dark>
      <v-container fill-height>
        <v-layout align-center>
          <v-flex text-xs-center>
            <h3 class="display-3">Coming Soon!</h3>
          </v-flex>
        </v-layout>
      </v-container>
    </v-jumbotron> -->
  </div>
</template>

<script>
  export default {
    props:{
      NumberOfGtrGenes:{
        type: Number
      },
      NumberOfPhenolyzerGenes:{
        type:Number
      }
    },
    data: () => ({
      gradient: 'to top, #7B1FA2, #E1BEE7',
      GtrGenes: 0,
      phenolyzerGenes:0,
    }),
    watch: {
      NumberOfGtrGenes: function(){
        this.GtrGenes = this.NumberOfGtrGenes;
      },
      NumberOfPhenolyzerGenes:function(){
        this.phenolyzerGenes = this.NumberOfPhenolyzerGenes;
      }
    },
    mounted(){
      this.GtrGenes = this.NumberOfGtrGenes;
      this.phenolyzerGenes = this.NumberOfPhenolyzerGenes;
    }
  }
</script>
