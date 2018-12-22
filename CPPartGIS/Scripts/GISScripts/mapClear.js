//清除地图覆盖物
mugis.mapClear = {
    //清除地图所有图层、标注和事件
    clearAll: function () {
        //清空Graphic
        this.clearMapGraphics();
        //清除地图图层
        this.clearLayers();
        //清除地图标注
        this.clearLabels();
        //清除事件
        //this.clearMpaAllEvent();
        //关闭infoWindow
        mapinfo.map.infoWindow.hide();
    },
    //清空Graphic
    clearMapGraphics: function () {
        if (mapinfo.map.graphics) {
            mapinfo.map.graphics.clear();
        }
    },

    /**
     * 清除地图图层(array=null||[]全清，array>0部分清).
     * @@param {string} param1 - param_desc.
     * @@return undefined
     */
    clearLayers: function (array) {
        array = array || [];

        if (array.length > 0) {
            for (var i = 0; i < array.length; i++) {
                var layer = mapinfo.map.getLayer(array[i]);
                if (layer) {
                    layer.clear();
                    mapinfo.map.removeLayer(layer);
                }
            }
        }
        else {
            var layerIds = mapinfo.map.graphicsLayerIds;
            var arrayLayerIds = Array();
            for (var i = 0; i < layerIds.length; i++) {
                arrayLayerIds.push(layerIds[i]);
            }
            for (var i = 0; i < arrayLayerIds.length; i++) {
                var layerName = arrayLayerIds[i];
                if (layerName.indexOf('baseMap') > -1) {
                    continue;
                }
                var layer = mapinfo.map.getLayer(layerName);
                if (layer) {
                    layer.clear();
                    mapinfo.map.removeLayer(layer);
                }
            }

            var scaleLayers = mapinfo.map.getLayersVisibleAtScale();
            var arrayScaleLayers = Array();
            for (var i = 0; i < scaleLayers.length; i++) {
                arrayScaleLayers.push(scaleLayers[i]);
            }
            for (var i = 0; i < arrayScaleLayers.length; i++) {
                if (arrayScaleLayers[i].id.indexOf('baseMap') > -1) {
                    continue;
                }
                mapinfo.map.removeLayer(arrayScaleLayers[i]);
            }

        }
    },

    /**
     * 清除地图图层(array=null||[]全清，array>0部分保留).
     * @@param {string} param1 - param_desc.
     * @@return undefined
     */
    holdLayers: function (array) {
        array = array || [];

        var layerIds = mapinfo.map.graphicsLayerIds;
        var arrayLayerIds = Array();
        for (var i = 0; i < layerIds.length; i++) {
            arrayLayerIds.push(layerIds[i]);
        }

        var scaleLayers = mapinfo.map.getLayersVisibleAtScale();
        var arrayScaleLayers = Array();
        for (var i = 0; i < scaleLayers.length; i++) {
            arrayScaleLayers.push(scaleLayers[i]);
        }

        var holdLayerString = "";
        for (var i = 0; i < array.length; i++) {
            holdLayerString += array[i] + ',';
        }

        for (var i = 0; i < arrayLayerIds.length; i++) {
            var layerName = arrayLayerIds[i];
            if (layerName.indexOf('baseMap') > -1 || holdLayerString.indexOf(layerName + ',') > -1) {
                continue;
            }
            var layer = mapinfo.map.getLayer(layerName);
            if (layer) {
                layer.clear();
                mapinfo.map.removeLayer(layer);
            }
        }

        for (var i = 0; i < arrayScaleLayers.length; i++) {
            if (arrayScaleLayers[i].id.indexOf('baseMap') > -1) {
                continue;
            }
            mapinfo.map.removeLayer(arrayScaleLayers[i]);
        }
    },

    /**
     * 清除地图标注.
     * @@param {string} param1 - param_desc.
     * @@return undefined
     */
    clearLabels: function (selecterArray) {
        debugger;
        selecterArray = selecterArray || [".ring", ".class_widgets_measure"];
        for (var i = 0; i < selecterArray.length; i++) {
            var selecter = selecterArray[i];
            if (selecter == null) {
                continue;
            }
            if (selecter && (selecter.indexOf('.') >= 0 || selecter.indexOf('#') >= 0)) {
                $(selecter).remove();
            }
            else {
                $("#" + selecter).remove();
                $("." + selecter).remove();
            }
        }
    },

    //清空地图所有绑定事件
    clearMpaAllEvent: function () {
        require([
            , "dojo/_base/connect"
            , "dojo/_base/array"
            , "esri/config"
        ]
    , function (connect, array, config) {
        //array.forEach(config._eventHandlers, connect.disconnect);
        //config._eventHandlers.splice(0, esriConfig._eventHandlers.length);
    });
    }
};
