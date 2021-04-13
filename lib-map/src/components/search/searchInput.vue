<template>
<div class="search-input" ref="searchInput">
  <section>
    <a-icon type="search" :style="{color: '#757699'}"></a-icon>
    <a-input
      type="text"
      maxlength="140"
      v-model="inputValue"
      @click.stop="searchClick"
      @input="searchInput"
      @focus="inputFocus"
      :placeholder="placeholderText"
      @keyup="searchKey"
      :size="'small'"
      allow-clear
      :class="{focus: moreUlVisible}"
    />
  </section>
  <ul class="moreUl" v-if="moreUlVisible">
    <li v-for="(item,index) in moreUlData" :class="{'active': index == moreUlSelect}">
      <span class="moreUl-name" v-html="item.matchWord"></span>
      <span class="moreUl-address">{{item.belongArea}}</span>
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
      moreUlSelectText: '请输入城市或者省份',
      moreUlVisible: false,
      moreUlData: [
        {
          belongArea: "吉林省吉林市",
          matchWord: "<em class='hl'>吉林</em>市"
        },
        {
          belongArea: "",
          matchWord: "<em class='hl'>吉林</em>省"
        },        {
          belongArea: "",
          matchWord: "<em class='hl'>吉林</em>省"
        },        {
          belongArea: "",
          matchWord: "<em class='hl'>吉林</em>省"
        },        {
          belongArea: "",
          matchWord: "<em class='hl'>吉林</em>省"
        },        {
          belongArea: "",
          matchWord: "<em class='hl'>吉林</em>省"
        },        {
          belongArea: "",
          matchWord: "<em class='hl'>吉林</em>省"
        },        {
          belongArea: "",
          matchWord: "<em class='hl'>吉林</em>省"
        },        {
          belongArea: "",
          matchWord: "<em class='hl'>吉林</em>省"
        },        {
          belongArea: "",
          matchWord: "<em class='hl'>吉林</em>省"
        },        {
          belongArea: "",
          matchWord: "<em class='hl'>吉林</em>省"
        },        {
          belongArea: "",
          matchWord: "<em class='hl'>吉林</em>省"
        },        {
          belongArea: "",
          matchWord: "<em class='hl'>吉林</em>省"
        },
      ],
      moreUlSelect: 0
    }
  },
  methods: {
    searchClick() {},
    searchInput() {},
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
          this.moreUlSelectText = this.moreUlData[0].belongArea
        }else {
          this.moreUlSelect ++
          this.moreUlSelectText = this.moreUlData[this.moreUlSelect].belongArea
        }
      }else if(keyCode === 'ArrowUp'){
        if (this.moreUlSelect == -1 || this.moreUlSelect == 0) {
          this.moreUlSelect = this.moreUlSelectNum
          this.moreUlSelectText = this.moreUlData[this.moreUlSelect].belongArea

        }
        else {
          this.moreUlSelect--
          this.moreUlSelectText = this.moreUlData[this.moreUlSelect].belongArea

        }
      }
    },
    inputBlur() {
      this.moreUlVisible = false
    }
  },
  mounted() {
    document.addEventListener('click',(e) => {
      if(this.$refs.searchInput) {
        let isSelf = this.$refs.searchInput.contains(e.target)
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

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  display: none;
}
/* 滚动条角落 */
::-webkit-scrollbar-thumb {      /*滚动条的轨道*/
  background-color: #B7B7C7;
  border-radius: 4px;
  &:hover {
    background-color:#9293AA
  }
}

.search-input {
  position: absolute;
  top: -10px;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 180px;
  height: auto;
  background: #FFFFFF;
  border: 1px solid #CBCBE1;
  border-radius: 12px;
  padding-left: 12px;
  section {
    display: flex;
    height: 24px;
    align-items: center;
    /deep/ .ant-input-affix-wrapper {
      width: 85%;
    }
    /deep/ .ant-input-affix-wrapper .ant-input:not(:last-child) {
      padding-right: 0;
    }
  }
  ul {
    list-style-type: none;
    padding: 0 0;
    width: 100%;
    max-height: 220px;
    overflow-x: hidden;
    overflow-y: auto;
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
          width: 64px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        &.moreUl-address {
          font-family: MicrosoftYaHei;
          margin-left: 12px;
          width: 72px;
          font-size: 12px;
          color: #7D7D94;
          line-height: 20px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        /deep/ em.hl {
          color: #ED2D00;
          font-style: normal;
        }
      }
    }

  }
}
</style>
