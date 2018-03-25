
export default {

  namespace: 'home',

  state: {
    selectedTab: 'hfc',
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      // 获取Url参数值
      console.info('arguments ', arguments);
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
