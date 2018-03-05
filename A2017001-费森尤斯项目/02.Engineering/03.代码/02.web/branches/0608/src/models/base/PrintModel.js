// import _ from 'lodash';
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
