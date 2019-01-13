
//菜单按钮操作
$(function () {
	
});

/**
 * 加载jspanel.
 */
function openJspanelModel(params) {
    //id, title, src, width, height,left, top,
    params = params || {};
    params.width = params.width || 390;
    params.height = params.height || (window.innerHeight - 10 - 30 - 7);
    if (params.changeHeight) {
        params.height = params.height + params.changeHeight;
    }
    params.left = params.left || 10;
    params.top = params.top || 10;

    utils.jspanelInit.initJspanelModel(params);
}

/**
 * 窗体关闭进行自定义清除操作.
 * @@param {string} param1 - param_desc.
 * @@return undefined
 */
function jspanelModelCloseClear(id) {
    id = id || "";
    id = id.replace("jspanel_", '')
    if (id == "AirQualityHour") {
        mugis.mapClear.clearLabels([".areaSearch", '#timecontainer', '.rightYj']);
        windy = null;
    }
    else {

    }
}


//关闭窗口后清空图层、事件、图例、设置默认范围
function clearMapPanel() {
    //清空所有覆盖物
    MapUniGIS.MapClear.clearAll();
    //设置默认范围
    map_FullExtent();
    //清除图例
    map_ClearLegend();
    jspanel = null;
}
