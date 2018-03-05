import { merge } from 'lodash';
import * as detentInfo from '../../services/pharmacy/StoreSumInfoService';
import { getOptions } from '../../services/UtilsService';

export default {
  namespace: 'detentWarnInfo',

  state: {
    page: {
        total: 0,
        pageSize: 10,
        pageNo: 1,
      },
    DetentDetail: [],
    spin: false,
  },

  effects: {
    *loadDetentWarn({ payload }, { select, call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });
      
      const { page, query } = (payload || {});
      const defaultPage = yield select(state => state.page);
      const newPage = {
        ...defaultPage,
        ...page,
      };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;
      
      // will 获取药品信息，翻页
      const { data } = yield call(detentInfo.loadStoreSumDetentWarnInfoPage, start, pageSize, query);
      
      
      if (data) {
      // will 更新state，刷新页面
        yield put({ type: 'initDetentWarnInfo', initData: data, page: newPage });
      }
      
      yield put({ type: 'setState', payload: { spin: false } });
    },
  },

  reducers: {
    initDetentWarnInfo(state, { initData, page }) {
      const { DetentDetail } = state;
      
      const { result, total } = initData;
      const data = result || [];
      
      const newPage = { ...DetentDetail.page, total };
      const newDetentDetail = { ...DetentDetail, data, };
      
      return {
        ...state,
        DetentDetail:newDetentDetail,
        page:newPage,
      };
    },
    setState(state, { payload }) {
        return { ...state, ...payload };
    },
  },
};
