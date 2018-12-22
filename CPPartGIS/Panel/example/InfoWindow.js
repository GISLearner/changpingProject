//var testentjson = [{
//    "EntCode": "1",
//    "EntName": "国祯污水处理有限公司",
//    "p_lat": 23.6272,
//    "p_lon": 105.644,
//    "regionCode": "530100000000",
//    "regionName": "昆明市",
//    "SuperviseType": "01",
//    "IfOnlineMonitoringEnt": 1,
//    "OnlineStatus": null,
//    "rank": 1,
//    "CityName": "昆明市",
//    "EntAddress": "XX县",
//    "FK_NationalEIndustry": "棉纺织",
//    "FK_PolluterSuperviseType": "XX县",
//    "LegalPpersonName": "李一",
//    "ScaleName": "大企业",
//    "CreateDate": "2017-01-01",
//    "BasinName": "红河"
//}];

//1.	EntCode:130300164943
//2.	EntName:"中节能淇县水务有限公司"
//3.	IfGasEnterprise:1
//4.	IfOnlineMonitoringEnt:1
//5.	IfWaterEnterprise:0
//6.	OnlineStatus:1
//7.	RegionCode:611001000
//8.	RegionName:"市辖区"
//9.	SuperviseType:1
//10.	basinCode:"0100000000"
//11.	clusterId:2
//12.	p_address:"鹤壁市淇县南杨庄村东300米"
//13.	p_id:130300164943
//14.	p_lat:33.583943
//15.	p_lon:109.966672
//16.	p_name:"中节能淇县水务有限公司"
//17.	tradeCode:"AF"
//18.	tradeName:"其他"

/*一企一档地址*/
var oneEnterInfoUrl = _oneEnterInfoUrl;

//arcgis js api 地址
var _defaultImageUrl = window.parent._arcgisJSAPIUrl;

//查询出的该企业信息
var searchResult = [];

var paramObject;

$(document).ready(function () {
    debugger;
    paramObject = coustomTool.GetURLParams(document.location.href);

    var FK_City = "";//城市编码
    var FK_Basin = "";//流域编码
    var FK_PolluterSuperviseType = "";//控制级别编码
    var FK_EntScale = "";//企业规模编码
    var FK_NationalEIndustry = "";//行业类型编码

    if (paramObject.id != "" && paramObject.id != null) {
        //获取当前企业信息
        if (paramObject.type == "online") {
            var loading = coustomTool.Loading("body", '../../IMG/loading/loading.gif');
            $.post("../../Ashx/ashx.ashx", {
                serviceName: "ZXJCService",
                methodName: "GetEnterList",
                params: "EntCode=" + paramObject.id + "&EntName=&regionCode=&tradeCode=&SuperviseType=&onlineEnterprise="
            }, function (result) {
                coustomTool.UnLoading(loading);
                $("#div_body").css("visibility", "visible");
                result = (result == null || result == undefined || result.trim() == "") ? "[]" : result;
                var json = eval("(" + result + ")");
                success(json || []);
            })
            .error(function () {
                coustomTool.UnLoading(loading);
                //success([]);
            });

            function success(json) {
                searchResult = json;

                if (json.length > 0) {
                    $("#EntID").html((json[0]["EntCode"] == null || json[0]["EntCode"] == "") ? "---" : json[0]["EntCode"]);
                    $("#EntName").html((json[0]["EntName"] == null || json[0]["EntName"] == "") ? "---" : json[0]["EntName"]);
                    $("#EntFR").html((json[0]["LegalPpersonName"] == null || json[0]["LegalPpersonName"] == "") ? "---" : json[0]["LegalPpersonName"]);
                    $("#EntRegion").html((json[0]["RegionName"] == null || json[0]["RegionName"] == "") ? "---" : json[0]["RegionName"]);
                    $("#EntAddress").html((json[0]["p_address"] == null || json[0]["p_address"] == "") ? "---" : json[0]["p_address"]);
                }

                debugger;
                $("#EntName").html($("#EntName").html() + '我我我我我我我我我');
                if ($("#EntName").html().length > 12) {
                    $("#EntName").attr("title", $("#EntName").html());
                    $("#EntName").html($("#EntName").html().substr(0, 12) + '...');
                }

                //$("#EntName").attr("href", oneEnterInfoUrl + "&enterPriseCode=" + paramObject.id + "&username=system");
                //$("#EntName").attr("href", oneEnterInfoUrl + "&enterPriseCode=" + "0002486" + "&username=system");
            }
        }
        else if (paramObject.type == "allEnt") {

        }

    }

});

//打开详细信息界面
function openDetailPop() {
    openInfoWindow("InfoWindowDetail", 320, 500);
}

//打开在线监测界面
function openZXJCPop() {
    openInfoWindow("InfoWindowZXJC", 320, 550);
}

//打开InfoWindow
function openInfoWindow(windowName, height, width) {
    if (searchResult && searchResult.length > 0) {
        var urlParam = "&name=" + searchResult[0]["EntName"] + "&code=" + searchResult[0]["EntCode"] + "&type=" + paramObject.type + "&lon=" + paramObject.lon + "&code=" + paramObject.lat;
        var popWindowUrl = "Panel/Polluter/" + windowName + ".html"
        var popWindowParam = {};
        popWindowParam["popWindowUrl"] = popWindowUrl;
        popWindowParam["urlParam"] = urlParam;
        popWindowParam["popHeight"] = height || 320;
        popWindowParam["popWidth"] = width || 500;
        window.parent.infoW_openInfoWindow(/*searchResult[0]["p_lon"], searchResult[0]["p_lat"],*/paramObject.p_lon, paramObject.p_lat, searchResult[0]["EntCode"], searchResult[0]["EntName"], popWindowParam);
    }
}
