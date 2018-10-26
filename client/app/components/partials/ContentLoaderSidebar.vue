<template>
  <div>
    <content-loader
    :height="160"
		:width="500"
		:speed="2"
		primaryColor="#e7e7e7"
		secondaryColor="#aeaeae"
    >
      <rect x="90" y="88" rx="3" ry="3" width="330" height="14" />
      <rect x="151" y="59" rx="0" ry="0" width="200" height="9" />
      <rect x="218" y="119" rx="3" ry="3" width="66.3" height="20.1" />
      <rect x="0" y="32.18" rx="4" ry="4" width="566" height="1" />
	</content-loader>

  </div>
</template>


<script>
import { bus } from '../../routes';
import { Typeahead, Btn } from 'uiv';
import d3 from 'd3';
import Model from '../../models/Model';

var model = new Model();
import { ContentLoader } from "vue-content-loader"

  export default {
    components: {
      'ContentLoader': ContentLoader
    },
    props:{
    },
    data(){
      return {
        value: 0,
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

<style lang="sass">
@import ../assets/sass/variables
@import url('https://fonts.googleapis.com/css?family=Open+Sans')
</style>
