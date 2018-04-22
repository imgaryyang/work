import { Toast } from 'antd-mobile';
import { submit } from '../services/feedBackService';
import { initPage } from '../utils/common';


export default {

  namespace: 'feedBack',

  state: {
    isLoading: false,

  },
  subscriptions: {
    setup({ history, dispatch }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname }) => {
        // console.info('pathname ', pathname);
        if (pathname === '/appoint/departments') {
          dispatch({ type: 'departments' });
        }
      });
    },
  },

  effects: {
    *submit({ payload }, { call, put }) {
      yield put({ type: 'setState', payload: { isLoading: true } });
      const { data } = yield call(submit, payload);
      if (data.success) {
        Toast.info('保存成功');
      }
    },


  },


};
