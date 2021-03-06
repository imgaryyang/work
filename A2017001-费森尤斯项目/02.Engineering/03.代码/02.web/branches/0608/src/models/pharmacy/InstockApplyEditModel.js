import dva from 'dva';
import moment from 'moment';
import { notification} from 'antd';
import { loadSearchBar,loadApply,saveApply,deleteApply,newApply,loadApplyAuitd,loadApplyInMainList} from '../../services/pharmacy/InstockService';
import {loadStoreInfoPage } from '../../services/pharmacy/StoreInfoService';
import { loadBuyBill } from '../../services/pharmacy/BuyBillService';
import { getOptions } from '../../services/UtilsService';
import _ from 'lodash';

export default {
	namespace: 'instockApplyEdit',
	state: {
		data :[],//库存
		dataApply :[],//请领
		spin:false,
		dataPage : {total : 0,pageSize : 10 , pageNo:1 },
		applyPage:	{total : 0,pageSize : 10 , pageNo:1 },
		fromDeptId:null,
		applyListData: [],
		currentAppBill: ''
	},
	effects: {
		//下拉选择询
		*loadApplyListData({ payload }, { select, call, put }) {
			const { query } = (payload || {});
	
			console.log('query#:', query);

	    	yield put({type: 'setState',payload:{spin:true}});
	    	
	    	
	    	const { data } = yield call(loadApplyInMainList, query);

	    	yield put({type: 'setState',payload:{spin:false}});
	    	
	    	if (data) {

	    		yield put({type: 'setState', payload:{applyListData:data.result}});
	        }
	    
	    },
		//下拉选择药房数据以及库存searchBar查询
		*load({ payload }, { select, call, put }) {
			var {dataPage,query} = (payload||{});
			
			let {deptId} = (query||{});

			
			
			
			
			yield put({type: 'setState',payload:{fromDeptId:deptId}});
			const defaultPage = yield select(state => state.instock.dataPage);
	    	var newPage = {...defaultPage,...dataPage};
	    	var { pageNo, pageSize } = newPage;
	    	var start   = (pageNo-1)*pageSize;

	    	yield put({type: 'setState',payload:{spin:true}});
	    	
	    	const { data } = yield call(loadStoreInfoPage, start, pageSize, query);//调用汐鸣接口查询

	    	yield put({type: 'setState',payload:{spin:false}});
	    	
	    	if (data) {
	    		newPage.total = data.total;

	    		yield put({
    			type: 'init',
    			data:data,
    			dataPage: newPage,
	        })}
	    
	    },
	  //请领searchBar查询
		*loadSearchBar({ payload }, { select, call, put }) {
			const { query } = (payload || {});
			const defaultQuery = yield select(state => state.instock.query);
	    	yield put({type: 'setState',payload:{spin:true}});
	    	const { data } = yield call(loadSearchBar, query || defaultQuery);//调用汐鸣接口查询
	    	yield put({type: 'setState',payload:{spin:false}});
	    	
	    	if (data) {yield put({
    			type: 'initApply',
    			data:data,
	        })}
	    },

	    // 查询请领单明细
	    *loadApply({ payload }, { select, call, put }) {

	    	  const { query } = (payload || {});
	   
	    	  yield put({ type: 'setState', payload:{ spin:true }});

	    	  const {data} = yield call(loadApply, query );  

			  yield put({type: 'setState',payload:{spin:false}});
	
	    	  //console.log('data-:', data);
	    	  
	    	  let dataApply=[];
	    	  if (data&&data.success){
		    	  if( data.result && data.result.length > 0 ){
		    		 const {result} = data;

		    		 
		    		 for( let i = 0; i < result.length ; i++){
		    			 dataApply.push({
				            	tradeName: result[i].tradeName,
				            	specs: result[i].specs,
				            	producer: result[i].producer,
				            	salePrice: result[i].salePrice,
				            	minUnit: result[i].minUnit,
				            	appUnit: result[i].appUnit,
				            	drugInfo : result[i].drugInfo,
				            	appBill: result[i].appBill,
				            	appState: result[i].appState,
				            	appNum: result[i].appNum,
				            	id: result[i].id,
				            	deptId: result[i].deptId,
				            	approvalNo: result[i].approvalNo,
				            	batchNo: result[i].batchNo,
				            	producerName: result[i].drugInfo.companyInfo.companyName,//生产厂商
				            	fromDeptId: result[i].fromDeptId,
				            	drugType: result[i].drugType,
				            	produceDate:result[i].produceDate,
				            	validDate:result[i].validDate,
				            	company: result[i].company,
				            	buyPrice: result[i].buyPrice,
				            	saleCost: result[i].saleCost,
				            	appOper: result[i].appOper,
				           
				            }); 
		    		 }
		    	  }
	    	  }
	    	  
	    	      	  yield put({ type: 'setState', payload: {dataApply: dataApply}});
	      },

	    // 添加请领明细
	    *forAddApply({ record }, { select, call, put }) {
	    	// 请先选择需要修改的请领单
	    	const { currentAppBill } = yield select(state => state.instockApplyEdit);
	    	if (currentAppBill == ''){
    			notification.error({
			            message: '提示',
			            description: `请先选择需要修改的请领单`,
		    		});
	    			return;
	    		}

	    	//获取药品信息
	    	const data = record || {};	
	    	const { dataApply,fromDeptId } = yield select(state => state.instockApplyEdit);
	    	const {user} = yield select(state => state.base);
	    	const userName = user.name
	    	const deptId = user.loginDepartment.id;

	    	if (dataApply.length>0){
	    		if (data.storeSum == 0){
	    			notification.error({
			            message: '提示',
			            description: `该药品库存为零,不能请领`,
		    		});
	    			return;
	    		} 

		    	if(dataApply.find( value=>((value.drugInfo.id == data.drugInfo.id)&&(value.approvalNo == data.approvalNo)||value.fromDeptId != fromDeptId))){
		    		notification.error({
			            message: '提示',
			            description: `同一药品或不同库房的药品不允许添加!`,
		    		});
		    		return;
		    	}else
	    		{
		    		dataApply.push({
		            	tradeName: data.tradeName,
		            	specs: data.specs,
		            	producerName: data.companyInfo ? data.companyInfo.companyName : '',//生产厂商
		            	salePrice: data.salePrice,
		            	saleCost: data.saleCost,
		            	drugType:data.drugType,
		            	minUnit: data.minUnit,
		            	appUnit: data.drugInfo.packUnit,
		            	drugId:data.drugInfo.id,
		            	appBill: currentAppBill,
		            	appState: null,
		            	deptId: deptId,
		            	appNum: 0,
		            	approvalNo: data.approvalNo,
		            	batchNo: data.batchNo,
		            	drugInfo:data.drugInfo,
		            	produceDate:data.produceDate,
		            	validDate:data.validDate,
		            	buyPrice:data.buyPrice,
		            	salePrice:data.salePrice,
		            	minUnit:data.minUnit,
		            	producer:data.drugInfo.companyInfo ? data.drugInfo.companyInfo.id : '',
		            	appOper:userName,
		            	company:data.companySupply ? data.companySupply.id : '',//供货商
		            	fromDeptId: fromDeptId,

		            }); 
	    		}
	    	}
	    	else{
	    		if (data.storeSum == 0){
	    			notification.error({
			            message: '提示',
			            description: `该药品库存为零,不能请领`,
		    		});
	    			return;
	    		} 
	    		dataApply.push({
	            	tradeName: data.tradeName,
	            	specs: data.specs,
	            	producerName: data.companyInfo ? data.companyInfo.companyName : '',
	            	salePrice: data.salePrice,
	            	minUnit: data.minUnit,
	            	appUnit: data.drugInfo.packUnit,
	            	appBill: currentAppBill,
	            	deptId: deptId,
	            	appState: null,
	            	appNum: 0,
	            	approvalNo: data.approvalNo,
	            	batchNo: data.batchNo,
	            	drugInfo:data.drugInfo,
	            	drugId:data.drugInfo.id,
	            	produceDate:data.produceDate,
	            	validDate:data.validDate,
	            	producer:data.producer,
	            	buyPrice:data.buyPrice,
	            	salePrice:data.salePrice,
	            	minUnit:data.minUnit,
	            	producer:data.drugInfo.companyInfo ? data.drugInfo.companyInfo.id : '',
	            	appOper:userName,
	            	company:data.companySupply ? data.companySupply.id : '',//供货商
	            	fromDeptId:fromDeptId,
	            	saleCost: data.saleCost,
	            	drugType:data.drugType,
	
	            }); 
	    	}
	       yield put({type: 'setState',payload:{dataApply:dataApply}})
	    },

	    // 保存请领单
	    *saveApply({ appState }, { select, call, put }) {
	    	yield put({type: 'setState',payload:{spin:true}});
	    	const data = yield select(state=>state.instockApplyEdit.dataApply);
	    	const {user} = yield select(state=>state.base);
	    	if( data && data.length > 0 ){
	    		for( let o of data ){
	    			o.appState = appState;
	    			o.deptId = user.loginDepartment.id;
	    			o.drugCode = o.drugInfo.drugCode;
	    			o.plusMinus = 1;
	    			if (appState === '0' ){
	    				o.comm = '暂存请领药品';
	    			}
	    			else{
	    				o.comm = '提交请领药品';
	    			}
	    			

	    		}
	    		const { data : ret } = yield call(saveApply,data);
	 			if (ret && ret.success) {
	 				if (appState == '0'){
	 					yield put({ type: 'setState', payload: { dataApply: data } });
	 					yield put({ type: 'loadApply',payload:{} });
	 					notification.success({
				            message: '提示',
				            description: '暂存成功！',
			    		});
	 				}
	 				else{
	 					yield put({ type: 'setState', payload: { dataApply: [],
        currentAppBill: '' } });
	 					notification.success({
				            message: '提示',
				            description: '提交成功！',
			    		});
	 				}
	
	 			}else{
	 				notification.error({
			            message: '提示',
			            description: '保存失败！',
		    		});
	 			}
	    	}
	    	yield put({type: 'setState',payload:{spin:false}});

	    	
	    },
	   //删除请领药品
	    *deleteApply({record}, { select, call, put }) {
			if( record.id ){
				yield put({type: 'setState',payload:{spin:true}});
		        const { data } = yield call(deleteApply, record.id);
		        if (data && data.success) {
			        yield put({type: 'delete', drugId:record.drugInfo.id });
					}
					else{
						notification.error({
				            message: '错误',
				            description: `${data.msg}!`,
				     });
				}
		        yield put({type: 'setState',payload:{spin:false}});
			}
			else{
				yield put({type: 'delete', drugId:record.drugInfo.id });
			}
			
			
	      },
      //新建清空原纪录
	    *newApply({dataApply}, { select, call, put }) {
	    	let data=[];
	    	if (dataApply.length>0){
	    		for( let i = 0; i < dataApply.length ; i++){
	    			if (dataApply[i].id){
	    				data.push(dataApply[i].id);
	    				
	    			}
	    		}
	    	   		
	    	}
			if( data&&data.length>0 ){
		        const { data : ret } = yield call(newApply, data);
		        if (ret&&ret.success){
		        	yield put({ type: 'setState', payload: { dataApply: [] } });
		        }
		        else{
		        	notification.error({
			            message: '错误',
			            description: `${ret.msg}!`,
			     });
		        }
			}
			else{
				yield put({ type: 'setState', payload: { dataApply: [] } });
			}
	        
	      },

	},
	reducers: {
		"init"(state,{data,dataPage}) {
			var {result} = data;
			var data=result||[];
			return { ...state,data:data,dataPage:dataPage};
		},
		"initApply"(state,{data}) {
			var {result} = data;
			var data=result||[];
			return { ...state,dataApply:data};
		},
		"setState"(state,{payload}){
			return { ...state,...payload}
		},
		 "delete"(state, { drugId }) {
	          const { dataApply } = state;

	         const index = dataApply.findIndex( value=>value.drugInfo.id == drugId );

	          if(index != -1){
	        	  dataApply.splice(index, 1);
	          }
	          

	          return {
	            ...state,
	            dataApply,
	          };
	        },
	},
};
