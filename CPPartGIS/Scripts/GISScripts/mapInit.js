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
				var spatialReference = new SpatialReference({wkt:'PROJCS["北京地方坐标系",GEOGCS["GCS_Beijing_1954",DATUM["D_Beijing_1954",SPHEROID["Krasovsky_1940",6378245.0,298.3]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",300000.0],PARAMETER["Central_Meridian",116.3502518],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",39.86576603],UNIT["Meter",1.0]]'});
// 				var spatialReference = new esri.SpatialReference({
// 					wkid: 3857
// 				});
				//Popup
				var popup = new Popup({
					titleInBody: false,
					highlight: false
				}, domConstruct.create("div"));
				domClass.add(popup.domNode, "light");

				//默认地图范围
				mapinfo.initExtent = new esri.geometry.Extent(mapconfig.extent);
				mapinfo.initExtent.setSpatialReference(spatialReference);
				// mapinfo.initExtent = new esri.geometry.Extent(-20037508.342787, -20037508.342787, 20037508.342787, 20037508.342787,spatialReference)
				//加载天地图
				mapinfo.map = map = new esri.Map("map", {
					logo: false,
					slider: false,
					extent: mapinfo.initExtent
				});
				// _this.addTDTBaseMap("baseMap_VEC");
				// _this.loadTdtLayer();
				var dLayer = new mapAPI.ArcGISDynamicMapServiceLayer(mapconfig.vectorMapServerUrl, {
					id: "baseMap_VEC"
				});
				// 				var infoTemplate1 = new mapAPI.InfoTemplate("${BZMC}", "<div>名称：${BZMC}</div><div>地址：${DZ}</div><div>街道名称：${SSZJ}</div>");
				// 				var infoTemplate2 = new mapAPI.InfoTemplate("${类型}", "<div>名称：${类型}</div>");
				// 				var infoTemplate3 = new mapAPI.InfoTemplate("${QLR}", "<div>企业名称：${QLR}</div><div>土地性质：${TDXZ}</div><div>类别代码名称：${LBDMMC}</div>");
				// 				var infoTemplate4 = new mapAPI.InfoTemplate("${BZMC}", "<div>名称：${BZMC}<div>地址：${DZ}</div><div>街道名称：${SSZJ}</div>");
				// 				var infoTemplate5 = new mapAPI.InfoTemplate("${类型}", "<div>名称：${类型}</div>");
				// 				var infoTemplate6 = new mapAPI.InfoTemplate("${QLR}", "<div>企业名称：${QLR}</div><div>土地性质：${TDXZ}</div><div>类别代码名称：${LBDMMC}</div>");
				// 				var infoTemplates = {
				// 					0: {
				// 						infoTemplate: infoTemplate1,
				// 						layerUrl: null
				// 					},
				// 					1: {
				// 						infoTemplate: infoTemplate2,
				// 						layerUrl: null
				// 					},
				// 					2: {
				// 						infoTemplate: infoTemplate3,
				// 						layerUrl: null
				// 					},
				// 					3: {
				// 						infoTemplate: infoTemplate4,
				// 						layerUrl: null
				// 					},
				// 					4: {
				// 						infoTemplate: infoTemplate5,
				// 						layerUrl: null
				// 					},
				// 					5: {
				// 						infoTemplate: infoTemplate6,
				// 						layerUrl: null
				// 					}
				// 				};
				// 				dLayer.setInfoTemplates(infoTemplates);
				// map.addLayer(new WebTileLayer("t"));
				map.addLayer(dLayer);

				/*显示经纬度*/
				dojo.connect(map, "onMouseMove", function(event) {
					if (event.mapPoint.x && event.mapPoint.y) {
						$("#PositionBar").html("坐标x:" + event.mapPoint.x.toFixed(3) + "     坐标y:" + event.mapPoint.y.toFixed(3));
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
	},
	loadTdtLayer() {
		dojo.declare("WebTileLayer", esri.layers.TiledMapServiceLayer, {
			_type: "",
			constructor: function(type) {
				this._type = type;
				this.spatialReference = new esri.SpatialReference({
					wkid: 3857
				});
				this.initialExtent = (this.fullExtent =
					new esri.geometry.Extent(-20037508.342787, -20037508.342787, 20037508.342787, 20037508.342787,
						this.spatialReference));


				this.tileInfo = new esri.layers.TileInfo({
					"rows": 256,
					"cols": 256,
					"compressionQuality": 0,
					"origin": {
						"x": -20037508.342787,
						"y": 20037508.342787
					},
					"spatialReference": {
						"wkid": 3857
					},

					"lods": [{
							"level": 0,
							"resolution": 156543.033928,
							"scale": 591657527.591555
						},
						{
							"level": 1,
							"resolution": 78271.5169639999,
							"scale": 295828763.795777
						},
						{
							"level": 2,
							"resolution": 39135.7584820001,
							"scale": 147914381.897889
						},
						{
							"level": 3,
							"resolution": 19567.8792409999,
							"scale": 73957190.948944
						},
						{
							"level": 4,
							"resolution": 9783.93962049996,
							"scale": 36978595.474472
						},
						{
							"level": 5,
							"resolution": 4891.96981024998,
							"scale": 18489297.737236
						},
						{
							"level": 6,
							"resolution": 2445.98490512499,
							"scale": 9244648.868618
						},
						{
							"level": 7,
							"resolution": 1222.99245256249,
							"scale": 4622324.434309
						},
						{
							"level": 8,
							"resolution": 611.49622628138,
							"scale": 2311162.217155
						},
						{
							"level": 9,
							"resolution": 305.748113140558,
							"scale": 1155581.108577
						},
						{
							"level": 10,
							"resolution": 152.874056570411,
							"scale": 577790.554289
						},
						{
							"level": 11,
							"resolution": 76.4370282850732,
							"scale": 288895.277144
						},
						{
							"level": 12,
							"resolution": 38.2185141425366,
							"scale": 144447.638572
						},
						{
							"level": 13,
							"resolution": 19.1092570712683,
							"scale": 72223.819286
						},
						{
							"level": 14,
							"resolution": 9.55462853563415,
							"scale": 36111.909643
						},
						{
							"level": 15,
							"resolution": 4.77731426794937,
							"scale": 18055.954822
						},
						{
							"level": 16,
							"resolution": 2.38865713397468,
							"scale": 9027.977411
						},
						{
							"level": 17,
							"resolution": 1.19432856685505,
							"scale": 4513.988705
						},
						{
							"level": 18,
							"resolution": 0.597164283559817,
							"scale": 2256.994353
						},
						{
							"level": 19,
							"resolution": 0.298582141647617,
							"scale": 1128.497176
						}
					]
				});

				this.loaded = true;
				this.onLoad(this);
			},

			getTileUrl: function(level, row, col) {
				if (this._type == null)
					return 'http://webst0' + (col % 4 + 1) + '.is.autonavi.com/appmaptile?style=6&x=' + col + '&y=' + row +
						'&z=' + level;
				else if (this._type == "t")
					return 'http://t' + (col % 7) +
						'.tianditu.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL=' +
						col + '&TILEROW=' + row + '&TILEMATRIX=' + level;
			}
		});
	}
};
