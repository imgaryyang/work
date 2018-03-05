import { ListView } from 'antd-mobile/lib/index';
import { getNews, getReportDetail } from '../services/newsService';


export default {

  namespace: 'news',

  state: {
    data: {},
    rowID: {},
    isLoading: false,
    detail: [],
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    }),

    height: document.documentElement.clientHeight,
  },

  subscriptions: {
    setup({ history, dispatch }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      /* return history.listen(({ pathname }) => {
        console.info('pathname ', pathname);
        if (pathname === '/appoint/departments') {
          dispatch({ type: 'departments' });
        }
      });*/
    },
  },

  effects: {
    *loadnews({ payload }, { call, put }) {
      console.log(111);
      yield put({ type: 'setState', payload: { isLoading: true } });
      const { data } = yield call(getNews, payload);
      console.log(data);
      if (data.success) {
        const { result } = data;
        yield put({ type: 'setState', payload: { data: result, isLoading: false } });
      } else {

      }
    },
    *loadReportDetail({ payload }, { call, put }) {
      const { data } = yield call(getReportDetail, payload);
      if (data.success) {
        const { result } = data;
        yield put({ type: 'setState', payload: { detail: result } });
      }
    },


  },

  reducers: {
    setState(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
