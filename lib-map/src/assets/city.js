const city = [
  {
    initials: 'A',
    content: [
      {
        province: '安徽',
        city: [	'合肥', '安庆', '蚌埠', '亳州', '巢湖', '池州', '滁州', '阜阳', '淮北', '淮南', '黄山', '六安', '马鞍山', '宿州', '铜陵', '芜湖', '宣城']
      }
    ],
  },
  {
    initials: 'F',
    content: [
      {
        //	福建:	福州 龙岩 南平 宁德 莆田 泉州 三明 厦门 漳州
        province: '福建',
        city: [	'福州', '龙岩', '南平', '宁德', '莆田', '泉州', '三明', '厦门', '漳州']
      }
    ],
  },
// G
// 甘肃:	兰州 白银 定西 甘南州 嘉峪关 金昌 酒泉 临夏州 陇南 平凉 庆阳 天水 武威 张掖
// 广东:	广州 潮州 东莞 佛山 河源 惠州 江门 揭阳 茂名 梅州 清远 汕头 汕尾 韶关 深圳 阳江 云浮 湛江 肇庆 中山 珠海
// 广西:	南宁 百色 北海 崇左 防城港 桂林 贵港 河池 贺州 来宾 柳州 钦州 梧州 玉林
// 贵州:	贵阳 安顺 毕节市 六盘水 铜仁市 遵义 黔西南州 黔东南州 黔南州
  {
    initials: 'G',
    content: [
      {
        province: '甘肃',
        city: [	'兰州', '白银', '定西', '甘南州', '嘉峪关', '金昌', '酒泉', '临夏州', '陇南', '平凉', '庆阳', '天水', '武威', '张掖']
      },
      {
        province: '广东',
        city: [	'广州', '潮州', '东莞', '佛山', '河源', '惠州', '江门', '揭阳', '茂名', '梅州', '清远', '汕头', '汕尾', '韶关', '深圳', '阳江', '云浮', '湛江', '肇庆', '中山', '珠海']
      },
      {
        province: '广西',
        city: [	'南宁', '百色', '北海', '崇左', '防城港', '桂林', '贵港', '河池', '贺州', '来宾', '柳州', '钦州', '梧州', '玉林']
      },
      {
        province: '贵州',
        city: [	'贵阳', '安顺', '毕节市', '六盘水', '铜仁市', '遵义', '黔西南州', '黔东南州', '黔南州']
      }
    ],
  },
  //H
  // 海南:	海口 白沙 保亭 昌江 儋州 澄迈 东方 定安 琼海 琼中 乐东 临高 陵水 三亚 屯昌 万宁 文昌 五指山
  // 河北:	石家庄 保定 沧州 承德 邯郸 衡水 廊坊 秦皇岛 唐山 邢台 张家口
  // 河南:	郑州 安阳 鹤壁 焦作 开封 洛阳 漯河 南阳 平顶山 濮阳 三门峡 商丘 新乡 信阳 许昌 周口 驻马店
  // 黑龙江:	哈尔滨 大庆 大兴安岭地区 鹤岗 黑河 鸡西 佳木斯 牡丹江 七台河 齐齐哈尔 双鸭山 绥化 伊春
  // 湖北:	武汉 鄂州 恩施 黄冈 黄石 荆门 荆州 潜江 神农架林区 十堰 随州 天门 仙桃 咸宁 襄阳 孝感 宜昌
  // 湖南:	长沙 常德 郴州 衡阳 怀化 娄底 邵阳 湘潭 湘西州 益阳 永州 岳阳 张家界 株洲
  {
    initials: 'H',
    content: [
      {
        province: '海南',
        city: [	'海口', '白沙', '保亭', '昌江', '儋州', '澄迈', '东方', '定安', '琼海', '琼中', '乐东', '临高', '陵水', '三亚', '屯昌', '万宁', '文昌', '五指山']
      },
      {
        province: '河北',
        city: [	'石家庄', '保定', '沧州', '承德', '邯郸', '衡水', '廊坊', '秦皇岛', '唐山', '邢台', '张家口']
      },
      {
        province: '河南',
        city: [	'郑州', '安阳', '鹤壁', '焦作', '开封', '洛阳', '漯河', '南阳', '平顶山', '濮阳', '三门峡', '商丘', '新乡', '信阳', '许昌', '周口', '驻马店']
      },
      {
        province: '贵州',
        city: [	'贵阳', '安顺', '毕节市', '六盘水', '铜仁市', '遵义', '黔西南州', '黔东南州', '黔南州']
      }
    ],
  }
]

