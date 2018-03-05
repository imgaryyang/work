import { isEmpty } from 'lodash';
import * as InstockPlan from '../../services/material/InstockPlanService';
// import * as storeInfo from '../../services/pharmacy/StoreInfoService';

export default {
  namespace: 'instockPlan',

  state: {
    namespace: 'instockPlan',
    defaultPage: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    selectedRowKeys: [],
    page: {},
    pageRight: {},
    queryRight: {},
    data: [],
    result: {},
    isSpin: false,
    searchObj: {},
    instockData: [],
    instockPubData: {},
  },

  effects: {
    *loadApplyInPage({ payload = {} }, { select, call, put }) {
      const { query, page } = payload;
      const defaultPage = yield select(state => state.instockPlan.defaultPage);
      const newPage = { ...defaultPage, ...page };
      const searchObj = yield select(state => state.instockPlan.searchObj);
      const newQuery = { ...searchObj, ...query };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;

      yield put({ type: 'toggleSpin' });
      const { data } = yield call(InstockPlan.loadApplyInPage, start, pageSize, newQuery);
      console.log(data);
      yield put({ type: 'toggleSpin' });

      if (!isEmpty(newQuery)) {
        yield put({ type: 'setState', payload: { searchObj: newQuery } });
      }

      if (data) {
        yield put({ type: 'init', data, newPage });
      }
    },
    *addInstockDetail({ record, payload = {} }, { select, call, put }) {
      yield put({ type: 'toggleSpin' });
      const instockPlan = yield select(state => state.instockPlan);
      const { defaultPage, queryRight, record: oldRecord } = instockPlan;
      const { pageRightNew, queryRightCon, tradeName } = payload;
      const newRecord = { ...oldRecord, ...record };
      yield put({ type: 'setState', payload: { record: newRecord } });
      const appBill = newRecord[0];

      const newPage = { ...defaultPage, ...pageRightNew };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;
      const newQuery = { ...queryRight, ...queryRightCon, appBill, tradeName };

      const { data: { result } } = yield call(InstockPlan.loadApplyInDetailPage, start, pageSize, newQuery);
      // const { user: { loginDepartment: fromdeptId } } = yield select(state => state.base);
      // let sum = 0;

      if (result && result.length > 0) {
        // for (const item of result) {
        //   const conditions = {
        //     drugCode: item.drugCode,
        //     deptId: fromdeptId,
        //     batchNo: item.batchNo,
        //     approvalNo: item.approvalNo,
        //     hosId: item.hosId,
        //   };
        //
        //   const { data: { store: result } } = yield call(storeInfo.listStoreInfo, conditions);
        //   sum += item.buyCost;
        //   if (result.length > 0) {
        //     if (result[0].storeSum > 0) {
        //       item.storeSum = result[0].storeSum;
        //     } else {
        //       item.storeSum = 0;
        //     }
        //   } else {
        //     item.storeSum = 0;
        //   }
        // }
        yield put({
          type: 'setState',
          payload: {
            instockData: result,
            instockPubData: result[0],
            queryRight: newQuery,
            pageRight: newPage,
            // sum,
            searchSwitch: false,
          },
        });
      }

      yield put({ type: 'toggleSpin' });
    },
    *exportData({ payload }, { select, call }) {
      const queryRight = yield select(state => state.instockPlan.queryRight);
      yield call(InstockPlan.exportData, queryRight);
    },
    *save({ params }, { select, call, put }) {
      yield put({ type: 'toggleSpin' });
      const record = yield select(state => state.utils.record);
      const searchObj = yield select(state => state.instockPlan.searchObj);
      const { data } = yield call(InstockPlan.saveinstockPlan, params);
      /* isEmpty(record) ? create : update */
      if (data && data.success) {
        yield put({ type: 'setState', payload: { visible: isEmpty(record), result: data } });
        yield put({ type: 'load', payload: { query: searchObj } });
      }
      yield put({ type: 'toggleSpin' });
    },
    *delete({ id }, { select, call, put }) {
      const searchObj = yield select(state => state.instockPlan.searchObj);
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(InstockPlan.deleteinstockPlan, id);
      if (data && data.success) {
        yield put({ type: 'load', payload: { query: searchObj } });
      }
      yield put({ type: 'toggleSpin' });
    },
    *deleteSelected({ payload }, { select, call, put }) {
      const selectedRowKeys = yield select(state => state.instockPlan.selectedRowKeys);
      const searchObj = yield select(state => state.instockPlan.searchObj);
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(InstockPlan.deleteAllinstockPlans, selectedRowKeys);
      if (data && data.success) {
        yield put({ type: 'load', payload: { query: searchObj } });
      }
      yield put({ type: 'toggleSpin' });
    },
  },

  reducers: {
    init(state, { data, newPage }) {
      const { result, total } = data;
      const resPage = { ...state.page, ...newPage, total };
      const resData = result || [];
      return { ...state, data: resData, page: resPage };
    },

    setState(state, { payload }) {
      return { ...state, ...payload };
    },

    toggleSpin(state) {
      return { ...state, isSpin: !state.isSpin };
    },
  },

  // subscriptions: {
  //   setup({ dispatch, history }) {
  //     history.listen(({ pathname }) => {
  //       if (pathname === '/material/instockPlan') {
  //         dispatch({
  //           type: 'loadApplyInPage',
  //         });
  //       }
  //     });
  //   },
  // },
};
