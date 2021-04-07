/* eslint-disable */
<template>
  <div>
    <search-wrap></search-wrap>
    <city-list @mark="handleMark"></city-list>
    <div id="map">
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
      map: null
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
        var geco = new window.BMapGL.Geocoder();
        geco.getLocation(point, function(res){
          console.log(res)
         // that.BMapGL.panTo(point)  //将地图的中心点更改为给定的点
         //  that.form.address = res.address;  //记录该点的详细地址信息
         //  that.form.addrPoint = point;  //记录当前坐标点
        })
      },
      init() {
        this.map = new window.BMapGL.Map("map", { enableMapClick: false }); // 创建Map实例,GL版命名空间为BMapGL(鼠标右键控制倾斜角度)
        this.map.centerAndZoom(new window.BMapGL.Point(116.404, 39.915), 11); // 初始化地图,设置中心点坐标和地图级别
        this.map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
       // this.map.setCurrentCity("杭州");
        console.log(this.map)
        // this.map.setMapStyleV2({
        //   styleId: 'baab47c6fa5dcdcbea17611febadf609'
        // });
        this.map.disableDragging()
        // this.map.setDefaultCursor('url("./sign_32.ico"),auto;');
        this.map.setDefaultCursor("http://172.19.80.62:81/gwstatic/static/company_web/public/sign.cur")
      },
      handleMark() {
        debugger
        this.map.setDefaultCursor("http://172.19.80.62:81/gwstatic/static/company_web/public/sign.cur")

        this.map.addEventListener('click', e => { //给地图绑定点击事件
          this.getAddrByPoint(e.point) //点击后调用逆地址解析函数
          this.markOnMap(e.point)
        })
      },
     markOnMap(p) {
        debugger
       const lng = p.lng, lat = p.lat
       const point = new BMapGL.Point(lng, lat)
       const marker = new BMapGL.Marker(point);        // 创建标注
       this.map.addOverlay(marker);                     // 将标注添加到地图中
     }



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
</style>
