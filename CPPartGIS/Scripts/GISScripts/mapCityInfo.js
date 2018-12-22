/**
 * 城市经纬度坐标信息处理.
 */
mugis.mapCityInfo = {
    /**
     * 获取城市经纬度对象通过城市经纬度信息数组.
     * @param {Array} cityInfo - 城市经纬度信息数组.
     * @return object
     */
    getCityInfoObjectByArray: function (cityInfo) {
        var cityInfoObj = {};
        for (var i = 0; i < cityInfo.length; i++) {
            var cood = {};
            cood.lon = cityInfo[i].lon;
            cood.lat = cityInfo[i].lat;
            cityInfoObj[cityInfo[i].cityCode] = cood;
        }
        return cityInfoObj;
    },

    /**
     * 获取城市经纬度信息对象通过区县regioncode.
     * @param {object} cityInfoObj - 城市经纬度对象.
     * @param {string} regioncode - 城市regioncode.
     * @return object
     */
    getCityCoorByRegionCode: function (cityInfoObj, regioncode) {
        var _regioncode = (regioncode || "") + "0000000000";
        _regioncode = _regioncode.substr(0, 12);
        cityInfoObj = cityInfoObj || {};
        for (var city in cityInfoObj) {
            if (city == _regioncode) {
                return cityInfoObj[city];
            }
        }
        return { lon: null, lat: null };
    }
}