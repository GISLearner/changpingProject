
//utils通用方法入口
(function (window, document) {

    var version = "1.0.0",
    utils = function (selector) {
        return new utils.fn.init(selector);
    }

    utils.fn = utils.prototype = {
        version: version,
        constructor: utils,
        //selector: null,
        init: function (selector) {
            if ((typeof selector) === "string") {
                if (options.targetId.indexOf('.') > -1) {
                    this.selector = document.querySelectorAll(selector);//含.
                }
                else if (options.targetId.indexOf('#') > -1) {
                    this.selector = document.getElementById(selector);//含#
                }
                else {
                    this.selector = document.getElementById(selector);
                }
            } else {
                this.selector = selector;
            }
            return this;
        },
        test: function (param) {
            return this;
        }
    }

    utils.fn.extend = utils.extend = function () {
        var target, sources;
        var arg0 = arguments[0];
        if (arg0.length == 0) return this;

        if (arguments.length == 1) {
            target = this;
            sources = [arg0];
        } else {
            target = arg0;
            sources = slice.call(arguments, 1);
        }
        for (var i = 0; i < sources.length; i++) {
            var source = sources[i];
            for (var key in source) {
                target[key] = source[key];
            }
        }
        return target;
    }

    utils.fn.init.prototype = utils.fn;
    window.$utils = window.utils = utils;
	
	//模块通用方法
	$.fn.extend({
		setSearchBlock: function(searchBlock, darwCallback,callback) {
			var searchItems = searchBlock.group;
			var searchContentHtml = '<form class="form-horizontal">';
			searchItems.forEach(function(searchItem) {
				var funName = searchItem.itemFunction;
				searchContentHtml += $.tools[funName](searchItem);
			})
			var drawHtml = $.tools.buttonFormat(searchBlock.drawClass,"设置地理范围");
			var btnHtml = $.tools.buttonFormat(searchBlock.btnClass,"查询");
			searchContentHtml += drawHtml;
			searchContentHtml += btnHtml;
			searchContentHtml += '</form>';
			$(this).html(searchContentHtml);
			$("." + searchBlock.btnClass).click(function() {
				var qWhere = "1=1";
				var layerId = searchBlock.layerId;
				searchItems.forEach(function(searchItem) {
					var searchField = searchItem.searchField.fieldName;
					var seachValue = $("." + searchItem.divClass).val();
					if(seachValue != ""){
						if(searchItem.searchType == "numList"){
							var searchValues = seachValue.split("-");
							qWhere += " and " + searchField + ">" + searchValues[0] + " and " + searchField + " < " + searchValues[1];
						}else if(searchItem.searchType == "number"){
							qWhere += " and " + searchField + " = " + seachValue;
						}else{
							qWhere += " and " + searchField + " like '%" + seachValue + "%'";
						}
					}
					
				})
				callback(layerId,qWhere,searchBlock);
			})
			$("." + searchBlock.drawClass).click(function() {
				darwCallback(searchBlock.drawClass);
			})
		}
	})
	
	$.extend({
		tools: {
			selectFormat: function(layerConfig) {
				var searchConfig = layerConfig.searchField;
				var selectHtml = '<div class="form-group"><label class="col-sm-3 control-label" fieldName="' 
				+ searchConfig.fieldName +'">' +
					searchConfig.fieldlabel + '：</label><div class="col-sm-9"><select class="' + layerConfig.defaultClass + ' ' +
					layerConfig.divClass + '">';
				var options = layerConfig.selectOptions;
				var optionHtml = "";
				options.forEach(function(option) {
					optionHtml += '<option value="' + option.value + '">' + option.label + "</option>";
				})
				optionHtml += "</select></div></div>";
				return selectHtml + optionHtml;
			},
			textFormat: function(layerConfig) {
				var searchConfig = layerConfig.searchField;
				var numHtml = '<div class="form-group"><label class="col-sm-3 control-label" fieldName="' + 
				+ searchConfig.fieldName +'">' + searchConfig.fieldlabel + '：</label><div class="col-sm-offset-3 col-sm-9">';
				numHtml += '<input type="text" class="form-control ' + layerConfig.divClass + '" value="" placeholder="' 
				+ searchConfig.fieldlabel + '搜索">' + '</div></div>';
				return numHtml;
			},
			numFormat: function(layerConfig) {
				var searchConfig = layerConfig.searchField;
				var numHtml = '<div class="form-group"><label class="col-sm-3 control-label" fieldName="' + 
				+ searchConfig.fieldName +'">' + searchConfig.fieldlabel + '：</label><div class="col-sm-offset-3 col-sm-9">';
				numHtml += '<input type="text" onkeyup="value=value.replace(/\D/g,\'\')" class="form-control ' + layerConfig.divClass + '" value="" placeholder="' 
				+ searchConfig.fieldlabel + '搜索">' + '</div></div>';
				return numHtml;
			},
			buttonFormat: function(buttonClass,btnLabel) {
				var buttonHtml =
					'<div class="form-group"><div class="col-sm-offset-3 col-sm-9"><input type="button" class="btn btn-primary ' +
					buttonClass + '" value="' + btnLabel + '" />';
				buttonHtml += '</div></div>';
				return buttonHtml;
			}
		},
		common: {
			layerAttSearch: function(layerId, searchWhere, geo, resultFunction, resultParam) {
				var queryTask = new mapAPI.QueryTask(mapconfig.vectorMapServerUrl + "/" + layerId);
				var query = new mapAPI.Query();
				query.outFields = ["*"];
				if (geo) {
					query.geometry = geo;
				}
				query.where = searchWhere;
				query.returnGeometry = true;
				queryTask.execute(query, function(e) {
					if (resultParam) {
						resultFunction(e, resultParam);
					} else {
						resultFunction(e);
					}
				}, function(error) {
					console.log(error);
				})
			},
			/*
			接口名称：画图(李艳斌添加)
			功能描述：地图画图功能
			方法名称：mapDraw
			必选参数：
				1.map        	地图
				2.drawType   	画图的类型
				3.resultFun  	画完图的回调函数
				4.resultParam 	画完图返回的临时参数
				5.endBtnClass 	绘制完成按钮的class选择器
			*/
			mapDraw:function (map, drawType, resultFun, resultParam,endBtnClass) {
// 				var dlayer = map.getLayer("drawGeoLayer");
// 				if(dlayer) layer.clear();
				map.graphics.clear();
				var drawToolBar = new mapAPI.Draw(map);
				drawToolBar.activate(drawType);
				map.setMapCursor("pointer");
				drawToolBar.on("draw-end", function (e) {
					map.setMapCursor("default");
					drawToolBar.deactivate();
					var fms = new mapAPI.SimpleFillSymbol(mapAPI.SimpleFillSymbol.STYLE_SOLID,    
					new mapAPI.SimpleLineSymbol(mapAPI.SimpleLineSymbol.STYLE_DASHDOT,    
					new mapAPI.Color([100,100,0]), 1),new mapAPI.Color([255,255,0,0.25]));
					console.log(e);
					var gra = new mapAPI.Graphic(e.geometry,fms);
					map.graphics.add(gra);
					if (resultParam) {
						resultFun(e, resultParam);
					} else {
						resultFun(e);
					}
				});
				if(endBtnClass){
					$(endBtnClass).click(function(){
						drawToolBar.finishDrawing();
					})
				}
				$(".drawClearBtn").click(function(){
					map.graphics.clear();
				})
			},
			/**
			* 加载天地图.
			* @param {string} type - 天地图类型参数(baseMap_VEC,baseMap_DEM,baseMap_IMG).
			*/
			addTDTBaseMap: function(map,type) {
				//矢量（baseMap_VEC）、地形（baseMap_DEM）、影像图（baseMap_IMG）
				var tdt; //地图
				var tdlt; //地图标注
				require([
					"widgets/TDTLayer"
				], function(TDTLayer) {
					if (type == "baseMap_VEC") {
						//矢量
						var tdt = new TDTLayer("http://t0.tianditu.com/vec_c/wmts", {
							noteType: "vec_c"
// 						var tdt = new TDTLayer("http://t0.tianditu.gov.cn/vec_w/wmts", {
// 							noteType: "vec_c",
// 							spatialReType:"webMercator"
						});
						tdt.id = type;
					} else if (type == "baseMap_DEM") {
						//地形图（不显示）
						var tdt = new TDTLayer("http://t0.tianditu.cn/ter_c/wmts", {
							noteType: "ter_c"
// 						var tdt = new TDTLayer("http://t0.tianditu.gov.cn/ter_w/wmts", {
// 							noteType: "ter_w",
// 							spatialReType:"webMercator"
						});
						tdt.id = type;
					} else if (type == "baseMap_IMG") {
						//影像  
						var tdt = new TDTLayer("http://t0.tianditu.com/img_c/wmts", {
							noteType: "img_c"
// 						var tdt = new TDTLayer("http://t0.tianditu.gov.cn/img_w/wmts", {
// 							noteType: "img_w",
// 							spatialReType:"webMercator"
						});
						tdt.id = type;
					}
					var tdlt = new TDTLayer("http://t0.tianditu.com/cva_c/wmts", {
						noteType: "cva_c"
// 					var tdlt = new TDTLayer("http://t0.tianditu.gov.cn/cva_w/wmts", {
// 						noteType: "cva_w",
// 						spatialReType:"webMercator"
					});
					tdlt.id = type + "_labelmark";
					map.addLayer(tdt, 0);
					map.addLayer(tdlt, 1);
				});
			},
			initMap:function(divClass){
				//Popup
				var popup = new mapAPI.Popup({
					titleInBody: false,
					highlight: false
				}, mapAPI.domConstruct.create(divClass));
				mapAPI.domClass.add(popup.domNode, "light");
				//默认地图范围
				var initExtent = new mapAPI.Extent(mapconfig.extent);
				// mapinfo.initExtent.setSpatialReference(spatialReference);
				// mapinfo.initExtent = new esri.geometry.Extent(-20037508.342787, -20037508.342787, 20037508.342787, 20037508.342787,spatialReference)
				//加载天地图
				var map = new mapAPI.Map(divClass, {
					logo: false,
					slider: false,
					extent: initExtent
				});
				return map;
			},
			addBaseMap:function(map,layerId){
				var dLayer = new mapAPI.ArcGISDynamicMapServiceLayer(mapconfig.vectorMapServerUrl, {
					id: layerId
				});
				
				var infoTemplates = {};
				layerFieldConfigs.forEach(function(fieldConfig){
					var layerIds = fieldConfig.layerId;
					var layerIdAry = layerIds.split(",")
					var titleFormatStr = "${" + fieldConfig.titleField + "}";
					var infoFormatStr = "<table>";
					var fields = fieldConfig.fieldInfo;
					fields.forEach(function(field){
						infoFormatStr += "<tr><td style='min-width:100px;'>" + field.fieldLabel + "：</td><td>${" + field.fieldName + "}</td></tr>";
					})
					infoFormatStr += "</table>";
					var infoTemplate = new mapAPI.InfoTemplate(titleFormatStr,infoFormatStr);
					var templateObj = {
						infoTemplate:infoTemplate,
						layerUrl: null
					}
					layerIdAry.forEach(function(layerId){
						infoTemplates[layerId] = templateObj;
					})
				})
				dLayer.setInfoTemplates(infoTemplates);

// 				var infoTemplate1 = new mapAPI.InfoTemplate("${LYMC}", "<div>名称：${LYMC}</div><div>地址：${LYMC}</div><div>街道名称：${LYMC}</div>");
// 				var infoTemplate2 = new mapAPI.InfoTemplate("${XMMC}", "<div>名称：${XMMC}</div>");
// 				var infoTemplate3 = new mapAPI.InfoTemplate("${XMMC}", "<div>企业名称：${XMMC}</div><div>土地性质：${XMMC}</div><div>类别代码名称：${XMMC}</div>");
// 				var infoTemplate4 = new mapAPI.InfoTemplate("${XMMC}", "<div>名称：${XMMC}<div>地址：${XMMC}</div><div>街道名称：${XMMC}</div>");
// 				var infoTemplates = {
// 					4: {
// 						infoTemplate: infoTemplate1,
// 						layerUrl: null
// 					},
// 					5: {
// 						infoTemplate: infoTemplate1,
// 						layerUrl: null
// 					},
// 					6: {
// 						infoTemplate: infoTemplate2,
// 						layerUrl: null
// 					},
// 					7: {
// 						infoTemplate: infoTemplate2,
// 						layerUrl: null
// 					},
// 					6: {
// 						infoTemplate: infoTemplate3,
// 						layerUrl: null
// 					},
// 					9: {
// 						infoTemplate: infoTemplate3,
// 						layerUrl: null
// 					},
// 					10: {
// 						infoTemplate: infoTemplate4,
// 						layerUrl: null
// 					},
// 					11: {
// 						infoTemplate: infoTemplate4,
// 						layerUrl: null
// 					}
// 				};
// 				dLayer.setInfoTemplates(infoTemplates);
				map.addLayer(dLayer);
			}
		}
	})
	
})(window, document)