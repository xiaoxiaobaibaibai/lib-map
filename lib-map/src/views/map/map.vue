/* eslint-disable */
<template>
  <div class="map">
    <baidu-map :center="'杭州'" :zoom="zoom" @ready="handler" style="width:100%;height:100%" @click="getClickInfo"
               :scroll-wheel-zoom='true'>
      <bm-city-list anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-city-list>
    </baidu-map>
  </div>
</template>
<script>
export default {
  name: 'TestBaiDu',
  data () {
    return {
      center: { lng: 109.45744048529967, lat: 36.49771311230842 },
      zoom: 13
    }
  },
  methods: {
    handler ({ BMap, map }) {
      // 初始化地图,设置中心点坐标
      var point = new BMap.Point(119.8025089500, 25.4890556400)
      map.centerAndZoom(point, 13)

      // 添加鼠标滚动缩放
      map.enableScrollWheelZoom()
      // 添加缩略图控件
    //  map.addControl(new BMap.OverviewMapControl({ isOpen: false, anchor: BMAP_ANCHOR_BOTTOM_RIGHT }))
      // 添加缩放平移控件
      map.addControl(new BMap.NavigationControl());
      //添加比例尺控件
      map.addControl(new BMap.ScaleControl());
      //添加地图类型控件
      //map.addControl(new BMap.MapTypeControl());

      map.setMapStyleV2({
        styleId: 'baab47c6fa5dcdcbea17611febadf609'
      });

      //设置标注的图标
      var icon = new BMap.Icon("./static/img/map.png", new BMap.Size(100, 100));
      //设置标注的经纬度
      var marker = new BMap.Marker(new BMap.Point(121.160724, 31.173277), {icon: icon});
      //把标注添加到地图上
      map.addOverlay(marker);
      var content = "<table>";
      content = content + "<tr><td> 编号：001</td></tr>";
      content = content + "<tr><td> 地点：上海汉得信息技术股份有限公司</td></tr>";
      content = content + "<tr><td> 时间：2018-1-3</td></tr>";
      content += "</table>";
      var infowindow = new BMap.InfoWindow(content);
      // 图标点击的时候显示标注
      marker.addEventListener("click", function () {
        this.openInfoWindow(infowindow);
      });
      // 标注默认显示
      // var infoWindow = new BMap.InfoWindow(content) // 创建信息窗口对象
      // map.openInfoWindow(infoWindow, point)
    },
    getClickInfo(e) {
      console.log(e.point.lng)
      console.log(e.point.lat)
      this.center.lng = e.point.lng
      this.center.lat = e.point.lat
    }
  }
}
</script>
<style lang="less">
.map {
  height: 1000px;
}
</style>
