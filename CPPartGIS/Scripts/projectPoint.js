(function(w) {
	w.initPage = function() {
		initMenu();
		initMap();
	}

	mugis.dataBaseQuery = function(ajaxUrl, dataObj, resultFunction, resultParam) {
		$.ajax({
			type: "POST",
			url: ajaxUrl,
			contentType: 'application/json',
			data: JSON.stringify(dataObj),
			dataType: 'json',
			async: true,
			success: function(data) {
				if (resultParam != null && resultParam != "") {
					resultFunction(data, resultParam);
				} else {
					resultFunction(data);
				}
			},
			error: function(msg) {
				alert(msg.responseText);
			}
		});
	}
	//初始化地图
	function initMap(){
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
	function addPtToMap(item,gLayer){
		console.log("经度是：" + item.projectLongitude + ";纬度是：" + item.projectLatitude);
		var point = new mapAPI.Point(item.projectLongitude,item.projectLatitude,map.spatialrefrence);
		var pms = new mapAPI.PictureMarkerSymbol(mapconfig.projectIcon,20,30);
		var infoWin = mapAPI.InfoTemplate("${projectName}",getInfoContent(item));
		var gra = new mapAPI.Graphic(point,pms,item,infoWin);
		gLayer.add(gra);
	}
	
	//获取气泡信息
	function getInfoContent(item){
		var contentHtml = "<div class=\"infodiv\"><table>";
		mapconfig.infoContentConfig.forEach(function(cfig){
			// contentHtml += "<tr><td>" + cfig.fieldLabel + "：${" + cfig.fieldName + "}</td></tr>";
			contentHtml += "<tr><td>" + cfig.fieldLabel + "：" + item[cfig.fieldName] + "</td></tr>";
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
