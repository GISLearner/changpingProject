define([
  "dojo/_base/declare"
, "dojo/_base/lang"
, "esri/request"
, "dojo/dom"
, "esri/layers/GraphicsLayer"
, "esri/symbols/SimpleFillSymbol"
, "esri/symbols/PictureMarkerSymbol"
, "esri/symbols/SimpleLineSymbol"
, "esri/symbols/SimpleMarkerSymbol"
, "esri/graphic"
, "./Expand/DrawEx"
, "esri/geometry/Point"
, "esri/toolbars/edit"
, "esri/Color"
, "esri/config"
, "dojo/on"

]
, function (declare, lang, esriRequest, dom, GraphicsLayer, SimpleFillSymbol, PictureMarkerSymbol, SimpleLineSymbol, SimpleMarkerSymbol, Graphic, Draw, Point, Edit, Color, config, dojoOn) {
    var map = null;
    var draw = null;
    //图形结果
    var drawGraphicsLayer = null;
    //图形编辑
    var editToolbar = null;
    //图层名称
    var GraphicsLayerId = "GL_Widgets_DynamicPlot_01";
    //图形
    var graph = null;
    //图形尺寸
    var graphSize;
    //背景颜色
    var bgColor;
    //透明度
    var alph;
    //边框尺寸
    var borderSize;
    //边框颜色
    var borderColor;

    declare("widgets.DynamicPlot", null, {
        //构造函数
        constructor: function (args) {
            dojo.safeMixin(this, args);
            map = this.map;
            graphSize = this.graphSize;
            bgColor = this.bgColor;
            alph = this.alph;
            borderSize = this.borderSize;
            borderColor = this.borderColor;
            if (drawGraphicsLayer == null) {
                drawGraphicsLayer = new esri.layers.GraphicsLayer();
                drawGraphicsLayer.id = GraphicsLayerId;
                map.addLayer(drawGraphicsLayer);
                drawGraphicsLayer.on("click", activeEdit);
            }
        },
        clear: function () {
            draw.deactivate();
            config._isSearching = false;
        },
        draw: function (graph) {
            //判断是否正在查询
            //debugger
            if (config._isSearching == true) {
                //return;
                draw.deactivate();
            }
            config._isSearching = true;
            graph = graph;
            draw = new esri.toolbars.Draw(map);
            draw.on("draw-end", showResults);
            draw.activate(graph);

        }
    });
    function showResults(evt) {
        config._isSearching = false;
        if (map.getLayer(GraphicsLayerId) == null) {
            map.addLayer(drawGraphicsLayer);
        }
        draw.deactivate();
        map.setMapCursor("default");
        var geometry = evt.geometry;
        var symbol = null;
        var borderC = Color.fromRgb(borderColor);
        borderC.a = alph / 100;
        var bgC = Color.fromRgb(bgColor);
        bgC.a = alph / 100;

        switch (geometry.type) {
            case "point":
                symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, graphSize, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, borderC, borderSize), bgC);
                break;
            case "multipoint":
                symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, graphSize, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, borderC, borderSize), bgC);
                break;
            case "polyline":
                symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, bgC, graphSize);
                break;
            case "polygon":
                symbol = SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, borderC, borderSize), bgC);
                break;
        }
        var graphic = new Graphic(geometry, symbol);
        drawGraphicsLayer.add(graphic);

    }
    function activeEdit(evt) {
        graphic = evt.graphic;
        editToolbar = new Edit(map);
        var tool = 0;
        tool = tool | Edit.MOVE;
        var options = {
            allowAddVertices: true,
            allowDeleteVertices: true,
            uniformScaling: true
        };
        editToolbar.activate(tool, graphic, options);
    }
});