<template>
  <div class="drawer-container">
    <span class="control-btn" :class="{'open': drawerVisible}" @click="handleCloseDrawer"></span>
    <div class="drawer" v-show="drawerVisible">
      <section class="title">
        <span class="center">[中心点]</span>
        <span class="center-text">浙江核新同花顺网络信息有限公司</span>
        <span class="info-title">范围</span>
        <span class="info-content">3km</span>
        <span class="info-title">企业数量</span>
        <span class="info-content">124家</span>
      </section>
      <section class="filter" v-if="!skeleton">
        <div class="filter-title">
          <span>条件筛选</span>
        </div>
        <div class="filter-select" v-if="isSelectEmpty">
          <section>
            <span class="filter-select-title">已选范围</span>
          </section>
          <section>
            <a-tooltip v-for="item in select" :key="item.symbol">
              <template slot="title">
                {{ item.name }}： {{ item.label }}
              </template>
              <span class="filter-select-info"><span>{{ item.name }}： {{ item.label }}</span><a-icon @click="handleClose(item)" type="close"/></span>
            </a-tooltip>

            <span class="filter-select-operate" @click="removeAllSelect">清空条件</span>
          </section>
        </div>
      </section>
      <a-skeleton active :loading="skeleton" active avatar/>

      <section class="select" v-if="!skeleton">
        <div class="select-content" :style="styleObject" ref="select-content">
          <div v-for="item in configOption" class="select-content-item" :placeholder="item.name" :key="item.symbol">
            <!--          <a-cascader-->
            <!--            :options="item.children"-->
            <!--            :display-render="displayRender"-->
            <!--            change-on-select-->
            <!--            expand-trigger="hover"-->
            <!--            popupClassName="cascader-pop"-->
            <!--            style="width: 96px"-->
            <!--          />-->

            <span class="item-title">{{item.name}}</span>

            <el-cascader
              placeholder="请选择"
              @change="value => onChange(value, item)"
              v-if="item.symbol =='industry'"
              :props="props"
              style="width: 96px;height: 24px"
              clearable
              v-model="selectOption[item.symbol]"
              :size="'mini'"
              collapse-tags
            >

            </el-cascader>

            <a-select
              v-if="item.symbol !='industry' && !item.select"
              v-model="selectOption[item.symbol]"
              :size="'small'"
              placeholder="请选择"
              style="width: 96px"
              allowClear
              :maxTagCount=0
              labelInValue
              @change="value => onChange(value, item)"
              mode="multiple"
            >
              <a-select-option
                v-for="el in item.children"
                :key="el.value"
              >
                {{el.label}}
              </a-select-option>
            </a-select>

            <a-select
              v-if="item.symbol !='industry' && item.select"
              v-model="selectOption[item.symbol]"
              :size="'small'"
              placeholder="请选择"
              style="width: 96px"
              allowClear
              labelInValue
              @change="value => onChange(value, item)"
            >
              <a-select-option
                v-for="el in item.children"
                :key="el.value"
              >
                {{el.label}}
              </a-select-option>
            </a-select>

          </div>


        </div>
        <span @click="handleSelectOperate" class="select-operate" :class="{'expand': isExpand}">
          {{isExpand ?  '更多筛选' : '收起筛选'}}
          <i></i>
        </span>
      </section>
      <a-skeleton active :loading="skeleton" active avatar/>

      <section class="swiper" v-if="!skeleton">
        <a-carousel arrows>
          <div
            slot="prevArrow"
            slot-scope="props"
            class="custom-slick-arrow"
            style="left: 10px;zIndex: 1"
          >
            <span class="pre"></span>
          </div>
          <div slot="nextArrow" slot-scope="props" class="custom-slick-arrow" style="right: 10px">
            <span class="next"></span>
          </div>
          <div v-for="item in listTemp">
            <section class="chart-content">
              <div class="chart-item" v-for="el in item">
                <map-pie :chart-data="el"></map-pie>
              </div>
            </section>
          </div>
        </a-carousel>
      </section>
      <a-skeleton active :loading="skeleton" active avatar/>

      <section class="list" v-if="!skeleton">
        <div class="list-item" v-for="(item, index) in companyList">
          <header>
            <span class="log" v-if="index == 0"></span>
            <span class="state">{{item.state}}</span>
            <span class="name">{{item.company_name}}</span>
            <a-button :size="'small'" class="operate" @click="handleSetCircle(item)"><i type="search"></i>搜索周边</a-button>
          </header>
          <p>
            <span class="title">法人</span>
            <span class="info active">{{item.legal_person}}</span>
            <span class="title">注册资本</span>
            <span class="info">{{item.captial}}</span>
            <span class="title">成立日期</span>
            <span class="info">{{item.establish_time}}</span>
            <span class="title">行业</span>
            <span class="info">{{item.small_industry}}</span>
          </p>
          <p>
            <span class="title">地址</span>
            <span class="address">{{item.address}}</span>
          </p>
        </div>
        <div class="pagination">
          <a-pagination
            v-model="pagination.current"
            :total="pagination.total"
            :show-total="(total) => `共${total}条`"
            :size="'small'"
            show-size-changer
            show-quick-jumper
          >
          </a-pagination>
        </div>

      </section>
      <a-skeleton active :loading="skeleton" active avatar/>


    </div>
  </div>
