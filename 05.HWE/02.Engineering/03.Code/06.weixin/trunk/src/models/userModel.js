import { Toast, ListView } from 'antd-mobile';
import { routerRedux } from 'dva/router';
import { addPatient, list, getProfiles, remove } from '../services/userService';

export default {

  namespace: 'user',

  state: {
    user: {},
    userPatients: [],
    profiles: [],
    visible: false,
    isLoading: true,
    showDelBut: false,
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    }),
  },

  subscriptions: {

  },
  effects: {
    *addPatient({ payload, callback }, { call, put }) {
      const { data } = yield call(addPatient, payload);
      if (data && data.success) {
        const { result } = data || {};
        yield put({
          type: 'save',
          payload: {
            user: result || {},
          },
        });
        yield put(routerRedux.goBack());
      }
      if (callback) callback();
    },
    *list({ payload, callback }, { call, put }) {
      Toast.loading('加载中。。。', 0);
      yield put({ type: 'setState', payload: { isLoading: true } });
      const { data } = yield call(list);
      if (data && data.success) {
        const { result } = data || [];
        yield put({
          type: 'save',
          payload: {
            userPatients: result || [],
            isLoading: false,
          },
        });
        Toast.hide();
      } else {
        Toast.hide();
      }
      if (callback) callback();
    },
    *getProfiles({ payload, callback }, { call, put }) {
      yield put({ type: 'setState', payload: { profiles: [] } });
      const { data } = yield call(getProfiles, payload);
      if (data && data.success) {
        const { result } = data || [];
        console.log('result', result);
        yield put({
          type: 'save',
          payload: {
            profiles: result || [],
          },
        });
      }
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const { data } = yield call(remove, payload);
      if (data && data.success) {
        yield put({ type: 'list' });
      }
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
