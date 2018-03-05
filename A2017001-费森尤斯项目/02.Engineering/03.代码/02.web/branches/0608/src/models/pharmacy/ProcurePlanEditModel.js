import { merge } from 'lodash';
import * as drugInfoService from '../../services/pharmacy/DrugInfoService';
import * as buyBillService from '../../services/pharmacy/BuyBillService';
import * as buyDetailService from '../../services/pharmacy/BuyDetailService';
import * as storeInfo from '../../services/pharmacy/StoreInfoService';
import * as storeSumInfo from '../../services/pharmacy/StoreSumInfoService';
import { getOptions } from '../../services/UtilsService';
import baseUtil from "../../utils/baseUtil"
import { notification } from 'antd';
export default {
  namespace: 'procurePlanEdit',

  state: {
	drug:{
		page: {
		  total: 0,
		  pageSize: 10,
		  pageNo: 1,
		},
		data: [],
    },
	buy:{
		buyDetail: [],
	},
    isSpin: false,
    buyListData: [],
    currentBuyBill:''
  },

  effects: {
    // 查询采购单列表
    *loadBuyList({ payload }, { select, call, put }) {
      console.log("Model -> loadBuyList...");
      
      yield put({ type: 'toggleSpin' });
      const { query } = (payload || {});
      
      const { data } = yield call(buyBillService.loadBuyBill, query);

      if (data) {
        yield put({ type: 'setState', payload: { buyListData: data.result}});
      }
      yield put({ type: 'toggleSpin' });
    },

    *loadDrug({ payload }, { select, call, put }) {
      yield put({ type: 'setState', payload: {isSpin: true}});
      const { page, query } = (payload || {});
      const procurePlanEdit = yield select(state => state.procurePlanEdit);
      const defaultPage = procurePlanEdit.drug.page;
      const newPage = {
        ...defaultPage,
        ...page,
      };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;
      // 获取药品信息，翻页
      const { data } = yield call(drugInfoService.loadDrugInfoPage, start, pageSize, query);
      if (data) {
    	// 更新state，刷新页面
    	newPage.total = data.total;
    	const drug = { data:data.result, page:newPage, query };
    	procurePlanEdit.drug = drug;

        yield put({ type: 'setState', payload:{...procurePlanEdit} });
      }
      yield put({ type: 'setState', payload: {isSpin: false}});
    },

    *forAddBuy({ record }, { select, call, put }) {
      // 请先选择需要修改的采购单
        const { currentBuyBill } = yield select(state => state.procurePlanEdit);
        if (currentBuyBill == ''){
          notification.error({
                  message: '提示',
                  description: `请先选择需要修改的采购单`,
            });
            return;
          }

      yield put({ type: 'setState', payload: {isSpin: true}});

    	// 获取药品信息
    	
    	const data = record || {};
    	const { user } = yield select(state=>state.base);
    	const { buy } = yield select(state => state.procurePlanEdit) || {};
    	
    	// 获取本科库存
    	const conditions = {
    			drugInfo: {id: data.id},
    			deptId: user.loginDepartment.id,
    			hosId: user.hosId 
    	}
    	let storeDept = 0;
    	const {data : store } = yield call(storeSumInfo.listStoreSumInfo, conditions);
    	if( store && store.result ){
    		if( store.result.length > 0){
        		for( let item of store.result ){
        			storeDept += item.storeSum;
        		}
//        		if ( data.packQty > 0 ){
//            		storeDept = storeDept/store.result[0].drugInfo.packQty;
//        		}
    		}
    	} else {
    		//报错
    	}
    	
    	// 获取全院库存
    	const conditions1 = {
    			drugInfo: {id: data.id},
    			hosId: user.hosId 
    	}
    	let storeSum = 0;
    	const {data : store1} = yield call(storeSumInfo.listStoreSumInfo, conditions1);
    	if( store1 && store1.result ){
    		if ( store1.result.length > 0 ){
    			for( let item of store.result ){
    				storeSum += item.storeSum;
        		}
			} else if ( store1.result.length == 0 ){
				storeSum = 0 ;
			} else {
				//报错
			}
//    		if ( store1.result.length == 1 && data.packQty > 0){
//    			storeSum = store1.result[0].storeSum/data.packQty;
//    		} else if ( store1.result.length == 0 ){
//    			storeSum = 0 ;
//    		} else {
//    			//报错
//    		}
    	} else {
    		//报错
    	}
		let companyId = "";
		let companyName = "";
    	if( data.companyInfo ) {
    		companyId = data.companyInfo.id;
    		companyName = data.companyInfo.companyName;
    	}
        let newData = {
            	drugInfo: {id:data.id, packQty: data.packQty},
            	drugCode: data.drugCode,
            	tradeName: data.tradeName,
            	specs: data.drugSpecs,
            	buyUnit: data.packUnit,
            	storeDept: storeDept,
            	storeSum: storeSum,
            	miniUnit: data.miniUnit,
            	producer: {
            		id: companyId,
            		companyName: companyName,
            		},
            	buyPrice: data.buyPrice,
            	buyCost: 0.00,
            	plusMinus: '1',
            	buyBill: buy.buyBill,
            }; 
// const store = {drugId:data.id};
        if( !buy.buyDetail ){
        	buy.buyDetail = [];
        	buy.buyDetail.push(newData);
        	yield put({ type: 'setState', payload: {buy}});
        }
        else if(!buy.buyDetail.find( value=>value.drugCode == newData.drugCode ))
        {
	        // 获取库存

        	buy.buyDetail.push(newData);
	        // 更新state，刷新页面
	        yield put({ type: 'setState', payload: {buy}});
        }

        yield put({ type: 'setState', payload: {isSpin: false}});
      },

    // 查询修改的采购单及明细
    *loadBuy({ payload }, { select, call, put }) {
      console.log("Model -> loadBuy...");

      yield put({ type: 'setState', payload: {isSpin: true}});
        
        const { query } = (payload || {});
          const { user } = yield select(state=>state.base);
        const { buy } = yield select( state=>state.procurePlan );
        
        const {data: buyBill} = yield call( buyBillService.loadBuyBill, query );
        console.log("Model -> loadBuy -> buyBill:", buyBill);
        let newBuy = {};
        if( buyBill.result && buyBill.result.length == 1 ){
          newBuy = {...buyBill.result[0]};
          const billId = {buyBill: newBuy.buyBill};
          const {data: buyDetail} = yield call( buyDetailService.loadBuyDetailList, query );
          if( buyDetail && buyDetail.result && buyDetail.result.length > 0 ){
            for( let item of buyDetail.result ){

                // 本科室库存
              const conditions = {
                    drugInfo: {id: item.drugInfo.id},
                    deptId: user.loginDepartment.id,
                    hosId: user.hosId 
                }
              
                let storeDept = 0;
                const {data : store } = yield call(storeSumInfo.listStoreSumInfo, conditions);
                if( store && store.result ){
                  if( store.result.length > 0){
                      for( let i of store.result ){
                        storeDept += i.storeSum;
                      }
                      item.storeDept = storeDept;
                      item.packQty = store.result[0].drugInfo.packQty;
                      item.packUnit = store.result[0].drugInfo.packUnit;
                      item.miniUnit = store.result[0].drugInfo.miniUnit;
                  }
                } else {
                  //报错
                }
                // 获取全院库存
                const conditions1 = {
                    drugInfo: {id: item.drugInfo.id},
                    hosId: user.hosId 
                }
                let storeSum = 0;
                const {data : store1} = yield call(storeSumInfo.listStoreSumInfo, conditions1);
                if( store1 && store1.result ){
                  if ( store1.result.length >0 ){
                    for( let i of store.result ){
                      storeSum += i.storeSum;
                      }
                    item.storeSum = storeSum;
                    item.packQty = store1.result[0].drugInfo.packQty;
                    item.packUnit = store1.result[0].drugInfo.packUnit;
                    item.miniUnit = store1.result[0].drugInfo.miniUnit;
                } else {
                  //报错
                }

              }
            }
              newBuy = { ...newBuy, buyDetail: buyDetail.result};
          }
        } else if( buyBill.result.length > 1) {
          
        } else {
          newBuy = { buyDetail:[] };
        }
      
      
        yield put({ type: 'setState', payload: {buy: newBuy, isSpin: false}});

      },

      // 保存提交 
	*saveBuy({buyState}, { select, call, put }) {
		 
		// 批量保存
    	yield put({ type: 'setState', payload: {isSpin: true}});
 		const {buy} = yield select(state=>state.procurePlanEdit);
 		const {user} = yield select(state=>state.base);
 		
 		if( buy.buyDetail && buy.buyDetail.length > 0 ){
 			let buyCost = 0;
 	 		for( let item of buy.buyDetail ){
 	 			if( item.buyPrice <= 0 || !item.buyNum || item.buyNum <= 0 ){
 					notification.info({
		    			message: '提示',
		    			description: "请输入药品【"+ item.tradeName +"】的采购单价和数量",
		    		});
	    			yield put({ type: 'setState', payload: {isSpin: false}});
	    			return;
	    		}
 	 			item.buyCost = item.buyPrice*item.buyNum;
 	 			buyCost += item.buyCost;
 	 		}
 	 		const newBuy = {...buy, deptId: user.loginDepartment.id, createOper: user.name, buyState, buyCost };
 	 		
 	 		const { data : ret } = yield call(buyBillService.SaveBuyBillList, newBuy);
 			if (ret){
 				if (ret.success){
 					notification.success({
		    			message: '提示',
		    			description: "保存成功",
		    		});
 					//yield put({ type: 'loadBuy' });
          yield put({ type: 'setState', payload: {
            buy:{
            buyDetail: [],
          },
          currentBuyBill: ''}});
 				}else {
 					notification.error({
		    			message: '提示',
		    			description: ret.msg,
		    		});
 				}
 			} else {
 				notification.error({
	    			message: '提示',
	    			description: "交易失败！",
	    		});
 			}


 		 }
 		yield put({ type: 'setState', payload: {isSpin: false}});
	},

    *deleteBuyDetail({record}, { select, call, put }) {
		if( record && record.id ){
	        const { data } = yield call(buyDetailService.deleteBuyDetail, record.id);

	        if ( data ){
	        	if( data.success ){
	        		notification.success({
		    			message: '提示',
		    			description: "删除成功",
		    		});
	        	} else {
	        		notification.error({
		    			message: '提示',
		    			description: data.msg,
		    		});
	        	}
	        }
		}
		yield put({type: 'delete', id: record.drugInfo.id });
        
      },
     *deleteBuy({}, { select, call, put }) {
  		yield put({ type: 'setState', payload: {isSpin: true}});
		const {buy} = yield select( state=>state.procurePlanEdit);
  		//buy.id为空 表明无需删除数据库数据，只需清空前台数据
  		if( buy && buy.id ){
  	        const { data } = yield call(buyBillService.deleteBill, buy.id);
  	  		if (data && data.success) {
  	  			const newBuy = { page: buy.page };
  	  			yield put({type: 'setState', 
  	  					   payload: {
  	  						   buy:newBuy
  	  						   },
  	  					 });
  	  		}
  		} else {
  			const newBuy = { page: buy.page };
  			yield put({type: 'setState', 
  					   payload: {
  						   buy:newBuy
  						   },
  					 });
  		}
  		yield put({ type: 'setState', payload: {isSpin: false}});
      },

  },

  reducers: {
    'initDrug'(state, { initData, page }) {
      const { drug } = state;
      
      const { result } = initData;
      const data = result || [];
      
      const newDrug = { ...drug, data, page };
      return {
        ...state,
        drug:newDrug,
      };
    },
	'delete'(state, { id }) {
          const { buy } = state;
          
          const index = buy.buyDetail.findIndex( value=>value.drugInfo.id == id );
          if( index != -1){
              buy.buyDetail.splice(index, 1);
          }
          return {
            ...state,
            buy,
          };
        },
	'setState'(state, { payload }) {
    	return { ...state, ...payload };
	},
	'toggleSpin'(state) {
		let {isSpin} = state;
		return { ...state, isSpin: !isSpin };
	},
  },
};
