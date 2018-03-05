"use strict";
require('./ajax.jsx'); 
const AppRoutes = require('./appRoutes.jsx');
import Master from './pages/master.jsx';
//list原始数据转化为tree
let menusToTree=function(menus){
	let $modules=[],$menuMap={};
	menus.forEach(function (menu, index){
		menu.url = './pages'+menu.uri;
		menu.children=[];
		menu.isLeaf=true;//TODO 需要处理
		if(!menu.parent)$modules.push(menu);
		$menuMap[menu.id]=menu;
	}); 
	menus.forEach(function (menu, index){
		if(menu.parent){
			var parent = $menuMap[menu.parent];
			if(parent){
				parent.children.push(menu);
			}else{
				$modules.push(menu);
			}
		}
	});
	return $modules;
}
let menu2route = function(menu){
	return {
		url : menu.url,
		code : menu.code,
		name : menu.name,
		children:[],
		menu:menu
	}
}
//list原始数据转化为tree
let routesInit=function(treeMenu){
	let routes=[];
	treeMenu.forEach(function (module, index){
		let routeL0 = menu2route(module);
		module.path = routeL0.path ="/"+module.code;
		module.children.forEach(function (menu, index){
			let routeL1 = menu2route(menu);
			menu.path = routeL1.path = routeL0.path+"/"+routeL1.code;
			routeL0.children.push(routeL1)
			menu.children.forEach(function (subMenu, index){
				let routeL2 = menu2route(subMenu);
				subMenu.path = routeL2.path = routeL0.path+"/"+routeL2.code;
				routeL0.children.push(routeL2)
			})
		})
		routes.push(routeL0);
	})
	return routes;
}

ReactDOM.render(
	<Master route ={{modules:[]}}/>,
	document.getElementById('body')
);
Ajax.get(
	'/api/bdrp/org/optuser/privileges').then(res => {
		if(!(res&&res.length>0))res=[];
//		let modules = res; 
		let routes = routesInit(res); 
		ReactDOM.render(
			<AppRoutes routes={routes} modules={res}/>,
			document.getElementById('body')
		);
});

