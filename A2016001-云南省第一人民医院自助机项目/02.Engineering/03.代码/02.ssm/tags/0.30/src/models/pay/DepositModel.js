import dva from 'dva';
import { depositConsume,consumeCallBack, rechargeRecords,consumeRecords,buildRechargeOrder,getOrder } from '../../services/DepositService';
import { cardOrder,cardReissueOrder } from '../../services/PatientService';
import { loadFees,prepaied,createFeeOrder } from '../../services/FeeService';
import printUtil from '../../utils/printUtil';
import baseUtil from '../../utils/baseUtil';
import eventUtil from '../../utils/eventUtil';
export default {

	namespace: 'deposit',

	state: {
		recharge:{
			order : {},
			settlement : {},
			records : [],
		},
		consume:{
			order : {},
			fees:[],
			records : [],
		}
	},

	subscriptions: {},
	effects: {
		*createCardOrder({ payload, callback }, { select, call, put }) {//办卡订单
			const baseInfo = yield select(state => state.patient.baseInfo);
			const consume = yield select(state => state.deposit.consume);
			const recharge = yield select(state => state.deposit.recharge);
			
			var {data} = yield call(cardOrder,baseInfo);
			
			if(data && data.success && data.result ){
				const newConsume = {...consume,order : data.result.consume||{amt:0}};
				const newRecharge = {...recharge,order : data.result.recharge||{amt:0}};
				console.info('办卡订单创建成功 ','消费：', newConsume.order.id,'充值：', newRecharge.order.id);
				yield put({
					type: 'setState',
					payload: { 
					  consume:newConsume,
					  recharge:newRecharge
					}
				})
				if(callback)callback();
			}else{
				baseUtil.notice('创建办卡订单失败');
			}
		},
		*createReissueCardOrder({ payload, callback }, { select, call, put }) {//办卡订单
			const baseInfo = yield select(state => state.patient.baseInfo);
			const consume = yield select(state => state.deposit.consume);
			const recharge = yield select(state => state.deposit.recharge);
			
			var {data} = yield call(cardReissueOrder,baseInfo);
			
			if(data && data.success && data.result ){
				const newConsume = {...consume,order : data.result.consume||{amt:0}};
				const newRecharge = {...recharge,order : data.result.recharge||{amt:0}};
				console.info('补卡订单创建成功 消费：', newConsume.order.id,'充值', newRecharge.order.id);
				yield put({
					type: 'setState',
					payload: { 
					  consume:newConsume,
					  recharge:newRecharge
					}
				})
				if(callback)callback();
			}else{
				baseUtil.notice('创建补卡订单失败');
			}
		},
		*createRechargeOrder({ payload, callback }, { select, call, put }) {//预存订单
			const baseInfo = yield select(state => state.patient.baseInfo);
			const recharge = yield select(state => state.deposit.recharge);
			const { order } = payload;
			var {data} = yield call(buildRechargeOrder,order);
			if(data && data.success && data.result ){
				const newRecharge = {...recharge, order : data.result||{amt:0}};
				console.info('预存订单创建成功 ', newRecharge.order.id,'金额',newRecharge.order.amt,'自费',newRecharge.order.realAmt);
				yield put({
					type: 'setState',
					payload: { 
					  recharge: newRecharge
					}
				})
				if(callback)callback(newRecharge.order);
			}else{
				baseUtil.notice('创建预存订单失败');
			}
		},
		*loadRechargeHistory({ payload ,callback}, { select, call, put }){
			const { startTime,endTime } = payload;
			if(startTime > endTime){
				baseUtil.notice("开始日期不能大于结束日期，请您重新选择！");
				return;
			}
			else{
				const baseInfo = yield select(state => state.patient.baseInfo);
				const recharge = yield select(state => state.deposit.recharge);
				var {data} = yield call(rechargeRecords,{...baseInfo,startTime,endTime});
				var records = (data && data.success)?data.result:[];
				yield put({
	    			type: 'setState',
	    			payload: { recharge: {...recharge,records:data.result||[]}}
	    		});
			}
		},
		*loadConsumeHistory({ payload ,callback}, { select, call, put }){
			const { startTime,endTime } = payload;
			console.info('loadConsumeHistory ',startTime,endTime);
			if(startTime > endTime){
				baseUtil.notice("开始日期不能大于结束日期，请您重新选择！");
				return;
			}
			else{
				const baseInfo = yield select(state => state.patient.baseInfo);
				const consume = yield select(state => state.deposit.consume);
				var {data} = yield call(consumeRecords,{...baseInfo,startTime,endTime});
				var records = (data && data.success)?data.result:[];
				yield put({
	    			type: 'setState',
	    			payload: { consume: {...consume,records:data.result||[]}}
	    		});
			}
		},
		*consumePrepaid({ payload }, { select, call, put }){//消费预结算
			console.info('消费预结算'); 
			
			const consume = yield select(state => state.deposit.consume);
			const baseInfo = yield select(state => state.patient.baseInfo);
			const machine = yield select(state => state.frame.machine);
			const { fees } = payload;
			// 组号
			var groupMap = {},groups=[],totalAmt = 0 ;
			for(var fee of fees){
				var amt = fee.dj * fee.sl;
				totalAmt = totalAmt+amt;
				if(!groupMap[fee.zh]){
					groupMap[fee.zh] = fee;
					groups.push(fee.zh);
				}
			}
			
			//订单信息
			var order ={ 
				patientNo:baseInfo.no,//病人姓名
				patientName:baseInfo.name,//病人姓名	
				patientIdNo:baseInfo.idNo,//病人身份证号
				patientCardNo:baseInfo.medicalCardNo,//病人卡号	
				//patientCardType:baseInfo.cardType,//就诊卡类型 TODO 就诊卡	
				fees:fees,
				amt:totalAmt,
			};
			
			// 通过socket 预结算
			try {
				var {data} = yield call(prepaied,baseInfo,groups,machine); // 0 失败  1  成功
				if(data && data.resultCode == '0'){
					var result = data.recMsg||{};
					if(result.state != '0'){
						if(result.cwxx){
							baseUtil.error(result.cwxx);
							return;
						}else{
							 baseUtil.error("预结算失败！"); 
							 return;
						}
					}
					order = {
						...order,
						selfAmt:result.yczf,// 预存支付
						miAmt:result.jzje,// 记账金额
						paAmt:result.zfje,// 自费金额
						reduceAmt:result.jmje,// 减免金额
					}
					yield put({
						type: 'setState',
						payload: { 
						  consume:{...consume,order},
						}
					})
				}else{
					 baseUtil.error("预结算失败！"); 
				}
			} catch (e) {
				 console.info(e);
				 baseUtil.error("预结算失败！"); 
			}
		},
		*createFeeOrder({ payload,callback }, { select, call, put }){//生成订单
			console.info("创建收费订单");
			const consume = yield select(state => state.deposit.consume);
			const recharge = yield select(state => state.deposit.recharge);
			const { order } = consume;
			var {data} = yield call(createFeeOrder,order);
			if(data && data.success && data.result ){
				const newConsume = {...consume,order : data.result.consume||{amt:0}};
				const newRecharge = {...recharge,order : data.result.recharge||{amt:0}};
				console.info("创建收费订单,消费： ",newConsume.order);
				console.info("创建收费订单,充值 ： ",newRecharge.order);
				yield put({
					type: 'setState',
					payload: { 
					  consume:newConsume,
					  recharge:newRecharge
					}
				})
				if(callback)callback();
			}else{
				baseUtil.error('创建收费订单失败');
			}
		},
		*consume({ payload }, { select, call, put }){//消费接口
			const baseInfo = yield select(state => state.patient.baseInfo);
			const consume = yield select(state => state.deposit.consume);
			const machine = yield select(state => state.frame.machine);
			const { order } = payload;
			console.info('消费接口 ,order ', order.id);
			var status = '0';
			
			// 通过socket 支付 支付成功，支付完毕修改消费订单状态
			try{
				var resultCode ='0' ;
				var recMsg = {state:'0'}; 
				
				if(order.amt != 0  ){//金额是0 ，直接扣款
					var {data:payResult} =   depositConsume(order,machine);//TODO 
					var resultCode = payResult.resultCode;
					var recMsg = payResult.recMsg;
				}
				
				if(resultCode=='0' && recMsg && recMsg.state =='0'){
					status='1';
					console.info("扣款 成功")
					eventUtil.fireEvents("model","afterConsume");
				}else{
					console.info("扣款失败  : ",resultCode,'recMsg',recMsg )
					baseUtil.error("扣款失败！！"); 
				}
			}catch(e){
				baseUtil.error("扣款失败！！");  
				return;
			}
			
			// 调用后台修改消费订单状态
			var {data} = yield call(consumeCallBack,order,status); // 0 失败  1  成功
			if(data && data.success){
				yield put({
	    			type: 'setState',
	    			payload: { consume: {...consume,order : data.result||consume.order}}
	    		});
			}else {
				 baseUtil.error("消费回调失败！！"); 
			}
		},
		*loadFees({ payload ,callback}, { select, call, put }) {
			console.info('load fees payload : ' , payload);
			
			const baseInfo = yield select(state => state.patient.baseInfo);
			const machine = yield select(state => state.frame.machine);
			const consume = yield select(state => state.deposit.consume);
			try {
				console.info('load fees consume : ' , consume);
				var {data} = yield call(loadFees,baseInfo,machine); // 0 失败  1  成功
				console.info('load fees result : ' , data.resultCode);
				
				if(data && data.resultCode == '0'){
					var fees = data.recMsg||[];
					console.info('load fees : ' , data);
					yield put({
		    			type: 'setState',
		    			payload: {consume:{ ...consume,fees}}
		    		});
					if(callback)callback(fees);
				}
			} catch (e) {
				// TODO: handle exception
				console.info('load fees exception : ' , e);
			}
		},
		*reloadRechargeOrder({ payload ,callback}, { select, call, put }) {
			const recharge = yield select(state => state.deposit.recharge);
			var {data} = yield call(getOrder,recharge.order.id);
			if(data && data.success){
				yield put({
	    			type: 'setState',
	    			payload: { recharge: {...recharge,order : data.result||recharge.order}}
	    		});
				if(callback)callback();
			}else {
				 baseUtil.error("预存订单查询失败！！"); 
			}
		},
		*printRecharge({ payload ,callback}, { select, call, put }){
			const recharge = yield select(state => state.deposit.recharge);
			const baseInfo = yield select(state => state.patient.baseInfo);
			const machineInfo = yield select(state => state.frame.machine);
			const payChannel = yield select(state => state.payment.payChannel);
			try{
				printUtil.printRechargeReceipt(recharge.order,baseInfo,machineInfo,payChannel);
			}catch(e){
				baseUtil.error("打印机异常，打印充值凭证失败"); 
			}
		},
		*printConsume({ payload ,callback}, { select, call, put }){
			const consume = yield select(state => state.deposit.consume);
			const baseInfo = yield select(state => state.patient.baseInfo);
			const machineInfo = yield select(state => state.frame.machine);
			try{
				console.info("打印扣款凭证,consume : ",consume);
				console.info("打印扣款凭证,baseInfo : ",baseInfo);
				console.info("打印扣款凭证,machineInfo : ",machineInfo);
				printUtil.printConsumeReceipt(consume.fees,consume.order,baseInfo,machineInfo);
			}catch(e){
				baseUtil.error("打印机异常，打印扣款凭证失败"); 
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
				recharge:{
					order : {},
					settlement : {},
					records : [],
				},
				consume:{
					order : {},
					fees:[],
					records : [],
				}
			}
		},
	},
};