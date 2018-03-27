<template>
  <div>
    <NavigationBar></NavigationBar>
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
      <v-tabs-items v-model="tab">
        <keep-alive>
          <component v-bind:is="component"></component>
        </keep-alive>
      </v-tabs-items>
    </div>
    <center>
    <!-- <div color="transparent">
        <v-btn v-on:click="component='Home'" flat color="blue darken-1" value="GTR">
          GTR
      </v-btn>
        <v-btn v-on:click="component='Phenolyzer'" flat color="blue darken-1" value="phenolyzer">
          Phenolyzer
        </v-btn>
    </div> -->
    </center>
    <!-- <keep-alive>
      <component v-bind:is="component"></component>
    </keep-alive> -->
    <!-- <Phenolyzer></Phenolyzer> -->
  </div>
</template>

<script>
import { bus } from '../../routes';
import Home from './Home.vue';
import Phenolyzer from './Phenolyzer.vue';
import NavigationBar from './NavigationBar.vue';
import HomePage from './HomePage.vue';
import SummaryTab from './SummaryTab.vue';

  export default {
    components: {
      'Home': Home,
      'Phenolyzer': Phenolyzer,
      'NavigationBar': NavigationBar,
      'HomePage': HomePage,
      'SummaryTab': SummaryTab
    },
    data(){
      return{
        component: 'Home',
      }
    },
    methods: {
    }

  }

</script>

<style>
</style>