//var res = [
//   {
//     "id": "8a8c7da0554dbb4a01554dbb4a460000",
//     "icon": "icon",
//     "descp": "易健康医院端",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 5,
//     "name": "易健康医院端",
//     "parent": "8a8c7da455056c840155056c84d80000",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "elho",
//     "type": "0",
//     "uri": "/elh/hospital/main.jsx"
//   },
//   {
//     "id": "8a8c7da0554dbc7001554dbc70ff0000",
//     "icon": "icon",
//     "descp": "首页",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 5,
//     "name": "医院端首页",
//     "parent": "8a8c7da455056c840155056c84d80000",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "elhoHome",
//     "type": "0",
//     "uri": "/elh/hospital/main.jsx"
//   },
//   {
//     "id": "8a8c7da0554dbc7001554dbc70ff0001",
//     "icon": "icon",
//     "descp": "首页",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 5,
//     "name": "医院端医院信息维护",
//     "parent": "8a8c7da0554dbb4a01554dbb4a460000",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "elhoHospital",
//     "type": "0",
//     "uri": "/elh/hospital/main.jsx"
//   },
//   {
//     "id": "8a8c7da0554dbc7001554dbc70ff0002",
//     "icon": "icon",
//     "descp": "首页",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 5,
//     "name": "医院端移动门户维护",
//     "parent": "8a8c7da0554dbb4a01554dbb4a460000",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "elhoAppHome",
//     "type": "0",
//     "uri": "/elh/hospital/main.jsx"
//   },
//   {
//     "id": "8a8c7da0554dbc7001554dbc70ff0003",
//     "icon": "icon",
//     "descp": "首页",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 5,
//     "name": "医院端患者管理",
//     "parent": "8a8c7da0554dbb4a01554dbb4a460000",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "elhoPatient",
//     "type": "0",
//     "uri": "/elh/hospital/main.jsx"
//   },
//   {
//     "id": "8a8c7da0554dbc7001554dbc70ff0004",
//     "icon": "icon",
//     "descp": "首页",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 5,
//     "name": "医院端业务跟踪",
//     "parent": "8a8c7da0554dbb4a01554dbb4a460000",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "elhoBiz",
//     "type": "0",
//     "uri": "/elh/hospital/main.jsx"
//   },
//   {
//     "id": "8a8c7da0554dbc7001554dbc70ff0005",
//     "icon": "icon",
//     "descp": "首页",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 5,
//     "name": "医院端导诊",
//     "parent": "8a8c7da0554dbb4a01554dbb4a460000",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "elhoTreat",
//     "type": "0",
//     "uri": "/elh/hospital/main.jsx"
//   },
//   {
//     "id": "8a8c7da0554dbc7001554dbc70ff0006",
//     "icon": "icon",
//     "descp": "首页",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 5,
//     "name": "医院端结算管理",
//     "parent": "8a8c7da0554dbb4a01554dbb4a460000",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "elhoSettle",
//     "type": "0",
//     "uri": "/elh/hospital/main.jsx"
//   },
//   {
//     "id": "8a8c7da0554dbc7001554dbc70ff0007",
//     "icon": "icon",
//     "descp": "首页",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 5,
//     "name": "医院端结算统计",
//     "parent": "8a8c7da0554dbb4a01554dbb4a460000",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "elhoSettleStats",
//     "type": "0",
//     "uri": "/elh/hospital/main.jsx"
//   },
//   {
//     "id": "8a8c7da0554dbc7001554dbc70ff0008",
//     "icon": "icon",
//     "descp": "首页",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 5,
//     "name": "医院端运营统计",
//     "parent": "8a8c7da0554dbb4a01554dbb4a460000",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "elhoBizStats",
//     "type": "0",
//     "uri": "/elh/hospital/main.jsx"
//   },
//   {
//     "id": "8a8c7da0554dbc7001554dbc70ff0009",
//     "icon": "icon",
//     "descp": "首页",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 5,
//     "name": "医院端操作员管理",
//     "parent": "8a8c7da0554dbb4a01554dbb4a460000",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "elhoOperator",
//     "type": "0",
//     "uri": "/elh/hospital/main.jsx"
//   },
//   {
//     "id": "8a8c7da0554dbc7001554dbc70ff0010",
//     "icon": "icon",
//     "descp": "首页",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 5,
//     "name": "医院端权限管理",
//     "parent": "8a8c7da0554dbb4a01554dbb4a460000",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "elhoAuth",
//     "type": "0",
//     "uri": "/elh/hospital/main.jsx"
//   },
//   {
//     "id": "8a8c7da455056c840155056c84d80000",
//     "icon": "icon",
//     "descp": "易健康",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 2,
//     "name": "易健康",
//     "parent": null,
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "elh",
//     "type": "0",
//     "uri": "/elh/home.jsx"
//   },
//   {
//     "id": "8a8c7da455056c840155056c84d80001",
//     "icon": "icon",
//     "descp": "易薪宝",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 3,
//     "name": "易薪宝",
//     "parent": null,
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "els",
//     "type": "0",
//     "uri": "/els/home.jsx"
//   },
//   {
//     "id": "8a8c7da455056c840155056c84d80002",
//     "icon": "icon",
//     "descp": "易民生综合",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 1,
//     "name": "综合",
//     "parent": null,
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "el",
//     "type": "0",
//     "uri": "/el/home.jsx"
//   },
//   {
//     "id": "8a8c7da455056c840155056c84d80003",
//     "icon": "icon",
//     "descp": "易缴费",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 4,
//     "name": "易缴费",
//     "parent": null,
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "elp",
//     "type": "0",
//     "uri": "/elp/home.jsx"
//   },
//   {
//     "id": "8a8c7da455056c840155056c84d90000",
//     "icon": "icon",
//     "descp": "易健康",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 2,
//     "name": "易健康菜单组",
//     "parent": "8a8c7da455056c840155056c84d80000",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "elhg",
//     "type": "0",
//     "uri": "/elh/home.jsx"
//   },
//   {
//     "id": "8a8c7da455056c840155056c84d90001",
//     "icon": "icon",
//     "descp": "易薪宝",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 3,
//     "name": "易薪宝菜单组",
//     "parent": "8a8c7da455056c840155056c84d80001",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "elsg",
//     "type": "0",
//     "uri": "/els/home.jsx"
//   },
//   {
//     "id": "8a8c7da455056c840155056c84d90002",
//     "icon": "icon",
//     "descp": "易民生综合",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 1,
//     "name": "综合菜单组",
//     "parent": "8a8c7da455056c840155056c84d80002",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "elg",
//     "type": "0",
//     "uri": "/el/home.jsx"
//   },
//   {
//     "id": "8a8c7da455056c840155056c84d90003",
//     "icon": "icon",
//     "descp": "易缴费",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 4,
//     "name": "易缴费菜单组",
//     "parent": "8a8c7da455056c840155056c84d90003",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "elpg",
//     "type": "0",
//     "uri": "/elp/home.jsx"
//   },
//   {
//     "id": "8a8c7da4550573070155057307d30000",
//     "icon": "icon",
//     "descp": "易健康医院管理",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 5,
//     "name": "医院管理",
//     "parent": "8a8c7da455056c840155056c84d90000",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "hospital",
//     "type": "0",
//     "uri": "/elh/hospital/main.jsx"
//   },
//   {
//     "id": "8a8c7da4550573070155057307d30001",
//     "icon": "icon",
//     "descp": "易健康患者查询",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 6,
//     "name": "患者查询",
//     "parent": "8a8c7da455056c840155056c84d90000",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "patient",
//     "type": "0",
//     "uri": "/elh/patient/main.jsx"
//   },
//   {
//     "id": "8a8c7da4550573070155057307d30002",
//     "icon": "icon",
//     "descp": "易健康业务跟踪",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 7,
//     "name": "业务跟踪",
//     "parent": "8a8c7da455056c840155056c84d90000",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "treat",
//     "type": "0",
//     "uri": "/elh/treat/main.jsx"
//   },
//   {
//     "id": "8a8c7da4550573070155057307d30003",
//     "icon": "icon",
//     "descp": "易健康账单查询",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 8,
//     "name": "账单查询",
//     "parent": "8a8c7da455056c840155056c84d90000",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "bill",
//     "type": "0",
//     "uri": "/elh/bill/main.jsx"
//   },
//   {
//     "id": "8a8c7da4550573070155057307d30004",
//     "icon": "icon",
//     "descp": "易健康对账结算",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 9,
//     "name": "对账结算",
//     "parent": "8a8c7da455056c840155056c84d90000",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "check",
//     "type": "0",
//     "uri": "/elh/check/main.jsx"
//   },
//   {
//     "id": "8a8c7da4550573070155057307d30005",
//     "icon": "icon",
//     "descp": "易健康结算统计",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 10,
//     "name": "结算统计",
//     "parent": "8a8c7da455056c840155056c84d90000",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "elhSettleStats",
//     "type": "0",
//     "uri": "/elh/stats/settle.jsx"
//   },
//   {
//     "id": "8a8c7da4550573070155057307d30006",
//     "icon": "icon",
//     "descp": "易健康运营统计",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 11,
//     "name": "运营统计",
//     "parent": "8a8c7da455056c840155056c84d90000",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "elhBizStats",
//     "type": "0",
//     "uri": "/elh/stats/business.jsx"
//   },
//   {
//     "id": "8a8c7da4550573070155057307d30007",
//     "icon": "icon",
//     "descp": "易健康定点医院维护",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 12,
//     "name": "定点医院维护",
//     "parent": "8a8c7da455056c840155056c84d90000",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "designate",
//     "type": "0",
//     "uri": "/elh/designate/main.jsx"
//   },
//   {
//     "id": "8a8c7da4550573070155057307d30008",
//     "icon": "icon",
//     "descp": "易健康特色科室维护",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 21,
//     "name": "特色科室",
//     "parent": "8a8c7da455056c840155056c84d90000",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "specialDepartment",
//     "type": "0",
//     "uri": "/elh/specialDepartment/main.jsx"
//   },
//   {
//     "id": "8a8c7da4550573070155057307d30010",
//     "icon": "icon",
//     "descp": "易健康医院管理",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 5,
//     "name": "科室管理",
//     "parent": "8a8c7da455056c840155056c84d90000",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "department",
//     "type": "0",
//     "uri": "/elh/hospital/main.jsx"
//   },
//   {
//     "id": "8a8c7da4550573070155057307d30100",
//     "icon": "icon",
//     "descp": "易健康科室管理",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 5,
//     "name": "科室管理",
//     "parent": "8a8c7da455056c840155056c84d90000",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "department",
//     "type": "0",
//     "uri": "/elh/department/main.jsx"
//   },
//   {
//     "id": "8a8c7da4550573fd01550573fd4b0000",
//     "icon": "icon",
//     "descp": "易薪宝机构管理",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 13,
//     "name": "机构管理",
//     "parent": "8a8c7da455056c840155056c84d90001",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "elsOrg",
//     "type": "0",
//     "uri": "/els/org/main.jsx"
//   },
//   {
//     "id": "8a8c7da4550573fd01550573fd4b0001",
//     "icon": "icon",
//     "descp": "易薪宝业务监控",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 14,
//     "name": "业务监控",
//     "parent": "8a8c7da455056c840155056c84d90001",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "elsMonitor",
//     "type": "0",
//     "uri": "/els/monitor/main.jsx"
//   },
//   {
//     "id": "8a8c7da4550573fd01550573fd4b0002",
//     "icon": "icon",
//     "descp": "易薪宝业务统计",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 15,
//     "name": "业务统计",
//     "parent": "8a8c7da455056c840155056c84d90001",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "elsBizStats",
//     "type": "0",
//     "uri": "/els/stats/business.jsx"
//   },
//   {
//     "id": "8a8c7da4550573fd01550573fd4b0003",
//     "icon": "icon",
//     "descp": "易薪宝数据统计",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 16,
//     "name": "数据统计",
//     "parent": "8a8c7da455056c840155056c84d90001",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "elsDataStats",
//     "type": "0",
//     "uri": "/els/stats/main.jsx"
//   },
//   {
//     "id": "8a8c7da4550573fd01550573fd4b0004",
//     "icon": "icon",
//     "descp": "易薪宝人员管理",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 17,
//     "name": "人员管理",
//     "parent": "8a8c7da455056c840155056c84d90001",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "elsPer",
//     "type": "0",
//     "uri": "/els/person/main.jsx"
//   },
//   {
//     "id": "8a8c7da4550573fd01550573fd4b0005",
//     "icon": "icon",
//     "descp": "易薪宝发放明细",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 18,
//     "name": "发放明细",
//     "parent": "8a8c7da455056c840155056c84d90001",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "grant",
//     "type": "0",
//     "uri": "/els/pay/main.jsx"
//   },
//   {
//     "id": "8a8c7da4550573fd01550573fd4b0006",
//     "icon": "icon",
//     "descp": "易薪宝工资明细",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 19,
//     "name": "工资明细",
//     "parent": "8a8c7da455056c840155056c84d90001",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "stub",
//     "type": "0",
//     "uri": "/els/stub/main.jsx"
//   },
//   {
//     "id": "8a8c7da4550573fd01550573fd4b0007",
//     "icon": "icon",
//     "descp": "易薪宝工资明细模板",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 20,
//     "name": "工资明细模板",
//     "parent": "8a8c7da455056c840155056c84d90001",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "stubtemplate",
//     "type": "0",
//     "uri": "/els/stubtemplate/main.jsx"
//   },
//   {
//     "id": "8a8c7da4550573fd01550573fd4b0008",
//     "icon": "icon",
//     "descp": "易薪宝机构管理端首页",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 27,
//     "name": "首页",
//     "parent": "8a8c7da455056c840155056c84d90001",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "elsIndex",
//     "type": "0",
//     "uri": "/els/index/main.jsx"
//   },
//   {
//     "id": "8a8c7da4550573fd01550573fd4b0018",
//     "icon": "icon",
//     "descp": "易薪宝设置",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 77,
//     "name": "设置",
//     "parent": "8a8c7da455056c840155056c84d90001",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "elsSetting",
//     "type": "0",
//     "uri": "/els/setting/main.jsx"
//   },
//   {
//     "id": "8a8c7da45505745e015505745e770000",
//     "icon": "icon",
//     "descp": "专有app管理",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 21,
//     "name": "专有app管理",
//     "parent": "8a8c7da455056c840155056c84d90002",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "app",
//     "type": "0",
//     "uri": "/el/app/main.jsx"
//   },
//   {
//     "id": "8a8c7da45505745e015505745e770001",
//     "icon": "icon",
//     "descp": "综合用户管理",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 22,
//     "name": "综合用户管理",
//     "parent": "8a8c7da455056c840155056c84d90002",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "eluser",
//     "type": "0",
//     "uri": "/el/person/main.jsx"
//   },
//   {
//     "id": "8a8c7da45505745e015505745e770002",
//     "icon": "icon",
//     "descp": "运营统计",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 23,
//     "name": "运营统计",
//     "parent": "8a8c7da455056c840155056c84d90002",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "elBizStats",
//     "type": "0",
//     "uri": "/el/stats/business.jsx"
//   },
//   {
//     "id": "8a8c7da45505745e015505745e770003",
//     "icon": "icon",
//     "descp": "消息公告",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 24,
//     "name": "消息公告",
//     "parent": "8a8c7da455056c840155056c84d90002",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "message",
//     "type": "0",
//     "uri": "/el/message/main.jsx"
//   },
//   {
//     "id": "8a8c7da45505745e015505745e770004",
//     "icon": "icon",
//     "descp": "系统设置",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 25,
//     "name": "系统设置",
//     "parent": "8a8c7da455056c840155056c84d90002",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "setup",
//     "type": "0",
//     "uri": "/el/setup/setup.jsx"
//   },
//   {
//     "id": "8a8c7da45505745e015505745e770005",
//     "icon": "icon",
//     "descp": "公用",
//     "rid": "8a8c7da45505705a015505705a620000",
//     "sorter": 26,
//     "name": "公用",
//     "parent": "8a8c7da455056c840155056c84d90002",
//     "aid": "8a8c7da45505705a015505705a620000",
//     "code": "common",
//     "type": "0",
//     "uri": "/el/common/common.jsx"
//   }
//  ];
//let modules = menusToTree(res); 
//let routes = routesInit(modules); 
//ReactDOM.render(
//	<AppRoutes routes={routes} modules={modules}/>,
//	document.getElementById('body')
//);
//require("../styles/less/style.less");