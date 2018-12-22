define([
  "dojo/_base/declare"
, "dojo/_base/lang"
, "esri/request"
, "dojo/dom"
, "esri/layers/GraphicsLayer"
, "esri/symbols/SimpleFillSymbol"
, "esri/symbols/SimpleLineSymbol"
, "esri/graphic"
, "esri/toolbars/draw"
, "esri/tasks/GeometryService"
, "esri/geometry/Circle"
, "esri/geometry/Point"
, "esri/units"
, "esri/SpatialReference"
, "esri/tasks/LengthsParameters"
, "esri/tasks/AreasAndLengthsParameters"
, "esri/config"
, "dojo/dom-style"
, "dojo/on"
, "dojo/dom-construct"
]
, function (declare, lang, esriRequest, dom, GraphicsLayer, SimpleFillSymbol, SimpleLineSymbol, Graphic, Draw, GeometryService, Circle, Point, Units, SpatialReference, LengthsParameters, AreasAndLengthsParameters, config, domStyle, dojoOn, domConstruct) {
    var map = null;
    var draw = null;
    //图形结果
    var drawGraphicsLayer = null;
    //图形
    var graph = null;
    var GraphicsLayerId = "GL_Widgets_Measure_01";

    declare("widgets.Measure", null, {
        constructor: function (args) {
            dojo.safeMixin(this, args);
            map = this.map;
            if (drawGraphicsLayer == null) {
                drawGraphicsLayer = new esri.layers.GraphicsLayer();
                drawGraphicsLayer.id = GraphicsLayerId;
                map.addLayer(drawGraphicsLayer);
            }
        },
        clear: function () {
            draw.deactivate();
            config._isSearching = false;
        },
        measure: function (graph) {
            //debugger
            if (map.getLayer(GraphicsLayerId) == null) {
                map.addLayer(drawGraphicsLayer);
            }

            map.setMapCursor("default");
            if (config._isSearching == true) {
                //return;
                draw.deactivate();
            }
            config._isSearching = true;
            graph = graph;
            draw = new esri.toolbars.Draw(map);
            draw.on("draw-end", showMeasureResults);
            draw.activate(graph);
        }
    });
    /**
    * 显示测量结果
    * @param evt
    */
    var showPt = null;
    function showMeasureResults(evt) {
        config._isSearching = false;
        draw.deactivate();
        map.setMapCursor("default");
        var geometry = evt.geometry;
        var gsvc = new esri.tasks.GeometryService(config.defaults.geometryService);
        switch (geometry.type) {
            case "polyline":
                {
                    var polylineSymbol = esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 2);
                    var length = geometry.paths[0].length;
                    showPt = new esri.geometry.Point(geometry.paths[0][length - 1], map.spatialReference);
                    var lengthParams = new esri.tasks.LengthsParameters();
                    lengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_KILOMETER;
                    lengthParams.polylines = [geometry];
                    lengthParams.geodesic = true;
                    var index = new Date().getTime();
                    gsvc.lengths(lengthParams, function (evtObj) {
                        showmeasureInfo(index, showPt, evtObj.lengths[0].toFixed(3), "千米");
                    });
                    var graphic = new Graphic(geometry, polylineSymbol);
                    graphic.attributes = { id: index };
                    drawGraphicsLayer.add(graphic);
                    break;
                }
            case "polygon":
                {
                    var polygonSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 2), new dojo.Color([125, 125, 125, 0.35]));
                    showPt = new Point(geometry.rings[0][0], map.spatialReference);
                    var areasAndLengthParams = new esri.tasks.AreasAndLengthsParameters();
                    areasAndLengthParams.calculationType = "geodesic";
                    areasAndLengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_KILOMETER;
                    areasAndLengthParams.areaUnit = esri.tasks.GeometryService.UNIT_SQUARE_KILOMETERS;
                    var outSR = new SpatialReference({ wkid: 102113 });
                    var index = new Date().getTime();
                    gsvc.project([geometry], outSR, function (simplifiedGeometries) {
                        areasAndLengthParams.polygons = simplifiedGeometries;
                        gsvc.areasAndLengths(areasAndLengthParams, function (evtObj) {
                            showmeasureInfo(index, showPt, evtObj.areas[0].toFixed(3), "平方千米");
                        });
                    });
                    var graphic = new Graphic(geometry, polygonSymbol);
                    graphic.attributes = { id: index };
                    drawGraphicsLayer.add(graphic);
                    break;
                }
        }

    }
    /**
    * 显示测量结果
    * @param showPnt
    * @param data
    * @param unit
    */

    function showmeasureInfo(index, showPnt, data, unit) {
        domConstruct.create("div", { class: "class_widgets_measure", id: 'measureDIV' + index, innerHTML: "<table cellpadding='0' cellspacing ='0' border ='0'><tr><td valign = 'middle'><div id = 'measureresult" + index + "' style='font-size:12px;margin-top:-2px' ></div></td><td><div id = 'infoclose" + index + "' style='margin-top:2px;cursor:pointer'><img src ='img/drawedit/delete.png' style=\"vertical-align:baseline\"></img></div></td></tr></table>" }, dojo.body());
        domStyle.set("measureDIV" + index, {
            border: "1px solid red",
            background: "#ffffff"
        });
        var isShow = false;
        var screenPnt = map.toScreen(showPnt);
        //9.21(qlq)由于.topbar不存在，导致top也成undefind
        //var topbarHeight = dojo.query(".topbar").style("height")[0];
        var topbarHeight = -40;
        domStyle.set("measureDIV" + index, {
            left: screenPnt.x + "px",
            top: screenPnt.y + topbarHeight + "px",
            position: "absolute",
            height: "18px",
            display: "block"
        });
        isShow = true;
        domStyle.set("measureDIV" + index, {
            zIndex: "999"
        });
        dom.byId("measureresult" + index).innerHTML = data + " " + unit;

        dojoOn(dom.byId("infoclose" + index), "click", function () {
            if (drawGraphicsLayer) {

                for (var i = 0; i < drawGraphicsLayer.graphics.length; i++) {
                    if (drawGraphicsLayer.graphics[i].attributes.id == index) {
                        drawGraphicsLayer.remove(drawGraphicsLayer.graphics[i]);

                        if (dom.byId("measureDIV" + index) != null) {
                            domConstruct.destroy("measureDIV" + index);
                        }
                    }
                }
            }
            isShow = false;
        });

        var panStart = dojo.connect(map, "onPanStart", function () {
            for (var i = 0; i < drawGraphicsLayer.graphics.length; i++) {
                domStyle.set("measureDIV" + drawGraphicsLayer.graphics[i].attributes.id, {
                    display: "none"
                });
            }
        });
        var panEnd = dojo.connect(map, "onPanEnd", function () {
            if (isShow == true) {
                var point = null;
                for (var i = 0; i < drawGraphicsLayer.graphics.length; i++) {
                    var geometry = drawGraphicsLayer.graphics[i].geometry;
                    if (geometry.type == "polyline") {
                        var length = geometry.paths[0].length;
                        point = new esri.geometry.Point(geometry.paths[0][length - 1], map.spatialReference);

                    }
                    else if (geometry.type == "polygon") {
                        point = new Point(geometry.rings[0][0], map.spatialReference);
                    }
                    screenPnt = map.toScreen(point);
                    domStyle.set("measureDIV" + drawGraphicsLayer.graphics[i].attributes.id, {
                        left: screenPnt.x + "px",
                        top: screenPnt.y + topbarHeight + "px",
                        position: "absolute",
                        height: "18px",
                        display: "block"
                    });
                }
            }

        });
        var zoomStart = dojo.connect(map, "onZoomStart", function () {
            for (var i = 0; i < drawGraphicsLayer.graphics.length; i++) {
                domStyle.set("measureDIV" + drawGraphicsLayer.graphics[i].attributes.id, {
                    display: "none"
                });
            }
        });
        var zoomEnd = dojo.connect(map, "onZoomEnd", function () {
            if (isShow == true) {
                var point = null;
                for (var i = 0; i < drawGraphicsLayer.graphics.length; i++) {

                    var geometry = drawGraphicsLayer.graphics[i].geometry;
                    if (geometry.type == "polyline") {
                        var length = geometry.paths[0].length;
                        point = new esri.geometry.Point(geometry.paths[0][length - 1], map.spatialReference);

                    }
                    else if (geometry.type = "polygon") {
                        point = new Point(geometry.rings[0][0], map.spatialReference);
                    }
                    screenPnt = map.toScreen(point);
                    domStyle.set("measureDIV" + drawGraphicsLayer.graphics[i].attributes.id, {
                        left: screenPnt.x + "px",
                        top: screenPnt.y + topbarHeight + "px",
                        position: "absolute",
                        height: "18px",
                        display: "block"
                    });
                }
            }
        });

        //将地图事件的句柄添加到句柄集合中。
        require(["esri/config"], function (config) {
            config._eventHandlers.push(panStart);
            config._eventHandlers.push(panEnd);
            config._eventHandlers.push(zoomStart);
            config._eventHandlers.push(zoomEnd);
        });
    }
});