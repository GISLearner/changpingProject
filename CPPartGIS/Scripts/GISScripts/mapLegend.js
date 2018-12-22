/**
 * 地图添加图例.
 */
mugis.mapLegend = {
    //图例测试参数color
    testLegendJson_color: { "签单保费": [{ color: "#fec349", name: "7.6万以上" }, { color: "#fec95d", name: "5.2-7.6万" }, { color: "#fedd99", name: "0-5.2万" }], "业务对比": [{ color: "#008CCF", name: "承保属性" }, { color: "#59B4E0", name: "签单保费" }], "签单保费2": [{ color: "#fec349", name: "7.6万以上" }, { color: "#fec95d", name: "5.2-7.6万" }, { color: "#fedd99", name: "0-5.2万" }], "业务对比2": [{ color: "#008CCF", name: "承保属性" }, { color: "#59B4E0", name: "签单保费" }] },

    //上一次加载保存的图例参数（未实现叠加图例mapShowLegend（json,false））
    lastLegendJson: {},

    /**
     * 添加图例.
     * @@param {string} param1 - param_desc.
     */
    mapShowLegend: function (type, id, legendJson, clear) {
        /// <summary>添加图例</summary>     
        /// <param name="seriesString" type="json">seriesString</param>
        /// <returns type=""></returns>  
        if (clear == null || clear == true) {
            this.clearLegend();
        }
        this.mapShowLegendString(this.getLegendString(type, id, legendJson));
    },

    /**
     * 添加图例.
     * @@param {string} param1 - param_desc.
     */
    mapShowLegendString: function (seriesString, clear) {
        /// <summary>添加图例</summary>     
        /// <param name="seriesString" type="json">seriesString</param>
        /// <param name="clear" type="bool">是否清除之前图例（默认清除,不需要清除传false）</param>
        /// <returns type=""></returns>  
        if (clear == null || clear == true) {
            this.clearLegend();
        }
        var legendbtn = '<div id="legendButton" class="leftLegend" title="显示图例" onclick="">图例</div>';//legendSetVisible(\'legend_info\');
        var legendString = legendbtn + '<div id="legend_info" class="leftLegend" style="display: block;"><img id="legend_close" src="IMG/legend/close.png" title="关闭图例" alt="" onclick="">' + seriesString + '</div>';//legendSetHide(\'legend_info\');
        $("body").append(legendString);
        $("#legend_info").show('slow');

        $("#legendButton").on("click", function () {
            //this.legendSetVisible('legend_info');
            var ele = "legend_info";
            $("#" + ele).show('slow');
        });
        $("#legend_close").on("click", function () {
            //this.legendSetHide('legend_info');
            var ele = "legend_info";
            $("#" + ele).hide('slow');
        });
    },

    /**
     * 获取图例拼接字符串.
     * @@param {string} param1 - param_desc.
     * @return {string}
     */
    getLegendString: function (type, id, legendJson) {
        /// <summary>获取图例拼接字符串</summary>     
        /// <param name="legendjson" type="json">legendjson拼接</param>
        /// <returns type=""></returns>  
        var legendString = "";
        legendString += '<div class="mapLegendSeries_' + id + '" style="display: block; float: left; width: 107px; height: 100%;font-size:12px;">';
        for (var seriesName in legendJson) {
            var seriesData = legendJson[seriesName];
            legendString += '<div id="lenged_' + seriesData[0].layerId + '" class="mapLegendSeries" style="display: block; float: left; width: 95%; height: 100%;font-size:12px;">';
            //区分是否为分级图层
            if (seriesName != legendJson[seriesName][0].name) {
                legendString += '<table width="95%"><tbody><tr><td align="left" style="height:20px;">' + seriesName + '</td></tr></tbody></table>';
            }
            legendString += '<table class="esriLegendLayer" style="margin-top:2px" cellspacing="0" cellpadding="0" width="100%"><tbody>';
            if (type == 1) { //颜色块类型图例
                for (var i = 0; i < seriesData.length; i++) {
                    legendString += '<tr style="height:22px;"><td width="35" align="center"><div style="width: 28px; height: 17px; border: 0px solid #6C6C6C; box-sizing: border-box; background-color: ' + seriesData[i].color + '"></div></td><td><table dir="ltr" width="100%"><tbody><tr><td align="left" style="padding-left: 2px;">' + seriesData[i].name + '</td></tr></tbody></table></td></tr>';
                }
            }
            else if (type == 2) { //图标类图例
                for (var i = 0; i < seriesData.length; i++) {
                    var width = 20;
                    var height = 20;
                    if (seriesData[i].width != "" || seriesData[i].width == null) {
                        width = seriesData[i].width;
                    }
                    if (seriesData[i].height != "" || seriesData[i].height == null) {
                        height = seriesData[i].height;
                    }
                    legendString += '<tr style="height:22px;"><td width="35" align="center"><img style="width:' + width + 'px; height:' + height + 'px; border: 0px solid #6C6C6C; box-sizing: border-box;" src="' + seriesData[i].color + '"></td><td><table dir="ltr" width="100%"><tbody><tr><td align="left" style="padding-left: 2px;">' + seriesData[i].name + '</td></tr></tbody></table></td></tr>';
                }
            }
            legendString += '</tbody>';
            legendString += "</table>"
            legendString += '</div>'
        }
        legendString += '</div>';
        return legendString;
    },

    /**
     * 清除图例.
     */
    clearLegend: function () {
        var element = $("body").find(".leftLegend");
        if (element.length > 0) {
            $(element).remove();
        }
    },

    /**
     * 图例显示.
     */
    legendSetVisible: function (ele) {
        /// <summary>图例显示</summary>     
        /// <param name="legendjson" type="json">图例元素</param>
        /// <returns type=""></returns>  
        $("#" + ele).css("display", "block");
    },

    /**
     * 图例隐藏.
     */
    legendSetHide: function (ele) {
        /// <summary>图例隐藏</summary>     
        /// <param name="ele" type="json">图例元素</param>
        /// <returns type=""></returns>  
        $("#" + ele).css("display", "none");
    }
}