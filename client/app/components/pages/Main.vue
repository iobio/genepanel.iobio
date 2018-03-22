<template>
  <div>
    <NavigationBar></NavigationBar>
    <center>
    <div color="transparent">
        <v-btn v-on:click="component='Home'" flat color="blue darken-1" value="GTR">
          GTR
      </v-btn>
        <v-btn v-on:click="component='Phenolyzer'" flat color="blue darken-1" value="phenolyzer">
          Phenolyzer
        </v-btn>
    </div>
    </center>
    <keep-alive>
      <component v-bind:is="component"></component>
    </keep-alive>
    <!-- <Phenolyzer></Phenolyzer> -->
  </div>
</template>

<script>
import { bus } from '../../routes';
import Home from './Home.vue';
import Phenolyzer from './Phenolyzer.vue';
import NavigationBar from './NavigationBar.vue';

  export default {
    components: {
      'Home': Home,
      'Phenolyzer': Phenolyzer,
      'NavigationBar': NavigationBar
    },
    data(){
      return{
        component: 'Home'
      }
    },
    methods: {
    }

  }

</script>

<style>
</style>
