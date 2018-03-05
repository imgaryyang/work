import { notification } from 'antd';

import { save, remove, removeSelected, loadWarnPageList, loadParam } from '../../services/material/CredentialService';

export default {

  namespace: 'credentialWarn',

  state: {
    defaultPage: { total: 0, pageSize: 10, pageNo: 1 },
    page: { total: 0, pageSize: 10, pageNo: 1 },
    query: { incInvalid: false },
    data: [],
    warnDate: '',
    selectedRowKeys: [],
    record: {},
    spin: false,
    visible: false,
    editorSpin: false,
  },

  effects: {
     /**
     * 获取证书默认预警天数
     */
    * loadParam({ payload }, { call, put }) {
      const { data } = yield call(loadParam);
      if (data && data.success) {
        const { result } = data;
        yield put({
          type: 'setState',
          payload: {
            warnDate: result.controlParam,
          },
        });
      }
    },
    /**
     * 获取所有证书列表
     */
    *loadList({ payload }, { select, call, put }) {
      const { page, query, onSearch } = (payload || {});
      const defaultPage = yield select(state => state.credentialWarn.defaultPage);
      const queryOld = yield select(state => state.credentialWarn.query);
      const newPage = { ...defaultPage, ...page };
      const newQuery = { ...queryOld, ...query };
      const { pageNo, pageSize } = newPage;
      // onSearch 代表点击查询按钮触发的load，需要重置页码为0
      const start = (onSearch ? 0 : (pageNo - 1)) * pageSize;
      yield put({
        type: 'setState', payload: { spin: true },
      });

      const { data } = yield call(loadWarnPageList, start, pageSize, newQuery);
      if (data && data.success) {
        const { result, total } = data;
        newPage.start = start;
        newPage.total = total;
        yield put({
          type: 'setState',
          payload: {
            data: result,
            page: newPage,
            query: newQuery || {},
            spin: false,
          },
        });
        return;
      }
      yield put({
        type: 'setState', payload: { spin: false },
      });
    },

    /**
     * 保存证书
     */
    *save({ params }, { select, call, put }) {
      yield put({
        type: 'setState',
        payload: { editorSpin: true },
      });
      const { data } = yield call(save, params);
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            editorSpin: false,
            visible: !params.id,
            record: {},
          },
        });
        notification.info({
          message: '提示',
          description: '保存物资证书成功！',
        });
        // 原条件重载列表
        const { query } = yield select(state => state.credentialWarn);
        yield put({ type: 'loadList', payload: { query } });
        return;
      }
      yield put({
        type: 'setState', payload: { editorSpin: false },
      });
    },

    /**
     * 删除证书
     */
    *delete({ id }, { select, call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(remove, id);
      yield put({ type: 'setState', payload: { spin: false } });
      if (data && data.success) {
        // 原条件重载列表
        const { query } = yield select(state => state.credentialWarn);
        yield put({ type: 'load', payload: { query } });
      }
    },

    /**
     * 删除选中的多个证书
     */
    *deleteSelected({ payload }, { select, call, put }) {
      const { selectedRowKeys, query } = yield select(state => state.credentialWarn);
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(removeSelected, selectedRowKeys);
      yield put({ type: 'setState', payload: { spin: false } });
      if (data && data.success) {
        yield put({ type: 'loadList', payload: { query } });
      }
    },

  },

  reducers: {

    setState(oldState, { payload }) {
      return { ...oldState, ...payload };
    },

  },
};
