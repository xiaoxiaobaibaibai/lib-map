<template>
  <div class="container">
    <search-wrap @focus="handleFocusMarker" @handleSet="handleSetCircle" ref="search"></search-wrap>
    <tip :name="addressTip" :num="numberTip" v-if="tipVisible" @nation="handleNation"></tip>
    <city-list @mark="handleMark" @select="mapCenter"></city-list>
    <drawer @handleSet="handleSetCircle" ref="drawer" @pageChange="pageChange"></drawer>
    <zoom @handleZoom="handleZoom"></zoom>
    <header-tab-search :current="'libMap'" class="fixed"></header-tab-search>
    <div id="selectbox_Drawing" class="selectbox_Drawing"></div>
    <div id="map">
    </div>
  </div>
</template>
<script>
import searchWrap from "@/components/search/searchWrap";
import cityList from "@/components/lib-map/cityList";
import card from "@/components/lib-map/card"
import zoom from "@/components/lib-map/zoom"
import HeaderTabSearch from "../../components/common/HeaderTabSearch";
import { style  } from "@/assets/mapstyle";
import { mapConstant } from "@/assets/city";
import draw from "@/components/lib-map/draw";
import drawer from "@/components/lib-map/drawer";
import tip from "@/components/lib-map/tip";
import { mapState, mapMutations } from "vuex"
import { MP,LoadJS } from "@/map";
import Vue from 'vue'
import axios from 'axios'
import {getQuery} from "@/assets/common/help";

