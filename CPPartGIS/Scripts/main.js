
var app = {
    init() {
        //模糊搜索
        $("#btnSearchNormal").click(function () { 
            var txt = $(".entSearch_text").val(); 
            $("#panelResult").show();
            $("#panelCondition").hide();
            //搜索
        })
        //高级搜索
        $("#btnSearchAdvanced").click(function () { 
            $("#panelResult").hide();
            $("#panelCondition").show();
        })
    }
}



app.init();