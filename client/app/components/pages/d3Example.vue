<template>
  <svg width="500" height="300"></svg>
</template>

<script>


//https://github.com/CorpGlory/d3vue/blob/master/src/d3-components/circle-mount.vue
const d3 = require('d3');
export default {
  mounted: function() {
    // this.#el - is the root element in <template>
    // in this case it is <svg> tag
    d3.select('svg')
      .append('circle')
      .attr('cx', '250')
      .attr('cy', '150')
      .attr('r', '100')
  }
}
</script>

<style>
</style>
