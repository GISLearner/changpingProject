
var app = {
    curCod: 'park',
    resultPanel: null,
    curMenu: null,
    curSearch:null,
    init() {
        //模糊搜索
        $("#btnSearchNormal").click(function () { 
            var txt = $(".entSearch_text").val(); 
            $("#panelResult").show();
            $("#panelCondition").hide();
            app.curSearch = "Normal";
            //搜索
        })

        //切换高级搜索
        $("#btnSearchAdvanced").click(function () { 
            $("#panelResult").hide();
            if (app.curSearch == "Advanced") {
                app.curSearch = null;
                $("#panelCondition").hide();
                return;
            }
            $("#panelCondition").show(); 
            app.setCondition();
            app.curSearch = "Advanced";
        })

        //类型选择
        $(".conditionUl li").click(function (e) { 
            $(".conditionUl li").removeClass("cond_select");
            $(e.currentTarget).addClass("cond_select");
            app.curCod = e.currentTarget.id.split("_")[1];
            app.setCondition();
        })

        //搜索按钮
        $("#btn_Search").click(function () {
            var _this = this;
            var name = $("#txt_name").val();
            var landarea_1 = $("#txt_landarea_1").val();
            var landarea_2 = $("#txt_landarea_2").val();
            var buildarea_1 = $("#txt_buildarea_1").val();
            var buildarea_1 = $("#txt_buildarea_2").val();
            var usetype = $("#select_usetype").val();
            var buildtype = $("#select_buildtype").val();
            var factype = $("#select_factype").val();

            if (this.resultPanel) {
                this.resultPanel.close();
            }

            var result = [
                {
                    name:"**某某企业",
                    type: "xx",
                    area: "100",
                    other:"esrc",
                },
                {
                    name: "**某某企业",
                    type: "ww",
                    area: "100",
                    other: "esrc",
                }
            ];
            var fields = [
                {
                    name: "名称",
                    value:"name"
                },
                {
                    name: "类型",
                    value: "type"
                },
                {
                    name: "面积",
                    value: "area"
                },
                {
                    name: "其他属性",
                    value: "other"
                }
            ]
            var tablestr = "<table id='table_reult' class='table table-hover'><thead><tr></tr></thead><tbody></tbody></table>";
            this.resultPanel = $.jsPanel({ 
                headerTitle: "查询结果",
                position: "left-bottom 30 -30",
                theme: "default",
                content: tablestr,
                close: function () {
                    _this.resultPanel = null;
                }
            });

            var table = $('#table_reult'); 
            for (var i = 0; i < fields.length; i++) {
                $("#table_reult thead tr").append("<th>" + fields[i].name + "</th>");
            }
            for (var i = 0; i < result.length; i++) {
                var tds = "";
                for (var j in result[i]) {
                    tds += "<td>" + result[i][j] + "</td>";
                }
                $("#table_reult tbody").append("<tr data-index=" + i + ">" + tds + "</tr>");
            } 
           
            $("#table_reult tbody tr").click(function (e) { 
                var index = e.currentTarget.dataset.index;
                alert("点击了第" + index + "行"); 
            });
        })

        //右侧菜单点击
        $(".menuUl li").click(function (e) {
            $(".panel_menu").hide();
            var menu = e.currentTarget.dataset.target;
            if (app.curMenu == menu) {
                app.curMenu = null;
                return;
            }
            app.curMenu = menu;
            if (menu == 'clear') {
                alert("地图清空！");
            } 
            else {
                $("#panel_" + menu).show(); 
            }
        })

        //专题类别点击
        $(".specialUl li").click(function (e) { 
            $(".specialUl li").removeClass("special_select");
            $(e.currentTarget).addClass("special_select");
            var item = e.currentTarget.dataset.target;
            $(".special_itmes").hide();
            $("#special_" + item).show();
        })

        //工具菜单
        $(".toolUl li").click(function (e) {
            var tool = e.currentTarget.dataset.target;
            switch (tool) {
                case "area":
                    alert('面积测量');
                    break;
                case "dist":
                    alert('距离测量');
                    break;
                case "mark":
                    alert('地图标注');
                    break;
                case "park":
                    alert('园区');
                    break;
                default:

            }
            $("#panel_tool").hide();
        })

        //地图主题切换
        $(".themeUl li").click(function (e) {
            var theme = e.currentTarget.dataset.target;
            app.switchMap(theme);
        })
    },
    //设置搜索条件
    setCondition() { 
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
    },
    //切换地图
    switchMap(type) {
        $(".mapContainer").hide();
        $("#map_" + type).show();
    }
}



app.init();