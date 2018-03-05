'use strict';

var clinicChilren = [{  
	"name":"菜单a",  
	"code":"ma",
	"icon":"appstore", 
	"children":[
	    {"name":"菜单b","code":"mb","icon":"setting"},
        {"name":"菜单c","code":"mc","icon":"appstore"},
        {"name":"菜单d","code":"md","icon":"appstore"}
	 ]  
},{
	"name":"菜单e",
	"code":"me", 
	"icon":"appstore",
	"children":[
	    {"name":"菜单e","code":"me","icon":"appstore"}
	]
},{  
	"name":"测试",
	"code":"diagnosis",  
	"icon":"appstore" 
}];

var clinic={
	"name":"门 诊医生站",
	"code":"clinic",
	"icon":"appstore",
	"children":clinicChilren
}
var children3 = [
	            {"name":"菜单1","code":"m1","icon":"appstore","children":[
	            	            {"name":"菜单2","code":"m2","icon":"setting"},
	            	            {"name":"菜单3","code":"m3","icon":"appstore"},
	            	            {"name":"菜单4","code":"m4","icon":"appstore"}
	            	] 
	            },{ 
	            	"name":"菜单5","code":"m5","icon":"appstore",
	            	"children":[{"name":"菜单6","code":"m6","icon":"appstore"}] 
	            },{
	            	"name":"菜单7", "code":"m7", "icon":"appstore"
	            }] ;
var menus = [{   
	"name":"导航1", 
	"code":"m1",  
	"icon":"appstore" 
},clinic,{  
	"name":"导航3",  
	"code":"m3",
	"icon":"setting", 
	"children":children3
},{  
	"name":"导航4",  
	"code":"m4",  
	"icon":"appstore" 
},{  
	"name":"导航5",
	"code":"m5",   
	"icon":"appstore" 
},{   
	"name":"导航6",
	"code":"m6",   
	"icon":"alipay" 
},{    
	"name":"导航7", 
	"code":"m7", 
	"icon":"appstore"
}];
module.exports = {

  'GET /api/menu/list': function (req, res) {
    setTimeout(function () {
      res.json({
        success: true,
        result: menus,
      });
    }, 500);
  },
  
};
