import { loadOrderPage,loadDetails } from '../../services/payment/OrderService';
import { loadSettlePage } from '../../services/payment/SettleService';
export default {

  namespace: 'transaction',

  state: {
   orderList:[],
   orderPage: { total: 0, pageSize: 10, pageNo: 1 },
   orderQuery:{},
   
   order:{},
   
   settlePage: { total: 0, pageSize: 0, pageNo: 1 },
   settleQuery:{},
   settlement:{}
  },

  effects: {
    *loadOrders({ payload }, { select, call, put }) {
      const { orderQuery,page } = payload||{};
      const defaultQuery = yield select(state => state.transaction.orderQuery);
      const defaultPage = yield select(state => state.transaction.orderPage);
      const { pageSize, pageNo } = {...defaultPage,...page};
      var start = (pageNo-1)*pageSize ;
      var limit = pageSize ;
      var param = orderQuery || defaultQuery;
      yield put({ 
    	  type: 'setState',
    	  payload: {
    		  spin: true ,
    		  orderQuery:param,
    	  }
      });
      
      const { data } = yield call(loadOrderPage, start,limit,param);
      yield put({ type: 'setState', payload: { spin: false } });
      if (data && data.success) {
    	  var { total,result } = data;
    	  var p = { ...defaultPage,...page, total : total };
    	  yield put({
    		  type : 'setState',
    		  payload : { orderList: result||[], orderPage:p},
    	  })
      }
    },
    *loadSettles({ payload }, { select, call, put }) {
    	console.info("loadSettles", payload);
        const { settleQuery, page, order } = payload||{};
        const defaultQuery = yield select(state => state.transaction.settleQuery);
        const defaultPage = yield select(state => state.transaction.settlePage);
        const { pageSize, pageNo } = {...defaultPage,...page};
        var start = (pageNo-1)*pageSize ;
        var limit = pageSize ;
        var param = settleQuery || defaultQuery;
        yield put({ 
      	  type: 'setState',
      	  payload: {
      		  spin: true ,
      		  settleQuery: param,
      		  order: order,
      	  }
        });
        
        const { data } = yield call(loadSettlePage, start,limit,{...param, order});
        yield put({ type: 'setState', payload: { spin: false } });
        if (data && data.success) {
      	  var { total,result } = data;
      	  var p = { ...defaultPage,...page, total : total };
      	  yield put({
      		  type : 'setState',
      		  payload : { settleList: result||[], settlePage:p,},
      	  })
        }
      },
  },

  reducers: {

    init(state, { data, page }) {
      const { result, total } = data;
      const p = { ...state.page, ...page, total };
      const users = result || [];
      return { ...state, data: users, page: p };
    },

    setState(oldState, { payload }) {
      return { ...oldState, ...payload };
    },

  },
};
