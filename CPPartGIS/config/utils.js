//utils通用方法入口
(function(window, document) {

	var version = "1.0.0",
		utils = function(selector) {
			return new utils.fn.init(selector);
		}

	utils.fn = utils.prototype = {
		version: version,
		constructor: utils,
		//selector: null,
		init: function(selector) {
			if ((typeof selector) === "string") {
				if (options.targetId.indexOf('.') > -1) {
					this.selector = document.querySelectorAll(selector); //含.
				} else if (options.targetId.indexOf('#') > -1) {
					this.selector = document.getElementById(selector); //含#
				} else {
					this.selector = document.getElementById(selector);
				}
			} else {
				this.selector = selector;
			}
			return this;
		},
		test: function(param) {
			return this;
		}
	}

	utils.fn.extend = utils.extend = function() {
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
		setSearchBlock: function(searchBlock, darwCallback, callback) {
			var searchItems = searchBlock.group;
			var searchContentHtml = '<form class="form-horizontal">';
			searchItems.forEach(function(searchItem) {
				var funName = searchItem.itemFunction;
				searchContentHtml += $.tools[funName](searchItem);
			})
			var drawHtml = $.tools.buttonFormat(searchBlock.drawClass, "设置地理范围");
			var btnHtml = $.tools.buttonFormat(searchBlock.btnClass, "查询");
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
					if (seachValue != "") {
						if (searchItem.searchType == "numList") {
							var searchValues = seachValue.split("-");
							qWhere += " and " + searchField + ">" + searchValues[0] + " and " + searchField + " < " + searchValues[1];
						} else if (searchItem.searchType == "number") {
							qWhere += " and " + searchField + " = " + seachValue;
						} else {
							qWhere += " and " + searchField + " like '%" + seachValue + "%'";
						}
					}

				})
				callback(layerId, qWhere, searchBlock);
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
				var selectHtml = '<div class="form-group"><label class="col-sm-3 control-label" fieldName="' +
					searchConfig.fieldName + '">' +
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
					+searchConfig.fieldName + '">' + searchConfig.fieldlabel + '：</label><div class="col-sm-offset-3 col-sm-9">';
				numHtml += '<input type="text" class="form-control ' + layerConfig.divClass + '" value="" placeholder="' +
					searchConfig.fieldlabel + '搜索">' + '</div></div>';
				return numHtml;
			},
			numFormat: function(layerConfig) {
				var searchConfig = layerConfig.searchField;
				var numHtml = '<div class="form-group"><label class="col-sm-3 control-label" fieldName="' +
					+searchConfig.fieldName + '">' + searchConfig.fieldlabel + '：</label><div class="col-sm-offset-3 col-sm-9">';
				numHtml += '<input type="text" onkeyup="value=value.replace(/\D/g,\'\')" class="form-control ' + layerConfig.divClass +
					'" value="" placeholder="' +
					searchConfig.fieldlabel + '搜索">' + '</div></div>';
				return numHtml;
			},
			buttonFormat: function(buttonClass, btnLabel) {
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
			mapDraw: function(map, drawType, resultFun, resultParam, endBtnClass) {
				// 				var dlayer = map.getLayer("drawGeoLayer");
				// 				if(dlayer) layer.clear();
				map.graphics.clear();
				var drawToolBar = new mapAPI.Draw(map);
				drawToolBar.activate(drawType);
				map.setMapCursor("pointer");
				drawToolBar.on("draw-end", function(e) {
					map.setMapCursor("default");
					drawToolBar.deactivate();
					var fms = new mapAPI.SimpleFillSymbol(mapAPI.SimpleFillSymbol.STYLE_SOLID,
						new mapAPI.SimpleLineSymbol(mapAPI.SimpleLineSymbol.STYLE_DASHDOT,
							new mapAPI.Color([100, 100, 0]), 1), new mapAPI.Color([255, 255, 0, 0.25]));
					console.log(e);
					var gra = new mapAPI.Graphic(e.geometry, fms);
					map.graphics.add(gra);
					if (resultParam) {
						resultFun(e, resultParam);
					} else {
						resultFun(e);
					}
				});
				if (endBtnClass) {
					$(endBtnClass).click(function() {
						drawToolBar.finishDrawing();
					})
				}
				$(".drawClearBtn").click(function() {
					map.graphics.clear();
				})
			},
			/**
			 * 加载天地图.
			 * @param {string} type - 天地图类型参数(baseMap_VEC,baseMap_DEM,baseMap_IMG).
			 */
			addTDTBaseMap2: function(map, type) {
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
						});
						tdt.id = type;
					} else if (type == "baseMap_DEM") {
						//地形图（不显示）
						var tdt = new TDTLayer("http://t0.tianditu.cn/ter_c/wmts", {
							noteType: "ter_c"
						});
						tdt.id = type;
					} else if (type == "baseMap_IMG") {
						//影像  
						var tdt = new TDTLayer("http://t0.tianditu.com/img_c/wmts", {
							noteType: "img_c"
						});
						tdt.id = type;
					}
					var tdlt = new TDTLayer("http://t0.tianditu.com/cva_c/wmts", {
						noteType: "cva_c"
					});
					tdlt.id = type + "_labelmark";
					map.addLayer(tdt, 0);
					map.addLayer(tdlt, 1);
				});
			},
			/**
			 * 加载天地图.
			 * @param {string} type - 天地图类型参数(baseMap_VEC,baseMap_DEM,baseMap_IMG).
			 */
			addTDTBaseMap: function(map, type) {
				dojo.declare("WebTileLayer", esri.layers.TiledMapServiceLayer, {
					_type: "",
					constructor: function(type) {
						this._type = type;
						this.spatialReference = new esri.SpatialReference({
							wkid: 3857
						});
						this.initialExtent = (this.fullExtent =
							new esri.geometry.Extent(-20037508.342787, -20037508.342787, 20037508.342787, 20037508.342787,
								this.spatialReference));


						this.tileInfo = new esri.layers.TileInfo({
							"rows": 256,
							"cols": 256,
							"compressionQuality": 0,
							"origin": {
								"x": -20037508.342787,
								"y": 20037508.342787
							},
							"spatialReference": {
								"wkid": 3857
							},

							"lods": [{
									"level": 0,
									"resolution": 156543.033928,
									"scale": 591657527.591555
								},
								{
									"level": 1,
									"resolution": 78271.5169639999,
									"scale": 295828763.795777
								},
								{
									"level": 2,
									"resolution": 39135.7584820001,
									"scale": 147914381.897889
								},
								{
									"level": 3,
									"resolution": 19567.8792409999,
									"scale": 73957190.948944
								},
								{
									"level": 4,
									"resolution": 9783.93962049996,
									"scale": 36978595.474472
								},
								{
									"level": 5,
									"resolution": 4891.96981024998,
									"scale": 18489297.737236
								},
								{
									"level": 6,
									"resolution": 2445.98490512499,
									"scale": 9244648.868618
								},
								{
									"level": 7,
									"resolution": 1222.99245256249,
									"scale": 4622324.434309
								},
								{
									"level": 8,
									"resolution": 611.49622628138,
									"scale": 2311162.217155
								},
								{
									"level": 9,
									"resolution": 305.748113140558,
									"scale": 1155581.108577
								},
								{
									"level": 10,
									"resolution": 152.874056570411,
									"scale": 577790.554289
								},
								{
									"level": 11,
									"resolution": 76.4370282850732,
									"scale": 288895.277144
								},
								{
									"level": 12,
									"resolution": 38.2185141425366,
									"scale": 144447.638572
								},
								{
									"level": 13,
									"resolution": 19.1092570712683,
									"scale": 72223.819286
								},
								{
									"level": 14,
									"resolution": 9.55462853563415,
									"scale": 36111.909643
								},
								{
									"level": 15,
									"resolution": 4.77731426794937,
									"scale": 18055.954822
								},
								{
									"level": 16,
									"resolution": 2.38865713397468,
									"scale": 9027.977411
								},
								{
									"level": 17,
									"resolution": 1.19432856685505,
									"scale": 4513.988705
								},
								{
									"level": 18,
									"resolution": 0.597164283559817,
									"scale": 2256.994353
								},
								{
									"level": 19,
									"resolution": 0.298582141647617,
									"scale": 1128.497176
								}
							]
						});

						this.loaded = true;
						this.onLoad(this);
					},

					getTileUrl: function(level, row, col) {
						if (this._type == null)
							return 'http://webst0' + (col % 4 + 1) +
								'.is.autonavi.com/appmaptile?tk=96d757dfaf417c8a032b36e81db1b79c&style=6&x=' + col + '&y=' + row + '&z=' +
								level;
						else if (this._type == "t") {
							// return 'http://t' + (col % 7) + '.tianditu.cn/img_w/wmts?tk=96d757dfaf417c8a032b36e81db1b79c&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL=' + col + '&TILEROW=' + row + '&TILEMATRIX=' + level;
							return 'http://t0.tianditu.gov.cn/img_w/wmts?tk=96d757dfaf417c8a032b36e81db1b79c&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL=' +
								col + '&TILEROW=' + row + '&TILEMATRIX=' + level;
						}else if(this._type == "c"){
							return 'http://t0.tianditu.gov.cn/cva_w/wmts?tk=96d757dfaf417c8a032b36e81db1b79c&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL=' +
								col + '&TILEROW=' + row + '&TILEMATRIX=' + level;
						}else if(this._type == "v"){
							return 'http://t0.tianditu.gov.cn/vec_w/wmts?tk=96d757dfaf417c8a032b36e81db1b79c&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL=' +
								col + '&TILEROW=' + row + '&TILEMATRIX=' + level;
						}
					}
				});
				var imgTdtLayer = new WebTileLayer("t");
				imgTdtLayer.id = "imgTdtLayer";
				imgTdtLayer.setVisibility(false);
				var vecTdtLayer = new WebTileLayer("v");
				vecTdtLayer.id = "vecTdtLayer";
				vecTdtLayer.setVisibility(true);
				map.addLayer(imgTdtLayer);
				map.addLayer(vecTdtLayer);
				map.addLayer(new WebTileLayer("c"));
			},
			initMap: function(divClass) {
				//Popup
				var popup = new mapAPI.Popup({
					titleInBody: false,
					highlight: false
				}, mapAPI.domConstruct.create(divClass));
				mapAPI.domClass.add(popup.domNode, "light");
				// mapinfo.initExtent = new esri.geometry.Extent(-20037508.342787, -20037508.342787, 20037508.342787, 20037508.342787,spatialReference)
				//加载天地图
				var map = new mapAPI.Map(divClass, {
					logo: false,
					slider: false,
					minZoom:9,//最小空间等级
				});
				return map;
			},
			addBaseMap: function(map, layerId) {
				var dLayer = new mapAPI.ArcGISDynamicMapServiceLayer(mapconfig.vectorMapServerUrl, {
					id: layerId
				});
				map.addLayer(dLayer);
				//默认地图范围
				var spatialReference = new mapAPI.SpatialReference({
					wkid: 3857
				});
				var initExtent = mapinfo.initExtent = new mapAPI.Extent(mapconfig.extent);
				// var initExtent = mapinfo.initExtent = new mapAPI.Extent(12848116.944046713,4873810.2488809675,13026506.989269175,4904907.791233301);
				initExtent.setSpatialReference(spatialReference);
				map.setExtent(initExtent);
				return dLayer;
			}
		}
	})

})(window, document)
