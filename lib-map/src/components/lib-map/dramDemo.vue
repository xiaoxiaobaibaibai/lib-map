<template>
  <div>
    <div id="allmap" style="overflow:hidden;zoom:1;position:relative;">
      <div id="map" style="height:100%;-webkit-transition: all 0.5s ease-in-out;transition: all 0.5s ease-in-out;"></div>
      <div id="showPanelBtn" style="position:absolute;font-size:14px;top:50%;margin-top:-95px;right:0px;width:20px;padding:10px 10px;color:#999;cursor:pointer;text-align:center;height:170px;background:rgba(255,255,255,0.9);-webkit-transition: all 0.5s ease-in-out;transition: all 0.5s ease-in-out;font-family:'微软雅黑';font-weight:bold;">显示检索结果面板<br/>&lt;</div>
      <div id="panelWrap" style="width:0px;position:absolute;top:0px;right:0px;height:100%;overflow:auto;-webkit-transition: all 0.5s ease-in-out;transition: all 0.5s ease-in-out;">
        <div style="width:20px;height:200px;margin:-100px 0 0 -10px;color:#999;position:absolute;opacity:0.5;top:50%;left:50%;">此处用于展示覆盖物信息</div>
        <div id="panel" style="position:absolute;">
          <div v-html="result"></div>
        </div>
      </div>
    </div>

    <div id="result">
      <dl>
        <dt>绘制工具功能</dt>
        <ul>
          <li><label><input type="radio" name="openClose" onclick="drawingManager.open()" checked="checked"/>打开</label>  <label><input type="radio" name="openClose" onclick="drawingManager.close()" />关闭</label></li>
        </ul>
        </dd>
        <dt>是否进行线或面积的计算(单位米)</dt>
        <ul>
          <li><label><input type="radio" name="areaRadio" onclick="drawingManager.enableCalculate()"/>打开</label>  <label><input type="radio" name="areaRadio" onclick="drawingManager.disableCalculate()"  checked="checked"/>关闭</label></li>
        </ul>
        </dd>
        <dt>绘制功能</dt>
        <dd>
          <ul>
            <li>
              <label><input type="radio" name="drawmode" onclick="drawingManager.setDrawingMode(BMAP_DRAWING_MARKER)" checked="checked"/>画点</label>
              <input type="checkbox" id="isInfowindow"/> 是否带信息窗口
            </li>
            <li>
              <label><input type="radio" name="drawmode" onclick="drawingManager.setDrawingMode(BMAP_DRAWING_CIRCLE)"/>画圆</label>
            </li>
            <li>
              <label><input type="radio" name="drawmode" onclick="drawingManager.setDrawingMode(BMAP_DRAWING_POLYLINE)"/>画线</label>
            </li>
            <li>
              <label><input type="radio" name="drawmode" onclick="drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON)"/>画多边形</label>
            </li>
            <li>
              <label><input type="radio" name="drawmode" onclick="drawingManager.setDrawingMode(BMAP_DRAWING_RECTANGLE)"/>画矩形</label>
            </li>
          </ul>
        </dd>
        <dt>覆盖物操作</dt>
        <dd>
          <ul>
            <li>
              <input type="button" value="获取绘制的覆盖物个数" onclick="alert(overlays.length)"/>
              <input type="button" value="清除所有覆盖物" onclick="clearAll()"/>
              <input type="button" value="获取最后一个覆盖物信息" onclick="alert(overlays[overlays.length-1])"/>
            </li>
          </ul>
        </dd>
      </dl>

    </div>
  </div>

</template>

<script>
export default {
  name: "dramDemo",
  data() {
    return {
      map: null,
      styleOptions : {
        strokeColor:"#933",    //边线颜色。
        fillColor:"#345",      //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3,       //边线的宽度，以像素为单位。
        strokeOpacity: 0.5,	   //边线透明度，取值范围0 - 1。
        fillOpacity: 0.3,      //填充的透明度，取值范围0 - 1。
        strokeStyle: 'dashed' //边线的样式，solid或dashed。
      },
      drawingManager: undefined,
      result: ''
    }
  },
  methods: {
    init() {
      this.map = new window.BMap.Map('map',{
        enableMapClick: false
      })
      const poi = new window.BMap.Point(116.307852,40.057031)
      this.map.centerAndZoom(poi, 15)
      this.map.enableScrollWheelZoom()
      this.drawingManager = new window.BMapLib.DrawingManager(map, {
        isOpen: false, //是否开启绘制模式
        enableSorption: true, // 绘面吸附功能
        enableGpc: true, // 打开裁剪面功能
        sorptionDistance: 100, // 可吸附距离，像素单位
        drawingMode: BMAP_DRAWING_POLYGON, //默认的绘制类型
        enableCalculate: false, //是否开启计算模式
        enableDrawingTool: true, //是否显示工具栏
        drawingToolOptions: {
          anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
          offset: new BMap.Size(5, 5), //偏离值
          scale: 1, //工具栏缩放比例
          drawingModes : [
            BMAP_DRAWING_MARKER, //画点
            BMAP_DRAWING_CIRCLE, //画圆
            BMAP_DRAWING_POLYLINE, //画线
            BMAP_DRAWING_POLYGON, //画多边形
            BMAP_DRAWING_RECTANGLE //画矩形
          ]
        },
        markerOptions: {}, //Marker的可选参数
        circleOptions: styleOptions, //圆的样式
        polylineOptions: styleOptions, //线的样式
        polygonOptions: styleOptions, //多边形的样式
        rectangleOptions: styleOptions //矩形的样式
      });

      this.drawingManager.open()
      this.drawingManager.addEventListener('circlecomplete', e => { console.log(e)})

      let overlays = [];
      let overlaycomplete = function(e){
        overlays.push(e.overlay);
        let result = "";
        result = "<p>";
        result += e.drawingMode + ":";

        if (e.drawingMode == BMAP_DRAWING_CIRCLE) {
          result += ' 半径：' + e.overlay.getRadius();
          result += ' 中心点：' + e.overlay.getCenter().lng + "," + e.overlay.getCenter().lat;
        }

        result += "</p>";
        this.result = result
      };
      drawingManager.addEventListener('overlaycomplete', overlaycomplete);
    }
  }


}

</script>

<style scoped lang="less">
body, html{width: 100%;height: 100%;overflow: hidden;margin:0;}
#allmap {margin-right: 300px;height: 100%;overflow: hidden;}
#result {border-left:1px dotted #999;height:100%;width:295px;position:absolute;top:0px;right:0px;font-size:12px;}
dl,dt,dd,ul,li{
  margin:0;
  padding:0;
  list-style:none;
}
p{font-size:12px;}
dt{
  font-size:14px;
  font-family:"微软雅黑";
  font-weight:bold;
  border-bottom:1px dotted #000;
  padding:5px 0 5px 5px;
  margin:5px 0;
}
dd{
  padding:5px 0 0 5px;
}

li{
  line-height:28px;
}
</style>
