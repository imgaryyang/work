import socket from '../utils/socket';
import ajax from '../utils/ajax';
const _API_ROOT = "/api/ssm/treat/fee";



/**
 * 生成缴费订单
 */
export async function createFeeOrder(order) {
	return ajax.POST(_API_ROOT + '/createOrder',order);
}

/**
 * 查询代缴费项
 */
export async function loadFees(patient,machine) {
	
	var msg = "A^" + patient.medicalCardNo + "^"+ machine.hisUser + "^";
	return socket.SEND(msg);
	
//	var response =  socket.SEND('D^');
//	console.info('测试读取医保卡 ',response);
//	
//	var response =  socket.SEND('E^00018998646896156303^4.5^');
//	console.info('测试读取医保卡 ',response);
	
//	var msg = "A^00018998646896156303^";
//	var response =  socket.SEND(msg);
//	console.info('列表', response);
//	return response;
	
	
//	var res = {"resultCode":0,"recMsg":[{"zh":"1","mc":"氢化可的松","dj":"0.8600","sl":"1","cs":"1","kzjb":"","yzsj":"2017-05-03 15:00:05","ysid":"8798","kzjbmc":"甲类","ysxm":"孙桢","ksmc":"心脏大血管外科","ksid":"35","flmmc":""},{"zh":"1","mc":"5%葡萄糖","dj":"4.4000","sl":"1","cs":"1","kzjb":"","yzsj":"2017-05-03 15:00:05","ysid":"8798","kzjbmc":"甲类","ysxm":"孙桢","ksmc":"心脏大血管外科","ksid":"35","flmmc":""},{"zh":"1","mc":"对乙酰氨基酚","dj":"15.0830","sl":"1","cs":"1","kzjb":"","yzsj":"2017-05-03 15:00:05","ysid":"8798","kzjbmc":"自费","ysxm":"孙桢","ksmc":"心脏大血管外科","ksid":"35","flmmc":""},{"zh":"1","mc":"布洛芬","dj":"11.6300","sl":"1","cs":"1","kzjb":"","yzsj":"2017-05-03 15:00:05","ysid":"8798","kzjbmc":"自费","ysxm":"孙桢","ksmc":"心脏大血管外科","ksid":"35","flmmc":""}]}
//	return {data : res };
}

/**
 * 预结算
 */
export function prepaied (patient,groups,machine) {
	groups = groups||[];
	var gMsg = '';
	for(var g of groups){
		gMsg = gMsg +g+'^';
	}
	var msg = "B^" +  patient.medicalCardNo +'^'+ gMsg+ machine.hisUser + "^";
	var result = socket.SEND(msg);
	console.info('预结算返回 ', result);
	return result;
	
//	console.info('groups ',groups);
//	groups = groups||[];
//	var gMsg = '';
//	for(var g of groups){
//		gMsg = gMsg +g+'^';
//	}
//	var msg = "B^00018998646896156303^"+ gMsg;
//	console.info('预结算 ', msg);
//	var result = socket.SEND(msg);
	
	
	//var response = {"resultCode":0,"recMsg":{"state":"0","knsj":"00018998646896156303","yczf":"106","jzje":"10","zfje":"5","jmje":"0"}};
	// var result = {data:response};
	
//	return result;
}

/**
 * 支付 没用到，该接口在depositService调用
 */
export async function payFees (patient,machine) {
	
	var msg = "C^"+patient.medicalCardNo+"^"+ machine.hisUser + "^";;
	return socket.SEND(msg)
}