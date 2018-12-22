/**
 * 时间处理.
 * @@param {string} param1 - param_desc.
 * @@return undefined
 */
utils.timeFormat = {
    /**
     * 获取当前时间(ep:2018-01-01 00:00:00).
     * @@param {string} param1 - param_desc.
     * @@return undefined
     */
    getNowDateString: function (datestring) {
        datestring = datestring || "2018-01-31 00:00:00";//用于数据部分测试（自定义当前时间）
        var date = new Date(datestring.replace(/-/g, "/"));
        return this.getTimeFormatString(date);
    },

    /**
     * 获取当前时间(日期部分).
     * @@param {string} param1 - param_desc.
     * @@return undefined
     */
    getNowDayString: function (datestring) {
        datestring = datestring || "2018-01-31";//用于数据部分测试（自定义当前时间）
        var date = new Date(datestring);
        return this.getTimeFormatString(date, 'yyyy-MM-dd');
    },

    /**
     * 获取日期部分.
     * @@param {string} param1 - param_desc.
     * @@return undefined
     */
    getDayString: function (datestring) {
        datestring = datestring || "";
        var split = datestring.split(' ');
        return split[0] || "";
    },

    /**
     * 获取时间部分.
     * @@param {string} param1 - param_desc.
     * @@return undefined
     */
    getTimeString: function (datestring) {
        datestring = datestring || "";
        var split = datestring.split(' ');
        return split[1] || "";
    },

    /**
     * 时间字符串格式化.
     * @@param {string} param1 - param_desc.
     * @@return undefined
     */
    getTimeFormatString: function (date, format) {
        format = format || "yyyy-MM-dd hh:mm:ss";
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        if (++month < 10) {
            month = '0' + month;
        }
        format = format.toUpperCase();
        format = format.replace('YYYY', year).replace('MM', month).replace('DD', day).replace('HH', hour).replace('MM', minute).replace('SS', second);
        return format;
    },

    /**
     * 用于测试时控制台输出详细时间.
     * @@param {string} param1 - param_desc.
     * @@return undefined
     */
    getNowDetailTime: function () {
        return new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() + '.' + new Date().getMilliseconds();
    },

    /**
     * 添加日，原有日期格式上加天数.
     * @@param {string} param1 - param_desc.
     * @@return undefined
     */
    addDay: function (dateString, addDays) {
        dateString = dateString || "";
        dateString = dateString.replace('.000', '');
        var timeTril = dateString.split(' ')[1] || "";//小时部分

        var d = new Date(Date.parse(dateString.replace(/-/g, "/")));
        d.setDate(d.getDate() + addDays);

        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        return year + "-" + month + "-" + day;
    }

}