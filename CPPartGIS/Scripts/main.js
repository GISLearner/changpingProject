var app = {
	curCod: '',
	resultPanel: null,
	curMenu: null,
	curSearch: null,
	drawGeo: null,
	DMTXX:null,
	searchStatus: "fyq",
	init() {
		$.common.addBaseMap(map,"baseMap_Map");
		//查询结果图层
		layerConfigs.forEach(function(info) {
			var lId = info.lId;
			var gLayer = new mapAPI.GraphicsLayer({
				id: lId
			});
			map.addLayer(gLayer);
			gLayer.on("click", function(e) {
				var att = e.graphic.attributes;
				var fields = att.fields; //字段信息
				app.showDeatilInfo(att, fields);
				setTimeout(function(){
					map.infoWindow.hide();
				},500)  
			})
		})



		//高亮图层
		var hLayer = new mapAPI.GraphicsLayer({
			id: "highLightLayer"
		});
		map.addLayer(hLayer);

		//点击搜索
		$("#homeSearch li").click(function(e) {
			$("#homeSearch li").removeClass("searchactive");
			$(this).addClass("searchactive");
			app.curCod = e.currentTarget.dataset.target;
			$("#searchPage").show();
			$("#map_normal").show();
			$("#resultPanel").hide();
			$("#detailPanel").hide();
			$("#map_three").hide();
			$("#map_solid").hide();
			$("#map_pano").hide();
			app.drawGeo = null;
			$("#searchPage").load("page/search.html", function() {
				app.setCondition();
				layerConfigs.forEach(function(searchItem) {
					$("#" + searchItem.divContentClass).setSearchBlock(searchItem, function(drawClass) { 
						app.drawStart(drawClass);
					}, function(layerId, qWhere, searchConfig) {
						//清楚图层
						layerConfigs.forEach(function(info) {
							var lId = info.lId;
							var gLayer = map.getLayer(lId);
							gLayer.clear();
						})
						$.common.layerAttSearch(layerId, qWhere, app.drawGeo, function(e, params) {
							$(".resultUI").html("");
							app.addFeaToMap(e, params);
						}, searchConfig)
						$("#searchPage").hide();
						app.showAdvanceResult1();
					})
				})
			});
		})
		//点击右侧工具栏
		$("#toolUser").click(function(e) {
			$("#rightPage").show();
			$("#rightCont").load("page/user.html");
		})
		$("#toolTheme").click(function(e) {
			$("#rightPage").show();
			$("#rightCont").load("page/theme.html");
		})
		$("#tooler").click(function(e) {
			$("#rightPage").show();
			$("#rightCont").load("page/tool.html");
		})
		$("#rightBack").click(function() {
			$("#rightPage").hide();
		})

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
				tool_draw_clear();
				map.setMapCursor("default");
				mugis.mapClear.clearAll();
				$(".speciallayerUl li").removeClass("speciallayer_select");
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




		//专题点击事件
		$(".speciallayerUl li").click(function(e) {
			var special = e.currentTarget.dataset.target.split('_')[1];
			$(".speciallayerUl li").removeClass("speciallayer_select");
			$(e.currentTarget).addClass("speciallayer_select");
			switch (special) {
				case "11":
					alert("所选企业用地面积为100km²");
					break;
				case "12":
					alert("所选建筑用地面积为100km²");
					break;
				case "21":
					//缓冲分析
					break;
				case "22":
					app.statLand();
					break;
				default:

			}
		})

	    //多媒体按钮事件
		$("#btnMedia").click(function () {
		    $("#mediaPanel").show();
		    $("#mediaPanel").load("page/media.html", function () {
				var DMTXX = app.DMTXX;
				if(DMTXX != null){
					var picBaseUrl = mapconfig.picUrl;
					var pathAry = DMTXX.split(",");
					var picHtml = '<ul class="mediaUl">';
					pathAry.forEach(function(path){
						var realUrl = picBaseUrl + path + ".png";
						picHtml += '<li><img src="' + realUrl + '" /></li>';
					})
					picHtml += "</ul>";
				}
				$(".mediPicture").html(picHtml);
		    });
		})
	    //周边环境按钮事件
		$("#btnRound").click(function () {
		    $("#roundPanel").show();
		    $("#roundPanel").load("page/round.html", function () { 
		        setTimeout(function () {
		            var frm = document.getElementById("ifmSingle").contentWindow;
		            frm.init(app.curPoint);
		        }, 500)
		    });
		})
	},
	//设置搜索条件
	setCondition() {
		$("#panelCondition .conditionUl li").removeClass("cond_select");
		$("#cnd_" + app.curCod).addClass("cond_select");

		$(".former").hide();
		$("#content_" + app.curCod).show();

		$("#homeSearch li").removeClass("searchactive");
		for (var i = 0; i < $("#homeSearch li").length; i++) {
		    var tg = $("#homeSearch li")[i].dataset.target;
		    if (tg == app.curCod) {
		        $($("#homeSearch li")[i]).addClass("searchactive");
		    }
		} 
	},
	//切换地图
	switchMap(type) {
		$(".mapContainer").hide();
		$("#map_" + type).show();
	},
	//地图添加项目点位
	addFeaToMap(e, feaConfig) {
		var features = e.features;
		if (features.length == 0) return;
		var fms;
		var fields = e.fields;
		var newFields = [];
		fields.forEach(function(field){
			var alias = field.alias;
			if(alias.match(/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi) != null){
				newFields.push(field);
			}
		})
		var lId = feaConfig.lId;
		var gLayer = map.getLayer(lId);
		if (e.geometryType == "esriGeometryPoint") {
			fms = new mapAPI.PictureMarkerSymbol(feaConfig.pointIcon, 24, 24);
		} else if (e.geometryType == "esriGeometryPolygon") {
			fms = new mapAPI.SimpleFillSymbol(mapAPI.SimpleFillSymbol.STYLE_SOLID,
				new mapAPI.SimpleLineSymbol(mapAPI.SimpleLineSymbol.STYLE_DASHDOT,
					new mapAPI.Color([0, 255, 0]), 2), new mapAPI.Color([255, 255, 0, 0.25]));
		}
		//var infoWin = mapAPI.InfoTemplate("${" + feaConfig.nameField + "}", app.getInfoContent(fields));
		var infoWin = null;
		var i = 0;
		var resultul = ""; // '<ul class="resultUI">';
		features.forEach(function(fea) {
			var att = fea.attributes;
			att.fields = newFields;
			var geo = fea.geometry;
			if(geo.type == "polygon"){
				geo.prototype = mapAPI.Polygon.prototype;
				att.extent = geo.getExtent();
				att.centerPoint = geo.getCentroid();
			}else if(geo.type == "point"){
				att.point = geo;
			}
			var resultName = att[feaConfig.nameField];
			att.resultName = resultName;
			var gra = new mapAPI.Graphic(geo, fms, att, infoWin);
			var attJson = JSON.stringify(att);
			resultul += '<li data-target=\'' + attJson + '\'>' + resultName + '</li>';
			gLayer.add(gra);
			i++;
		})
		//resultul += "</ul>"; 
		$(".resultUI").html(resultul);
		$(".resultUI li").click(function() {
			var attStr = $(this).attr("data-target");
			var attInfo = JSON.parse(attStr);
			app.showDeatilInfo(attInfo, newFields);
		})
		app.layerZoom(features);
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
	//高级查询显示结果列表
	showAdvanceResult(columns, data, searchConfig) {
		var _this = this;
		var tablestr = "<div class='advanceTable'></div>";
		app.resultPanel = $.jsPanel({
			headerTitle: "查询结果",
			position: "left-bottom 30 -30",
			theme: "primary",
			content: tablestr,
			onclosed: function() {
				app.resultPanel = null;
			},
			callback: function() {
				var options = {
					onClickRow: function(e) {
						app.clickRow(e, searchConfig);
					}
				}
				mugis.initTable(".advanceTable", columns, data, options);
			}
		});
	},
	layerZoom(features) {
		var xmin = 999999999999,
			xmax = 0,
			ymin = 999999999999,
			ymax = 0;
		features.forEach(function(feature) {
			var geo = feature.geometry;
			geo.prototype = mapAPI.Polygon.prototype;
			var pExtent = geo.getExtent();
			if (pExtent.xmin < xmin) {
				xmin = pExtent.xmin;
			}
			if (pExtent.ymin < ymin) {
				ymin = pExtent.ymin;
			}
			if (pExtent.xmax > xmax) {
				xmax = pExtent.xmax;
			}
			if (pExtent.ymax > ymax) {
				ymax = pExtent.ymax;
			}
		})
		// var spatialReference = new mapAPI.SpatialReference({wkt:'PROJCS["北京地方坐标系",GEOGCS["GCS_Beijing_1954",DATUM["D_Beijing_1954",SPHEROID["Krasovsky_1940",6378245.0,298.3]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",300000.0],PARAMETER["Central_Meridian",116.3502518],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",39.86576603],UNIT["Meter",1.0]]'});
// 		var spatialReference = new esri.SpatialReference({
// 			wkid: 3857
// 		});

		var newExtent = new mapAPI.Extent(xmin, ymin, xmax, ymax);
		newExtent.setSpatialReference(spatialReference);
		map.setExtent(newExtent);
	},

	//查询结果
	showAdvanceResult1() {
		$("#resultPanel").show();
		$(".resultUI li").click(function(e) {
			var id = e.currentTarget.dataset.target;
			app.showDeatilInfo(id);
		})
		$('#resultPanel img').click(function() {
			$("#resultPanel").hide();
			layerConfigs.forEach(function(info) {
				var lId = info.lId;
				var gLayer = map.getLayer(lId);
				gLayer.clear();
			})
		})
	},
	//详细信息
	showDeatilInfo(attrs, fields) {
		app.DMTXX = attrs.attrs;
		if(attrs.extent){
			var extent = attrs.extent;
			map.setExtent(new mapAPI.Extent(extent.xmin-0.001,extent.ymin-0.001,extent.xmax+0.001,extent.ymax+0.001,spatialReference));
			var point = new mapAPI.Point(attrs.centerPoint.x,attrs.centerPoint.y);
			var newPt = mapAPI.webMercatorUtils.webMercatorToGeographic(point);
			app.curPoint = {
				x: newPt.x,
				y: newPt.y,
				name:attrs.resultName,
			}
		}else if(attrs.point){
			map.centerAt(attrs.point);
			map.setScale(800);
		}
		
		//显示面板
		$("#detailPanel").show();
		//生成详情界面
		var strhtml = "";
		for (var i = 0; i < fields.length; i++) {
			strhtml += "<b>" + fields[i].alias + "</b>：" + attrs[fields[i].name] + "<br/>";
		}
		$("#infoPanel").html(strhtml); 
		//绑定关闭
		$('#detailPanel img').click(function() {
			$("#detailPanel").hide();
		})
	},
	//查询表格单行点击回调函数
	clickRow(e, searchConfig) {
		var hLayer = map.getLayer("highLightLayer");
		hLayer.clear();
		var qWhere = searchConfig.idField + " = " + e[searchConfig.idField];
		mugis.layerAttSearch(searchConfig.layerId, qWhere, null, function(e, params) {
			app.graHighLight(e, params);
		}, searchConfig)
		console.log(searchConfig);
	},
	//高亮显示要素
	graHighLight(e, graConfig) {
		var features = e.features;
		if (features.length > 0) {
			var feature = features[0];
			var fields = e.fields;
			var fms;
			if (e.geometryType == "esriGeometryPoint") {
				fms = new mapAPI.PictureMarkerSymbol(mapconfig.highLightIcon, 40, 40);
				map.setScale(1000);
				map.centerAt(feature.geometry);
			} else if (e.geometryType == "esriGeometryPolygon") {
				fms = new mapAPI.SimpleFillSymbol(mapAPI.SimpleFillSymbol.STYLE_SOLID,
					new mapAPI.SimpleLineSymbol(mapAPI.SimpleLineSymbol.STYLE_SOLID,
						"#f00", 2), new mapAPI.Color([255, 255, 0, 0]));
				var polygon = feature.geometry;
				polygon.prototype = mapAPI.Polygon;
				map.setExtent(feature.geometry.getExtent());
			}
			var infoWin = mapAPI.InfoTemplate("${" + graConfig.nameField + "}", app.getInfoContent(fields));
			var gra = new mapAPI.Graphic(feature.geometry, fms, feature.attributes, infoWin);
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
	},
	//土地利用统计
	statLand() {
		var _this = this;
		var chartStr = '<div id="statPanel" style="height:500px;">' +
			'<ul class="conditionUl">' +
			'    <li id="li_area" style="height: 36px;line-height: 36px;text-align:center;" class="cond_select" >' +
			'       地块面积' +
			'    </li>' +
			'    <li id="li_nums" style="height: 36px;line-height: 36px;text-align:center;">' +
			'        地块数量' +
			'    </li> ' +
			'</ul>' +
			'<div id="chart_area" class="chart_panel" style="height:350px;width:100%;">' +
			'    地块面积图' +
			'</div>' +
			'<div id="chart_nums" class="chart_panel" style="height:350px;width:100%;display:none;">' +
			'    地块数量图' +
			'</div>' +
			'</div>';
		if (this.statPanel) {
			this.statPanel.close();
		}
		this.statPanel = $.jsPanel({
			headerTitle: "土地利用情况 统计结果",
			position: "right-bottom -30 -30",
			theme: "primary",
			panelSize: '470 450',
			content: chartStr,
			onclosed: function() {
				_this.statPanel = null;
			},
			callback: function() {
				app.chartInit("chart_area", "地块面积");
			}
		});

		$("#statPanel .conditionUl li").click(function(e) {
			var target = e.currentTarget.id.split("_")[1];
			$("#statPanel .conditionUl li").removeClass("cond_select");
			$(e.currentTarget).addClass("cond_select");

			$("#statPanel .chart_panel").hide();
			$("#chart_" + target).show();
			app.chartInit("chart_" + target, e.currentTarget.textContent.trim());
		})
	},
	//生成图表
	chartInit(id, title) {
		var data = [{
			value: 3661,
			name: '<10w'
		}, {
			value: 5713,
			name: '10w-50w'
		}, {
			value: 9938,
			name: '50w-100w'
		}, {
			value: 17623,
			name: '100w-500w'
		}, {
			value: 3299,
			name: '>500w'
		}];
		option = {
			backgroundColor: '#fff',
			title: {
				text: title,
				//subtext: '2016年',
				x: 'center',
				y: 'center',
				textStyle: {
					fontWeight: 'normal',
					fontSize: 16
				}
			},
			tooltip: {
				show: true,
				trigger: 'item',
				formatter: "{b}: {c} ({d}%)"
			},
			legend: {
				orient: 'horizontal',
				bottom: '0%',
				data: ['<10w', '10w-50w', '50w-100w', '100w-500w', '>500w']
			},
			series: [{
				type: 'pie',
				selectedMode: 'single',
				radius: ['25%', '58%'],
				color: ['#86D560', '#AF89D6', '#59ADF3', '#FF999A', '#FFCC67'],

				label: {
					normal: {
						position: 'inner',
						formatter: '{d}%',

						textStyle: {
							color: '#fff',
							fontWeight: 'bold',
							fontSize: 14
						}
					}
				},
				labelLine: {
					normal: {
						show: false
					}
				},
				data: data
			}, {
				type: 'pie',
				radius: ['58%', '83%'],
				itemStyle: {
					normal: {
						color: '#F2F2F2'
					},
					emphasis: {
						color: '#ADADAD'
					}
				},
				label: {
					normal: {
						position: 'inner',
						formatter: '{c}家',
						textStyle: {
							color: '#777777',
							fontWeight: 'bold',
							fontSize: 14
						}
					}
				},
				data: data
			}]
		};
		var myChart = echarts.init(document.getElementById(id));
		myChart.setOption(option);
	},
	//园区树结构
	showTree() {
		var _this = this;
		var treeStr = '<div id="treePanel"><ul id="treeUl" class="ztree"></ul></div>';
		var zTreeObj;
		var setting = {
			callback: {
				onClick: function(treeId, target, treeNode) {
					console.log(treeNode.name);
				}
			}
		};
		var zNodes = [{
			name: "昌平园区",
			open: true,
			children: [{
					name: "北汽福田"
				},
				{
					name: "生命科学园"
				},
				{
					name: "国际信息园"
				},
				{
					name: "宏福科技园"
				},
				{
					name: "北七家工业园"
				},
				{
					name: "巩华城"
				},
				{
					name: "流村工业园"
				},
				{
					name: "未来科学城"
				},
				{
					name: "三一光电园"
				},
				{
					name: "西区"
				},
				{
					name: "国家工程创新基地"
				},
				{
					name: "北农科技园"
				},
				{
					name: "矿大科技园"
				},
				{
					name: "马池口产业基地"
				},
				{
					name: "南口工业园"
				},
				{
					name: "未来科学城成果转化基地"
				},
				{
					name: "东区"
				},
				{
					name: "小汤山农业展示基地"
				},
				{
					name: "百善产业园"
				},
				{
					name: "阳坊工业园"
				},
				{
					name: "珠江产业园"
				}
			]
		}, ];
		if (this.treePanel) {
			this.treePanel.close();
		}
		this.treePanel = $.jsPanel({
			headerTitle: "分园区",
			position: "right-bottom -30 -30",
			theme: "primary",
			panelSize: '470 450',
			content: treeStr,
			onclosed: function() {
				_this.treePanel = null;
			},
			callback: function() {
				zTreeObj = $.fn.zTree.init($("#treeUl"), setting, zNodes);
			}
		});

	},
	//绘制范围
	drawStart(drawBtnclass) {
	    $("#drawPanel").show();
		$("#drawPanel").load("page/draw.html", function() {
			// $("#drawPanelContent").show();
			var mapDraw = $.common.initMap("map2");
			$.common.addTDTBaseMap(mapDraw,"baseMap_VEC");
			$.common.addBaseMap(mapDraw,"baseMap_DrawMap");
			//返回
			$(".cltd_draw").click(function() {
				$("#drawPanel").hide();
			})
			$(".drawUl_item").click(function(){
				var drawType = $(this).attr("type");
				if(drawType == "cExtent"){
					app.drawGeo = map.extent;
					$("#panelCondition").show();
				}else{
					$.common.mapDraw(mapDraw,mapAPI.Draw[drawType],function(e){
						// app.drawGeo = mapAPI.webMercatorUtils.webMercatorToGeographic(e.geometry);
						app.drawGeo = e.geometry;
					})
				}
			})
		});
	}
}
