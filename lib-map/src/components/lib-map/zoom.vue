<template>
  <div class="fix-body">
    <span class="zoomIn" @click="handleZoom(-1)"></span>
    <span class="zoomOut" @click="handleZoom(1)"></span>
  </div>
</template>

<script>
export default {
  name: "zoom",
  methods: {
    handleZoom(value) {
      this.$emit('handleZoom', value)
    }
  }
}
</script>

<style scoped>
.fix-body {
  position: fixed;
  top: 60px;
  left: 484px;
  z-index: 6;
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 400px;
.city-menu {
  margin-right: auto;
button.ant-btn {
  height: 36px;
.ant-btn > .anticon + span, .ant-btn > span + .anticon {
  margin-left: 4px;
}
}
}
.city {
  margin-top: 4px;
}
}
</style>
