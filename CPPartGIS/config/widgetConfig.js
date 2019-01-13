var layerConfigs = [{
	dataType:"cljz",
	btnClass:" cljz_btn",
	layerId:"",
	group:[
		{
			searchType:"list",
			itemFunction:"selectFormat",
			defaultClass:"form-control ",
			divClass:"cljz_zt",
			searchField:{
				fieldlabel:"组团",
				fieldName:"SBDW"
			},
			selectOptions:[{
				label:"全部",
				value:""
			},{
				label:"科技园区",
				value:"科技园区"
			},{
				label:"未来科学城",
				value:"未来科学城"
			},{
				label:"生命科学园",
				value:"生命科学园"
			},{
				label:"昌发展",
				value:"昌发展"
			}]
		},
		{
			searchType:"numList",
			itemFunction:"selectFormat",
			defaultClass:"form-control ",
			divClass:"cljz_klymj",
			searchField:{
				fieldlabel:"可利用面积（万平方米）",
				fieldName:"KLYMJ"
			},
			selectOptions:[{
				label:"全部",
				value:""
			},{
				label:"＜1",
				value:"0-10000"
			},{
				label:"1-2",
				value:"10000-20000"
			},{
				label:"2-5",
				value:"20000-50000"
			},{
				label:"＞5",
				value:"50000-99999999999"
			}]
		},
		{
			searchType:"list",
			itemFunction:"selectFormat",
			defaultClass:"form-control ",
			divClass:"cljz_ghyt",
			searchField:{
				fieldlabel:"规划用途",
				fieldName:"GHYT"
			},
			selectOptions:[{
				label:"全部",
				value:""
			},{
				label:"综合",
				value:"综合"
			},{
				label:"工业",
				value:"工业"
			},{
				label:"商业",
				value:"商业"
			},{
				label:"办公",
				value:"办公"
			},{
				label:"商业、办公",
				value:"商业、办公"
			},{
				label:"商业、办公、住宅",
				value:"商业、办公、住宅"
			},{
				label:"文娱",
				value:"文娱"
			},{
				label:"生产",
				value:"生产"
			}]
		},{
			searchType:"numList",
			itemFunction:"selectFormat",
			defaultClass:"form-control ",
			divClass:"cljz_ckzj",
			searchField:{
				fieldlabel:"参考租金",
				fieldName:"CKZJ"
			},
			selectOptions:[{
				label:"全部",
				value:"",
			}]
		},{
			searchType:"text",
			defaultClass:"btn btn-primary ",
			divClass:"cljz_xmmc",
			itemFunction:"textFormat",
			searchField:{
				fieldlabel:"项目名称",
				fieldName:"XMMC"
			}
		}
	]
},{
	dataType:"cltd",
	btnClass:" cltd_btn",
	layerId:"",
	group:[
		{
			searchType:"list",
			itemFunction:"selectFormat",
			defaultClass:"form-control ",
			divClass:"cltd_zt",
			searchField:{
				fieldlabel:"组团",
				fieldName:"SBDW"
			},
			selectOptions:[{
				label:"全部",
				value:"",
			},{
				label:"科技园区",
				value:"科技园区",
			},{
				label:"未来科学城",
				value:"未来科学城",
			},{
				label:"生命科学园",
				value:"生命科学园",
			},{
				label:"昌发展",
				value:"昌发展",
			}]
		},{
			searchType:"numList",
			itemFunction:"selectFormat",
			defaultClass:"form-control ",
			divClass:"cltd_ydmj",
			searchField:{
				fieldlabel:"用地面积（公顷）",
				fieldName:"TDMJ"
			},
			selectOptions:[{
				label:"全部",
				value:"",
			},{
				label:"＜1",
				value:"0-10000",
			},{
				label:"1-2",
				value:"10000-20000",
			},{
				label:"2-5",
				value:"20000-50000",
			},{
				label:"5-10",
				value:"50000-10000",
			},{
				label:">10",
				value:"100000-99999999",
			}]
		},{
			searchType:"list",
			itemFunction:"selectFormat",
			defaultClass:"form-control ",
			divClass:"cltd_tdxz",
			searchField:{
				fieldlabel:"土地性质",
				fieldName:"TDXZ"
			},
			selectOptions:[{
				label:"全部",
				value:"",
			},{
				label:"工业",
				value:"工业",
			},{
				label:"研发",
				value:"研发",
			},{
				label:"科研",
				value:"科研",
			}]
		},{
			searchType:"list",
			itemFunction:"selectFormat",
			defaultClass:"form-control ",
			divClass:"cltd_ghyt",
			searchField:{
				fieldlabel:"规划用途",
				fieldName:"GHYT"
			},
			selectOptions:[{
				label:"全部",
				value:"",
			},{
				label:"医药健康产业",
				value:"医药健康产业",
			},{
				label:"生物药产业",
				value:"生物药产业",
			},{
				label:"智能装备",
				value:"智能装备",
			},{
				label:"高精尖产业",
				value:"高精尖产业",
			},{
				label:"生产厂房",
				value:"生产厂房",
			}]
		},{
			searchType:"number",
			defaultClass:"btn btn-primary ",
			divClass:"cltd_rjl",
			itemFunction:"numFormat",
			searchField:{
				fieldlabel:"容积率",
				fieldName:"RJL"
			}
		},{
			searchType:"text",
			defaultClass:"btn btn-primary ",
			divClass:"cltd_xmmc",
			itemFunction:"textFormat",
			searchField:{
				fieldlabel:"项目名称",
				fieldName:"XMMC"
			}
		}
	]
},{
	dataType:"njxm",
	btnClass:" njxm_btn",
	layerId:"",
	group:[
		{
			searchType:"list",
			itemFunction:"selectFormat",
			defaultClass:"form-control ",
			divClass:"njxm_zt",
			searchField:{
				fieldlabel:"组团",
				fieldName:"SBDW"
			},
			selectOptions:[{
				label:"全部",
				value:"",
			},{
				label:"科技园区",
				value:"科技园区",
			},{
				label:"未来科学城",
				value:"未来科学城",
			},{
				label:"生命科学园",
				value:"生命科学园",
			},{
				label:"昌发展",
				value:"昌发展",
			}]
		},{
			searchType:"numList",
			itemFunction:"selectFormat",
			defaultClass:"form-control ",
			divClass:"njxm_kzsmj",
			searchField:{
				fieldlabel:"可租售面积（平方米）",
				fieldName:"KLYMJ"
			},
			selectOptions:[{
				label:"全部",
				value:"",
			},{
				label:"＜5万",
				value:"0-50000",
			},{
				label:"5万-10万",
				value:"50000-100000",
			},{
				label:"10万-20万",
				value:"100000-200000",
			},{
				label:"＞20万",
				value:"200000-9999999999999",
			}]
		},
		{
			searchType:"list",
			itemFunction:"selectFormat",
			defaultClass:"form-control ",
			divClass:"njxm_ghyt",
			searchField:{
				fieldlabel:"规划用途",
				fieldName:"GHYT"
			},
			selectOptions:[{
				label:"全部",
				value:""
			},{
				label:"商业",
				value:"商业"
			},{
				label:"办公",
				value:"办公"
			},{
				label:"科研",
				value:"科研"
			},{
				label:"研发",
				value:"研发"
			},{
				label:"工业",
				value:"工业"
			},{
				label:"酒店",
				value:"酒店"
			},{
				label:"医药",
				value:"医药"
			},{
				label:"住宅",
				value:"住宅"
			},{
				label:"生产",
				value:"生产"
			}]
		},{
			searchType:"numList",
			itemFunction:"selectFormat",
			defaultClass:"form-control ",
			divClass:"njxm_ckzj",
			searchField:{
				fieldlabel:"参考租金",
				fieldName:"CKZJ"
			},
			selectOptions:[{
				label:"全部",
				value:"",
			}]
		},{
			searchType:"text",
			defaultClass:"btn btn-primary ",
			divClass:"njxm_xmmc",
			itemFunction:"textFormat",
			searchField:{
				fieldlabel:"项目名称",
				fieldName:"XMMC"
			}
		}
	]
},{
	dataType:"tdgy",
	btnClass:" tdgy_btn",
	layerId:"",
	group:[
		{
			searchType:"list",
			itemFunction:"selectFormat",
			defaultClass:"form-control ",
			divClass:"tdgy_zt",
			searchField:{
				fieldlabel:"组团",
				fieldName:"SBDW"
			},
			selectOptions:[{
				label:"全部",
				value:"",
			},{
				label:"科技园区",
				value:"科技园区",
			},{
				label:"未来科学城",
				value:"未来科学城",
			},{
				label:"生命科学园",
				value:"生命科学园",
			},{
				label:"昌发展",
				value:"昌发展",
			}]
		},
		{
			searchType:"numList",
			itemFunction:"selectFormat",
			defaultClass:"form-control ",
			divClass:"tdgy_tdmj",
			searchField:{
				fieldlabel:"土地面积（公顷）",
				fieldName:"TDMJ"
			},
			selectOptions:[{
				label:"全部",
				value:""
			},{
				label:"＜2",
				value:"0-2"
			},{
				label:"0-2",
				value:"0-2"
			},{
				label:"5-10",
				value:"5-10"
			},{
				label:"'＞10",
				value:"10-999999"
			}]
		},
		{
			searchType:"numList",
			itemFunction:"selectFormat",
			defaultClass:"form-control ",
			divClass:"tdgy_ghjzmj",
			searchField:{
				fieldlabel:"规划建筑面积（万平方米）",
				fieldName:"GHJZMJ"
			},
			selectOptions:[{
				label:"全部",
				value:""
			},{
				label:"＜5",
				value:"0-5"
			},{
				label:"5-10",
				value:"5-10"
			},{
				label:"10-20",
				value:"10-20"
			},{
				label:">20",
				value:"20-99999999999"
			}]
		},
		{
			searchType:"list",
			itemFunction:"selectFormat",
			defaultClass:"form-control ",
			divClass:"tdgy_ghyt",
			searchField:{
				fieldlabel:"规划用途",
				fieldName:"GHYT"
			},
			selectOptions:[{
				label:"全部",
				value:""
			},{
				label:"文化设施",
				value:"文化设施"
			},{
				label:"医疗卫生",
				value:"医疗卫生"
			},{
				label:"多功能用地",
				value:"多功能用地"
			},{
				label:"旅馆用地",
				value:"旅馆用地"
			},{
				label:"商业住宅",
				value:"商业住宅"
			},{
				label:"教育科研设计",
				value:"教育科研设计"
			},{
				label:"公建混合",
				value:"公建混合"
			},{
				label:"商业服务业",
				value:"商业服务业"
			}]
		},{
			searchType:"text",
			defaultClass:"btn btn-primary ",
			divClass:"tdgy_xmmc",
			itemFunction:"textFormat",
			searchField:{
				fieldlabel:"项目名称",
				fieldName:"XMMC"
			}
		}
	]
}]