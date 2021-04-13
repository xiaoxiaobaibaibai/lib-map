<template>
<div class="drawer">
  <section class="title">
    <span class="center">[中心点]</span>
    <span class="center-text">浙江核新同花顺网络信息有限公司</span>
    <span class="info-title">范围</span>
    <span class="info-content">3km</span>
    <span class="info-title">企业数量</span>
    <span class="info-content">124家</span>
  </section>
  <section class="filter">
    <div class="filter-title">
      <span>条件筛选</span>
    </div>
    <div class="filter-select">
      <section>
        <span class="filter-select-title">已选范围</span>
      </section>
      <section>
        <span class="filter-select-info" v-for="item in select">{{item.name}}<a-icon type="close" /></span>
        <span class="filter-select-operate">清空条件</span>
      </section>
    </div>
  </section>
  <section class="select">
    <div class="select-content" :style="styleObject">
      <a-select :size="'small'" style="width: 96px">
        <a-select-option v-for="item in selectOption" :key="item.value" :value="item.value">{{item.name}}</a-select-option>
      </a-select>
      <a-select :size="'small'" style="width: 96px">
        <a-select-option v-for="item in selectOption" :key="item.value" :value="item.value">{{item.name}}</a-select-option>
      </a-select>
      <a-select :size="'small'" style="width: 96px">
        <a-select-option v-for="item in selectOption" :key="item.value" :value="item.value">{{item.name}}</a-select-option>
      </a-select>
      <a-select :size="'small'" style="width: 96px">
        <a-select-option v-for="item in selectOption" :key="item.value" :value="item.value">{{item.name}}</a-select-option>
      </a-select>
      <a-select :size="'small'" style="width: 96px">
        <a-select-option v-for="item in selectOption" :key="item.value" :value="item.value">{{item.name}}</a-select-option>
      </a-select>
      <a-select :size="'small'" style="width: 96px">
        <a-select-option v-for="item in selectOption" :key="item.value" :value="item.value">{{item.name}}</a-select-option>
      </a-select>
      <a-select :size="'small'" style="width: 96px">
        <a-select-option v-for="item in selectOption" :key="item.value" :value="item.value">{{item.name}}</a-select-option>
      </a-select>
    </div>
    <span @click="handleSelectOperate" class="select-operate">
      更多筛选
    </span>
  </section>
</div>
</template>

<script>
export default {
  name: "drawer",
  data() {
    return {
      select: [
        {
        name: '电力、热力生产和供应业'
      },{
        name: '有限责任公司'
      },{
        name: '成立1-3年'
      }],
      selectOption: [
        {
          name: '在噶不过份额',
          value: '1'
        },{
          name: '在噶不过份额',
          value: '2'
        },{
          name: '在噶不过份额',
          value: '3'

        },{
          name: '在噶不过份额',
          value: '4'
        },{
          name: '在噶不过份额',
          value: '5'
        },{
          name: '在噶不过份额',
          value: '6'
        },
      ],
      optionSelected: null,
      selectContentHigh: '24px',
    }
  },
  computed: {
    styleObject: function () {
      return {
        high: this.selectContentHigh
      }
    }
   },
  methods: {
    handleSelectOperate() {
      this.selectContentHigh = 'auto'
    }
  }
}
</script>

<style scoped lang="less">
.drawer {
  margin-left: auto;
  width: 732px;
  height: 100%;
  background: #fff;
  section.title {
    display: flex;
    align-items: center;
    height: 48px;
    margin-left: 16px;
    border-bottom: 1px solid #ECECF7;
    span {
      &.center {
        font-family: Lucida Grande;
        font-size: 14px;
        color: #474762;
        line-height: 22px;
      }
      &.center-text {
        margin-left: 8px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        font-size: 16px;
        color: #272841;
        line-height: 24px;
      }
      &.info-title {
        margin-left: 12px;
        font-family: Microsoft YaHei;
        font-size: 12px;
        color: #7D7D94;
        line-height: 20px;
      }
      &.info-content {
        font-family: Microsoft YaHei;
        font-size: 12px;
        color: #272841;
        line-height: 20px;
      }
    }
  }
  section.filter {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #ECECF7;
    height: 68px;
    margin-left: 16px;
    .filter-title {
      height: 38px;
      display: flex;
      align-items: center;
      span {
        display: flex;
        font-family: Microsoft YaHei;
        margin-right: auto;
        font-weight: bold;
        font-size: 14px;
        color: #474762;
        line-height: 22px;
      }
    }
    .filter-select {
      display: flex;
      align-items: center;
      span {
        &.filter-select-title {
          font-family: MicrosoftY aHei;
          font-size: 14px;
          color: #272841;
          line-height: 22px;
        }
        &.filter-select-info {
          background: #E8EFFB;
          padding: 0 8px;
          border-radius: 2px;
          margin-left: 8px;
          font-family: 'Microsoft YaHei';
          font-size: 14px;
          color: #1B63D9;
          text-align: center;
          line-height: 22px;
          i {
            margin-left: 8px;
          }
        }
        &.filter-select-operate {
          font-family: Microsoft YaHei;
          font-size: 12px;
          margin-left: 16px;
          color: #1B63D9;
          line-height: 22px;
        }
      }
    }
  }
  section.select {
    height: auto;
    display: flex;
    margin-left: 16px;
    flex-direction: column;
    .select-content {

    }
    div.ant-select {
      margin-right: 5px;
    }
  }
}
</style>
