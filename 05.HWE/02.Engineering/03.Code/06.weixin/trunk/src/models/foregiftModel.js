import { Toast } from 'antd-mobile/lib/index';
import { create } from '../services/foregiftService';
import { createBill } from '../services/paymentService';

export default {

  namespace: 'foregift',
  state: {
    data: [],
  },

  effects: {
    *create({ payload, callback }, { call, put, select }) {
      const { query } = payload;
      const { currProfile: profile } = yield select(state => state.base);
      const info = {
        ...profile,
        amt: query.amt,
        appChannel: query.appCode,
        terminalCode: query.terminalCode,

      };
      const { data } = yield call(create, info);
      if (data && data.success) {
        const { result } = data || {};
        const tmpBill = yield call(createBill, { ...query, ...{ bizNo: result.id } });
        const { data: { result: rt, success: flag } } = tmpBill || {};
        if (flag) {
          yield put({
            type: 'payment/save',
            payload: {
              bill: rt || [],
            },
          });
          if (callback) callback(rt);
        }
      } else {
        Toast.info('充值失败，请联系管理员！', 5);
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
