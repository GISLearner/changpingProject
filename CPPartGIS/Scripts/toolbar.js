var geometryService;
document.oncontextmenu = function () { return false; }
$(document).ready(function () {
    document.getElementById("map").onmousedown = function () {
        if (event.button == 2) {
            document.getElementById("toolPan").onclick();
        }
    }
    var interval = setInterval(loadtools, 10);
    function loadtools() {
        if (map) {
            clearInterval(interval);
            navToolbar = new mapAPI.Navigation(map);
            drawToolbar = new mapAPI.Draw(map, {
            });

            drawToolbar.on("draw-complete", drawEndHandler);
            drawToolbar.on("draw-end", drawCompleteHandler);

            geometryService = new mapAPI.GeometryService(geometryServiceUrl);
        }
    }

    $("#searchContianer .clear").click(function () {
        try {
            map.graphics.clear();
            map.infoWindow.hide();
            $("#addressList").hide();
            //$("#addressList table").remove();
            $("#searchContianer .searchBtn").show();
            $("#searchContianer .clear").hide();
            $("#searchContianer #map_searchBox").val("");
        } catch (e) {

        }
    })

    //放大
    document.getElementById("toolZoomIn").onclick = function () {
        drawToolbar.deactivate();
        navToolbar.deactivate();
        map.setMapCursor("url('/Scripts/GisScript/img/icons/newicons/ZoomInTool_B_16.png'),auto");
        navToolbar.activate(mapAPI.Navigation.ZOOM_IN);
        $(this).addClass("active").siblings().removeClass("active");
    };
    //缩小
    document.getElementById("toolZoomOut").onclick = function () {
        drawToolbar.deactivate();
        navToolbar.deactivate();
        map.setMapCursor("url('/Scripts/GisScript/img/icons/newicons/ZoomOutTool_B_16.png'),auto");
        navToolbar.activate(mapAPI.Navigation.ZOOM_OUT);
        $(this).addClass("active").siblings().removeClass("active");
    };
    //平移
    document.getElementById("toolPan").onclick = function () {
        drawToolbar.deactivate();
        navToolbar.deactivate();
        map.setMapCursor("url('/Scripts/GisScript/img/icons/newicons/PanTool_B_16.png'),auto");
        navToolbar.activate(mapAPI.Navigation.PAN);
        $(this).addClass("active").siblings().removeClass("active");
    };
    //全图
    document.getElementById("toolFullExtent").onclick = function () {
        drawToolbar.deactivate();
        navToolbar.deactivate();
        map.setMapCursor(null);
        setFullExtent();
        $("#toolPan").addClass("active").siblings().removeClass("active");
    };
    //测距
    document.getElementById("toolMeasure").onclick = function () {
        drawToolbar.deactivate();
        navToolbar.deactivate();
        map.setMapCursor("crosshair");
        drawToolbar.activate(mapAPI.Draw.POLYLINE);
        $(this).addClass("active").siblings().removeClass("active");
    };
    //测面
    document.getElementById("toolMeasureArea").onclick = function () {
        drawToolbar.deactivate();
        navToolbar.deactivate();
        map.setMapCursor("crosshair");
        drawToolbar.activate(mapAPI.Draw.POLYGON);
        $(this).addClass("active").siblings().removeClass("active");
    };

    var timer;
    //标绘
    document.getElementById("toolPlotting").onmouseover = function () {
        drawToolbar.deactivate();
        navToolbar.deactivate();
        map.setMapCursor("url('/Scripts/GisScript/img/icons/newicons/PanTool_B_16.png'),auto");
        navToolbar.activate(mapAPI.Navigation.PAN);
        clearTimeout(timer);
        $(this).addClass("active").siblings().removeClass("active");
        $(".dynamickPlot").show();
    };

    document.getElementById("toolPlotting").onmouseout = function () {
        timer = setTimeout(function () {
            $("#toolPan").addClass("active").siblings().removeClass("active");
            $(".dynamickPlot").hide();
        }, 100);

    }

    $(".dynamickPlot").mouseover(function () {
        clearTimeout(timer);
        //$("#toolPlotting").removeClass("active");
        //$(".dynamickPlot").show();
    });

    $(".dynamickPlot").mouseout(function () {
        timer = setTimeout(function () {
            $("#toolPlotting").removeClass("active");
            $(".dynamickPlot").hide();
        }, 100);
    });

    //动态标绘图形尺寸
    $("#txt_graph").slider({
        range: "min",
        value: 25,
        min: 0,
        max: 50,
        slide: function (event, ui) {
            $("#txt_graphValue").html(ui.value);
        }
    });

    //动态标绘边框尺寸
    $("#txt_border").slider({
        range: "min",
        value: 1,
        min: 0,
        max: 10,
        slide: function (event, ui) {
            $("#txt_borderValue").html(ui.value);
        }
    });

    //动态标绘透明度
    $("#text_opacity").slider({
        range: "min",
        value: 100,
        min: 0,
        max: 100,
        slide: function (event, ui) {
            $("#text_opacityValue").html(ui.value);
        }
    });

    //构建背景颜色选择器

    $("#sp_bgcolor").minicolors({
        defaultValue: "#00ff00",
        change: function (hex, opacity) {
            if (!hex) { return; }
            else {
                $(this).parent().find(".minicolors-swatch").css("background-color", hex);
            }
        }
    });
    $("#sp_bgcolor").parent().find(".minicolors-swatch").css("background-color", "#00ff00");
    //构建边框颜色选择器
    $("#sp_bordercolor").minicolors({
        defaultValue: '#00ff00',
        change: function (hex, opacity) {
            if (!hex) { return; }
            else {
                $(this).parent().find(".minicolors-swatch").css("background-color", hex);
            }
        }
    });
    $("#sp_bordercolor").parent().find(".minicolors-swatch").css("background-color", "#00ff00");
    //打印
    document.getElementById("toolPrint").onclick = function () {
        var titleText = prompt("请输入打印标题", "")
        if (titleText == null || titleText == "") {
            return;
        }

        $("#toolPan").addClass("active").siblings().removeClass("active");
        var printTask = new mapAPI.PrintTask(printUrl);
        var template = new mapAPI.PrintTemplate();
        template.exportOptions = {
            width: 800,//仅导出地图的宽度 
            height: 600,//仅导出地图的高度 
            dpi: 96 //仅导出地图的dpi  
        };
        var realName = getCookie("realname");
        var userName = getCookie("username");

        //打印输出的参数数组，为打印输出的模板提供参数准备
        //template.label ="BJMAP";//什么鬼？
        //            template.format = "JPG";//输出格式：pdf | png32 | png8 | jpg | gif | eps | svg | svgz
        template.layout = "Letter ANSI A Landscape";//打印输出模板
        template.preserveScale = false;
        var legend = new mapAPI.LegendLayer();
        //legend.layerId = "speLayer";
        template.layoutOptions = {
            //legendLayers:["图层1", "图层2", "图层3"],
            "scalebarUnit": "Kilometers",
            "titleText": titleText,//标题
            "authorText": realName || adminName,//作者
            "copyrightText": "北京市环保局",//版权文本,
            "legendLayers": legend //显示的图例,为空不显示
        };
        mu.tool.EasyUILoad("正在打印地图...");
        var params = new mapAPI.PrintParameters();
        params.map = map;
        params.template = template;
        printTask.execute(params, function (evt) {
            mu.tool.dispalyEasyUILoad();
            window.open(evt.url, "_blank");
        }, function (e) {
            mu.tool.dispalyEasyUILoad();
            mu.tool.alertFunc("打印失败！");
        });
    };
    //清空
    document.getElementById("toolClearGraphic").onclick = function () {
        $("#toolPan").addClass("active").siblings().removeClass("active");
        qGeometry = null;
        drawGeo = null;
        map.graphics.clear();
        drawToolbar.deactivate();
        navToolbar.deactivate();
        if (plot) plot.clear();
        if (geoToolbar) {
            geoToolbar.deactivate();
        }
        map.setMapCursor("default");
        var layerIds = map.graphicsLayerIds;
        for (var i = 0; i < layerIds.length; i++) {
            var id = layerIds[i];
            var re = /[^0-9]$/;
            if (re.test(id)) {
                var layer = map.getLayer(layerIds[i]);
                if (layer) layer.setVisibility(false);
            }
        }
        $("#staticsChart").css("display", "none");//隐藏数量统计图
        mu.tool.clearHighPoint();
    };

    $("#identifyResult").draggable({ handle: ".title", containment: 'parent' });

    //关闭点选查询窗口
    $("#identifyResult .close").click(function () {
        $("#identifyResult").hide();
    })

    //鼠标点选查询
    $("#toolPointSearch").click(function () {
        map.setMapCursor("url('images/Main/maptoolbar/identity.png'),auto");
        var marSearchClick = map.on("click", function (e) {
            var targetPoint = e.mapPoint;
            flickPoint(targetPoint);

            var coorText = "经度：" + targetPoint.x.toFixed(4) + " 纬度：" + targetPoint.y.toFixed(4);
            $("#identifyResult .lacationValue").val(coorText);
            $("#identifyResult .featureDetail").html();
            var params = getParams(_identifyParam, targetPoint, dynLyrUrl, showInfo);
            var options = {
                hasInfoWin: false,
                returnGeometry: false
            }
            mu.tool.EasyUILoad("正在查询数据");
            options.resultParam = "tree";
            mu.tool.identifyTask(map, params, options);

            var params2 = getParams(_identifyParam2, targetPoint, specialUrl, showInfo);
            options.resultParam = "tree2";
            //专题图层查询
            mu.tool.identifyTask(map, params2, options);
        })

        function getParams(identifyParam, targetPoint, layerUrl, resultFun) {
            var layerList = [];
            var layerLength = identifyParam.layerCount;
            var layerGroupIds = identifyParam.layerGroupIDs;
            for (var l = 0; l < layerLength; l++) {
                var isGroup = false;
                for (var g = 0; g < layerGroupIds.length; g++) {
                    if (l == layerGroupIds[g]) {
                        isGroup = true;
                        break;
                    }
                }
                if (isGroup == false) {
                    layerList.push(l);
                }
            }
            var params = {
                layerUrl: layerUrl,
                qGeometry: targetPoint,
                layerIds: layerList,
                resultFun: resultFun
            }
            return params;
        }

        //闪烁点选
        function flickPoint(point) {
            var gra = new mapAPI.Graphic();
            var symbol = new mapAPI.SimpleMarkerSymbol(mapAPI.SimpleMarkerSymbol.STYLE_CIRCLE, 20, new mapAPI.SimpleLineSymbol(mapAPI.SimpleLineSymbol.STYLE_SOLID, new mapAPI.Color([100, 100, 100]), 1), new mapAPI.Color([255, 0, 0, 0.25]));
            gra.symbol = symbol;
            gra.geometry = point;
            map.graphics.add(gra);
            setTimeout(function () {
                clearGra();
            }, 2000);


            function clearGra() {
                map.graphics.remove(gra);
            }

        }

        //点选结果信息
        function showInfo(e, treeID) {
            mu.tool.dispalyEasyUILoad();
            if (e.length > 0) {
                $("#identifyResult").show();
            }
            map.setMapCursor("default");
            marSearchClick.remove();
            var zNodes = [];
            var curretnLayerName;
            var j = 0;
            for (var i = 0; i < e.length; i++) {
                var item = e[i];
                var layerName = item.layerName;
                var featureName = item.feature.attributes.Name;
                var zGroupNode = {};
                if (curretnLayerName != layerName) {
                    j++;
                    var isOpen = false;
                    if (j == 1) {
                        isOpen = true;
                    }
                    curretnLayerName = layerName;
                    zGroupNode = {
                        id: j,
                        pId: 0,
                        name: layerName,
                        open: isOpen
                    }
                    zNodes.push(zGroupNode);
                }
                var zNode = {
                    id: 1000 + i,
                    pId: j,
                    name: featureName,
                    file: "core/standardData"
                };
                zNodes.push(zNode);
            }
            loadTree(e, zNodes, treeID);
        }
    });

    $("#identifyResult .tab li").click(function () {
        $(this).addClass("selected").siblings().removeClass("selected");
        if ($(this).html() == "地图数据") {
            $("#tree").show();
            $("#tree2").hide();
        }
        else {
            $("#tree2").show();
            $("#tree").hide();
        }
    });

    //加载树
    function loadTree(e, zNodes, treeID) {
        var setting = {
            view: {
                dblClickExpand: false,
                showLine: true,
                selectedMulti: false
            },
            data: {
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "pId",
                    rootPId: ""
                }
            },
            callback: {
                beforeClick: function (treeId, treeNode) {
                    var zTree = $.fn.zTree.getZTreeObj("tree");
                    if (treeNode.isParent) {
                        zTree.expandNode(treeNode);
                        return false;
                    } else {
                        showNodeData(treeNode.id);
                        return true;
                    }
                }
            }
        };
        var t = $("#" + treeID);
        t = $.fn.zTree.init(t, setting, zNodes);

        function showNodeData(id) {
            var nodeData = e[id - 1000];
            var att = nodeData.feature.attributes;
            var dataHtml = "<table class='dataInfo'>";
            for (var t in att) {
                dataHtml += "<tr><td>" + t + "</td><td>" + att[t] + "</td></tr>";
            }
            dataHtml += "</table>";
            $("#identifyResult .featureDetail").html(dataHtml);
        }
    }


    function drawCompleteHandler(evt) {
        var s = new mapAPI.Geometry();
        //map.graphics.clear();
        var geometry = evt.geometry;
        var symbol = null;
        switch (geometry.type) {
            case "point":
                symbol = new mapAPI.SimpleMarkerSymbol(mapAPI.SimpleMarkerSymbol.STYLE_SQUARE, 10, new mapAPI.SimpleLineSymbol(mapAPI.SimpleLineSymbol.STYLE_SOLID, new mapAPI.Color([255, 0, 0]), 1), new mapAPI.Color([0, 255, 0, 0.25]));
                break;
            case "polyline":
                symbol = new mapAPI.SimpleLineSymbol(mapAPI.SimpleLineSymbol.STYLE_DASH, new mapAPI.Color([255, 0, 0]), 1);
                break;
            case "polygon":
                symbol = new mapAPI.SimpleFillSymbol(mapAPI.SimpleFillSymbol.STYLE_NONE, new mapAPI.SimpleLineSymbol(mapAPI.SimpleLineSymbol.STYLE_DASHDOT, new mapAPI.Color([255, 0, 0]), 2), new mapAPI.Color([255, 255, 0, 0.25]));
                break;
        }
        //计算距离和面积
        switch (geometry.type) {
            case "polyline":
                symbol = drawToolbar.lineSymbol;
                var lengthParams = new mapAPI.LengthsParameters();
                lengthParams.polylines = [geometry];
                lengthParams.lengthUnit = mapAPI.GeometryService.UNIT_METER;
                lengthParams.geodesic = true;
                lengthParams.polylines[0].spatialReference = new mapAPI.SpatialReference(4326);
                geometryService.lengths(lengthParams, function (result) {
                    var resultTemp = result.lengths[0] / 1000;
                    var textSymbol = new mapAPI.TextSymbol(resultTemp.toFixed(3) + "千米");//保留3位小数
                    textSymbol.setFont(new mapAPI.Font().setFamily("SimSun"));
                    var pathIndex = geometry.paths.length - 1;
                    var pointIndex = geometry.paths[pathIndex].length - 1;
                    var endPoint = geometry.getPoint(pathIndex, pointIndex);
                    var lineResultGraphic = new mapAPI.Graphic(endPoint, textSymbol);
                    map.graphics.add(lineResultGraphic);
                });
                break;
            case "polygon":
                symbol = drawToolbar.fillSymbol;
                var areasAndLengthParams = new mapAPI.AreasAndLengthsParameters();
                areasAndLengthParams.lengthUnit = mapAPI.GeometryService.UNIT_KILOMETER;
                areasAndLengthParams.areaUnit = mapAPI.GeometryService.UNIT_SQUARE_KILOMETERS;
                areasAndLengthParams.calculationType = "preserveShape";
                var outSaptialRef = new mapAPI.SpatialReference(4326);

                geometryService.simplify([geometry], function (simplifiedGeometries) {
                    areasAndLengthParams.polygons = simplifiedGeometries;
                    areasAndLengthParams.polygons[0].spatialReference = new mapAPI.SpatialReference(4326);
                    geometryService.areasAndLengths(areasAndLengthParams, function (result) {
                        var resultTemp = result.areas[0];
                        var resultOperationed = resultTemp.toString().substring(0, resultTemp.toString().indexOf('.') + 3);
                        var textSymbol = new mapAPI.TextSymbol(resultOperationed + "平方千米");
                        textSymbol.setFont(new mapAPI.Font().setFamily("SimSun"));
                        var centerPoint = geometry.getCentroid();
                        var polygonResultGraphic = new mapAPI.Graphic(centerPoint, textSymbol);
                        map.graphics.add(polygonResultGraphic);
                    });
                });
                break;
        }
        var graphic = map.graphics.add(new mapAPI.Graphic(geometry, symbol));
    };
    function drawEndHandler(evt) {

    }

    function setFullExtent() {
        var extent = new esri.geometry.Extent({
            "xmin": mapExtent[0], "ymin": mapExtent[2], "xmax": mapExtent[1], "ymax": mapExtent[3],
            "spatialReference": { "wkid": 4326 }
        })
        map.setExtent(extent);
    }

    //获取指定的cookie值
    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = $.trim(ca[i]);
            //var c = ca[i].trim();
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    }

});

