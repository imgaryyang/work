import dva from 'dva';
import moment from 'moment';
import { loadAccounts,loadRechareDetails,preRefund,refund,getCreditAmt } from '../../services/RefundService';
import printUtil from '../../utils/printUtil';
import baseUtil from '../../utils/baseUtil';
import eventUtil from '../../utils/eventUtil';
export default {

	namespace: 'refund',

	state: {
		accounts:[],
		account:{},
		records:[],
		record:{},
		limit:0,
		settlement:{},
		order:{},
		creditAmt:0,
	},

	subscriptions: {},
	effects: {
		*loadAccounts({ payload, callback }, { select, call, put }) {//预存订单
			const baseInfo = yield select(state => state.patient.baseInfo);
			var {data} = yield call(loadAccounts,baseInfo);
			if(data && data.success && data.result ){
				console.info('查询可退款账户列表 ',  data.result);
				yield put({
					type: 'setState',
					payload: { 
						accounts:data.result||[]
					}
				})
				if(callback)callback();
			}else{
				//baseUtil.notice('查询可退款账户失败');
			}
		},
		*getCreditAmt({ payload, callback }, { select, call, put }) {//信用卡金额
			const baseInfo = yield select(state => state.patient.baseInfo);
			const { account }= payload;
			var {data} = yield call(getCreditAmt,baseInfo);
			if(data && data.success){
				yield put({
					type: 'setState',
					payload: { 
						creditAmt:data.result||0,
						account
					}
				})
			}
		},
		*loadRechareDetails({ payload, callback }, { select, call, put }) {//预存订单
			const baseInfo = yield select(state => state.patient.baseInfo);
			const { account } = payload;
			//只允许查询50天内交易记录
			//TODO页面提醒
		    var query = {
		    	patientNo:baseInfo.no,
		    	startTime:moment().subtract(50, 'days').format('YYYY-MM-DD')+" 00:00:00",
		    	endTime:moment().format('YYYY-MM-DD')+" 23:59:59",
		    	paymentWay:account.accType,
		    	account:account.accId,
		    }
		    //accType    ;//账户类型 0：银行卡，1：支付宝 2：微信 
			//cardBank	 ;//卡所属银行
			//cardType   ;//卡类型 0：信用卡 1：非信用卡
			var {data} = yield call(loadRechareDetails,query);
			console.info('查询可退款账户列表 ',  data.result);
			yield put({
				type: 'setState',
				payload: { 
					records: data.result||[],
					account:account,
				}
			})
			if(callback) callback();
		},
		*refund({ payload ,callback}, { select, call, put }){
			const baseInfo = yield select(state => state.patient.baseInfo);
			const account = yield select(state => state.refund.account);
			const record = yield select(state => state.refund.record);
			const { amt,limit } = payload;
			var hisOrder = {
				amount:amt,
				allowRefund:limit,
				
				patientNo:baseInfo.no,
				patientName:baseInfo.name,
				balance:baseInfo.balance,
				
				accountName:account.accName || baseInfo.name,
				account:account.accId,
				cardType:account.cardType,
				cardBankCode:account.cardBank,
				paymentWay:account.accType,
				
				rechargeNumber:record.rechargeNumber||'0',
				recharge:record.recharge||'0',
				outTradeNo:record.outTradeNo||'',
			}
			console.info('冻结余额', hisOrder);
			var settlement = {};
			var {data:preData} = yield call(preRefund,hisOrder);
			if(preData && preData.success && preData.result ){
				settlement =  preData.result||{};
				console.info('冻结成功', settlement);
				yield put({
					type: 'setState',
					payload: { 
						settlement:settlement,
					}
				})
				if(callback)callback();
			} else{
				baseUtil.error('冻结账户金额失败，请联系运维人员或者到人工窗口处理！');
				return;
			}
			
			console.info("准备退款", settlement);
			var {data:refundData} = yield call(refund, settlement);
			if(refundData && refundData.success && refundData.result ){
				var order = refundData.result||{};
				if( order.status == '5' ){
					baseUtil.error('退款已受理，请关注退款账户金额变化！ ', order);
				} else if(order.status == 'A' || order.status == '3' || order.status == '6' || order.status == '9'){
					//初始化，业务交易失败，退款失败状态，交易关闭提示退款失败。
					baseUtil.error('退款失败', order);
				} else if(order.status == 'E'){
					//渠道异常
					baseUtil.error('退款异常，请联系维护人员或者到人工窗口处理！', order);
				}
				yield put({
					type: 'setState',
					payload: { 
						order: order,
					}
				})
				if(callback)callback();
			}else{
				baseUtil.error('退款失败');
			}
		},
		*printRefund({ payload ,callback}, { select, call, put }) {
			//TODO 打印退款凭据
			const { baseInfo,order,settlement } = payload;
			const machineInfo = yield select(state => state.frame.machine);
			try{
				console.info("baseInfo=",baseInfo);
				console.info("order=",order);
				console.info("settlement=",settlement);
				console.info("machineInfo=",machineInfo);
				printUtil.printRefundReceipt(settlement,order,baseInfo,machineInfo);
			}catch(e){
				baseUtil.error("打印机异常，打印退款凭证失败"); 
			}
		},
	    *setState({ payload ,callback}, { select, call, put }) {
	    	yield put({
    			type: 'changeState',
    			payload: payload
    		});
	    	if(callback)callback();
		},
	},
	reducers: {
		"reset"(state,{ payload}) {
			return {
				accounts:[],
				account:{},
				records:[],
				record:{},
				limit:0,
				settlement:{},
				order:{},
				creditAmt:0,
			};
		},
		"changeState"(state,{ payload}) {
			return {...state,...payload};
		},
	},
};