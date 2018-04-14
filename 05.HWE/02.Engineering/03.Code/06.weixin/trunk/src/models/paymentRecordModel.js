import { ListView, Toast } from 'antd-mobile/lib/index';
import { findPaymentRecord, findUnpaidsRecord, prePay, pay, getConsumeRecords, getPreRecords, getPreStore } from '../services/paymentRecordService';

export default {
  namespace: 'paymentRecord',
  state: {
    consumeRecordsData: {},
    preRecordsData: {},
    preStore: {},
    isLoading: false,
    rowDate: {},
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    }),
    height: document.documentElement.clientHeight,
    data: [],
    prePayData: {},
    payData: {},
    prePayRecipeNos: [],
  },
  subscriptions: {
    setup({ history, dispatch }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/paymentRecord/paymentRecordList') {
          dispatch({ type: 'findChargeList', payload: {} });
        }
      });
    },
  },
  effects: {
    * findChargeList({ payload }, { call, put, select }) {
      const { query } = payload;
      let pro = {};
      if (query) {
        pro = query;
      } else {
        console.log('3');
        const { currProfile: profile } = yield select(state => state.base);
        pro = profile;
      }
      console.log('4');
      if (JSON.stringify(pro) !== '{}') {
        console.log('5');
        const { data } = yield call(findPaymentRecord, pro);
        const { result } = data || {};
        console.log('6');
        yield put({
          type: 'save',
          payload: {
            data: result || [],
          },
        });
      }
    },
    * findUnpaidChargeList({payload}, {call, put, select}) {
      const { query } = payload;
      let pro = {};
      if (query) {
        pro = query;
      } else {
        const { currProfile: profile } = yield select(state => state.base);
        pro = profile;
      }
      if (JSON.stringify(pro) !== '{}') {
        yield put({ type: 'setState', payload: { isLoading: true } });
        const { data } = yield call(findUnpaidsRecord, pro);
        if (data && data.success) {
          const { result } = data || {};
          yield put({
            type: 'save',
            payload: {
              data: result || [],
              isLoading: false,
            },
          });
        } else if (data && data.msg) {
          yield put({ type: 'setState', payload: { isLoading: false } });
          Toast.fail(`请求数据出错：${data.msg}`, 1);
        } else {
          Toast.info('请求缴费记录出错');
          yield put({ type: 'setState', payload: { isLoading: false } });
        }
      }
    },
    * prePay({ payload }, { call, put, select }) {
      const { recipeNos } = payload; // 选择的处方号
      const { currProfile: profile } = yield select(state => state.base);
      const {data} = yield select(state => state.paymentRecord);
      const pro = {};
      // 处方号不合法
      if (!recipeNos || !recipeNos.length || recipeNos.length < 1) {
        return;
      }
      pro.hosNo = profile.hosNo;
      pro.hosName = profile.hosName;
      pro.proNo = profile.no;
      pro.proName = profile.name;
      pro.cardNo = profile.cardNo
      pro.cardType = profile.cardType
      // pro.actNo = 就诊活动编号
      pro.miType = '1'; // 0,医保;1,自费 现在只允许自费患者缴费
      pro.tradeChannel = 'F'; // 预缴
      pro.tradeChannelCode = ''; // 文档中没有相关编码
      pro.comment = '';
      pro.appChannel = 'APP';
      // pro.appUser =
      // pro.chargeUser =
      pro.items = [];
      for (let idx = 0; idx < data.length; idx += 1) {
        if (recipeNos.indexOf(data[idx].recordNo) > -1) {
          pro.items.push(data[idx]);
        }
      }
      const {data: resData} = yield call(prePay, pro);
      const {result} = resData || {};
      yield put({
        type: 'save',
        payload: {
          prePayData: result || [],
          prePayRecipeNos: recipeNos || [],
        },
      });
    },
    // 缴费
    * pay({ callback }, { call, put, select }) {
      const { prePayRecipeNos: recipeNos } = yield select(state => state.paymentRecord)
      const { currProfile: profile } = yield select(state => state.base);
      const { data, prePayData } = yield select(state => state.paymentRecord);
      const pro = {};
      // 处方编号不合法
      if (!recipeNos || !recipeNos.length || recipeNos.length < 1) {
        return;
      }
      pro.hosNo = profile.hosNo;
      pro.hosName = profile.hosName;
      pro.proNo = profile.no;
      pro.proName = profile.name;
      pro.cardNo = profile.cardNo;
      pro.cardType = profile.cardType;
      // pro.actNo = 诊疗活动编号
      pro.miType = '1'; // 0,医保;1,自费 现在只允许自费患者缴费
      pro.tradeChannel = 'F'; // 预缴
      pro.tradeChannelCode = ''; // 文档中没有相关编码
      pro.comment = '';
      pro.appChannel = 'APP';
      pro.appUser = profile.id;
      pro.chargeNo = prePayData.chargeNo;
      // pro.chargeUser =
      pro.items = [];
      for (let idx = 0; idx < data.length; idx += 1) {
        if (recipeNos.indexOf(data[idx].recordNo) > -1) {
          pro.items.push(data[idx]);
        }
      }
      const { data: resData } = yield call(pay, pro);
      yield put({
        type: 'save',
        payload: {
          payData: resData || {},
        },
      });

      if (callback) callback();
    },
    // 初始化预缴数据
    * reset({ callback }, { put }) {
      yield put({
        type: 'save',
        payload: {
          data: [],
          prePayData: {},
          payData: {},
          prePayRecipeNos: [],
        }
      });
      if (callback) callback();
    },
    * loadConsumeRecords({ payload }, { call, put }) {
      if (payload === null) {
        Toast.info('请求出错');
      }
      yield put({ type: 'setState', payload: { isLoading: true } });
      const { data } = yield call(getConsumeRecords, payload);
      console.log('consumeRecordsData_data====', data);
      if (data && data.success) {
        const { result } = data;
        yield put({ type: 'setState', payload: { consumeRecordsData: result, isLoading: false } });
      } else if (data && data.msg) {
        yield put({ type: 'setState', payload: { isLoading: false } });
        Toast.fail(`请求数据出错：${data.msg}`, 1);
      } else {
        Toast.info('请求缴费记录出错');
        yield put({ type: 'setState', payload: { isLoading: false } });
      }
    },
    * loadPreRecords({ payload }, { call, put }) {
      if (payload === null) {
        Toast.info('请求出错');
      }
      yield put({ type: 'setState', payload: { isLoading: true } });
      const { data } = yield call(getPreRecords, payload);
      console.log('preRecordsData_data====', data);

      if (data && data.success) {
        const { result } = data;
        yield put({ type: 'setState', payload: { preRecordsData: result, isLoading: false } });
      } else if (data && data.msg) {
        yield put({ type: 'setState', payload: { isLoading: false } });
        // Toast.info('请求出错');
        Toast.fail(`请求数据出错：${data.msg}`, 1);
      } else {
        Toast.info('请求预存信息失败');
        yield put({ type: 'setState', payload: { isLoading: false } });
      }
    },
    * loadPreStore({ payload }, { call, put }) {
      if (payload === null) {
        Toast.info('请求出错');
      }
      yield put({ type: 'setState', payload: { isLoading: true } });
      const { data } = yield call(getPreStore, payload);
      console.log('preStore_data====', data);
      if (data && data.success) {
        const { result } = data;
        yield put({ type: 'setState', payload: { preStore: result, isLoading: false } });
      } else if (data && data.msg) {
        yield put({ type: 'setState', payload: { isLoading: false } });
        // Toast.info('请求出错');
        Toast.fail(`请求数据出错：${data.msg}`, 1);
      } else {
        Toast.info('请求余额信息失败');
        yield put({ type: 'setState', payload: { isLoading: false } });
      }
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    setState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
