<template>
  <div>
    {{panelsDefinitionValues[0]}} -- {{panelsDefinitionValues[1]}}
      <div id="EditCard" style="width:  400px; margin-left:50px">
      <v-layout row>
      <v-flex class="px-3">
        <v-range-slider
          v-model="panelsDefinitionValues"
          :max="100"
          :min="0"
          :step="1"
          thumb-label="always"
          track-color="green"
          color="yellow"
          thumb-color="blue"
        ></v-range-slider>
      </v-flex>
      </v-layout>
      </div>

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

    },
    data(){
      return {
        panelsDefinitionValues: [20,45]
      }
    },
    mounted(){
      $( `<div class='v-slider__track orange' id="generalSlider" style='left: ${this.panelsDefinitionValues[1]}%; right: auto;'></div>` ).insertAfter( ".v-slider__track-fill " );
      console.log($('.v-input__slot').parents('#EditCard'))
      if($('.v-input__slot').parents('#EditCard').length===1){
        // $('.v-input__slot').parents('#EditCard').attr('id', 'abcd');
        console.log('$("#EditCard").find(".v-input__slot")', $("#EditCard").find(".v-input__slot"))
        $("#EditCard").find(".v-input__slot").attr('id', 'abcd');
        // $('#EditCard').parents('#EditCard').attr('id', 'abcd');
        $( `<div class="orange" style='margin-left:-20px; right: auto; width:50px; height:10px; background:orange; display:inline; border-top-right-radius:5px; border-bottom-right-radius:5px'></div>` ).appendTo( "#abcd" );

      }
      // $( `<div class="orange" style='margin-left:-20px; right: auto; width:50px; height:10px; background:orange; display:inline; border-top-right-radius:5px; border-bottom-right-radius:5px'></div>` ).appendTo( ".v-input__slot " );
      // $( `<div class="orange" style='margin-left:-20px; right: auto; width:50px; height:10px; background:orange; display:inline; border-top-right-radius:5px; border-bottom-right-radius:5px'></div>` ).appendTo( ".v-input__slot " );

    },
    updated(){

    },
    watch: {
      panelsDefinitionValues: function(){
        var leftWidth = 100 - this.panelsDefinitionValues[1];
        $('#generalSlider').css('left', `${this.panelsDefinitionValues[1]}%`)
      },

    },
    methods:{

    }
  }


</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Open+Sans');

</style>
