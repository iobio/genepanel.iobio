<template>
  <div>
    {{ greeting }}
  </div>
</template>

<script>

export default {
  name: 'HomeTest',
  props: [],
  data() {
    return {
      greeting: 'hello world!',
      count: 0
    }
  },
  methods: {
    increment () {
      this.count++
    }
  }
}
</script>
