//三级（市，区县，街道）直辖市，除此之外的省都是四级（省，市，区县，街道）
const municipality = ["北京市","天津市","上海市","重庆市","香港特别行政区","澳门特别行政区"];
//最小级zoom，省级zoom
const ZOOM_PROVINCE_LEVEL = 5;
//市级zoom
const ZOOM_CITY_LEVEL = 8;
//区县级zoom
const ZOOM_DISTRICT_LEVEL = 11;
//街道级zoom
const ZOOM_STREET_LEVEL = 13;
//缩放最大级别 zoom
const ZOOM_MAX_LEVEL = 17;
//当前zoom级别
let current_zoom = ZOOM_PROVINCE_LEVEL;

//省市区县级别
const LEVEL_PROVINCE = 1;
const LEVEL_CITY = 2;
const LEVEL_DISTRICT = 3;
const LEVEL_STREET = 4;

//事件控制变量
let marker_mouseover_flag = true;
————————————————
版权声明：本文为CSDN博主「coding_forever」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/liuyuqin1991/article/details/78052262
