/**
 * poi点位分级渲染样式.
 */
mugis.airClassify = {
    //空气质量等级对应颜色
    airColorClassify: ['#6FBE09', '#FBD12A', 'FFA641', '#EB5B13', '#960453', '#580422', '#8e8e8e'],

    /**
     * 获取空气质量等级的颜色与图片.
     * @@param {string} param1 - param_desc.
     * @@return undefined
     */
    getAirLevelAndColor: function (value, type) {
        var classifyArray = this.getAirClassifyArray(type);
        var object = {};
        var imgColor;
        var borderColor;
        if (value >= classifyArray[0] && value <= classifyArray[1]) {
            imgColor = "AirCity/aqi_bgs_1.png";
            borderColor = this.airColorClassify[0];
        }
        else if (value > classifyArray[1] && value <= classifyArray[2]) {
            imgColor = "AirCity/aqi_bgs_2.png";
            borderColor = this.airColorClassify[1];
        }
        else if (value > classifyArray[2] && value <= classifyArray[3]) {
            imgColor = "AirCity/aqi_bgs_3.png";
            borderColor = this.airColorClassify[2];
        }
        else if (value > classifyArray[3] && value <= classifyArray[4]) {
            imgColor = "AirCity/aqi_bgs_4.png";
            borderColor = this.airColorClassify[3];
        }
        else if (value > classifyArray[4] && value <= classifyArray[5]) {
            imgColor = "AirCity/aqi_bgs_5.png";
            borderColor = this.airColorClassify[4];
        }
        else if (value > classifyArray[5]) {
            imgColor = "AirCity/aqi_bgs_6.png";
            borderColor = this.airColorClassify[5];
        }
        else {
            imgColor = "AirCity/aqi_bgs_7.png";
            borderColor = this.airColorClassify[6];
        }
        object.borderColor = borderColor;
        object.imgColor = imgColor;
        return object;
    },

    /**
     * 获取空气质量评价.
     * @@param {string} param1 - param_desc.
     * @@return undefined
     */
    getAirQualityByValue: function (value, type) {
        var classifyArray = this.getAirClassifyArray(type);
        if (value >= classifyArray[0] && value <= classifyArray[1]) {
            return "优";
        }
        else if (value > classifyArray[1] && value <= classifyArray[2]) {
            return "良";
        }
        else if (value > classifyArray[2] && value <= classifyArray[3]) {
            return "轻度污染";
        }
        else if (value > classifyArray[3] && value <= classifyArray[4]) {
            return "中度污染";
        }
        else if (value > classifyArray[4] && value <= classifyArray[5]) {
            return "重度污染";
        }
        else if (value > classifyArray[5]) {
            return "严重污染";
        }
        else {
            return null;
        }
    },

    /**
     * 获取空气质量等级对应的颜色.
     * @@param {string} param1 - param_desc.
     * @@return undefined
     */
    getAirColorByValue: function (value, type) {
        var classifyArray = this.getAirClassifyArray(type);
        if (value >= classifyArray[0] && value <= classifyArray[1]) {
            return this.airColorClassify[0];
        }
        else if (value > classifyArray[1] && value <= classifyArray[2]) {
            return this.airColorClassify[1];
        }
        else if (value > classifyArray[2] && value <= classifyArray[3]) {
            return this.airColorClassify[2];
        }
        else if (value > classifyArray[3] && value <= classifyArray[4]) {
            return this.airColorClassify[3];
        }
        else if (value > classifyArray[4] && value <= classifyArray[5]) {
            return this.airColorClassify[4];
        }
        else if (value > classifyArray[5]) {
            return this.airColorClassify[5];
        }
        else {
            return this.airColorClassify[6];
        }
    },

    /**
     * 获取空气质量等级对应的颜色.
     * @@param {string} param1 - param_desc.
     * @@return undefined
     */
    getAirColorByQuality: function (value, type) {
        if (value == "优") {
            return this.airColorClassify[0];
        }
        else if (value == "良") {
            return this.airColorClassify[1];
        }
        else if (value == "轻度污染") {
            return this.airColorClassify[2];
        }
        else if (value == "中度污染") {
            return this.airColorClassify[3];
        }
        else if (value == "重度污染") {
            return this.airColorClassify[4];
        }
        else if (value == "严重污染") {
            return this.airColorClassify[5];
        }
        else {
            return this.airColorClassify[6];
        }
    },

    /**
     * 获取空气质量等级划分的对应值.
     * @@param {string} param1 - param_desc.
     * @@return undefined
     */
    getAirClassifyArray: function (type) {
        var classifyArray = [0, 50, 100, 150, 200, 300];
        if (type == null || type.toUpperCase() == "AQI") {
            classifyArray = [0, 50, 100, 150, 200, 300];
        }
        else if (type.toUpperCase().replace('_', '').replace('.', '') == "PM25") {
            classifyArray = [0, 35, 75, 115, 150, 250];
        }
        else if (type.toUpperCase().replace('_', '').replace('.', '') == "PM10") {
            classifyArray = [0, 50, 150, 250, 350, 420];
        }
        else if (type.toUpperCase() == "S02") {
            classifyArray = [0, 50, 150, 475, 800, 1600];
        }
        else if (type.toUpperCase() == "N02") {
            classifyArray = [0, 40, 80, 180, 280, 565];
        }
        else if (type.toUpperCase() == "CO") {
            classifyArray = [0, 2, 4, 14, 24, 36];
        }
        else if (type.toUpperCase() == "O3") {
            classifyArray = [0, 100, 160, 215, 265, 800];
        }
        return classifyArray;
    }

}