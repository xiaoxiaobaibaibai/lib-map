<template>
  <div class="fix-body">
    <div class="city-menu">
      <a-button-group>
        <a-button @click="handleClick" class="caret">
          {{currentCity}}
          <a-icon type="caret-down" v-if="caret" />
          <a-icon type="caret-up" v-if="!caret" />

        </a-button>
        <a-button class="environment">
          <a-icon type="environment" />
          标记查找
        </a-button>
      </a-button-group>
    </div>
    <div class="city" v-if="cityVisible">
      <div class="title">
        <span class="title-name">当前城市：</span>
        <span class="title-city">杭州</span>
        <div class="city-search">
          <search-input></search-input>
        </div>
      </div>
      <div class="city-hot-list">
        <section class="city-name">
          <span v-for="item in hotList">{{item.name}}</span>
        </section>
        <section class="city-initials">
          <span v-for="(item,index) in initials" :class="{active: activeInitials == index}" @click="handleInitialsClick(index)">{{item.name}}</span>
        </section>
      </div>
      <div class="city-list" @scroll="onScroll" ref="cityList">
        <section v-for="item in city" class="city-item">
          <span class="city-list-initials">{{item.initials}}</span>
          <div class="city-list-content">
            <div v-for="el in item.content" class="city-list-item">
              <section class="sec-province">
                <span>{{el.province}}</span>
              </section>
              <section class="sec-city">
                <span v-for="city in el.city">{{city}}</span>
              </section>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>

</template>

<script>
import searchInput from "@/components/search/searchInput";
import { city } from "@/assets/city";

export default {
  name: "cityList",
  data() {
    return {
      hotList: [
        {
          name: '全国',
          url: ''
        },
        {
          name: '北京',
          url: ''
        },
        {
          name: '上海',
          url: ''
        },
        {
          name: '广州',
          url: ''
        },
        {
          name: '深圳',
          url: ''
        },
        {
          name: '成都',
          url: ''
        },
        {
          name: '天津',
          url: ''
        },
        {
          name: '南京',
          url: ''
        },
        {
          name: '杭州',
          url: ''
        },
        {
          name: '武汉',
          url: ''
        },
        {
          name: '重庆',
          url: ''
        },
      ],
      initials: [
        {
          name: 'A',
          url: ''
        },
        {
          name: 'F',
          url: ''
        },
        {
          name: 'G',
          url: ''
        },
        {
          name: 'H',
          url: ''
        },
        {
          name: 'J',
          url: ''
        },
        {
          name: 'L',
          url: ''
        },
        {
          name: 'N',
          url: ''
        },
        {
          name: 'Q',
          url: ''
        },
        {
          name: 'S',
          url: ''
        },
        {
          name: 'T',
          url: ''
        },
        {
          name: 'X',
          url: ''
        },
        {
          name: 'Y',
          url: ''
        },
        {
          name: 'Z',
          url: ''
        },
        {
          name: '其他',
          url: ''
        },
      ],
      city: city,
      activeInitials: 0,
      cityVisible: false,
      currentCity: '杭州',
      caret: true
    }
  },
  components: {
    searchInput
  },
  methods: {
    onScroll(e) {
      // 获取所有锚点元素
      const navContents = document.querySelectorAll('.city-item')
      // 所有锚点元素的 offsetTop
      const offsetTopArr = []
      navContents.forEach(item => {
        offsetTopArr.push(item.offsetTop)
      })
      // 获取当前文档流的 scrollTop
      const scrollTop =e.target.offsetTop + e.target.scrollTop

      // 定义当前点亮的导航下标
      let navIndex = 0
      for (let n = 0; n < offsetTopArr.length; n++) {
        // 如果 scrollTop 大于等于第 n 个元素的 offsetTop 则说明 n-1 的内容已经完全不可见
        // 那么此时导航索引就应该是 n 了
        if (scrollTop >= offsetTopArr[n]) {
          navIndex = n
        }
      }
      console.log('navIndex',navIndex, e, offsetTopArr)
      this.activeInitials = navIndex
    },
    handleInitialsClick(index) {
      debugger
      // 获取目标的 offsetTop
      // css选择器是从 1 开始计数，我们是从 0 开始，所以要 +1
      document.querySelector(`.city-item:nth-child(${index + 1})`).scrollIntoView({
        behavior: "smooth", block: "start", inline: "nearest"
      })
    },
    handleClick() {
      this.caret = !this.caret
      this.cityVisible = !this.cityVisible
    }
  }
}
</script>

<style scoped lang="less">
.fix-body {
  position: fixed;
  top: 60px;
  left: 484px;
  z-index: 1;
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

.city-menu {
  .caret {
    width: 68px;
  }
  .environment {
    width: 100px;
  }
}

.city {
  width: 400px;
  height: 400px;
  background: #FFFFFF;
  border: 1px solid #CBCBE1;
  box-shadow: 0 4px 12px 0 rgba(10,39,86,0.15);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  font-family:  MicrosoftYaHei;
  .title {
    width: 100%;
    height: 46px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ECECF7;
    title > span {
      font-size: 14px;
      color: #474762;
      line-height: 22px;
    }
    .title-name {
      margin-left: 16px;
    }
    .title-city {
      font-weight: bold;
    }
    .city-search {
      margin-left: auto;
      margin-right: 16px;
    }

  }
  .city-hot-list {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-left: 8px;
    padding-right: 16px;
    margin-right: 12px;
    .city-name {
      font-family: MicrosoftYaHei;
      margin: 12px 0;
      display: flex;
      flex-wrap: wrap;
      span {
        width: 28px;
        height: 22px;
        font-size: 14px;
        color: #1B63D9;
        line-height: 22px;
        margin-left: 8px;
        margin-right: 8px;
        cursor: pointer;
        &:hover {
          color: #3C79DE;
        }
      }
    }
    .city-initials {
      font-family: MicrosoftYaHei;
      padding-bottom: 7px;
      display: flex;
      flex-wrap: wrap;
      border-bottom: 1px solid #ECECF7;
      span {
        height: 22px;
        font-size: 14px;
        color: #7D7D94;
        line-height: 22px;
        margin-left: 8px;
        margin-right: 8px;
        cursor: pointer;
        &:hover {
          color: #272841;
        }
        &.active {
          color: #272841;
        }
      }
    }
  }
  .city-list {
    display: flex;
    height: 242px;
    flex-direction: column;
    padding-left: 16px;
    margin-right: 12px;
    margin-bottom: 12px;
    overflow-x: hidden;
    overflow-y: auto;
    .city-item {
      display: flex;
      margin-top: 13px;
      span.city-list-initials {
        font-family: MicrosoftYaHei;
        font-weight: Bold;
        width: 20px;
        font-size: 26px;
        color: #CCCCCC;
        line-height: 22px;
      }
      .city-list-content {
        display: flex;
        flex-direction: column;
        width: 338px;
        margin-left: 15px;
        .city-list-item {
          display: flex;
          .sec-province {
            font-family: MicrosoftYaHei;
            font-size: 14px;
            color: #272841;
            line-height: 22px;
          }
          .sec-city {
            width: 280px;
            display: flex;
            flex-wrap: wrap;
            margin-left: auto;
            span {
              margin-right: 16px;
              font-family: MicrosoftYaHei;
              font-size: 14px;
              color: #474762;
              line-height: 22px;
              cursor: pointer;
              &:hover {
                color: #1B63D9;
              }
            }
          }
        }
      }
    }
  }
}

</style>
