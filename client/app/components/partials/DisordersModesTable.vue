<template>
  <div>
    <v-data-table
    :headers="headers"
    :items="desserts"
    v-model="selected"
    item-key="name"
    select-all
    hide-actions
    class="elevation-1"
    style="border-bottom:0px"
  >
    <!-- <template slot="headerCell" slot-scope="props">
        <span >
          {{ props.header.text }}
        </span>
    </template> -->
    <template slot="items" slot-scope="props">
      <tr>
      <td style="padding:2px; width:5px">
        <v-checkbox
          v-model="props.selected"
          primary
          hide-details
        ></v-checkbox>
      </td>
      <td class="text-xs-left" style="font-size:14px; padding:2px;">{{ props.item.name }}</td>
      <td class="text-xs-left">{{ props.item.calories }}</td>
    </tr>
    </template>
  </v-data-table>
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
      alertType:{
        type: String
      },
      alertTransition: {
        type: String
      },
      alertText: {
        type: String
      }
    },
    data () {
  return {
    search: '',
    selected: [],
    headers: [
      {
        text: 'Dessert (100g serving)',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'Calories', value: 'calories' },
    ],
    desserts: [
      {
        value: false,
        name: 'Mandibulofacial dysostosis, Treacher Collins type, autosomal recessive',
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0,
        iron: '1%'
      },
      {
        value: false,
        name: 'Nager syndrome',
        calories: 237,
        fat: 9.0,
        carbs: 37,
        protein: 4.3,
        iron: '1%'
      },
      {
        value: false,
        name: 'Treacher Collins syndrome	',
        calories: 262,
        fat: 16.0,
        carbs: 23,
        protein: 6.0,
        iron: '7%'
      },
      {
        value: false,
        name: 'Treacher Collins syndrome 1	',
        calories: 305,
        fat: 3.7,
        carbs: 67,
        protein: 4.3,
        iron: '8%'
      },
    ]
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

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Open+Sans');

.v-table tbody tr:not(:last-child){
  border-bottom: 0px;
}

</style>
