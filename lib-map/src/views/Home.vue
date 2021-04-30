<template>
  <div class="home">
    <a-button @click="handleClick('/map')">企业地图</a-button>
    <a-button @click="handleClick('/city')">城市列表</a-button>
    <a-button @click="handleClick('/search')">城市搜索</a-button>
    <a-button @click="handleClick('/drawer')">筛选数据</a-button>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  components: {
  },
  methods: {
    handleClick (path) {
      this.$router.push(path)
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
