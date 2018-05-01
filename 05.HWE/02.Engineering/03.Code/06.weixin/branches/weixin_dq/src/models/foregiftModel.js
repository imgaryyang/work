import { Toast } from 'antd-mobile/lib/index';
import { create, getPreSPay } from '../services/foregiftService';
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

  namespace: 'foregift',
  state: {
    data: [],
  },

  effects: {
    *create({ payload, callback }, { call, put, select }) {
      const { query } = payload;
      const { currProfile: profile, user, currHospital: hospital } = yield select(state => state.base);
      const { data: foregiftData } = yield select(state => state.foregift);
      const info = {
        hosId: profile.hosId,
        hosNo: profile.hosNo,
        proId: profile.id,
        hosName: hospital.name,
        proName: profile.name,
        proNo: profile.no,
        cardNo: profile.cardNo,
        cardType: profile.cardType, // 暂时都写死成健康卡
        type: query.type,
        amt: query.amt,
        // tradeTime 由后台生成
        // tradeNo: his返回的交易号
        userId: user.id,
        account: profile.acctNo,
        accountName: profile.name,
        accountType: '9', // 其他
        // tradeChannel: 在生成业务单的时候，尚未选择支付宝或者是微信
        // tradeChannelCode
        terminalCode: profile.mobile,
        // batchNo
        adFlag: query.adFlag,
        // comment:
        hisUser: Global.hisUser,
        appType: config.appType,
        appCode: config.appCode,
        terminalUser: profile.no,
        appChannel: query.appCode,
        operator: user.id,
        inNo: foregiftData.no,
        status: 'A',
      };

      const { data } = yield call(create, info);
      if (data && data.success) {
        const { result } = data || {};
        const tmpBill = {
          billTitle: `${orderMap[query.bizType]}`,
          amt: query.amt, // 充值金额
          appCode: query.appCode, // 应用渠道
          bizType: query.bizType, // 门诊预存
          bizNo: result.id, // 门诊预存流水号
          bizUrl: `${Global.Config.host}/treat/foregift/callback`,
          // bizUrl: 'http://127.0.0.1/api/hwe/treat/foregift/callback',
          // bizBean: 'bizBean',
          bizTime: result.createdAt,
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
    *getPrePay({ profile, callback }, { call, put, select }) {
      const info = {};
      if (profile === null || profile === undefined) {
        const { currProfile } = yield select(state => state.base);
        info.proNo = currProfile.no;
        info.hosNo = currProfile.hosNo;
      } else {
        info.proNo = profile.no;
        info.hosNo = profile.hosNo;
      }
      if (info.proNo === null || info.proNo === '' || info.proNo === undefined) {
        return;
      }
      yield put(save({ data: {} }));
      const { data } = yield call(getPreSPay, info);
      if (data && data.success) {
        const result = data.result || {};
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
      return { ...state, ...action.payload };
    },
  },
};
