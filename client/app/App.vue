<template>
  <div id="app">
    <router-view></router-view>
    <!-- {{ greet }}
     -->
    <!-- <iobio></iobio>-->
    <!-- <vcf></vcf> -->

  </div>
</template>

<script>


export default {

  name: 'app',
  data() {
    return {
      greet: "Hii"
    }
  }
}
</script>

<style lang="sass">
@import "./components/assets/sass/site.sass";
</style>
