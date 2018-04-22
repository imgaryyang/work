import ajax from '../utils/ajax';
import socket from '../utils/socket';
const _API_ROOT = "/api/ssm/treat/patient";

/**
 * 查询账户基本信息
 * @Deprecated
 */
export async function loadAcctInfo () {
  return ajax.GET(_API_ROOT + '/info');
}
/**
 * 查询患者编号
 * @Deprecated
 */
export async function loadPatientNo (param) {
  return ajax.GET(_API_ROOT + '/no',param);
}

/**
 * 查询患者基本信息
 */
export async function patientInfo (param) {
  return ajax.GET(_API_ROOT + '/info',param);
}
/**
 * 查询患者基本信息
 */
export async function patientLoginInfo (param) {
  return ajax.GET(_API_ROOT + '/loginInfo',param);
}
/**
 * 患者登录
 */
export async function patientLogin (param) {
  return ajax.POST(_API_ROOT + '/login',param);
}
/**
 * 建立档案
 */
export async function profileCreate (param) {
  return ajax.POST(_API_ROOT + '/profile/create',param);
}
/**
 * 开通预存
 * @Deprecated
 */
export async function depositOpen (param) {
  return ajax.GET(_API_ROOT + '/deposit/open',param);
}
/**
 * 发卡
 */
export async function cardIssue (param) {
  return ajax.POST(_API_ROOT + '/card/issue',param);
}
/**
 * 支付并发卡
 * @Deprecated
 */
export async function cardPayAndIssue (card,order) {
  return ajax.POST(_API_ROOT + '/card/payAndIssue/'+order.id,card);
}
/**
 * 创建卡费订单
 */
export async function cardOrder(param) {
  return ajax.POST(_API_ROOT + '/card/order',param);
}
/**
 * 创建补卡订单
 */
export async function cardReissueOrder(param) {
  return ajax.POST(_API_ROOT + '/card/order/reissue',param);
}
/**
 * 患者登出
 */
export async function patientLogout () {
  return ajax.POST(_API_ROOT + '/logout');
}
/**
 * 绑定医保卡 socket通信
 */
export function bindMiCard (param) {
	console.info('进入函数 bindMiCard ',param);
	
	const {relationCard, relationType} =param;
	if(relationCard && relationType == '01' ){
		console.info('已经绑定过，不再绑定');//
		return {data:{resultCode:'0',recMsg:{state:'0'}}};
	}
	
  //1 自费卡号 2 操作者id 3 医保卡内数据 4 医保个人编号 5 医保单位代码 6 身份证号
  const { medicalCardNo,hisUser,knsj, grbh,dwdm,sfzh}= param;
  var req = "G^"+ medicalCardNo+"^"+ hisUser+"^"+ knsj+"^"+  grbh+"^"+ dwdm+"^"+sfzh+"^";
  console.info('进入函数  SEND ',req);
  return socket.SEND(req);
}