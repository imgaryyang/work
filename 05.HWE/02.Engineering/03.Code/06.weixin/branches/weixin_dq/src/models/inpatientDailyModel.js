import moment from 'moment';

import { findInpatientDailyList } from '../services/inpatientService.js';

export default {

  namespace: 'inpatientDaily',
  state: {
    data: [],
    isLoading: false,
    selectDate: new Date(),
  },

  subscriptions: {
  },

  effects: {
    *findInpatientDaily({ payload }, { call, put, select }) {
      const { selectDate } = yield select(state => state.inpatientDaily);
      yield put({ type: 'setState', payload: { isLoading: true } });
      const { data } = yield call(
        findInpatientDailyList,
        {
          ...payload,
          startDate: moment(selectDate).format('YYYY-MM-DD'),
          endDate: moment(selectDate).format('YYYY-MM-DD'),
        },
      );
      const { result } = data || [];
      yield put({
        type: 'setState',
        payload: {
          data: result || [],
          isLoading: false,
        },
      });
    },
  },

  reducers: {
    setState(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
