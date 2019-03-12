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
		
		picUrl:"http://39.105.40.172/parkPic/",

		//跨域文件
		proxyUrl: rootPath + "proxy/proxy.ashx",

		//图片资源
		defaultImageUrl: rootPath + "IMG",

		/*地图服务地址(矢量、栅格DEM，影像)*/
		// vectorMapServerUrl: "http://39.105.40.172:6080/arcgis/rest/services/昌平园招商引资/MapServer",
		// vectorMapServerUrl: "http://39.105.40.172:6080/arcgis/rest/services/CPparks_WGS84_L/MapServer",
		vectorMapServerUrl:"http://39.105.40.172:6080/arcgis/rest/services/CPparks_WGS84/MapServer",
		rasterMapServerUrl: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer",
		imgMapServerUrl: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer",
		pointIcon:"img/points/point.png",
		clusterIcon:"img/points/location.png",
		clusterMinIcon:"img/points/locationMin.png",
		//几何服务地址
		geometryServer: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer",
		//打印服务
		mapPrintServerUrl: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
 
		//地图范围
		extent: {
			"xmin": 12848116.944046713,
			"ymin": 4873810.2488809675,
			"xmax": 13026506.989269175,
			"ymax": 4904907.791233301
		},

// 		extent: {
// 			"xmin": 115.75248382757904,
// 			"ymin": 40.0088338055052,
// 			"xmax": 116.59831500748614,
// 			"ymax": 40.33236893436515
// 		},

		//地图加载
		baseMap: {
			//地图加载的默认参数layer,zoom level,center...
		},
	
		layerInfoConfigs : [
			{
				layerId:"1",
				layerCode:"architectureLayer",
				layerType:"建筑",
				nameField:"CQDW",//名称字段
				ydmjField:"ZJZMJ",//用地面积字段
				jzmjField:"DXJSMJ",//建筑面积字段
				typeField:"FWLX",//建筑类型字段
				idField:"FID",//唯一ID
				searchStatus:"jz",
				pointIcon:"img/points/jianzhu.png",
				fieldInfos:[
					{
						fieldLabel:"名称",
						fieldName:"CQDW"
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
				layerId:"3",
				layerCode:"suppfaciliLayer",
				layerType:"配套设施",
				nameField:"类型",
				ydmjField:"Shape_Area",//用地面积字段
				typeField:"类型",//设施类型字段
				idField:"FID",//唯一ID
				searchStatus:"ptss",
				pointIcon:"img/points/sheshi.png",
				fieldInfos:[
					{
						fieldLabel:"类型",
						fieldName:"类型"
					}
				]
			},
			{
				layerId:"0",
				layerCode:"entLandLayer",
				layerType:"企业",
				nameField:"TDQLR",
				ydmjField:"JZZMJ",//用地面积字段
				typeField:"GHMC",//利用类型字段
				idField:"FID",//唯一ID
				searchStatus:"qy",
				pointIcon:"img/points/qiye.png",
				fieldInfos:[
					{
						fieldLabel:"企业名称",
						fieldName:"QLR"
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
			},
			{
				layerId:"4",
				layerCode:"subPark",
				layerType:"分园区",
				nameField:"FYQMC",//名称
				ydmjField:"MJGQ",//用地面积字段
				idField:"FID",//唯一ID
				geoType:"polygon",
				searchStatus:"fyq",
				pointIcon:"",
				fieldInfos:[
					{
						fieldLabel:"企业名称",
						fieldName:"QLR"
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
		],
		layerSearchColumns:[
			{
				field:"data_id",
				title:"#",
				width:20
			},
			{
				field:"data_name",
				title:"名称",
				width:150
			},
			{
				field:"data_type",
				title:"类型",
				width:60
			},
			{
				field:"FID",
				title:"FID",
				visible:false,
				width:60
			},
			{
				field:"layerId",
				title:"layerId",
				visible:false,
				width:60
			}
		],
		highLightIcon:"img/hotpoint/hong.gif"

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
