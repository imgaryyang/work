import moment from 'moment';
import { notification } from 'antd';
import {loadCompany} from '../../services/material/DirectInService';
import * as buyBillService from '../../services/material/BuyBillService';
import * as buyDetailService from '../../services/material/BuyDetailService';
import * as storeInfoService from '../../services/material/StoreInfoService';

export default {
  namespace: 'procureDeptInstock',

  state: {
    buyList: {
      page: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
      data: [],
    },
    buyDetail: {
      page: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
      data: [],

    },
    buyHis: {
      page: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
      data: [],
    },
    company:'',
	companyInfo:[],
    isSpin: false,
  },

  effects: {
    // 1、加载物资采购单列表
    *loadBuyList({ payload }, { select, call, put }) {
      console.info('加载采购单列表！！！！', payload);
      yield put({type: 'setState',payload:{isSpin:true}});
      const { page, query } = (payload || {});
      const defaultPage = yield select(state => state.procureDeptInstock.buyList.page);
      const newPage = {
        ...defaultPage,
        ...page,
      };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;
      // 获取采购单列表信息，翻页
      console.info('|||||||||||||', query);
      
      query.deptId='';
      
      console.info('tiger！！！！', query);
      
      const { data } = yield call(buyBillService.loadBuyBillPage, start, pageSize, query);
      console.info('+++data+++', data);
      if (data) {
      // 更新state，刷新页面
        yield put({ type: 'updateBuyList', data: data.result, page: newPage });
      }
      //获取供货商下拉列表
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
	  
	  yield put({type: 'setState',payload:{isSpin:false}});
    },

    // 2、查询采购单明细
    *loadBuyDetail({ payload }, { select, call, put }) {
      console.info('进入model-loadBuyDetail!!!!', payload);
      yield put({type: 'setState',payload:{isSpin:true}});
      const { page, query, record } = (payload || {});
      console.info('完成model-loadBuyDetail!!!!', query);
      const { buyDetail } = yield select(state => state.procureDeptInstock);
      console.info('buyDetail', buyDetail);
      const newPage = {
        ...buyDetail.page,
        ...page,
      };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;

      const { data } = yield call(buyDetailService.loadBuyDetail, start, pageSize, query);
      if (data && data.result) {
    	  for( let o of data.result ){
    		  o.inNum = o.auitdNum;
    	  }
        const newDetail = {
          ...buyDetail,
          data: data.result,
          ...record,
        };
        yield put({ type: 'setState', payload: { buyDetail: newDetail } });
      }
      yield put({type: 'setState',payload:{isSpin:false}});
      console.info('完成model-loadBuyDetail!!!!', data);
    },

    // 4、入库保存
    *saveBuy({ payload }, { select, call, put }) {
      yield put({type: 'setState',payload:{isSpin:true}});
      
      const { buyState, id } = payload || {};
      const { user } = yield select(state => state.base);
      const { buyDetail,company } = yield select(state => state.procureDeptInstock);
	  
      
//      if (user&&user.success){
//      }
      const userName = user.name;
      const newBuy = { id, buyState, updateOper: user.name,company,buyDetail:buyDetail.data};
      //console.info('tiger---------newBuy---------',newBuy);
      const { data: ret } = yield call(buyBillService.MatInstockCommit, newBuy);//保存主表
      if (ret && ret.success) {

          yield put({ type: 'loadBuyList', payload: { query: { buyState: '2'} } });
          yield put({ type: 'setState', payload: { buyDetail: { data: [] } } });
          
//    	  sconsole.info('tiger---------buyList---------',loadBuyList);
			notification.success({
		        message: '提示',
		        description: '入库成功！',
		    });
    }else{
    	 notification.error({
             message: '错误',
             description: '入库失败!',
           });
    }
      yield put({type: 'setState',payload:{isSpin:false}});
  },
 },

  reducers: {
    updateBuyList(state, { data, page }) {
      const { buyList } = state;

      const { total } = page;

      const newPage = { ...buyList.page, total };
      const newBuyList = { ...buyList, data, page: newPage };
      return {
        ...state,
        buyList: newBuyList,
      };
    },

    delete(state, { id }) {
      const { buy } = state;
      const index = buy.data.findIndex(value => value.id === id);
      buy.data.splice(index, 1);
      return {
        ...state,
        buy,
      };
    },

    setState(state, { payload }) {
      return { ...state, ...payload };
    },

    togglebuyDetailSpin(state) {
      const { buyDetail } = state;
      const newBuy = { ...buyDetail, isSpin: !buyDetail.isSpin };
      return { ...state, buyDetail: newBuy };
    },

    toggleDrugSpin(state) {
      const { drug } = state;
      const newDrug = { ...drug, isSpin: !drug.isSpin };
      return { ...state, drug: newDrug };
    },
  },
};
