import { Toast } from 'antd-mobile';
import { ListView } from 'antd-mobile/lib/index';
import { getReport, getReportDetail } from '../services/reportService';


export default {

  namespace: 'report',

  state: {
    data: {},
    isLoading: false,
    detail: [],
    rowData: {},
    // data: { '2018-02-07': [{ name: '化验' }, { name: '特检' }], '2018-02-08': [{ name: '张三' }] },
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    }),

    height: document.documentElement.clientHeight,
  },

  subscriptions: {
    setup({ history, dispatch }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname }) => {
        console.info('pathname ', pathname);
        if (pathname === '/appoint/departments') {
          dispatch({ type: 'departments' });
        }
      });
    },
  },

  effects: {
    *loadReport({ payload }, { call, put }) {
      yield put({ type: 'setState', payload: { isLoading: true } });
      const { data } = yield call(getReport, payload);
      if (data.success) {
        const { result } = data;
        if (data.result.length > 0) {
          // 将结果封装成sectionList的制定形式存储
          const sections = {};
          let temp;
          const arryData = [];
          for (let i = 0; i < result.length; i++) {
            const index = result[i].reportTime.indexOf(' ');
            const date = result[i].reportTime.substring(0, index);
            if (i === 0) {
              temp = date;
            }
            if (date === temp) {
              arryData.push(result[i]);
            } else {
              temp = date;
              arryData.splice(0, arryData.length);
              arryData.push(result[i]);
            }
            const array2 = arryData.slice(0);
            sections[temp] = array2;
          }
          yield put({ type: 'setState', payload: { data: sections, isLoading: false } });
        } else {
          yield put({ type: 'setState', payload: { data: result, isLoading: false } });
        }
      } else {
        yield put({ type: 'setState', payload: { isLoading: false } });
        Toast.info('请求出错');
      }
    },
    *loadReportDetail({ payload }, { call, put }) {
      const { data } = yield call(getReportDetail, payload);
      if (data.success) {
        const { result } = data;
        yield put({ type: 'setState', payload: { detail: result } });
      } else {
        yield put({ type: 'setState', payload: { isLoading: false } });
        Toast.info('请求出错');
      }
    },


  },

  reducers: {
    setState(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
