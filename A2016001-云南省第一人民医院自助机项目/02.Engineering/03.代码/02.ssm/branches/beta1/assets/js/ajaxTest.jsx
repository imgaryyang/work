"use strict";
import LODAP from './utils/LodopFuncs.jsx';
import baseUtil from './utils/baseUtil.jsx';
import logUtil,{ log } from  "./utils/logUtil.jsx";
import patient from  "../json/patient.js";
import machine from  "../json/machine.js";
import payment from  "../json/payment.js";

var cashAmt = 0;
var bankAmt = 0;
var balance = 0;
function urlMap(url,config){
	var data = {success:false,result:null};
	if(patient[url]){
		data = patient[url];
	}else if(machine[url]){
		data = machine[url];
	}else if(payment[url]){
		data = payment[url];
	}
	if('/api/ssm/treat/patient/login' == url){
		data.result.balance = balance;
	}
	if('/api/ssm/payment/pay/preCreate' == url){
		var amt = config.data.amt;
		console.info('orderAmt',orderAmt);
		cashAmt = cashAmt+amt;
		var orderAmt = cashAmt;		
		data.result.amt = amt;
		data.result.order.realAmt = orderAmt;
		console.info('balance ',balance,'orderAmt : ',orderAmt);
	}
	if('/api/ssm/payment/pay/callback/cash/8a942adf5d4a3164015d4a8e82eb0004' == url){
		balance = balance+ cashAmt;
		data.result.order.realAmt = cashAmt;
	}
	if('/api/ssm/treat/deposit/order/get/8a942adf5d4a3164015d4a8d1dbc0003' == url){
		data.result.realAmt =  cashAmt;
		cashAmt= 0;
	}
	console.info('data ',data);
	return {
		then:function(cb){
			var res = cb(data);
			return {
				'catch':()=>{},
				then:(c)=>{
					c(res);
					return {'catch':()=>{}};	
				}
			};
		}
	}
}


/*******************************************************/
function request(config,options){
	var url = config.url;
	return urlMap(url,config);
}
function post(url,param,options){
	var config = {
		url: url,
		method: 'post',
		contentType: 'application/json',
		data: param?param:{},
		type: 'json',
	}
	return request(config,options);
}
function get(url,param,options){
	var config = {
		url: url,
		method: 'get',
		data: param?param:{},
		type: 'json',
	}
	return request(config,options);
}
function put(url,param,options){
	var config = {
		url: url,
		method: 'put',
		data: param?param:{},
		contentType: 'application/json',
		type: 'json',
	}
	return request(config,options);
}
function del(url,param,options){
	var config = {
		url: url,
		method: 'delete',
		data: param?param:{},
		type: 'json',
	}
	return request(config,options);
}
var ajax={
	request:request,
	post : post,
	put:put,
	get:get,
	del:del
};

window.Ajax=ajax; 
	
