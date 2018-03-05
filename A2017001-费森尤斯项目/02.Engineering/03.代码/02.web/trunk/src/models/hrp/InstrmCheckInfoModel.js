import { merge } from 'lodash';
import { notification } from 'antd';
import baseUtil from '../../utils/baseUtil';
import { loadCheckInfoPage, loadCheckPage, updateCheckInfo, addCheckInfo, deleteCheck, finishCheck, getBill, createCheckInfo } from '../../services/hrp/CheckInfoService';

export default {
  namespace: 'instrmCheckInfo',

  state: {
    query: {},
    page: { total: 0, pageSize: 10, pageNo: 1 },
    checkInfoPage: { total: 0, pageSize: 10, pageNo: 1 },
    searchObjs: {},
    checkInfoSearchObjs: {},
    checkInfoData: [],
    data: [],
    spin: false,
    record: null,
    selectedRowKeys: [],
    dicts: {},
    selectedTag: '',
    bill: '',
  },

  effects: {
    *load({ payload }, { select, call, put }) {
      const { page, query } = (payload || {});
      const defaultPage = yield select(state => state.instrmCheckInfo.page);
      const defaultQuery = yield select(state => state.instrmCheckInfo.query);
      const newPage = { ...defaultPage, ...page };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(loadCheckPage, start, pageSize, query || defaultQuery);
      yield put({ type: 'setState', payload: { spin: false, query } });
      console.log(data);
      if (data) {
        yield put({
          type: 'init',
          data,
          page: newPage,
        });
      }
    },
    *loadCheckInfo({ payload }, { select, call, put }) {
      const { page, query } = (payload || {});
      const defaultPage = yield select(state => state.instrmCheckInfo.checkInfoPage);
      const defaultQuery = yield select(state => state.instrmCheckInfo.query);
      const newPage = { ...defaultPage, ...page };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(loadCheckInfoPage, start, pageSize, query || defaultQuery);
      yield put({ type: 'setState', payload: { spin: false, query } });
      if (data) {
        yield put({
          type: 'initCheckInfo',
          data,
          page: newPage,
        });
      }
    },
    *deleteCheckInfo({ payload }, { call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(deleteCheck);
      yield put({ type: 'setState', payload: { spin: false } });
      if (data && data.success) {
        yield put({ type: 'load' });
      } else if (data && (!data.success)) {
        notification.info({ message: '提示信息：', description: data.msg });
      } else {
        notification.info({ message: '提示信息：', description: '作废操作失败，请稍后重试！' });
      }
    },
    *finishCheck({ payload }, { select, call, put }) {
      const olddata = yield select(state => state.instrmCheckInfo.data);
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(finishCheck, olddata);
      yield put({ type: 'setState', payload: { spin: false } });
      if (data && data.success) {
        yield put({ type: 'load' });
        notification.info({ message: '提示信息：', description: '操作成功！' });
      } else if (data && !(data.success)) {
        notification.info({ message: '提示信息：', description: data.msg });
      } else {
        notification.info({ message: '提示信息：', description: '盘清操作失败，请稍后重试！' });
      }
    },
    *addCheckInfo({ payload }, { select, call, put }) {
      const bill = yield select(state => state.instrmCheckInfo.bill);
      if (bill === '' || bill === null || bill === undefined) {
        notification.info({ message: '提示信息：', description: '不能获取盘点单号，请刷新！' });
      } else {
        yield put({ type: 'setState', payload: { spin: true } });
        const { data } = yield call(addCheckInfo, bill);
        yield put({ type: 'setState', payload: { spin: false } });
        if (data && data.success) {
          yield put({ type: 'load' });
        } else {
          if (data.msg) {
             baseUtil.alert(data.msg);
          }
        }
      }
    },
    *createCheckInfo({ payload }, { select, call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(createCheckInfo, payload.bill, payload.instrmCode);
      yield put({ type: 'setState', payload: { spin: false } });

      if (data && data.success) {
        yield put({ type: 'load' });
      } else {
        if (data.msg) {
          baseUtil.alert(data.msg);
        }
      }
    },
    *updateCheckInfo({ params }, { select, call, put }) {
      const olddata = yield select(state => state.instrmCheckInfo.data);
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(updateCheckInfo, olddata);
      yield put({ type: 'setState', payload: { spin: false } });
      if (data && data.success) {
        yield put({ type: 'load' });
      } else {
        yield put({ type: 'load' });
        notification.info({ message: '提示信息：', description: data.msg });
      }
    },
    *getBill({ params }, { call, put }) {
      const { data } = yield call(getBill);
      if (data && data.success) {
        const { msg } = data;
        yield put({ type: 'setState', payload: { bill: msg } });
      } else {
        notification.info({ message: '提示信息：', description: '无法获取当前盘点单号！' });
      }
    },
  },

  reducers: {
    init(state, { data, page }) {
      const { result, total } = data;
      const p = { ...state.page, ...page, total };
      const datatmp = result || [];
      return { ...state, data: datatmp, page: p };
    },
    initCheckInfo(state, { data, page }) {
      const { result, total } = data;
      const p = { ...state.CheckInfoPage, ...page, total };
      const datatmp = result || [];
      return { ...state, checkInfoData: datatmp, checkInfoPage: p };
    },

    setState(state, { payload }) {
      return { ...state, ...payload };
    },

    setSearchObjs(state, { payload: searchObj }) {
      if (searchObj) {
        const searchObjs = merge(state.searchObjs, searchObj);
        return { ...state, searchObjs };
      } else {
        return { ...state, searchObjs: {} };
      }
    },
    setCheckInfoSearchObjs(state, { payload: checkInfoSearchObj }) {
      if (checkInfoSearchObj) {
        const checkInfoSearchObjs = merge(state.checkInfoSearchObjs, checkInfoSearchObj);
        return { ...state, checkInfoSearchObjs };
      } else {
        return { ...state, checkInfoSearchObjs: {} };
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/hrp/instrmCheckInfo' || pathname === '/hrp/instrmCheckInfoSearch') {
          dispatch({
            type: 'utils/initDicts',
            payload: ['CHECK_STATE'],
          });
        }
      });
    },
  },
};
