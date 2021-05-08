<template>
  <div class="container">
    <search-wrap @focus="handleFocusMarker" ref="search"></search-wrap>
    <tip :name="addressTip" :num="numberTip" v-if="tipVisible" @nation="handleNation"></tip>
    <city-list @mark="handleMark" @select="mapCenter"></city-list>
    <drawer></drawer>
    <div id="selectbox_Drawing" class="selectbox_Drawing"></div>
    <div id="map">
    </div>
  </div>
</template>
<script>
import searchWrap from "@/components/search/searchWrap";
import cityList from "@/components/lib-map/cityList";
import { style  } from "@/assets/mapstyle";
import { mapConstant } from "@/assets/city";
import draw from "@/components/lib-map/draw";
import drawer from "@/components/lib-map/drawer";
import tip from "@/components/lib-map/tip";


export default {
  name: 'TestBaiDu',
  data () {
    return {
      center: { lng: 109.45744048529967, lat: 36.49771311230842 },
      zoom: 13,
      map: null,
      drawingManager: "", // 绘制管理器
      centerPoint: null, // 中心点
      label: null,
      polyline: null,
      configOption: [],
      address: {}, //地址解析结果
      numberTip: 0, //强搜的tip总量
      tipVisible: false, //强搜的tip显示
      addressTip: '' //强搜tip范围
    }
  },
  components: {
    searchWrap,
    cityList,
    draw,
    drawer,
    tip
  },
  methods: {
      getClickInfo(e) {
        this.getAddrByPoint(e.point)
      },

      getLocation() { // 获取浏览器当前定位
        debugger
        let geolocation = new window.BMap.Geolocation()
        let _this = this
        geolocation.getCurrentPosition((r) => {
          console.log(r)
          let point
          if(r.point) {
            point = r.point
          } else {
            //ths 定位
          }
          this.map.panTo(point)
        })
      },
      /**
       * 逆地址解析函数（根据坐标点获取详细地址）
       * @param {Object} point   百度地图坐标点，必传
       */
      getAddrByPoint(point){
        let geco = new window.BMap.Geocoder();

        return new Promise((resolve,reject) => {
          geco.getLocation(point, (res) => {
            this.address = res
            console.log('地址解析', res)
            resolve(true)
          })
        })

      },
      init() {
        debugger
        var point = new BMap.Point(120.306595, 30.42474);
        this.map = new window.BMap.Map("map"); // 创建Map实例(鼠标右键控制倾斜角度)
        this.map.centerAndZoom(point, 15); // 初始化地图,设置中心点坐标和地图级别
        this.map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
        this.map.enableDragging()
        // this.getLocation()
        this.map.setMapStyleV2({
          styleJson: style
         // styleId: 'baab47c6fa5dcdcbea17611febadf609'
        });

        const styleOptions = {
          strokeColor: "#5E87DB", // 边线颜色
          fillColor: "#5E87DB", // 填充颜色。当参数为空时，圆形没有填充颜色
          strokeWeight: 1, // 边线宽度，以像素为单位
          strokeOpacity: 1, // 边线透明度，取值范围0-1
          fillOpacity: 0.2 // 填充透明度，取值范围0-1
        };

        const LineOptions = {
          strokeColor: "transparent", // 边线颜色
          fillColor: "#5E87DB", // 填充颜色。当参数为空时，圆形没有填充颜色
          strokeWeight: 1, // 边线宽度，以像素为单位
          strokeOpacity: 1, // 边线透明度，取值范围0-1
          fillOpacity: 0.2 // 填充透明度，取值范围0-1
        };

        const labelOptions = {
          borderRadius: "2px",
          background: "#FFFBCC",
          border: "1px solid #E1E1E1",
          color: "#703A04",
          fontSize: "12px",
          letterSpacing: "0",
          padding: "5px"
        };

        // 实例化鼠标绘制工具
        this.drawingManager = new window.BMapLib.DrawingManager(this.map, {
          enableDrawingTool: false, // 是否显示工具栏
          enableCalculate: true, // 绘制是否进行测距(画线时候)、测面(画圆、多边形、矩形)
          drawingToolOptions: {
            enableTips: true,
            customContainer: 'selectbox_Drawing',
            hasCustomStyle: true,
            offset: new BMap.Size(5, 5), // 偏离值
            scale: 0.8, // 工具栏缩放比例
            drawingModes: [
              BMAP_DRAWING_RECTANGLE
              , BMAP_DRAWING_POLYGON
              , BMAP_DRAWING_CIRCLE
            ]
          },
          enableSorption: true, // 是否开启边界吸附功能
          sorptionDistance: 20, // 边界吸附距离
          enableGpc: true, // 是否开启延边裁剪功能
          enbaleLimit: true,  // 是否开启超限提示
          limitOptions: {
            area: 50000000 // 面积超限值
          },
          circleOptions: styleOptions, // 圆的样式
          // polylineOptions: LineOptions, // 线的样式
          // polygonOptions: styleOptions, // 多边形的样式
          // rectangleOptions: styleOptions, // 矩形的样式
          // labelOptions: labelOptions // label的样式
        });

        //添加鼠标绘制工具监听事件，用于获取绘制结果
        this.drawingManager.addEventListener(
          "overlaycomplete",
          this.overlaycomplete
        );

        // 给地图添加鼠标移动监听事件
        this.map.addEventListener("mousemove", () => {
            if (this.drawingManager._mask != null) {
              this.drawingManager._mask.addEventListener("mousedown", this.showCirle);
              this.map.removeEventListener("mousemove", this.showCirle);
            }
        });

      },
      handleMark() {
        // debugger
        // this.map.setDefaultCursor("url('http://172.19.80.62:81/gwstatic/static/company_web/public/sign.cur')  3 6, default")
        // this.map.disableDragging()
        // this.map.disableScrollWheelZoom()
        //
        // this.map.addEventListener('click', e => { //给地图绑定点击事件
        //   this.getAddrByPoint(e.point) //点击后调用逆地址解析函数
        //   this.markOnMap(e.point)
        // })
        this.drawingManager.setDrawingMode(BMAP_DRAWING_CIRCLE);
        this.drawingManager.open(BMAP_DRAWING_CIRCLE)

      },
      markOnMap(p) {
        debugger
       const lng = p.lng, lat = p.lat
       const point = new BMap.Point(lng, lat)
       // const marker = new BMap.Marker(point);        // 创建标注
       // this.map.addOverlay(marker);                     // 将标注添加到地图中
       this.addMarker(point)
     },
    //强搜标记物
      addMarker (point, name, value){  // 创建图标对象
        // 创建标注对象并添加到地图
     //   var marker = new BMap.Marker(point, {icon: myIcon});
     //    const marker = new BMap.Marker(point);
     //    this.map.addOverlay(marker);
        const labelContent = `<div class="map-info"><span class="map-info-title">${name}</span><span class="map-info-content">${value}家</span></div>`
        let opts = {
          position: point, // 指定文本标注所在的地理位置
        };
        let label = new BMap.Label(labelContent, opts)
        label.addEventListener('click', e => this.handleLabel(name))
        //允许覆盖物在map.clearOverlays方法中被清除
        label.enableMassClear()
        label.setStyle({
          textAlign: 'center',
          width: '88px',
          height: '88px',
          borderRadius: '50%',
          color: "white",
          fontSize: "16px",
          fontFamily: "微软雅黑",
          border: 'none',
          backgroundImage: 'linear-gradient(180deg, rgba(17,130,240,0.80) 5%, #1B63D9 98%)',
          boxShadow: '0 2px 4px 0 rgba(0,0,0,0.20)',
        });
        this.map.addOverlay(label)
  },
      /**
       * 强搜
       * 渲染标记和标签
       * @param lng,lat 省市的地位坐标
       * @param map map地图对象
       * @param level 地图级别 1：省级 2：市级 3：区县级
       * @param data json数据
       * @param markerClickCallback 标记点击事件方法回调函数
       * @param center 中心坐标
       */
      renderFocusMarker(data) {
        // 1，将地图中心点定位到省市，格式化缩放级别
        // const point = new BMap.Point(lng, lat)
        // this.map.panTo(point)
        data.forEach(item => {
          this.numberTip += item.value
          const lng = item.coordinates.split(',')[1]
          const lat = item.coordinates.split(',')[0]
          const point = new BMap.Point(lng, lat)

          this.addMarker(point,item.name,item.value)
        })

        this.tipVisible = true

      },
      handleFocusMarker(keyword) {
        debugger

        //1,点击强搜，获取中心点  当前缩放等级
        const point = this.map.getCenter()
        const zoom = this.map.getZoom()

        //2,根据中心点获取地理信息
        this.getAddrByPoint(point).then(res => {
          console.log('point,zoom',point,zoom)

          // city: "杭州市"; district: "临平区"; province: "浙江省"; street: "西大街"; streetNumber: "33号"; town: ""

          const addressComponent = this.address.addressComponents
        //3,根据对应的zoom级别调整参数
          let areaType = ''

          switch (true) {
            case (zoom < 5):
              areaType = '';
              break
            case (zoom <= 10):
              areaType = addressComponent.province;
              this.addressTip = addressComponent.province
              break
            case (zoom <= 15):
              areaType = `${addressComponent.province}-${addressComponent.city}`;
              this.addressTip = addressComponent.city
              break
          }

          // /standardgwapi/api/company_library/map/force_search
          const url = 'http://software.myhexin.com/yapi/mock/2486/standardgwapi/api/company_library/map/force_search'
          const data = {
            areaType,
            keyword
          }
          this.$getAxios(url, data, res => {
            if(res.code == 1) {
              this.renderFocusMarker(res.data.items)
            }
          })
        })


      },

      /**
       * 画圆
       */
      draw(event) {
        debugger
        this.centerPoint = null; // 中心点
        this.label = null;
        this.polyline = null;
        var arr = document.getElementsByClassName("bmap-btn");
        for (var i = 0; i < arr.length; i++) {
          arr[i].style.backgroundPositionY = "0";
        }
        event.target.style.backgroundPositionY = "-52px";
        switch (event.target.id) {
          case "marker": {
            var drawingType = BMAP_DRAWING_MARKER;
            break;
          }
          case "polyline": {
            var drawingType = BMAP_DRAWING_POLYLINE;
            break;
          }
          case "rectangle": {
            var drawingType = BMAP_DRAWING_RECTANGLE;
            break;
          }
          case "polygon": {
            var drawingType = BMAP_DRAWING_POLYGON;
            break;
          }
          case "circle": {
            var drawingType = BMAP_DRAWING_CIRCLE;
            break;
          }
        }
        // 进行绘制
        if (
          this.drawingManager._isOpen &&
          this.drawingManager.getDrawingMode() === drawingType
        ) {
          this.drawingManager.close();
        } else {
          this.drawingManager.setDrawingMode(drawingType);
          this.drawingManager.open();
        }
      },

      overlaycomplete(event) {
        console.log("完成绘制：------> ", event)
        console.log(this.centerPoint);
        console.log(this.label);
        console.log(this.polyline);
        this.centerPoint = null; // 中心点
        this.label = null;
        this.polyline = null;
      },

      showCirle(event) {
        // 如果中心点是null
        if (this.centerPoint == null) {
          this.centerPoint = event.point; // 给中心点设置新的值
          this.drawingManager._mask.addEventListener("mousemove", this.showRadis);
          // var maker = new window.BMapGL.Marker(event.point);
          // this.map.addOverlay(maker);
        }
      },

      /**
       * 半径
       */
      showRadis(event) {
        var radius = this.drawingManager._map.getDistance(
          this.centerPoint,
          event.point
        );
        if (!isNaN(radius)) {
          this.map.removeOverlay(this.label); //清除上一个显示半径的label标注
          this.map.removeOverlay(this.polyline); //清除上一个圆的半径直线
          //添加文字标签
          var opts = {
            position: event.point, // 指定文本标注所在的地理位置（当前鼠标的位置）
            offset: new window.BMap.Size(5, -15) //设置文本偏移量
          };
          this.label = new window.BMap.Label(
            (radius / 1000).toFixed(2) + "公里",
            opts
          ); // 创建文本标注对象
          //文本标注样式
          this.label.setStyle({
            color: "#438eff",
            //fontSize:'14px',
            fontWeight: "bold",
            border: "0px solid #ccc",
            backgroundColor: "" //#2267AD
          });
          //从圆心画半径
          this.polyline = new window.BMap.Polyline(
            [this.centerPoint, event.point],
            {
              strokeColor: "red",
              strokeWeight: 2,
              strokeOpacity: 0.5
            }
          ); //后面参数为划线的样式
          this.map.addOverlay(this.polyline); //添加半径直线
          this.map.addOverlay(this.label); //添加label
        }
      },

      mapCenter(str) {
        this.getPointByAddress(str)
        this.map.centerAndZoom(str)
      },

        /**
         * baidu服务 地址转坐标
         */
      getPointByAddress(address, ak = 'fw9CfWuMOO6cfrERuEFKL4FOIUGQQ3dj') {

        const url = `http://api.map.baidu.com/geocoding/v3/`
        const data = {
          ak,
          address
        }

        this.$getAxios(url,data,res => this.handlePointByAddress(res))
      },
      handlePointByAddress(res) {
        //{"status":0,"result":{"location":{"lng":116.3084202915042,"lat":40.05703033345938},"precise":1,"confidence":80,"comprehension":100,"level":"门址"}}
        if(res.status == 0) {
          console.log('location',res.result.location)
          return res.result.location
        }
      },
    // 浏览全国
    handleNation() {
      this.map.clearOverlays()
      this.map.setZoom(5)
      this.tipVisible = false
    },

    //强搜层级跳转
    handleLabel(name) {
      const zoom  = this.map.getZoom()
      this.map.clearOverlays()
      this.map.setCenter(name)
      this.map.setZoom(zoom + 5)
      //通过子组件的enter方法重新调用父组件的handleFocusMarker,拿到最新的input
      this.$refs.search.handleEnter()
    }

    },
  created() {
  },
  mounted() {
    this.init()

  }
}
</script>
<style lang="less" scoped>
div.container {
  width: 100%;
  height: 100%;
  #map {
    width: 100%;
    height: 100%;
    cursor: url("./sign.svg") 3 6, default;
  }
}


/deep/ label.BMapLabel {
  .map-info {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    .map-info-title {
      margin-top: 22px;
      font-size: 16px;
      letter-spacing: 0;
    }
    .map-info-content {
      font-size: 14px;
      letter-spacing: 0;
    }
  }
}



</style>
