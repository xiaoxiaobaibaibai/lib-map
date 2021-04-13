<template>
<div class="tip">
  <div class="tip-triangle-top">
  </div>
  <p>在杭州市为您查找到123456家企业数据，<span class="operate">浏览全国</span><a-icon type="close"></a-icon></p>
</div>
</template>

<script>
export default {
  name: "tip"
}
</script>

<style scoped lang="less">
.tip {
  display: flex;
  position: relative;
  margin-left: 20px;
  margin-top: 20px;
  width: 370px;
  height: 40px;
  background: #fff;
  padding-left: 12px;
  border-radius: 5px;
  align-items: center;
  p {
    margin: 0;
    width: 100%;
    font-family: Microsoft YaHei;
    font-size: 14px;
    color: #474762;
    line-height: 22px;
    text-align: left;
    span.operate {
      color: #1B63D9;
      cursor: pointer;
      padding-right: 8px;
      margin-right: 8px;
      border-right: 1px solid #ECECF7;
    }

  }
  .tip-triangle-top {
    position: absolute;
    top: -5px;
    left: 12px;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid #fff;
  }
}
</style>
