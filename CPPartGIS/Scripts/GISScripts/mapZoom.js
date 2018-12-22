//地图范围和缩放操作
mugis.mapZoom = {
    //地图全图展示
    setFullExtent: map_FullExtent,
    //点位居中地图放大
    centerAtAndZoom: map_CenterAtAndZoom,
    //设置地图缩放范围
    setExtent: function (extent, scale) {
        //scale倍数
        map.setExtent(new Extent(config.Extent));
    }
};


//地图全图展示
function map_FullExtent() {
    require(["esri/geometry/Extent", "esri/config", "esri/SpatialReference"], function (Extent, config, SpatialReference) {
        //默认投影(勿删)
        map.setExtent(new Extent(mapconfig.extent));
        //map.setExtent(new Extent({ "xmax": esriConfig._extend.xmax, "xmin": esriConfig._extend.xmin, "ymax": esriConfig._extend.ymax, "ymin": esriConfig._extend.ymin }));

        //自定义投影(勿删)
        //var extent1 = new Extent(esriConfig._extend.xmin, esriConfig._extend.ymin, esriConfig._extend.xmax, esriConfig._extend.ymax, new SpatialReference('GEOGCS["MapInfo Generic Lat/Long",DATUM["D_MAPINFO",SPHEROID["World_Geodetic_System_of_1984_GEM_10C",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]]'));
        //map.setExtent(extent1);
    });
}


//点位居中地图放大
//通过传入坐标的经纬度，使坐标停靠在地图的中间位置，同时放大一定范围
function map_CenterAtAndZoom(lon, lat, lvl) {
    require([
        "esri/geometry/Point"
        , "esri/geometry/Extent"
        , "esri/graphic"
        , "esri/layers/GraphicsLayer"
        , "esri/symbols/PictureMarkerSymbol"
        , "esri/config"
    ], function (Point, Extent, Graphic, GraphicsLayer, PictureMarkerSymbol, config) {

        var point = new Point(lon, lat, map.spatialReference);
        map.centerAndZoom(point, lvl);
        map.centerAt(point);

        var pointSymbl = PictureMarkerSymbol({ "url": "IMG/hotpoint/hotpoint.gif"/*"IMG/map/hotpoint.gif"*/, "height": 48, "width": 48, "yoffset": 0, "type": "esriPMS" });
        var graphic = new Graphic(point, pointSymbl);

        if (map.getLayer("GL_HotPoint")) {
            map.removeLayer(map.getLayer("GL_HotPoint"));
        }
        var graphicsLayer = new GraphicsLayer({ id: "GL_HotPoint" });
        graphicsLayer.add(graphic);
        map.addLayer(graphicsLayer, 0);
    });
}