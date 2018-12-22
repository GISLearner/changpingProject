
/**
 * 模块向map主界面添加dom元素
 */
var append_AirQualityHour = {
    /**
     * 添加dom元素.
     */
    append: function (callback) {
        var _this = this;
        utils.htmlOperate.getHtml("Panel/AirQualityHour/append/append.html", function (html) {
            $('#timecontainer').remove();
            $('.areaSearch').remove();
            $('body').append(html);

            _this.bind();

            if (callback) {
                callback();
            }
        })
    },

    /**
     * 绑定事件.
     */
    bind: function () {
        //监测类型切换
        $(".areaSearch > ul li").click(function (e) {
            $(this).addClass('aqiactive');
            $(this).addClass('aqiactive').siblings().removeClass('aqiactive');
            document.getElementById('iframe_AirQualityHour').contentWindow.setMonitorTypeObject(e.target.innerText);
        });

        $('.areaSearch select').change(function (e) {
            var type = $(this).find('option:selected').val();
            document.getElementById('iframe_AirQualityHour').contentWindow.setStationType(type);
        });
    }
}
