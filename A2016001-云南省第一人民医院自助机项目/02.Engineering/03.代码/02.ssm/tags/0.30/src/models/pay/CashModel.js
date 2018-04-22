import dva from 'dva';
import moment from 'moment';
import { loadAccounts,loadRechareDetails,preRefund,refund,getCreditAmt } from '../../services/RefundService';
import baseUtil from '../../utils/baseUtil';
export default {

	namespace: 'cash',

	state: {
		orders:[],
		settles:[]
	},

	subscriptions: {},
	effects: {
		*loadSettles({ payload, callback }, { select, call, put }) {//本机器的现金结算单
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
		*loadOrders({ payload, callback }, { select, call, put }) {//本机器的现金订单
			const baseInfo = yield select(state => state.patient.baseInfo);
			var {data} = yield call(getCreditAmt,baseInfo);
			if(data && data.success){
				yield put({
					type: 'setState',
					payload: { 
						creditAmt:data.result||0,
					}
				})
			}
		},
		*printSettles({ payload, callback }, { select, call, put }) {//预存订单
			const baseInfo = yield select(state => state.patient.baseInfo);
			const { account } = payload;
		    var query = {
		    	patientNo:baseInfo.no,
		    	startTime:moment().subtract(50, 'days').format('YYYY-MM-DD')+" 00:00:00",
		    	endTime:moment().format('YYYY-MM-DD')+" 23:59:59",
		    	paymentWay:account.accType,
		    	account:account.accNo,
		    }
		    //accType    ;//账户类型 0：银行卡，1：支付宝 2：微信 
			//cardBank	  ;//卡所属银行
			//cardType   ;//卡类型 0：信用卡 1：非信用卡
			var {data} = yield call(loadRechareDetails,query);
			if(data && data.success && data.result ){
				console.info('查询可退款账户列表 ',  data.result);
				yield put({
					type: 'setState',
					payload: { 
						records:data.result||[],
						account:account,
					}
				})
				if(callback)callback();
			}else{
				//baseUtil.notice('查询可退款账户失败');
			}
		},
		*refund({ payload ,callback}, { select, call, put }){
			const baseInfo = yield select(state => state.patient.baseInfo);
			const account = yield select(state => state.refund.account);
			const record = yield select(state => state.refund.record);
			const { amt,limit } = payload;
			var hisOrder= {
				amount:amt,
				allowRefund:limit,
				
				patientNo:baseInfo.no,
				balance:baseInfo.balance,
				
				accountName:account.accName,
				account:account.accNo,
				cardType:account.cardType,
				cardBankCode:account.cardBank,
				paymentWay:account.accType,
				
				rechargeNumber:record.rechargeNumber||'0',
				outTradeNo:record.outTradeNo,
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
			}else{
				baseUtil.error('冻结账户金额失败');
				return;
			}
			
			console.info("准备退款", settlement);
			var {data:refundData} = yield call(refund, settlement);
			if(refundData && refundData.success && refundData.result ){
				var order = refundData.result||{};
				if( order.status == '0' ){
					baseUtil.error('退款成功', order);
				} else if( order.status == '5' ){
					baseUtil.error('退款已受理，请关注退款账户金额变化！ ', order);
				} else {
					baseUtil.error('退款失败');
					return;
				}
				yield put({
					type: 'setState',
					payload: { 
						order:order,
					}
				})
				if(callback)callback();
			}else{
				baseUtil.error('退款失败');
			}
		},
		*printRefund({ payload ,callback}, { select, call, put }) {
			//TODO 打印退款凭据
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
		"clear"(state,{ payload}) {
			return {
				accounts:[],
				account:{},
				records:[],
				record:{},
				limit:0,
				settlement:{},
				order:{},
			};
		},
		"changeState"(state,{ payload}) {
			return {...state,...payload};
		},
	},
};