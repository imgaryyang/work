import { merge } from 'lodash';
import * as materialInfoService from '../../services/material/MatInfoService';
import * as buyBillService from '../../services/material/BuyBillService';
import * as buyDetailService from '../../services/material/BuyDetailService';
import * as storeInfo from '../../services/material/StoreInfoService';
import * as storeSumInfo from '../../services/material/StoreSumInfoService';
import { getOptions } from '../../services/UtilsService';
import baseUtil from "../../utils/baseUtil";
import { notification } from 'antd';
export default {
  namespace: 'materialProcurePlan',

  state: {
  material:{
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
  },

  effects: {
    /** 后台接口服务
     * 1、物资查询+翻页   materialInfo
     * 2、库存信息查询   materialStoreInfo
     * 3、采购单保/暂存  materialBuyBill + materialBuyDetail
     * 4、查询暂存采购单信息 materialBuyBill
     */
    
    /** model方法
     *  1、查询物资信息 + 翻页
     *  2、添加物资到采购单
     *  3、新建
     *  4、保存+暂存
     *  5、查询暂存采购单信息
     */
    
  *loadMaterial({ payload }, { select, call, put }) {
      
      yield put({type: 'setState',payload:{isSpin:true}});
      const { page, query } = (payload || {});
      const procurePlan = yield select(state => state.materialProcurePlan);
      const defaultPage = procurePlan.material.page;
      const newPage = {
        ...defaultPage,
        ...page,
      };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;
      // 获取药品信息，翻页
//      
      const { data } = yield call(materialInfoService.loadMaterialInfoPage, start, pageSize, query);
//      
      if (data) {
      // 更新state，刷新页面
      newPage.total = data.total;
      const material = { data:data.result, page:newPage, query};
      procurePlan.material = material;
//      
        yield put({ type: 'setState', payload:{...procurePlan} });
      }
//      
      yield put({type: 'setState',payload:{isSpin:false}});
    },

    *forAddBuy({ record }, { select, call, put }) {

      // 获取药品信息
//      
      yield put({type: 'setState',payload:{isSpin:true}});
      const data = record || {};
      const { user } = yield select(state=>state.base);
      const { buy } = yield select(state => state.materialProcurePlan) || {};
      
      // 获取本科库存
      const conditions = {
          materialInfo: {id: data.id},
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
        }
      } else {
        //报错
      }
//      
      
      // 获取全院库存
      const conditions1 = {
          materialInfo: {id: data.id},
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
      } else {
        //报错
      }
//      
    let companyId = "";
    let companyName = "";
      if( data.companyInfo ) {
        companyId = data.companyInfo.id;
        companyName = data.companyInfo.companyName;
      }
        let newData = {
              matInfo: {id:data.id.trim()},
              materialCode: data.materialCode,
              tradeName: data.commonName,
              materialSpecs: data.materialSpecs,
              buyUnit: data.materialUnit,
              minUnit: data.materialUnit,
              storeDept: storeDept,
              storeSum: storeSum,
              producer: {
                id: companyId.trim(),
                companyName: companyName,
                },
              buyPrice: data.buyPrice,
              buyCost: 0.00,
              plusMinus: '1',
              materialUnit: data.materialUnit,
//              buyBill: buy.buyBill,
            }; 
//      
        if( buy.buyDetail == null || buy.buyDetail.length == 0 ){
//          
          buy.buyDetail = [];
          buy.buyDetail.push(newData);
          yield put({ type: 'setState', payload: {buy}});
        }
        else if(!buy.buyDetail.find( value=>value.materialCode == newData.materialCode ))
        {
//          
          buy.buyDetail.push(newData);
          // 更新state，刷新页面
          yield put({ type: 'setState', payload: {buy}});
        }
        yield put({type: 'setState',payload:{isSpin:false}});
//        
      },
    *loadBuy({ payload }, { select, call, put }) {
        // 查询操作员采购单暂存记录
//        
        yield put({type: 'setState',payload:{isSpin:true}});
        
          const { page, query } = (payload || {});
          const defaultPage = yield select(state => state.materialProcurePlan.buy.page);
          const newPage = {
            ...defaultPage,
            ...page,
          };
          const { pageNo, pageSize } = newPage;
          const start = (pageNo - 1) * pageSize;
          
        const { user } = yield select(state=>state.base);
        const { buy } = yield select( state=>state.materialProcurePlan );
        const condBill = {
            createOperId: user.id || null,
            hosId: user.hosId || null,
            deptId: user.loginDepartment.id,
            buyState: '0',
        }
//        
        const {data: buyBill} = yield call( buyBillService.loadBuyBill, condBill );
//        
        
        let newBuy = {};
        if( buyBill && buyBill.result && buyBill.result.length == 1 ){
          newBuy = {...buyBill.result[0]};
          const billId = {buyBill: newBuy.buyBill};
          const {data: buyDetail} = yield call( buyDetailService.loadBuyDetail, start, pageSize, billId );
//            
          if( buyDetail && buyDetail.result && buyDetail.result.length > 0 ){
            for( let item of buyDetail.result ){
                // 获取本科库存
//              
              let matId = '';
              if( !item.matInfo ){
                notification.info({
                    message: "提示",
                    description: "物资【"+ item.tradeName +"】的信息无法关联",
                  });
              } else {
                matId = item.matInfo.id;
              }
              const conditions = {
                  materialInfo: {id: matId},
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
                }
               } else {
                  //报错
               }
//               
            // 获取全院库存
            const conditions1 = {
                materialInfo: {id: matId},
                hosId: user.hosId 
            }
            let storeSum = 0;
            const {data : store1} = yield call(storeSumInfo.listStoreSumInfo, conditions1);
            if( store1 && store1.result ){
              if ( store1.result.length > 0 ){
                for( let i of store.result ){
                  storeSum += i.storeSum;
                }
              } else if ( store1.result.length == 0 ){
                storeSum = 0 ;
              } else {
                //报错
              }
            } else {
              //报错
            }
//            
            item.storeSum = storeSum;
            item.storeDept = storeDept;
            }
//            
              newBuy = { ...newBuy, buyDetail: buyDetail.result};
          }
        } else if( buyBill && buyBill.result && buyBill.result.length > 1) {
          
        } else {
          newBuy = { buyDetail:[] };
        }
      
//        
        yield put({ type: 'setState', payload: {buy: newBuy}});
//        
        yield put({type: 'setState',payload:{isSpin:false}});
      },
  *saveBuy({buyState}, { select, call, put }) {
     
     // 批量保存
      yield put({type: 'setState',payload:{isSpin:true}});
    const {buy} = yield select(state=>state.materialProcurePlan);
    const {user} = yield select(state=>state.base);
    
    
    if( buy.buyDetail && buy.buyDetail.length > 0 ){
      let buyCost = 0;
      for( let item of buy.buyDetail ){
        if( item.buyPrice <= 0 || !item.buyNum || item.buyNum <= 0 ){
          notification.info({
              message: "提示",
              description: "请输入【"+ item.commonName +"】的采购单价和数量",
            });
//          baseUtil.alert("请输入"+ item.commonName +"的采购单价和数量");
            yield put({type: 'setState',payload:{isSpin:false}});
            return;
          }
        item.buyCost = item.buyPrice*item.buyNum;
        buyCost += item.buyCost;
//        
      }
      const newBuy = {...buy, deptId: user.loginDepartment.id, createOper: user.name, buyState, buyCost };
//      
      
      const { data : ret } = yield call(buyBillService.SaveBuyBillList, newBuy);
      if (ret){
        if (ret.success){
          notification.success({
              message: "提示",
              description: "采购单保存成功",
            });
          yield put({ type: 'loadBuy' });
        }else {
          notification.error({
              message: "提示",
              description: '交易失败：' + ret.msg,
            });
//          baseUtil.alert('交易失败：' + ret.msg );
        }
      } else {
        notification.error({
            message: "提示",
            description: '交易失败',
          });
//        baseUtil.alert('交易失败!!');
      }
     }
    yield put({type: 'setState',payload:{isSpin:false}});
  },

    *deleteBuyDetail({record}, { select, call, put }) {
//    
    if( record && record.id ){
          const { data } = yield call(buyDetailService.deleteBuyDetail, record.id);

          if ( data.success ){
        notification.success({
            message: "提示",
            description: '删除成功',
          });
          } else {
        notification.error({
            message: "提示",
            description: '删除失败：'+data.msg,
          });
        return;
          }
//        if ( !data || !data.success) {
//          baseUtil.alert('删除失败！');
//          return;
//        }
    }
    yield put({type: 'delete', id: record.matInfo.id });
        
//        
      },
     *deleteBuy({}, { select, call, put }) {
//      
      
    const {buy} = yield select( state=>state.materialProcurePlan);
//      
      //buy.id为空 表明无需删除数据库数据，只需清空前台数据
      if( buy && buy.id ){
        yield put({type: 'setState',payload:{isSpin:true}});
            const { data } = yield call(buyBillService.deleteBill, buy.id);
//          
          if (data && data.success) {
            const newBuy = { page: buy.page };
//            
            yield put({type: 'setState', 
                   payload: {
                     buy:newBuy
                     },
                 });
          }
          yield put({type: 'setState',payload:{isSpin:false}});
      } else {
        const newBuy = { page: buy.page };
//        
        yield put({type: 'setState', 
               payload: {
                 buy:newBuy
                 },
             });
      }
        
//        
      },
  },

  reducers: {

  'delete'(state, { id }) {
          const { buy } = state;
//          
          const index = buy.buyDetail.findIndex( value=>value.matInfo.id == id );
//          
          if( index != -1){
              buy.buyDetail.splice(index, 1);
          }
          return {
            ...state,
            buy,
          };
        },
  'setState'(state, { payload }) {
//        
      return { ...state, ...payload };
  },
  },
};
