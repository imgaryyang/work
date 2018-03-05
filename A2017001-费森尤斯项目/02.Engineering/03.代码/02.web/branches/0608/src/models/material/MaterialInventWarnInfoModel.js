import { merge } from 'lodash';
import * as storeSumInfo from '../../services/material/StoreSumInfoService';
import { getOptions } from '../../services/UtilsService';

export default {
  namespace: 'materialInventWarnInfo',

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
    data: [],
    query: {},
    spin: false,
  },

  effects: {
    *loadInventWarn({ payload }, { select, call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });

      const { pageNew, queryCon } = payload || {};

      const materialInventWarnInfo = yield select(state => state.materialInventWarnInfo);
      const { defaultPage, query } = materialInventWarnInfo;
      const newPage = { ...defaultPage, ...pageNew };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;
      const queryTem = { ...query, ...queryCon };

      const { data } = yield call(storeSumInfo.loadStoreSumWarnInfoPage, start, pageSize, queryTem);

      if (data) {
        yield put({
          type: 'init',
          query: queryTem,
          data,
          page: newPage,
        });
      }

      yield put({ type: 'setState', payload: { spin: false } });
    },
  },

  reducers: {
    init(state, { data, page, query }) {
      const { result, total } = data;
      const resPage = { ...state.page, ...page, total };
      const datatem = result || [];
      return { ...state, data: datatem, page: resPage, query };
    },
    initInventWarnInfo(state, { initData, page }) {
      const { InventDetail } = state;
      
      const { result, total } = initData;
      const data = result || [];
      
      const newPage = { ...InventDetail.page, total };
      const newInventDetail = { ...InventDetail, data };
      
      return {
        ...state,
        InventDetail: newInventDetail,
        page: newPage,
      };
    },
    setState(state, { payload }) {
        return { ...state, ...payload };
      },
  },
};
