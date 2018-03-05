import * as detentInfo from '../../services/pharmacy/StoreSumInfoService';

export default {
  namespace: 'detentWarnInfo',

  state: {
    defaultPage: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    page: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    DetentDetail: [],
    spin: false,
    alertLevel: '',
  },

  effects: {
    *loadDetentWarn({ payload }, { select, call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });
      const { page, query } = (payload || {});
      const defaultPage = yield select(state => state.detentWarnInfo.page);
      const newPage = {
        ...defaultPage,
        ...page,
      };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;
      const { data } = yield call(detentInfo.loadStoreSumDetentWarnInfoPage, start, pageSize, query);
      if (data && data.success) {
        yield put({ type: 'initDetentWarnInfo', initData: data, page: newPage });
      }
      yield put({ type: 'setState', payload: { spin: false } });
    },
  },

  reducers: {
    initDetentWarnInfo(state, { initData, page }) {
      const { DetentDetail } = state;
      const { result, total } = initData;
      const newdata = result.data;
      console.log(result);
      const alertLevel = result.alertLevel;
      const data = newdata || [];
      const newPage = { ...DetentDetail.page, ...page, total };
      const newDetentDetail = { ...DetentDetail, data };
      return {
        ...state,
        DetentDetail: newDetentDetail,
        page: newPage,
        alertLevel,
      };
    },
    setState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
