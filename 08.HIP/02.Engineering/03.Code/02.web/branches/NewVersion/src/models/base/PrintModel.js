
import { notification } from 'antd';

import * as printService from '../../services/base/PrintService';
import Print from '../../utils/print';

export default {
  namespace: 'print',

  state: {
    namespace: 'print',
    printTemplate: '',
    printData: {},
  },

  effects: {
    *getPrintInfo({ payload }, { call, put }) {
      const { code, bizId } = (payload || {});
      const { data } = yield call(printService.getPrintInfo, code, bizId);
      if (data && data.success) {
        const { result } = data;
        const { map, printTemplate, ...printData } = result;
        yield put({ type: 'setState', payload: { printTemplate, printData } });
        yield Print.sendPrint(printTemplate, printData, map);
      } else {
        notification.error({ message: '错误：', description: data.msg || '未知错误！' });
      }
    },

    *getPrint({ payload }, { call, put }) {
      const { code, printData } = (payload || {});
      const { data } = yield call(printService.getPrint, code);
      if (data && data.success) {
        const { result } = data;
        const { printTemplate, map } = result;
        yield Print.sendPrint(printTemplate, printData, map);
      }
    },

    // 取数据，预览
    *getPrintView({ payload }, { call, put }) {
      const { code, bizId, url } = (payload || {});
      const { data } = yield call(printService.getPrintInfo, code, bizId);
      if (data && data.success) {
        console.info(data);
        const { result } = data;
        const { map, printTemplate, ...printData } = result;
        yield put({ type: 'setState', payload: { printTemplate, printData, map } });
        // yield Print.sendPrint(printTemplate, printData, map);
      }
    },
  },

  reducers: {
    setState(state, { payload }) {
      return { ...state, ...payload };
    },
  },

  subscriptions: {
  },
};
