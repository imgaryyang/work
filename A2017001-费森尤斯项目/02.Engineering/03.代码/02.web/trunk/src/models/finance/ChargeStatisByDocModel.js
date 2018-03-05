import { merge } from 'lodash';
import { statisByDeptAndDoc, statisByTimeAndDept } from '../../services/finance/ChargeStatisService';

export default {
  namespace: 'chargeStatisByDoc',

  state: {
    page: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    selectedRowKeys: [],
    data: [],
    dicts: {},
    record: null,
    isSpin: false,
    visible: false,
    searchObjs: {},
    selectedTag: '',
    dataOfTime: [],
    formCache: {},
    xiyaoSum: '',
    zhenchaSum: '',
    zhiliaoSum: '',
    xuetouSum: '',
    fumoSum: '',
    guahaoSum: '',
    zhongchengSum: '',
    huayanSum: ''
  },

  effects: {
    *load({ payload }, { call, put }) {
      const { query } = (payload || {});
      yield put({ type: 'setState', payload: { isSpin: true } });
      const { data } = yield call(statisByDeptAndDoc, query);
      console.log(data);
      let xiyaoSum = 0;
      let zhenchaSum = 0;
      let zhiliaoSum = 0;
      let guahaoSum = 0;
      let zhongchengSum = 0;
      let huayanSum = 0;
      if(data && data.result) {
        for (const item of data.result.dataList) {
          if (item['001'] !== undefined) {
            xiyaoSum += item['001'];
          }
          if (item['007'] !== undefined) {
            zhenchaSum += item['007'];
          }
          if (item['009'] !== undefined) {
            zhiliaoSum += item['009'];
          }
          if (item['002'] !== undefined) {
            zhongchengSum += item['002'];
          }
          if (item['012'] !== undefined) {
            huayanSum += item['012'];
          }
          if (item['004'] !== undefined) {
            guahaoSum += item['004'];
          }
        }
      }
      yield put({
        type: 'setState',
        payload: {
           xiyaoSum, 
           guahaoSum,
           zhenchaSum,
           zhiliaoSum,
           zhongchengSum,
           huayanSum,
         }
      });
      yield put({ type: 'setState', payload: { isSpin: false } });
      if (data) {
        yield put({ type: 'init', data }); 
      }
    },
    *loadByTimeAndDept({ payload }, { call, put }) {
      let xuetouSum = 0;
      let fumoSum = 0;
      const { query } = (payload || {});
      yield put({ type: 'setState', payload: { isSpin: true } });
      const { data } = yield call(statisByTimeAndDept, query);
      if(data && data.result){
         for (const item of data.result.dataList) {
          if (item['297e038f5cd915cf015cd95dd0d60022'] === undefined) {
            console.log('no');
          }
          else {
            console.log(item['297e038f5cd915cf015cd95dd0d60022']);
            xuetouSum += item['297e038f5cd915cf015cd95dd0d60022'];
          }
          if (item['297e038f5cd915cf015cd95e0ba80023'] === undefined) {
            console.log('no');
          }
          else {
            fumoSum += item['297e038f5cd915cf015cd95e0ba80023'];
          }
      }
    }
      yield put({ type: 'setState', payload: { xuetouSum } });
      yield put({ type: 'setState', payload: { fumoSum } });
      yield put({ type: 'setState', payload: { isSpin: false } });
      if (data) {
        yield put({ type: 'initTimeDate', data });
      }
    },
  },

  reducers: {
    init(state, { data }) {
      const { result } = data;
      const resData = result || [];
      return { ...state, data: resData };
    },
    initTimeDate(state, { data }) {
      const { result } = data;
      const resData = result || [];
      return { ...state, dataOfTime: resData };
    },

    setState(state, { payload }) {
      return { ...state, ...payload };
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
        if (pathname === '/charge/statisByDocAndItem') {
          dispatch({
            type: 'load',
          });
          dispatch({
            type: 'utils/initDicts',
            payload: ['DRUG_TYPE'],
          });
        }
      });
    },
  },
};
