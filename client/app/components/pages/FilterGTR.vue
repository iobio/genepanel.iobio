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
    <span>
    Select genes in at least &nbsp; <input v-on:focusout="selectGenesInPanels" type="number" style="width:15%; padding: 5px ;border: 1px solid #c6c6c6 ;" v-model="GenesInPanels"> panels
    &nbsp;<a><v-icon v-on:click="selectGenesInPanels">navigate_next</v-icon></a>
    </span>


    <br><hr>

    <h4>Disorders</h4>
    <v-btn small v-on:click="SelectAllDisorders">Select All</v-btn>
    <v-btn small v-on:click="deSelectAllDisorders">Deselect All</v-btn>
      <br>

      <!-- <v-card flat v-if="disordersData.length">
        <v-card-text>
          <v-container fluid>
            <v-layout>
              <v-flex>
                <v-select
                  v-model="selectDisorders"
                  label="Select Disorders"
                  chips
                  tags
                  :items="multiSelectDisorder"
                ></v-select>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card> -->

    <br><hr>
    <h4>Panels </h4>
    <span>
    Select Panels with less than &nbsp; <input v-on:focusout="selectNumberOfGenePanels" type="number" style="width:15%; padding: 5px ;border: 1px solid #c6c6c6 ;" v-model="NumberOfGenePanels"> genes
    &nbsp;<a><v-icon v-on:click="selectNumberOfGenePanels">navigate_next</v-icon></a>
    </span>
    <br><br>
    <span>
    Select Panels with less than &nbsp; <input v-on:focusout="selectNumberOfConditions" type="number" style="width:15%; padding: 5px ;border: 1px solid #c6c6c6 ;" v-model="NumberOfConditions"> conditions
    &nbsp;<a><v-icon v-on:click="selectNumberOfConditions">navigate_next</v-icon></a>
  </span>

    <br>

    <v-card flat v-if="vendorsData.length">
      <v-card-text>
          <v-layout>
              <v-select
                v-model="select"
                label="Select Vendors"
                chips
                tags
                :items="multiSelectItems"
              ></v-select>
          </v-layout>
      </v-card-text>
    </v-card>
    <v-btn v-show="select.length" small v-on:click="ClearVendors">Clear vendors</v-btn>


  </div>
</template>


<script>
import { bus } from '../../routes';

  export default {
    // props: ['vendorsData'],
    props: {
      vendorsData: {
        type: Array
      },
      disordersData: {
        type: Array
      }
    },
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
        disordersDataList: [],
        selectDisorders: [],
        multiSelectDisorder: [],
        GenesInPanels: 2,
        flagForNumberOfGenesSelected: false,
        NumberOfConditions:10,
      }
    },
    watch:{
      search (val) {
        val && this.querySelections(val);
      },
      vendorsData: function(){
        this.vendorList = this.vendorsData;
        if(this.vendorsData.length===0){
          this.select = [];
        }
        //console.log("vendor list in filter", this.vendorList);
      },
      disordersData: function(){
        this.disordersDataList = this.disordersData;
        if(this.disordersData.length===0){
          this.selectDisorders = [];
        }
      }
    },
    updated(){
      //console.log("select from filterpanel: ", this.select);
      this.$emit('setSelectedVendors', this.select);
      this.multiSelectDisorder = this.disordersData;
      this.multiSelectItems = this.vendorsData;
      this.$emit('setSelectedDisorders', this.selectDisorders)
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
      selectGenesInPanels: function(){
        if (this.GenesInPanels>0) {
          bus.$emit('SelectGenesInNumberOfPanels', this.GenesInPanels);
          this.alert = true;
          this.alertText = " Selected Genes present in atleast "+ this.GenesInPanels + " Panels";
          setTimeout(()=>{
            this.alert = false;
          }, 2000);
        }
      },
      selectNumberOfConditions: function(){
        if(this.NumberOfConditions>0){
          bus.$emit('selectNumberOfConditionsInPanel', this.NumberOfConditions);
          this.alert = true;
          this.alertText = " Selected Panels with less than "+ this.NumberOfConditions + " Conditions";
          setTimeout(()=>{
            this.alert = false;
          }, 2000);
        }
      },
      ClearVendors: function(){
        this.select=[];
      }
    }
  }
</script>

<style scoped>
  .btnWidth{
    width: 5px
  }
</style>
