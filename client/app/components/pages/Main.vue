<template>
  <div id="app">
  <v-app id="inspire">
    <v-navigation-drawer
      fixed
      :clipped="$vuetify.breakpoint.mdAndUp"
      app
      v-model="drawer"
    >
    <v-list dense v-if="component==='Home'">
        <v-card >
          <v-card-title primary class="title">Filters</v-card-title>
          <v-card-text>
            <FilterGTR
              v-bind:vendorsData="vendorList"
              v-on:setSelectedVendors="updateSelectedVendors($event)"
              v-bind:disordersData="disorderList"
              v-on:setSelectedDisorders="updateSelectedDisorders($event)">
            </FilterGTR>
          </v-card-text>
        </v-card>
    </v-list>
    </v-navigation-drawer>
    <v-toolbar
      color="blue darken-3"
      dark
      app
      :clipped-left="$vuetify.breakpoint.mdAndUp"
      fixed
    >
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span class="hidden-sm-and-down">GenePanel.iobio</span>
      </v-toolbar-title>
      <!-- <v-text-field
        flat
        solo-inverted
        prepend-icon="search"
        label="Search"
        class="hidden-sm-and-down"
      ></v-text-field> -->
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <div>
        <v-toolbar color="cyan" dark tabs>
          <v-tabs
            color="cyan"
            slot="extension"
            grow
          >
            <v-tabs-slider color="yellow"></v-tabs-slider>
            <v-tab v-on:click="component='Home'">
              GTR
            </v-tab>
            <v-tab v-on:click="component='HomePage'">
              Home
            </v-tab>
            <v-tab v-on:click="component='Phenolyzer'">
              Phenolyzer
            </v-tab>
            <v-tab v-on:click="component='SummaryTab'">
              Summary
            </v-tab>

          </v-tabs>
        </v-toolbar>
        <!-- <v-tabs-items>
          <keep-alive>
            <component v-bind:is="component"></component>
          </keep-alive>
        </v-tabs-items> -->
        <v-tabs-items>
          <keep-alive>
            <Home
              v-if="component==='Home'"
              v-on:vendorListCB="updateVendors($event)"
              v-bind:selectedVendorsListCB="selectedVendorsList"
              v-on:diseasesCB=addDiseases($event)
              v-on:disorderNamesListCB="updateDisorderNames($event)"
              v-bind:selectedDisordersListCB="selectedDisordersList">
            </Home>
            <HomePage v-else-if="component==='HomePage'"></HomePage>
            <Phenolyzer v-else-if="component==='Phenolyzer'"></Phenolyzer>
            <SummaryTab v-else-if="component==='SummaryTab'"></SummaryTab>
          </keep-alive>
        </v-tabs-items>
      </div>
    </v-content>


  </v-app>
</div>
</template>

<script>
import { bus } from '../../routes';
import Home from './Home.vue';
import Phenolyzer from './Phenolyzer.vue';
import NavigationBar from './NavigationBar.vue';
import HomePage from './HomePage.vue';
import SummaryTab from './SummaryTab.vue';
import FilterGTR from './FilterGTR.vue'

  export default {
    components: {
      'Home': Home,
      'Phenolyzer': Phenolyzer,
      'NavigationBar': NavigationBar,
      'HomePage': HomePage,
      'SummaryTab': SummaryTab,
      'FilterGTR': FilterGTR,
    },
    data(){
      return{
        component: 'Home',
        drawer: false,
        vendorList:[],
        selectedVendorsList:[],
        disorderList:[],
        selectedDisordersList: []
      }
    },
    methods: {
      addDiseases: function(e){
        if(e.length<= 0){
          this.vendorList=[];
          this.disorderList=[]
        }
      },
      updateVendors: function(e){
        this.vendorList = e;
      },
      updateSelectedVendors: function(e){
        this.selectedVendorsList = e;
      },
      updateDisorderNames: function(e){
        this.disorderList = e;
      },
      updateSelectedDisorders: function(e){
        this.selectedDisordersList = e;
      }
    }

  }

</script>

<style>
.toolbar__content {
  height: 0px;
}
</style>
