<template>
  <div class="home">
    <a-button @click="handleClick">企业地图</a-button>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  components: {
  },
  methods: {
    handleClick () {
      this.$router.push('/map')
    }
  }
}
</script>
<style lang="less">
.home {
  padding-top: 300px;
}
</style>
