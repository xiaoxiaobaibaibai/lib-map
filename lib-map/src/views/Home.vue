<template>
  <div class="home">
    <a-button @click="handleClick">企业地图</a-button>
    <a-button @click="handleClickCity">城市列表</a-button>
    <a-button @click="handleClickSearch">城市搜索</a-button>
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
    },
    handleClickCity() {
      this.$router.push('/city')
    },
    handleClickSearch() {
      this.$router.push('/search')
    }
  }
}
</script>
<style lang="less">
.home {
  background-color: darkgrey;

  padding-top: 300px;
}
</style>
