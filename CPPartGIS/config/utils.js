
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
				callback(searchBlock);
			})
			$("." + searchBlock.drawClass).click(function() {
				alert(searchBlock.drawClass);
				darwCallback(searchBlock.drawClass);
			})
		}
	})
	
	$.extend({
		tools: {
			selectFormat: function(layerConfig) {
				var searchConfig = layerConfig.searchField;
				var selectHtml = '<div class="form-group"><label class="col-sm-3 control-label" fieldName="' + searchConfig.fieldName +
					'">' +
					searchConfig.fieldlabel + '：</label><div class="col-sm-9"><select class="' + layerConfig.defaultClass + ' ' +
					layerConfig.divClass +
					'">';
				var options = layerConfig.selectOptions;
				var optionHtml = "";
				options.forEach(function(option) {
					optionHtml += '<option value="' + option.value + '">' + option.label + "</option>";
				})
				optionHtml += "</select></div></div>";
				return selectHtml + optionHtml;
			},
			textFormat: function(layerConfig) {
				var numHtml = '<div class="form-group"><div class="col-sm-offset-3 col-sm-9">';
				numHtml += '<input type="text" class="form-control ' + layerConfig.divClass + '" value="" placeholder="名称搜索">';
				numHtml += '</div></div>';
				return numHtml;
			},
			numFormat: function(layerConfig) {
				var numHtml = '<div class="form-group"><div class="col-sm-offset-3 col-sm-9">';
				numHtml += '<input type="text" class="form-control ' + layerConfig.divClass + '" value="" placeholder="名称搜索">';
				numHtml += '</div></div>';
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
			}
		}
	})
	
})(window, document)