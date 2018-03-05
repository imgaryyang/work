import { merge } from 'lodash';
import { statisByDeptAndDoc, statisByTimeAndDept, statisByDeptAndNurse } from '../../services/finance/ChargeStatisService';

export default {
  namespace: 'chargeStatisByNurse', 

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
  },

  effects: {
    *load({ payload }, { call, put }) {
      const { query } = (payload || {});
      yield put({ type: 'setState', payload: { isSpin: true } });
      const { data } = yield call(statisByDeptAndNurse, query);
      console.log(data);
      let xiyaoSum = 0;
      let zhenchaSum = 0;
      let zhiliaoSum = 0;
      let guahaoSum = 0;
      if(data && data.result) {
        for (const item of data.result.dataList) {
          if (item['001'] === undefined) {
            // console.log(11);
          }
          else {
            xiyaoSum += item['001'];
          }
          if (item['007'] === undefined) {
            // console.log(11);
          }
          else {
            zhenchaSum += item['007'];
          }
          if (item['009'] === undefined){
            // console.log(11);
          }
          else {
            zhiliaoSum += item['009'];
          }
          if (item['004'] === undefined){
            // console.log(11);
          }
          else {
            guahaoSum += item['004'];
          }
        }
      } 
      yield put({ type: 'setState', payload: { xiyaoSum } });
      yield put({ type: 'setState', payload: { zhenchaSum } });
      yield put({ type: 'setState', payload: { zhiliaoSum } });
      yield put({ type: 'setState', payload: { guahaoSum } });
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
      const { data } = yield call(statisByDeptAndNurse, query);
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
        if (pathname === '/charge/statisByNurseAndItem') {
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
