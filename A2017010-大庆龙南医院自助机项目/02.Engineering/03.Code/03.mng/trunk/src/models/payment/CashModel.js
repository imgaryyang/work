import { loadBatchs,loadDetails,exportBatchs } from '../../services/payment/CashService';

export default {

  namespace: 'cash',

  state: {
   batchList:[],
   batchPage: { total: 0, pageSize: 10, pageNo: 1 },
   batchQuery:{},
   
   batch:{},
   
   settlePage: { total: 0, pageSize: 10, pageNo: 1 },
   settleQuery:{},
   settleQuery:{},
   settlement:[],
   spin: false,
   visible: false,
  },

  effects: {
    *loadBatchs({ payload }, { select, call, put }) {
      const { batchQuery, page } = payload ||{};
      console.info("batchQuery", batchQuery);
      const defaultQuery = yield select(state => state.cash.batchQuery);
      console.info("defaultQuery", defaultQuery);
      const defaultPage = yield select(state => state.cash.batchPage);
      const { pageSize, pageNo } = {...defaultPage, ...page};
      var start = (pageNo-1)*pageSize ;
      var limit = pageSize ;
      var param = batchQuery || defaultQuery;
      yield put({ 
    	  type: 'setState',
    	  payload: {
    		  spin: true ,
    		  batchQuery: param,
    	  }
      });
      const { data } = yield call(loadBatchs, start, limit, param);
      console.info('loadBatchs ',data);
      yield put({ type: 'setState', payload: { spin: false } });
      if (data && data.success) {
    	  var { total, result } = data;
    	  let p = { ...defaultPage, ...page, total : total };
    	  yield put({
    		  type : 'setState',
    		  payload : { batchList: result||[], batchPage:p},
    	  })
      }
    },
    *showDetails({ payload }, { select, call, put }) {
      const user = yield select(state => state.user.record);
      const account = { ...payload.account, userId: user.id };
      yield put({ type: 'setState', payload: { spin: true } });

      const { data } = yield call(saveAccount, account);

      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            spin: false,
            record: {},
          },
        });
        yield put({
          type: 'loadUserAccounts',
        });
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
