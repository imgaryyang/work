import dva from 'dva';
import moment from 'moment';
import { loadSearchBar,loadApply,saveApply,deleteApply} from '../../services/pharmacy/InstockService';
import { loadStoreInfoPage } from '../../services/pharmacy/StoreInfoService';
import { getOptions } from '../../services/UtilsService';
import { loadDeptByTypes } from '../../services/base/DeptService';
import { loadUsersByDept } from '../../services/base/UserDeptService';
import { saveOutput } from '../../services/pharmacy/OutputInfoService';
import { notification } from 'antd';
var menu = [];
export default {
	namespace: 'outStock',
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
		tradeName: '', //药品名称查询条件
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
//			console.info("outStock_inventory_load", payload );
			const { page, query } = payload || {};
			const { tradeName } = query;
	    	yield put({type: 'setState',payload:{spin:true}});
//			console.info("outStock_inventory_load-----page------query-", payload, tradeName );
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
	    	yield put({type: 'setState',payload:{spin:false, tradeName: tradeName}});
	    	
//	    	if ( data && data.result ){
//		    	for( let item of data.result ){
//		    		if( item.drugInfo && item.drugInfo.packQty > 0){
//			    		item.storeSum = item.storeSum / item.drugInfo.packQty;
//			    		item.storeSumMin = item.storeSum % item.drugInfo.packQty;
//			    		console.info("=====1===========",item.storeSum,item.storeSumMin,item.storeSum,item.drugInfo.packQty);
//		    		} else {
//		    			item.storeSum = 0;
//		    		}
//		    	}
//	    	}
//	    	console.info("call_loadStoreSumInfoPage_ret——newData", data );

	    },
		// 3、添加出库明细
	    *addOutStockDetail({record}, {select, call, put}){
	    	let {dataOutStock} = yield select(state=>state.outStock);
//	    	console.info("添加出库明细", record, dataOutStock);
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
//	    		console.info("请添加出库药品", dataOutStock);
	    		notification.info({
	    			message: '提示',
	    			description: '请添加出库药品!',
	    		});
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
//	    		console.info("item", item.outSum);
	    		if( !item.outSum || item.outSum <= 0){
	    			notification.info({
		    			message: "提示",
		    			description: "请输入药品【"+ item.tradeName +"】出库数量",
		    		});
	    			yield put({type: 'setState',payload:{spin:false}});
	    			return;
	    		}
//	    		console.info("--", item.outSum , item.drugInfo.packQty, item.storeSum);
	    		if( item.outSum * item.drugInfo.packQty > item.storeSum ){
	    			notification.info({
		    			message: "提示",
		    			description: "药品【"+ item.tradeName +"】出库数量不能大于库存数量",
		    		});
	    			yield put({type: 'setState',payload:{spin:false}});
	    			return;
	    		}
	    		
	    		i++;
//	    		console.info("dataOutStock.for",  item);
	    		const producerInfo = item.companyInfo ? item.companyInfo.id : null;
	    		const companyInfo = item.companySupply ? item.companySupply.id : null;
	    		const drugInfo = item.drugInfo ? item.drugInfo.id : null;
	    		outStockList.push({
	    			hosId: item.hosId,
	    			deptInfo: {id: user.loginDepartment.id},
	    			toDept: {id: value.toDept},
	    			outType: value.outType,
	    			billNo: i,
//	    			plusMinus: '1',
//	    			storeId: item.id,
//	    			drugCode: item.drugCode,
	    			drugInfo: {id: drugInfo},
	    			tradeName: item.tradeName,
	    			specs: item.specs,
	    			drugType: item.drugType,
	    			batchNo: item.batchNo,
	    			approvalNo: item.approvalNo,
	    			produceDate: item.produceDate,
	    			producerInfo: {id: producerInfo},
	    			validDate: item.validDate,
	    			companyInfo: {id: companyInfo},
	    			buyPrice: item.buyPrice,
	    			salePrice: item.salePrice,
	    			outSum: item.outSum,
	    			minUnit: item.minUnit,
	    			buyCost: item.buyCost,
	    			saleCose: item.saleCose,
	    			outOper: user.name,
//	    			outOper: '',
	    			outTime: item.outTime,
	    			outputState: '2',
	    			applyFlag: item.applyFlag,
	    			comm:item.comm,
	    		});
	    	}

//	    	console.info("outStockList", outStockList);

	    	const {data} = yield call(saveOutput, outStockList);
	    	if (data){
	    		if ( data.success ){
		    		notification.success({
		    			message: '提示',
		    			description: "出库成功",
		    		});
		    		dataOutStock.splice(0, dataOutStock.length); 
		    		const { tradeName } = yield select( state=>state.outStock );
		    		console.info("tradeName", tradeName);
		    		yield put({type: 'setState', payload: {dataOutStock}});
		    		yield put({type: 'loadStore', payload: {query: {deptId: user.loginDepartment.id, tradeName: tradeName}}});
	    		}else{
		    		notification.error({
		    			message: '错误',
		    			description: data.msg,
		    		});
	    		}
	    			
	    	} 
	    	yield put({type: 'setState',payload:{spin:false}});
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
//dataOutStock.forEach((item, index)=>{
//if( !item.outSum || item.outSum <= 0){
//	notification.info("请输入药品"+ item.tradeName +"出库数量");
////	put({type: 'setState',payload:{spin:false}});
//	return;
//}
//console.info("dataOutStock.forEach", index, item);
//outStockList.push({
//	hosId: item.hosId,
////	outId: tmp+index,
////	applyNo: tmp,
//	billNo: index,
//	deptId: user.loginDepartment.id,
////	deptId: '',
////	toDept: value.toDept,
//	toDept: '',
//	outType: value.outType,
//	plusMinus: '1',
//	storeId: item.id,
//	drugCode: item.drugCode,
//	drugId: item.drugInfo.id,
//	tradeName: item.tradeName,
//	specs: item.specs,
//	drugType: item.drugType,
//	batchNo: item.batchNo,
//	approvalNo: item.approvalNo,
//	produceDate: item.produceDate,
//	producer: item.companyInfo.id,
////	producer: '',
//	validDate: item.validDate,
//	company: '',
//	buyPrice: item.buyPrice,
//	salePrice: item.salePrice,
//	outSum: item.outSum,
//	minUnit: item.minUnit,
//	buyCost: item.buyCost,
//	saleCose: item.saleCose,
//	outOper: user.name,
////	outOper: '',
//	outTime: item.outTime,
//	outputState: '1',
//	applyFlag: item.applyFlag,
//	comm:item.comm,
//})
//})