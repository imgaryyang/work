import { message } from 'antd';
import * as UserTrainingService from '../../services/base/UserTrainingService';

export default {

  namespace: 'userTraining',

  state: {
    userId: '',
    data: [],
    isCreate: false,
    dateRange: {},
    record: {},
  },

  effects: {
    *createTrainingInfo({ payload = {} }, { select, call, put }) {
      const { params } = payload;
      const { userId, dateRange } = yield select(state => state.userTraining);

      const userObj = { userId };
      const newParams = Object.assign(params, dateRange, userObj);

      const { data } = yield call(UserTrainingService.createTrainingInfo, newParams);

      if (data && data.success) {
        yield put({ type: 'setState', payload: { record: {} } });
        yield put({ type: 'loadTrainingInfo', payload: userObj });
        message.success('保存成功！');
      }
    },

    *removeTrainingInfo({ payload = {} }, { select, call, put }) {
      const { id } = payload;
      const { userId } = yield select(state => state.userTraining);
      const userObj = { userId };
      const { data } = yield call(UserTrainingService.removeTrainingInfo, id);

      if (data && data.success) {
        yield put({ type: 'loadTrainingInfo', payload: userObj });
        message.success('删除成功！');
      }
    },

    *loadTrainingInfo({ payload = {} }, { call, put }) {
      const { userId } = payload;

      yield put({ type: 'setState', payload: { userId } });

      const { data } = yield call(UserTrainingService.loadTrainingInfo, userId);

      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: { data: data.result },
        });
      }
    },
  },

  reducers: {
    setState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
