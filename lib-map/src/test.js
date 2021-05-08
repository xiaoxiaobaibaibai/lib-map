const DrawingManager = {}

/**
 *自动设置画圈功能
 */
var tip_label = null;
DrawingManager.prototype._setCircle = function (point, radius) {
  // 变量设置
  var me = this,
    map = this._map,
    mask = this._mask,
    circle = null,
    overlays = [],
    centerPoint = null; // 圆的中心点

  var radius = null;
  var moveMarker = null;
  var polyline = null;
  var radiusWindow = null;
  var operateWindow = null;

  var lineStyel = {
    strokeColor: '#4E6DF1', // 边线颜色。
    strokeWeight: 2 // 边线的宽度，以像素为单位。
  };

  var centerIcon = new BMap.Icon('./circenter.svg', new BMap.Size(20, 20));
  var shadow = new BMap.Icon('./maker-shadow.png', new BMap.Size(21, 33));

  /**
   * 开始绘制圆形
   */
  var startAction = function (e) {
    console.log('鼠标画圆功能e,me =====',e,me)
    // 中心点标记
    centerPoint = point;

    var centerMarker = new BMap.Marker(centerPoint);
    centerIcon.setImageSize(new BMap.Size(20, 20));
    centerMarker.setIcon(centerIcon);
    centerMarker.setShadow(shadow);
    centerMarker.enableDragging();
    // 拖动事件
    centerMarker.addEventListener('dragstart', centerDragstart);
    centerMarker.addEventListener('dragging', centerDragging);
    centerMarker.addEventListener('dragend', centerDragend);
    map.addOverlay(centerMarker);

    overlays.push(centerMarker);

    circle = new BMap.Circle(centerPoint, 0, me.circleOptions);
    map.addOverlay(circle);
    mask.enableEdgeMove();
    mask.addEventListener('mousemove', moveAction);
    baidu.on(document, 'mouseup', endAction);
  };

  /**
   * 绘制圆形过程中，鼠标移动过程的事件
   */
  var moveAction = function (e) {
    radius = 0
    circle.setRadius(me._map.getDistance(centerPoint, e.point));

    map.removeOverlay(tip_label);

    tip_label = new BMap.Label('半径：' + radius + '米<br>松开完成绘制', {
      position: e.point, // 指定文本标注所在的地理位置
      offset: new BMap.Size(10, 10) // 设置文本偏移量
    });
    tip_label.setStyle(me.labelOptions);
    map.addOverlay(tip_label);
  };

  /**
   * 绘制圆形结束
   */
  var endAction = function (e) {
    var cz = map.getViewport(circle.getBounds());
    cz.zoom -= 1;
    map.setViewport(cz);
    map.removeOverlay(tip_label);

    var endPoint = new BMap.Point(circle.getBounds().getNorthEast().lng, centerPoint.lat);
    mask.hide();

    moveMarker = new BMap.Marker(endPoint);
    var moveIcon = new BMap.Icon('./nbsearch2.png', new BMap.Size(40, 20));
    moveIcon.setImageSize(new BMap.Size(40, 40));
    moveIcon.setImageOffset(new BMap.Size(0, -10));
    moveMarker.setIcon(moveIcon);
    moveMarker.setShadow(shadow);
    moveMarker.enableDragging();

    polyline = new BMap.Polyline([centerPoint, endPoint], lineStyel);

    var midPoint = new BMap.Point((circle.getBounds().getNorthEast().lng + centerPoint.lng) / 2, centerPoint.lat);
    radiusWindow = new Screenshot('circle', midPoint, radius, circle, me);

    overlays = overlays.concat([moveMarker, polyline, radiusWindow]);
    var limit = null;
    if (me.limit) {
      limit = me.limit.area;
    }

    var targetOverlay = {
      limit: limit,
      type: 'circle',
      point: endPoint,
      overlay: circle,
      overlays: overlays
    };
    operateWindow = new Operate(targetOverlay, me);

    map.addOverlay(moveMarker);
    map.addOverlay(polyline);
    map.addOverlay(radiusWindow);
    map.addOverlay(operateWindow);

    radiusWindow.addEventListener('radiuschange', function (e) {
      var radius = e.radius;
      circle.setRadius(radius);
      var ePoint = getPointByDistance(centerPoint, radius, 'east');
      var dragLeftPoint = new BMap.Point(ePoint.lng, centerPoint.lat);
      var halflng = ePoint.lng > centerPoint.lng ? (circle.getBounds().getNorthEast().lng + centerPoint.lng) / 2 : (circle.getBounds().getSouthWest().lng + centerPoint.lng) / 2;
      var halfLeftPoint = new BMap.Point(halflng, centerPoint.lat);
      moveMarker.setPosition(dragLeftPoint);
      radiusWindow.setInfo(halfLeftPoint, radius);
      operateWindow.setPosition(dragLeftPoint, true);
      operateWindow.updateWindow();
      polyline.setPath([centerPoint, dragLeftPoint]);

      var cz = map.getViewport(circle.getBounds());
      cz.zoom -= 1;
      map.setViewport(cz);
    });

    moveMarker.addEventListener('dragging', function (e) {
      var dragLeftPoint = new BMap.Point(e.point.lng, centerPoint.lat);
      var halflng = e.point.lng > centerPoint.lng ? (circle.getBounds().getNorthEast().lng + centerPoint.lng) / 2 : (circle.getBounds().getSouthWest().lng + centerPoint.lng) / 2;
      var isright = e.point.lng > centerPoint.lng ? true : false;
      var halfLeftPoint = new BMap.Point(halflng, centerPoint.lat);

      e.target.setPosition(dragLeftPoint);
      radiusWindow.setInfo(halfLeftPoint, me._map.getDistance(centerPoint, e.point).toFixed(0));
      operateWindow.setPosition(dragLeftPoint, isright);
      polyline.setPath([centerPoint, dragLeftPoint]);
      radius = me._map.getDistance(centerPoint, e.point).toFixed(0);
      circle.setRadius(me._map.getDistance(centerPoint, e.point));
    });

    moveMarker.addEventListener('dragend', function (e) {
      operateWindow.updateWindow();
      var cz = map.getViewport(circle.getBounds());
      cz.zoom -= 1;
      map.setViewport(cz);
    });

    mask.disableEdgeMove();
    mask.removeEventListener('mousemove', moveAction);
    mask.removeEventListener('mousemove', mousedownAction);
    baidu.un(document, 'mouseup', endAction);
  };

}
