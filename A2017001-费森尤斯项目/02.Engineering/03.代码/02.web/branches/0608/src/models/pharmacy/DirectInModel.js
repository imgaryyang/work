import dva from 'dva';
import moment from 'moment';
import { notification } from 'antd';
import { saveDirectIn,loadSearchBar,loadApply,saveApply,newApply,deleteApply,loadCompany} from '../../services/pharmacy/DirectInService';
import { getOptions } from '../../services/UtilsService';
import * as drugInfoService from '../../services/pharmacy/DrugInfoService';

var menu = [];
export default {
	namespace: 'directIn',
	state: {
		data :[],//药品信息
		dataApply :[],//直接入库
		spin:false,
		page : {total : 0,pageSize : 10 , pageNo:1 },
		deptId: null,
		hosId: null,
		userName:null,
		tradeName:null,
		company:'',
		companyInfo:[],

	},
	effects: {
		//药品选择searchBar查询
		*load({ payload }, { select, call, put }) {
			var {page,query} = (payload||{});
			var {deptId,hosId,userName,tradeName} = (query||{});

			var defaultPage = yield select(state => state.directIn.page);
	    	var newPage = {...defaultPage,...page};

	    	var { pageNo, pageSize } = newPage;
	    	var start   = (pageNo-1)*pageSize;

			
			const defaultQuery = yield select(state => state.directIn.query);
	    	yield put({type: 'setState',payload:{spin:true}});
	    	const {data} = yield call(drugInfoService.loadDrugInfoPage,
		    		start, pageSize, query
		    	);
	    
	    	yield put({type: 'setState',payload:{spin:false}});
	    	
	    	if (data) {
	    		newPage.total = data.total;
	    		yield put({
    			type: 'init',
    			payload:{data:data,
    			page:newPage,
    			deptId:deptId,
    			hosId:hosId,
    			userName:userName,
    			tradeName:tradeName,}
	        })}
	    },
	  //直接入库searchBar查询
		*loadSearchBar({ payload }, { select, call, put }) {
			const { query } = (payload || {});
			const defaultQuery = yield select(state => state.directIn.query);
	    	yield put({type: 'setState',payload:{spin:true}});
	    	const { data } = yield call(loadSearchBar, query || defaultQuery);//改为查询入库表
	    	yield put({type: 'setState',payload:{spin:false}});
	    	
	    	if (data) {yield put({
    			type: 'initApply',
    			data:data,
	        })}
	    },
	    *loadApply({ payload }, { select, call, put }) {
	    	  //查询操作员直接入库暂存记录
	   
	    	  const { user } = yield select(state=>state.base);
	    	  const query = {
	    			  createOper: user.name || null,
	    			  hosId: user.hosId || null,
	    			  inputState: '0',
	    	  }
	    	  yield put({type: 'setState',payload:{spin:true}});
	    	  const {data} = yield call(loadApply, query );
	    	  const {data:dataCompany} = yield call(loadCompany);
	    	  let companyInfo = [];
	    	  if (dataCompany&&dataCompany.success){
	    		  const {result:resultCompany} = dataCompany;
	    		  for( let j = 0 ; j < resultCompany.length; j ++){
	    			  companyInfo.push({id: resultCompany[j].id,
	    				  				name:resultCompany[j].companyName,
	    				  });
	    		  }
	    	  }
	    	  else{
	    		  //todo
	    	  }
	    	  yield put({ type: 'setState', payload: {companyInfo: companyInfo}});
	    	  let dataApply=[];
	    	  let company = '';
	    	  if (data&&data.success){
		    	  if( data.result && data.result.length > 0 ){
		    		 const {result} = data;
		    		 company = (result[0].companyInfo||{}).id||'';
		
		    		 
		    		 for( let i = 0; i < result.length ; i++){
		    			
		    			 dataApply.push({
				            	tradeName: result[i].tradeName,
				            	specs: result[i].specs,
				            	producer: result[i].producer,
				            	producerName: result[i].drugInfo.companyInfo.companyName,
				            	salePrice: result[i].salePrice,
				            	minUnit: result[i].minUnit,
				            	drugInfo : result[i].drugInfo,
				            	inBill: result[i].inBill,
				            	inState: result[i].inState,
				            	packUnit:result[i].drugInfo.packUnit,
				            	inSum: result[i].inSum,
				            	saleCost: result[i].saleCost,
				            	approvalNo: result[i].approvalNo,
				            	id: result[i].id,
				            	deptId : result[i].deptId,
				            	hosId : result[i].hosId,
				            	inOper:result[i].inOper,
				            	inTime:data.result[i].inTime,
				            	validDate: result[i].validDate,
				            	produceDate:result[i].produceDate,
				            	buyPrice:result[i].buyPrice,//采购价
				            	salePrice:result[i].salePrice,//零售价
				            	drugCode: result[i].drugCode,
				            	drugType: result[i].drugType,
				            	buyCost: result[i].buyCost,
				            	
				            }); 
		    		 }
		    	  }
	    	  }
	    	  yield put({ type: 'setState', payload: {dataApply: dataApply,company:company}});
	    	  yield put({type: 'setState',payload:{spin:false}});
	      },
	    //增加入库药品
	    *forAddApply({ record }, { select, call, put }) {

	    	//获取药品信息
	    	const data = record || {};	
	    	const { dataApply } = yield select(state => state.directIn);
	    	
	    	const {deptId,hosId,userName} = yield select(state => state.directIn);

	  
	    	if (dataApply.length>0&&data.stopFlag){
	    		//不重复的药品并且同一个库房
		    	if(!dataApply.find( value=>value.drugInfo.id == data.id ))
	    		{
		    		dataApply.push({
		            	tradeName: data.tradeName,
		            	specs: data.drugSpecs,
		            	producer: data.companyInfo.id,
		            	producerName: data.companyInfo.companyName,
		            	"companyInfo.id": '',
		            	salePrice: data.salePrice,
		            	minUnit: data.miniUnit,
		            	packUnit: data.packUnit,
		            	drugInfo:{id:data.id},
		            	inBill: dataApply[0].inBill,
		            	inputState: null,
		            	inSum: 0.00,
		            	saleCost: 0,
		            	approvalNo: '-',
		            	deptId: deptId,
		            	hosId: hosId,
		            	inOper:userName,
		            	inTime:data.creatTime,
		            	produceDate: data.creatTime,//界面手输生产日期
		            	validDate: data.creatTime,//界面手输有效日期
		            	buyPrice:	data.buyPrice,			//采购价
		            	salePrice:	data.salePrice,		//零售价
		            	drugType: data.drugType,
		            	drugCode: data.drugCode,
		            	buyCost: data.buyPrice,

		            }); 
	    		}
	    	}
	    	else if(data.stopFlag){
	    		dataApply.push({
	            	tradeName: data.tradeName,
	            	specs: data.drugSpecs,
	            	producerName: data.companyInfo.companyName,
	            	producer: data.companyInfo.id,
	            	"companyInfo.id":'',
	            	salePrice: data.salePrice,
	            	minUnit: data.miniUnit,
	            	packUnit: data.packUnit,
	            	drugInfo:{id:data.id},
	            	inBill: null,
	            	inputState: null,
	            	inSum: 0.00,
	            	saleCost: 0,
	            	approvalNo: '-',
	            	deptId: deptId,
	            	hosId: hosId,
	            	inOper:userName,
	            	inTime:data.creatTime,
	            	produceDate: data.creatTime,//界面手输生产日期
	            	validDate: data.creatTime,//界面手输有效日期
	            	buyPrice:	data.buyPrice,		//采购价
	            	salePrice:	data.salePrice,		//零售价
	            	drugType: data.drugType,
	            	drugCode: data.drugCode,
	            	buyCost: data.buyPrice,
	
	            }); 
	    	}
	       yield put({type: 'setState',payload:{dataApply:dataApply}})
	    },
	    //保存或者暂存直接入库药品
	    *saveDirectIn({ inputState }, { select, call, put }) {
	    	yield put({type: 'setState',payload:{spin:true}});
	    	const data = yield select(state=>state.directIn.dataApply);
	    	const company = yield select(state=>state.directIn.company)
	    	if( data && data.length > 0 ){
	    		for( let o of data ){
	    			o.inputState = inputState;
	    			o.inType = 'I3';
	    			o.plusMinus = '1';
	    			o.buyCost = o.buyPrice * o.inSum;
//	    			o.batchNo = '1';//批次默认
	    			o.companyInfo = {id:company};
//	    			o.approvalNo = '1';//批号得界面手输
//	    			o.produceDate = moment().format('YYYY-MM-DD');//生产日期得界面手输
//	    			o.validDate = moment().format('YYYY-MM-DD');//有效日期得界面手输
//	    			o.inSum = 1.0;//入库数量
	    			o.inTime = moment().format('YYYY-MM-DD');
//	    			o.saleCost = o.inSum * o.salePrice;//入库金额
	    		}
	    		if (inputState == '0'){
	    			const { data : ret } = yield call(saveApply,data);
	    			if (ret && ret.success) {
		 				if (inputState == '0'){
		 					yield put({ type: 'setState', payload: { dataApply: data } });
		 					yield put({ type: 'loadApply',payload:{} });
		 					notification.success({
						        message: '提示',
						        description: '暂存成功！',
						    });
		 				}
	    			}else{
	    				notification.error({
					          message: '提示',
					          description: `${ret.msg}`,
					    });

	    			}
	    		}
	    		else{
	    			//调用汐鸣入库处理接口
	    			const { data : ret } = yield call(saveDirectIn,data);
	    			if(ret && ret.success){
	    				yield put({ type: 'setState', payload: { dataApply: [] } });
	    				notification.success({
					        message: '提示',
					        description: '入库成功！',
					    });
	    			}
	    			else{
	    				notification.error({
					          message: '提示',
					          description: `${ret.msg}`,
					    });
	

	    			}
	    		}
	    	}
	    	yield put({type: 'setState',payload:{spin:false}});

	    	
	    },
	   //删除请领药品
	    *deleteApply({record}, { select, call, put }) {
			if( record.id ){
				 yield put({type: 'setState',payload:{spin:true}});
		        const { data } = yield call(deleteApply, record.id);
		        if (data&&data.success){
		        	yield put({type: 'delete', drugId:record.drugInfo.id });
		        	notification.success({
				          message: '提示',
				          description: '删除成功！',
				    });
		        }else{
		        	notification.error({
				          message: '提示',
				          description: '删除失败！',
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
				 yield put({type: 'setState',payload:{spin:true}});
		        const { data : ret } = yield call(newApply, data);
		        if (ret&&ret.success){
		        	yield put({ type: 'setState', payload: { dataApply: [] } });
		        	notification.success({
				          message: '提示',
				          description: '新建成功！',
				    });
		        }
		        yield put({type: 'setState',payload:{spin:false}});
			}
			else{
				yield put({ type: 'setState', payload: { dataApply: [] } });
			}
	        
	      },

	},
	reducers: {
		"init"(state,{payload}) {
			var {data,page,deptId,hosId,userName,tradeName} = (payload||{});

			var {result} = data||{};
			var newPage = page||{};
			var deptId = deptId||{};
			var hosId = hosId||{};
			var userName = userName;
			var tradeName = tradeName||'';
			var data=result||[];
			return { ...state,data:data,page:newPage,deptId:deptId,hosId:hosId,userName:userName,tradeName:tradeName,};
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
	          dataApply.splice(index, 1);
	          return {
	            ...state,
	            dataApply,
	          };
	        },
	},
};
//&&dataApply.find( value=>value.deptId == deptId )
