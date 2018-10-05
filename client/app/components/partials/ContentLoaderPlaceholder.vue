<template>
  <div>
    <content-loader
  		:height="600"
  		:width="800"
  		:speed="2"
      primaryColor="#e7e7e7"
		  secondaryColor="#aeaeae"
  	>
    <rect x="290" y="39" rx="5" ry="5" width="361.8" height="10" />
    		<rect x="29" y="38.2" rx="0" ry="0" width="24" height="10" />
    		<rect x="67" y="38.2" rx="0" ry="0" width="66" height="10" />
    		<rect x="669" y="38.2" rx="0" ry="0" width="66" height="10" />
    		<rect x="28" y="78.2" rx="0" ry="0" width="24" height="10" />
    		<rect x="67" y="77.2" rx="0" ry="0" width="66" height="10" />
    		<rect x="66" y="239.2" rx="0" ry="0" width="66" height="10" />
    		<rect x="68" y="359.2" rx="0" ry="0" width="66" height="10" />
    		<rect x="66" y="118.2" rx="0" ry="0" width="66" height="10" />
    		<rect x="65" y="159.2" rx="0" ry="0" width="66" height="10" />
    		<rect x="66" y="199.2" rx="0" ry="0" width="66" height="10" />
    		<rect x="68" y="319.2" rx="0" ry="0" width="66" height="10" />
    		<rect x="66" y="279.2" rx="0" ry="0" width="66" height="10" />
    		<rect x="30" y="197.2" rx="0" ry="0" width="24" height="10" />
    		<rect x="30" y="236.2" rx="0" ry="0" width="24" height="10" />
    		<rect x="30" y="317.2" rx="0" ry="0" width="24" height="10" />
    		<rect x="29" y="276.2" rx="0" ry="0" width="24" height="10" />
    		<rect x="28" y="357.2" rx="0" ry="0" width="24" height="10" />
    		<rect x="27" y="118.2" rx="0" ry="0" width="24" height="10" />
    		<rect x="27" y="158.2" rx="0" ry="0" width="24" height="10" />
    		<rect x="291" y="79" rx="5" ry="5" width="361.8" height="10" />
    		<rect x="290" y="119" rx="5" ry="5" width="331.8" height="10" />
    		<rect x="289" y="159" rx="5" ry="5" width="321.8" height="10" />
    		<rect x="289" y="198" rx="5" ry="5" width="301.8" height="10" />
    		<rect x="289" y="239" rx="5" ry="5" width="301.8" height="10" />
    		<rect x="290" y="278" rx="5" ry="5" width="261.8" height="10" />
    		<rect x="291" y="320" rx="5" ry="5" width="261.8" height="10" />
    		<rect x="295" y="360" rx="5" ry="5" width="261.8" height="10" />
    		<rect x="669" y="78.2" rx="0" ry="0" width="66" height="10" />
    		<rect x="671" y="119.2" rx="0" ry="0" width="66" height="10" />
    		<rect x="669" y="159.2" rx="0" ry="0" width="66" height="10" />
    		<rect x="670" y="200.2" rx="0" ry="0" width="66" height="10" />
    		<rect x="671" y="240.2" rx="0" ry="0" width="66" height="10" />
    		<rect x="669" y="280.2" rx="0" ry="0" width="66" height="10" />
    		<rect x="669" y="320.2" rx="0" ry="0" width="66" height="10" />
    		<rect x="670" y="360.2" rx="0" ry="0" width="66" height="10" />
    		<rect x="147" y="39.39" rx="0" ry="0" width="133.98" height="10" />
    		<rect x="147" y="158.39" rx="0" ry="0" width="133.98" height="10" />
    		<rect x="146" y="199.39" rx="0" ry="0" width="133.98" height="10" />
    		<rect x="147" y="239.39" rx="0" ry="0" width="133.98" height="10" />
    		<rect x="148" y="278.39" rx="0" ry="0" width="133.98" height="10" />
    		<rect x="148" y="320.39" rx="0" ry="0" width="133.98" height="10" />
    		<rect x="150" y="360.39" rx="0" ry="0" width="133.98" height="10" />
    		<rect x="147" y="79.39" rx="0" ry="0" width="133.98" height="10" />
    		<rect x="146" y="119.39" rx="0" ry="0" width="133.98" height="10" />
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
.v-progress-circular__info
  font-size: 18px


</style>
