<template>
  <div>
    <!-- <datatableExample></datatableExample> -->
    <!-- <multiSelectExample></multiSelectExample> -->
    <!-- <d3Example></d3Example> -->
  <!-- Navbar  -->
    <div style="position: relative; overflow: hidden;">
      <v-toolbar
        absolute
        color="blue-grey darken-4"
        dark
        scroll-off-screen
        scroll-target="#scrolling-techniques"
      >
        <v-toolbar-title>geneLists.iobio</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <div
        style="max-height: 600px; color:red"
        class="scroll-y"
        id="scrolling-techniques"
      >
        <v-container style="height: 60px;"></v-container>
      </div>
    </div>



    <!-- <v-card height="50px" flat> -->
      <center>
      <div  color="transparent">
        <router-link :to="{ path: '/' }">
          <v-btn flat color="blue darken-1" value="GTR">
            GTR
        </v-btn>
        </router-link>
        <router-link :to="{ path: 'phenolyzer' }">
          <v-btn flat color="blue darken-1" value="phenolyzer">
            Phenolyzer
          </v-btn>
        </router-link>
        <!-- <router-link :to="{ path: 'phenolyzer' }">
          <v-btn flat color="teal" value="phenolyzer">
            Phenolyzer
          </v-btn>
        </router-link>
        <router-link :to="{ path: 'phenolyzer' }">
          <v-btn flat color="teal" value="phenolyzer">
            Phenolyzer
          </v-btn>
        </router-link> -->

        <!-- <v-btn flat color="teal" value="nearby">
          <span>Nearby</span>
          <v-icon>place</v-icon>
        </v-btn> -->
      </div>
      </center>
    <!-- </v-card> -->



  </div>
</template>

<script>


export default {
  name: 'navigationBar',
}
</script>

<style scoped>
  .toolbar__title{
    color: #66D4ED;
  }
</style>
