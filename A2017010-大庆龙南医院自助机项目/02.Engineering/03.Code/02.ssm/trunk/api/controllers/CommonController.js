/**
 * CommonController
 *
 * @description :: Server-side logic for managing commons
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var rest = require('../services/restUtil.js');
module.exports = {
		
  forLogin :function(req, res){
	  
  },
  forLogout : function(req, res){
	  
  },
  dispath : function(req, res){
	  var params={},p=req.allParams();
	  var path = '/'+p['0']; 
	  for(var i in p){
		  console.info(i);
		  if(i != '0')params[i]=p[i]
	  }
	  delete params[0];
	  var callback = function(data){
		  if('string'==(typeof data)){
			  try{
				  res.json(JSON.parse(data));
			  }catch(e){
				  res.json({error:'解析json出错'}); 
			  }
		  }else{
			  res.json({error:'返回数据出错'}); 
		  }
	  }
	  if('GET' == req.method)rest.get(path,params,callback);
	  if('POST' == req.method)rest.post(path,params,callback);
	  if('DELETE' == req.method)rest.del(path,params,callback);
	  if('PUT' == req.method)rest.put(path,params,callback);
	  //return 
  },
  

  /**
   * `CommonController.menus()`
   */
  menus: function (req, res) {
	  	var simorgauthz = {
			code : "simorgauthz",
			icon : "",
			id : "00000000000000000000000000080000",
			name : "组织机构",
			url : "bdrp/deptmain.html",
			children:[]
		};
  		var orgmgr = {
			id : "00000000000000000000000000080200",
			name : "机构管理",
			code : "orgmgr",
			icon : "",
			url : "./pages/org/main.jsx"
		};
  		var postmgr = {
			code : "postmgr",
			icon : "",
			id : "00000000000000000000000000080100",
			name : "职位管理",
			url : "bdrp/org/post/main.html"
		};
  		var depmgr = {
			id : "00000000000000000000000000080800",
			code : "depmgr",
			name : "部门管理",
			icon : "",
			url : "bdrp/org/dep/main.html"
		};
  		var permgr =  {
			code : "permgr",
			icon : "",
			id : "00000000000000000000000000080900",
			name : "人员管理",
			url : "./pages/person/main.jsx"
		};
  		var doctor =  {
			code : "doctor",
			icon : "",
			id : "00000000000000000000000000080900",
			name : "医生管理",
			url : "./pages/doctor/main.jsx"
		};
  		
  		simorgauthz.children = [orgmgr,postmgr,depmgr,permgr,doctor];
  		
  		var authority={
			code : "authority",
			icon : "",
			id : "00000000000000000000000000010000",
			name : "权限管理",
			url : ""
  		};
		var funmgr = {
			code : "funmgr",
			icon : "",
			id : "00000000000000000000000000080300",
			name : "功能管理",
			url : "bdrp/auth/function/main.html"
		};
		var svcmgr = {
			code : "svcmgr",
			icon : "",
			id : "00000000000000000000000000080400",
			name : "授权管理",
			url : "bdrp/auth/access/main.html"
		};
		var pubrlm = {
			code : "pubrlm",
			icon : "",
			id : "00000000000000000000000000080500",
			name : "公共角色",
			url : "bdrp/rolemain.html"
		};
		var menumgr = {
			code : "menumgr",
			icon : "",
			id : "00000000000000000000000000080600",
			name : "菜单管理",
			url : "bdrp/auth/menu/main.html"
		};
		var rolemgr = {
			code : "rolemgr",
			icon : "",
			id : "00000000000000000000000000080700",
			name : "角色管理",
			url : "bdrp/org/role/main.html"
		};
		var stubmgr = {
			code : "stubmgr",
			icon : "",
			id : "00000000000000000000000000080800",
			name : "工资明细",
			url : "./pages/stub/main.jsx"
		};
			var stubmgr = {
			code : "stubmgr",
			icon : "",
			id : "00000000000000000000000000080800",
			name : "人员管理",
			url : "./pages/els/person/main.jsx"
		};
		authority.children = [funmgr,svcmgr,pubrlm,menumgr,rolemgr,stubmgr];
		//{ path: '/button', text: 'Button',page:'./pages/button.jsx'},
		var elh={
				code : "elh",
				icon : "",
				id : "10000000000000000000000000080700",
				name : "易健康",
				url : "./pages/elh.jsx"	
		}
		elh.children=[simorgauthz];
		var els={
				code : "els",
				icon : "",
				id : "10000000000000000000000000080701",
				name : "易薪宝",
				url : "./pages/els.jsx"
		}
		els.children=[authority];
		var common={
				code : "common",
				icon : "",
				id : "10000000000000000000000000080702",
				name : "综合",
				url : "./pages/elh.jsx"
		}
		return res.json([elh,els]);
  }

};

