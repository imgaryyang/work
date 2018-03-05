import { notification } from 'antd';
import { loadPatientPage, savePatient } from '../../services/card/PatientService';

export default {
  namespace: 'patient',
  state: {
    page: { total: 0, pageSize: 10, pageNo: 1 },
    query: {},
    patients: [],
    selectedIdx: -1,
    patient: {},
    spin: false,
  },
  effects: {

    *load({ payload }, { select, call, put }) {
      const { page, query, search } = (payload || {});

      const defaultPage = yield select(state => state.patient.page);
      const p = { ...defaultPage, ...page };
      // 当重新发起查询时将页码置为 1
      if (search) p.pageNo = 1;
      const start = (p.pageNo - 1) * p.pageSize;

      yield put({ type: 'addSpin' });

      const { data } = yield call(loadPatientPage, start, p.pageSize, query);
      if (data && data.success) {
        yield put({
          type: 'init',
          data,
          page: p,
          query: query || {},
        });
      }
      // 移除载入指示器
      yield put({ type: 'removeSpin' });
    },

    *save({ params }, { call, put }) {
      // console.log(params);
      yield put({ type: 'addSpin' });
      const { data } = yield call(savePatient, params);

      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            patient: data.result,
          },
        });
        notification.info({
          message: '提示',
          description: '患者建档成功！',
        });
        yield put({ type: 'load' });
      }
      // 移除载入指示器
      yield put({ type: 'removeSpin' });
    },

  },
  reducers: {

    init(state, { data, page, query }) {
      const { result = result || [], total } = data;
      // result = result || [];
      const p = { ...state.page, ...page, total };
      const patients = result || [];
      const patient = patients.length === 1 ? patients[0] : {};
      const selectedIdx = patients.length === 1 ? 0 : -1;
      return {
        ...state,
        patients,
        patient,
        selectedIdx,
        page: p,
        query,
      };
    },

    setState(oldState, { payload }) {
      return { ...oldState, ...payload };
    },

    addSpin(state) {
      return { ...state, spin: true };
    },

    removeSpin(state) {
      return { ...state, spin: false };
    },
  },
};
