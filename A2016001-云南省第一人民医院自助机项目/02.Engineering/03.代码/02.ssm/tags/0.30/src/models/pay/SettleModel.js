import dva from 'dva';
import moment from 'moment';
import {loadSettles,printCallback,cashBatchList,cashUnPrinted,createCashBatch} from '../../services/SettleService';
import baseUtil from '../../utils/baseUtil';
export default {

	namespace: 'settle',

	state: {
		batchs:[],
		settles:[],
		printing:false,
		page: { total: 0, pageSize: 100, pageNo: 1 }
	},
		  
	subscriptions: {},
	effects: {
		*loadBatches({ payload, callback }, { select, call, put }) {//预存订单
			// const {} = this.state.
			var { data } = yield call(cashUnPrinted);//初始化
	    	if( data && data.success ){//卡不存在,语音提示
	    		yield put({
		  			type: 'setState',
		  			payload: {
		  				batchs:data.result||[],
		  			},
		  		})
	    	}else if(data && data.msg){
	    		baseUtil.error(data.msg);
	    	}else{
	    		baseUtil.error('加载打印批次出错');
	    	}
		},
		*createCashBatch({ payload, callback }, { select, call, put }) {//生成批次
			baseUtil.closeTodayCash();
			
			var { data } = yield call(createCashBatch);//初始化
			if( data && data.success ){//
				yield put({type: 'loadBatches',});
			}else{
				baseUtil.error('生成批次失败');
			}
			
		},
		*printSettles({ payload, callback }, { select, call, put }) {//预存订单
			var { batch } = payload;//
			var { count } = batch;
			var page =  yield select(state => state.settle.page);
			var { pageSize} = page;
			var sum = 0,pageNo = 1;
			while( sum <= count ){
				
				var start = pageSize*(pageNo-1);console.info("start "+start);
				var limit = pageSize;
				
				var query ={start,limit,printBatchNo:batch.batchNo,payChannelCode:'0000'}
				
				console.info("query ",query);
				
				var { data } = yield call(loadSettles,query);//
		    	if( data && data.success ){//
		    		var newPage = {...page};
		    		newPage.total = data.total;
		    		pageNo = pageNo+1;
		    		newPage.pageNo = pageNo;
		    		console.info("获取数据 ： " , data);
		    		yield put({
			  			type: 'setState',
			  			payload: {
			  				printing:true,
			  				page:newPage,
			  				settles:data.result||[],
			  			},
			  		})
		    	}else if(data && data.msg){
		    		baseUtil.error(data.msg);
		    		return;
		    	}else{
		    		baseUtil.error('加载第'+pageNo+'结算单出错');
		    		return;
		    	}
		    	sum = sum +pageSize;
		    	yield put({
		  			type: 'printCash',
		  			payload: {
		  				settles:data.result||[],
		  			},
		  		})
		    	yield baseUtil.sleep(6000);
			}
			yield put({
	  			type: 'setState',
	  			payload: {
	  				printing:false,
	  			},
	  		})
			yield put({
	  			type: 'printCallback',	
	  			payload: { batch },
	  		})
		},
		*printCash({ payload ,callback}, { select, call, put }) {
			//调用打印函数
			console.info("进入打印函数");
			console.info("沉睡完毕");
		},
		*printCallback({ payload ,callback}, { select, call, put }) {
			const { batch } = payload;//
			var { data } = yield call(printCallback,batch);//
			if( data && data.success ){//
				yield put({
		  			type: 'loadBatches',	
		  		})
			}else if (data && data.msg){
				baseUtil.error(data.msg);
			}else{
				baseUtil.error('记录打印次数出错');
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
				batchs:[],
				settles:[],
				printing:false,
				page: { total: 0, pageSize: 100, pageNo: 1 }
			};
		},
		"changeState"(state,{ payload}) {
			return {...state,...payload};
		},
	},
};