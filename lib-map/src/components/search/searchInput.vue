<template>
<div class="search-input">
  <section>
    <a-icon type="search" :style="{color: '#757699'}"></a-icon>
    <a-input
      type="text"
      maxlength="150"
      v-model="inputValue"
      @click.stop="searchClick"
      @input="searchInput"
      @focus="inputFocus"
      :placeholder="placeholderText"
      @keyup="searchKey"
      allow-clear
      :class="{focus: moreUlVisible}"
    />
  </section>
  <ul class="moreUl" v-if="moreUlVisible">
    <li v-for="(item,index) in moreUlData" :class="{'active': index == moreUlSelect}">
      <span class="moreUl-name" v-html="item.name"></span>
      <span class="moreUl-address">{{item.address}}</span>
    </li>
  </ul>

</div>
</template>

<script>
export default {
  name: "searchInput",
  data() {
    return {
      inputValue: '',
      placeholderText: '请输入城市或者省份',
      moreUlVisible: false,
      moreUlData: [
        {
          name: `<em class="hl">安</em>徽省`,
          title: '安徽省',
          address: ''
        },
        {
          name: `<em class="hl">安</em>吉县`,
          title: '安吉县',
          address: '浙江省湖州市'
        },
        {
          name: `<em class="hl">安</em>顺市`,
          title: '安顺市',
          address: '贵州省安顺市'
        },
        {
          name: `<em class="hl">安</em>全县`,
          title: '安全县',
          address: '贵州省安顺市'
        },
        {
          name: `<em class="hl">安</em>昌县`,
          title: '安昌县',
          address: '浙江省湖州市'
        },
        {
          name: `<em class="hl">安</em>昌县`,
          title: '安昌县',
          address: '浙江省湖州市'
        },
        {
          name: `<em class="hl">安</em>昌县`,
          title: '安昌县',
          address: '浙江省湖州市'
        },
        {
          name: `<em class="hl">安</em>昌县`,
          title: '安昌县',
          address: '浙江省湖州市'
        },
        {
          name: `<em class="hl">安</em>昌县`,
          title: '安昌县',
          address: '浙江省湖州市'
        },
        {
          name: `<em class="hl">安</em>昌县`,
          title: '安昌县',
          address: '浙江省湖州市'
        },
        {
          name: `<em class="hl">安</em>昌县`,
          title: '安昌县',
          address: '浙江省湖州市'
        },
      ],
      moreUlSelect: 0
    }
  },
  methods: {
    searchClick() {},
    searchInput() {},
    inputFocus() {},
    searchKey() {}
  }
}
</script>

<style scoped lang="less">
.search-input {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 180px;
  background: #FFFFFF;
  border: 1px solid #CBCBE1;
  border-radius: 12px;
  padding-left: 12px;
  section {
    display: flex;
  }
}
</style>
