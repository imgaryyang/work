import * as RegisterService from '../../services/appointment/RegisterService';

export default {
  namespace: 'register',

  state: {
    defaultPage: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    selectedRowKeys: [],
    data: [],
    dicts: {},
    patient: {},
    record: {},
    form: {},
    isSpin: false,
    isEmergency: false,
    totalFee: 0,
    regResult: {},
    payResult: {},
  },

  effects: {
    *load({ payload }, { select, call, put }) {
      const { query } = (payload || {});
      let { page } = (payload || {});
      const defaultPage = yield select(state => state.register.defaultPage);
      page = { ...defaultPage, ...page };
      const { pageNo, pageSize } = page;
      const start = (pageNo - 1) * pageSize;

      yield put({ type: 'toggleSpin' });
      const { data } = yield call(RegisterService.loadInfoPage, start, pageSize, query);
      yield put({ type: 'toggleSpin' });

      if (data) {
        yield put({ type: 'init', data, page });
      }
    },
    *save({ params }, { call, put }) {
      yield put({ type: 'toggleSpin' });
      //效验：同一个人同类型挂号，一天只能挂一次号
      const { data } = yield call(RegisterService.saveInfo, params);
      const { remark } = params;
      if (data && data.success) {
        /* 挂号 -> 收银台 */
        if (!remark) {
          yield put({ type: 'payCounter/setState', payload: { payInfo: data.result, isVisible: true } });
        }
      }
      yield put({ type: 'setState', payload: { regResult: data } });
      yield put({ type: 'toggleSpin' });
    },
    *getTotalFee({ payload }, { call, put }) {
      const { regLevel } = (payload || {});
      const { data } = yield call(RegisterService.getTotalFee, regLevel);
      if (data && data.success) {
        yield put({ type: 'setState', payload: { totalFee: data.result } });
      }
    },
  },

  reducers: {
    init(state, { data, page }) {
      const { result, total } = data;
      const resData = result || [];
      const resPage = { ...state.page, ...page, total };
      return { ...state, data: resData, page: resPage };
    },

    setState(state, { payload }) {
      return { ...state, ...payload };
    },

    toggleSpin(state) {
      return { ...state, isSpin: !state.isSpin };
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/appointment/register') {
          dispatch({
            type: 'utils/initDicts',
            payload: ['SEX', 'NATIONNALITY', 'REG_LEVEL', 'DEPT_TYPE', 'REG_STATE', 'NOON_TYPE', 'FEE_TYPE'],
          });
        }
      });
    },
  },
};
