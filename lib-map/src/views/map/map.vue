/* eslint-disable */
<template>
  <div>
    <search-wrap @focus="handleFocusMarher"></search-wrap>
    <city-list @mark="handleMark"></city-list>
    <ul style="'soild 1px yellow'" class="drawing-panel">
      <li class="bmap-btn bmap-circle" id="circle" @click="draw($event)"></li>
    </ul>
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
    }
  },
  components: {
    searchWrap,
    cityList,
    draw
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
        debugger
        var that = this;
        var geco = new window.BMap.Geocoder();
        geco.getLocation(point, function(res){
          console.log(res)
         // that.BMap.panTo(point)  //将地图的中心点更改为给定的点
         //  that.form.address = res.address;  //记录该点的详细地址信息
         //  that.form.addrPoint = point;  //记录当前坐标点
        })
      },
      init() {
        debugger
        var point = new BMap.Point(116.404, 39.915);
        this.map = new window.BMap.Map("map"); // 创建Map实例(鼠标右键控制倾斜角度)
        this.map.centerAndZoom(point, 15); // 初始化地图,设置中心点坐标和地图级别
        this.map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
        this.map.enableDragging()
        this.getLocation()
        this.map.setMapStyleV2({
          styleJson: style
         // styleId: 'baab47c6fa5dcdcbea17611febadf609'
        });

        const styleOptions = {
          strokeColor: "#5E87DB", // 边线颜色
          fillColor: "#5E87DB", // 填充颜色。当参数为空时，圆形没有填充颜色
          strokeWeight: 2, // 边线宽度，以像素为单位
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
          // isOpen: true,        // 是否开启绘制模式
          enableCalculate: true, // 绘制是否进行测距测面
          enableSorption: TextTrackCue, // 是否开启边界吸附功能
          sorptiondistance: 20, // 边界吸附距离
          circleOptions: styleOptions, // 圆的样式
          labelOptions: labelOptions // label样式
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
        debugger
        this.map.setDefaultCursor("url('./sign.cur')  3 6, default")
        this.map.disableDragging()
        this.map.disableScrollWheelZoom()

        this.map.addEventListener('click', e => { //给地图绑定点击事件
          this.getAddrByPoint(e.point) //点击后调用逆地址解析函数
          this.markOnMap(e.point)
        })
      },
      markOnMap(p) {
        debugger
       const lng = p.lng, lat = p.lat
       const point = new BMap.Point(lng, lat)
       // const marker = new BMap.Marker(point);        // 创建标注
       // this.map.addOverlay(marker);                     // 将标注添加到地图中
       this.addMarker(point)
     },
      addMarker (point){  // 创建图标对象
        // 创建标注对象并添加到地图
     //   var marker = new BMap.Marker(point, {icon: myIcon});
        const marker = new BMap.Marker(point);
        this.map.addOverlay(marker);
        const labelContent = '<div class="map-info"><span class="map-info-title">余杭区</span><span class="map-info-content">1024家</span></div>'
        let opts = {
          position: point, // 指定文本标注所在的地理位置
        };
        let label = new BMap.Label(labelContent, opts)
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
    handleFocusMarker() {
        const level = this.map.getZoom()
        const center = this.map.getCenter()
        const url = 'xxx'
        const data = {
          level,
          center
        }
        this.$getAxios(url, data, res => this.renderFocusMarker(res))
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
    renderFocusMarker(lng, lat, level, data, markerClickCallback, center, isClick) {
      // 1，将地图中心点定位到省市，格式化缩放级别
      const point = new BMap.Point(lng, lat)
      this.map.panTo(point)
      for (let i = 0; i < data.length; i ++) {
        let label
        let d = data[i]
        let opts = {
          position: d.points[0], // 指定文本标注所在的地理位置
          // offset:size
        };
        const labelContent = d.num;
        label = new BMap.Label(labelContent, opts)
        label.setStyle({
          color: "white",
          fontSize: "4px",
          height: "auto",
          lineHeight: "6px",
          fontFamily: "微软雅黑",
          backgroundColor: 'none',
          maxWidth: 'none',
          border: 'none',
          'font-weight':'bold'
        });

      }

    },
    handleFocusMarher() {},

    /**
     * 画圆
     */
    draw(event) {
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
    }



    },
  created() {
  },
  mounted() {
    this.init()

  }
}
</script>
<style lang="less">
#map {
  width: 1440px;
  height: 688px;
  cursor: url("./sign.svg") 3 6, default;
}

label.BMapLabel {
  .map-info {
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


ul li {
  list-style: none;
}
.info {
  z-index: 999;
  width: auto;
  min-width: 22rem;
  padding: 0.75rem 1.25rem;
  margin-left: 1.25rem;
  position: fixed;
  top: 1rem;
  background-color: #fff;
  border-radius: 0.25rem;
  font-size: 14px;
  color: #666;
  box-shadow: 0 2px 6px 0 rgba(27, 142, 236, 0.5);
}
.drawing-panel {
  z-index: 999;
  position: fixed;
  bottom: 3.5rem;
  margin-left: 2.5rem;
  padding-left: 0;
  border-radius: 0.25rem;
  height: 47px;
  box-shadow: 0 2px 6px 0 rgba(27, 142, 236, 0.5);
}
.bmap-btn {
  border-right: 1px solid #d2d2d2;
  float: left;
  width: 64px;
  height: 100%;
  background-image: url(//api.map.baidu.com/library/DrawingManager/1.4/src/bg_drawing_tool.png);
  cursor: pointer;
}
.drawing-panel .bmap-marker {
  background-position: -65px 0;
}
.drawing-panel .bmap-polyline {
  background-position: -195px 0;
}
.drawing-panel .bmap-rectangle {
  background-position: -325px 0;
}
.drawing-panel .bmap-polygon {
  background-position: -260px 0;
}
.drawing-panel .bmap-circle {
  background-position: -130px 0;
}
</style>
