//全局变量
var drawGraphicsLayer, ecologicalLayer, GridLayer;

mugis.mapShowPOI = {

    symbol: null,

    /**
     * 地图上添加点位.
     * @param {object} popWindowParam - popWindowUrl, urlParam, popWidth, popHeight.
     */
    addPOI: function (datatype, json, popWindowParam, keep) {
        var _this = this;
        require([
             "esri/geometry/Point"
            , "esri/layers/GraphicsLayer"
            , "esri/graphic"
            , "esri/symbols/PictureMarkerSymbol"
            , "esri/symbols/SimpleMarkerSymbol"
            , "esri/symbols/SimpleLineSymbol"
            , "esri/symbols/PictureFillSymbol"
            , "esri/Color"
            , "esri/config"
            , "esri/dijit/PopupTemplate"
            , "esri/renderers/ClassBreaksRenderer"
            , "widgets/ClusterLayer"
        ], function (Point, GraphicsLayer, Graphic, PictureMarkerSymbol, SimpleMarkerSymbol, SimpleLineSymbol, PictureFillSymbol, Color, config, PopupTemplate, ClassBreaksRenderer, ClusterLayer) {

            if (_this.symbol == null) {
                _this.symbol = {
                    PictureMarkerSymbol: PictureMarkerSymbol,
                    SimpleMarkerSymbol: SimpleMarkerSymbol,
                    SimpleLineSymbol: SimpleLineSymbol,
                    PictureFillSymbol: PictureFillSymbol,
                    Color: Color
                };
            }

            //参数初始化
            if (json == null) {
                json = [];
            }

            if (json != null) {

                var layer = map.getLayer("GL_PointCover_" + datatype);
                var layerExist = (layer == null) ? false : true;

                if (!layerExist) {//(保留&&不存在)||(不保留&&不存在)=不存在
                    //创建图层
                    drawGraphicsLayer = new GraphicsLayer({ id: "GL_PointCover_" + datatype });
                    map.addLayer(drawGraphicsLayer, 50);
                    drawGraphicsLayer.on("click", layerClick);
                    drawGraphicsLayer.on("mouse-over", mouseOverLayer);
                    drawGraphicsLayer.on("mouse-out", mouseOutLayer);
                }
                else if (!keep) {//不保留&&存在=不保留
                    //清空+移除
                    layer.clear();
                    map.removeLayer(layer);

                    //创建图层
                    drawGraphicsLayer = new GraphicsLayer({ id: "GL_PointCover_" + datatype });
                    map.addLayer(drawGraphicsLayer, 50);
                    drawGraphicsLayer.on("click", layerClick);
                    drawGraphicsLayer.on("mouse-over", mouseOverLayer);
                    drawGraphicsLayer.on("mouse-out", mouseOutLayer);
                }
                else {
                    //保留&&存在
                }

                var multipoint = new esri.geometry.Multipoint(); //查询到的点集合
                var pointArr = new Array(); //(用于聚合)

                var html = "";
                var symbol = null;

                //设置覆盖物样式并添加覆盖物到地图
                for (var i = 0; i < json.length; i++) {
                    //初始化数据lon,lat
                    var lon = json[i].p_lon;
                    var lat = json[i].p_lat;

                    //添加覆盖物
                    html = "";
                    symbol = null;

                    var coverStyle = mugis.mapShowPOI.GetCoverStyle(datatype, json[i], i);
                    html = coverStyle.html;
                    symbol = coverStyle.symbol;

                    //添加html覆盖物到地图
                    $("body").append(html);

                    //添加点位到地图
                    var point = new Point(lon, lat, map.spatialReference);
                    var screenPnt = map.toScreen(point);
                    multipoint.addPoint(point);

                    var graphic = new Graphic(point, symbol, json[i]);

                    drawGraphicsLayer.add(graphic);
                    pointArr.push({ x: lon, y: lat, attributes: json[i] });

                    //设置标签离覆盖物偏移距离
                    $(".ring_" + datatype + "_" + i).css({ "left": screenPnt.x - 19 + "px", "top": screenPnt.y - 26 + "px", "position": "absolute", "z-index": "39", "cursor": "pointer" });

                    //loadChartOnMap("#ring_" + datatype + "_" + i, [json[i]["value_y"]], [json[i]["value_n"]]);
                }


                //设置动画
                $(".class_mapIcoDiv").animo({ animation: ["rollIn"], duration: 0.5 });
                $(".class_mapIcoDiv").bind("mouseover", function () {
                    $(this).animo({ animation: ["pulse"], duration: 0.5 });
                });

                //开始平移
                var panStart = dojo.connect(map, "onPanStart", function () {
                    $(".ring").css("display", "none");
                    $(".esriPopup").css("display", "none");
                });
                //平移结束
                var panEnd = dojo.connect(map, "onPanEnd", function () {
                    for (var i = 0; i < json.length; i++) {
                        var x = json[i].p_lon;
                        var y = json[i].p_lat;
                        var point = new Point(x, y, map.spatialReference);
                        screenPnt = map.toScreen(point);
                        $(".ring_" + datatype + "_" + i).css({ "left": screenPnt.x - 19 + "px", "top": screenPnt.y - 26 + "px", "position": "absolute", "display": "block", "z-index": "40" });
                    }
                    $(".esriPopup").css("display", "block");
                });
                //开始缩放
                var zoomStart = dojo.connect(map, "onZoomStart", function () {
                    $(".ring").css("display", "none");
                    $(".esriPopup").css("display", "none");
                });
                //缩放结束
                var zoomEnd = dojo.connect(map, "onZoomEnd", function () {
                    for (var i = 0; i < json.length; i++) {
                        var x = json[i].p_lon;
                        var y = json[i].p_lat;
                        var point = new Point(x, y, map.spatialReference);
                        screenPnt = map.toScreen(point);
                        $(".ring_" + datatype + "_" + i).css({ "left": screenPnt.x - 19 + "px", "top": screenPnt.y - 26 + "px", "position": "absolute", "display": "block", "z-index": "40" });
                    }
                    $(".esriPopup").css("display", "block");
                });

                //将地图事件的句柄添加到句柄集合中。
                config._eventHandlers.push(panStart);
                config._eventHandlers.push(panEnd);
                config._eventHandlers.push(zoomStart)
                config._eventHandlers.push(zoomEnd);

                //设置弹出窗PopWindow
                if (popWindowParam.popWindowUrl != null && popWindowParam.popWindowUrl != "undefined" && popWindowParam.popWindowUrl != "") {
                    $(".ring").unbind();
                    $(".ring").bind("click", function (evt) {

                        if (evt.target.nodeName != "LI" && evt.target.nodeName != "img") {
                            var element = $(this).find(".class_mapIcoDiv");
                            var name = element.attr("name");
                            var x = Number(element.attr("lon"));
                            var y = Number(element.attr("lat"));
                            var id = element.attr("pointcode");

                            //设置infoWindow弹出窗高度
                            var infoWidth = popWindowParam.popWidth;
                            var infoHeight = popWindowParam.popHeight;

                            //自定义infoWindow弹窗窗默认高度
                            if (infoWidth == null || infoWidth == undefined) {
                                infoWidth = 400;
                            }
                            if (infoHeight == null || infoHeight == undefined) {
                                infoHeight = 300;
                            }

                            var param = "";
                            var urlParam = popWindowParam.urlParam;
                            if (urlParam != null) {
                                if (urlParam[id] != null && urlParam[id] != undefined && urlParam[id] != "") {
                                    param = urlParam[id];
                                }
                            }

                            map.infoWindow.resize(infoWidth, infoHeight);

                            map.infoWindow.setContent("<iframe frameborder='0' scrolling  ='no' width='100%'  height='" + (infoHeight - 30) + "' src='" + (popWindowParam.popWindowUrl + "?lon=" + x + "&lat=" + y + "" + param) + "'/>");
                            map.infoWindow.setTitle("<font style = 'font-weight:bold'>" + name + "</font>");
                            var mapPoint = new Point(x, y, map.spatialReference);
                            map.infoWindow.show(mapPoint);
                        }
                    });
                }
                if (datatype == "polluter_general") {
                    ClusterLyr.createClusterLayer("1", "polluter_general", pointArr, popWindowParam);
                    HeatMap.createHeatMap("polluter_general", pointArr, "heatmap", {
                        blurRadius: 16,
                        colorStops: {
                            ratio: [0, 0.2, 0.3, 0.4, 0.5],//0-1
                            color: ["0,0,255", "0,255,255", "0, 255, 0", "255,255,0", "255,0,0"],
                            transparency: [0, 1, 1, 1],//0-1
                        },
                        maxPixelIntensity: 50,
                        minPixelIntensity: 50,
                    });
                }

            }//if (json != null)结束位置

            //图层的点击事件
            function layerClick(e) {
                var graphic = e.graphic;
                var mapPoint = graphic.geometry;
                var attributes = graphic.attributes;
                var name = attributes["p_name"];
                var infoWidth = 550;
                var infoHeight = 400;
                infoWidth = popWindowParam.popWidth;
                infoHeight = popWindowParam.popHeight;
                if (datatype == "online") {
                    infoHeight = 390;
                }

                var param = "";
                if (attributes["p_id"] != null && attributes["p_id"] != undefined && attributes["p_id"] != "") {
                    param = popWindowParam["urlParam"][attributes["p_id"]];
                    if (param == null || param == undefined) {
                        param = "";
                    }
                }

                map.infoWindow.resize(infoWidth, infoHeight);
                map.infoWindow.setContent("<iframe frameborder='0' scrolling  ='no' width='100%'  height='" + (infoHeight - 30) + "' src='" + (popWindowParam.popWindowUrl + "?lon=" + mapPoint.x + "&lat=" + mapPoint.y + "&id=" + attributes["p_id"] + "&name=" + attributes["p_name"] + param) + "'/>");
                map.infoWindow.setTitle("<font style = 'font-weight:bold'>" + name + "</font>");
                map.infoWindow.show(mapPoint);
            }


            function mouseOverLayer(e) {
                map.setMapCursor("pointer");
                //console.log(e.graphic);
                var font = new esri.symbol.Font();
                font.setSize("10pt");
                font.setFamily("微软雅黑");
                var cpoint = event.graphic.geometry;
                var text = new esri.symbol.TextSymbol(event.graphic.attributes.p_name);
                text.setFont(font);
                text.setColor(new dojo.Color([0, 0, 0, 100]));
                text.setOffset(20, -35);
                var pmsTextBg = new PictureMarkerSymbol();
                pmsTextBg.setOffset(20, -30);
                var textLength = event.graphic.attributes.p_name.length;
                pmsTextBg.setWidth(textLength * 13.5 + 5);
                pmsTextBg.setColor(new esri.Color([255, 255, 0, 0.8]));
                var bgGraphic = new esri.Graphic(cpoint, pmsTextBg);
                //map.graphics.add(bgGraphic);
                var labelGraphic = new esri.Graphic(cpoint, text);
                //map.graphics.add(labelGraphic);
            };
            function mouseOutLayer() {
                map.graphics.clear();
                map.setMapCursor("default");
            }


        });//require结束(加载点位结束)
    },//地图上添加点位结束

    //设置覆盖物样式
    GetCoverStyle: function (datatype, json, i) {
        var PictureMarkerSymbol = this.symbol.PictureMarkerSymbol;
        var SimpleMarkerSymbol = this.symbol.SimpleMarkerSymbol;
        var SimpleLineSymbol = this.symbol.SimpleLineSymbol;
        //var PictureFillSymbol = this.symbol.PictureFillSymbol;
        var Color = this.symbol.Color;

        var r = {
            html: "",
            symbol: null
        };
        try {
            //初始化数据id,name,lon,lat,value
            var id = json.p_id;
            var name = json.p_name;
            var lon = json.p_lon;
            var lat = json.p_lat;
            var value = json.p_value;

            //value值进行处理
            if (value == null || value == "" || value == "—" || value.toString().toUpperCase() == "NAN") {
                value = '-';
            }

            //①html覆盖物
            r.symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 5, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 1), new Color([255, 0, 0]));//带名称覆盖物旁边的点状标记
            if (datatype == "air_City") {
                //城市小时
                var level = mugis.airClassify.getAirLevelAndColor(value, json.p_type);
                if (level) {
                    r.html += "<div class='ring_" + datatype + "_" + i + " ring'>";
                    r.html += "<div id = 'div_mapIcoDiv" + i + "' name='" + name + "' title='" + name + "' lon='" + lon + "' lat='" + lat + "' value='" + value + "' pointcode='" + id + "'  class = 'class_mapIcoDiv'>";
                    r.html += "<div class = 'aqi_tip_name' style='border:1px solid " + level.borderColor + "'>" + name + "</div>";
                    r.html += "<div class = 'aqi_tip_value' style='background: url(img/points/" + level.imgColor + ") no-repeat'>" + value + "</div>";
                    r.html += "</div>";
                    r.html += "</div>";
                }
            }
            else if (datatype == "air_Station") {
                //城市小时
                var level = mugis.airClassify.getAirLevelAndColor(value, json.p_type);
                if (level) {
                    r.html += "<div class='ring_" + datatype + "_" + i + " ring'>";
                    r.html += "<div id = 'div_mapIcoDiv" + i + "' name='" + name + "' title='" + name + "' lon='" + lon + "' lat='" + lat + "' value='" + value + "' pointcode='" + id + "'  class = 'class_mapIcoDiv'>";
                    r.html += "<div class = 'aqi_tip_name' style='border:1px solid " + level.borderColor + "'>" + name + "</div>";
                    r.html += "<div class = 'aqi_tip_value' style='background: url(img/points/" + level.imgColor + ") no-repeat'>" + value + "</div>";
                    r.html += "</div>";
                    r.html += "</div>";
                }
            }
            else {
                //如果不是html覆盖物就设置默认点位样式
                r.symbol = new PictureMarkerSymbol('img/points/point.png', 18, 24);
            }

            //②PictureMarker覆盖物
            if (datatype == "airHour_Station") {
                var level = mugis.airClassify.getAirLevelAndColor(value, json.p_type);
                r.symbol = new PictureMarkerSymbol({ "url": "img/points/" + level.imgColor, "width": 18, "height": 24, "yoffset": 12 });
            }
            else if (datatype == "polluter_general" || datatype == "polluter_online") {
                r.symbol = new PictureMarkerSymbol('img/Polluter/GYWRY.png', 20, 20);
                if (json.SuperviseType == "01") {
                    r.symbol = new PictureMarkerSymbol('img/points/polluterGeneral/国控.png', 20, 20);
                }
                else if (json.SuperviseType == "02") {
                    r.symbol = new PictureMarkerSymbol('img/points/polluterGeneral/省控.png', 20, 20);
                }
                else if (json.SuperviseType == "03") {
                    r.symbol = new PictureMarkerSymbol('img/points/polluterGeneral/市控.png', 20, 20);
                } else {
                    r.symbol = new PictureMarkerSymbol('img/points/polluterGeneral/其他.png', 20, 20);
                }
            }
            else if (datatype == "polluter_gas") {
                r.symbol = new PictureMarkerSymbol('img/points/polluterGeneral/GYWRY.png', 20, 20);
                if (json.OnlineStatus == null) {
                    r.symbol = new PictureMarkerSymbol('img/points/polluterGas/废气-灰色.png', 20, 20);
                }
                else if (json.OnlineStatus == 0) {
                    r.symbol = new PictureMarkerSymbol('img/points/polluterGas/废气-灰色.png', 20, 20);
                }
                else if (json.OnlineStatus == 1) {
                    r.symbol = new PictureMarkerSymbol('img/points/polluterGas/废气-绿色.png', 20, 20);
                }
                else if (json.OnlineStatus == 2) {
                    r.symbol = new PictureMarkerSymbol('img/points/polluterGas/废气-红色.png', 20, 20);
                }
            }
            else if (datatype == "polluter_water") {
                r.symbol = new PictureMarkerSymbol('img/points/polluterGeneral/GYWRY.png', 20, 20);
                if (json.OnlineStatus == null) {
                    r.symbol = new PictureMarkerSymbol('img/points/polluterWater/废水-灰色.png', 20, 20);
                }
                else if (json.OnlineStatus == 0) {
                    r.symbol = new PictureMarkerSymbol('img/points/polluterWater/废水-灰色.png', 20, 20);
                }
                else if (json.OnlineStatus == 1) {
                    r.symbol = new PictureMarkerSymbol('img/points/polluterWater/废水-绿色.png', 20, 20);
                }
                else if (json.OnlineStatus == 2) {
                    r.symbol = new PictureMarkerSymbol('img/points/polluterWater/废水-红色.png', 20, 20);
                }
            }
            else if (datatype == "radiation") {
                r.symbol = new PictureMarkerSymbol('img/MapIcons/Radiation.png', 24, 24);
            }
            else if (datatype == "WaterDrink") {
                r.symbol = new PictureMarkerSymbol('img/points/WaterSurface/water_7.png', 20, 20);
                if (json.p_value == "Ⅰ") {
                    r.symbol = new PictureMarkerSymbol('img/points/WaterSurface/water_1.png', 20, 20);
                }
                else if (json.p_value == "Ⅱ") {
                    r.symbol = new PictureMarkerSymbol('img/points/WaterSurface/water_2.png', 20, 20);
                }
                else if (json.p_value == "Ⅲ") {
                    r.symbol = new PictureMarkerSymbol('img/points/WaterSurface/water_3.png', 20, 20);
                }
                else if (json.p_value == "Ⅳ") {
                    r.symbol = new PictureMarkerSymbol('img/points/WaterSurface/water_4.png', 20, 20);
                }
                else if (json.p_value == "Ⅴ") {
                    r.symbol = new PictureMarkerSymbol('img/points/WaterSurface/water_5.png', 20, 20);
                }
                else if (json.p_value == "劣Ⅴ") {
                    r.symbol = new PictureMarkerSymbol('img/points/WaterSurface/water_6.png', 20, 20);
                }
                else {
                    r.symbol = new PictureMarkerSymbol('img/points/WaterSurface/water_7.png', 20, 20);
                }
            } else if (datatype == "car" || datatype == "carhistory") {
                if (json.state == 1) {
                    r.symbol = new PictureMarkerSymbol('img/jidongche/point/zhandian3.png', 28, 35);
                }
                else if (json.state == 0) {
                    r.symbol = new PictureMarkerSymbol('img/jidongche/point/zhandian1.png', 28, 35);
                }
                r.html += "<div id='ring_" + datatype + "_" + i + "' class='ring_" + datatype + "' style='width:100px;height:120px;'></div>";
            }
        } catch (e) {

        }
        return r;
    }
};




