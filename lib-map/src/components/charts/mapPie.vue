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
          text: this.chartData.name,
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
          pageIcons:{
            vertical:['M904.533333 674.133333l-362.666666-362.666666c-17.066667-17.066667-42.666667-17.066667-59.733334 0l-362.666666 362.666666c-17.066667 17.066667-17.066667 42.666667 0 59.733334 17.066667 17.066667 42.666667 17.066667 59.733333 0L512 401.066667l332.8 332.8c8.533333 8.533333 19.2 12.8 29.866667 12.8s21.333333-4.266667 29.866666-12.8c17.066667-17.066667 17.066667-42.666667 0-59.733334z',
              'M904.533333 311.466667c-17.066667-17.066667-42.666667-17.066667-59.733333 0L512 644.266667 179.2 311.466667c-17.066667-17.066667-42.666667-17.066667-59.733333 0-17.066667 17.066667-17.066667 42.666667 0 59.733333l362.666666 362.666667c8.533333 8.533333 19.2 12.8 29.866667 12.8s21.333333-4.266667 29.866667-12.8l362.666666-362.666667c17.066667-17.066667 17.066667-42.666667 0-59.733333z']
          },
          pageIconColor: '#00a9eb',       // 可以点击的翻页按钮颜色
          pageIconInactiveColor: '#7f7f7f',  // 禁用的按钮颜色
          pageIconSize: 15,  //这当然就是按钮的大小

        },
        color: ['#4D5999', '#3DB4CC','#F2A354', '#458BD1', '#F261AA', '#F2D754', '#CCCCCC'],
        series: [
          {
            name: this.chartData.name,
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
  width: 209px;
  height: 184px;
}
</style>
