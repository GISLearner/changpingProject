
utils.echartsInit = {
    initEcharts: function (dom,option) {
        var myChart = echarts.init(document.getElementById("echartstest"));
        myChart.setOption(option);
    }
}

optiontest = {
    color: ['#3398DB'],
    tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
                alignWithLabel: true
            }
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        {
            name: '直接访问',
            type: 'bar',
            barWidth: '60%',
            data: [10, 52, 200, 334, 390, 330, 220]
        }
    ]
};

//<div style="position:absolute;left:0px;bottom:0px;width:500px;height:300px;border:1px solid black;">
//  <div id="echartstest" style="width:100%;height:100%;"></div>
//</div>