export default {  name: 'TestBaiDu',
  data () {    return {
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
    // tipVisible: false, //强搜的tip显示
    addressTip: '', //强搜tip范围
    ak: 'fw9CfWuMOO6cfrERuEFKL4FOIUGQQ3dj',
    orgid: ''
  }  },
  components: {    searchWrap,
    cityList,
    draw,
    drawer,
    tip,
    card,
    zoom,
    HeaderTabSearch  },
  computed: {    ...mapState([
      'keyword',
      'companyConfig',
      'companyMap',
      'companyList',
      'tipVisible',
      'companyNum'
    ])  },
  methods: {    // 地图初始化
    ...mapMutations([      'setCompanyMap',
      'setCompanyList',
      'setCurrentCompany',
      'setTipVisible',
      'setCompanyNum'
    ]),
    init() {      debugger
      let point = new window.BMap.Point(120.306595, 30.42474);
      // 1,初始化地图
      this.map = new window.BMap.Map("map"); // 创建Map实例(鼠标右键控制倾斜角度)
      this.map.centerAndZoom(point, 15); // 初始化地图,设置中心点坐标和地图级别
      this.map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
      this.map.enableDragging()
      //个性化地图样式设置
      this.map.setMapStyleV2({        styleJson: style
        // styleId: 'baab47c6fa5dcdcbea17611febadf609'
      });

      const styleOptions = {        strokeColor: "#5E87DB", // 边线颜色
        fillColor: "#5E87DB", // 填充颜色。当参数为空时，圆形没有填充颜色
        strokeWeight: 1, // 边线宽度，以像素为单位
        strokeOpacity: 1, // 边线透明度，取值范围0-1
        fillOpacity: 0.2 // 填充透明度，取值范围0-1
      };

      const LineOptions = {        strokeColor: "transparent", // 边线颜色
        fillColor: "#5E87DB", // 填充颜色。当参数为空时，圆形没有填充颜色
        strokeWeight: 1, // 边线宽度，以像素为单位
        strokeOpacity: 1, // 边线透明度，取值范围0-1
        fillOpacity: 0.2 // 填充透明度，取值范围0-1
      };

      const labelOptions = {        borderRadius: "2px",
        background: "#FFFFFF",
        border: "1px solid #ECECF7",
        color: "#474762",
        fontSize: "14px",
        letterSpacing: "0",
        padding: "5px"
      };

      // 实例化鼠标绘制工具
      this.drawingManager = new window.BMapLib.DrawingManager(this.map, {        enableDrawingTool: false, // 是否显示工具栏
        enableCalculate: true, // 绘制是否进行测距(画线时候)、测面(画圆、多边形、矩形)
        drawingToolOptions: {          enableTips: true,
          customContainer: 'selectbox_Drawing',
          hasCustomStyle: true,
          offset: new window.BMap.Size(5, 5), // 偏离值
          scale: 0.8, // 工具栏缩放比例
          drawingModes: [            BMAP_DRAWING_RECTANGLE
            , BMAP_DRAWING_POLYGON
            , BMAP_DRAWING_CIRCLE
          ]        },
        enableSorption: true, // 是否开启边界吸附功能
        sorptionDistance: 20, // 边界吸附距离
        enableGpc: true, // 是否开启延边裁剪功能
        enbaleLimit: true,  // 是否开启超限提示
        limitOptions: {          area: 10 // 面积超限值
        },
        circleOptions: styleOptions, // 圆的样式
        // polylineOptions: LineOptions, // 线的样式
        // polygonOptions: styleOptions, // 多边形的样式
        // rectangleOptions: styleOptions, // 矩形的样式
        labelOptions: labelOptions // label的样式
      },this.handleMapSearch);

      //添加鼠标绘制工具监听事件，用于获取绘制结果
      this.drawingManager.addEventListener(        "overlaycomplete",
        this.overlaycomplete
      );

      // 给地图添加鼠标移动监听事件
      this.map.addEventListener("mousemove", () => {        if (this.drawingManager._mask != null) {
        this.drawingManager._mask.addEventListener("mousedown", this.showCirle);
        this.map.removeEventListener("mousemove", this.showCirle);
      }      });

      if(this.orgid) {        this.getPointByOrgid()
      }else {
        this.getLocationServer()
      }

    },
    // 获取浏览器当前定位 客户端不支持，网页可用
    getLocation() {        debugger
      let geolocation = new window.BMap.Geolocation()        let _this = this
      geolocation.getCurrentPosition((r) => {          console.log(r)
        let point
        if(r.point) {
          point = r.point
        } else {            //ths 定位
        }          this.map.panTo(point)
      })
    },
    // 服务端获取当前定位
    getLocationServer() {        axios({
      url: '/standardgwapi/api/company_library/map/get_ip_coor',
      method: 'get',
    }).then(res => {          if(res.code == 1) {
      this.mapCenter(res.data.coordinates)
    }
    })
    },
    /**
     * 逆地址解析函数（根据坐标点获取详细地址）
     * @param {Object} point   百度地图坐标点，必传
     */
    getAddrByPoint(point){        let geco = new window.BMap.Geocoder();

      return new Promise((resolve,reject) => {          geco.getLocation(point, (res) => {
        this.address = res
        console.log('地址解析', res)
        resolve(true)
      })
      })

    },
    handleMark() {        this.map.clearOverlays()

      // debugger
      // this.map.setDefaultCursor("url('http://172.19.80.62:81/gwstatic/static/company_web/public/sign.cur')  3 6, default")
      // this.map.disableDragging()
      // this.map.disableScrollWheelZoom()
      //
      // this.map.addEventListener('click', e => { //给地图绑定点击事件
      //   this.getAddrByPoint(e.point) //点击后调用逆地址解析函数
      //   this.markOnMap(e.point)
      // })
      //同时只有一个circle存在
      if(this.drawingManager) {          this.drawingManager.clearOverlays()
        this.drawingManager.close()
      }


      //点击左键设定中心点,右键或Esc退出

      window.addEventListener('keydown', this.quitDrawMode)
      console.log(this.drawingManager)
      this.drawingManager.setDrawingMode(BMAP_DRAWING_CIRCLE);
      this.drawingManager.open(BMAP_DRAWING_CIRCLE)
    },
    quitDrawMode(e) {      const keyCode = e.code

      console.log('keycode', e, keyCode)
      if(keyCode == 'Escape' && this.drawingManager) {
        this.drawingManager.close()
      }

    },
    markOnMap(p) {        debugger
      const lng = p.lng, lat = p.lat
      const point = new window.BMap.Point(lng, lat)       // const marker = new window.BMap.Marker(point);        // 创建标注
      // this.map.addOverlay(marker);                     // 将标注添加到地图中
      this.addMarker(point)     },
    //强搜标记物
    addMarker (point, name, value,areaType){  // 创建图标对象
      // 创建标注对象并添加到地图
      //   let marker = new window.BMap.Marker(point, {icon: myIcon});
      //    const marker = new window.BMap.Marker(point);
      //    this.map.addOverlay(marker);
      const labelContent = `<div class="map-info"><span class="map-info-title">${name}</span><span class="map-info-content">${value}家</span></div>`
      let opts = {          position: point, // 指定文本标注所在的地理位置
      };
      let label = new window.BMap.Label(labelContent, opts)        label.addEventListener('click', e => this.handleLabel(name, areaType))
      //允许覆盖物在map.clearOverlays方法中被清除
      label.enableMassClear()        label.setStyle({
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
      this.map.addOverlay(label)  },
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
    renderFocusMarker(data, areaType) {
      this.map.clearOverlays()
      // 1，将地图中心点定位到省市，格式化缩放级别
      // const point = new window.BMap.Point(lng, lat)
      // this.map.panTo(point)
      data.forEach(item => {          this.numberTip += item.total
        const lng = item.coordinates.split(',')[0]          const lat = item.coordinates.split(',')[1]
        const point = new window.BMap.Point(lng, lat)

        this.addMarker(point,item.name,item.value, areaType)
      })

      this.setTipVisible(true)

      // this.map.removeEventListener("zoomend", e => this.handleFocusMarker(this.keyword))
      // this.map.addEventListener("zoomend",e => this.handleFocusMarker(this.keyword));

    },

    handleFocusMarker(keyword) {        debugger

      //1,点击强搜，获取中心点  当前缩放等级
      const point = this.map.getCenter()        const zoom = this.map.getZoom()

      //2,根据中心点获取地理信息
      this.getAddrByPoint(point).then(res => {          console.log('point,zoom',point,zoom)

        // city: "杭州市"; district: "临平区"; province: "浙江省"; street: "西大街"; streetNumber: "33号"; town: ""

        const addressComponent = this.address.addressComponents          console.log('addressComponent',addressComponent)
        //3,根据对应的zoom级别调整参数
        let areaType = ''

        switch (true) {            case (zoom < 5):
          areaType = '';
          break
          case (zoom <= 10):              areaType = addressComponent.province;
            this.addressTip = addressComponent.province
            break
          case (zoom <= 15):              areaType = `${addressComponent.province}-${addressComponent.city}`;
            this.addressTip = addressComponent.city
            break
        }
        const url =  '/standardgwapi/api/company_library/map/force_search'
        // const url = 'http://software.myhexin.com/yapi/mock/2486/standardgwapi/api/company_library/map/force_search'
        const data = {            areaType,
          keyword          }
        this.$getAxios(url, data, res => {
          if(res.code == 1) {
            this.renderFocusMarker(res.data.items,areaType)
          }
        })
      })
    },

    // handleFocusMarkerAuto(keyword) {
    //   switch (true) {
    //     case (zoom < 5):
    //       areaType = '';
    //       break
    //     case (zoom <= 10):
    //       areaType = addressComponent.province;
    //       this.addressTip = addressComponent.province
    //       break
    //     case (zoom <= 15):
    //       areaType = `${addressComponent.province}-${addressComponent.city}`;
    //       this.addressTip = addressComponent.city
    //       break
    //   }
    // },

    /**
     * 画圆
     */
    // draw(event) {
    //   debugger
    //   this.centerPoint = null; // 中心点
    //   this.label = null;
    //   this.polyline = null;
    //   let arr = document.getElementsByClassName("bmap-btn");
    //   for (let i = 0; i < arr.length; i++) {
    //     arr[i].style.backgroundPositionY = "0";
    //   }
    //   event.target.style.backgroundPositionY = "-52px";
    //   switch (event.target.id) {
    //     case "marker": {
    //       let drawingType = BMAP_DRAWING_MARKER;
    //       break;
    //     }
    //     case "polyline": {
    //       let drawingType = BMAP_DRAWING_POLYLINE;
    //       break;
    //     }
    //     case "rectangle": {
    //       let drawingType = BMAP_DRAWING_RECTANGLE;
    //       break;
    //     }
    //     case "polygon": {
    //       let drawingType = BMAP_DRAWING_POLYGON;
    //       break;
    //     }
    //     case "circle": {
    //       let drawingType = BMAP_DRAWING_CIRCLE;
    //       break;
    //     }
    //   }
    //   // 进行绘制
    //   if (
    //     this.drawingManager._isOpen &&
    //     this.drawingManager.getDrawingMode() === drawingType
    //   ) {
    //     this.drawingManager.close();
    //   } else {
    //     this.drawingManager.setDrawingMode(drawingType);
    //     this.drawingManager.open();
    //   }
    // },

    // overlaycomplete(event) {
    //   console.log("完成绘制：------> ", event)
    //   console.log(this.centerPoint);
    //   console.log(this.label);
    //   console.log(this.polyline);
    //   this.centerPoint = null; // 中心点
    //   this.label = null;
    //   this.polyline = null;
    // },
    //
    // showCirle(event) {
    //   // 如果中心点是null
    //   if (this.centerPoint == null) {
    //     this.centerPoint = event.point; // 给中心点设置新的值
    //     this.drawingManager._mask.addEventListener("mousemove", this.showRadis);
    //     // let maker = new window.BMapGL.Marker(event.point);
    //     // this.map.addOverlay(maker);
    //   }
    // },
    //
    // /**
    //  * 半径
    //  */
    // showRadis(event) {
    //   let radius = this.drawingManager._map.getDistance(
    //     this.centerPoint,
    //     event.point
    //   );
    //   if (!isNaN(radius)) {
    //     this.map.removeOverlay(this.label); //清除上一个显示半径的label标注
    //     this.map.removeOverlay(this.polyline); //清除上一个圆的半径直线
    //     //添加文字标签
    //     let opts = {
    //       position: event.point, // 指定文本标注所在的地理位置（当前鼠标的位置）
    //       offset: new window.BMap.Size(5, -15) //设置文本偏移量
    //     };
    //     this.label = new window.BMap.Label(
    //       (radius / 1000).toFixed(2) + "公里",
    //       opts
    //     ); // 创建文本标注对象
    //     //文本标注样式
    //     this.label.setStyle({
    //       color: "#438eff",
    //       //fontSize:'14px',
    //       fontWeight: "bold",
    //       border: "0px solid #ccc",
    //       backgroundColor: "" //#2267AD
    //     });
    //     //从圆心画半径
    //     this.polyline = new window.BMap.Polyline(
    //       [this.centerPoint, event.point],
    //       {
    //         strokeColor: "red",
    //         strokeWeight: 2,
    //         strokeOpacity: 0.5
    //       }
    //     ); //后面参数为划线的样式
    //     this.map.addOverlay(this.polyline); //添加半径直线
    //     this.map.addOverlay(this.label); //添加label
    //   }
    // },
    //通过地名str设置地图中心点
    mapCenter(str) {        debugger
      //   this.getPointByAddress(str)
      this.map.centerAndZoom(str)      },

    /**
     * baidu服务 地址转坐标
     */
    getPointByAddress(address, ak = 'fw9CfWuMOO6cfrERuEFKL4FOIUGQQ3dj') {
      const url = `http://api.map.baidu.com/geocoding/v3/`
      const data = {          ak,
        address        }

      this.$getAxios(url,data,res => this.handlePointByAddress(res))
    },

    handlePointByAddress(res) {        //{"status":0,"result":{"location":{"lng":116.3084202915042,"lat":40.05703033345938},"precise":1,"confidence":80,"comprehension":100,"level":"门址"}}
      if(res.status == 0) {          console.log('location',res.result.location)
        return res.result.location
      }      },
    // 浏览全国
    handleNation() {        this.map.clearOverlays()
      this.map.setZoom(5)
      this.tipVisible = false
      this.handleFocusMarker(this.keyword)      },

    //强搜层级跳转
    handleLabel(name, areaType) {        console.log('name', name, areaType)
      const zoom  = this.map.getZoom()
      const type = `${areaType}-${name}`

      this.map.clearOverlays()        this.map.centerAndZoom(type)

      if(areaType.split('-').length >= 2) {
        const url = '/standardgwapi/api/company_library/map/company_list'
        const data = {            areaType: type,
          keyword: this.keyword
        }          this.setCompanyMap(data)
        Object.assign(data, this.companyConfig)
        // const url = 'http://software.myhexin.com/yapi/mock/2486/standardgwapi/api/company_library/map/company_list'
        // const data = {
        //   searchType: 'map',
        //   coordinates: '116.34542845723273,39.87808348792308',
        //   distance: '3km',
        // }
        this.$getAxios(url, data, res => {            if(res.code == 1) {

          const myIcon = new window.BMap.Icon(require('./img/single-normal.svg'), new window.BMap.Size(24,24), {
            anchor: new window.BMap.Size(24, 24),
          })
          const markerArr = []

          res.data.items.forEach((item, index) => {
            const point = new window.BMap.Point(item.coordinates[0], item.coordinates[1]);
            const marker = new window.BMap.Marker(point, {icon: myIcon})                marker.customData = { index }
            markerArr.push(marker)
            // this.addComMarker(point, index)
          })              this.markerClustersPoint(markerArr)
          this.setCompanyList(res.data.items)
          this.setCompanyNum(res.data.total)
        }
        })

      }

      //通过子组件的enter方法重新调用父组件的handleFocusMarker,拿到最新的input
      this.$refs.search.handleEnter()      },

    //自动画圆
    handleSetCircle(props,p) {        console.log('props'. props)
      //arr 即 point两个坐标
      this.map.clearOverlays()        let point
      if(p) {
        point = p
      }else {
        if (props.coordinates) {
          point = new window.BMap.Point(props.coordinates[0], props.coordinates[1]);
        }else {            point = new window.BMap.Point(props.geoPoint[0], props.geoPoint[1]);
        }

      }
      const radius = 3000
      this.center_orgid = props.orgid
      props.companyNum = this.companyNum
      props.companyMap = this.companyMap
      this.drawingManager.setCircle(point, radius, this.handleMapSearch, this.handleCenterCompany, props)      },
    // 画圈标点回调
    handleMapSearch(point, radius) {        console.log('handleMapSearch',point, radius)
      // /company_library/map/company_list
      const coordinates = point.lng + ',' + point.lat


      let num = ((parseInt(radius))/1000).toFixed(1)        const distance = num > 10 ? 10 : num  + 'km'
      const url = '/standardgwapi/api/company_library/map/company_list'
      const data = {          coordinates,
        distance,
        center_orgid:  this.center_orgid
      }        this.setCompanyMap(data)
      Object.assign(data, this.companyConfig)
      // const url = 'http://software.myhexin.com/yapi/mock/2486/standardgwapi/api/company_library/map/company_list'
      // const data = {
      //   searchType: 'map',
      //   coordinates: '116.34542845723273,39.87808348792308',
      //   distance: '3km',
      // }
      this.$getAxios(url, data, res => {          if(res.code == 1) {
        this.setCompanyList(res.data.items)
        console.log('画圈标点拿到结果===', res.data.items)

        this.setCompanyNum(res.data.total)
        this.$refs.drawer.handleOpenDrawer()

        const myIcon = new window.BMap.Icon(require('./img/single-normal.svg'), new window.BMap.Size(24,24), {
          anchor: new window.BMap.Size(24, 24),
        })
        const markerArr = []

        res.data.items.forEach((item, index) => {
          const point = new window.BMap.Point(item.coordinates[0], item.coordinates[1]);
          const marker = new window.BMap.Marker(point, {icon: myIcon})                marker.customData = { index }

          const props = res.data.items[index]
          const companyNum = this.companyNum
          const companyMap = this.companyMap
          const func = this.handleSetCircle


          marker.addEventListener("click", function() {                  console.log("点击自定义单点maker");

            let MyComponent = Vue.extend({                    template:
                `<div class="card">
                <section class="title">
                  <p>
              <!--      <span class="flex_1">[中心点]</span>-->
                    <span class="flex_2">{{company.state}}</span>
                    <span class="flex_4" :class="{jump: company.jumpCmd}" @click="handleJump">{{company.company_name}}</span>
                  </p>
                </section>
                <section>
                  <p class="desc">
                    <span class="desc-title">地址</span>
                    <span class="desc-info">{{company.address}}</span>
                  </p>
                  <p class="op">
                    <span class="operate" @click="handleClick(company)">搜周边</span>
                  </p>
                </section>
              </div>`,
              data () {                      return {
                company: props,
                companyNum: companyNum,
                companyMap: companyMap                      }
              },
              mounted () {},
              computed: {},
              methods: {                      handleClick: func,
                handleJump() {                        location.href = this.company.jum_cmd
                }
              }
            })

            let component = new MyComponent().$mount()



            const infoBox = new BMapLib.InfoBox(this.map,component.$el,{
              boxStyle:{
                background: "#fff",
                width: "276px",
                maxHeight: "244px",
                borderRadius: "2px",
              },
              //closeIconUrl: require("img/close.png"),
              closeIconMargin: "0px 0px 0 0",
              enableAutoPan: true,
              align: INFOBOX_AT_TOP

            })                  infoBox.open(marker)

          });



          markerArr.push(marker)                // this.addComMarker(point, index)
        })            this.markerClustersPoint(markerArr)

      }
      })
      this.$refs.drawer.getAllChartData()
    },
    // 画圈标点
    // setMapMark(data) {
    //   const myIcon = new window.BMap.Icon(require('./img/single-normal.svg'), new window.BMap.Size(24,24), {
    //     anchor: new window.BMap.Size(24, 24),
    //   })
    //
    //   const markerArr = []
    //
    //   data.forEach((item, index) => {
    //     const point = new window.BMap.Point(item.coordinates[0], item.coordinates[1]);
    //     const marker = new window.BMap.Marker(point, {icon: myIcon})
    //     marker.customData = { index }
    //     markerArr.push(marker)
    //     // this.addComMarker(point, index)
    //   })
    //     this.markerClustersPoint(markerArr)
    //     // let markerClusterer = new BMapLib.MarkerClusterer(map, {markers:markerArr});
    //     // this.map.addOverlay(markerClusterer)
    //
    // },
    // 画圈标点单独
    // 公司标记物 - 多点聚合
    addComMarker(point, index) {        const myIcon = new window.BMap.Icon(require('./img/single-normal.svg'), new window.BMap.Size(24,24), {
      anchor: new BMap.Size(24, 24),
    })
      const marker = new window.BMap.Marker(point, {icon: myIcon})

      const props = this.companyList[index]
      const companyNum = this.companyNum
      const companyMap = this.companyMap
      const func = this.handleSetCircle


      marker.addEventListener("click", function() {          console.log("点击自定义单点maker");

        let MyComponent = Vue.extend({            template:
            `<div class="card">
                <section class="title">
                  <p>
              <!--      <span class="flex_1">[中心点]</span>-->
                    <span class="flex_2">{{company.state}}</span>
                    <span class="flex_4" :class="{jump: company.jumpCmd}" @click="handleJump">{{company.company_name}}</span>
                  </p>
                </section>
                <section>
                  <p class="desc">
                    <span class="desc-title">地址</span>
                    <span class="desc-info">{{company.address}}</span>
                  </p>
                  <p class="op">
                    <span class="operate" @click="handleClick(company)">搜周边</span>
                  </p>
                </section>
              </div>`,
          data () {              return {
            company: props,
            companyNum: companyNum,
            companyMap: companyMap              }
          },
          mounted () {},
          computed: {},
          methods: {              handleClick: func,
            handleJump() {                location.href = this.company.jum_cmd
            }
          }
        })

        let component = new MyComponent().$mount()

        const infoBox = new BMapLib.InfoBox(this.map,component.$el,{
          boxStyle:{
            background: "#fff",
            width: "276px",
            maxHeight: "244px",
            borderRadius: "2px",
          },
          //closeIconUrl: require("img/close.png"),
          closeIconMargin: "0px 0px 0 0",
          enableAutoPan: true,
          align: INFOBOX_AT_TOP

        })          infoBox.open(marker)

      });
      marker.enableMassClear()        this.map.addOverlay(marker);
      //
      return marker;
    },

    // 公司标记点击呼出infoWindow
    // setInfoWindow(e, index) {
    //   console.log(e, index)
    //   this.setCurrentCompany(index)
    //   const option = {
    //     width: 270, // 信息窗口宽度
    //     height: 100, // 信息窗口高度
    //     // title: `温馨提示(自定义)`, // 信息窗口标题
    //     // enableMessage: true // 设置允许信息窗发送短息
    //   }
    //
    //   const props = this.companyList[index]
    //   const companyNum = this.companyNum
    //   const companyMap = this.companyMap
    //
    //   console.log('props', props, companyNum, companyMap)
    //
    //
    //   let MyComponent = Vue.extend({
    //     template: `<div class="card">
    //                   <section class="title">
    //                     <p>
    //                       <span class="flex_1">[中心点]</span>
    //                       <span class="flex_2">{{company.state}}</span>
    //                       {{company.company_name}}
    //                     </p>
    //                   </section>
    //                   <section>
    //                     <p class="desc">
    //                       <span class="desc-title">范围</span>
    //                       <span class="desc-info">{{companyMap.distance}}</span>
    //                       <span class="desc-title desc_2">企业数量</span>
    //                       <span class="desc-info">{{companyNum}}家</span>
    //                     </p>
    //                     <p class="desc">
    //                       <span class="desc-title">地址</span>
    //                       <span class="desc-info" :title="company.address">{{company.address}}
    //                 </span>
    //                     </p>
    //                   </section>
    //                   <div class="triangle-bottom"></div>
    //                 </div>`,
    //     data() {
    //       return {
    //         company: props,
    //         companyNum: companyNum,
    //         companyMap: companyMap
    //       }
    //     },
    //   })
    //
    //   let lng = this.companyList[index].coordinates[0]
    //   let lat = this.companyList[index].coordinates[1]
    //   let point = new window.BMap.Point(lng, lat)
    //
    //   let component = new MyComponent().$mount()
    //   let infoWindow = new window.BMap.InfoWindow(component.$mount().$el, option)
    //   this.map.openInfoWindow(infoWindow, point)
    // },

    //聚合封装函数

    //  多点聚合的思路1. 根据百度聚合API创建聚合点，但是只需要用到点聚合后的数据，利用自定义样式进行隐藏此聚合点（目的是消除默认聚合点会点击放大效果）
    //             2. 拿到数据后创建一个自定义标注marker，可设置标注样式（相当于利用标注模拟一个聚合点）
    //             3. 创建标注的label，自定义label样式，用来显示聚合数量（利用聚合API的数据可得到聚合点的marker数量，进行自定义label样式模拟聚合点数字的显示）
    //             4. 给marker设置点击监听事件，自定义事件函数内容
    markerClustersPoint(markers) {        debugger
      if(!markers) {           return
      }        this.removeSignMarker('sign')

      if(this.markersClusterer) {
        this.markerClusterer.clearMarkers();//清除聚合
      }          this.markerClusterer = new window.BMapLib.MarkerClusterer(this.map, {
        markers: markers,
        minClusterSize: 2, //最小的聚合数量，小于该数量的不能成为一个聚合，默认为2
        styles: [              {
        }
        ],
        gridSize: 20 //
      });
      console.log("进入聚合函数markerClusterer", this.markerClusterer);

      //
      // 拿到所有的聚合点
      //markerClusterer中的 _clusters是一个数组，包含了可视范围的所有聚合点
      let cluster = this.markerClusterer._clusters;

      console.log('新的聚合', cluster)
      cluster.forEach(item => {
        if(item._markers.length > 2) {
          const cluserMakerSum = item._markers.length
          const custom = []              item._markers.forEach(el => {
            el.id == 'sign'
            custom.push(el.customData.index)              })

          this.addMarkerCluser(item._center, cluserMakerSum, custom)
        } else {
          item._markers.forEach(el => {
            el.id = 'sign'
            // this.map.addOverlay(el)
            // this.addComMarker(el.point, el.customData.index)
            this.map.addOverlay(el);

          })            }
      })
      // this.map.removeEventListener('zoomend', this.markerClustersPoint(markers))
      // this.map.addEventListener('zoomend', this.markerClustersPoint(markers))

    },
    // 多点聚合的标记 marker 中心点，聚合的数量，聚合内数据的标志物
    addMarkerCluser(point, cluserMakerSum,custom) {        const that = this
      const myIcon = new window.BMap.Icon(require('./img/multi-normal.svg'), new window.BMap.Size(28,24), {          anchor: new BMap.Size(24, 20),
      })        let markerdef = new window.BMap.Marker(point, {
        // icon: 设置marker样式
        icon: myIcon        });
      //设置marker的label
      let labelTitleCluser = cluserMakerSum ;
      let label = new window.BMap.Label(labelTitleCluser, {           offset: new window.BMap.Size(6, 0)
      });
      //设置label样式
      label.setStyle({          color: "#fff",
        fontSize: "14px",
        backgroundColor: "0.05",
        border: "0px",
        textAlign: "center"
      });
      markerdef.setLabel(label);
      markerdef.enableMassClear()        //监听点击事件

      const companyList = []        const num = custom.length
      const func = that.handleSetCircle

      custom.forEach(item => {          companyList.push(this.companyList[item]
      )
      })
      markerdef.addEventListener("click", function() {
        console.log("点击自定义聚合maker");
        let MyComponent = Vue.extend({            template:
            `<div class="card-mulit">
    <section class="title">
      <p>该区域共有<span class="num">{{num}}</span>家公司</p>
    </section>
    <section class="list">
    <div class="list" v-for="item in companyList" :key="item.orgid">
    <section class="left">
    <p>
                      <span class="flex_2">{{item.state}}</span>
                      <span class="flex_4" :class="{jump: item.jumpCmd}" @click="handleJump(item.jumpCmd)">{{item.company_name}}</span>
                    </p>
    <p class="desc">
                      <span class="desc-title">地址</span>
                      <span class="desc-info">{{item.address}}</span>
                    </p>
  </section>
  <section class="right">
  <span class="operate" @click="handleClick(item)">搜周边</span>
  </section>
  </div>
    </section>
  </div>`,
          data () {              return {
            companyList: companyList,
            num: num              }
          },
          mounted () {},
          computed: {},
          methods: {              handleJump(jumpCmd) {
              location.href = jumpCmd
            },
            handleClick: func
          }
        })

        let component = new MyComponent().$mount()

        const infoBox = new BMapLib.InfoBox(this.map,component.$el,{
          boxStyle:{
            background: "#fff",
            width: "276px",
            maxHeight: "244px",
            borderRadius: "2px",
          },
          //closeIconUrl: require("img/close.png"),
          closeIconMargin: "0px 0px 0 0",
          enableAutoPan: true,
          align: INFOBOX_AT_TOP

        })          infoBox.open(markerdef)

      });

      this.map.addOverlay(markerdef);
      //
      return markerdef;
    },

    // setInfoBox(point, index) {
    //
    //   const html = "<div class='infoBoxContent '><h3>哈哈哈公司</h3><hr /><div><p>所属部门：研发部门</p>" +
    //     "<p>主要工作：制造BUG</p><div align=\"center\"><button>我是按钮</button></div></div></div>";
    //   const infoBox = new BMapLib.InfoBox(map,html,{
    //     boxStyle:{
    //       opacity: "0.8",
    //       background: "#333333",
    //       width: "250px",
    //       height: "200px"
    //     },
    //     closeIconUrl: "img/close.png",
    //     closeIconMargin: "1px 1px 0 0",
    //     enableAutoPan: true,
    //     align: INFOBOX_AT_TOP
    //
    // })
    //   }

    getPointByOrgid(orgid) {          const url = '/standardgwapi/api/company_library/map/get_orgid_coor'
      const data = {            orgid
      }
      this.$getAxios(url, undefined, res => {
        if(res.code == 1) {
          const coord = res.data.coordinates.split(',')
          this.handleSetCircle(coord)
        }
      })
    },

    handleZoom(value) {          const zoom = this.map.getZoom()
      this.map.setZoom(zoom+value)
    },
    //删除地图上公司标记物
    removeSignMarker(id) {        const allOverlay = this.map.getOverlays()
      console.log(allOverlay)
      for(let i=0; i<allOverlay.length-1;i++) {
        if(allOverlay[i].id == id) {
          this.map.removeOverlay(allOverlay[i])
        }
      }
    },

    //中心点点击事件
    handleCenterCompany(marker,props) {       console.log("点击中心");
      const func = this.handleSetCircle


      let MyComponent = Vue.extend({           template:
          `<div class="card">
                <section class="title">
                  <p>
                    <span class="flex_1">[中心点]</span>
                    <span class="flex_2">{{company.state}}</span>
                    <span class="flex_4" :class="{jump: company.jumpCmd}" @click="handleJump">{{company.company_name}}</span>
                  </p>
                </section>
                <section>
                 <p class="desc">
      <span class="desc-title">范围</span>
      <span class="desc-info">{{company.companyMap.distance}}</span>
      <span class="desc-title desc_2">企业数量</span>
      <span class="desc-info">{{company.companyNum}}家</span>
      </p>
                  <p class="desc">
                    <span class="desc-title">地址</span>
                    <span class="desc-info">{{company.address}}</span>
                  </p>
                </section>
              </div>`,
        data () {             return {
          company: props,
        }           },
        mounted () {},
        computed: {},
        methods: {             handleClick: func,
          handleJump() {               location.href = this.company.jum_cmd
          }
        }
      })

      let component = new MyComponent().$mount()

      const infoBox = new BMapLib.InfoBox(this.map,component.$el,{
        boxStyle:{
          background: "#fff",
          width: "276px",
          maxHeight: "244px",
          borderRadius: "2px",
        },
        //closeIconUrl: require("img/close.png"),
        closeIconMargin: "0px 0px 0 0",
        enableAutoPan: true,
        align: INFOBOX_AT_TOP

      })         infoBox.open(marker)
    },

    pageChange() {        debugger
      this.removeSignMarker('sign')      const myIcon = new window.BMap.Icon(require('./img/single-normal.svg'), new window.BMap.Size(24,24), {
        anchor: new window.BMap.Size(24, 24),
      })
      const markerArr = []
      this.companyList.forEach((item, index) => {
        const point = new window.BMap.Point(item.coordinates[0], item.coordinates[1]);
        const marker = new window.BMap.Marker(point, {icon: myIcon})        marker.customData = { index }
        const func = this.handleSetCircle

        marker.addEventListener("click", function() {          console.log("点击自定义单点maker");

          let MyComponent = Vue.extend({            template:
              `<div class="card">
                <section class="title">
                  <p>
              <!--      <span class="flex_1">[中心点]</span>-->
                    <span class="flex_2">{{company.state}}</span>
                    <span class="flex_4" :class="{jump: company.jumpCmd}" @click="handleJump">{{company.company_name}}</span>
                  </p>
                </section>
                <section>
                  <p class="desc">
                    <span class="desc-title">地址</span>
                    <span class="desc-info">{{company.address}}</span>
                  </p>
                  <p class="op">
                    <span class="operate" @click="handleClick(company)">搜周边</span>
                  </p>
                </section>
              </div>`,
            data () {              return {
              company: item,
            }            },
            mounted () {},
            computed: {},
            methods: {              handleClick: func,
              handleJump() {                location.href = this.company.jum_cmd
              }
            }
          })

          let component = new MyComponent().$mount()



          const infoBox = new BMapLib.InfoBox(this.map,component.$el,{
            boxStyle:{
              background: "#fff",
              width: "276px",
              maxHeight: "244px",
              borderRadius: "2px",
            },
            //closeIconUrl: require("img/close.png"),
            closeIconMargin: "0px 0px 0 0",
            enableAutoPan: true,
            align: INFOBOX_AT_TOP

          })          infoBox.open(marker)

        });

        markerArr.push(marker)        // this.addComMarker(point, index)
      })      this.markerClustersPoint(markerArr)
    },


  },
  created() {
    this.orgid = getQuery('orgid')

    axios({
      url: '/standardgwapi/api/company_library/map/get_ak',
      method: 'get',
    }).then(res =>　{      if(res.code == 1) {
      this.ak = res.data
    }      MP(this.ak).then(BMap => {
      const p1 = LoadJS('https://api.map.baidu.com/library/TextIconOverlay/1.2/src/TextIconOverlay_min.js')
      const p2 = LoadJS('https://api.map.baidu.com/library/MarkerClusterer/1.2/src/MarkerClusterer_min.js')
      const p3 = LoadJS('/gwstatic/static/company_web/public/DrawingManager.js')
      const p4 = LoadJS('/gwstatic/static/company_web/public/gpc.js')
      const p5 = LoadJS('/gwstatic/static/company_web/public/InfoBox.js')

      Promise.all([p1,p2,p3,p4]).then(value => {
        this.init()
        this.map.addEventListener("zoomend",e=>{
          let zoom = this.map.getZoom()
          console.log('zoom', zoom)
        });
      })      })
    }).catch(err => {
      console.log('err', err)
      this.$message.error('抱歉，资源不存在！')
    })



  },
  mounted() {  // this.map.addEventListener("zoomend",e=>this.markerClustersPoint());


  }}
</script>
<style lang="less" scoped>
.fixed {  position: fixed;
}div.container {
   width: 100%;
   height: 100%;
   #map {    width: 100%;
     height: 100%;

     background-color: transparent !important;
   }}


/deep/ label.BMapLabel {
  .map-info {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    .map-info-title {      margin-top: 22px;
      font-size: 16px;
      letter-spacing: 0;
    }    .map-info-content {
           font-size: 14px;
           letter-spacing: 0;
         }  }
}

/deep/ span.BMap_Marker {
  z-index: 5!important;
}
/deep/.infoBoxContent{
  margin:20px;
  button{    background-color: #008CBA;
    border: none;
    color: white;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    border-radius: 16px;
    width: 120px;
  }  h3{
       color: white;
     }  p{
          color:white;
        }  &:before {
             content: '';
             width: 0;
             height: 0;
             border: 20px solid transparent;
             border-top-color: #333333;
             position: absolute;
             left: 50%;
             top: 100%;
             margin-left: -20px;
           }}

/deep/ .card {
  //position: relative;
  //margin-top: 100px;
  //margin-left: 40%;
  //background: #FFFFFF;
  ////border: 1px solid #ECECF7;
  //border-radius: 2px;
  //box-shadow: 0 4px 12px 0 rgba(10,39,86,0.15);
  //display: flex;
  //flex-direction: column;
  //height: 100px;
  //width: 226px;
  margin: 8px 0;
  section.title {    margin-left: 12px;
    display: flex;
    p {      font-weight: bold;
      font-family: MicrosoftYaHei-Bold;
      font-size: 12px;
      color: #1B63D9;
      line-height: 20px;
      text-align: left;
      width: 240px;
      margin-bottom: 0;
      .flex_1 {        font-family: Lucida Grande;
        font-size: 12px;
        color: #474762;
        line-height: 20px;
        font-weight: normal;
      }      .flex_2 {
               margin-left: 2px;
               padding: 0 4px;
               font-family: Microsoft YaHei;
               font-size: 12px;
               color: #0095C2;
               text-align: center;
               line-height: 14px;
               background: #E5F4F8;
               border-radius: 2px;
               font-weight: normal;
             }      .flex_4 {
                      color: #1B63D9;
                      &.jump {          cursor: pointer;
                      }      }
    }
    span.close {
      width: 24px;
      height: 24px;
      background:  #ECECF7;
      //background: url();
      border-radius: 0 3px 0 100px;
    }  }
  p.desc {
    margin: 0;
    text-align: left;
    padding-left: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .desc-title {      font-family: Microsoft YaHei;
      font-size: 12px;
      color: #7D7D94;
      line-height: 20px;
    }    .desc-info {
           margin-left: 4px;
           font-family: Microsoft YaHei;
           font-size: 12px;
           color: #272841;
           line-height: 20px;
           overflow: hidden;
           text-overflow: ellipsis;
           white-space: nowrap;
         }
    .desc_2 {
      margin-left: 16px;
    }  }
  p.op {
    display: flex;
    align-items: center;
    justify-content: center;
    span.operate {      font-size: 12px;
      color: #1B63D9;
      line-height: 20px;
      cursor: pointer;
    }  }
  &:before {
    content: '';
    width: 0;
    height: 0;
    border: 5px solid transparent;
    border-top-color: #fff;
    position: absolute;
    left: 50%;
    top: 100%;
    margin-left: -5px;
  }}

/deep/ .card-mulit {
  margin: 8px 0;

  section.title {    margin-left: 12px;
    display: flex;
    font-size: 12px;
    color: #272841;
    line-height: 20px;
    span.num {      color: #1B63D9;
    }  }
  section.list {
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    max-height: 200px;
    div.list {      display: flex;
      height: 50px;
      align-items: center;
      justify-content: space-around;
      section.left {        width: 180px;
        p {          span {
          display: inline-block;
          max-width: 168px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }          font-weight: bold;
          font-family: MicrosoftYaHei-Bold;
          font-size: 8px;
          color: #1B63D9;
          line-height: 20px;
          text-align: left;
          width: 240px;
          margin-bottom: 0;
          .flex_1 {            font-family: Lucida Grande;
            font-size: 12px;
            color: #474762;
            line-height: 20px;
            font-weight: normal;
          }          .flex_2 {
                       margin-left: 2px;
                       padding: 0 4px;
                       font-family: Microsoft YaHei;
                       font-size: 12px;
                       color: #0095C2;
                       text-align: center;
                       line-height: 14px;
                       background: #E5F4F8;
                       border-radius: 2px;
                       font-weight: normal;
                     }          .flex_4 {
                                  color: #1B63D9;
                                  &.jump {              cursor: pointer;
                                  }          }
        }

        p.desc {
          display: flex;
          margin: 0;
          text-align: left;
          align-items: center;
          //padding-left: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          .desc-title {            display: inline-block;
            font-family: Microsoft YaHei;
            font-size: 12px;
            color: #7D7D94;
            line-height: 20px;
          }          .desc-info {
                       display: inline-block;
                       max-width: 130px;
                       margin-left: 4px;
                       font-family: Microsoft YaHei;
                       font-size: 12px;
                       color: #272841;
                       line-height: 20px;
                       overflow: hidden;
                       text-overflow: ellipsis;
                       white-space: nowrap;
                     }
          .desc_2 {
            margin-left: 16px;
          }        }

      }
      section.right {
        span.operate {
          font-size: 12px;
          color: #1B63D9;
          line-height: 20px;
        }      }
      &:hover {
        background: #F7F7FC;
      }    }
    &::-webkit-scrollbar {
      width: 6px;
    }    &::-webkit-scrollbar-track {
           display: none;
         }    /* 滚动条角落 */
    &::-webkit-scrollbar-thumb {      /*滚动条的轨道*/
      background-color: #B7B7C7;
      border-radius: 4px;
      &:hover {        background-color:#9293AA
      }    }
  }


  &:before {
    content: '';
    width: 0;
    height: 0;
    border: 5px solid transparent;
    border-top-color: #fff;
    position: absolute;
    left: 50%;
    top: 100%;
    margin-left: -5px;
  }
}


</style>
