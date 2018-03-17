import { Toast } from 'antd-mobile/lib/index';
import { create } from '../services/depositService';

export default {

  namespace: 'deposit',
  state: {
    data: [],
  },

  effects: {
    *create({ payload, callback }, { call, put, select }) {
      const { query } = payload;
      const { currProfile: profile, user } = yield select(state => state.base);
      const info = {
        proId: profile.id,
        proName: profile.name,
        proNo: profile.No,
        userId: user.id,
        amt: query.amt,
        appChannel: query.appCode,
      };
      const { data } = yield call(create, info);
      if (data && data.success) {
        const { result } = data || {};
        const tmpBill = {
          billTitle: `患者${profile.name} 充值 ${query.amt}`,
          amt: query.amt, // 充值金额
          appCode: 'GZH', // 应用渠道
          bizType: '00', // 门诊预存
          bizNo: result.id, // 门诊预存流水号
          bizUrl: '',
          bizBean: 'bizBean',
          bizTime: '2018-01-22 00:00:00',
        };
        yield put({
          type: 'payment/save',
          payload: {
            bill: tmpBill || {},
          },
        });
        if (callback) callback(tmpBill);
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
