<template>
  <div id="foo">
     <span id='childB'>test</span>
    {{ greeting }}
    {{ doSomething }}
    <span class="count">{{ count }}</span>
     <button @click="increment">Increment</button>
  </div>
</template>

<script>

export default {
  name: 'HomeTest',
  props: [],
  data() {
    return {
      greeting: 'hello world!',
      doSomething: 'sing a song',
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
