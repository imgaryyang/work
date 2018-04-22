import { Toast, ListView } from 'antd-mobile';
import { routerRedux } from 'dva/router';
import { addPatient, list, getProfiles, remove } from '../services/userService';

export default {

  namespace: 'user',

  state: {
    user: {},
    // userPatients: [],
    // profiles: [],
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
    *addPatient({ payload, callback }, { call, put, select }) {
      const { data } = yield call(addPatient, payload);
      if (data && data.success) {
        const { result } = data || {};
        const userPatients = yield select(state => state.user.userPatients);
        console.log('userPatients', userPatients);
        yield put({
          type: 'save',
          payload: {
            userPatients: userPatients.splice(result) || userPatients,
          },
        });
        yield put(routerRedux.goBack());
      } else {
        Toast.fail(data.msg, 1);
      }
      if (callback) callback();
    },
    *list({ payload, callback }, { call, put }) {
      Toast.loading('加载中。。。', 2);
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
        Toast.fail(data.msg, 1);
      }
      if (callback) callback();
    },
    *getProfiles({ payload, callback }, { call, put }) {
      Toast.loading('加载中。。。', 3);
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
        Toast.hide();
      } else {
        Toast.fail(data.msg, 1);
      }
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const { data } = yield call(remove, payload);
      if (data && data.success) {
        yield put({ type: 'list' });
      } else {
        Toast.fail(data.msg, 1);
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
