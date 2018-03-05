import { merge } from 'lodash';
import { notification } from 'antd';
import { saveAdjust } from '../../services/pharmacy/AdjustService';
import * as drugInfoService from '../../services/pharmacy/DrugInfoService';

export default {
  namespace: 'adjust',
  state: {
    page: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    selectedRowKeys: [],
    tmpData: [],
    isEdit: false,
    data: [],
    dicts: {},
    record: null,
    isSpin: false,
    adjustSearchObjs: {},
    selectedTag: '',
  },
  effects: {
    *load({ payload }, { select, call, put }) {
      const { query } = (payload || {});
      let { page } = (payload || {});
      const defaultPage = yield select(state => state.adjust.page);
      page = { ...defaultPage, ...page };
      const { pageNo, pageSize } = page;
      const start = (pageNo - 1) * pageSize;
      yield put({ type: 'setState', payload: { isSpin: true } });
      const { data } = yield call(drugInfoService.loadDrugInfoPage, start, pageSize, query);
      yield put({ type: 'setState', payload: { isSpin: false } });
      if (data) {
        yield put({ type: 'init', data, page });
      }
    },
    *save({ payload }, { select, call, put }) {
      const tmpData = yield select(state => state.adjust.data);
      console.log(tmpData);
      yield put({ type: 'setState', payload: { isSpin: true } });
      const { data } = yield call(saveAdjust, tmpData);
      if (data && data.success) {
        yield put({ type: 'load' });
        notification.info({ message: '提示信息：', description: '调价成功！' });
      }
      yield put({ type: 'setState', payload: { isSpin: false } });
    },
    *addEdit({ record }, { select, put }) {
      let tmpData = yield select(state => state.adjust.tmpData);
      if (record) {
        tmpData = tmpData.concat(record);
        yield put({ type: 'setState', payload: { tmpData, isEdit: true } });
      }
    },
    *delete({ record }, { select, put }) {
      const itemData = yield select(state => state.adjust.data);
      itemData.splice(itemData.indexOf(record), 1);
      const newData = [];
      for (const d of itemData) {
        newData.push(d);
      }
      yield put({
        type: 'setState',
        payload: {
          data: newData,
        },
      });
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
    setSearchObjs(state, { payload: searchObj }) {
      if (searchObj) {
        const adjustSearchObjs = merge(state.adjustSearchObjs, searchObj);
        return { ...state, adjustSearchObjs };
      } else {
        return { ...state, adjustSearchObjs: {} };
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/pharmacy/adjust') {
          dispatch({
            type: 'load',
          });
        }
      });
    },
  },
};
