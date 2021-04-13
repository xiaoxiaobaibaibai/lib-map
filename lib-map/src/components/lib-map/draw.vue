<template>
  <div>
    <ul style="'soild 1px yellow'" class="drawing-panel">
      <li class="bmap-btn bmap-circle" id="circle" @click="draw($event)"></li>
    </ul>
  </div>
</template>

<script>
import map from "@/views/map/map";

export default {
  name: 'draw',
  props: {
    map: Object
  },
  data() {
    return {
      drawingManager: "", // 绘制管理器
      centerPoint: null, // 中心点
      label: null,
      polyline: null,
    };
  },
  // computed: {
  //   map: function () {
  //     return this
  //   }
  // },
  mounted() {
    this.init();
  },
  methods: {
    init() {
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
  }
};
</script>

<style>
body,
html,
#container {
  width: 100%;
  height: 500px;
  margin: 0;
  font-family: "微软雅黑";
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
