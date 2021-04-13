<template>
  <div class="fix-body">
    <div class="search-input" ref="moreUl" :class="{'more': this.moreUlVisible}">
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
      <ul class="moreUl" v-if="moreUlVisible">
        <li v-for="(item,index) in moreUlData" :class="{'active': index == moreUlSelect}">
          <span class="moreUl-name" v-html="item.name"></span>
          <span class="moreUl-type" :class="{'type-address': item.type == '地址'}">{{item.type}}</span>
          <span class="moreUl-address">{{item.address}}</span>
        </li>
        <li v-if="empty" class="empty">未找到相关地点，请输入精确名称再次搜索</li>
      </ul>
    </div>
    <span class="search-btn">
    <a-icon type="search" :style="{color: '#fff'}"></a-icon>
  </span>
  </div>

</template>

<script>
export default {
  name: "searchWrap",
  data() {
    return {
      inputValue: '',
      moreUlVisible: false,
      moreUlData: [
      {
        name: `<em class="hl">浙江</em>园林设计院南部宏达分院股份有限公司`,
        title: '浙江核新同花顺网络信息股份有限公司',
        type: '企业',
        address: '杭州余杭区',
        point: {
          lng: 'yy',
          lat: 'xx'
        }
      },
        {
          name: `<em class="hl">杭州</em>园林设计院南部宏达分院股份有限公司`,
          title: '杭州园林设计院南部宏达分院股份有限公司',
          type: '企业',
          address: '杭州余杭区'
        },
        {
          name: `<em class="hl">杭州</em>园林设计院南部宏达分院股份有限公司`,
          title: '小米科技有限责任公司',
          type: '地址',
          address: '杭州余杭区'
        },
        {
          name: `<em class="hl">杭州</em>园林设计院南部宏达分院股份有限公司`,
          title: '中国农业银行股份有限公司',
          type: '企业',
          address: '杭州余杭区'
        },
        {
          name: `<em class="hl">杭州</em>园林设计院南部宏有限公司`,
          title: '杭州园林设计院南部宏达分院股份有限公司',
          type: '地址',
          address: '杭州余杭区'
        },
        {
          name: `<em class="hl">武汉</em>园林设计院南部宏达分院股份有限公司`,
          title: '武汉园林设计院南部宏达分院股份有限公司',
          type: '企业',
          address: '杭州余杭区'
        },        {
          name: `<em class="hl">杭州</em>园林设计院南部宏达分院股份有限公司`,
          title: '杭州园林设计院南部宏达分院股份有限公司',
          type: '企业',
          address: '杭州余杭区'
        },        {
          name: `<em class="hl">杭州</em>园林设计院南部宏达分院股份有限公司`,
          title: '闽侯启初商务咨询合伙企业(有限合伙)',
          type: '企业',
          address: '杭州余杭区'
        },
      ],
      moreUlSelect: -1,
      moreUlSelectNum: 7,
      moreUlSelectText: '请输入公司名称或地址展示周围企业',
      empty: false
    }
  },
  methods: {
    searchClick() {},
    searchInput() {
      const url = ''
      const data = {
        keyword: this.inputValue
      }
      this.$getAxios(url, data, res => this.handleSuggest(res))
    },
    inputFocus() {
      this.moreUlVisible = true
    },
    searchKey(e) {
      debugger
      console.log(e)
      const keyCode = e.code
      if (keyCode === 'ArrowDown') {
        if (this.moreUlSelect == -1 || this.moreUlSelect == this.moreUlSelectNum) {
          this.moreUlSelect = 0
          this.moreUlSelectText = this.moreUlData[0].title
        }else {
          this.moreUlSelect ++
          this.moreUlSelectText = this.moreUlData[this.moreUlSelect].title
        }
      }else if(keyCode === 'ArrowUp'){
       if (this.moreUlSelect == -1 || this.moreUlSelect == 0) {
           this.moreUlSelect = this.moreUlSelectNum
         this.moreUlSelectText = this.moreUlData[this.moreUlSelect].title

       }
        else {
          this.moreUlSelect--
         this.moreUlSelectText = this.moreUlData[this.moreUlSelect].title

       }
      }else if(keyCode === 'Enter') {
        this.$emit('focus')
      }
     },
    inputBlur() {
      this.moreUlVisible = false
    },
    handleSuggest(res) {
      if(res.code == 1) {
        this.moreUlData = res.data
      }
    }
  },
  mounted() {
    document.addEventListener('click',(e) => {
      if(this.$refs.moreUl) {
        let isSelf = this.$refs.moreUl.contains(e.target)
        if(!isSelf) {
          this.moreUlVisible = false
        }
      }
    })
  },
  computed: {
    placeholderText: function () {
      return  this.moreUlSelectText
    }
  }
}
</script>

<style scoped lang="less">

.fix-body {
  position: fixed;
  display: flex;
  z-index: 6;
  justify-content: center;
  top: 60px;
  left: 20px;

}
.search-input {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 376px;
  padding-left: 12px;
  background: #FFFFFF;
  border: 1px solid #ECECF7;
  border-radius: 18px 0 0 18px;
  box-shadow: 0 4px 12px 0 rgba(10,39,86,0.15);
  ul {
    list-style-type: none;
    padding: 0 0;
    width: 100%;
    max-height: 320px;
    li {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: 36px;
      margin-left: -12px;
      padding-left: 12px;
      &:hover,&.active {
        background: #F7F7FC;
      }
      span {
        font-family: MicrosoftYaHei;
        font-size: 14px;
        line-height: 22px;
        &.moreUl-name {
          margin-left: 4px;
          text-align: left;
          color: #272841;
          width: 210px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        &.moreUl-type {
          margin-left: 22px;
          height: 20px;
          width: 32px;
          font-size: 12px;
          color: #ED2D00;
          text-align: center;
          line-height: 20px;
          background: #FDEAE5;
          border-radius: 2px;
          &.type-address {
            background: #E8EFFB;
            color: #1B63D9;
          }
        }
        &.moreUl-address {
          font-family: MicrosoftYaHei;
          margin-left: 12px;
          width: 72px;
          font-size: 12px;
          color: #7D7D94;
          line-height: 20px;
        }

        /deep/ em.hl {
          color: #ED2D00;
          font-style: normal;
        }
      }
      &.empty {
        font-family: Microsoft YaHei;
        font-size: 14px;
        color: #7D7D94;
        line-height: 22px;
      }
    }

  }
  &.more {
    border-radius: 18px 0 18px 18px;

  }
}
.search-btn {
  width: 64px;
  height: 36px;
  background: #1B63D9;
  border-radius: 0 100px 100px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
