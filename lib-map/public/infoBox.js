1 /**
 2  * @fileoverview 百度地图的自定义信息窗口，对外开放。
 3  * 用户自定义信息窗口的各种样式。例如：border，margin，padding，color，background等
 4  * 主入口类是<a href="symbols/BMapLib.InfoBox.html">InfoBox</a>，
 5  * 基于Baidu Map API 1.2。
 6  *
 7  * @author Baidu Map Api Group
 8  * @version 1.2
 9  */
10 /**
 11  * @namespace BMap的所有library类均放在BMapLib命名空间下
 12  */
13 var BMapLib = window.BMapLib = BMapLib || {};
14 //常量，infoBox可以出现的位置，此版本只可实现上下两个方向。
15 var INFOBOX_AT_TOP = 1, INFOBOX_AT_RIGHT = 2, INFOBOX_AT_BOTTOM = 3, INFOBOX_AT_LEFT = 4;
16 (function() {
  17     //声明baidu包
  18     var T, baidu = T = baidu || {version: '1.5.0'};
  19     baidu.guid = '$BAIDU$';
  20     //以下方法为百度Tangram框架中的方法，请到http://tangram.baidu.com 查看文档
  21     (function() {
    22         window[baidu.guid] = window[baidu.guid] || {};
    23
    24 		baidu.lang = baidu.lang || {};
    25         baidu.lang.isString = function (source) {
      26             return '[object String]' == Object.prototype.toString.call(source);
      27         };
    28         baidu.lang.isFunction = function (source) {
      29             return '[object Function]' == Object.prototype.toString.call(source);
      30         };
    31         baidu.lang.Event = function (type, target) {
      32             this.type = type;
      33             this.returnValue = true;
      34             this.target = target || null;
      35             this.currentTarget = null;
      36         };
    37
    38
    39         baidu.object = baidu.object || {};
    40         baidu.extend =
      41         baidu.object.extend = function (target, source) {
      42             for (var p in source) {
        43                 if (source.hasOwnProperty(p)) {
          44                     target[p] = source[p];
          45                 }
        46             }
      47
      48             return target;
      49         };
    50         baidu.event = baidu.event || {};
    51         baidu.event._listeners = baidu.event._listeners || [];
    52         baidu.dom = baidu.dom || {};
    53
    54         baidu.dom._g = function (id) {
      55             if (baidu.lang.isString(id)) {
        56                 return document.getElementById(id);
        57             }
      58             return id;
      59         };
    60         baidu._g = baidu.dom._g;
    61         baidu.event.on = function (element, type, listener) {
      62             type = type.replace(/^on/i, '');
      63             element = baidu.dom._g(element);
      64             var realListener = function (ev) {
          65                     // 1. 这里不支持EventArgument,  原因是跨frame的事件挂载
          66                     // 2. element是为了修正this
          67                     listener.call(element, ev);
          68                 },
        69                 lis = baidu.event._listeners,
        70                 filter = baidu.event._eventFilter,
        71                 afterFilter,
        72                 realType = type;
      73             type = type.toLowerCase();
      74             // filter过滤
      75             if(filter && filter[type]){
        76                 afterFilter = filter[type](element, type, realListener);
        77                 realType = afterFilter.type;
        78                 realListener = afterFilter.listener;
        79             }
      80
      81             // 事件监听器挂载
      82             if (element.addEventListener) {
        83                 element.addEventListener(realType, realListener, false);
        84             } else if (element.attachEvent) {
        85                 element.attachEvent('on' + realType, realListener);
        86             }
      87             // 将监听器存储到数组中
      88             lis[lis.length] = [element, type, listener, realListener, realType];
      89             return element;
      90         };
    91
    92         baidu.on = baidu.event.on;
    93         baidu.event.un = function (element, type, listener) {
      94             element = baidu.dom._g(element);
      95             type = type.replace(/^on/i, '').toLowerCase();
      96
      97             var lis = baidu.event._listeners,
        98                 len = lis.length,
        99                 isRemoveAll = !listener,
        100                 item,
        101                 realType, realListener;
      102             while (len--) {
        103                 item = lis[len];
        104
        105                 if (item[1] === type
          106                     && item[0] === element
        107                     && (isRemoveAll || item[2] === listener)) {
          108                    	realType = item[4];
          109                    	realListener = item[3];
          110                     if (element.removeEventListener) {
            111                         element.removeEventListener(realType, realListener, false);
            112                     } else if (element.detachEvent) {
            113                         element.detachEvent('on' + realType, realListener);
            114                     }
          115                     lis.splice(len, 1);
          116                 }
        117             }
      118
      119             return element;
      120         };
    121         baidu.un = baidu.event.un;
    122         baidu.dom.g = function (id) {
      123             if ('string' == typeof id || id instanceof String) {
        124                 return document.getElementById(id);
        125             } else if (id && id.nodeName && (id.nodeType == 1 || id.nodeType == 9)) {
        126                 return id;
        127             }
      128             return null;
      129         };
    130         baidu.g = baidu.G = baidu.dom.g;
    131         baidu.dom._styleFixer = baidu.dom._styleFixer || {};
    132         baidu.dom._styleFilter = baidu.dom._styleFilter || [];
    133         baidu.dom._styleFilter.filter = function (key, value, method) {
      134             for (var i = 0, filters = baidu.dom._styleFilter, filter; filter = filters[i]; i++) {
        135                 if (filter = filter[method]) {
          136                     value = filter(key, value);
          137                 }
        138             }
      139             return value;
      140         };
    141         baidu.string = baidu.string || {};
    142
    143         baidu.string.toCamelCase = function (source) {
      144             //提前判断，提高getStyle等的效率 thanks xianwei
      145             if (source.indexOf('-') < 0 && source.indexOf('_') < 0) {
        146                 return source;
        147             }
      148             return source.replace(/[-_][^-_]/g, function (match) {
        149                 return match.charAt(1).toUpperCase();
        150             });
      151         };
    152
    153         baidu.dom.setStyle = function (element, key, value) {
      154             var dom = baidu.dom, fixer;
      155
      156             // 放弃了对firefox 0.9的opacity的支持
      157             element = dom.g(element);
      158             key = baidu.string.toCamelCase(key);
      159
      160             if (fixer = dom._styleFilter) {
        161                 value = fixer.filter(key, value, 'set');
        162             }
      163
      164             fixer = dom._styleFixer[key];
      165             (fixer && fixer.set) ? fixer.set(element, value) : (element.style[fixer || key] = value);
      166
      167             return element;
      168         };
    169
    170          baidu.setStyle = baidu.dom.setStyle;
    171
    172         baidu.dom.setStyles = function (element, styles) {
      173             element = baidu.dom.g(element);
      174             for (var key in styles) {
        175                 baidu.dom.setStyle(element, key, styles[key]);
        176             }
      177             return element;
      178         };
    179          baidu.setStyles = baidu.dom.setStyles;
    180         baidu.browser = baidu.browser || {};
    181         baidu.browser.ie = baidu.ie = /msie (\d+\.\d+)/i.test(navigator.userAgent) ? (document.documentMode || + RegExp['\x241']) : undefined;
    182         baidu.dom._NAME_ATTRS = (function () {
      183             var result = {
        184                 'cellpadding': 'cellPadding',
        185                 'cellspacing': 'cellSpacing',
        186                 'colspan': 'colSpan',
        187                 'rowspan': 'rowSpan',
        188                 'valign': 'vAlign',
        189                 'usemap': 'useMap',
        190                 'frameborder': 'frameBorder'
      191             };
      192
      193             if (baidu.browser.ie < 8) {
        194                 result['for'] = 'htmlFor';
        195                 result['class'] = 'className';
        196             } else {
        197                 result['htmlFor'] = 'for';
        198                 result['className'] = 'class';
        199             }
      200
      201             return result;
      202         })();
    203         baidu.dom.setAttr = function (element, key, value) {
      204             element = baidu.dom.g(element);
      205             if ('style' == key){
        206                 element.style.cssText = value;
        207             } else {
        208                 key = baidu.dom._NAME_ATTRS[key] || key;
        209                 element.setAttribute(key, value);
        210             }
      211             return element;
      212         };
    213          baidu.setAttr = baidu.dom.setAttr;
    214         baidu.dom.setAttrs = function (element, attributes) {
      215             element = baidu.dom.g(element);
      216             for (var key in attributes) {
        217                 baidu.dom.setAttr(element, key, attributes[key]);
        218             }
      219             return element;
      220         };
    221         baidu.setAttrs = baidu.dom.setAttrs;
    222         baidu.dom.create = function(tagName, opt_attributes) {
      223             var el = document.createElement(tagName),
        224                 attributes = opt_attributes || {};
      225             return baidu.dom.setAttrs(el, attributes);
      226         };
    227         T.undope=true;
    228     })();
  229
  230     /**
   231      * @exports InfoBox as BMapLib.InfoBox
   232      */
  233
  234     var InfoBox =
    235     /**
   236      * InfoBox类的构造函数
   237      * @class InfoBox <b>入口</b>。
   238      * 可以自定义border,margin,padding,关闭按钮等等。
   239      * @constructor
   240          * @param {Map} map Baidu map的实例对象.
   241          * @param {String} content infoBox中的内容.
   242          * @param {Json Object} opts 可选的输入参数，非必填项。可输入选项包括：<br />
   243          * {<br />"<b>offset</b>" : {Size} infoBox的偏移量
244          * <br />"<b>boxClass</b>" : {String} 定义infoBox的class,
245          * <br />"<b>boxStyle</b>" : {Json} 定义infoBox的style,此项会覆盖boxClass<br />
246          * <br />"<b>closeIconMargin</b>" : {String} 关闭按钮的margin    <br />
247          * <br />"<b>closeIconUrl</b>" : {String} 关闭按钮的url地址    <br />
248          * <br />"<b>enableAutoPan</b>" : {Boolean} 是否启动自动平移功能    <br />
249          * <br />"<b>align</b>" : {Number} 基于哪个位置进行定位，取值为[INFOBOX_AT_TOP,INFOBOX_AT_BOTTOM]<br />
250          * }<br />.
   251          * @example <b>参考示例：</b><br />
   252          * var infoBox = new BMapLib.InfoBox(map,"百度地图api",{boxStyle:{background:"url('tipbox.gif') no-repeat
253           center top",width: "200px"},closeIconMargin: "10px 2px 0 0",enableAutoPan: true
254           ,alignBottom: false});
   255      */
  256         BMapLib.InfoBox = function(map, content, opts) {
    257
    258         this._content = content || "";
    259         this._isOpen = false;
    260         this._map = map;
    261
    262         this._opts = opts = opts || {};
    263         this._opts.offset =  opts.offset || new BMap.Size(0,0);
    264         this._opts.boxClass = opts.boxClass || "infoBox";
    265         this._opts.boxStyle = opts.boxStyle || {};
    266         this._opts.closeIconMargin = opts.closeIconMargin || "2px";
    267         this._opts.closeIconUrl = opts.closeIconUrl || "close.png";
    268         this._opts.enableAutoPan = opts.enableAutoPan  ? true : false;
    269         this._opts.align = opts.align || INFOBOX_AT_TOP;
    270     }
  271     InfoBox.prototype = new BMap.Overlay();
  272     InfoBox.prototype.initialize = function(map) {
    273         var me = this;
    274         var div = this._div = baidu.dom.create('div', {"class": this._opts.boxClass});
    275         baidu.dom.setStyles(div, this._opts.boxStyle);
    276         //设置position为absolute，用于定位
    277         div.style.position = "absolute";
    278         this._setContent(this._content);
    279
    280         var floatPane = map.getPanes().floatPane;
    281         floatPane.style.width = "auto";
    282         floatPane.appendChild(div);
    283         //设置完内容后，获取div的宽度,高度
    284         this._getInfoBoxSize();
    285         //this._boxWidth = parseInt(this._div.offsetWidth,10);
    286         //this._boxHeight = parseInt(this._div.offsetHeight,10);
    287         //阻止各种冒泡事件
    288         baidu.event.on(div,"onmousedown",function(e){
      289             me._stopBubble(e);
      290         });
    291         baidu.event.on(div,"onmouseover",function(e){
      292             me._stopBubble(e);
      293         });
    294         baidu.event.on(div,"click",function(e){
      295             me._stopBubble(e);
      296         });
    297         baidu.event.on(div,"dblclick",function(e){
      298             me._stopBubble(e);
      299         });
    300         return div;
    301     }
  302     InfoBox.prototype.draw = function() {
    303         this._isOpen && this._adjustPosition(this._point);
    304     }
  305     /**
   306      * 打开infoBox
   307      * @param {Marker|Point} anchor 要在哪个marker或者point上打开infobox
   308      * @return none
   309      *
   310      * @example <b>参考示例：</b><br />
   311      * infoBox.open();
   312      */
  313     InfoBox.prototype.open = function(anchor){
    314         var me = this,poi;
    315         if(!this._isOpen) {
      316             this._map.addOverlay(this);
      317             this._isOpen = true;
      318             //延迟10ms派发open事件，使后绑定的事件可以触发。
      319             setTimeout(function(){
        320                 me._dispatchEvent(me,"open",{"point" : me._point});
        321             },10);
      322         }
    323         if(anchor instanceof BMap.Point){
      324             poi = anchor;
      325             //清除之前存在的marker事件绑定，如果存在的话
      326             this._removeMarkerEvt();
      327         }else if(anchor instanceof BMap.Marker){
      328         	//如果当前marker不为空，说明是第二个marker，或者第二次点open按钮,先移除掉之前绑定的事件
      329         	if(this._marker){
        330         		this._removeMarkerEvt();
        331         	}
      332             poi = anchor.getPosition();
      333             this._marker = anchor;
      334             !this._markerDragend && this._marker.addEventListener("dragend",this._markerDragend = function(e){
        335             	me._point = e.point;
        336             	me._adjustPosition(me._point);
        337             	me._panBox();
        338             	me.show();
        339             });
      340              //给marker绑定dragging事件，拖动marker的时候，infoBox也跟随移动
      341             !this._markerDragging && this._marker.addEventListener("dragging",this._markerDragging = function(){
        342             	me.hide();
        343             	me._point = me._marker.getPosition();
        344                 me._adjustPosition(me._point);
        345             });
      346         }
    347         //打开的时候，将infowindow显示
    348         this.show();
    349         this._point = poi;
    350         this._panBox();
    351         this._adjustPosition(this._point);
    352     }
  353     /**
   354      * 关闭infoBox
   355      * @return none
   356      *
   357      * @example <b>参考示例：</b><br />
   358      * infoBox.close();
   359      */
  360     InfoBox.prototype.close = function(){
    361         if(this._isOpen){
      362             this._map.removeOverlay(this);
      363             this._isOpen = false;
      364             this._dispatchEvent(this,"close",{"point" : this._point});
      365         }
    366     }
  367
  368 	/**
   369    	 * 打开infoBox时，派发事件的接口
   370      * @name InfoBox#Open
   371      * @event
   372      * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
   373      * <br />{"<b>target</b> : {BMap.Overlay} 触发事件的元素,
374      * <br />"<b>type</b>：{String} 事件类型,
375      * <br />"<b>point</b>：{Point} infoBox的打开位置}
   376      *
   377      * @example <b>参考示例：</b>
   378      * infoBox.addEventListener("open", function(e) {
379      *     alert(e.type);
380      * });
   381      */
  382    /**
   383    	 * 关闭infoBox时，派发事件的接口
   384      * @name InfoBox#Close
   385      * @event
   386      * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
   387      * <br />{"<b>target</b> : {BMap.Overlay} 触发事件的元素,
388      * <br />"<b>type</b>：{String} 事件类型,
389      * <br />"<b>point</b>：{Point} infoBox的关闭位置}
   390      *
   391      * @example <b>参考示例：</b>
   392      * infoBox.addEventListener("close", function(e) {
393      *     alert(e.type);
394      * });
   395      */
  396   /**
   397      * 启用自动平移
   398      * @return none
   399      *
   400      * @example <b>参考示例：</b><br />
   401      * infoBox.enableAutoPan();
   402      */
  403     InfoBox.prototype.enableAutoPan = function(){
    404         this._opts.enableAutoPan = true;
    405     }
  406     /**
   407      * 禁用自动平移
   408      * @return none
   409      *
   410      * @example <b>参考示例：</b><br />
   411      * infoBox.disableAutoPan();
   412      */
  413     InfoBox.prototype.disableAutoPan = function(){
    414         this._opts.enableAutoPan = false;
    415     }
  416     /**
   417      * 设置infoBox的内容
   418      * @param {String|HTMLElement} content 弹出气泡中的内容
   419      * @return none
   420      *
   421      * @example <b>参考示例：</b><br />
   422      * infoBox.setContent("百度地图API");
   423      */
  424     InfoBox.prototype.setContent = function(content){
    425       	this._setContent(content);
    426       	this._getInfoBoxSize();
    427         this._adjustPosition(this._point);
    428     }
  429     /**
   430      * 设置信息窗的地理位置
   431      * @param {Point} point 设置position
   432      * @return none
   433      *
   434      * @example <b>参考示例：</b><br />
   435      * infoBox.setPosition(new BMap.Point(116.35,39.911));
   436      */
  437     InfoBox.prototype.setPosition = function(poi){
    438         this._point = poi;
    439         this._adjustPosition(poi);
    440         this._removeMarkerEvt();
    441     }
  442     /**
   443      * 获得信息窗的地理位置
   444      * @param none
   445      * @return {Point} 信息窗的地理坐标
   446      *
   447      * @example <b>参考示例：</b><br />
   448      * infoBox.getPosition();
   449      */
  450     InfoBox.prototype.getPosition = function(){
    451         return this._point;
    452     }
  453     /**
   454      * 返回信息窗口的箭头距离信息窗口在地图
   455      * 上所锚定的地理坐标点的像素偏移量。
   456      * @return {Size} Size
   457      *
   458      * @example <b>参考示例：</b><br />
   459      * infoBox.getOffset();
   460      */
  461     InfoBox.prototype.getOffset = function(){
    462         return this._opts.offset;
    463     },
    464     /**
   465    	 *@ignore
   466      * 删除overlay，调用Map.removeOverlay时将调用此方法，
   467      * 将移除覆盖物的容器元素
   468      */
  469     InfoBox.prototype.remove = function(){
    470         var me = this;
    471         if(this.domElement && this.domElement.parentNode){
      472           //防止内存泄露
      473           baidu.event.un(this._div.firstChild, "click", me._closeHandler());
      474           this.domElement.parentNode.removeChild(this.domElement);
      475         }
    476         this.domElement = null;
    477         this._isOpen = false;
    478         this.dispatchEvent("onremove");
    479     },
    480     baidu.object.extend(InfoBox.prototype,{
    481         /**
     482          * 获取关闭按钮的html
     483          * @return IMG 关闭按钮的HTML代码
     484          */
    485         _getCloseIcon: function(){
    486             var img = "<img src='"+ this._opts.closeIconUrl +"' align='right' style='position:relative;right:0px;cursor:pointer;margin:"+ this._opts.closeIconMargin +"'/>";
    487             return img;
    488         },
  489         /**
   490 	     * 设置infoBox的内容
   491 	     * @param {String|HTMLElement} content 弹出气泡中的内容
   492 	     * @return none
   493 	     *
   494 	     * @example <b>参考示例：</b><br />
   495 	     * infoBox.setContent("百度地图API");
   496 	     */
  497         _setContent: function(content){
    498 	        if(!this._div){
      499 	            return;
      500 	        }
    501 	        var closeHtml = this._getCloseIcon();
    502 	        //string类型的content
    503 	        if(typeof content.nodeType === "undefined"){
      504 	            this._div.innerHTML = closeHtml + content;
      505 	        }else{
      506 	            this._div.innerHTML = closeHtml;
      507 	            this._div.appendChild(content);
      508 	        }
    509 	        this._content = content;
    510 	        //添加click关闭infobox事件
    511 	        this._addEventToClose();
    512
    513    	    },
  514         /**
   515          * 调整infobox的position
   516          * @return none
   517          */
  518         _adjustPosition: function(poi){
    519             var pixel = this._getPointPosition(poi);
    520             var icon = this._marker && this._marker.getIcon();
    521             switch(this._opts.align){
      522                 case INFOBOX_AT_TOP:
        523                     if(this._marker){
          524                         this._div.style.bottom = -(pixel.y - this._opts.offset.height - icon.anchor.height + icon.infoWindowAnchor.height) - this._marker.getOffset().height + 2 + "px";
          525                     }else{
          526                         this._div.style.bottom = -(pixel.y - this._opts.offset.height) + "px";
          527                     }
        528                     break;
        529                 case INFOBOX_AT_BOTTOM:
        530                     if(this._marker){
          531           		        this._div.style.top = pixel.y + this._opts.offset.height - icon.anchor.height + icon.infoWindowAnchor.height + this._marker.getOffset().height + "px";
          532                     }else{
          533                         this._div.style.top = pixel.y + this._opts.offset.height + "px";
          534                     }
        535                     break;
        536             }
    537
    538             if(this._marker){
      539                 this._div.style.left = pixel.x - icon.anchor.width + this._marker.getOffset().width + icon.infoWindowAnchor.width - this._boxWidth / 2 + "px";
      540             }else{
      541                 this._div.style.left = pixel.x - this._boxWidth / 2 + "px";
      542             }
    543         },
  544         /**
   545          * 得到infobox的position
   546          * @return Point  infobox当前的position
   547          */
  548         _getPointPosition: function(poi){
    549             this._pointPosition = this._map.pointToOverlayPixel(poi);
    550             return this._pointPosition;
    551         },
  552         /**
   553          * 得到infobox的高度跟宽度
   554          * @return none
   555          */
  556         _getInfoBoxSize: function(){
    557         	this._boxWidth = parseInt(this._div.offsetWidth,10);
    558         	this._boxHeight = parseInt(this._div.offsetHeight,10);
    559         },
  560         /**
   561          * 添加关闭事件
   562          * @return none
   563          */
  564         _addEventToClose: function(){
    565             var me = this;
    566             baidu.event.on(this._div.firstChild, "click", me._closeHandler());
    567             this._hasBindEventClose = true;
    568         },
  569         /**
   570          * 处理关闭事件
   571          * @return none
   572          */
  573         _closeHandler: function(){
    574             var me = this;
    575             return function(e){
      576                 me.close();
      577             }
    578         },
  579         /**
   580          * 阻止事件冒泡
   581          * @return none
   582          */
  583         _stopBubble: function(e){
    584             if(e && e.stopPropagation){
      585                 e.stopPropagation();
      586             }else{
      587                 window.event.cancelBubble = true;
      588             }
    589         },
  590         /**
   591          * 自动平移infobox，使其在视野中全部显示
   592          * @return none
   593          */
  594         _panBox: function(){
    595             if(!this._opts.enableAutoPan){
      596                 return;
      597             }
    598             var mapH = parseInt(this._map.getContainer().offsetHeight,10),
      599                 mapW = parseInt(this._map.getContainer().offsetWidth,10),
      600                 boxH = this._boxHeight,
      601                 boxW = this._boxWidth;
    602             //infobox窗口本身的宽度或者高度超过map container
    603             if(boxH >= mapH || boxW >= mapW){
      604                 return;
      605             }
    606             //如果point不在可视区域内
    607             if(!this._map.getBounds().containsPoint(this._point)){
      608                 this._map.setCenter(this._point);
      609             }
    610             var anchorPos = this._map.pointToPixel(this._point),
      611                 panTop,panBottom,panY,
      612                 //左侧超出
    613                 panLeft = boxW / 2 - anchorPos.x,
      614                 //右侧超出
    615                 panRight = boxW / 2 + anchorPos.x - mapW;
    616             if(this._marker){
      617                 var icon = this._marker.getIcon();
      618             }
    619             //基于bottom定位，也就是infoBox在上方的情况
    620             switch(this._opts.align){
      621                 case INFOBOX_AT_TOP:
        622                     //上侧超出
        623                     var h = this._marker ? icon.anchor.height + this._marker.getOffset().height - icon.infoWindowAnchor.height : 0;
        624                     panTop = boxH - anchorPos.y + this._opts.offset.height + h + 2 ;
        625                     break;
        626                 case INFOBOX_AT_BOTTOM:
        627                     //下侧超出
        628                     var h = this._marker ? -icon.anchor.height + icon.infoWindowAnchor.height + this._marker.getOffset().height + this._opts.offset.height : 0;
        629                     panBottom = boxH + anchorPos.y - mapH + h + 4;
        630                     break;
        631             }
    632
    633             panX = panLeft > 0 ? panLeft : (panRight > 0 ? -panRight : 0);
    634             panY = panTop > 0 ? panTop : (panBottom > 0 ? -panBottom : 0);
    635             this._map.panBy(panX,panY);
    636         },
  637         _removeMarkerEvt: function(){
    638 			this._markerDragend && this._marker.removeEventListener("dragend", this._markerDragend);
    639             this._markerDragging && this._marker.removeEventListener("dragging", this._markerDragging);
    640             this._markerDragend = this._markerDragging = null;
    641         },
  642       	/**
   643 	     * 集中派发事件函数
   644 	     *
   645 	     * @private
   646 	     * @param {Object} instance 派发事件的实例
   647 	     * @param {String} type 派发的事件名
   648 	     * @param {Json} opts 派发事件里添加的参数，可选
   649 	     */
  650 	     _dispatchEvent: function(instance, type, opts) {
    651 	        type.indexOf("on") != 0 && (type = "on" + type);
    652 	        var event = new baidu.lang.Event(type);
    653 	        if (!!opts) {
      654 	            for (var p in opts) {
        655 	                event[p] = opts[p];
        656 	            }
      657 	        }
    658 	        instance.dispatchEvent(event);
    659 	    }
  660     });
  661 })();
662
663
