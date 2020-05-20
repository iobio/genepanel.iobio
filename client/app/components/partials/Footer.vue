<template>
  <v-footer color="blue-grey lighten-5" class="blue-grey--text" app>
    <span style="padding-left:30px" class="subheading"> &copy; 2020 Iobio.io</span>
    <v-spacer></v-spacer>
    <span>
      <a href="http://iobio.io/blog.html" target="_blank">
          <v-btn
          color="blue-grey darken-1"
          flat
          round
         >
            Blog
        </v-btn>
      </a>
    </span>
    <span>
      <a href="http://iobio.io/" target="_blank">
          <v-btn
          color="blue-grey darken-1"
          flat
          round
         >
            iobio
        </v-btn>
      </a>
    </span>
    <span>
      <a href="http://marthlab.org/" target="_blank">
          <v-btn
          color="blue-grey darken-1"
          flat
          round
         >
            MarthLab
        </v-btn>
      </a>
    </span>
  </v-footer>
</template>


<script>
import { bus } from '../../routes';

  export default {
    components: {
    },
    props: {
    },
    data(){
      return {
      }
    },
    mounted(){
    },
    updated(){
    },
    watch: {
    },
    methods:{
    }
  }


</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Open+Sans');

</style>
