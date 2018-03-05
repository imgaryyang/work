import { merge } from 'lodash';
import { notification } from 'antd';
import { findMaterialInfoByItemId, loadPatientStorePage, savePatientStore, saveDetail, loadDetailPage, deletePatientStore, findItemDetailByItemId, findRecordDetailByExecNo } from '../../services/onws/PatientStoreExecService';

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
    data: [], /* 待确认项目信息*/
    recordData: [], /* 确认记录信息*/
    recordDetail: [], /* 确认记录明细*/
    confirmData: [], /* 确认记录时复合项目明细*/
    matData: [], /* 确认物资记录明细*/
    tmpItem: '', /* 单独划价项目临时信息*/
    approvalNo: {},
    dicts: {},
    matRecord: '',
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
    /*
    加载执行确认记录
     */
    *loadRecord({ payload }, { select, call, put }) {
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
        yield put({ type: 'setState', payload: { visible: '2' } });
      }
    },
    /*
    加载单条确认记录明细
     */
    *loadRecordDetail({ payload }, { call, put }) {
      const { record } = (payload || {});
      yield put({ type: 'setState', payload: { isSpin: true } });
      const { data } = yield call(findRecordDetailByExecNo, record);
      yield put({ type: 'setState', payload: { isSpin: false } });
      if (data && data.success) {
        const { result } = data;
        const resData = result || [];
        yield put({ type: 'setState', payload: { visible: '2', recordDetail: resData } });
      }
    },
    /*
    根据复合项目检索其所包含的项目明细
     */
    *loadConfirm({ payload }, { call, put }) {
      const { query } = (payload || {});
      yield put({ type: 'setState', payload: { isSpin: true } });
      const { data } = yield call(findItemDetailByItemId, query);
      yield put({ type: 'setState', payload: { isSpin: false } });

      if (data && data.success) {
        const { result } = data;
        const dataTmp = result.data;
        const approvalNo = result.approvalNo;
        const resData = dataTmp || [];
        yield put({ type: 'setState', payload: { visible: '1', confirmData: resData, record: query, approvalNo } });
      }
    },
    /*
    根据复合项目检索其所包含的项目明细
     */
    *loadMatInfo({ payload }, { call, put }) {
      const { query } = (payload || {});
      yield put({ type: 'setState', payload: { isSpin: true } });
      const { data } = yield call(findMaterialInfoByItemId, query);
      yield put({ type: 'setState', payload: { isSpin: false } });

      if (data && data.success) {
        const { result } = data;
        const dataTmp = result.data;
        const approvalNo = result.approvalNo;
        const resData = dataTmp || [];
        yield put({ type: 'setState', payload: { visible: '4', matData: resData, matRecord: query, approvalNo } });
      }
    },
    /*
    非复合项目执行确认
     */
    *save({ payload }, { call, put }) {
      const { record } = (payload || {});
      yield put({ type: 'setState', payload: { isSpin: true } });
      const { data } = yield call(savePatientStore, record);
      if (data && data.success) {
        yield put({ type: 'load' });
        notification.info({ message: '提示信息：', description: '数据保存成功！' });
      } else {
        notification.info({ message: '提示信息：', description: data.msg });
      }
      yield put({ type: 'setState', payload: { isSpin: false, visible: '' } });
    },
  /*
  复合项目执行确认
   */
    *saveDetail({ params }, { select, call, put }) {
      yield put({ type: 'setState', payload: { isSpin: true } });
      const confirmData = yield select(state => state.patientStoreExec.confirmData);
      const record = yield select(state => state.patientStoreExec.record);
      const { data } = yield call(saveDetail, { confirmData, record });
      if (data && data.success) {
        notification.info({ message: '提示信息：', description: '保存成功！' });
        yield put({ type: 'load' });
        yield put({ type: 'setState', payload: { visible: '', confirmData: [], record: '' } });
      } else {
        notification.info({ message: '提示信息：', description: data.msg });
      }
      yield put({ type: 'setState', payload: { isSpin: false } });
    },

/*
作废单条记录
 */
    *delete({ record }, { call, put }) {
      yield put({ type: 'setState', payload: { isSpin: true } });
      const { data } = yield call(deletePatientStore, record);
      yield put({ type: 'setState', payload: { isSpin: false } });
      if (data && data.success) {
        const search = { recipeId: record.recipeId, recipeNo: record.recipeNo, itemCode: record.itemCode };
        yield put({ type: 'loadRecord', payload: { query: search } });
      }
    },
    /*
    更新划价信息
     */
    *updateItem({ record }, { select, put }) {
      const tmpItem = yield select(state => state.patientStoreExec.tmpItem);
      const newItem = { ...tmpItem, ...record };
      yield put({ type: 'setState', payload: { query: { tmpItem: newItem } } });
    },

    *deleteDetail({ record }, { select, put }) {
      let confirmData = yield select(state => state.patientStoreExec.confirmData);
      confirmData = confirmData.splice(confirmData.indexOf(record), 1);
      yield put({ type: 'setState', payload: { query: { confirmData } } });
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
      return { ...state, recordData: resData, detailPage: resPage };
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
            type: 'utils/initDicts',
            payload: ['SEX', 'INFECTIOUS_DISEASE'],
          });
        }
        if (pathname === '/odws/orderSearch') {
          dispatch({
            type: 'utils/initDicts',
            payload: ['SEX', 'INFECTIOUS_DISEASE'],
          });
          dispatch({
            type: 'setState',
            payload: { isShow: true },
          });
        }
      });
    },
  },
};
