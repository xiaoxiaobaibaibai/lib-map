/* eslint-disable */
<template>
  <div>
    <search-wrap></search-wrap>
    <city-list></city-list>
    <div class="map">
      <baidu-map :zoom="zoom" @ready="handler" style="width:100%;height:100%" @click="getClickInfo"
                 :scroll-wheel-zoom='true'
                 :center="'杭州'"
      >
        <bm-marker :position="markerPoint" :dragging="true">

        </bm-marker>
      </baidu-map>
    </div>
  </div>
</template>
<script>
import searchWrap from "@/components/search/searchWrap";
import cityList from "@/components/lib-map/cityList";
export default {
  name: 'TestBaiDu',
  data () {
    return {
      center: { lng: 109.45744048529967, lat: 36.49771311230842 },
      zoom: 13,
      BMap: null
    }
  },
  components: {
    searchWrap,
    cityList
  },
  methods: {
      handler({ BMap, map }) {
        console.log('BMap,map',BMap,map)
      // 初始化地图,设置中心点坐标
      this.BMap = BMap
      let point = new BMap.Point(119.8025089500, 25.4890556400)
      map.centerAndZoom(point, 13)

      // // 添加鼠标滚动缩放
      // map.enableScrollWheelZoom()
      // // 添加缩略图控件
      // map.addControl(new BMap.OverviewMapControl({ isOpen: false, anchor: BMAP_ANCHOR_BOTTOM_RIGHT }))
      // // 添加缩放平移控件
      // map.addControl(new BMap.NavigationControl());
      // //添加比例尺控件
      // map.addControl(new BMap.ScaleControl());

      map.setMapStyleV2({
        styleId: '75a8ee3dba6ff183c466fad55e4d49c2'
      });

      this.getCurlocation()

        //设置标注的图标
      // var icon = new BMap.Icon("./static/img/map.png", new BMap.Size(100, 100));
      //设置标注的经纬度
      //var marker = new BMap.Marker(new BMap.Point(121.160724, 31.173277), {icon: icon});
      // //把标注添加到地图上
      // map.addOverlay(marker);
      // var content = "<table>";
      // content = content + "<tr><td> 编号：001</td></tr>";
      // content = content + "<tr><td> 地点：上海汉得信息技术股份有限公司</td></tr>";
      // content = content + "<tr><td> 时间：2018-1-3</td></tr>";
      // content += "</table>";
      // var infowindow = new BMap.InfoWindow(content);
      // 图标点击的时候显示标注
      // marker.addEventListener("click", function () {
      //   this.openInfoWindow(infowindow);
      // });
      // 标注默认显示
      // var infoWindow = new BMap.InfoWindow(content) // 创建信息窗口对象
      // map.openInfoWindow(infoWindow, point)
    },
      getClickInfo(e) {
        this.getAddrByPoint(e.point)
      },

      getCurlocation() { // 获取浏览器当前定位
        debugger
        if (!this.BMap) return false
        let BMap = this.BMap
        let geolocation = new BMap.Geolocation()
        console.log('geolocation',geolocation)
        let _this = this
        geolocation.getCurrentPosition(function(r) {
          _this.map_center = r.point
          _this.shop_lng = r.point.lng
          _this.shop_lat = r.point.lat
        })
    },
    /**
     * 逆地址解析函数（根据坐标点获取详细地址）
     * @param {Object} point   百度地图坐标点，必传
     */
      getAddrByPoint(point){
        debugger
        var that = this;
        var geco = new BMap.Geocoder();
        geco.getLocation(point, function(res){
          console.log(res)  //内容见下图
          that.BMap.panTo(point)  //将地图的中心点更改为给定的点
          that.form.address = res.address;  //记录该点的详细地址信息
          that.form.addrPoint = point;  //记录当前坐标点
        })
      }
    },
  mounted() {
  }
}
</script>
<style lang="less">
.map {
  height: 1000px;
}
</style>
