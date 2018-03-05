import { merge } from 'lodash';
import * as storeInfo from '../../services/pharmacy/StoreInfoService';
import { getOptions } from '../../services/UtilsService';

export default {
  namespace: 'validWarnInfo',

  state: {
    page: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
    ValidDetail: [],
    spin: false,
  },

  effects: {
    *loadValidWarn({ payload }, { select, call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });
      
      const { page, query } = (payload || {});

      const defaultPage = yield select(state => state.validWarnInfo.page);
      const newPage = {
        ...defaultPage,
        ...page,
      };

      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;
      
      // will 获取药品信息，翻页
      const { data } = yield call(storeInfo.loadStoreInfoValidWarnPage, start, pageSize, query);

      if (data) {
      // will 更新state，刷新页面
        yield put({ type: 'initValidWarnInfo', initData: data, page: newPage });
      }
      
      yield put({ type: 'setState', payload: { spin: false } });
    },
  },

  reducers: {
    initValidWarnInfo(state, { initData, page }) {
      const { ValidDetail } = state;

      const { result, total } = initData;

      const data = result || [];

      const newPage = { ...page, total };

      const newValidDetail = { ...ValidDetail, data };

      return {
        ...state,
        ValidDetail:newValidDetail,
        page:newPage,
      };
    },
    setState(state, { payload }) {
        return { ...state, ...payload };
      },
  },
};
