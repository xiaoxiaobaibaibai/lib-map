<template>
  <v-chart :options="option" ref="chart">
  </v-chart>
</template>

<script>

export default {
  name: "mapPie",
  props: {
    chartData: Object
  },
  data() {
    return {
      option: {},
      // data: this.chartData
      data: [
        {value: 1048, name: '搜索引擎'},
        {value: 735, name: '直接访问'},
        {value: 580, name: '邮件营销'},
        {value: 484, name: '联盟广告'},
        {value: 300, name: '视频广告'}
      ]
    }
  },
  components: {
  },
  watch: {

    chartData: {
      handler: function (newVal) {
        this.handleShow()
        console.log('newVal',newVal)
        this.$refs.chart && this.$refs.chart.mergeOptions(this.option,true)
      },
      //页面初始化时立即调用
      immediate: true,
      deep: true
    }
  },
  methods: {
    handleShow() {
      this.option = {
        title: {
          show: true,
          text: '上市状态统计',
          textStyle: {
            'font-family': 'Microsoft YaHei',
            'fontSize': '14px',
            'color': ' #474762',
            'font-weight': 'normal',
            'left': 'center',
          },
          x: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          type: 'scroll',
          itemHeight: 8,
          itemWidth: 8,
          orient: 'vertical',
          tooltip: {
            show: true
          },
          left: '50%',
          top: '10%',
          width: 30,
          textStyle: {
            rich:{
              a: {
                color: 'red',
                fontSize: 15,
                width: 45,
                height: 21,
                overflow: 'truncate',
                padding: [0,0,0,1]
              },
            }
          },

        },
        color: ['#4D5999', '#3DB4CC','#F2A354', '#458BD1', '#F261AA', '#F2D754', '#CCCCCC'],
        series: [
          {
            name: '上市状态',
            type: 'pie',
            radius: ['30%', '40%'],
            // avoidLabelOverlap: false,
            center: ['55px','110px'],
            hoverOffset: 5,
            label: {
              show: false,
              position: 'center'
            },
            // emphasis: {
            //   label: {
            //     show: true,
            //     fontSize: '40',
            //     fontWeight: 'bold'
            //   }
            // },
            labelLine: {
              show: false
            },
            data: this.chartData.data
          }
        ]
      }
    }
  }
}
</script>

<style scoped>
.echarts {
  width: 100%;
  height: 100%;
}
</style>
