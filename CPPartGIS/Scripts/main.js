var app = {
	curCod: 'park',
	resultPanel: null,
	curMenu: null,
	curSearch: null,
	searchStatus:"fyq",
	init() {
		//初始化地图
		//查询结果图层
		mapconfig.layerInfoConfigs.forEach(function(info) {
			var lId = info.layerCode;
			var gLayer = new mapAPI.GraphicsLayer({
				id: lId
			});
			map.addLayer(gLayer);
		})
		//高亮图层
		var hLayer = new mapAPI.GraphicsLayer({
				id: "highLightLayer"
		});
		map.addLayer(hLayer);

		//输入框搜索
		$(".entSearch_text").keydown(function(e) {
			if (e.keyCode == 13) {
				app.searchEnt();
			}
		})
		//点击搜索框按钮
		$("#btnSearchNormal").click(function() {
			$("#panelCondition").hide();
			app.curSearch = "Normal";
			app.searchEnt();
		})

		//切换高级搜索
		$("#btnSearchAdvanced").click(function() {
			$("#panelResult").hide();
			if (app.curSearch == "Advanced") {
				app.curSearch = null;
				$("#panelCondition").hide();
				return;
			}
			$("#panelCondition").show();
			app.setCondition();
			app.curSearch = "Advanced";
			app.searchStatus = "fyq";
		})

		//类型选择
		$(".conditionUl li").click(function(e) {
			$(".conditionUl li").removeClass("cond_select");
			$(e.currentTarget).addClass("cond_select");
			app.curCod = e.currentTarget.id.split("_")[1];
			app.searchStatus = $(this).attr("status");
			app.setCondition();
		})

		//搜索按钮
		$("#btn_Search").click(function() {
			var _this = this;
			if (this.resultPanel) {
				this.resultPanel.close();
			}
			app.advanceSearch();
		})

		//右侧菜单点击
		$(".menuUl li").click(function(e) {
			$(".panel_menu").hide();
			var menu = e.currentTarget.dataset.target;
			if (app.curMenu == menu) {
				app.curMenu = null;
				return;
			}
			app.curMenu = menu;
			if (menu == 'clear') {
				alert("地图清空！");
			} else {
				$("#panel_" + menu).show();
			}
		})

		//专题类别点击
		$(".specialUl li").click(function(e) {
			$(".specialUl li").removeClass("special_select");
			$(e.currentTarget).addClass("special_select");
			var item = e.currentTarget.dataset.target;
			$(".special_itmes").hide();
			$("#special_" + item).show();
		})

		//工具菜单
		$(".toolUl li").click(function(e) {
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
		$(".themeUl li").click(function(e) {
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
	},
	//查询企业信息
	searchEnt() {
		$(".sdataTable").html();
		var text = $("#leftMenue .entSearch_text").val();
		var lyrConfigs = mapconfig.layerInfoConfigs;
		var searchCount = 0;
		var searchData = []; //查询结果
		app.layerClear();
		lyrConfigs.forEach(function(item) {
			var layerWhere = item.nameField + " like '%" + text + "%'";
			mugis.layerAttSearch(item.layerId, layerWhere, null, function(e, params) {
				app.addFeaToMap(e, params, searchData);
				if (searchCount == lyrConfigs.length - 1) {
					var options = {
						height: 300,
						width: 400,
						onClickRow:function(e){
							app.clickRow(e,{layerId:e.layerId,idField:"FID"});
						}
					}
					mugis.initTable(".sdataTable", mapconfig.layerSearchColumns, searchData, options);
					$("#panelResult").css("display", "block");
					$("#panelResult").show();
				}
				searchCount++;
			}, item)
		})
	},
	//地图添加项目点位
	addFeaToMap(e, feaConfig, searchData) {
		var searchDataObj = {};
		var features = e.features;
		if (features.length == 0) return;
		var fms;
		var fields = e.fields;
		var lId = feaConfig.layerCode;
		var gLayer = map.getLayer(lId);
		if (e.geometryType == "esriGeometryPoint") {
			fms = new mapAPI.PictureMarkerSymbol(feaConfig.pointIcon, 24, 24);
		}else if(e.geometryType == "esriGeometryPolygon"){
			fms = new mapAPI.SimpleFillSymbol(mapAPI.SimpleFillSymbol.STYLE_SOLID,    
			new mapAPI.SimpleLineSymbol(mapAPI.SimpleLineSymbol.STYLE_DASHDOT,    
			new mapAPI.Color([255,0,0]), 2),new mapAPI.Color([255,255,0,0.25]));
		}
		var infoWin = mapAPI.InfoTemplate("${" + feaConfig.nameField + "}", app.getInfoContent(fields));
		var i = 0;
		var searchData2 = [];
		features.forEach(function(fea) {
			var gra = new mapAPI.Graphic(fea.geometry, fms, fea.attributes, infoWin);
			var att = fea.attributes;
			var columns = mapconfig.layerSearchColumns;
			var dataObj = {};
			if(searchData){
				dataObj[columns[0]["field"]] = i.toString();
				dataObj[columns[1]["field"]] = att[feaConfig.nameField];
				dataObj[columns[2]["field"]] = feaConfig.layerType;
				dataObj[feaConfig.idField] = att[feaConfig.idField];
				dataObj["layerId"] = feaConfig.layerId;
				searchData.push(dataObj);
			}
			if(searchData2){
				searchData2.push(att);
			}
			gLayer.add(gra);
			i++;
		})
		
		//返回查询结果
		var columns = [];
		fields.forEach(function(field){
			var fieldObj = {
				field:field.name,
				title:field.alias
			}
			columns.push(fieldObj);
		})
		searchDataObj = {
			columns:columns,
			data:searchData2
		}
		return searchDataObj;
	},
	//获取气泡信息
	getInfoContent(fields) {
		var contentHtml = "<div class=\"infodiv\"><table>";
		fields.forEach(function(field) {
			contentHtml += "<tr><td>" + field.alias + "：${" + field.name + "}</td></tr>";
		})
		contentHtml += "</table></div>";
		return contentHtml;
	},
	//高级查询
	advanceSearch(){
		app.layerClear();
		var name = $("#txt_name").val();
		var landarea_1 = $("#txt_landarea_1").val();
		var landarea_2 = $("#txt_landarea_2").val();
		var buildarea_1 = $("#txt_buildarea_1").val();
		var buildarea_2 = $("#txt_buildarea_2").val();
		var qWhere = "";
		var searchConfig;
		if(app.searchStatus == "fyq"){
			mapconfig.layerInfoConfigs.forEach(function(cfg){
				if(cfg.searchStatus == app.searchStatus){
					searchConfig = cfg;
					qWhere = searchConfig.nameField + " like '%" + name + "%' and " + 
					searchConfig.ydmjField + " >= " + landarea_1 + " and " + 
					searchConfig.ydmjField + " <= " + landarea_2;
				}
			})
		}else if(app.searchStatus == "jz"){
			mapconfig.layerInfoConfigs.forEach(function(cfg){
				if(cfg.searchStatus == app.searchStatus){
					searchConfig = cfg;
					var buildtype = $("#select_buildtype").val();
					qWhere = searchConfig.nameField + " like '%" + name + "%' and " + 
					searchConfig.typeField + " = '" + buildtype + "' and " + 
					searchConfig.ydmjField + " >= " + landarea_1 + " and " + 
					searchConfig.ydmjField + " <= " + landarea_2 + " and " + 
					searchConfig.jzmjField + " >= " + buildarea_1 + " and " + 
					searchConfig.jzmjField + " <= " + buildarea_2;
				}
			})
			
		}else if(app.searchStatus == "qy"){
			mapconfig.layerInfoConfigs.forEach(function(cfg){
				if(cfg.searchStatus == app.searchStatus){
					searchConfig = cfg;
					var usetype = $("#select_usetype").val();
					qWhere = searchConfig.nameField + " like '%" + name + "%' and " + 
					searchConfig.typeField + " = '" + usetype + "' and " + 
					searchConfig.ydmjField + " >= " + landarea_1 + " and " + 
					searchConfig.ydmjField + " <= " + landarea_2;
				}
			})
			
		}else if(app.searchStatus == "ptss"){
			mapconfig.layerInfoConfigs.forEach(function(cfg){
				if(cfg.searchStatus == app.searchStatus){
					searchConfig = cfg;
					var factype = $("#select_factype").val();
					qWhere = searchConfig.nameField + " like '%" + name + "%' and " + 
					searchConfig.typeField + " = '" + factype + "' and " + 
					searchConfig.ydmjField + " >= " + landarea_1 + " and " + 
					searchConfig.ydmjField + " <= " + landarea_2;
				}
			})
		}
		
		mugis.layerAttSearch(searchConfig.layerId, qWhere, null, function(e, params) {
			var searchDataObj = app.addFeaToMap(e, params, null);
			if(searchDataObj){
				app.showAdvanceResult(searchDataObj.columns,searchDataObj.data,params);
			}
		}, searchConfig)
	},
	//高级查询显示结果列表
	showAdvanceResult(columns,data,searchConfig){
		var tablestr = "<div class='advanceTable' style='max-height:400px;'></div>";
		this.resultPanel = $.jsPanel({
			headerTitle: "查询结果",
			position: "left-bottom 30 -30",
			theme: "primary",
			content: tablestr,
			close: function() {
				_this.resultPanel = null;
			},
			callback: function () {
				var options = {
					onClickRow:function(e){
						app.clickRow(e,searchConfig);
					}
				}
				mugis.initTable(".advanceTable", columns, data,options);
			}
		});
	},
	//查询表格单行点击回调函数
	clickRow(e,searchConfig){
		var hLayer = map.getLayer("highLightLayer");
		hLayer.clear();
		var qWhere = searchConfig.idField + " = " + e[searchConfig.idField];
		mugis.layerAttSearch(searchConfig.layerId, qWhere, null, function(e, params) {
			app.graHighLight(e,params);
		}, searchConfig)
		console.log(searchConfig);
	},
	//高亮显示要素
	graHighLight(e,graConfig){
		var features = e.features;
		if(features.length > 0){
			var feature = features[0];
			var fields = e.fields;
			var fms;
			if (e.geometryType == "esriGeometryPoint") {
				fms = new mapAPI.PictureMarkerSymbol(mapconfig.highLightIcon, 40, 40);
				map.setScale(1000);
				map.centerAt(feature.geometry);
			}else if(e.geometryType == "esriGeometryPolygon"){
				fms = new mapAPI.SimpleFillSymbol(mapAPI.SimpleFillSymbol.STYLE_SOLID,    
				new mapAPI.SimpleLineSymbol(mapAPI.SimpleLineSymbol.STYLE_SOLID,    
				"#f00", 2),new mapAPI.Color([255,255,0,0]));
				var polygon = feature.geometry;
				polygon.prototype = mapAPI.Polygon;
				map.setExtent(feature.geometry.getExtent());
			}
			var infoWin = mapAPI.InfoTemplate("${" + graConfig.nameField + "}", app.getInfoContent(fields));
			var gra = new mapAPI.Graphic(feature.geometry, fms, feature.attributes,infoWin);
			var hLayer = map.getLayer("highLightLayer");
			hLayer.add(gra);
		}
	},
	//清除临时图层
	layerClear() {
		var hLayer = map.getLayer("highLightLayer");
		hLayer.clear();
		mapconfig.layerInfoConfigs.forEach(function(info) {
			var lId = info.layerCode;
			var gLayer = map.getLayer(lId);
			gLayer.clear();
		})
	}
}

