
var app = {
    curCod:'park',
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
            app.setCondition();
        })
        //类型选择
        $(".conditionUl li").click(function (e) { 
            $(".conditionUl li").removeClass("cond_select");
            $(e.currentTarget).addClass("cond_select");
            app.curCod = e.currentTarget.id.split("_")[1];
            app.setCondition();
        })
    },
    //设置搜索条件
    setCondition() {
        debugger;
        var item = config.conds[app.curCod];
        var cods = $("#form_cod")[0].children;
        for (var i in cods) {
            if (cods[i].id) {
                $(cods[i]).hide();
                var ctl = cods[i].id.split("_")[1];
                if (item.indexOf(ctl) > -1) {
                    $(cods[i]).show();
                }
            }
        }
    }
}



app.init();