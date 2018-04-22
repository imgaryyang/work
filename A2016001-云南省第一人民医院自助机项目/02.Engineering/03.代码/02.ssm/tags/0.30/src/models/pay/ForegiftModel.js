import dva from 'dva';
import { createForegiftOrder } from '../../services/ForegiftService';
import { getOrder } from '../../services/DepositService';

import printUtil from '../../utils/printUtil';
import baseUtil from '../../utils/baseUtil';
import eventUtil from '../../utils/eventUtil';
export default {

	namespace: 'foregift',

	state: {
		
		foregift:{
			order : {},
			settlement : {},
			records : [],
		},
		paychannel:null,
	},

	subscriptions: {},
	effects: {
		*createForegiftOrder({ payload, callback }, { select, call, put }) {//住院预交订单
			const baseInfo = yield select(state => state.patient.baseInfo);
			const foregift = yield select(state => state.foregift.foregift);
			
			const { order } = payload;
			console.info('创建住院预缴订单 ', order);
			var {data} = yield call(createForegiftOrder,order);
			if(data && data.success && data.result ){
				const newForegift = {...foregift,order : data.result};
				console.info('住院预缴订单创建成功 ', newForegift.order.id);
				yield put({
					type: 'setState',
					payload: { 
						foregift:newForegift
					}
				})
				if(callback)callback();
			}else{
				baseUtil.notice('创建住院预缴订单失败');
			}
		},
		*reloadForegiftOrder({ payload ,callback}, { select, call, put }) {
			const foregift = yield select(state => state.foregift.foregift);
			console.info("重新加载预存订单 ",getOrder,foregift.order);
			var {data} = yield call(getOrder,foregift.order.id);
			if(data && data.success){
				yield put({
	    			type: 'setState',
	    			payload: { foregift: {...foregift,order : data.result||foregift.order}}
	    		});
				if(callback)callback();
			}else {
				 baseUtil.error("预存订单查询失败！！"); 
			}
		},
		//门诊预存转住院预缴凭条打印
		*printForegift({ payload ,callback}, { select, call, put }){
		//foregift,patient,payment,frame,inpatient
			const order = yield select(state => state.foregift.foregift.order);
			const baseInfo = yield select(state => state.patient.baseInfo);
			const payment = yield select(state => state.payment);
			const inpatientInfo = yield select(state => state.inpatient.inpatientInfo);
			const machineInfo = yield select(state => state.frame.machine);
			/*console.info("order=",order);
			console.info("baseInfo=",baseInfo);
			console.info("inpatientInfo=",inpatientInfo);
			console.info("machineInfo=",machineInfo);*/
			try{
				printUtil.printForegift(order,baseInfo,inpatientInfo,machineInfo);
			}catch(e){
				baseUtil.error("打印机异常，门诊预存转住院预缴凭条失败！"); 
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
		"changeState"(state,{ payload}) {
			return {...state,...payload};
		},
		"reset"(state,{ payload}) {
			return {
				
				foregift:{
					order : {},
					settlement : {},
					records : [],
				},
				paychannel:null,
			};
		},
	},
};