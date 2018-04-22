import { notification } from 'antd';
import moment from 'moment';
import { loadRecords, loadPatient, loadCreditAmt, loadAccountDetails, dealRefund, dealRefundTrue} from '../../services/tran/DealRefundService';

export default {
  namespace: 'dealRefundTran',
  state: {
    spin: false,
    page: { total: 0, pageSize: 10, pageNo: 1 },
    query: {},
    data: [],
    account : {},
    patient: {},
    balance: '',
    creditAmt: 0,
    // 明细相关
    dealSpin: false,
    dealVisible: false,
    tranVisible: false,
    tranDetails: [],
    tranDetail: {},
    msg : '',
  },
  effects: {
    /**
     * 载入账号
     */
    *load({ payload }, { select, call, put }) {
      yield put({
        type: 'setState',
        payload: { spin: true },
      });
      const { data }  = yield call(loadRecords, payload);
      yield put({
	      type: 'setState',
	      payload: { spin: false },
      });
      if (data && data.success) {
    	  yield put({
    		  type: 'setState',
    		  payload: {
    			  data: data.result || [],
    			  query: payload,
    		  },
    	  });
      } else {
    	  console.log('错误提示');
    	  notification.info({ message: '提示：', description: data.msg });
      }
    },
	/**
	 * 查询病人信息
	 */
    *loadPatient({ payload }, { select, call, put }) {
    	const { account }  = payload;
    	var { data }  = yield call(loadPatient, {no: account.patientNo});
	    if (data && data.success) {
	    	 yield put({
	    		 type: 'setState',
	    		 payload: {
	    			 patient: data.result || {},
	    		 },
	    	 });
	     } else {
	    	 notification.info({ message: '提示：', description: data.msg });
	     }
    },
    /**
     * 获取病人信用卡充值信息
     */
    *loadCreditAmt({ payload }, { select, call, put }) {
    	const { account } = payload;
    	const { data } = yield call(loadCreditAmt , {no: account.patientNo});
    	if (data && data.success){
    		yield put({
        		type: 'setState',
        		payload: {
        			creditAmt: data.result || 0,
        		},
        	});
    	} else {
    		console.log('错误提示');
    		notification.info({ message: '提示：', description: data.msg });
    	}
    },
    /**
	 * 查询信用卡，支付宝，微信账户充值明细
	 */
	*loadAccountDetails({ payload }, { select, call, put }) {
		const { account } = payload;
		const querys = {
			patientNo:account.patientNo,
	    	startTime:moment().subtract(50, 'days').format('YYYY-MM-DD')+" 00:00:00",
	    	endTime:moment().format('YYYY-MM-DD')+" 23:59:59",
	    	paymentWay:account.accType,
	    	account:account.accId,
	    }
		const { data } = yield call(loadAccountDetails, querys);
		if(data && data.success) {
			yield put({
				type: 'setState',
				payload: {
					tranDetails: data.result || [],
				},
			});
		} else if(data && data.msg ) {
			notification.error({message: '错误',description:data.msg });
		} else {
			notification.error({message: '错误',description:'加载账户交易明细失败！' });
    	}
	},
    /**
     * 退款冻结
     */
	*dealRefund({ payload }, { select, call, put }) {
    	const {newValues, patient, account, tranDetail } = payload;
    	const param = {
			amount : newValues.amount,
			allowRefund : newValues.allowRefund,
			machineId : newValues.machineId,
			
			patientNo : patient.no,
			patientName : patient.name,
			balance : patient.balance,
			
			accountName : newValues.accountName||patient.name,
			account : account.accId,
			cardType : account.cardType,
			cardBankcode : account.cardBank,
			paymentWay : account.accType,
			
			rechargeNumber : tranDetail.rechargeNumber||'0',
			recharge : tranDetail.recharge||'0',
			outTradeNo : tranDetail.outTradeNo||'',
    	};
		var { data } = yield call(dealRefund, param);
		var settlement = {}
		if (data && data.success) {
			settlement = data.result || {}; 
		}else if(data && data.msg ){ 
    		notification.error({message: '错误',description:data.msg });
    	}else{
    		notification.error({message: '错误',description:'退款冻结失败,请核对后重试!'});
    	}
		var { data } = yield call(dealRefundTrue, settlement);
		if( data && data.success ) {
			var order = data.result || {}; 
			notification.success({message: '退款成功',description:`患者【${order.patientName}】退款【${order.amt}】成功！`});
			yield put({
				type: 'setState',
				payload: {
					dealVisible: false,
				},
			});
		}else if(data && data.msg ){
    		notification.error({message: '错误',description:data.msg });
    	}else{
    		notification.error({message: '错误',description:'退款银行处理失败,请核对后重试!'});
    	}
	},
  },
  reducers: {
    setState(oldState, { payload }) {
      return { ...oldState, ...payload };
    },
  },
};
