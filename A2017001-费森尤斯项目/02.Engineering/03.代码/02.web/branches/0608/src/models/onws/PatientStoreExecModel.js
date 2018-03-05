import { merge } from 'lodash';
import { notification } from 'antd';
import { loadPatientStorePage, savePatientStore, loadDetailPage, deletePatientStore } from '../../services/onws/PatientStoreExecService';

export default {
  namespace: 'patientStoreExec',

  state: {
    page: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    detailPage: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    selectedRowKeys: [],
    data: [],
    detailData: [],
    dicts: {},
    record: null,
    isSpin: false,
    visible: false,
    searchObjs: {},
    selectedTag: '',
    patient: {},
  },

  effects: {
    *load({ payload }, { select, call, put }) {
      let { page } = (payload || {});
      const defaultPage = yield select(state => state.patientStoreExec.page);
      const searchObjs = yield select(state => state.patientStoreExec.searchObjs);
      page = { ...defaultPage, ...page };
      const { pageNo, pageSize } = page;
      const start = (pageNo - 1) * pageSize;

      yield put({ type: 'setState', payload: { isSpin: true } });
      const { data } = yield call(loadPatientStorePage, start, pageSize, searchObjs);
      yield put({ type: 'setState', payload: { isSpin: false } });

      if (data) {
        yield put({ type: 'init', data, page });
      }
    },
    *loadDetail({ payload }, { select, call, put }) {
      const { query } = (payload || {});
      let { page } = (payload || {});
      const defaultPage = yield select(state => state.patientStoreExec.detailPage);
      page = { ...defaultPage, ...page };
      const { pageNo, pageSize } = page;
      const start = (pageNo - 1) * pageSize;
      yield put({ type: 'setState', payload: { isSpin: true } });
      const { data } = yield call(loadDetailPage, start, pageSize, query);
      yield put({ type: 'setState', payload: { isSpin: false } });

      if (data) {
        yield put({ type: 'initDetail', data, page });
        yield put({ type: 'setState', payload: { visible: true } });
      }
    },
    *save({ params }, { select, call, put }) {
      yield put({ type: 'setState', payload: { isSpin: true } });
      const subData = yield select(state => state.patientStoreExec.data);
      const { data } = yield call(savePatientStore, subData);
      if (data && data.success) {
        yield put({ type: 'load' });
        notification.info({ message: '提示信息：', description: '数据保存成功！' });
      } else {
        notification.info({ message: '提示信息：', description: data.msg });
      }
      yield put({ type: 'setState', payload: { isSpin: false } });
    },
    *delete({ record }, { call, put }) {
      yield put({ type: 'setState', payload: { isSpin: true } });
      const { data } = yield call(deletePatientStore, record.id);
      yield put({ type: 'setState', payload: { isSpin: false } });
      if (data && data.success) {
        const search = { recipeId: record.recipeId, recipeNo: record.recipeNo, itemCode: record.itemCode };
        yield put({ type: 'loadDetail', payload: { query: search } });
      }
    },
    *deleteSelected({ payload }, { select, call, put }) {
      const selectedRowKeys = yield select(state => state.drugInfo.selectedRowKeys);
      yield put({ type: 'setState', payload: { isSpin: true } });
      const { data } = yield call(loadPatientStorePage, selectedRowKeys);
      yield put({ type: 'setState', payload: { isSpin: false } });
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

    initDetail(state, { data, page }) {
      const { result, total } = data;
      const resPage = { ...state.page, ...page, total };
      const resData = result || [];
      return { ...state, detailData: resData, detailPage: resPage };
    },
    setState(state, { payload }) {
      return { ...state, ...payload };
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
        if (pathname === '/onws/treatment/patientStoreExec') {
          dispatch({
            type: 'load',
          });
          dispatch({
            type: 'utils/initDicts',
            payload: ['SEX'],
          });
        }
      });
    },
  },
};
