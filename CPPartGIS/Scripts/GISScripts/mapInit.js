/**
 * 初始化地图.
 */
mugis.mapInit = {
	/*地图类型，1地图服务，2地图容器，3天地图*/
	mapType: 1,

	//esriBasemaps配置（外置）
	esriBasemaps: null,

	/**
	 * 初始化地图.
	 * @param {function} callback - callback加载完地图之后执行回调函数.
	 */
	initMap: function(callback) {
		var _this = this;
		//地图初始化
		require([
				"dojo/request", "dojo/on", "dojo/dom", "dojo/query", "dojo/topic", "dojo/parser", "dijit/registry",
				"dojo/_base/lang", "dojo/dom-construct", "dojo/request/script", "dojo/_base/array",
				"esri/dijit/Basemap", "esri/dijit/Popup", "dojo/dom-class",
				"dijit/form/VerticalSlider", "esri/dijit/InfoWindow", "esri/map", "esri/dijit/OverviewMap",
				"esri/dijit/Scalebar", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/layers/ArcGISTiledMapServiceLayer",
				"esri/layers/FeatureLayer", "widgets/TDTLayer", "esri/dijit/Legend", "esri/toolbars/navigation",
				"esri/toolbars/draw",
				"esri/toolbars/edit",
				"esri/tasks/GeometryService", "esri/tasks/LengthsParameters", "esri/tasks/AreasAndLengthsParameters",
				"esri/geometry/Geometry", "esri/geometry/Point", "esri/geometry/Polyline", "esri/geometry/Polygon",
				"esri/geometry/Extent",
				"esri/InfoTemplate", "esri/SpatialReference", "esri/symbols/TextSymbol", "esri/graphic", "esri/Color",
				"esri/dijit/Print", "esri/tasks/PrintTask", "esri/tasks/PrintParameters", "esri/tasks/PrintTemplate",
				"esri/tasks/QueryTask", "esri/tasks/query", "esri/tasks/IdentifyTask", "esri/tasks/IdentifyParameters",
				"esri/symbols/PictureFillSymbol", "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleLineSymbol",
				"esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleFillSymbol", "esri/tasks/FindTask",
				"esri/tasks/FindParameters", "esri/tasks/BufferParameters", "esri/geometry/normalizeUtils",
				"esri/layers/GraphicsLayer", "esri/symbols/Font", "esri/tasks/LegendLayer", "dojo/domReady!"
			],
			function(request, on, dom, query, topic, parser, registry,
				lang, domConstruct, Script, arrayUtils, Basemap, Popup, domClass,
				VerticalSlider, InfoWindow, Map, OverviewMap, Scalebar,
				ArcGISDynamicMapServiceLayer, ArcGISTiledMapServiceLayer, FeatureLayer, TDTLayer,
				Legend, Navigation, Draw, Edit,
				GeometryService, LengthsParameters, AreasAndLengthsParameters,
				Geometry, Point, Polyline, Polygon, Extent, InfoTemplate,
				SpatialReference, TextSymbol, Graphic, Color,
				Print, PrintTask, PrintParameters, PrintTemplate,
				QueryTask, Query, IdentifyTask, IdentifyParameters,
				PictureFillSymbol, PictureMarkerSymbol, SimpleLineSymbol, SimpleMarkerSymbol, SimpleFillSymbol,
				FindTask, FindParameters, BufferParameters, NormalizeUtils, GraphicsLayer, Font, LegendLayer
			) {
				parser.parse();
				mapAPI.InfoWindow = InfoWindow;
				mapAPI.Map = Map;
				mapAPI.OverviewMap = OverviewMap;
				mapAPI.Scalebar = Scalebar;
				mapAPI.ArcGISDynamicMapServiceLayer = ArcGISDynamicMapServiceLayer;
				mapAPI.ArcGISTiledMapServiceLayer = ArcGISTiledMapServiceLayer;
				mapAPI.FeatureLayer = FeatureLayer;
				mapAPI.Legend = Legend;
				mapAPI.Navigation = Navigation;
				mapAPI.Draw = Draw;
				mapAPI.Edit = Edit;
				mapAPI.GeometryService = GeometryService;
				mapAPI.LengthsParameters = LengthsParameters;
				mapAPI.AreasAndLengthsParameters = AreasAndLengthsParameters;
				mapAPI.Geometry = Geometry;
				mapAPI.Point = Point;
				mapAPI.Polyline = Polyline;
				mapAPI.Polygon = Polygon;
				mapAPI.Extent = Extent;
				mapAPI.InfoTemplate = InfoTemplate;
				mapAPI.SpatialReference = SpatialReference;
				mapAPI.Graphic = Graphic;
				mapAPI.Color = Color;
				mapAPI.PictureMarkerSymbol = PictureMarkerSymbol;
				mapAPI.SimpleFillSymbol = SimpleFillSymbol;
				mapAPI.SimpleLineSymbol = SimpleLineSymbol;
				mapAPI.SimpleMarkerSymbol = SimpleMarkerSymbol;
				mapAPI.TextSymbol = TextSymbol;
				mapAPI.PrintTask = PrintTask;
				mapAPI.PrintParameters = PrintParameters;
				mapAPI.PrintTemplate = PrintTemplate;
				mapAPI.GraphicsLayer = GraphicsLayer;
				mapAPI.FindTask = FindTask;
				mapAPI.FindParameters = FindParameters;
				mapAPI.BufferParameters = BufferParameters;
				mapAPI.NormalizeUtils = NormalizeUtils;
				mapAPI.QueryTask = QueryTask;
				mapAPI.Query = Query;
				mapAPI.IdentifyTask = IdentifyTask;
				mapAPI.IdentifyParameters = IdentifyParameters;
				mapAPI.Font = Font;
				mapAPI.LegendLayer = LegendLayer;
				mapAPI.Popup = Popup;
				mapAPI.domConstruct=domConstruct;
				mapAPI.domClass=domClass;
				mapAPI.isLoad = true;

				//esriConfig默认参数配置
				// 				esriConfig.defaults.io.alwaysUseProxy = false;
				// 				esriConfig.defaults.io.proxyUrl = mapconfig.proxyUrl;
				// 				esriConfig.defaults.io.corsDetection = false;

				esriConfig._eventHandlers = new Array(); //绑定地图事件句柄数组
				esriConfig._isSearching = false; //判断查询是否结束
				esriConfig.defaults.geometryService = mapconfig.geometryServer;
				esriConfig.defaults.extent = mapconfig.extent;
				esriConfig.defaults.hotLayerList = mapconfig.hotLayerList;
				// var spatialReference = new SpatialReference({wkt:'PROJCS["北京地方坐标系",GEOGCS["GCS_Beijing_1954",DATUM["D_Beijing_1954",SPHEROID["Krasovsky_1940",6378245.0,298.3]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",300000.0],PARAMETER["Central_Meridian",116.3502518],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",39.86576603],UNIT["Meter",1.0]]'});
// 				var spatialReference = new esri.SpatialReference({
// 					wkid: 3857
// 				});

				mapinfo.map = map = $.common.initMap("map");
				
				$.common.addTDTBaseMap(map,"baseMap_IMG");

				/*显示经纬度*/
				dojo.connect(map, "onMouseMove", function(event) {
					if (event.mapPoint.x && event.mapPoint.y) {
						$("#PositionBar").html("经度:" + event.mapPoint.x.toFixed(3) + "     纬度:" + event.mapPoint.y.toFixed(3));
					}
				});

				/*地图比例尺*/
				require(["esri/dijit/Scalebar"], function(Scalebar) {
					var scalebar = new Scalebar({
						map: map,
						attachTo: "bottom-left",
						scalebarUnit: "metric"
					});
				});


				setTimeout(function() {
					//callback回调加入队列
					if (callback) {
						callback();
					}
				}, 0);
			});
	}

	
};
