/**
 * 地图图层操作.
 */
mugis.mapLayer = {
    /**
     * 改变layer的可见性.
     * @param {string} layerName - 需要控制的图层名字.
     * @param {bool} visible - true显示,false隐藏.
     * @return {bool}
     */
    changeLayerVisible: function (layerName, visible) {
        try {
            var Graphicslayer = map.getLayer(layerName);
            if (Graphicslayer) {
                if (visible) {
                    Graphicslayer.show();
                }
                else {
                    Graphicslayer.hide();
                }
            }
            else {
                return 0;
            }
            return true;
        } catch (e) {
            return false;
        }
    },
    /**
     * 删除单个图层.
     * @param {string} layerName - 需要删除的图层名字.
     * @return {bool}
     */
    deleteLayer: function (layerName) {
        try {
            var layer = map.getLayer(layerName);
            if (layer) {
                map.removeLayer(layer);
            }
            else {
                return 0;
            }
            return true;
        } catch (e) {
            return false;
        }
    },
    /**
     * 改变图层index.
     * @@param {string} param1 - param_desc.
     * @@return undefined
     */
    changeLayerIndex: function (layerName, index) {

    }
}