const mapConstant = {
  //三级（市，区县，街道）直辖市，除此之外的省都是四级（省，市，区县，街道）
  municipality: ["北京市","天津市","上海市","重庆市","香港特别行政区","澳门特别行政区"],
//最小级zoom，省级zoom
  ZOOM_PROVINCE_LEVEL: 5,
//市级zoom
  ZOOM_CITY_LEVEL: 8,
//区县级zoom
  ZOOM_DISTRICT_LEVEL: 11,
//街道级zoom
  ZOOM_STREET_LEVEL: 13,
//缩放最大级别 zoom
  ZOOM_MAX_LEVEL: 17,
//当前zoom级别
//   current_zoom: ZOOM_PROVINCE_LEVEL,

//省市区县级别
  LEVEL_PROVINCE: 1,
  LEVEL_CITY: 2,
  LEVEL_DISTRICT: 3,
  LEVEL_STREET: 4,

//事件控制变量
  marker_mouseover_flag: true
}

const forceSearch = {
  position: {
    lng: 'xxx',
    lat: 'xxx'
  },
  data: [
    {
      lng: 'xxx',
      lat: 'xxx',
      name: 'xxx',
      count: ''
    },
    {
      lng: 'xxx',
      lat: 'xxx',
      count: ''
    },
  ]
}




/**
 * 渲染标记和标签(重点方法)
 * @param map map地图对象
 * @param level 地图级别 1：省级 2：市级 3：区县级
 * @param data json数据
 * @param markerClickCallback 标记点击事件方法回调函数
 * @param center 中心坐标
 */
