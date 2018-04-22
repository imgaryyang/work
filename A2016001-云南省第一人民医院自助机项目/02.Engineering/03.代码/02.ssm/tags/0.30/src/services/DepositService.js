import ajax from '../utils/ajax';
import socket from '../utils/socket';
const _API_ROOT = "/api/ssm/treat/deposit";
/**
 * 开通预存
 * @Deprecated
 */
export async function depositOpen (param) {
  return ajax.GET(_API_ROOT + '/open',param);
}
/**
 * 开通预存
 * @Deprecated
 */
export async function getOrder (orderId) {
  return ajax.GET(_API_ROOT + '/order/get/'+orderId);
}

/**
 * 生成预存订单
 */
export async function buildRechargeOrder ( order ) {
  return ajax.POST(_API_ROOT + '/order/recharge',order);
}
/**
 * 生成预存结算单
 */
export async function createRechargeSettle ( settlement ) {
  return ajax.POST(_API_ROOT + '/settlement/recharge',settlement);
}
/**
 * 预存充值
 */
export async function depositRecharge ( order ) {
  return ajax.POST(_API_ROOT + '/recharge');
}


/******************************************************************************/



/**
 * 结算 socket执行
 */
export function depositConsume (order,machine) {// 0 失败  1  成功
	// return {data:{resultCode:0,recMsg:{state:0}}};
	if(order.bizType == '05'){//就诊卡支付
		try {
			console.info('准备扣除卡费 ', order.patientName);
			var response = socket.SEND('F^' + order.patientCardNo + '^' /*+ order.selfAmt+ '^'*/+ machine.hisUser + "^");
			console.info('扣除卡费返回 ',response);
			return response;		
		} catch (e) {
			console.info('扣除卡费异常 ',e);
			throw new Error('扣除卡费异常 ');
		}
	}else if(order.bizType == '06'){//建档费
		try {
			console.info('准备扣除建档费 ', order.patientName);
			var response = socket.SEND('E^' + order.patientCardNo + '^' + order.selfAmt+ '^'+ machine.hisUser + "^");
			console.info('扣除建档费返回 ',response);
			return response;		
		} catch (e) {
			console.info('扣除建档费异常 ',e);
			throw new Error('扣除建档费异常 ');
		}
	}else{//正常收费
		try {
			var msg ="C^"+order.patientCardNo+ "^"+ machine.hisUser + "^";
			console.info('准备结算 ', msg);
			var response = socket.SEND(msg);
			console.info('结算返回 ', response);
			return response;		
		} catch (e) {
			console.info('结算异常 ',e);
			throw new Error('结算异常 ');
		}
	}
}
/**
 * 支付卡费socket执行
 */
export async function cardPayAndIssue (card,order) {
  return ajax.POST(_API_ROOT + '/card/payAndIssue/'+order.id,card);
}
/**
 * 预存消费回调
 */
export async function consumeCallBack (order,status) {// 0 失败  1  成功
  return ajax.PUT(_API_ROOT + '/consume/'+order.id+"/"+status );
}
/**
 * 查询预存记录
 */
export async function rechargeRecords (patient) {
  return ajax.GET(_API_ROOT + '/records/recharge',patient);
}
/**
 * 查询消费记录
 */
export async function consumeRecords (patient) {
  return ajax.GET(_API_ROOT + '/records/consume',patient);
}
