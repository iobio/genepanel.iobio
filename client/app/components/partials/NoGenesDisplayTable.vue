<template>
  <!-- <div > -->
  <v-data-table
    :headers="headers"
    hide-actions
    class="elevation-1"
    :items="items"
  >
    <template slot="no-data">
      <v-alert outline :value="true" color="warning" icon="warning">
         No Genes are available
      </v-alert>
    </template>
  </v-data-table>
  <!-- </div> -->
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
    data () {
      return {
           headers: [
            { text: 'Index', sortable: false, align: 'left', value: 'indexVal' },
            {
              text: 'Name',
              align: 'left',
              sortable: false,
              value: 'name'
            },
            { text: 'Search Terms', sortable: false, align: 'left', value: 'searchTermIndexSVG' },
            { text: 'Gene Panels', align: 'left', sortable: false, value: 'htmlData' },
            {
              text: 'More',
              align: 'left',
              sortable: false,
              value: ['haploScore', 'value', 'omimSrc', 'clinGenLink', ''] },
          ],
          items:[],
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
