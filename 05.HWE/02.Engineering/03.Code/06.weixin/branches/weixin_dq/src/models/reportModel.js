import { Toast, ListView } from 'antd-mobile';
import { getReport, getPacs, getReportDetail, getPacsDetail } from '../services/reportService';


export default {
  namespace: 'report',
  state: {
    data: {},
    lisData: {},
    pacsResult: {},
    isLoading: false,
    refreshing: false,
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
        // console.info('pathname ', pathname);
        if (pathname === '/appoint/departments') {
          dispatch({ type: 'departments' });
        }
      });
    },
  },

  effects: {

    // 刷新列表
    *refresh({ payload }, { put, select }) {
      const { query } = yield select(model => model.news);
      yield put({
        type: 'setState',
        payload: {
          refreshing: true,
          isLoading: false,
          dataArray: [],
          noMoreData: false,
          query: { ...query, ...payload },
        },
      });
      yield put({ type: 'loadReport' });
    },

    *loadReport({ payload }, { call, put }) {
      yield put({ type: 'setState', payload: { isLoading: true } });
      const lisData = yield call(getReport, payload);
      // console.log('lisData===', lisData);
      const sections = {};
      let temp;
      let arryData = [];
      let array2;
      let lisResult = [];
      let pacsResult = [];
      if (lisData.data && lisData.data.success) {
        lisResult = lisData.data.result;
        // console.log('lisResult', lisResult);
        // lisResult = [];
        // 循环lis数据
        // 将结果封装成sectionList的制定形式存储
        for (let i = 0; i < lisResult.length; i++) {
          const index = lisResult[i].reportTime.indexOf(' ');
          const date = lisResult[i].reportTime.substring(0, index);
          lisResult[i].testType = '0001';
          lisResult[i].pkgName = '化验';
          if (i === 0) {
            temp = date;
          }
          if (date === temp) {
            arryData.push(lisResult[i]);
          } else {
            temp = date;
            arryData.splice(0, arryData.length);
            arryData.push(lisResult[i]);
          }
          array2 = arryData.slice(0);
          sections[temp] = array2;
        }
        yield put({ type: 'setState', payload: { data: sections, isLoading: false } });
      } else if (lisData.data && lisData.data.msg) {
        // todo 应该显示接口返回的错误信息
        yield put({ type: 'setState', payload: { isLoading: false } });
        // Toast.info(lisData.data.msg);
        Toast.fail(`化验数据请求出错：${lisData.data.msg}`, 1);
      } else {
        yield put({ type: 'setState', payload: { isLoading: false } });
      }
      // pacs数据
      const pacsData = yield call(getPacs, payload);
      // console.log('pacsData===', pacsData.data.success);
      if (pacsData.data && pacsData.data.success) {
        pacsResult = pacsData.data.result;
        // console.log('pacsResult', pacsResult);
        // pacsResult = [];
        // pacs数据
        arryData.splice(0, arryData.length);
        for (let i = 0; i < pacsResult.length; i++) {
          const index = pacsResult[i].reportTime.indexOf(' ');
          const date = pacsResult[i].reportTime.substring(0, index);
          pacsResult[i].testType = '0002';
          pacsResult[i].pkgName = '特检';
          // todo
          // 之前的数据中已经有相同日期
          if (sections[date]) {
            temp = date;
            // arryData.splice(0, arryData.length);
            arryData = sections[temp].slice(0);
            arryData.push(pacsResult[i]);
          } else {
            temp = date;
            arryData.splice(0, arryData.length);
            arryData.push(pacsResult[i]);
          }
          array2 = arryData.slice(0);
          sections[date] = array2;
        }
        yield put({ type: 'setState', payload: { data: sections, isLoading: false, refreshing: false, } });
      } else if (pacsData.data && pacsData.data.msg) {
        yield put({ type: 'setState', payload: { isLoading: false } });
        Toast.fail(`特检数据请求出错：${pacsData.data.msg}`, 1);
        // Toast.info('获取特检列表出错');
      } else {
        yield put({ type: 'setState', payload: { isLoading: false } });
      }
      // // 接口均调用失败，或者接口均返回false
      // if ((!pacsData.data && !lisData.data) || (!pacsData.data.success && lisData.data.success) || (lisResult.length + pacsResult.length === 0)) {
      //   yield put({ type: 'setState', payload: { data: [], isLoading: false } });
      // }
    },
    *loadReportDetail({ payload }, { call, put }) {
      yield put({ type: 'setState', payload: { isLoading: true } });
      const { data } = yield call(getReportDetail, payload);
      if (data && data.success) {
        const { result } = data;
        // const result = [];
        yield put({ type: 'setState', payload: { detail: result, isLoading: false } });
      } else if (data && data.msg) {
        yield put({ type: 'setState', payload: { isLoading: false } });
        // Toast.info('请求出错');
        Toast.fail(`请求数据出错：${data.msg}`, 1);
      } else {
        yield put({ type: 'setState', payload: { isLoading: false } });
      }
    },
    *loadPacsDetail({ payload }, { call, put }) {
      yield put({ type: 'setState', payload: { isLoading: true } });
      const { data } = yield call(getPacsDetail, payload);
      console.log('data====', data);
      if (data && data.success) {
        const { result } = data;
        // const result = [];
        yield put({ type: 'setState', payload: { rowData: result, isLoading: false } });
      } else if (data && data.msg) {
        yield put({ type: 'setState', payload: { isLoading: false } });
        // Toast.info('请求出错');
        Toast.fail(`请求数据出错：${data.msg}`, 1);
      } else {
        yield put({ type: 'setState', payload: { isLoading: false } });
      }
    },


  },

  reducers: {
    setState(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
