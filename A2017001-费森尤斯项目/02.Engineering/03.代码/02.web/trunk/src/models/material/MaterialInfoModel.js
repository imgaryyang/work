import { merge } from 'lodash';
import { notification } from 'antd';
import * as MaterialService from '../../services/material/MaterialInfoService';

export default {
  namespace: 'material',

  state: {
    namespace: 'material',
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
    // 来源标志
    chanel: '',
  },

  effects: {

    *load({ payload }, { select, call, put }) {
      const chanel = yield select(state => state.material.chanel);
      const { query, page, startFrom0 } = (payload || {});
      // 取现有的翻页对象
      const defaultPage = yield select(state => state.material.page);
      const newPage = { ...defaultPage, ...(page || {} ) };
      yield put({ type: 'setState', payload: { page: newPage } });
      const { pageNo, pageSize } = newPage;
      const start = startFrom0 ? 0 : (pageNo - 1) * pageSize;

      yield put({ type: 'toggleSpin' });

      const { data } = yield call(MaterialService.loadMaterialInfoPage, start, pageSize, query || {}, chanel);

      yield put({ type: 'toggleSpin' });

      if (data && data.success) {
        // yield put({ type: 'init', data, page, query });
        // yield put({ type: 'init', data, page, query });
        yield put({
          type: 'setState',
          payload: {
            data: data.result || [],
            page: { pageNo: startFrom0 ? 1 : pageNo, pageSize, total: data.total },
            query: query || {},
            isSpin: false,
          },
        });
      } else {
        notification.error({
          message: '错误',
          description: `${data.msg || '查询物资列表出错！'}`,
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
      const chanel = yield select(state => state.material.chanel);
      const { query } = yield select(state => state.material);
      const { page } = yield select(state => state.material);
      console.log(page);
      yield put({ type: 'toggleEditorSpin' });
      console.log(params);
      if(params.itemName === undefined) {
        params.itemCode = '';
      }
      console.log(params);
      const { data } = yield call(MaterialService.saveMaterialInfo, params, chanel);
      if (data && data.success) {
        notification.success({
          message: '提示',
          description: '保存物资信息成功！',
        });

        yield put({ type: 'load', payload: { query, page } });
        yield put({
          type: 'setState',
          payload: {
            editorSpin: false,
            visible: !params.id,
          },
        });
        return;
      }
      yield put({ type: 'toggleEditorSpin' });
    },

    *delete({ id }, { select, call, put }) {
      const query = yield select(state => state.material.query);
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(MaterialService.deleteMaterialInfo, id);
      const { page } = yield select(state => state.material);
      yield put({ type: 'toggleSpin' });
      if (data && data.success) {
        notification.success({
          message: '提示',
          description: '删除物资信息成功！',
        });
        yield put({ type: 'load', payload: { query, page } });
      }
    },

    *deleteSelected({ payload }, { select, call, put }) {
      const selectedRowKeys = yield select(state => state.material.selectedRowKeys);
      const query = yield select(state => state.material.query);
      const { page } = yield select(state => state.material);
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(MaterialService.deleteAllMaterialInfos, selectedRowKeys);
      yield put({ type: 'toggleSpin' });
      if (data && data.success) {
        notification.success({
          message: '提示',
          description: '删除物资信息成功！',
        });
        yield put({ type: 'load', payload: { query, page } });
      }
    },
  },

  reducers: {
    /* init(state, { data, page, query }) {
      const { result, total } = data;
      const resPage = { ...state.page, ...page, total };
      const resData = result || [];
      return { ...state, data: resData, page: resPage, query };
    },*/

    setState(state, { payload }) {
      console.log(payload);
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
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/material/settings/materialInfo/material'|| pathname ==='/operation/settings/materialInfo/operate') {
          
          dispatch({
            type: 'utils/initDicts',
            payload: [
              'MATERIAL_TYPE', 'STOP_FLAG', 'BOOLEAN', 'MATERIAL_UNIT', 'MATERIAL_FEE_FLAG',
            ],
          });
        }
      });
    },
  },
};