var plot;
//动态标绘
function btn_DynamicPlot(index) {
    var graphSize = $("#txt_graphValue").html();
    var bgColor = $("#sp_bgcolor").parent().find(".minicolors-swatch").css("background-color");
    var alph = $("#text_opacityValue").html();
    var borderSize = $("#txt_borderValue").html();
    var borderColor = $("#sp_bordercolor").parent().find(".minicolors-swatch").css("background-color");
    require(["GisScript/DynamicPlot"], function (DynamicPlot) {

        plot = new widgets.DynamicPlot({ map: map, graphSize: graphSize, bgColor: bgColor, alph: alph, borderSize: borderSize, borderColor: borderColor });
        switch (index) {
            case 0:
                plot.draw(esri.toolbars.Draw.POINT);
                break;
            case 1:
                plot.draw(esri.toolbars.Draw.MULTI_POINT);
                break;
            case 2:
                plot.draw(esri.toolbars.Draw.LINE);
                break;
            case 3:
                plot.draw(esri.toolbars.Draw.POLYLINE);
                break;
            case 4:
                plot.draw(esri.toolbars.Draw.POLYGON);
                break;
            case 5:
                plot.draw(esri.toolbars.Draw.FREEHAND_POLYLINE);
                break;
            case 6:
                plot.draw(esri.toolbars.Draw.FREEHAND_POLYGON);
                break;
            case 7:
                plot.draw(esri.toolbars.Draw.ARROW);
                break;
            case 8:
                plot.draw(esri.toolbars.Draw.LEFT_ARROW);
                break;
            case 9:
                plot.draw(esri.toolbars.Draw.RIGHT_ARROW);
                break;
            case 10:
                plot.draw(esri.toolbars.Draw.UP_ARROW);
                break;
            case 11:
                plot.draw(esri.toolbars.Draw.DOWN_ARROW);
                break;
            case 12:
                plot.draw(esri.toolbars.Draw.CIRCLE);
                break;
            case 13:
                plot.draw(esri.toolbars.Draw.ELLIPSE);
                break;
            case 14:
                plot.draw(esri.toolbars.Draw.RECTANGLE);
                break;
            case 15:
                plot.draw(esri.toolbars.Draw.CURVE);
                break;
            case 16:
                plot.draw(esri.toolbars.Draw.BEZIER_CURVE);
                break;
            case 17:
                plot.draw(esri.toolbars.Draw.BEZIER_POLYGON);
                break;
            case 18:
                plot.draw(esri.toolbars.Draw.FREEHAND_ARROW);
                break;
            case 19:
                plot.draw(esri.toolbars.Draw.TRIANGLE);
                break;
        }

    });
}



