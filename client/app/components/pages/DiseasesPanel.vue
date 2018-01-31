<template>
  <div>
    Hello from DiseasesPanel!
    <ul>
      <li v-for="disease in DiseasePanelData">{{ disease.Title }} -- {{ disease._geneCount}} -- {{ disease._modeOfInheritance }}</li>
    </ul>
  </div>
</template>

<script>
import { bus } from '../../routes';

  export default {
    props: ['DiseasePanelData'],
    data(){
      return {

      }
    },
    methods:{

    }
  }
</script>

<style>
</style>
