import { ListView, Toast } from 'antd-mobile/lib/index';
import { findPaymentRecord, findUnpaidsRecord, prePay, pay, getConsumeRecords, getPreRecords, getPreStore } from '../services/paymentRecordService';
import config from '../Config';
import Global from "../Global";

export default {
  namespace: 'paymentRecord',
  state: {
    consumeRecordsData: {},
    preRecordsData: {},
    preStore: {},
    isLoading: false,
    refreshing: false,
    rowDate: {},
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    }),
    height: document.documentElement.clientHeight,
    data: [],
    prePayData: {},
    payData: {},
    prePayGroupNos: [],
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
    *findChargeList({ payload }, { call, put, select }) {
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
        const { data } = yield call(findPaymentRecord, pro);
        if (data && data.success) {
          const { result } = data || {};
          yield put({
            type: 'save',
            payload: {
              data: result || [],
            },
          });
        } else {
          Toast.info('请求数据失败');
          yield put({ type: 'setState', payload: { isLoading: false, data: [] } });
        }
      }
    },
    *findUnpaidChargeList({ payload }, { call, put, select }) {
      const { query } = payload;
      let pro = {};
      const { currProfile: profile } = yield select(state => state.base);

      if (query) {
        pro = query;
      } else {
        pro = profile;
      }
      // 非自费患者，不加载待缴费数据
      if (profile.type !== '1') {
        yield put({ type: 'setState', payload: { data: [] } });
        return;
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
          yield put({ type: 'setState', payload: { isLoading: false, data: [] } });
          Toast.fail(`请求数据出错：${data.msg}`, 1);
        } else {
          Toast.info('请求缴费记录出错');
          yield put({ type: 'setState', payload: { isLoading: false, data: [] } });
        }
      }
    },
    *prePay({ payload }, { call, put, select }) {
      const { groupNos } = payload; // 选择的处方号
      const { currProfile: profile, user } = yield select(state => state.base);
      const { data } = yield select(state => state.paymentRecord);
      const pro = {};
      // 处方号不合法
      if (!groupNos || !groupNos.length || groupNos.length < 1) {
        return;
      }
      pro.hosId = profile.id;
      pro.hosNo = profile.hosNo;
      pro.hosName = profile.hosName;
      pro.proNo = profile.no;
      pro.proName = profile.name;
      pro.cardNo = profile.cardNo;
      pro.cardType = profile.cardType;
      // pro.actNo = 就诊活动编号
      pro.miType = profile.type; // 0,医保;1,自费 现在只允许自费患者缴费
      pro.chargeUser = user.id; // 收费人：微信或者支付宝
      pro.tradeChannel = 'F'; // 预缴
      pro.tradeChannelCode = ''; // 文档中没有相关编码
      pro.comment = '';
      pro.hisUser = Global.hisUser;
      pro.appType = config.appType;
      pro.appCode = config.appCode;
      pro.terminalUser = profile.no;
      pro.items = [];
      for (let idx = 0; idx < data.length; idx += 1) {
        if (groupNos.indexOf(data[idx].groupNo) > -1) {
          pro.items.push(data[idx]);
        }
      }
      if (JSON.stringify(pro) !== '{}') {
        yield put({ type: 'setState', payload: { isLoading: true } });
        const { data: resData } = yield call(prePay, pro);
        if (data && data.success) {
          const { result } = resData || {};
          yield put({
            type: 'save',
            payload: {
              prePayData: result || [],
              prePayRecipeNos: groupNos || [],
            },
          });
        } else {
          Toast.info('请求数据出错');
          yield put({ type: 'setState', payload: { isLoading: false, prePayData: [] } });
        }
      }
    },
    // 缴费
    *pay({ callback }, { call, put, select }) {
      const { prePayGroupNos: groupNos } = yield select(state => state.paymentRecord);
      const { currProfile: profile, user } = yield select(state => state.base);
      const { data, prePayData } = yield select(state => state.paymentRecord);
      const pro = {};
      // 处方编号不合法
      if (!groupNos || !groupNos.length || groupNos.length < 1) {
        return;
      }
      pro.hosNo = profile.hosNo;
      pro.hosName = profile.hosName;
      pro.proNo = profile.no;
      pro.proName = profile.name;
      pro.cardNo = profile.cardNo;
      pro.cardType = profile.cardType;
      // pro.actNo = 没有诊疗活动编号
      pro.miType = profile.type; // 0,医保;1,自费 现在只允许自费患者缴费
      pro.no = prePayData.no;
      pro.chargeUser = user.id;
      // pro.chargeTime = chargeTime 后台写入
      pro.tradeChannel = 'F'; // 预缴
      pro.tradeChannelCode = ''; // 文档中没有相关编码
      pro.comment = '';
      pro.hisUser = Global.hisUser;
      pro.appType = config.appType;
      pro.appCode = config.appCode;
      pro.terminalUser = profile.no;
      pro.terminalCode = profile.mobile;
      pro.items = [];
      for (let idx = 0; idx < data.length; idx += 1) {
        if (groupNos.indexOf(data[idx].groupNo) > -1) {
          pro.items.push(data[idx]);
        }
      }
      if (JSON.stringify(pro) !== '{}') {
        yield put({ type: 'setState', payload: { isLoading: true } });
        const { data: resData } = yield call(pay, pro);
        if (data && data.success) {
          yield put({
            type: 'save',
            payload: {
              payData: resData || {},
            },
          });
        } else {
          Toast.info('请求数据出错');
          yield put({ type: 'setState', payload: { isLoading: false, payData: [] } });
        }
      }

      if (callback) callback();
    },
    // 初始化预缴数据
    *reset({ callback }, { put }) {
      yield put({
        type: 'save',
        payload: {
          data: [],
          prePayData: {},
          payData: {},
          prePayGroupNos: [],
        }
      });
      if (callback) callback();
    },
    *loadConsumeRecords({ payload }, { call, put }) {
      if (payload === null) {
        Toast.info('请求出错');
      }
      yield put({ type: 'setState', payload: { isLoading: true } });
      const { data } = yield call(getConsumeRecords, payload);
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
    *loadPreRecords({ payload }, { call, put }) {
      if (payload === null) {
        Toast.info('请求出错');
      }
      yield put({ type: 'setState', payload: { isLoading: true } });
      const { data } = yield call(getPreRecords, payload);

      if (data && data.success) {
        const { result } = data;
        yield put({ type: 'setState', payload: { preRecordsData: result ? result : [], isLoading: false } });
      } else if (data && data.msg) {
        yield put({ type: 'setState', payload: { isLoading: false } });
        // Toast.info('请求出错');
        Toast.fail(`请求数据出错：${data.msg}`, 1);
      } else {
        Toast.info('请求预存信息失败');
        yield put({ type: 'setState', payload: { isLoading: false } });
      }
    },
    *loadPreStore({ payload }, { call, put }) {
      if (payload === null) {
        Toast.info('请求出错');
      }
      yield put({ type: 'setState', payload: { isLoading: true } });
      const { data } = yield call(getPreStore, payload);
      // console.log('preStore_data====', data);
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
