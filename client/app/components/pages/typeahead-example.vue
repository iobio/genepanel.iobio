<template>
  <section>

    <label for="input">States of America:</label>
    <input id="input" class="form-control" type="text" placeholder="Type to search...">
    <typeahead v-model="search" target="#input" :data="states" item-key="name"/>
    <br/>
  </section>
</template>
<script>
  import conditions from '../../../data/conditions.json';
  import states from '../../../data/states.json';

  import { Typeahead } from 'uiv';


  export default {
    components: {
      Typeahead
    },
    data () {
      return {
        search: '',
        conditions: conditions.data,
        states: states.data

      }
    },
    created(){
      console.log("satates", conditions)
      console.log("states", states)
    }
  }
</script>
