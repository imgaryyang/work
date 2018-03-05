import { merge } from 'lodash';
import { notification } from 'antd';
import * as AssetService from '../../services/hrp/AssetInfoService';

export default {
  namespace: 'asset',

  state: {
    namespace: 'asset',
    page: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    query: {},
    selectedRowKeys: [],
    data: [],
    dicts: {},
    record: {},
    isSpin: false,
    editorSpin: false,
    visible: false,
    searchObjs: {},
    selectedTag: '',
    formCache: {},
  },

  effects: {

    *load({ payload }, { select, call, put }) {
      const { query, page, startFrom0 } = (payload || {});
      // 取现有的翻页对象
      const defaultPage = yield select(state => state.asset.page);
      const newPage = { ...defaultPage, ...(page || {}) };
      // console.log(newPage);
      const { pageNo, pageSize } = newPage;
      const start = startFrom0 ? 0 : (pageNo - 1) * pageSize;

      yield put({ type: 'toggleSpin' });

      let newQuery = query || {};
      // console.log(newQuery);
      newQuery = {
        ...newQuery,
        instrmType: (newQuery.instrmType && newQuery.instrmType.length === 0 ? null : newQuery.instrmType),
      };
      const { data } = yield call(
        AssetService.loadPage,
        start,
        pageSize,
        newQuery,
      );
      // yield put({ type: 'toggleSpin' });

      if (data && data.success) {
        // yield put({ type: 'init', data, page, query });
        yield put({
          type: 'setState',
          payload: {
            data: data.result || [],
            page: { pageNo: startFrom0 ? 1 : pageNo, pageSize, total: data.total },
            query: newQuery,
            isSpin: false,
          },
        });
      } else {
        notification.error({
          message: '错误',
          description: `${data.msg || '查询资产列表出错！'}`,
        });
        yield put({
          type: 'setState',
          payload: {
            isSpin: false,
          },
        });
      }
    },

    *save({ params }, { select, call, put }) {
      const { query } = yield select(state => state.asset);
      yield put({ type: 'toggleEditorSpin' });
      const { data } = yield call(AssetService.save, params);
      if (data && data.success) {
        notification.success({
          message: '提示',
          description: '保存资产信息成功！',
        });
        yield put({ type: 'load', payload: { query } });
        yield put({
          type: 'setState',
          payload: {
            editorSpin: false,
            visible: !params.id,
            resetForm: true,
          },
        });
      } else {
        notification.error({
          message: '错误',
          description: `${data.msg || '保存资产信息失败！'}`,
        });
        yield put({
          type: 'setState',
          payload: {
            editorSpin: false,
          },
        });
      }
    },

    *delete({ id }, { select, call, put }) {
      const query = yield select(state => state.asset.query);
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(AssetService.removeAsset, id);
      yield put({ type: 'toggleSpin' });
      if (data && data.success) {
        notification.success({
          message: '提示',
          description: '删除资产信息成功！',
        });
        yield put({ type: 'load', payload: { query } });
      }
    },

    *deleteSelected({ payload }, { select, call, put }) {
      const selectedRowKeys = yield select(state => state.asset.selectedRowKeys);
      const query = yield select(state => state.asset.query);
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(AssetService.removeSelectedAssets, selectedRowKeys);
      yield put({ type: 'toggleSpin' });
      if (data && data.success) {
        notification.success({
          message: '提示',
          description: '删除资产信息成功！',
        });
        yield put({ type: 'load', payload: { query } });
      }
    },
  },

  reducers: {
    /* init(state, { data, page, query }) {
      const { result, total } = data;
      const resPage = { ...state.page, ...page, total };
      const resData = result || [];
      return { ...state, data: resData, page: resPage, query, isSpin: false };
    },*/

    setState(state, { payload }) {
      // console.log(payload);
      return { ...state, ...payload };
    },

    toggleSpin(state) {
      return { ...state, isSpin: !state.isSpin };
    },

    toggleEditorSpin(state) {
      return { ...state, editorSpin: !state.editorSpin };
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
  },
};
