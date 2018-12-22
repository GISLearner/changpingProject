/**
 * jspanel加载.
 */
utils.jspanelInit = {
    //jspanelModel
    jspanelModel: null,
    //jspanelPop
    jspanelPop: [],

    /**
     * 加载jspanelModel.
     * @param {object} params - params={id, title, width, height, left, top, src}.
     */
    initJspanelModel: function (params, callback) {
        var _this = this;

        //id, title, src, width, height, left, top
        params = params || {};
        params.id = params.id || "";
        params.title = params.title || "标题";
        params.src = params.src || "#";
        params.left = params.left || 10;
        params.top = params.top || 10;
        params.width = params.width || 390;
        params.height = params.height || (window.innerHeight - 10 - 30 - 7);//top距离，头部高度，bottom距离

        if (this.jspanelModel) {
            this.jspanelModel.close();
        }

        //$("#iframe_AirQualityHour", window.parent.document).height();
        var left = params.left;
        var top = params.top;
        var width = params.width;
        var height = params.height;

        this.jspanelModel = $.jsPanel({
            id: "jspanel_" + params.id,
            title: "<font style='margin-left:5px;'>" + params.title + "</font>",//<img src='img/menu/大气.png' style='width:22px;height:22px;'/>
            show: "",
            position: { left: left, top: top },
            size: { width: width, height: height },
            theme: "primary filledlight",
            resizable: {
                //disabled: false
                'minWidth': 395,
                'maxHeight': height + 30//30为头部的高度
            },
            controls: {},
            iframe: {
                id: "iframe_" + params.id,
                src: params.src,
                style: { 'border': '0px solid transparent', 'border-radius': '4px' }
            },
            callback: function () {

            }
        });

        //监听打开面板事件
        //$(this.jspanelModel).bind('jspanelnormalized', function () {
        //    $(".jsPanel-btn-min").hide();
        //    $(".jsPanel-btn-max").hide();
        //});

        //侦听面板的关闭事件
        $("body").on("jspanelclosed", function closeHandler(evt, id) {
            //自定义清除
            if (jspanelModelCloseClear) {
                jspanelModelCloseClear(id);
            }
            
            //清除所有
            mugis.mapClear.clearAll();

            //注销面板的关闭事件
            $("body").off("jspanelclosed", closeHandler);
        });

        if (callback) {
            callback();
        }
    },


    initJspanelPop: function (params, callback) {
        //jspaneltype, id, title, src, width, height, left, top
        params = params || {};
        params.id = params.id || "";
        params.title = params.title || "标题";
        params.src = params.src || "#";
        params.left = params.left || 10;
        params.top = params.top || 10;
        params.width = params.width || 390;
        params.height = params.height || (window.innerHeight - 10 - 30 - 7);//top距离，头部高度，bottom距离

        //预留同时驻留多弹框非单一弹框控制jspaneltype
        if (this.jspanelPop && this.jspanelPop.length > 0 && params.keep == null) {
            for (var i = this.jspanelPop.length - 1; i >= 0; i--) {
                if (this.jspanelPop[i][0].id.split('_')[1] == params.jspaneltype) {
                    var temp = this.jspanelPop[i];
                    this.jspanelPop.remove(temp);
                    temp.close();
                }
            }
        }

        if (callback) {
            //callback回调加入队列
            setTimeout(function () {
                callback();
            });
        }

        //$("#iframe_AirQualityHour", window.parent.document).height();
        var left = params.left;
        var top = params.top;
        var width = params.width;
        var height = params.height;

        var jspanelPop = $.jsPanel({
            id: "jspanel_" + params.id,
            title: "<img src='img/menu/大气.png' style='width:22px;height:22px;'/><font style='font-weight:normal;margin-left:5px;'>" + params.title + "</font>",
            //title: "<font style='margin-left:5px;'>" + params.title + "</font>",
            show: "",
            position: { left: left, top: top },
            size: { width: width, height: height },
            theme: "primary filledlight",
            resizable: {
                //disabled: false
                'minWidth': 395,
                ////'maxWidth': 0,
                ////'minHeight': 0,
                'maxHeight': height + 30
            },
            controls: {},
            iframe: {
                id: "iframe_" + params.id,
                src: params.src,
                style: { 'border': '0px solid transparent', 'border-radius': '4px' }
            },
            callback: function () {
                $("#" + "iframe_" + params.id).css('z-index', '120');
            }
        });

        //监听打开面板事件
        $(jspanelPop).bind('jspanelnormalized', function () {
            //$(".jsPanel-btn-min").hide();
            //$(".jsPanel-btn-max").hide();

        });

        this.jspanelPop.push(jspanelPop);

        //侦听面板的关闭事件
        $("body").on("jspanelclosed", function closeHandler(evt, id) {
            //清除所有
            //MapUniGIS.MapClear.clearAll();
            //注销面板的关闭事件
            $("body").off("jspanelclosed", closeHandler);
            $(".chart").remove();
            $(".single_ditu01").remove();
            //关闭面板后控制全图参数
            //map.setExtent(initExtent);
            //清除图例
            //MapUniGIS.MapLegend.clearLegend();
        });

        $(".chart").remove();
        $(".single_ditu01").remove();
        //  clearMapPanel();
    }
}