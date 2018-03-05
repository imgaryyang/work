import { merge } from 'lodash';
import { notification } from 'antd';
import Print from '../../utils/print';
import * as printService from '../../services/base/PrintService';
import { loadPatLisPage, savePatLis, getPatLisPage } from '../../services/onws/PhaLisService';

export default {
  namespace: 'phaLis',

  state: {
    page: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    phaLisPage: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    data: [], /* 待确认项目信息*/
    recordData: [], /* 确认记录信息*/
    recordDetail: [], /* 确认记录明细*/
    confirmData: [], /* 确认记录时复合项目明细*/
    tmpItem: '', /* 单独划价项目临时信息*/
    approvalNo: {},
    dicts: {},
    record: null,
    isSpin: false,
    visible: '',
    searchObjs: {},
    selectedTag: '',
    patient: {},
    isShow: false,
  },

  effects: {
    /*
    加载所有需要确认的项目列表
     */
    *load({ payload }, { select, call, put }) {
      let { page } = (payload || {});
      const defaultPage = yield select(state => state.phaLis.page);
      const searchObjs = yield select(state => state.phaLis.searchObjs);
      page = { ...defaultPage, ...page };
      const { pageNo, pageSize } = page;
      const start = (pageNo - 1) * pageSize;

      yield put({ type: 'setState', payload: { isSpin: true } });
      const { data } = yield call(loadPatLisPage, start, pageSize, searchObjs);
      yield put({ type: 'setState', payload: { isSpin: false } });

      if (data) {
        yield put({ type: 'init', data, page });
      }
    },
    /*
    加载所有需要确认的项目列表
     */
    *loadPatLis({ payload }, { select, call, put }) {
      let { page } = (payload || {});
      const defaultPage = yield select(state => state.phaLis.page);
      const searchObjs = yield select(state => state.phaLis.searchObjs);
      page = { ...defaultPage, ...page };
      const { pageNo, pageSize } = page;
      const start = (pageNo - 1) * pageSize;

      yield put({ type: 'setState', payload: { isSpin: true } });
      const { data } = yield call(getPatLisPage, start, pageSize, searchObjs);
      yield put({ type: 'setState', payload: { isSpin: false } });

      if (data) {
        yield put({ type: 'initPatLis', data, page });
      }
    },
    /*
    送检保存
     */
    *save({ payload }, { call, put }) {
      const { newRecord } = (payload || {});
      yield put({ type: 'setState', payload: { isSpin: true } });
      const { data } = yield call(savePatLis, newRecord);
      if (data && data.success) {
        yield put({ type: 'load' });
        notification.info({ message: '提示信息：', description: '数据保存成功！' });
        const rt = data.result;
        yield put({ type: 'doPrint', payload: { rt } });
      } else {
        notification.info({ message: '提示信息：', description: data.msg });
      }
      yield put({ type: 'setState', payload: { isSpin: false } });
    },
/*
打印条码
 */
    *doPrint({ payload }, { call }) {
      const { rt } = (payload || {});
      const printData = { name: rt.name, type: rt.specimenname, code: rt.exambarcode };
      const { data } = yield call(printService.getPrint, '118');
      if (data && data.success) {
        const { result } = data;
        const { printTemplate, map } = result;
        yield Print.sendPrint(printTemplate, printData, map);
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

    initPatLis(state, { data, page }) {
      const { result, total } = data;
      const resPage = { ...state.page, ...page, total };
      const resData = result || [];
      return { ...state, recordData: resData, phaLisPage: resPage };
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
        if (pathname === '/onws/treatment/phaLis') {
          dispatch({
            type: 'utils/initDicts',
            payload: ['SEX', 'INFECTIOUS_DISEASE', 'SPECIMENT'],
          });
        }
      });
    },
  },
};