/**********地图点位加载highcharts柱状图************* */
function loadChartOnMap(divId, Y, N) {
    $(divId).highcharts({
        chart: {
            type: 'column',
            options3d: {
                enabled: true,
                alpha: 15,
                beta: 0,
                depth: 50,
                viewDistance: 25
            },
            backgroundColor: 'rgba(255,255,255,0)'
        },
        colors: ['#8c93ec', '#56d373'],
        credits: {
            enabled: false
        },
        title: {
            text: ""
        },
        xAxis: {
            //categories: ['本月'],
            //                  categories:[title],
            visible: false,
            crosshair: false,
            labels: {
                style: {
                    color: '#BA222B',
                    fontSize: '8px',
                    fontWeight: 'bold',
                    fontFamily: '微软雅黑'
                }
            },
            //                  gridLineColor: '#BA222B',
            //                  lineColor: '#56d373',
            lineWidth: 1
        },
        yAxis: {
            visible: false,
            labels: {
                style: {
                    color: '#BA222B',
                    fontSize: '8px',
                    fontWeight: 'bold',
                    fontFamily: '微软雅黑'
                }
            },
            min: 0.1,
            title: {
                text: ''
            },
            //                  lineColor: '#56d373',
            lineWidth: 1
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px"></span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}:</td><td style="padding:0"><b>{point.y:1f}次</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            column: {
                depth: 25,
                pointPadding: 5,
                borderWidth: 0,
                pointWidth: 20
            }
        },
        series: [{
            name: '不合格',
            data: Y//[15]
        },
        {
            name: '合格',
            data: N//[30]
        }
        ]
    })
}
/**
 * 关闭地图弹窗
 */
