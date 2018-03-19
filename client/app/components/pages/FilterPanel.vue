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
    <!-- <btn v-on:click="SelectAllGenes"> Select All Genes</btn>
    <btn v-on:click="deSelectAllGenes"> De Select All Genes</btn> -->

    <v-btn small v-on:click="SelectAllGenes">Select All</v-btn>
    <v-btn small v-on:click="deSelectAllGenes">Deselect All</v-btn>
    <!-- <input type="radio" name="genesSelection" value="selectAllGenes" v-on:click="SelectAllGenes">&nbsp; Select All Genes &nbsp;&nbsp;
    <input type="radio" name="genesSelection" value="deSelectAllGenes" v-on:click="deSelectAllGenes">&nbsp; Deselect All Genes -->
    <br><br>
    <span>
      <!-- <input type="radio" id="geneSelection" name="geneSelection" value="deSelectTopGenes" v-on:click="selectNumberOfTopGenes">&nbsp; -->
    Select top &nbsp; <input v-on:focusout="selectNumberOfTopGenes" type="number" style="width:15%; padding: 5px ;border: 1px solid #c6c6c6 ;" v-model="NumberOfTopGenes"> genes
    &nbsp;<a><v-icon v-on:click="selectNumberOfTopGenes">navigate_next</v-icon></a>
    <!-- <v-btn v-on:click="selectNumberOfTopGenes" color="info" style="height:30px;" class="btnWidth">Go</v-btn></span> -->
    </span>


   <!-- <input type="radio" name="topGeneSelection" id="topGeneSelection" v-on:click="selectNumberOfTopGenes"> &nbsp; Select Top Genes -->

    <br><hr>

    <h4>Disorders</h4>
    <!-- <btn v-on:click="SelectAllDisorders"> Select All Disorders</btn>
    <btn v-on:click="deSelectAllDisorders"> De Select All Disorders</btn> -->
    <v-btn small v-on:click="SelectAllDisorders">Select All</v-btn>
    <v-btn small v-on:click="deSelectAllDisorders">Deselect All</v-btn>
        <!-- <input type="radio" name="disorderSelection" value="selectAllDisorders" v-on:click="SelectAllDisorders">&nbsp; Select All Disorders &nbsp;&nbsp;
        <input type="radio" name="disorderSelection" value="deSelectAllDisorders" v-on:click="deSelectAllDisorders">&nbsp; Deselect All Disorders -->


    <br><hr>
    <h4>Panels </h4>
    <!-- <button v-on:click="selectNumberOfGenePanels">select with less than 25</button> -->
    <span>
      <!-- <input type="radio" id="disorderSelection" name="disorderSelection" value="selectGenePanelsValue" v-on:click="selectNumberOfGenePanels">&nbsp; -->
    Select Panels with less than &nbsp; <input v-on:focusout="selectNumberOfGenePanels" type="number" style="width:15%; padding: 5px ;border: 1px solid #c6c6c6 ;" v-model="NumberOfGenePanels"> genes
    &nbsp;<a><v-icon v-on:click="selectNumberOfGenePanels">navigate_next</v-icon></a>
    <!-- <v-btn v-on:click="selectNumberOfGenePanels" color="info" style="height:30px;" class="btnWidth">Go</v-btn> -->
  </span>

    <br>

    <v-card flat v-if="vendorList.length">
      <v-card-text>
        <v-container fluid>
          <v-layout>
            <v-flex>
              <v-select
                v-model="select"
                label="Select Vendors"
                chips
                tags
                :items="multiSelectItems"
              ></v-select>
              <!-- <v-select
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
              ></v-select> -->
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
        alert:false, //To show Alert Text
        alertText: "",
      }
    },
    watch:{
      search (val) {
        val && this.querySelections(val);
      },
      vendorsData: function(){
        this.vendorList = this.vendorsData;
        //console.log("vendor list in filter", this.vendorList);
      }
    },
    updated(){
      //console.log("select from filterpanel: ", this.select);
      this.$emit('setSelectedVendors', this.select);
      this.multiSelectItems = this.vendorsData;
    },
    mounted(){

    },
    methods: {
      // querySelections (v) { //for multi select
      //   this.loading = true
      //   // Simulated ajax query
      //   setTimeout(() => {
      //     this.multiSelectItems = this.vendorList.filter(e => {
      //       return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1
      //     })
      //     this.loading = false
      //   }, 500)
      // },
      deSelectAllDisorders: function(){
        bus.$emit('deSelectAllDisordersBus');
        this.alert = true;
        this.alertText = " Deselected All Disorders";
        setTimeout(()=>{
          this.alert = false;
        }, 2000);
      },
      SelectAllDisorders: function(){
        bus.$emit('SelectAllDisordersBus');
        this.alert = true;
        this.alertText = " Selected All Disorders";
        setTimeout(()=>{
          this.alert = false;
        }, 2000);
      },
      deSelectAllGenes: function(){
        bus.$emit('deSelectAllGenesBus');
        this.alert = true;
        this.alertText = " Deselected All Genes";
        setTimeout(()=>{
          this.alert = false;
        }, 2000);
      },
      SelectAllGenes: function(){
        bus.$emit('SelectAllGenesBus');
        this.alert = true;
        this.alertText = " Selected All Genes";
        setTimeout(()=>{
          this.alert = false;
        }, 2000);
      },
      selectNumberOfGenePanels: function(){
        if(this.NumberOfGenePanels>0){
          bus.$emit('SelectNumberOfPanel', this.NumberOfGenePanels);
          this.alert = true;
          this.alertText = " Selected Panels with less than " +this.NumberOfGenePanels + " genes";
          setTimeout(()=>{
            this.alert = false;
          }, 2000);
        }
        else if (this.NumberOfGenePanels<0) {
          document.getElementById("disorderSelection").reset();
        }
      },
      selectNumberOfTopGenes: function(){
        if(this.NumberOfTopGenes>0){
          bus.$emit('SelectNumberOfGenes', this.NumberOfTopGenes);
          this.alert = true;
          this.alertText = " Selected top " +this.NumberOfTopGenes + " genes";
          setTimeout(()=>{
            this.alert = false;
          }, 2000);
        }
        else if (this.NumberOfTopGenes<0) {
          document.getElementById("geneSelection").reset();
        }
      }
    }
  }
</script>

<style scoped>
  .btnWidth{
    width: 5px
  }
</style>
