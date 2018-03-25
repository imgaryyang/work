import { Toast } from 'antd-mobile/lib/index';
import { create, getPreStore } from '../services/depositService';
import { save } from '../utils/common';
import Global from '../Global';

export default {

  namespace: 'deposit',
  state: {
    data: {},
  },

  effects: {
    *create({ payload, callback }, { call, put, select }) {
      const { query } = payload;
      const { currProfile: profile, user, currHospital: hospital } = yield select(state => state.base);
      console.log('depositModel:currProfile');
      console.log(profile);
      console.log(user);
      const info = {
        hosId: profile.hostId,
        hosNo: profile.hostNo,
        proId: profile.id,
        hosName: hospital.name,
        proName: profile.name,
        proNo: profile.no,
        cardNo: profile.cardNo,
        cardType: '2', // 暂时都写死成健康卡
        type: query.tradeType,
        accountType: '9', // 其他
        //tradeTime 由后台生成
        //tradeNo: his返回的交易号
        //outTradeNo: 支付宝或者微信返回的流水号
        //balance:
        account: profile.acctNo,
        accountName: profile.name,
        userId: user.id,
        amt: query.amt,
        appChannel: query.appCode,
        // tradeChannel: 在生成业务单的时候，尚未选择支付宝或者是微信
        adFlag: query.adFlag,
        operator: user.id,
        status: 'A',
      };

      const { data } = yield call(create, info);
      if (data && data.success) {
        const { result } = data || {};
        const tmpBill = {
          billTitle: `患者${profile.name} 门诊充值金额 ${query.amt} 元`,
          amt: query.amt, // 充值金额
          appCode: query.appCode, // 应用渠道
          bizType: query.bizType, // 门诊预存
          bizNo: result.id, // 门诊预存流水号
          bizUrl: `${Global.Config.host}/treat/deposit/callback`,
          //bizUrl: 'http://127.0.0.1/api/hwe/treat/deposit/callback',
          // bizBean: 'bizBean',
          bizTime: result.createdAt,
        };
        console.log(tmpBill.bizUrl);
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
    *getPreStore({ profile, callback }, { call, put, select }) {
      console.log('getPreStore begin:');
      const info = {};
      if (profile === null || profile === undefined) {
        const { currProfile } = yield select(state => state.base);
        console.info(profile);
        info.no = currProfile.no;
        info.hosId = currProfile.hosId;
      } else {
        info.no = profile.no;
        info.hosId = profile.hosId;
      }
      console.log('getPreStore begin1:', info.no);
      if (info.no === null || info.no === '' || info.no === undefined) {
        return;
      }
      console.log('getPreStore begin1:3');
      const { data } = yield call(getPreStore, info);
      console.log('getPreStore begin1:4');
      console.info(data);
      if (data && data.success) {
        const { result } = data || {};
        console.log('infomation res:');
        console.info(result);
        yield put(save({ data: result }));
        if (callback) callback(result);
      } else {
        Toast.info('充值失败，请联系管理员！', 5);
      }
    },
  },


  reducers: {
    save(state, action) {
      console.log('depositModel:');
      console.info(action);
      return { ...state, ...action.payload };
    },
  },
};