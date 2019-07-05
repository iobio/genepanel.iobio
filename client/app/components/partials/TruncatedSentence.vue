<template>
  <div>
    <span class="ellipsis-dots" v-on:click="toggleEllipsis">
      {{exampleSentence}}
    </span>
  </div>
</template>

<script>
import { bus } from '../../routes';
import { Typeahead, Btn } from 'uiv';
import d3 from 'd3';
import Model from '../../models/Model';

var model = new Model();

  export default {
    components: {
    },
    props: {
      exampleSentence:{
        type: String
      },
    },
    data(){
      return {
        showEllipsis:true,
      }
    },
    mounted(){

    },
    updated(){

    },
    watch: {
    },
    methods:{
      toggleEllipsis(e){
        e.target.classList.remove("ellipsis-dots")
        if(this.showEllipsis){
          e.target.classList.remove("ellipsis-dots")
          this.showEllipsis = false;
        }
        else{
          e.target.classList.add("ellipsis-dots")
          this.showEllipsis = true;
        }
      },
    }
  }

</script>

<style lang="sass">
@import url('https://fonts.googleapis.com/css?family=Open+Sans')
.ellipsis-dots
  display: block
  display: -webkit-box
  max-width: 100%
  margin: 0 auto
  line-height: 1
  -webkit-line-clamp: 2
  -webkit-box-orient: vertical
  overflow: hidden
  text-overflow: ellipsis
  height: 27px
  cursor: context-menu
</style>
