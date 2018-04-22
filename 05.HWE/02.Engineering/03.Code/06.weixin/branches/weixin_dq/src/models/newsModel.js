import { ListView, Toast } from 'antd-mobile';
import { loadList, getReportDetail } from '../services/newsService';

const initPage = {
  start: 0,
  pageSize: 10,
};

export default {

  namespace: 'news',

  state: {
    refreshing: false,
    isLoading: false,
    noMoreData: false,
    page: initPage,
    query: {
      fkId: '',
      fkType: '',
      fuzzySearch: '',
    },
    rowID: {},
    dataArray: [],
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    }),
    detail: [],
  },

  subscriptions: {
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
          page: initPage,
        },
      });
      yield put({ type: 'load' });
    },
    // 点击查询按钮刷新列表
    *search({ payload }, { put, select }) {
      const { query } = yield select(model => model.news);
      yield put({
        type: 'setState',
        payload: {
          refreshing: true,
          isLoading: false,
          dataArray: [],
          noMoreData: false,
          query: { ...query, ...payload },
          page: initPage,
        },
      });
      yield put({ type: 'load' });
    },
    // 无限加载
    *infiniteLoad(param, { put, select }) {
      const { page, noMoreData } = yield select(model => model.news);
      if (noMoreData) return false;
      yield put({
        type: 'setState',
        payload: {
          refreshing: false,
          isLoading: true,
          page: { ...page, start: page.start + page.pageSize },
        },
      });
      yield put({ type: 'load' });
    },
    // 从后台载入新闻列表
    *load(param, { call, put, select }) {
      const { page, query, dataArray } = yield select(model => model.news);
      const { data } = yield call(loadList, page.start, page.pageSize, query);
      // console.log('news:', data);
      if (data && data.success) {
        const { result } = data;
        yield put({
          type: 'setState',
          payload: {
            dataArray: dataArray.concat(result),
            noMoreData: data.start + data.pageSize >= data.total,
            refreshing: false,
            isLoading: false,
          },
        });
      } else {
        if (data && data.msg) Toast.info(`请求数据出错：${data.msg}`);
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