</template>

<script>
import mapPie from "@/components/charts/mapPie";
export default {
  name: "drawer",
  data() {
    return {
      select: [],
      selectOption: {},
      optionSelected: null,
      selectContentHigh: '30px',
      configOption: {},
      isExpand: false,
      chartData: [],
      companyList: [],
      chartList: [
        {
          data:[],
          name:'二级行业统计TOP5',
          value:'small_industry'
        },
        {
          data:[],
          name:'上市状态统计',
          value:'listed_state'
        },
        {
          data:[],
          name:'融资进程统计',
          value:'financing_rounds'
        },
        {
          data:[],
          name:'注册资本区间统计',
          value:'capital'
        },
        {
          data:[],
          name:'公司人数区间统计',
          value:'staff_num'
        },
        {
          data:[],
          name:'经营状态统计',
          value:'state'
        },
        {
          data:[],
          name:'企业类型统计',
          value:'type'
        },
        {
          data:[],
          name:'年份区间统计',
          value:'establish_time'
        },
      ],
      skeleton: true,
      backNum: 0,
      //el-cascader 配置
      props: {
        multiple: true,
        checkStrictly: true,
        expandTrigger: 'hover'
      },
      drawerVisible: false,
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
      }
    }
  },
  computed: {
    styleObject: function () {
      return {
        high: this.selectContentHigh
      }
    },
    isSelectEmpty: function () {
      return this.select.length == 0 ? false : true
    },
    // 生成轮播图的临时arr
    listTemp: function () {
      let list = this.chartList
      let arrTemp = [],index = 0, sectionCount = 3;
      for (let i = 0; i < list.length; i++) {
        index = parseInt(i / sectionCount);
        if (arrTemp.length <= index) {
          arrTemp.push([]);
        }
        arrTemp[index].push(list[i]);
      }
     // console.log('arrTemp', arrTemp)
      return arrTemp;
    },

  },
  components: {
    mapPie
  },
  created() {
    this.getData()
  },
  methods: {
    //antdv 悬浮自动展开
    displayRender({ labels }) {
      return labels[labels.length - 1];
    },

    async getData () {
      await this.getCompanyConfig()
    //  await console.log('chartList',this.chartList)
      await this.getCompanyList()
      const taskTemp = this.chartList.map(item => this.getChartData(item))
      await Promise.all(taskTemp).then(result => {
        this.skeleton = false
      })
    },

    handleSelectOperate() {
      this.isExpand = !this.isExpand
      if(this.isExpand) {
        this.$refs["select-content"].style.height = '30px'
      } else {
        this.$refs["select-content"].style.height = 'auto'
      }
      this.selectContentHigh = 'auto'

    },

    onChange(value, el) {
      debugger
      //三种组件：单选、多选、级联多选。 el.select 区分单选多选；el.symbol == 'industry'是唯一一个级联多选
      let valueStr,labelStr,isSelect
      if (el.symbol == 'industry') {
        value.forEach(item => item = item.split('-')[1])
        labelStr = value.join(',')
        valueStr = labelStr
      }else if(el.select){
        labelStr = value&&value.label
        valueStr = value&&value.key
      }else {
        value.forEach((item, index) => {
          if(index) {
            labelStr += (',' + item.label)
            valueStr += (',' + item.key)
          } else {
            labelStr = item.label
            valueStr = item.key
          }
        })
      }

      this.select.forEach((item, index) => {
        if(item.symbol == el.symbol) {
          if(valueStr == undefined) {
            this.select.splice(index, 1)
            isSelect = true
            return;
          }else {
            item.value = valueStr
            item.label = labelStr
            isSelect = true
          }
        }
      })

      if(!isSelect) {
        this.select.push({
          value: valueStr,
          label: labelStr,
          name: el.name,
          symbol: el.symbol
        })
      }
    },

    onSelect(value) {
    //  console.log(value)
    },

    removeAllSelect() {
      this.select = []
      this.selectOption = {}
    },

    getCompanyConfig () {
      // const url = '/standardgwapi/api/company_library/map/search_config'
      const url = 'http://software.myhexin.com/yapi/mock/2486/standardgwapi/api/company_library/map/search_config'
      const data = {
        searchType: 'map'
      }
     return this.$getAxios(url,data, res=>{
        if(res.code == 1) {
          this.configOption = res.data
        //  console.log(res.data)
          this.setOptionValue(res.data)
          this.backNum ++

        }
      })
    },

    getChartData(item) {
      // standardgwapi/api/standardgwapi/api/company_library/map/chart
      const url = 'http://software.myhexin.com/yapi/mock/2486/standardgwapi/api/standardgwapi/api/company_library/map/chart'
      const data = {
        aggfield: item.value
      }
     return this.$getAxios(url, data, res => {
        if(res.code == 1) {
          item.data = res.data.items
        }
      })
    },

    getCompanyList() {
      // /standardgwapi/api/company_library/map/company_list
      const url = `http://software.myhexin.com/yapi/mock/2486/standardgwapi/api/company_library/map/company_list`
      const data = {
        searchType: 'map'
      }

     return  this.$getAxios(url, data, res => {
        if(res.code == 1) {
          this.companyList = res.data.items
          this.backNum ++
          // this.skeleton = false
        }
      })
    },

    handleClose(item) {
    //  console.log(item)
      this.select.forEach((el, index) => {
        if(el.symbol == item.symbol) {
          this.select.splice(index, 1)
        }
      })
      this.selectOption[item.symbol] = undefined
    },
    // 对于每个配置项 设置一个v-model，用于删除筛选条件时恢复下方筛选器

    setOptionValue(data) {
      data.forEach((item,index) => {
        //this.chartList.push(item.symbol)
        if (item.symbol == 'issue_bond_num' || item.symbol ==  'phone_num' ||item.symbol == 'e_mail' || item.symbol == 'host' ||item.symbol == 'tax_info' ||item.symbol == 'trademark' ||item.symbol == 'copyright_info_num' || item.symbol == 'software_copyright_num' ||item.symbol ==  'tech_corp' || item.symbol == 'import_export_num' || item.symbol == 'certificate_info_num' || item.symbol == 'certificate_info' || item.symbol == 'change_record_time' || item.symbol == 'admin_punish_num' || item.symbol == 'chattel_mortgage_num' ||item.symbol ==  'discredited_by_executors_num' || item.symbol == 'liquidation_info_num') {
          item.select = true
        }
        this.selectOption[item.symbol] = undefined
      })
    },

    handleCloseDrawer() {
      this.drawerVisible = !this.drawerVisible
    },

    handleSetCircle(item) {
    //  console.log(item)

      this.$emit('handleSet', item.coordinates)
    }
  }
}
</script>

