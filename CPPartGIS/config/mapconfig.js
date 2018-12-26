var rootPath;
//页面的访问地址截断，获得页面起始根路径
if (window.location.href.indexOf("?") != -1) {
	rootPath = window.location.href.substr(0, window.location.href.indexOf("?"));
	rootPath = rootPath.substr(0, rootPath.lastIndexOf("/") + 1);
} else {
	rootPath = window.location.href.substr(0, window.location.href.lastIndexOf("/") + 1);
}
if (window.location.href.lastIndexOf("?token=") != -1) {
	window.location.href = rootPath;
}

//mapconfig配置信息
(function(window) {
	//gis通用方法入口
	mugis = {};

	mapAPI = {};

	//mapconfig配置信息
	mapconfig = {
		//页面起始根路径
		rootPath: rootPath,

		//跨域文件
		proxyUrl: rootPath + "proxy/proxy.ashx",

		//图片资源
		defaultImageUrl: rootPath + "IMG",

		/*地图服务地址(矢量、栅格DEM，影像)*/
		vectorMapServerUrl: "http://39.106.156.190:6080/arcgis/rest/services/cp_parks/MapServer",
		rasterMapServerUrl: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer",
		imgMapServerUrl: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer",

		//几何服务地址
		geometryServer: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer",
		//打印服务
		mapPrintServerUrl: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",

		//地图范围
		extent: {
			"xmin": 488485.1466894255,
			"ymin": 335718.66197623423,
			"xmax": 492472.51385740034,
			"ymax": 338242.192606966
		},

		//地图加载
		baseMap: {
			//地图加载的默认参数layer,zoom level,center...
		},
	
		layerInfoConfigs : [
			{
				layerId:"0",
				layerCode:"architectureLayer",
				nameField:"BZMC",
				pointIcon:"img/icon/build.png",
				fieldInfos:[
					{
						fieldLabel:"名称",
						fieldName:"BZMC"
					},
					{
						fieldLabel:"地址",
						fieldName:"DZ"
					},
					{
						fieldLabel:"街道名称",
						fieldName:"SSZJ"
					}
				]
			},
			{
				layerId:"1",
				layerCode:"suppfaciliLayer",
				nameField:"类型",
				pointIcon:"img/icon/park.png",
				fieldInfos:[
					{
						fieldLabel:"类型",
						fieldName:"类型"
					}
				]
			},
			{
				layerId:"5",
				layerCode:"entLandLayer",
				nameField:"SYDW",
				pointIcon:"",
				fieldInfos:[
					{
						fieldLabel:"企业名称",
						fieldName:"SYDW"
					},
					{
						fieldLabel:"土地性质",
						fieldName:"TDXZ"
					},
					{
						fieldLabel:"土地性质",
						fieldName:"TDXZ"
					},
					{
						fieldLabel:"用地类别",
						fieldName:"LYLB"
					},
					{
						fieldLabel:"备注",
						fieldName:"BZ"
					}
				]
			}
		]

	};

	//map地图对象信息
	mapinfo = {
		map: null,
		initExtent: null,
		panStart: null,
		panEnd: null,

	};

	Array.prototype.remove = function(val) {
		var index = this.indexOf(val);
		if (index > -1) {
			this.splice(index, 1);
		}
	};

})(window);
