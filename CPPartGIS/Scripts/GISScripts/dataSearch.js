/*
接口名称：图层查询IdentifyTask（李艳斌添加）
功能描述：查询图层
方法名称：identifyTask
必选参数：1.map 地图对象
          2.Params:({layerUrl:"http://192.168.5.152:6080/arcgis/rest/services/JX_BaseMap/MapServer",
                       qGeometry:point,layerIds:[0,1,2],resultFun:resultEvent
                       })
可选参数：options:({resultParam:resultParam,fault:faultEvent,faultParam:faultParam,
                       tolerance:0.3,taskType:"LAYER_OPTION_VISIBLE",
                       returnGeometry:false,spatialRelationship:null})
		 * 
		 * @param layerUrl 图层地址 所要查询的地图图层地址
		 * @param qGeometry 图形查询条件 参数为 Geometry 格式的图形
		 * @param layerIds 图层id 所要查询的地图图层id
		 * @param resultFun 查询成功后要执行的方法
		 * @param resultParam 要对查询成功后执行的方法传递的额外参数，可选
		 * @param fault 查询失败后要执行的方法，可选
		 * @param faultParam 要对查询失败后执行的方法传递的额外参数，可选
		 * @param tolerance IdentifyTask查询图层的容差，可选
		 * @param taskType IdentifyTask查询图层的模式， LAYER_OPTION_ALL("all")为查询所有图层 LAYER_OPTION_TOP("top")为查询当前比例最上面的显示图层 LAYER_OPTION_VISIBLE("visible")为查询当前比例显示的所有图层，可选
		 * @param returnGeometry 是否返回几何图形，默认为true，可选
		 * @param spatialReference 几何图形查询时的空间关系,默认为空，可选
		 * @param hasInfoWin 是否弹出窗口,默认为false，可选
*/
function identifyTask(map, Params, options) {
    require(["esri/tasks/IdentifyParameters", "esri/tasks/IdentifyTask", "esri/InfoTemplate", "dojo/_base/array"],
    function (IdentifyParameters, IdentifyTask, InfoTemplate, arrayUtils) {
        var defaultOptions = {
            resultParam: null,
            fault: function () { },
            faultParam: null,
            tolerance: 3,
            taskType: IdentifyParameters.LAYER_OPTION_ALL,
            returnGeometry: true,
            spatialReference: map.spatialReference,
            hasInfoWin: false
        }
        if (options) {
            for (var o in options) {
                defaultOptions[o] = options[o];
            }
        }
        options = defaultOptions;
        var identifyParams = new IdentifyParameters();
        identifyParams.layerOption = options.taskType;
        identifyParams.layerIds = Params.layerIds;
        identifyParams.returnGeometry = options.returnGeometry;
        identifyParams.width = map.width;
        identifyParams.height = map.height;
        identifyParams.tolerance = options.tolerance;
        identifyParams.geometry = Params.qGeometry;
        identifyParams.mapExtent = map.extent;
        identifyParams.spatialReference = options.spatialReference;
        var identifyTask = new IdentifyTask(Params.layerUrl);
        if (options.hasInfoWin) {
            var deferred = identifyTask
            .execute(identifyParams)
            .addCallback(function (response) {
                if (options.resultParam != null && options.resultParam != "") {
                    return Params.resultFun(response, InfoTemplate, arrayUtils, options.resultParam);
                }
                else {
                    return Params.resultFun(response, InfoTemplate, arrayUtils);
                }
            });
            map.infoWindow.setFeatures([deferred]);
            if (Params.qGeometry.type == "point") {
                map.infoWindow.show(Params.qGeometry);
            }

        } else {
            identifyTask.execute(identifyParams, function (event) {
                if (options.resultParam != null && options.resultParam != "") {
                    Params.resultFun(event, options.resultParam);
                }
                else {
                    Params.resultFun(event);
                }
            }, function (error) {
                if (options.fault) {
                    if (options.faultParam != null && options.faultParam != "") {
                        options.fault(event, options.faultParam);
                    }
                    else {
                        options.fault(event);
                    }
                }
            });
        }

    })
}


