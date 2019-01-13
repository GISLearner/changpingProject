//全局map对象
var map = null;

//document ready 初始化
$(function () {
    //初始化地图
    mugis.mapInit.initMap(function(){
		initMapCallback()
	});
})

/**
 * 地图加载完之后回调函数.
 */
function initMapCallback() {
    //初始化地图上的按钮绑定事件
    //initButton();
    ////根据权限删除配置的部分城市
    //initCitys_QX();
    ////权限设置
    //initQuanXian();
    ////初始化mark权限遮盖层
    //mapRegion.hightLightUserMarkRegion(regionCodeSub_QX);
	app.init();
    //initToolBar();
}


/**
 * 初始化gis工具.
 * @@param {string} param1 - param_desc.
 * @@return undefined
 */
function initToolBar() {
    //放大
    document.getElementById("toolZoomIn").onclick = function () {
        var grade = map.getLevel();
        map.setLevel(grade + 1);

        $(".tool_drop").css("display", "none");
        $(this).addClass("active").siblings().removeClass("active");
    };
    //缩小
    document.getElementById("toolZoomOut").onclick = function () {
        var grade = map.getLevel();
        map.setLevel(grade - 1);

        $(".tool_drop").css("display", "none");
        $(this).addClass("active").siblings().removeClass("active");
    };
    //漫游
    document.getElementById("toolPan").onclick = function () {
        tool_draw_clear();
        map.setMapCursor("default");

        $(".tool_drop").css("display", "none");
        $(this).addClass("active").siblings().removeClass("active");
    };
    //全图
    document.getElementById("toolFullExtent").onclick = function () {
        //mugis.mapZoom.setFullExtent();
		map.setExtent(mapinfo.initExtent);
    };
    //清除
    document.getElementById("toolClear").onclick = function () {
        tool_draw_clear();
        map.setMapCursor("default");
        mugis.mapClear.clearAll();

        $(".tool_drop").css("display", "none");
        $("#toolPan").addClass("active").siblings().removeClass("active");
    };


    //测距
    document.getElementById("toolMeasure").onclick = function () {
        if ($("#toolMeasure" + "_drop").css("display") == "none") {
            $(".tool_drop").css("display", "none");
            $("#toolMeasure" + "_drop").css("display", "block");
        }
        else {
            $("#toolMeasure" + "_drop").css("display", "none");
        }
        $(this).addClass("active").siblings().removeClass("active");
    };
}


var measure;
var spaceSearch;
var bufferSearch;
var plot;

//清空绘制状态
function tool_draw_clear() {
    if (measure != undefined) {
        measure.clear();
    }
    if (spaceSearch != undefined) {
        spaceSearch.clear();
    }
    if (bufferSearch != undefined) {
        bufferSearch.clear();
    }
    if (plot != undefined) {
        plot.clear();
    }
}

//测量
function btn_measure(index) {
    tool_draw_clear();
    require(["widgets/Measure"], function (Navigation) {
        measure = new widgets.Measure({
            map: map
        });
        if (index == 0) {
            measure.measure(esri.toolbars.Draw.POLYLINE);
        } else if (index == 1) {
            measure.measure(esri.toolbars.Draw.POLYGON);
        }
    });
}

//全屏
function toggleFullScreen() {
    if (!isFullscreen()) { // current working methods
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

/**
* [isFullscreen 判断浏览器是否全屏]
* @return [全屏则返回当前调用全屏的元素,不全屏返回false]
*/
function isFullscreen() {
    //全屏Element，不全屏false
    return document.fullscreenElement ||
        document.msFullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement || false;
}