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


				//Popup
				var popup = new Popup({
					titleInBody: false,
					highlight: false
				}, domConstruct.create("div"));
				domClass.add(popup.domNode, "light");

				//默认地图范围
				// mapinfo.initExtent = new esri.geometry.Extent(mapconfig.extent);

				//加载天地图
				mapinfo.map = map = new esri.Map("map", {
					logo: false,
					slider: false
				});
				// _this.addTDTBaseMap("baseMap_VEC");
				var dLayer = new mapAPI.ArcGISDynamicMapServiceLayer(mapconfig.vectorMapServerUrl, {
					id: "baseMap_VEC"
				});
				var infoTemplate1 = new mapAPI.InfoTemplate("${BZMC}", "<div>名称：${BZMC}</div><div>地址：${DZ}</div><div>街道名称：${SSZJ}</div>");
				var infoTemplate2 = new mapAPI.InfoTemplate("${类型}", "<div>名称：${类型}</div>");
				var infoTemplate3 = new mapAPI.InfoTemplate("${QLR}", "<div>企业名称：${QLR}</div><div>土地性质：${TDXZ}</div><div>类别代码名称：${LBDMMC}</div>");
				var infoTemplate4 = new mapAPI.InfoTemplate("${BZMC}", "<div>名称：${BZMC}<div>地址：${DZ}</div><div>街道名称：${SSZJ}</div>");
				var infoTemplate5 = new mapAPI.InfoTemplate("${类型}", "<div>名称：${类型}</div>");
				var infoTemplate6 = new mapAPI.InfoTemplate("${QLR}", "<div>企业名称：${QLR}</div><div>土地性质：${TDXZ}</div><div>类别代码名称：${LBDMMC}</div>");
				var infoTemplates = {
					0: {
						infoTemplate: infoTemplate1,
						layerUrl: null
					},
					1: {
						infoTemplate: infoTemplate2,
						layerUrl: null
					},
					2: {
						infoTemplate: infoTemplate3,
						layerUrl: null
					},
					3: {
						infoTemplate: infoTemplate4,
						layerUrl: null
					},
					4: {
						infoTemplate: infoTemplate5,
						layerUrl: null
					},
					5: {
						infoTemplate: infoTemplate6,
						layerUrl: null
					}
				};
				dLayer.setInfoTemplates(infoTemplates);
				map.addLayer(dLayer);

				/*显示经纬度*/
				dojo.connect(map, "onMouseMove", function(event) {
					$("#PositionBar").html("坐标x:" + event.mapPoint.x.toFixed(3) + "     坐标y:" + event.mapPoint.y.toFixed(3));
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
	},

	/**
	 * 加载天地图.
	 * @param {string} type - 天地图类型参数(baseMap_VEC,baseMap_DEM,baseMap_IMG).
	 */
	addTDTBaseMap: function(type) {
		//矢量（baseMap_VEC）、地形（baseMap_DEM）、影像图（baseMap_IMG）
		var tdt; //地图
		var tdlt; //地图标注
		require([
			"widgets/TDTLayer"
		], function(TDTLayer) {
			if (type == "baseMap_VEC") {
				//矢量
				var tdt = new TDTLayer("http://t0.tianditu.com/vec_c/wmts", {
					noteType: "vec_c"
				});
				tdt.id = type;
			} else if (type == "baseMap_DEM") {
				//地形图（不显示）
				var tdt = new TDTLayer("http://t0.tianditu.cn/ter_c/wmts", {
					noteType: "ter_c"
				});
				tdt.id = type;
			} else if (type == "baseMap_IMG") {
				//影像  
				var tdt = new TDTLayer("http://t0.tianditu.com/img_c/wmts", {
					noteType: "img_c"
				});
				tdt.id = type;
			}
			var tdlt = new TDTLayer("http://t0.tianditu.com/cva_c/wmts", {
				noteType: "cva_c"
			});
			tdlt.id = type + "_labelmark";
			map.addLayer(tdt, 0);
			map.addLayer(tdlt, 1);
		});
	}
};
