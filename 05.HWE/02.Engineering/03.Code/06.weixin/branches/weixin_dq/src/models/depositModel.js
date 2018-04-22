import { Toast } from 'antd-mobile/lib/index';
import { create, getPreStore, refund } from '../services/depositService';
import { save } from '../utils/common';
import Global from '../Global';
import config from '../Config';

const orderMap = {
  '00': '门诊预存',
  '01': '预约',
  '02': '挂号',
  '03': '缴费（诊间结算）',
  '04': '住院预缴',
  '05': '办理就诊卡',
};
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
      const info = {
        hosId: profile.hosId,
        hosNo: profile.hosNo,
        proId: profile.id,
        hosName: hospital.name,
        proNo: profile.no,
        proName: profile.name,
        cardNo: profile.cardNo,
        cardType: profile.cardType, // 暂时都写死成健康卡
        type: query.type,
        amt: query.amt,
        // tradeNo: 第三方接口返回
        // tradeTime:
        userId: user.id,
        account: profile.acctNo,
        accountName: profile.name,
        accountType: '9', // 其他
        // accountBankCode: ''
        // tradeChannel:
        // tradeChannelCode:
        terminalCode: '',
        batchNo: '',
        adFlag: query.adFlag,
        comment: '',
        hisUser: profile.hisUser || user.id,
        appType: config.appType,
        appCode: config.appCode,
        terminalUser: profile.hisUser || user.id,
        // no: his返回的交易号
        // balance:
        appChannel: query.appCode,
        operator: user.id,
        status: 'A',
      };
      const { data } = yield call(create, info);
      if (data && data.success) {
        const { result } = data || {};
        const order = {
          billTitle: `${orderMap[query.bizType]}`,
          amt: query.amt, // 充值金额
          appCode: query.appCode, // 应用渠道
          bizType: query.bizType, // 门诊预存
          bizNo: result.id, // 门诊预存流水号
          bizUrl: `${Global.Config.host}/treat/deposit/callback`,
          // bizUrl: 'http://127.0.0.1/api/hwe/treat/deposit/callback',
          // bizBean: 'bizBean',
          bizTime: result.createdAt,
        };
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
      const { bill } = payload;
      const { currProfile: profile, user, currHospital: hospital } = yield select(state => state.base);
      const info = {
        hosId: profile.hosId,
        hosNo: profile.hosNo,
        hosName: profile.hosName,
        proId: profile.id,
        proNo: profile.no,
        proName: profile.name,
        cardNo: profile.cardNo,
        cardType: profile.cardType, // 健康卡
        type: '1', // 退款
        amt: bill.amt,
        // tradeNo: 第三方支付返回的结算单号
        // tradeTime: 第三方支付返回的结算单号
        userId: user.id,
        account: profile.acctNo,
        accountName: profile.name,
        accountType: '9', // 其他
        // accountBankCode: '',
        tradeChannel: bill.tradeChannel,
        tradeChannelCode: bill.tradeChannelCode,
        // terminalCode: '',
        // batchNo: '',
        adFlag: bill.adFlag,
        comment: bill.comment,
        hisUser: profile.hisUser || user.id,
        appType: bill.appType, // 审计字段
        appCode: bill.appCode, // 审计字段
        terminalUser: profile.hisUser || user.id,
        // terminalCode: '',
        // no: his的结算单号，暂定在调用his的冻结接口的时候会返回回来
        // depositTime: 由后台生成
        // balance: his端扣款成功后，由his端返回
        appChannel: 'APP',
        operator: user.id,
        status: 'A',
        // oriTradeNo: bill.oriTradeNo,
        // oriAmt: bill.oriAmt,
        bizType: '00', // 门诊预存，目前只有门诊预存有退款，所以写成固定值
        payType: bill.tradeChannel === 'Z' ? 'aliPay' : 'wxPay',
        PayChannelCode: bill.tradeChannel === 'Z' ? 'alipay' : 'wxpay',
        payTypeId: bill.tradeChannel === 'Z' ? '4028748161098e60016109987e280021' : '4028748161098e60016109987e280011',
        // settleNo: bill.settleNo,
        tradeNo: bill.tradeNo,
        oriNo: bill.oriNo,
      };
      const { data } = yield call(refund, info);
      if (data && data.success) {
        yield put({
          type: 'save',
          payload: {
            refundResult: data || {},
          },
        });
        if (callback) callback();
      } else {
        yield put({
          type: 'save',
          payload: {
            refundResult: {},
          },
        });
      }
    },
    *getPreStore({ profile, callback }, { call, put, select }) {
      const info = {};
      if (profile === null || profile === undefined) {
        const { currProfile } = yield select(state => state.base);
        info.no = currProfile.no;
        info.hosNo = currProfile.hosNo;
      } else {
        info.no = profile.no;
        info.hosNo = profile.hosNo;
      }
      if (info.no === null || info.no === '' || info.no === undefined) {
        return;
      }
      const { data } = yield call(getPreStore, info);
      console.info('getPreStore:data:', data);
      if (data && data.success) {
        const { result } = data || {};
        yield put(save({ data: result }));
        console.info('getPreStore:', result);
        if (callback) callback();
      } else {
        Toast.info(data.msg, 3);
        yield put(save({ data: {} }));
      }
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
