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

<style lang="less" scoped>
.fix-body {
  position: fixed;
  bottom: 60px;
  right: 60px;
  z-index: 6;
  display: flex;
  background-color: #fff;;
  flex-direction: column;
  justify-content: center;
  width: 34px;
  height: 68px;
  //box-shadow: 0 4px 12px 0;
  span.zoomIn {
    width: 34px;
    height: 34px;
    background: url(~@/assets/map/zoomIn-normal.svg) center no-repeat;
    border-radius: 0 0 3px 3px;
    border: 1px solid #ECECF7;
    &:hover {
      background: url(~@/assets/map/zoomIn-hover.svg) center no-repeat;
    }
    &.disabled {
      background: url(~@/assets/map/zoomIn-disable.svg) center no-repeat;
    }

  }
  span.zoomOut {
    width: 34px;
    height: 34px;
    background: url(~@/assets/map/zoomOut-normal.svg) center no-repeat;
    border-radius: 3px 3px 0 0;
    border: 1px solid #ECECF7;
    &:hover {
      background: url(~@/assets/map/zoomOut-hover.svg) center no-repeat;
    }
    &.disabled {
      background: url(~@/assets/map/zoomIn-disable.svg) center no-repeat;
    }
  }
}
</style>
