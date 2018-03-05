import dva from 'dva';
import moment from 'moment';
import { loadStoreInfoPage } from '../../services/hrp/StoreInfoService';
import { getOptions } from '../../services/UtilsService';
import { loadDeptByTypes } from '../../services/base/DeptService';
import { loadUsersByDept } from '../../services/base/UserDeptService';
import { saveOutput } from '../../services/hrp/OutputInfoService';
import baseUtil from "../../utils/baseUtil";
import { notification } from 'antd';
var menu = [];
export default {
	namespace: 'hrpOutputStock',
	state: {
		page: {
			  total: 0,
			  pageSize: 10,
			  pageNo: 1,
		},
		data :[],// 库存
		dataOutStock :[],// 出库明细
		typeData:[],// 出库类型
		deptData:[],// 出科科室
		userDate:[],// 领送人
		tradeName:'',// 查询条件
		spin:false,
	},
	effects: {
		// 1、加载页面（操作类型、出库科室）
		// 2、加载库存信息
		// 3、添加出库明细
		// 4、删除出库明细
		// 5、修改出库明细
		// 6、保存出库信息
		// 7、根据科室加载送领人
		// 8、保存明细出库数量
		
		// 1、加载页面（操作类型、出库科室）
		*load({payload},{call, put, select}){
			
			const {user} = yield select(state=>state.base);
			
			// 获取操作类型
			const colNames = ['OUT_TYPE'];
			let data = yield call(getOptions, colNames);
			let typeData = [];
//			console.info("加载操作类型", data);
			if (data){
				typeData = {typeData: data.OUT_TYPE};
//				console.info("加载操作类型", typeData);
			}
			
			// 获取出库科室【科室类型 003.病区 004.药房 005.药库】
			const types =['001','002','003','004','005'];
			let deptData = [];
			data = yield call(loadDeptByTypes, types);
//			console.info("加载出库科室", data);
			if (data){
				if ( data.data ){
					for( let item of data.data.result ){
						if ( item.id != user.loginDepartment.id ){
							deptData.push(item);
						}
					}
//					console.info("加载出库科室", deptData);
				}
			}
			
			// 加载领送人
			const newState = {...typeData, deptData};
//			console.info("newState", newState);
			yield put({type:'setState', payload:newState});
			// 获取科室人员
		},
		// 2、加载库存信息
		*loadStore({ payload }, { select, call, put }) {
			const { page, query } = payload || {};
			const { tradeName } = query;
	    	yield put({type: 'setState',payload:{spin:true}});
//			console.info("outStock_inventory_load-----page------query-", payload );
	    	const outStock = yield select(state => state.outStock);
//	    	console.info("outStock_inventory_load-----page------query-", outStock );
	    	const { page: defaultPage } = outStock;
	    	const newPage = {
	    	        ...defaultPage,
	    	        ...page,
	    	      };
	    	const { pageNo, pageSize } = newPage;
			const start = (pageNo - 1) * pageSize;
//			console.info("call_loadStoreInfoPage", start, pageSize, query, newPage, defaultPage );
	    	const { data } = yield call(loadStoreInfoPage, start, pageSize, query );// 调用汐鸣接口查询
//			console.info("call_loadStoreSumInfoPage_ret", data );
			if( data ){
				newPage.total = data.total;
				yield put({
	    			type: 'init',
	    			data: data,
	    			page: newPage
		        })
			}
			console.info("tiger51", data );
	    	yield put({type: 'setState',payload:{spin:false, tradeName}});
	    },
		// 3、添加出库明细
	    *addOutStockDetail({record}, {select, call, put}){
	    	let {dataOutStock} = yield select(state=>state.outStock);
	    	console.info("tiger52", record, dataOutStock);
	    	console.info("tiger53", record, record);
	    	if ( !dataOutStock.find( value=>value.id == record.id )){
	    		dataOutStock.push(record);
	    		yield put({type: 'setState', payload:{dataOutStock}});
	    	}
	    },
		// 4、删除出库明细
	    *deletOutStockDetail({index}, {select, call, put}){
//	    	console.info("删除出库明细", index);
	    	let {dataOutStock} = yield select(state=>state.outStock);
	    	dataOutStock.splice(index, 1);
	    	yield put({type: 'setState', payload:{dataOutStock}});
	    },
		// 5、修改出库明细
		// 6、保存出库信息
	    *saveOutStockInfo({value}, {select, call, put}){
//	    	console.info("保存出库信息", value);
	    	yield put({type: 'setState',payload:{spin:true}});
	    	const {dataOutStock} = yield select(state=>state.outStock);
//	    	console.info("dataOutStock", dataOutStock.length);
	    	if( !(dataOutStock instanceof Array) || dataOutStock.length <= 0){
//	    		console.info("请添加出库资产", dataOutStock);
				notification.info({
	    			message: '提示',
	    			description: "请添加出库资产",
	    		});
//	    		baseUtil.alert("请添加出库资产");
	    		yield put({type: 'setState',payload:{spin:false}});
	    		return;
	    	}
	    	const {user} = yield select(state=>state.base);
	    	const {deptId} = user.loginDepartment.id;
//	    	console.info("dataOutStock---------tmp", dataOutStock, user);
	    	/**
	    	 * DEPT_ID 长度
	    	 * OUT_OPER 长度
	    	 * PRODUCER 长度
	    	 * OUT_ID  含义 必填
	    	 * APPLY_NO 含义 必填
	    	 * APPLY_FLAG 有出库方式，是否还需要此字段
	    	 * TO_DEPT 长度
	    	 */
	    	const outStockList = [];
	    	let i = 0;
	    	for( let item of dataOutStock ){
	    		if( !item.outSum || item.outSum <= 0){
 					notification.info({
		    			message: '提示',
		    			description: "请输入资产【"+ item.tradeName +"】的出库数量",
		    		});
//	    			baseUtil.alert("请输入资产"+ item.tradeName +"出库数量");
	    			yield put({type: 'setState',payload:{spin:false}});
	    			return;
	    		}

	    		i++;
	    		const producerInfo = item.companyInfo ? item.companyInfo.id : null;
	    		const companyInfo = item.companySupply ? item.companySupply.id : null;
	    		const matId = item.materialInfo ? item.materialInfo.id : null;
	    		const miniUnit = item.materialInfo ? item.materialInfo.materialUnit : '';
	    		console.info("tiger50",  item);
	    		outStockList.push({
	    			hosId: item.hosId,
	    			deptInfo: {id: user.loginDepartment.id},
	    			toDept: {id: value.toDept},
	    			outType: value.outType,
	    			billNo: i,
	    			instrmId: item.instrmInfo.id,
	    			instrmInfo:item.instrmInfo,
	    			tradeName: item.tradeName,
	    			specs: item.specs,
	    			materialType: item.materialType,
	    			batchNo: item.batchNo,
	    			approvalNo: item.approvalNo,
	    			produceDate: item.produceDate,
	    			producerInfo: {id: producerInfo},
	    			validDate: item.validDate,
	    			companyInfo: item.instrmInfo.companyInfo,
	    			buyPrice: item.buyPrice,
	    			salePrice: item.salePrice,
	    			outSum: item.outSum,
	    			minUnit: miniUnit,
	    			buyCost: item.buyCost,
	    			saleCose: item.saleCose,
	    			outOper: user.name,
//	    			outOper: '',
	    			outTime: item.outTime,
	    			outputState: '2',
	    			applyFlag: item.applyFlag,
	    			comm:item.comm,
//	    			companyInfo: {id: companyInfo},
	    		});
	    	}

//	    	console.info("outStockList", outStockList);

	    	const {data} = yield call(saveOutput, outStockList);
	    	if (data){
	    		if ( data.success ){
 					notification.success({
		    			message: "提示",
		    			description: "保存成功",
		    		});
//			    	console.info("保存出库信息-完成", data, dataOutStock);
		    		dataOutStock.splice(0, dataOutStock.length); 
//			    	console.info("保存出库信息-完成", data, dataOutStock);
		    		yield put({type: 'setState', payload: {dataOutStock}});
		    		yield put({type: 'loadStore', payload: {query: {deptId: user.loginDepartment.id}}});
	    		}else{
//	    			baseUtil.alert("交易失败!"+ data.msg );
 					notification.error({
		    			message: '错误',
		    			description: data.msg,
		    		});
	    		}
	    			
	    	} 
	    	yield put({type: 'setState',payload:{spin:false}});
//	    	console.info("保存出库信息-完成", data, dataOutStock);
	    },
	    // 7、根据科室加载送领人
	    *loadUserByDept({deptId},{call,put}){
//	    	console.info("loadUserByDept======", deptId);
	    	const {data} = yield call(loadUsersByDept, deptId);
//	    	console.info("加载领送人", data);
	    	if( data && data.result ){
		    	yield put({type: 'setState',payload:{userData: data.result}});
	    	}
	    },
	    // 8、保存明细出库数量
	    *modifyCol({index, record},{select, put}){
//	    	console.info("modifyCol", index, record);
	    	const { dataOutStock } = yield select(state=>state.outStock);
	    	if( dataOutStock instanceof Array && dataOutStock.length > index ){
	    		dataOutStock[index] = record;
	  			yield put({type: 'setState', payload: {dataOutStock}});
	  		}
//	    	console.info("完成modifyCol!!!!", dataOutStock);
	    },

	},
		
		// 下拉选择药房数据以及库存searchBar查询

	reducers: {
		"init"(state,{data, page}) {
			let {result } = data;
			var data=result||[];
			return { ...state, data:data, page};
		},
		"setState"(state,{payload}){
//			console.info("setState", payload);
			return { ...state,...payload}
		},
	},
};
