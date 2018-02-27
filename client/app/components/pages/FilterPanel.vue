<template>
  <div>


    <h4>Genes</h4>
    <!-- <btn v-on:click="SelectAllGenes"> Select All Genes</btn>
    <btn v-on:click="deSelectAllGenes"> De Select All Genes</btn> -->
    <input type="radio" name="genesSelection" value="selectAllGenes" v-on:click="SelectAllGenes">&nbsp; Select All Genes &nbsp;&nbsp;
    <input type="radio" name="genesSelection" value="deSelectAllGenes" v-on:click="deSelectAllGenes">&nbsp; Deselect All Genes
    <br>
    <span><input type="radio" id="geneSelection" name="geneSelection" value="deSelectTopGenes" v-on:click="selectNumberOfTopGenes">&nbsp;
    Select top &nbsp; <input type="number" style="width:15%; padding: 5px ;border: 1px solid #c6c6c6 ;" v-model="NumberOfTopGenes"> genes</span>


   <!-- <input type="radio" name="topGeneSelection" id="topGeneSelection" v-on:click="selectNumberOfTopGenes"> &nbsp; Select Top Genes -->

    <br><br>

    <h4>Disorders</h4>
    <!-- <btn v-on:click="SelectAllDisorders"> Select All Disorders</btn>
    <btn v-on:click="deSelectAllDisorders"> De Select All Disorders</btn> -->

    <input type="radio" name="disorderSelection" value="selectAllDisorders" v-on:click="SelectAllDisorders">&nbsp; Select All Disorders &nbsp;&nbsp;
    <input type="radio" name="disorderSelection" value="deSelectAllDisorders" v-on:click="deSelectAllDisorders">&nbsp; Deselect All Disorders


    <br><br>
    <h4>Panels </h4>
    <!-- <button v-on:click="selectNumberOfGenePanels">select with less than 25</button> -->
    <span><input type="radio" id="disorderSelection" name="disorderSelection" value="selectGenePanelsValue" v-on:click="selectNumberOfGenePanels">&nbsp;
    Select Panels with less than &nbsp; <input type="number" style="width:15%; padding: 5px ;border: 1px solid #c6c6c6 ;" v-model="NumberOfGenePanels"> genes</span>

    <br>

    <v-card flat v-if="vendorList.length">
      <v-card-text>
        <v-container fluid>
          <v-layout>
            <v-flex>
              <v-select
                label="Select Vendors"
                autocomplete
                :loading="loading"
                multiple
                cache-items
                chips
                required
                :items="multiSelectItems"
                :search-input.sync="search"
                v-model="select"
              ></v-select>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>


  </div>
</template>


<script>
import { bus } from '../../routes';

  export default {
    props: ['vendorsData'],
    data() {
      return {
        NumberOfGenePanels: 25,
        NumberOfTopGenes: 50,
        vendorList: [],
        loading: false, //multiselect
        multiSelectItems: [],   //multiselect
        search: null,  //multiselect
        select: [],  //multiselect
        Genes: [],  //multiselect
      }
    },
    watch:{
      search (val) {
        val && this.querySelections(val);
      },
      vendorsData: function(){
        this.vendorList = this.vendorsData;
        console.log("vendor list in filter", this.vendorList);
      }
    },
    updated(){
      console.log("select from filterpanel: ", this.select);
      this.$emit('setSelectedVendors', this.select);
    },
    methods: {
      querySelections (v) { //for multi select
        this.loading = true
        // Simulated ajax query
        setTimeout(() => {
          this.multiSelectItems = this.vendorList.filter(e => {
            return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1
          })
          this.loading = false
        }, 500)
      },
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
      selectNumberOfGenePanels: function(){
        if(this.NumberOfGenePanels>0){
          bus.$emit('SelectNumberOfPanel', this.NumberOfGenePanels)
        }
        else if (this.NumberOfGenePanels<0) {
          document.getElementById("disorderSelection").reset();
        }
      },
      selectNumberOfTopGenes: function(){
        if(this.NumberOfTopGenes>0){
          bus.$emit('SelectNumberOfGenes', this.NumberOfTopGenes)
        }
        else if (this.NumberOfTopGenes<0) {
          document.getElementById("geneSelection").reset();
        }
      }
    }
  }
</script>
