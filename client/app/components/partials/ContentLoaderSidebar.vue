<template>
  <div>
    <content-loader
		:height="200"
		:width="400"
		:speed="2"
    primaryColor="#e7e7e7"
    secondaryColor="#aeaeae"

    	>
		<rect x="69" y="22.18" rx="0" ry="0" width="280" height="152" />
		<!-- <rect x="69" y="218.77" rx="0" ry="0" width="346" height="144" />
		<rect x="68" y="396.78" rx="0" ry="0" width="345" height="142" /> -->
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
