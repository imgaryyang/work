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
		if(!menu.parentId)$modules.push(menu);
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

Ajax.get('/api/bdrp/org/optuser/privileges').then(res => {
	if(!(res&&res.length>0))res=[];
//	let modules = res; 
	let routes = routesInit(res); 
	ReactDOM.render(
		<AppRoutes routes={routes} modules={res}/>,
		document.getElementById('body')
	);
});
