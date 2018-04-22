'use strict';
const druglist=[
	{id:'1',name:'康泰克',price:'10.80',count:'2盒',amt:'21.6'},
	{id:'2',name:'感冒灵冲剂',price:'3.00',count:'20袋',amt:'60.00'},
	{id:'3',name:'老干妈油辣椒',price:'9.50',count:'2瓶',amt:'19.00'},
	{id:'4',name:'耳机',price:'56.00',count:'1.00',amt:'112.00'},
//	{id:'5',name:'果珍',price:'13.40',count:'1袋',amt:'13.40'},
//	{id:'6',name:'黄焖鸡米饭',price:'18.00',count:'1份',amt:'18.00'},
//	{id:'7',name:'馒头',price:'0.70',count:'5个',amt:'3.50'},
//	{id:'8',name:'葡萄糖注射液',price:'22.00',count:'1瓶',amt:'22.00'},
//	{id:'9',name:'针头',price:'3.00',count:'5个',amt:'15.00'},
];

module.exports = {

  'GET /api/ssm/client/demo/druglist': function (req, res) {
    setTimeout(function () {
      res.json({
        success: true,
        result: druglist,
      });
    }, 500);
  },
  
};
