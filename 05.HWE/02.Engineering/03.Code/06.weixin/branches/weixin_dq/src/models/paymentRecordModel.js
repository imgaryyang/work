import { ListView, Toast } from 'antd-mobile/lib/index';
import { findPaymentRecord, findUnpaidsRecord, prePay, pay, getConsumeRecords, getPreRecords, getPreStore } from '../services/paymentRecordService';
import config from '../Config';

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
        const { data } = yield call(findPaymentRecord, pro);
        const { result } = data || {};
        yield put({
          type: 'save',
          payload: {
            data: result || [],
          },
        });
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
        yield put({ type: 'setState', payload: { isLoading: true, data: [] } });
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
      pro.hisUser = profile.hisUser || user.id; // 2018/04/05 当前hisUser为空，拿userId代替
      pro.appType = config.appType;
      pro.appCode = config.appCode;
      pro.terminalUser = profile.terminalUser || user.id; // 2018/04/05 当前terminalUser，拿userId代替
      // terminalCode	终端号 varchar(50)
      console.log('prePay:profile');
      console.info(profile);
      pro.items = [];
      for (let idx = 0; idx < data.length; idx += 1) {
        if (groupNos.indexOf(data[idx].groupNo) > -1) {
          pro.items.push(data[idx]);
        }
      }
      const { data: resData } = yield call(prePay, pro);
      const { result } = resData || {};
      yield put({
        type: 'save',
        payload: {
          prePayData: result || [],
          prePayGroupNos: groupNos || [],
        },
      });
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
      pro.hisUser = profile.hisUser || user.id; // 2018/04/05 当前hisUser为空，拿userId代替
      pro.appType = config.appType;
      pro.appCode = config.appCode;
      pro.terminalUser = profile.hisUser || user.id; // 2018/04/05 当前hisUser为空，拿userId代替
      // pro.terminalCode =
      pro.items = [];
      for (let idx = 0; idx < data.length; idx += 1) {
        if (groupNos.indexOf(data[idx].groupNo) > -1) {
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
    *loadPreRecords({ payload }, { call, put }) {
      if (payload === null) {
        Toast.info('请求出错');
      }
      yield put({ type: 'setState', payload: { isLoading: true } });
      const { data } = yield call(getPreRecords, payload);
      console.log('preRecordsData_data====', data);

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