function closeWindow() {
    if (map.infoWindow.isShowing == true) {
        map.infoWindow.hide();
    }
}
/**
 * 展示遥测车历史轨迹
 */
function showCarHistoryTrajectoryOnMap(json) {
    require([
		"esri/geometry/Polyline",
		"esri/graphic",
		"esri/layers/GraphicsLayer",
		"esri/symbols/SimpleLineSymbol"
    ], function (Polyline, Graphic, GraphicLayer, SimpleLineSymbol) {
        var layer = new GraphicLayer({ id: "carHistory" });
        if (layer) {
            layer.clear();
            map.removeLayer(layer);
        }
        var sls = new SimpleLineSymbol();
        sls.setWidth(3);
        sls.setColor("red");
        var jwd = [];

        for (var i = 0; i < json.length; i++) {
            var arr = [];
            arr.push(json[i]["longitude"]);
            arr.push(json[i]["latitude"]);
            jwd.push(arr);
            if (i == 0) {
                console.log(json[i]);
            }
        }
        var polylineJson = {
            "paths": [jwd],
            "spatialReference": { "wkid": 4326 }
        };

        var polyline = new Polyline(polylineJson);
        var graphic = new Graphic(polyline, sls);
        layer.add(graphic);
        map.addLayer(layer);
    });
}