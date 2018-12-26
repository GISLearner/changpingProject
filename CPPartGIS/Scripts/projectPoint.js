(function(w) {
	w.initPage = function() {
		initMenu();
		initMap();
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
	
	//初始化地图
	function initMap(){
		mapconfig.layerInfoConfigs.forEach(function(info){
			var lId = info.layerCode;
			var gLayer = new mapAPI.GraphicsLayer({id:lId});
			map.addLayer(gLayer);
		})
	}

	//初始化页面
	function initMenu() {
		$(".entSearch_text").keydown(function(e) {
			if (e.keyCode == 13) {
				searchEnt();
			}
		})
		$(".entSearch_btn").click(function() {
			searchEnt();
		})
	}
	
	//查询企业信息
	function searchEnt(){
		var text = $("#leftMenue .entSearch_text").val();
		var lyrConfigs = mapconfig.layerInfoConfigs;
		lyrConfigs.forEach(function(item){
			var layerWhere = item.nameField + " like '%" + text + "%'";
			mugis.layerAttSearch(item.layerId,layerWhere,null,function(e,params){
				console.log(e);
				console.log(params);
				addFeaToMap(e,params);
			},item)
		})
	}
	
	//点击单行
	w.showRowData = function(el){
		var rowStr = $(el).attr("data");
		var rowItem = JSON.parse(rowStr);
		map.infoWindow.setContent(getInfoContent(rowItem));
		map.infoWindow.setTitle(rowItem.projectName);
		var point = new mapAPI.Point(rowItem.projectLongitude,rowItem.projectLatitude,map.spatialrefrence);
		map.infoWindow.show(point);
		layerControl(rowItem.layerids);
	}
	
	//地图添加项目点位
	function addFeaToMap(e,feaConfig){
		var features = e.features;
		if(features.length == 0) return;
		var fms;
		var fields = e.fields;
		var lId = feaConfig.layerCode;
		var gLayer = map.getLayer(lId);
		if(e.geometryType == "esriGeometryPoint"){
			fms = new mapAPI.PictureMarkerSymbol(feaConfig.pointIcon,24,24);
		}
		var infoWin = mapAPI.InfoTemplate("${" + feaConfig.nameField + "}",getInfoContent(fields));
		features.forEach(function(fea){
			var gra = new mapAPI.Graphic(fea.geometry,fms,fea.attributes,infoWin);
			gLayer.add(gra);
		})
	}
	
	//获取气泡信息
	function getInfoContent(fields){
		var contentHtml = "<div class=\"infodiv\"><table>";
		fields.forEach(function(field){
			contentHtml += "<tr><td>" + field.alias + "：${" + field.name + "}</td></tr>";
		})
		contentHtml += "</table></div>";
		return contentHtml;
	}
	
	//清除临时图层
	function layerClear(){
		var gLayer = map.getLayer("projectLayer");
		if(gLayer) gLayer.clear();
	}

})(window)
