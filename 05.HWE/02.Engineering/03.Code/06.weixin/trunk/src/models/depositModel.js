import { Toast } from 'antd-mobile/lib/index';
import { create, getPreStore, refund } from '../services/depositService';
import { save } from '../utils/common';
import Global from '../Global';

export default {

  namespace: 'deposit',
  state: {
    data: {},
    refundResult: {}
  },

  effects: {
    *create({ payload, callback }, { call, put, select }) {
      const { query } = payload;
      const { currProfile: profile, user, currHospital: hospital } = yield select(state => state.base);
      // console.log('depositModel:currProfile');
      // console.log(profile);
      // console.log(user);
      const info = {
        hosId: profile.hosId,
        hosNo: profile.hosNo,
        proId: profile.id,
        hosName: hospital.name,
        proName: profile.name,
        proNo: profile.no,
        cardNo: profile.cardNo,
        cardType: '2', // 暂时都写死成健康卡
        type: query.type,
        accountType: '9', // 其他
        // no: his返回的交易号
        // outTradeNo: 支付宝或者微信返回的流水号
        // tradeTime: 支付宝或者微信返回的流水号
        // balance:
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
        const order = {
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
        console.log(order.bizUrl);
        yield put({
          type: 'payment/save',
          payload: {
            bill: order || {},
          },
        });
        if (callback) callback(order);
      } else {
        Toast.info('充值失败，请联系管理员！', 5);
      }
    },
    *refund({ payload, callback }, { call, put, select }) {
      console.log('depositModel refund begin:');
      const { bill } = payload;
      const { currProfile: profile, user, currHospital: hospital } = yield select(state => state.base);
      const info = {
        hosId: profile.hostId,
        hosNo: profile.hostNo,
        hosName: profile.hosName,
        proId: profile.id,
        proNo: profile.no,
        proName: profile.name,
        cardNo: profile.cardNo,
        cardType: '2', // 健康卡
        type: '1', // 退款
        // no: his的结算单号，暂定在调用his的冻结接口的时候会返回回来
        // depositTime: 由后台生成
        amt: bill.amt,
        // balance: his端扣款成功后，由his端返回
        // tradeNo: 第三方支付返回的结算单号
        // tradeTime: 第三方支付返回的结算单号
        userId: user.id,
        account: profile.acctNo,
        accountName: profile.name,
        accountType: '9', // 其他
        appChannel: 'APP',
        tradeChannel: bill.tradeChannel,
        tradeChannelCode: bill.tradeChannelCode,
        // batchNo: 目前微信公众号和支付宝服务号都不用传
        adFlag: bill.adFlag,
        comment: bill.comment,
        operator: user.id,
        status: 'A',
        // oriTradeNo: bill.oriTradeNo,
        // oriAmt: bill.oriAmt,
        appType: bill.appType, // 审计字段
        appCode: bill.appCode, // 审计字段
        bizType: '00', // 门诊预存，目前只有门诊预存有退款，所以写成固定值
        payType: bill.tradeChannel === 'Z' ? 'aliPay' : 'wxPay',
        PayChannelCode: bill.tradeChannel === 'Z' ? 'alipay' : 'wxpay',
        payTypeId: bill.tradeChannel === 'Z' ? '4028748161098e60016109987e280021' : '4028748161098e60016109987e280011',
        settleNo: bill.settleNo,
        tradeNo: bill.tradeNo
      };
      console.log('depositModel refund begin:2');
      const { data } = yield call(refund, info);
      yield put({
        type: 'save',
        payload: {
          refundResult: data || {},
        },
      });
      if (callback) callback();
      // if (data && data.success) {
      //   if (callback) callback();
      // } else {
      //   Toast.info(data.msg, 3);
      // }
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
        Toast.info(data.msg, 3);
        yield put(save({ data: {} }));
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