<style scoped lang="less">

.skeleton-demo {
  border: 1px solid #f4f4f4;
}

/deep/ .ant-skeleton {
  padding-left: 30px;
  padding-top: 40px;
}

/deep/ .el-input__inner {
  height: 24px;
}

.drawer-container {
  height: 100%;
  position: fixed;
  top: 0px;
  right: 0px;
  z-index: 6;
  display: flex;
  justify-content: center;
  display: flex;
  align-items: center;
  .control-btn {
    margin-left: auto;
    width: 10px;
    height: 48px;
    background: url(~@/assets/map/side-expand-normal.png) no-repeat;
    background-size: 10px 48px;
    cursor: pointer;
    &:hover {
      background: url(~@/assets/map/side-expand-hover.png) no-repeat;
      background-size: 10px 48px;
    }
    &.open {
      background: url(~@/assets/map/side-close-normal.png) no-repeat;
      background-size: 10px 48px;
      &:hover {
        background: url(~@/assets/map/side-close-hover.png) no-repeat;
        background-size: 10px 48px;
      }
    }
  }

  .drawer {
    width: 732px;
    height: 100%;
    background: #fff;
    display: flex;
    flex-direction: column;

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
      //height: 68px;
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
        section:nth-child(1) {
          width: 66px;
        }

        section:nth-child(2) {
          width: 632px;
          display: flex;
          flex-wrap: wrap;
          //line-height: 30px;
          //align-content: space-between;
        }

        span {
          &.filter-select-title {
            font-family: MicrosoftY aHei;
            font-size: 14px;
            color: #272841;
            line-height: 22px;
          }

          &.filter-select-info {
            margin: 5px 0;
            background: #E8EFFB;
            padding: 0 8px;
            border-radius: 2px;
            margin-left: 8px;
            font-family: 'Microsoft YaHei';
            font-size: 14px;
            color: #1B63D9;
            text-align: center;
            line-height: 22px;
            display: flex;
            justify-content: center;
            align-items: center;
            span {
              display: inline-block;
              max-width: 240px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            i {
              margin-left: 8px;
              width: 12px;
              height: 12px;
            }
          }

          &.filter-select-operate {
            font-family: Microsoft YaHei;
            font-size: 12px;
            margin-left: 16px;
            margin-bottom: 5px;
            margin-top: 5px;
            height: 22px;
            color: #1B63D9;
            line-height: 22px;
            cursor: pointer;
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
        display: flex;
        flex-wrap: wrap;
        text-align: left;
        overflow: hidden;
        .select-content-item {
          width: 176px;
          display: flex;
          height: 32px;

          span.item-title {
            text-align: right;
            font-family: Microsoft YaHei;
            width: 70px;
            font-size: 14px;
            color: #474762;
            line-height: 22px;
            margin-right: 4px;
          }

          /deep/ .ant-cascader-menu {
            &::-webkit-scrollbar {
              width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
              height: 1px;
            }
            &::-webkit-scrollbar-thumb {
              border-radius: 6px;
              // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
              background: rgba(144, 147, 153, 0.5);
            }
            &::-webkit-scrollbar-track {
              // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
              display: none;
            }
          }
        }
      }

      .select-operate {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        height: 20px;
        color: #1B63D9;
        cursor: pointer;
        margin-bottom: 16px;
        i {
          display: inline-block;
          width: 16px;
          height: 16px;
          background: url(~@/assets/map/less-normal.svg) center center no-repeat;
        }
        &:hover {
          i {
            background: url(~@/assets/map/less-hover.svg)center center no-repeat;

          }
        }
        &.expand {
          i {
            display: inline-block;
            width: 16px;
            height: 16px;
            background: url(~@/assets/map/more-normal.svg)center center no-repeat;
          }
          &:hover {
            i {
              background: url(~@/assets/map/more-hover.svg)center center no-repeat;

            }
          }
        }
      }

      div.ant-select {
        margin-right: 5px;
      }
    }

    section.swiper {
      padding: 0 16px;
      height: 206px;
      span.pre {
        display: block;
        width: 18px;
        height: 34px;
        background: url(~@/assets/map/pre.normol.svg);
        &:hover {
          background: url(~@/assets/map/pre.hover.svg);
        }
      }

      span.next {
        display: block;
        width: 18px;
        height: 34px;
        float: right;
        background: url(~@/assets/map/next.normol.svg);
        &:hover {
          background: url(~@/assets/map/next.hover.svg);
        }
      }

      section.chart-content {
        width: 700px;
        height: 206px;
        display: flex;
        align-items: center;
        //justify-content: space-between;
        border: 1px solid #ECECF7;
        .chart-item {
          width: 209px;
          height: 184px;
          margin-right: 16px;
        }
      }

      .ant-carousel /deep/ .slick-slide {
        text-align: center;
        height: 206px;
        line-height: 206px;
        //background: #364d79;
        overflow: hidden;
      }

      .ant-carousel /deep/ .custom-slick-arrow {
        width: 25px;
        height: 25px;
        font-size: 25px;
        color: #fff;
        opacity: 0.3;
        &.slick-prev {
          left: 0!important;
        }
        &.slick-next {
          right: 0!important;
        }
      }
      .ant-carousel /deep/ .custom-slick-arrow:before {
        display: none;
      }
      .ant-carousel /deep/ .custom-slick-arrow:hover {
        opacity: 0.5;
      }

      .ant-carousel /deep/ .slick-slide h3 {
        color: #fff;
      }

      .ant-carousel /deep/ .slick-dots-bottom {
        bottom: 10px;
        li {
          button {
            width: 5px;
            height: 4px;
            border-radius: 2px;
            background: #CBCBE1;
          }
          &.slick-active {
            button {
              background: #8F90B5;
              width: 10px;
              height: 4px;
              border-radius: 2px;
            }
          }
        }
      }
    }

    section.list {
      overflow-y: scroll;
      //height: 520px;
      display: flex;
      flex-direction: column;
      margin: 16px 16px;
      padding-bottom: 20px;
      &::-webkit-scrollbar {
        width: 6px;
      }
      &::-webkit-scrollbar-track {
        display: none;
      }
      /* 滚动条角落 */
      &::-webkit-scrollbar-thumb {      /*滚动条的轨道*/
        background-color: #B7B7C7;
        border-radius: 4px;
        &:hover {
          background-color:#9293AA
        }
      }
      .list-item {
        padding-left: 13px;
        display: flex;
        flex-direction: column;
        width: 690px;
        height: 84px;
        padding-bottom: 9px;
        border-bottom: 1px solid #ECECF7;
        &:hover {
          background: #EBF3FF;
        }
        header {
          margin-top: 8px;
          display: flex;
          align-items: center;
          .log {
            width: 13px;
            height: 16px;
            background: url(~@/assets/map/center-hover.svg);
            margin-right: 8px;
          }
          .state {
            margin-right: 4px;
            width: 32px;
            height: 20px;
            background: #E5F4F8;
            border-radius: 2px;
            font-family: Microsoft YaHei;
            font-size: 12px;
            color: #0095C2;
            text-align: center;
            line-height: 20px;
          }
          .name {
            font-family: Microsoft YaHei;
            font-size: 14px;
            color: #1B63D9;
            line-height: 22px;
            margin-right: auto;
          }
          .operate {
            margin-right: 12px;
          }
        }
        p {
          margin-top: 4px;
          margin-bottom: 0;
          display: flex;
          align-items: center;
          .title {
            margin-right: 4px;
            font-family: Microsoft YaHei;
            font-size: 12px;
            color: #7D7D94;
            line-height: 20px;
          }
          .info {
            font-family: MicrosoftYaHei;
            font-size: 12px;
            color: #272841;
            line-height: 20px;
            margin-right: 16px;
            &.active {
              color: #1B63D9;
            }
          }
          .address {
            font-family: MicrosoftYaHei;
            font-size: 12px;
            color: #272841;
            line-height: 20px;
            margin-right: 16px;
          }
        }
      }
      .pagination {
        margin-top: 12px;
      }

    }


  }
}


</style>
