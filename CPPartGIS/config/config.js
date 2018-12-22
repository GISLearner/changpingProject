var rootPath2;
//页面的访问地址截断，获得页面起始根路径
if (window.location.href.indexOf("?") != -1) {
    rootPath2 = window.location.href.substr(0, window.location.href.indexOf("?"));
    rootPath2 = rootPath2.substr(0, rootPath2.lastIndexOf("/") + 1);
} else {
    rootPath2 = window.location.href.substr(0, window.location.href.lastIndexOf("/") + 1);
}
if (window.location.href.lastIndexOf("?token=") != -1) {
    window.location.href = rootPath2;
}

//config配置信息
(function () {
    //config配置信息
    config = {
        //url连接
        url: {
            login: rootPath2 + "LoginService.asmx"
        },

        //风向数据
        windDataRoot: "http://120.194.188.56:8112/WeatherData/",

        //接口服务地址
        service: {
            hjjcService: rootPath2 + "HJJCService.asmx",
            zxjcService: "",
            yjService: "",

        },

        //使用登录控制
        isUseLogin: true,

        //cookie值
        cookie: {
            tokenCookieName: "GIS_USER_TOKEN",
            cookieExpire: 24
        },

        //文档页面标题
        documentTitle: "地理信息公共服务平台数据展示系统",

        //系统logo后的标题，若logo中带有标题，则设置此值为空字符串
        systemTitle: "地理信息公共服务平台数据展示系统",

        //版权信息
        copyrightText: "Copyright &copy; 2018-{now} 中科宇图科技股份有限公司 All rights reserved.",


    };
})();






















////跨域文件
//var _proxyUrl = rootPath + "proxy/proxy.ashx";
////图片资源
//var _defaultImageUrl = rootPath + "IMG";

///*地图服务地址(矢量、栅格DEM，影像)*/
//var _vectorMapServerUrl = "http://192.168.120.103:6080/arcgis/rest/services/WenshanMap/MapServer";
////var _rasterMapServerUrl = "http://192.168.120.106:6080/arcgis/rest/services/YunNanMapService/MapServer";
//var _rasterMapServerUrl = "http://192.168.120.103:6080/arcgis/rest/services/WenshanDemMap/MapServer";
//var _imgMapServerUrl = "http://192.168.120.106:6080/arcgis/rest/services/YunNanMapService/MapServer";

////默认地图服务地址
//var _defaultMapServerUrl = _vectorMapServerUrl;

////几何服务地址
////var _geometryServer = "http://192.168.120.106:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer";
//var _geometryServer = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer";

////打印服务
////var _mapPrintServerUrl = "http://192.168.120.148:6080/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task";
//var _mapPrintServerUrl = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task";