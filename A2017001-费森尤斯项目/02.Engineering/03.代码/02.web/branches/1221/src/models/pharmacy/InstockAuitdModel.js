import { merge } from 'lodash';
import moment from 'moment';
import { notification } from 'antd';
import { getOptions } from '../../services/UtilsService';
import * as instockService from '../../services/pharmacy/InstockService';

export default {
  namespace: 'instockAuitd',

  state: {
	buyList:{
		page: {
		  total: 0,
		  pageSize: 10,
		  pageNo: 1,
		},
		data: [],
	
    },
	buyDetail:{
		page: {
			  total: 0,
			  pageSize: 10,
			  pageNo: 1,
			},
	    data: [],

	},
	buyHis:{
		page: {
			  total: 0,
			  pageSize: 10,
			  pageNo: 1,
			},
		data: [],
	},
	isSpin: false,
	
	bizPrintAlertParams: {
    	visible: false,
        tmplateCode: '',
        bizCode: '',
        bizCodeLabel: '',
        bizTip: ''
    }
  },

  effects: {
	 //1、加载请领单列表
    *loadBuyList({ payload }, { select, call, put }) {
      const { query } = (payload || {});
  
      // 获取请领单信息
      yield put({type: 'setState',payload:{isSpin:true}});
      const { data } = yield call(instockService.loadApplyAuitd, query);
     
      
      if (data) {
    	// 更新state，刷新页面
        yield put({ type: 'updateBuyList', data: data.result });
      }
      yield put({type: 'setState',payload:{isSpin:false}});
      
    },
    //2、查询采购单明细
    *loadBuyDetail({ payload }, { select, call, put }) {

    	const {  query, record } = (payload || {});
    	const {buyDetail} = yield select(state => state.instockAuitd);

    
    	yield put({type: 'setState',payload:{isSpin:true}});
    	const {data} = yield call(instockService.loadAuitdDetail, query );
    	if( data && data.result ){
        	const newDetail = { ...buyDetail, 
        			data: data.result, ...record,
        		};
        	yield put({ type: 'setState', payload: {buyDetail: newDetail}});
    	}
    	yield put({type: 'setState',payload:{isSpin:false}});
      },
     
      //4、入库保存
	*saveApply({ appState }, { select, call, put }) {
    	yield put({type: 'setState',payload:{isSpin:true}});
    	const {buyDetail} = yield select(state=>state.instockAuitd);
    	const buyData = buyDetail.data
    	const {user} = yield select(state=>state.base);
    	const userName = user.name
    	const deptId = user.loginDepartment.id;
    	let appBill = '';
    	if( buyData && buyData.length > 0 ){
    		for( let o of buyData ){
    			o.appState = appState;
    			appBill = o.appBill;
    		}
    		const { data : ret } = yield call(instockService.saveApply,buyData);//保存请领单信息
    		//调用汐鸣接口入库
    		if (ret && ret.success) {
    			//调用汐鸣入库处理接口
    			if( buyData && buyData.length > 0 ){
    	    		for( let o of buyData ){
    	    			o.inputState = '4';
    	    			o.inType = 'I8';
    	    			o.inSum = o.appNum;//最稳妥是审核金额
    	    			o.id = null;
    	    			o.inTime = moment().format('YYYY-MM-DD');
    	    			o.inOper = userName;
    	    			o.companyInfo = {id : o.company};
//    	    			o.saleCost = o.inSum * o.salePrice;//入库金额
    	    		}
    	    		const { data : ret } = yield call(instockService.saveAuitd,buyData);//调用汐鸣接口
    	    		//更新出库表，根据请领单号更改出库表状态为2
    	    		
    				if(ret && ret.success){
    			
    					const{data:Out} = yield call(instockService.updateByAppBill,appBill);
    					yield put({ type: 'loadBuyList' ,payload: {query:{appState:'3',deptId:deptId}}})
    					yield put({ type: 'setState', payload: {buyDetail: {}}});
    					
    					var retData = ret.result;   
	    				console.log('retData', retData);    
	    				// 弹出业务单据打印提示
    		      	   	yield put({ 
    		      			type: 'setState', 
    		      			payload: { 
    		      				bizPrintAlertParams: { 
    		      					visible: true, 
    		      					tmplateCode: '018', // 模版编号 
    		      					bizCode: retData[0].inBill, // 业务单据编号
    		      					bizCodeLabel: '请领单号', // 业务单据编号名称
    		      					bizTip: '请领计划核准入库提交成功' // 业务操作成功提示
    		      				}
    		      			}
    		      		});
    		      	   	
    					/*notification.success({
    			            message: '提示',
    			            description: '入库成功',
    		    		});*/
    				}
    				else{
    					notification.error({
    			            message: '提示',
    			            description: `${ret.msg}!`,
    		    		});
    				}
    			
    			}
    			else{
    				notification.error({
			            message: '提示',
			            description: '返回信息出错',
		    		});
    			}

    		}
    	}
    	yield put({type: 'setState',payload:{isSpin:false}});

    	
    },

    
  },

  reducers: {
    updateBuyList(state, { data }) {
      const { buyList } = state;

      const newBuyList = { ...buyList, data};
      return {
        ...state,
        buyList:newBuyList,
      };
    },

     
	setState(state, { payload }) {
    	return { ...state, ...payload };
	},
//
//	toggleBuySpin(state) {
//		let {buy} = state;
//		const newBuy = {...buy, isSpin: !buy.isSpin};
//		return { ...state, buy: newBuy };
//	},
//	toggleDrugSpin(state) {
//		let {drug} = state;
//		const newDrug = {...drug, isSpin: !drug.isSpin};
//		return { ...state, drug: newDrug };
//	},
  },
};
