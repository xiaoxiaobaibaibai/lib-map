<template>
  <div>
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
            <span class="moreUl-name" v-html="item.matchField.name ?  item.matchField.name.highlight : item.companyName"></span>
            <span class="moreUl-type" :class="{'type-address': item.matchedSource == '地址匹配'}">{{item.matchedSource.slice(0,2)}}</span>
            <span class="moreUl-address" :title="item.address">{{item.address}}</span>
          </li>
          <li v-if="empty" class="empty">未找到相关地点，请输入精确名称再次搜索</li>
        </ul>
      </div>
      <span class="search-btn">
      <a-icon type="search" :style="{color: '#fff'}"></a-icon>
      </span>
    </div>

  </div>

</template>

<script>
import tip from "@/components/lib-map/tip";
import { mapState, mapMutations } from "vuex"

export default {
  name: "searchWrap",
  data() {
    return {
      inputValue: '',
      moreUlVisible: false,
      moreUlData: [],
      moreUlSelect: -1,
      moreUlSelectNum: 10,
      moreUlSelectText: '请输入公司名称或地址展示周围企业',
      empty: false
    }
  },
  components: {
    tip
  },

  methods: {
    ...mapMutations([
      'setKeyword'
    ]),
    searchClick() {},
    searchInput() {
      const url = '/standardgwapi/api/company_library/map/suggest'
      const data = {
        keyword: this.inputValue
      }
      this.setKeyword(this.inputValue)
      this.$getAxios(url, data, res => this.handleSuggest(res))
    },
    inputFocus() {
      this.moreUlVisible = true
    },
    searchKey(e) {

      console.log(e)
      const keyCode = e.code
      if (keyCode === 'ArrowDown') {
        if (this.moreUlSelect == -1 || this.moreUlSelect == this.moreUlSelectNum) {
          this.moreUlSelect = 0
          this.inputValue = this.moreUlData[0].companyName
        }else {
          this.moreUlSelect ++
          this.inputValue = this.moreUlData[this.moreUlSelect].companyName
        }
      }else if(keyCode === 'ArrowUp'){
       if (this.moreUlSelect == -1 || this.moreUlSelect == 0) {
           this.moreUlSelect = this.moreUlSelectNum
         this.inputValue = this.moreUlData[this.moreUlSelect].companyName

       }
        else {
          this.moreUlSelect--
         this.inputValue = this.moreUlData[this.moreUlSelect].companyName

       }
      }else if(keyCode === 'Enter') {
        this.handleEnter()
      }
     },
    inputBlur() {
      this.moreUlVisible = false
    },
    handleSuggest(res) {
      if(res.code == 1) {
        this.moreUlData = res.data
      }
    },
    handleEnter() {
      this.moreUlVisible = false
      this.$emit('focus',this.inputValue)
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
    ...mapState([
      'keyword',
    ]),
    placeholderText: function () {
      return this.moreUlSelectText
    }
  },
  watch: {
    inputValue: function (val) {
      this.setKeyword(val)
    },
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
    max-height: 356px;
    padding-bottom: 12px;
    margin-bottom: 0;
    li {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: 36px;
      margin-left: -12px;
      padding-left: 12px;
      cursor: pointer;
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
          height: 20px;
          font-size: 12px;
          color: #7D7D94;
          line-height: 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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
