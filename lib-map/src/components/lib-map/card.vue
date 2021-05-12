<template>
<div class="card">
  <section class="title">
    <p>
      <span class="flex_1">[中心点]</span>
      <span class="flex_2">存续</span>
      浙江核心同花顺网络信息股份有限公司
    </p>
<!--    <span class="close">-->
<!--      <a-icon type="close"></a-icon>-->
<!--    </span>-->
  </section>
  <section>
    <p class="desc">
      <span class="desc-title">范围</span>
      <span class="desc-info">3km</span>
      <span class="desc-title desc_2">企业数量</span>
      <span class="desc-info">123家</span>
    </p>
    <p class="desc">
      <span class="desc-title">地址</span>
      <span class="desc-info">浙江省杭州市余杭区五常街道同顺街18号</span>
    </p>
  </section>
  <div class="triangle-bottom"></div>
</div>
</template>

<script>
export default {
  name: "card"
}
</script>

<style scoped lang="less">
.card {
  //position: relative;
  //margin-top: 100px;
  //margin-left: 40%;
  //background: #FFFFFF;
  ////border: 1px solid #ECECF7;
  //border-radius: 2px;
  //box-shadow: 0 4px 12px 0 rgba(10,39,86,0.15);
  //display: flex;
  //flex-direction: column;
  //height: 100px;
  //width: 226px;
  section.title {
    margin-left: 12px;
    display: flex;
    p {
      font-weight: bold;
      font-family: MicrosoftYaHei-Bold;
      font-size: 12px;
      color: #1B63D9;
      line-height: 20px;
      text-align: left;
      width: 240px;
      margin-bottom: 0;
      .flex_1 {
        font-family: Lucida Grande;
        font-size: 12px;
        color: #474762;
        line-height: 20px;
        font-weight: normal;
      }
      .flex_2 {
        margin-left: 2px;
        padding: 0 4px;
        font-family: Microsoft YaHei;
        font-size: 12px;
        color: #0095C2;
        text-align: center;
        line-height: 14px;
        background: #E5F4F8;
        border-radius: 2px;
        font-weight: normal;
      }
    }
    span.close {
      width: 24px;
      height: 24px;
      background:  #ECECF7;
      //background: url();
      border-radius: 0 3px 0 100px;
    }
  }
  .triangle-bottom {
    position: absolute;
    top: 100px;
    left: 107px;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #fff;
  }
  p.desc {
    margin: 0;
    text-align: left;
    padding-left: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .desc-title {
      font-family: Microsoft YaHei;
      font-size: 12px;
      color: #7D7D94;
      line-height: 20px;
    }
    .desc-info {
      margin-left: 4px;
      font-family: Microsoft YaHei;
      font-size: 12px;
      color: #272841;
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .desc_2 {
      margin-left: 16px;
    }
  }
}

</style>
