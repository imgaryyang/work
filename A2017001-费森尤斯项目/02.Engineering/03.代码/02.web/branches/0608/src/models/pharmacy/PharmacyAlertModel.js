
import { loadInventoryAlert, loadExpiryAlert, loadRetentionAlert } from '../../services/pharmacy/PharmacyAlertService';

export default {
  namespace: 'pharmacyAlert',
  state: {
    type: '',
    page: { total: 0, pageSize: 10, pageNo: 1 },
    query: {},
    data: [],
    spin: false,
  },
  effects: {

    *load({ payload }, { select, call, put }) {
      const { page, query } = (payload || {});

      const defaultPage = yield select(state => state.card.page);
      const defaultQuery = yield select(state => state.card.query);
      const p = { ...defaultPage, ...page };
      const start = (p.pageNo - 1) * p.pageSize;

      yield put({ type: 'addSpin' });

      const { data } = yield call(loadCardPage, start, p.pageSize, { ...defaultQuery, ...query });
      if (data) {
        yield put({
          type: 'init',
          data,
          page: p,
          query: { ...defaultQuery, ...query },
        });
      }
      // 移除载入指示器
      yield put({ type: 'removeSpin' });
    },

  },
  reducers: {

    init(state, { data, page, query }) {
      const { result = result || [], total } = data;
      const p = { ...state.page, ...page, total };
      const cards = result || [];
      return {
        ...state,
        cards,
        page: p,
        query,
      };
    },

    setState(oldState, { payload }) {
      return { ...oldState, ...payload };
    },

    addSpin(state) {
      return { ...state, spin: true };
    },

    removeSpin(state) {
      return { ...state, spin: false };
    },
  },
};