/*
接口名称：图层查询queryTask（李艳斌添加）
功能描述：根据属性或几何要素查询图层
方法名称：queryTask
必选参数：layerUrl:"http://192.168.5.152:6080/arcgis/rest/services/JX_BaseMap/MapServer"
          result:resultEvent,
          options:({qGeometry:point,
					   qWhere:"1=1",
                       outField:"name",
                       returnGeometry:false,
                       distance:0,
					   resultParam:resultEvent,
					   resultParam:resultParam,
					   fault:faultEvent,
					   faultParam:faultParam,
					   spatialRelationship:null,
                       queryType:Query.SPATIAL_REL_CONTAINS})
		 * @param layerUrl 图层地址 所要查询的地图图层地址
         * @param qWhere 属性查询条件 可以为针对字段的属性查询条件，如："name='好'"如果要查询所有记录，可以将此参数设置为"1=1" ，但效率很低，不推荐这样使用；
		 * @param result 查询成功后要执行的方法
         * @param tolerance IdentifyTask查询图层的容差
         * @param qGeometry 图形查询条件 参数为 Geometry 格式的图形	
		 * @param resultParam 要对查询成功后执行的方法传递的额外参数
		 * @param outField 查询记录中返回的属性字段，默认为全部返回
		 * @param fault 查询失败后要执行的方法
		 * @param faultParam 要对查询失败后执行的方法传递的额外参数
		 * @param returnGeometry 是否返回几何图形，默认为true，可选
		 * @param spatialReference 几何图形查询时的空间关系,默认为空，可选
*/
function queryTask(layerUrl, resultFun, options) {
    require([
      "esri/tasks/query", "esri/tasks/QueryTask", "dojo/dom"
    ], function (Query, QueryTask, dom) {
        var defaultOptions = {
            qWhere: "1=1",
            outField: ["*"],
            qGeometry: null,
            returnGeometry: true,
            distance: 0,
            resultParam: null,
            fault: function () { },
            faultParam: null,
            spatialReference: null,
            spatialRelationship: Query.SPATIAL_REL_CONTAINS
        }
        if (options) {
            for (var o in options) {
                defaultOptions[o] = options[o];
            }
        }
        options = defaultOptions;
        if (layerUrl == null || layerUrl == "") {
            alert("错误：传入的图层地址为空");
            return;
        }
        var queryParam = getQuery(options);
        var queryTask = new QueryTask(layerUrl);

        queryTask.execute(queryParam, function (event) {
            if (options.resultParam != null && options.resultParam != "") {
                resultFun(event, options.resultParam);
            }
            else {
                resultFun(event);
            }
        }, function (error) {
            if (options.faultParam != null && options.faultParam != "") {
                options.fault(event, options.faultParam);
            }
            else {
                options.fault(event);
            }
        });

        function getQuery(qOptions) {
            var query = new Query();
            //查询条件
            query.where = qOptions.qWhere;
            //查询图形
            if (qOptions.qGeometry) {
                query.geometry = qOptions.qGeometry;
            }
            //输出字段
            query.outFields = qOptions.outField;
            //返回geometry
            query.returnGeometry = qOptions.returnGeometry;
            //坐标系
            if (qOptions.spatialReference) {
                query.spatialReference = qOptions.spatialReference;
            }
            //空间关系
            query.spatialRelationship = qOptions.spatialRelationship;
            return query;
        }

    });
}

/*
接口名称：databaseQuery(万德全添加)
功能描述：查询数据库
方法名称：databaseQuery
必选参数：1.WebFunctionName  调用的WebService内方法的名称
          2.dataObj          调用的WebService内方法中所需要传递的参数
          3.resultFunction   调取数据成功触发的回调函数
方法默认使用Post方式请求、返回Json类型
*/
function dataBaseQuery(WebFunctionName, dataObj, resultFunction, resultParam) {
    $.ajax({
        type: "POST", //访问WebService使用Post方式请求
        contentType: "application/json;utf-8", //WebService 会返回Json类型
        url: "../../WebService.asmx/" + WebFunctionName,//调用WebService
        data: JSON.stringify(dataObj),
        dataType: 'json',
        async: false,
        success: function (data) {
            var newdata = eval(data.d);
            if (resultParam != null && resultParam != "") {
                resultFunction(newdata, resultParam);
            }
            else {
                resultFunction(newdata);
            }
        },
        error: function (msg) {
            alert(msg.responseText);
        }
    });
}
