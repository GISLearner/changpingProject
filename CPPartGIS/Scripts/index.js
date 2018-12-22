//popPanel弹框配置
var popPanelConfig = {
    "air": { id: "AirQualityHour", title: "大气", src: "Panel/AirQualityHour/default.html", width: 390, height: null, changeHeight: null },
    "water": { id: "WaterSurface", title: "水环境", src: "Panel/WaterSurface/Default.html", width: 390, height: null },
    "polluter": { id: "Polluter", title: "在线监测", src: "Panel/Polluter/Default.html", width: 390, height: null },
};

/**
 * 打开popPanel弹框.
 * @param {string} type - 弹框类型.
 */
function openPopPanel(type) {
    var c = popPanelConfig[type];
    var mumap = document.getElementById("mumap");
    if (c && mumap) {
        mumap.contentWindow.openJspanelModel(c);
    }
}

$(function () {

});


