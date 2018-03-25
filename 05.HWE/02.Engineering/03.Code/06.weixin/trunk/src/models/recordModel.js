import { Toast } from 'antd-mobile';
import { ListView } from 'antd-mobile/lib/index';
import { getRecordList, getDiagnoseList, getDrugList } from '../services/recordService';
import { getReport, getReportDetail } from '../services/reportService';

export default {
  namespace: 'record',
  state: {
    data: {},
    isLoading: false,
    diagnoses: {},
    drugs: {},
    tests: {},
    rowDate: {},
    diagnoseRowDate: {},
    drugRowDate: {},
    testRowDate: {},
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    }),
    diagnoseDataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    }),
    drugDataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    }),
    testDataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    }),
    height: document.documentElement.clientHeight,
  },

  subscriptions: {
    setup({ history, dispatch }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname }) => {
        console.info('pathname ', pathname);
        if (pathname === '/appoint/departments') {
          dispatch({ type: 'departments' });
        }
      });
    },
  },

  effects: {
    *loadRecordList({ payload }, { call, put }) {
      if (payload === null) {
        Toast.info('请求出错');
      }
      yield put({ type: 'setState', payload: { isLoading: true } });
      const { data } = yield call(getRecordList, payload);
      if (data.success) {
        const { result } = data;
        yield put({ type: 'setState', payload: { data: result, isLoading: false } });
      } else {
        yield put({ type: 'setState', payload: { isLoading: false } });
        Toast.info('请求出错');
      }
    },
    *loadRecordDetail({ payload }, { call, put }) {
      if (payload === null) {
        Toast.info('请求出错');
      }
      let diagnosesResult;
      let drugsResult;
      let testsResult;
      yield put({ type: 'setState', payload: { isLoading: true } });
      const diagnoses = yield call(getDiagnoseList, payload);
      if (diagnoses.data.success) {
        diagnosesResult = diagnoses.data.result;
        yield put({ type: 'setState', payload: { diagnoses: diagnosesResult, isLoading: false } });
      } else {
        yield put({ type: 'setState', payload: { isLoading: false } });
        Toast.info('请求诊断信息出错');
      }
      yield put({ type: 'setState', payload: { isLoading: true } });
      const drugs = yield call(getDrugList, payload);
      if (drugs.data.success) {
        drugsResult = drugs.data.result;
        yield put({ type: 'setState', payload: { drugs: drugsResult, isLoading: false } });
      } else {
        yield put({ type: 'setState', payload: { isLoading: false } });
        Toast.info('处方信息请求出错');
      }
      yield put({ type: 'setState', payload: { isLoading: true } });
      const tests = yield call(getReport, payload);
      if (tests.data.success) {
        testsResult = tests.data.result;
        yield put({ type: 'setState', payload: { tests: testsResult, isLoading: false } });
      } else {
        yield put({ type: 'setState', payload: { isLoading: false } });
        Toast.info('请求诊断信息出错');
      }
    },
  },

  reducers: {
    setState(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
