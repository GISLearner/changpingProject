$(function(){
	//表格初始化
	mugis.initTable = function(ele,columns,datas,options){
		$(ele).bootstrapTable('destroy'); 
		var tableParams = {
			columns:columns,
			data:datas,
			pagination:true,
		}
		if(options){
			if(options.width){
				tableParams.width = options.width;
			}
			if(options.height){
				tableParams.height = options.height;
			}
			if(options.onClickRow){
				tableParams.onClickRow = options.onClickRow;
			}
		}
		$(ele).bootstrapTable(tableParams);
	}
	//属性查询
	mugis.layerAttSearch = function(layerId, searchWhere, geo,resultFunction, resultParam) {
		var queryTask = new mapAPI.QueryTask(mapconfig.vectorMapServerUrl + "/" + layerId);
		var query = new mapAPI.Query();
		query.outFields = ["*"];
		if(geo){
			query.geometry = geo;
		}
		query.where = searchWhere;
		query.returnGeometry = true;
		queryTask.execute(query,function(e){
			if(resultParam){
				resultFunction(e,resultParam);
			}else{
				resultFunction(e);
			}
		},function(error){
			console.log(error);
		})
	}
})