//区县高亮显示
mugis.mapRegion = {
    //存储查出的regions结果
    results: null,
    //区县高亮显示(1code,2name)
    showCounty: function (regionsub, type) {
        //查询条件
        var queryWhere = "";
        if (regionsub == null || regionsub == undefined) {
            return;
        }
        if (type == null || type == 1) { //根据行政区划代码
            //图层中为数值型(以后需要删除，全部规定以字符串形式)
            regionsub += '0000000000';
            regionsub = regionsub.substring(0, 6);
            queryWhere = "RegionCode =" + regionsub + "";
            //图层中为字符串型
            //queryWhere = "RegionCode like '" + regionsub + "%' ";
        }
        else if (type == 2) {  //根据区县名称查询
            queryWhere = "NAME like '%" + regionsub + "%'";
        }
        else {
            return;
        }
        if (this.results == null) {
            queryTask(_mapSecondCitysLayerUrl, onResult, {
                qWhere: queryWhere,
                fault: onFault,
            })
        }
        else {
            onResult(this.results);
        }
        function onResult(result) {
            require([
                "esri/tasks/query",
                "esri/tasks/QueryTask",
                "esri/symbols/SimpleFillSymbol",
                "esri/symbols/SimpleLineSymbol",
                "esri/layers/GraphicsLayer",
                "esri/Color"
            ], function (Query, QueryTask, SimpleFillSymbol, SimpleLineSymbol, GraphicsLayer, Color) {
                if (result.features.length > 0) {
                    this.results = result.features;
                    if (map.getLayer("GL_MapRegion_county")) {
                        map.removeLayer(map.getLayer("GL_MapRegion_county"));
                    }
                    var CountyLayer = new GraphicsLayer({ id: "GL_MapRegion_county" });
                    for (var i = 0; i < result.features.length; i++) {
                        var graphic = result.features[i];
                        var geo = graphic.geometry;
                        map.setExtent(geo.getExtent());
                        var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, new Color([0, 22, 177]), 2.5));
                        graphic.setSymbol(symbol);
                        CountyLayer.add(graphic);
                    }
                    map.addLayer(CountyLayer, 20);
                }
            });
        }
        function onFault(error) {
            alert(error);
        }
    },
    //清除区县高亮显示图层
    clearRegion: function () {
        if (map.getLayer("GL_MapRegion_county")) {
            map.removeLayer(map.getLayer("GL_MapRegion_county"));
        }
    },
    //高亮显示权限区域
    hightLightUserMarkRegion: function (regionSub) {
        var searchlayer = _secondLevel;
        if (regionISAdmin_QX == true) {
            return;
        }
        require([
            "esri/tasks/query",
            "esri/tasks/QueryTask",
            "esri/symbols/SimpleFillSymbol",
            "esri/layers/GraphicsLayer"
        ], function (Query, QueryTask, SimpleFillSymbol, GraphicsLayer) {
            var query = new Query();
            var queryUrl = searchlayer;
            query.where = "1=1";//CODE<>'" + regionSub + "'
            query.returnGeometry = true;
            query.outFields = ["*"];
            var queryTask = new QueryTask(queryUrl);
            queryTask.execute(query, queryResult);
            function queryResult(e) {
                var features = e.features;
                if (map.getLayer("GL_baseMap_mark_QX")) {
                    map.removeLayer(map.getLayer("GL_baseMap_mark_QX"));
                }
                var regionGraphicLayer = new GraphicsLayer({ id: "GL_baseMap_mark_QX" });
                map.addLayer(regionGraphicLayer);
                debugger;
                for (var i = 0; i < features.length; i++) {
                    var feature = features[i];
                    var ismatch = false;
                    //ismatch = (feature.attributes["CODE"] || "").toString().indexOf(regionSub) > -1;
                    //ismatch = feature.attributes["CODE"] != regionSub;
                    ismatch = (feature.attributes["CITY"] || "").toString().indexOf(regionName_QX) > -1;
                    if (!ismatch) {
                        //其他需要遮盖的region
                        var gra = new getSFSymble(feature);
                        regionGraphicLayer.add(gra);
                    }
                    else {
                        //当前region
                        var gra = new getSFSymbleCurRegion(feature);
                        regionGraphicLayer.add(gra);
                    }
                }
                debugger;
            }
        });

        //获取非匹配区域面状样式
        function getSFSymble(d) {
            var e;
            require([
                "esri/graphic",
                "esri/symbols/SimpleFillSymbol",
                "esri/symbols/SimpleLineSymbol",
                "esri/Color"
            ], function (Graphic, SimpleFillSymbol, SimpleLineSymbol, Color) {
                var solidColor = new Color([204, 227, 236, 0.8]);
                var line = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([204, 0, 0]), 2);
                e = new esri.Graphic(d.geometry, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, null, solidColor));
            });
            return e;
        }

        //获取匹配区域面状样式
        function getSFSymbleCurRegion(d) {
            var e;
            require([
                "esri/graphic",
                "esri/symbols/SimpleFillSymbol",
                "esri/symbols/SimpleLineSymbol",
                "esri/Color"
            ], function (Graphic, SimpleFillSymbol, SimpleLineSymbol, Color) {
                var solidColor = new Color([204, 227, 236, 0]);
                var line = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 2);
                e = new esri.Graphic(d.geometry, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, line, solidColor));
            });
            return e;
        }
    }
}



