import { createBill, prePay, refund } from '../services/paymentService';
import {Toast} from "antd-mobile/lib/index";

export default {

  namespace: 'payment',

  state: {
    bill: {},
    settlement: {},
    bizType: '00', // 门诊充值，住院缴费
    amt: '', // 充值金额
    serviceType: 0, // 0,在线充值;1,门诊缴费
  },

  subscriptions: {

  },

  effects: {
    *createBill({ payload, callback }, { call, put }) {
      const { bill } = payload;
      const { data } = yield call(createBill, bill);
      const { result } = data || {};
      yield put({
        type: 'save',
        payload: {
          bill: result || [],
        },
      });
      if (callback) callback();
    },
    *prePay({ payload, callback }, { call, put }) {
      console.log('paymentModel:prePay');
      Toast.loading('正在处理...');
      const { settlement } = payload;
      const { data } = yield call(prePay, settlement);
      if (data && data.success) {
        const { result } = data || {};
        yield put({
          type: 'save',
          payload: {
            settlement: result || [],
          },
        });
        Toast.hide();
      } else {
        Toast.hide();
      }
      if (callback) callback();
    },
    *refund({ payload, callback }, { call, put }) {
      const { settlement } = payload;
      const { data } = yield call(refund, settlement);
      if (data && data.success) {
        const { result } = data || {};
        yield put({
          type: 'save',
          payload: {
            settlement: result || [],
          },
        });
      }
      if (callback) callback();
    },
    // 设置业务类型：00,门诊充值;01,住院预缴
    *setBizType({ bizType }, { put }) {
      yield put({
        type: 'save',
        payload: {
          bizType,
        },
      });
    },
    // 设置充值金额
    *setAmt({ amt }, { put }) {
      yield put({
        type: 'save',
        payload: {
          amt,
        },
      });
    },
    // 设置服务类型
    *setServiceType({ serviceType }, { put }) {
      console.log('serviceType:', serviceType);
      yield put({
        type: 'save',
        payload: {
          serviceType,
        },
      });
    },

  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
