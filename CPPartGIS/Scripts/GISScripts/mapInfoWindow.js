function infoW_openInfoWindow(lon, lat, id, name, popWindowParam) {
    require([
        "esri/geometry/Point"
       , "esri/dijit/PopupTemplate"
    ], function (Point, PopupTemplate) {

        var mapPoint = new Point(lon, lat, map.spatialReference);
        var infoWidth = 550;
        var infoHeight = 400;
        infoWidth = popWindowParam.popWidth;
        infoHeight = popWindowParam.popHeight;

        var param = "";
        if (popWindowParam["urlParam"] != null) {
            param = popWindowParam["urlParam"];
        }

        map.infoWindow.resize(infoWidth, infoHeight);
        map.infoWindow.setContent("<iframe frameborder='0' scrolling  ='no' width='100%'  height='" + (infoHeight - 30) + "' src='" + (popWindowParam.popWindowUrl + "?lon=" + mapPoint.x + "&lat=" + mapPoint.y + "&id=" + id + "&name=" + name + param) + "'/>");
        map.infoWindow.setTitle("<font style = 'font-weight:bold'>" + name + "</font>");
        map.infoWindow.show(mapPoint);

    });
}