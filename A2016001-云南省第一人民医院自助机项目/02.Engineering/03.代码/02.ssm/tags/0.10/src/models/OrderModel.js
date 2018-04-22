import dva from 'dva';
import { loadOrderList, prepaidCash, prepaid, inpatientPrepaid, paid, loadNeedPay, miPreSettlement, miSettlement, goToPay, accountPay } from '../services/OrderService';
import moment from 'moment';

export default {

	namespace: 'order',

	state: {

		needPayList: [],		//所有代缴费账单
		needPayListLoaded: false,
		selectedIds: '',
		selectedTotalAmt: 0,
		selectedBills: [],	//被选择的缴费账单

		orderBrief: {},
		orderPreSettlement: null,

		orders: [],
		order: null,

		/*
		order: {
			Id: '',
			OrderCode: '',
			OrderType: '',
			OrderTypeName: '',
			OrderType1: '',
			OrderTypeName1: '',
			OrderDesc: '',
			Amt: 0,
			CreatedDate: '',
			MIPaid: 0, //medical insurance 医保报销
			MIPAPaid: 0, //medical insurance personal account 医保个人账户
			SelfPaid: 0, //自付
			PaidType: '',
			PaidTypeName: '',
			PaidDate: '',
			State: '',
			Settlements: [ //结算单
				{
					Id: '',
					SettlementCode: '',
					SettlementType: '',
					SettlementTypeName: '',
					Amt: 0,
					CreatedDate: '',
					PaidDate: '',
					State: '',
				}
			]
		}
		*/
	},

	//订阅
	subscriptions: {
	},

	//远程请求
	effects: {

		/**
		 * 查询订单明细
		 */
    * loadOrderList ({ payload }, { select, call, put }) {
    	const {data} = yield call(loadOrderList);
    	if (data && data.success ) {
    		yield put({
	  			type: 'setState',
	  			payload: {
	  				orders: data.result,
	  				ordersLoaded: true,
	  			},
	      })
      }
    },

		/**
		 * 预存现金
		 */
    * prepaidCash ({ payload }, { select, call, put }) {
    	const {data} = yield call(prepaidCash, payload);
    	if (data && data.success ) {
    		yield put({
	  			type: 'setState',
	  			payload: {
	  				order: data.result,
	  			},
	      })
      }
    },

		/**
		 * 其它渠道预存
		 */
    * prepaid ({ payload }, { select, call, put }) {
    	const {data} = yield call(prepaid, payload);
    	console.log(data);
    	if (data && data.success ) {
    		yield put({
	  			type: 'setState',
	  			payload: {
	  				order: data.result,
	  			},
	      })
      }
    },

		/**
		 * 住院预缴
		 */
    * inpatientPrepaid ({ payload }, { select, call, put }) {
    	const {data} = yield call(inpatientPrepaid, payload);
    	console.log(data);
    	if (data && data.success ) {
    		yield put({
	  			type: 'setState',
	  			payload: {
	  				order: data.result,
	  			},
	      })
      }
    },

		/**
		 * 查询待缴费账单
		 */
    * loadNeedPay ({ payload }, { select, call, put }) {
    	const {data} = yield call(loadNeedPay);
    	if (data && data.success ) {
    		let ids = '', total = 0;
    		for (let i = 0 ; i < data.result.length ; i++) {
					ids += data.result[i]['PrescriptionId'] + ';';
					total += data.result[i]['TotalAmt'];
    		}

    		yield put({
	  			type: 'setState',
	  			payload: {
	  				needPayList: data.result,
	  				needPayListLoaded: true,
	  				selectedIds: ids,
	  				selectedTotalAmt: total,
	  			},
	      })
      }
    },

		/**
		 * 医保预结算
		 */
    * miPreSettlement ({ payload }, { select, call, put }) {

		    
	    const theState = yield select(state => state.order);
  		let { needPayList, selectedIds, selectedBills, orderBrief, orderPreSettlement } = theState;

  		selectedBills = [], orderBrief = {}, orderPreSettlement = {};
	    let ids = selectedIds.substr(0, selectedIds.length - 1).split(';');
			//console.log(selectedBills, selectedIds);
	    for (let i = 0 ; i < ids.length ; i++) {
	      for (let j = 0 ; j < needPayList.length ; j++) {
	        if (ids[i] == needPayList[j]['PrescriptionId']) {
	          selectedBills.push(needPayList[j]);
	          //constrct bill brief
	          let typeName = needPayList[j]['TypeName'];
	          if (orderBrief[typeName])
	            orderBrief[typeName] = orderBrief[typeName] + needPayList[j]['TotalAmt'];
	          else
	            orderBrief[typeName] = needPayList[j]['TotalAmt'];

	          orderBrief['TotalAmt'] = (orderBrief['TotalAmt'] ? orderBrief['TotalAmt'] : 0) + needPayList[j]['TotalAmt'];

	          break;
	        }
	      }
	    }

    	const {data} = yield call(miPreSettlement, {
    		Amt: orderBrief['TotalAmt']
    	});
    	//console.log('yield call(miPreSettlement):', data);

    	if (data && data.success ) {
    		yield put({
	  			type: 'setState',
	  			payload: {
	  				selectedBills: selectedBills,
		        orderBrief: orderBrief,
		        orderPreSettlement: data.result,
	  			},
	      })
      }
    },

		/**
		 * 医保结算
		 */
    * miSettlement ({ payload }, { select, call, put }) {
    	const {data} = yield call(miSettlement, payload);
    	console.log(data);
    	if (data && data.success ) {
    		yield put({
	  			type: 'setState',
	  			payload: {
	  				order: data.result,
	  			},
	      })
      }
    },

    * accountPay ({ payload }, { select, call, put }) {

    	const theState = yield select(state => state.order);
  		let { orderBrief, orderPreSettlement } = theState;

    	const {data} = yield call(accountPay, {
    		Amt: orderPreSettlement.Amt,
    		type: payload.type,
    	});
    	console.log('order.accountPay():', data);
    	if (data && data.success ) {
    		yield put({
	  			type: 'setState',
	  			payload: {
	  				order: data.result,
	  			},
	      })
      }
    },

		/**
		 * 支付
		 */
    * goToPay ({ payload }, { select, call, put }) {

    	const theState = yield select(state => state.order);
  		let { orderBrief, orderPreSettlement } = theState;

    	const {data} = yield call(goToPay, {
    		Amt: orderPreSettlement.Amt,
    		type: payload.type,
    		typeName: payload.typeName,
    	});
    	console.log('order.goToPay():', data);
    	if (data && data.success ) {
    		yield put({
	  			type: 'setState',
	  			payload: {
	  				order: data.result,
	  			},
	      })
      }
    },

		/**
		 * 支付完成
		 */
    * paid ({ payload }, { select, call, put }) {
    	const {data} = yield call(paid, payload);
    	console.log(data);

    	if (data && data.success ) {
    		const theState = yield select(state => state.order);
    		let order = theState.order;
				//临时前端计算，正式版本从后台取
				let settlement = null, selfPaidIdx = 0;
		    for (let i = 0 ; order && i < order['Settlements'].length ; i++) {
		      if (order['Settlements'][i]['PaidType'] == 'MI' || order['Settlements'][i]['PaidType'] == 'PA')
		        order['Settlements'][i]['State'] = '2';
		      else {
		      	settlement = order['Settlements'][i];
		      	selfPaidIdx = i;
		      }
		    }
				order.PaidType = settlement.PaidType;
				order.PaidTypeName = settlement.PaidTypeName;
				order.SelfPaid = settlement.Amt;
				order.State = '2';
				order.PaidDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss SSS');

				settlement.State = '2';
				settlement.PaidDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss SSS');

				order.Settlements.splice(selfPaidIdx, 1, settlement);

    		yield put({
	  			type: 'setState',
	  			payload: {
	  				order: order,
	  			},
	      })

      }
    },

	},

	//处理state
	reducers: {

		/**
		 * 通用setState
		 */
		setState (state, {payload}) {
			let {...props} = payload;
			return {
				...state, 
				...props,
			};
		},

	},
};




