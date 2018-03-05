import { merge, isEmpty } from 'lodash';
import * as InterfaceConfigService from '../../services/base/InterfaceConfigService';
import { listExceptGroup } from '../../services/base/HospitalService';

export default { 
  namespace: 'interfaceconfig',

  state: {
    namespace: 'interfaceconfig',
    defaultPage: {
      total: 0,
      pageSize: 10,
      pageNo: 1, 
    },
    selectedRowKeys: [],
    data: [],
    record: {},
    result: {},
    isSpin: false,
    dicts: {},
    searchObjs: {},
    visible: false,
    selectedTag: '',
    pageNo: 1,
    hosListData: [],
  },

  effects: {
    *loadHosListData({ payload }, { call, put }) {
      const { query } = (payload || {});

      yield put({ type: 'setState', payload: { spin: true } });

      const { data } = yield call(listExceptGroup, query);

      yield put({ type: 'setState', payload: { spin: false } });

      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: { hosListData: data.result },
        });
      } else {
        notification.error({ message: '错误：', description: data.msg || '获取医院列表发生未知错误！' });
      }
    },

    *load({ payload }, { select, call, put }) {
      const { query } = (payload || {});
      let { page } = (payload || {});
      const defaultPage = yield select(state => state.interfaceconfig.defaultPage);
      page = { ...defaultPage, ...page };
      const { pageNo, pageSize } = page;
      const start = (pageNo - 1) * pageSize;

      yield put({ type: 'toggleSpin' });
      const { data } = yield call(InterfaceConfigService.loadPage, start, pageSize, query);
      yield put({ type: 'toggleSpin' });
      console.info(page);
      if (data) {
        yield put({ type: 'init', data, page });
        yield put({ type: 'setState',
                    payload: {
                       pageNo: page.pageNo,
                    },
                 });
      }
    },
    *save({ params }, { select, call, put }) {
      yield put({ type: 'toggleSpin' });
      const record = yield select(state => state.utils.record);
      const pageNo = yield select(state => state.interfaceconfig.pageNo);
      const searchObj = yield select(state => state.interfaceconfig.searchObj);
      const { data } = yield call(InterfaceConfigService.save, params);
      /* isEmpty(record) ? create : update */
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            visible: isEmpty(record),
            result: data,
          },
        });
         let  page  = {};
         page.pageNo = pageNo;
         yield put({ type: 'load', payload: { query: searchObj, page: page} });
      }
      yield put({ type: 'toggleSpin' });
    },
    *delete({ id }, { call, put }) {
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(InterfaceConfigService.remove, id);
      yield put({ type: 'toggleSpin' });
      if (data && data.success) {
        yield put({ type: 'load' });
      }
    },
    *deleteSelected({ payload }, { select, call, put }) {
      const selectedRowKeys = yield select(state => state.interfaceconfig.selectedRowKeys);
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(InterfaceConfigService.removeAll, selectedRowKeys);
      yield put({ type: 'toggleSpin' });
      if (data && data.success) {
        yield put({ type: 'load' });
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
        if (pathname === '/operation/interfaceConfig') {
          dispatch({
            type: 'load',
          });
        }
      });
    },
  },
};
