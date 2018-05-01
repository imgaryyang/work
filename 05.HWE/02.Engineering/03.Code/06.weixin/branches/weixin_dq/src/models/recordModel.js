import { Toast, ListView } from 'antd-mobile';
import moment from 'moment/moment';
import { getRecordList, getDiagnoseList, getDrugList } from '../services/recordService';
import { getReport, getPacs } from '../services/reportService';


export default {
  namespace: 'record',
  state: {
    data: {},
    rowData: {},
    isLoading: false,
    refreshing: false,
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
        // console.info('pathname ', pathname);
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
      // console.log('getRecordList', data);
      if (data && data.success) {
        const { result } = data;
        yield put({ type: 'setState', payload: { data: result, isLoading: false } });
      } else if (data && data.msg) {
        yield put({ type: 'setState', payload: { data: [], isLoading: false } });
        // Toast.info('请求出错');
        Toast.fail(data.msg, 1);
      } else {
        yield put({ type: 'setState', payload: { data: [], isLoading: false } });
      }
    },
    *loadRecordDetail({ payload }, { call, put, select }) {
      // console.log('loadRecordDetail....payload', payload);
      if (payload === null) {
        Toast.info('请求出错!');
      }
      let diagnosesResult;
      let drugsResult;
      let pacsResult = [];
      let testsResult = [];
      yield put({ type: 'setState', payload: { isLoading: true } });
      const diagnoses = yield call(getDiagnoseList, payload);
      // (data && data.success)
      if (diagnoses.data && diagnoses.data.success) {
        diagnosesResult = diagnoses.data.result;
        yield put({ type: 'setState', payload: { diagnoses: diagnosesResult, isLoading: false } });
      } else if (diagnoses.data && diagnoses.data.msg) {
        yield put({ type: 'setState', payload: { diagnoses: [], isLoading: false } });
        // Toast.info('请求诊断信息出错');
        Toast.fail(diagnoses.data.msg, 1);
      } else {
        yield put({ type: 'setState', payload: { diagnoses: [], isLoading: false } });
      }
      yield put({ type: 'setState', payload: { isLoading: true } });

      const drugsQuery = { ...payload, actId: payload.id };
      const drugs = yield call(getDrugList, drugsQuery);
      // console.log('drugs', drugs);
      if (drugs.data && drugs.data.success) {
        drugsResult = drugs.data.result;
        yield put({ type: 'setState', payload: { drugs: drugsResult, isLoading: false } });
      } else if (drugs.data && drugs.data.msg) {
        yield put({ type: 'setState', payload: { drugs: [], isLoading: false } });
        // Toast.info('处方信息请求出错')
        Toast.fail(drugs.data.msg, 1);
      } else {
        yield put({ type: 'setState', payload: { drugs: [], isLoading: false } });
      }
      yield put({ type: 'setState', payload: { isLoading: true } });

      const { currProfile, currHospital } = yield select(model => model.base);
      // console.log('lis....payload', payload);
      const { treatStart } = payload;
      const endDate = moment(treatStart).format('YYYY-MM-DD');
      const startDate = moment(treatStart).subtract(1, 'days').format('YYYY-MM-DD');
      const query = { proNo: currProfile.no, hosNo: currHospital.no, startDate, endDate };
      const tests = yield call(getReport, query);
      if (tests.data && tests.data.success) {
        testsResult = tests.data.result;
        for (let i = 0; i < testsResult.length; i++) {
          testsResult[i].testType = '0001';
          testsResult[i].pkgName = '化验';
        }
        yield put({ type: 'setState', payload: { tests: testsResult, isLoading: false } });
      } else if (tests.data && tests.data.msg) {
        yield put({ type: 'setState', payload: { tests: [], isLoading: false } });
        // Toast.info('请求检查列表出错');
        Toast.fail(tests.data.msg, 1);
      } else {
        yield put({ type: 'setState', payload: { tests: [], isLoading: false } });
      }
      yield put({ type: 'setState', payload: { isLoading: true } });
      const pacsQuery = { ...payload, actId: payload.id };
      const pacs = yield call(getPacs, pacsQuery);
      // console.log('pacs', pacs);
      if (pacs.data && pacs.data.success) {
        pacsResult = pacs.data.result;
        for (let i = 0; i < pacsResult.length; i++) {
          pacsResult[i].testType = '0002';
          pacsResult[i].pkgName = '特检';
          // pacsResult[i].reportTime = pacsResult[i].orderTime;
          // pacsResult[i].itemName = pacsResult[i].name;
        }
        const allTestsResult = testsResult.concat(pacsResult);
        yield put({ type: 'setState', payload: { tests: allTestsResult, isLoading: false } });
      } else if (pacs.data && pacs.data.msg) {
        yield put({ type: 'setState', payload: { isLoading: false } });
        // Toast.info('请求特检列表出错');
        Toast.fail(pacs.data.msg, 1);
      } else {
        yield put({ type: 'setState', payload: { isLoading: false } });
      }
      // 接口均调用失败，或者接口均返回false
      if ((!pacs.data && !tests.data) || (!pacs.data.success && tests.data.success) || (testsResult.length + pacsResult.length === 0)) {
        yield put({ type: 'setState', payload: { tests: [], isLoading: false } });
      }
    },
  },

  reducers: {
    setState(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
