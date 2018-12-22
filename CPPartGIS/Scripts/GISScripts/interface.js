
//点缓冲分析：根据经纬度,缓冲半径，对此点进行缓冲分析
function map_PointBuffer(lon, lat, radius, startAngle, endAngle, layerUrls) {
    if (!layerUrls)
        layerUrls = _layerList;
    require(["dojo/dom", "widgets/PointBufferSearch"], function (dom, PointBufferSearch) {
        var bufferSearch = new widgets.PointBufferSearch({ map: map, distant: radius, startAngle: startAngle, endAngle: endAngle, layerUrls: layerUrls });
        bufferSearch.point(lon, lat);
    });
}


//模块：地表水
//功能：添加干流支流图层
//作者：changf
function riverAddGraghicLayer(feature) {//type=1干流  type=2支流
    require(["esri/symbols/SimpleLineSymbol"
        , "esri/Color"
        , "esri/layers/GraphicsLayer"
        , "esri/graphic"
    ], function (SimpleLineSymbol, Color, GraphicsLayer, Graphic) {
        var gl_GraphicsLayer = new GraphicsLayer({ id: "River_GL" });
        var zl_GraphicsLayer = new GraphicsLayer({ id: "River_ZL" });
        map.addLayer(gl_GraphicsLayer);
        map.addLayer(zl_GraphicsLayer);
        for (var i = 0; i < feature.length; i++) {
            var attribute = feature[i].attributes;
            if (attribute.riverType == "干流") {
                var symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([51, 140, 255]), 3);
                var graphic = new Graphic(feature[i].geometry, symbol, feature[i].attributes);
                gl_GraphicsLayer.add(graphic)
            } else {
                var symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([51, 140, 0]), 2);
                var graphic = new Graphic(feature[i].geometry, symbol, feature[i].attributes);
                zl_GraphicsLayer.add(graphic);
            }
        }
    });
}



/**********
模块：污染源
功能：图形查询--绘制并返回查询图形
作者：changf
**********/
function btn_pollGraphicSearch(index, callback) {
    require([
        "dojo/dom",
        "widgets/BufferSearch",
        "esri/symbols/SimpleFillSymbol",
        "esri/Color",
        "esri/graphic",
        "esri/geometry/Point"], function (dom, BufferSearch, SimpleFillSymbol, Color, Graphic, Point) {
            var graphic;
            if (index == 0) {
                graphic = esri.toolbars.Draw.RECTANGLE;
            }
            else if (index == 1) {
                graphic = esri.toolbars.Draw.CIRCLE;
            }
            else if (index == 2) {
                graphic = esri.toolbars.Draw.POLYGON;
            }
            else if (index == 3) {
                graphic = esri.toolbars.Draw.FREEHAND_POLYGON;
            }
            var draw = new esri.toolbars.Draw(map);
            draw.on("draw-end", doBuffer);
            map.setMapCursor("pointer");
            draw.activate(graphic);

            function doBuffer(evt) {
                if (draw != null) {
                    draw.deactivate();
                }
                map.setMapCursor("default");
                callback(evt.geometry);
            }
        });
}
/**********
模块：污染源
功能：图形查询--判断数据是否在图形中
作者：changf
**********/
function btn_pointGraphicSearch(json, geometry) {
    var pollInGraphic = [];
    require(["esri/geometry/Point"], function (Point) {
        for (var i = 0; i < json.length; i++) {
            var lon = Number(json[i].p_lon);
            var lat = Number(json[i].p_lat);
            point = new Point(lon, lat, map.spatialReference);
            if (geometry.contains(point)) {
                pollInGraphic.push(json[i]);
            }
        }
    });
    return pollInGraphic;
}

/*空气质量小时区域差值分析*/
function idwModelAnalysis(gpUrl, jsonData) {
    var rasterimageParams;
    var gp;
    require(["dojo/dom",
          "esri/geometry/Point",
          "esri/tasks/FeatureSet",
          "dojo/_base/array",
          "dojo/date/locale",
          "dojo/parser",
          "dijit/registry",
          "esri/domUtils",
          "esri/graphic",
          "esri/layers/ArcGISDynamicMapServiceLayer",
          "esri/layers/FeatureLayer",
          "esri/tasks/Geoprocessor",
          "esri/layers/ImageParameters",
          "dijit/form/DateTextBox",
          "dijit/layout/BorderContainer",
          "dijit/layout/ContentPane"],
    function (dom, Point, FeatureSet, array, locale, parser, registry,
             domUtils, Graphic, ArcGISDynamicMapServiceLayer, FeatureLayer, Geoprocessor, Legend) {
        gp = new Geoprocessor(gpUrl);
        var featureSet = new FeatureSet();
        var pointAry = new Array();
        for (var j = 0; j < jsonData.length; j++) {
            var jData = jsonData[j];
            var gra = new Graphic();
            if (jData["Longitude"] != null && jData["Latitude"] != null && jData["Longitude"] != "" && jData["Latitude"] != "") {
                var point = new Point(parseFloat(jData["Longitude"]), parseFloat(jData["Latitude"]), map.spatialReference);
                gra.geometry = point;
                gra.attributes = new Object({ AQI: parseFloat(jData["AQI"]) });
                pointAry.push(gra);
            }
        }
        featureSet.features = pointAry;
        var params = {
            point_shp: featureSet,
        };
        var rasterLayer = map.getLayer("rasclip");
        var rasterresultLayer = map.getLayer("rasterresult");
        if (rasterLayer != null) {
            map.removeLayer(rasterLayer);
            rasterLayer = null;
        }
        if (rasterresultLayer != null) {
            map.removeLayer(rasterresultLayer);
            rasterresultLayer = null;
        }
        var jsonStr = JSON.stringify(featureSet);
        //参数、结果回调、状态回调、失败回调
        gp.submitJob(params, gpJobComplete, gpJobStatus, gpJobFailed);


        function gpJobComplete(jobinfo) {
            //get the result map service layer and add to map
            //gp.getResultImageLayer(jobinfo.jobId, "rasterresult", rasterimageParams, function (layer) {
            gp.getResultImageLayer(jobinfo.jobId, "rasclip", null, function (layer) {
                layer.id = "rasterresult";
                layer.setOpacity(0.7);
                map.addLayers([layer]);
            });
        }

        function gpJobStatus(jobinfo) {
            $("#statusDiv").css('visibility', 'visible');
            var jobstatus = '';
            switch (jobinfo.jobStatus) {
                case 'esriJobSubmitted':
                    jobstatus = '正在提交...';
                    break;
                case 'esriJobExecuting':
                    jobstatus = '正在执行...';
                    break;
                case 'esriJobSucceeded':
                    $("#statusDiv").css('visibility', 'hidden');
                    break;
                case 'esriJobFailed':
                    jobstatus = '分析失败...';
                    break;
            }
            $(".status span").html(jobstatus);
        }
        function gpJobFailed(error) {
            $("#status").html(error);
            $("#statusDiv").css('visibility', 'hidden');
        }
    });
}


