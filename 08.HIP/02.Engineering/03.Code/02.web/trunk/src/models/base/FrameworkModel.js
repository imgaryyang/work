import key from 'keymaster';

export default {
  namespace: 'framework',
  state: {
  },
  subscriptions: {
    keyboardWatcher() {
      key('return', (...args) => {
        console.log(...args);
      });
    },
  },
  effects: {
  },
  reducers: {
    setState(oldState, { payload }) {
      return { ...oldState, ...payload };
    },
  },
};
