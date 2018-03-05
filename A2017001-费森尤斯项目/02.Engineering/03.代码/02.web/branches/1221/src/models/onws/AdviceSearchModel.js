import { merge } from 'lodash';
import { notification } from 'antd';
import * as AdviceService from '../../services/odws/OrderService';

export default {
  namespace: 'advice',

  state: {
    namespace: 'advice',
    defaultPage: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    itemCount: {},
    totalAmt: 0,
    selectedRowKeys: [],
    data: [],
    neworders: [],
    isSpin: false,
    dicts: {},
    searchObjs: {},
    patient: {},
    payWays: [],
    visible: false,
    record: {},
    result: {},
    isModalSpin: false,
  },

  effects: {
    *withdrawal({ payload }, { select, call, put }) {
      const { recipeId: query } = (payload || {});
      console.log(query);
      const { data } = yield call(AdviceService.withDrawal, query);
      if (data.result) {
        notification.info({ message: '提示信息：', description: '申请退药成功' });
      }
    },
    *load({ payload }, { select, call, put }) {
      const { query } = (payload || {});
      // yield put({ type: 'setState', payload: { searchObjs: query } });
      let { page } = (payload || {});
      const defaultPage = yield select(state => state.advice.defaultPage);
      let searchObjs = yield select(state => state.advice.searchObjs);
      page = { ...defaultPage, ...page };
      searchObjs = { ...searchObjs, ...query };
      const { pageNo, pageSize } = page;
      const start = (pageNo - 1) * pageSize;

      yield put({ type: 'toggleSpin' });
      console.log(111);
      const { data } = yield call(AdviceService.loadAdviceInfoPage, start, pageSize, searchObjs);
      console.log(data);
      //const neworders = [];
      //const itemCount = {}; 
      //let totalAmt = 0;
      let recipeId;
      for (let i = 0; i < data.result.length; i++) {
        const neworders = [];
        const theOrder = data.result[i].orders;
        for (let j = 0; j < theOrder.length; j++) {
          console.log(theOrder[j].recipeId);
          if (theOrder[j].recipeId !== recipeId) {
             // 增加处方号空行
            neworders.push({
              id: `${theOrder[j].recipeId}_${j}`,
              recipeId: theOrder[j].recipeId,
              drugFlag: theOrder[j].drugFlag,
              regId: theOrder[j].regId,
            });
            recipeId = theOrder[j].recipeId;
          }
          neworders.push(theOrder[j]);
        }
        data.result[i].orders = neworders;
        //totalAmt += theOrder.salePrice * theOrder.qty;
          // 记录处方对应的明细项数量
        //itemCount[theOrder.recipeId] = (itemCount[theOrder.recipeId] || 0) + 1;
      }
    /* yield put({
        type: 'setState',
        payload: {
          itemCount,
          totalAmt,
        },
      });*/
      yield put({ type: 'toggleSpin' });
      if (data) {
        yield put({ type: 'init', data, page });
      }
    },


    *loadBack({ payload }, { select, call, put }) {
      const { query } = (payload || {});
      // yield put({ type: 'setState', payload: { searchObjs: query } });
      let { page } = (payload || {});
      const defaultPage = yield select(state => state.advice.defaultPage);
      let searchObjs = yield select(state => state.advice.searchObjs);
      page = { ...defaultPage, ...page };
      searchObjs = { ...searchObjs, ...query };
      const { pageNo, pageSize } = page;
      const start = (pageNo - 1) * pageSize;

      yield put({ type: 'toggleSpin' });
      const { data } = yield call(AdviceService.loadBack, start, pageSize, searchObjs);
      console.log(data);
      yield put({ type: 'toggleSpin' });

      if (data) {
        yield put({ type: 'init', data, page });
      }
    },

  },

  reducers: {
    init(state, { data, page }) {
      const { result, total } = data;
      const resPage = { ...state.page, ...page, total };
      const resData = result || [];
      return { ...state, data: resData, page: resPage };
    },

    setState(state, { payload }) {
      return { ...state, ...payload };
    },

    toggleSpin(state) {
      return { ...state, isSpin: !state.isSpin };
    },

    toggleModalSpin(state) {
      return { ...state, isModalSpin: !state.isModalSpin };
    },

    toggleVisible(state) {
      return { ...state, visible: !state.visible };
    },

    setSearchObjs(state, { payload: searchObj }) {
      if (searchObj) {
        const searchObjs = merge(state.searchObjs, searchObj);
        return { ...state, searchObjs };
      } else {
        return { ...state, searchObjs: {} };
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/onws/treatment/search') {
          dispatch({
            type: 'utils/initDicts',
            payload: ['GROUP_TYPE', 'REG_LEVEL', 'DEPT_TYPE', 'REG_STATE', 'FEE_TYPE', 'PAY_MODE', 'USAGE'],
          });
        }
      });
    },
  },
};