// function renderMarkersAndLabels(map, level, data, markerClickCallback, center, isClick) {
//   //设置所有覆盖物均可清除
//   setAllOverLayClear(map);
//   //清除所有覆盖物
//   removeOverlay(map);
//   //点击时需要设置zoom级别与定位中心，并将current_zoom置为当前zoom
//   if(level != LEVEL_PROVINCE && center){
//     if(level == LEVEL_CITY && isClick){
//       map.setZoom(ZOOM_CITY_LEVEL);
//       current_zoom = ZOOM_CITY_LEVEL;
//       map.panTo(center);
//     }
//     else if(level == LEVEL_DISTRICT && isClick){
//       map.setZoom(ZOOM_DISTRICT_LEVEL);
//       current_zoom = ZOOM_DISTRICT_LEVEL;
//       map.panTo(center);
//     }
//     else if(level == LEVEL_STREET && isClick){
//       map.setZoom(ZOOM_STREET_LEVEL);
//       current_zoom = ZOOM_STREET_LEVEL;
//       map.panTo(center);
//     }
//   }
//   //1,2,3级地图省略道路，4级地图展示道路
//   if(level == LEVEL_STREET){
//     map.setMapStyle({});
//   }
//   else{
//     map.setMapStyle({
//       styleJson:[
//         {
//           "featureType": "road",
//           "elementType": "all",
//           "stylers": {
//             "color": "#ffffff",
//             "visibility": "off"
//           }
//         }
//       ]
//     });
//   }
//   for (let i = 0; i < data.length; i++) {
//     let d = data[i];
//     if (d.position) {
//       let x = d.position.split(",")[0];
//       let y = d.position.split(",")[1];
//       let TXPointArr = [new BMap.Point(y,x)];
//       //腾讯坐标系 转化为 百度坐标系
//       new BMap.Convertor().translate(TXPointArr, 3, 5, function (data) {
//         //标记显示文本
//         let labelContent;
//         //悬停信息框展示文本
//         let windowInfoContent;
//         //获取图片的序号 对应m0-m9.png
//         let img_num;
//         //图片的偏移位置大小
//         let size;
//         if (level == LEVEL_PROVINCE) {
//           windowInfoContent = "省份：" + d.provinceName + "<br>排名：" + d.rank + "<br>省销售额：" + d.sale + "<br>省门店数量：" + d.shopNum;
//           labelContent = d.shopNum;
//           //3.6保证35个省能分布到0-9的渐进图片里，每张图有两个级别，偏移位置根据图片大小而定的
//           img_num = Math.floor(d.rank/3.6);
//           size = new BMap.Size(-10 - ((10 - img_num) * 0.6),-4 + (10 - img_num) * 0.2);
//         }
//         else if (level == LEVEL_CITY) {
//           windowInfoContent = "城市：" + d.cityName + "<br>排名：" + d.rank + "<br>市销售额：" + d.sale + "<br>市门店数量：" + d.shopNum;
//           labelContent = d.shopNum;
//           //2.2保证15个市能分布到0-7的渐进图片里，每张图有两个级别，偏移位置根据图片大小而定的
//           img_num = Math.floor(d.rank/2.2);
//           size = new BMap.Size(-8- ((10 - img_num) * 0.4),-4 + (10 - img_num) * 0.2);
//         }
//         else if (level == LEVEL_DISTRICT) {
//           windowInfoContent = "区县：" + d.districtName + "<br>排名：" + d.rank + "<br>区县销售额：" + d.sale + "<br>区县门店数量：" + d.shopNum;
//           labelContent = d.shopNum;
//           //2.2保证15个区县能分布到0-7的渐进图片里，每张图有两个级别，偏移位置根据图片大小而定的
//           img_num = Math.floor(d.rank/2.2);
//           size = new BMap.Size(-6- ((10 - img_num) * 0.4),-5 + (10 - img_num) * 0.2);
//         }
//         else if (level == LEVEL_STREET) {
//           windowInfoContent = "门店名称" + d.shopName + "<br>销售额：" + d.shopSale;
//           labelContent = d.shopName;
//         }
//         let marker;
//         let label;
//         //1,2,3级地图选用自定义marker，4级地图选用默认地图，且label也不一样
//         if(level != LEVEL_STREET){
//           //创建自定义icon以及自定义icon大小
//           let myIcon = new BMap.Icon("../static/slice/mendianfenbu/m"+ img_num + ".png", new BMap.Size(50+(10-img_num)*2,50+(10-img_num)*2));
//           marker = new BMap.Marker(data.points[0],{icon:myIcon});
//           let opts = {
//             position: data.points[0], // 指定文本标注所在的地理位置
//             offset:size
//           };
//           label = new BMap.Label(labelContent,opts);
//           label.setStyle({
//             color: "white",
//             fontSize: "4px",
//             height: "auto",
//             lineHeight: "6px",
//             fontFamily: "微软雅黑",
//             backgroundColor: 'none',
//             maxWidth: 'none',
//             border: 'none',
//             'font-weight':'bold'
//           });
//         }else{
//           marker = new BMap.Marker(data.points[0]);
//           let opts = {
//             position: data.points[0] // 指定文本标注所在的地理位置
//           };
//           label = new BMap.Label(labelContent,opts);
//           label.setStyle({
//             color: "black",
//             fontSize: "12px",
//             height: "auto",
//             lineHeight: "15px",
//             fontFamily: "微软雅黑",
//             backgroundColor: 'white',
//             maxWidth: 'none'
//           });
//         }
//
//         //禁止覆盖物在map.clearOverlays方法中被清除，与行政区划覆盖物区别
//         marker.disableMassClear();
//         label.disableMassClear();
//
//         //注册标记鼠标悬停事件
//         marker.addEventListener('mouseover',function (e) {
//           if(marker_mouseover_flag){
//             marker_mouseover_flag = false;
//             removeOverlay(map);
//             setTimeout(function(){
//               label.setContent(labelContent);
//               let opts = {
//                 width : 50,     // 信息窗口宽度
//                 height: 100,     // 信息窗口高度
//                 offset : new BMap.Size(20,-30), //信息窗口偏移
//               };
//               // 创建信息窗口对象
//               let infoWindow = new BMap.InfoWindow(windowInfoContent, opts);
//               //开启信息窗口
//               map.openInfoWindow(infoWindow,e.target.point);
//               if(level == LEVEL_PROVINCE){
//                 getBoundaryAndColor(map,d.provinceName);
//               }
//               else if(level == LEVEL_CITY){
//                 getBoundaryAndColor(map,d.cityName);
//               }
//               else if(level == LEVEL_DISTRICT){
//                 getBoundaryAndColor(map,d.districtName);
//               }
//               marker_mouseover_flag = true;
//             },300);
//           }
//         });
//
//         marker.addEventListener('mouseout',function () {
//           if(marker_mouseover_flag){
//             removeOverlay(map);
//           }
//         });
//
//
//
//         //初始化标记点击事件
//         if (markerClickCallback) {
//           markerClickCallback(map, marker,level);
//         }
//         map.addOverlay(marker);
//         map.addOverlay(label);
//       });
//     }
//   }
// }





export { city,mapConstant }
