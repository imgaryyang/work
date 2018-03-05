import { notification } from 'antd';
import * as companyService from '../../services/base/CompanyService';

export default {
  namespace: 'company',
  state: {
    namespace: 'company',
    // 查询及分页
    page: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    query: {},
    // 被选中的行
    selectedRowKeys: [],
    // 列表数据
    data: [],
    // 被选中修改的厂商信息
    record: {},
    // 列表加载指示器
    isSpin: false,
    // 编辑界面加载指示器
    editorSpin: false,
    // 控制修改界面显示/隐藏
    visible: false,
    // 控制重置表单
    resetForm: false,
  },

  effects: {
    /**
     * 分页载入厂商列表
     */
    *load({ payload }, { select, call, put }) {
      const { query, page, startFrom0 } = (payload || {});
      // 取现有的翻页对象
      const defaultPage = yield select(state => state.company.page);
      const newPage = { ...defaultPage, ...(page || {}) };
      // console.log(newPage);
      const { pageNo, pageSize } = newPage;
      const start = startFrom0 ? 0 : (pageNo - 1) * pageSize;
      // 显示加载指示器
      yield put({ type: 'toggleSpin' });
      // 调用载入数据
      const { data } = yield call(companyService.loadPage, start, pageSize, query || {});

      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            data: data.result,
            query: query || {},
            page: { pageNo: startFrom0 ? 1 : pageNo, pageSize, total: data.total },
            isSpin: false,
          },
        });
      } else {
        notification.error({
          message: '错误',
          description: `${data.msg || '查询厂商列表信息出错！'}`,
        });
        // 显示加载指示器
        yield put({ type: 'toggleSpin' });
      }
    },

    /**
     * 保存厂商信息
     */
    *save({ params }, { select, call, put }) {
      // 显示加载指示器
      yield put({ type: 'setState', payload: { editorSpin: true } });
      // 使用表单数据覆盖原纪录，并调用保存
      const { record } = yield select(state => state.company);
      const { data } = yield call(companyService.save, { ...record, ...params });
      // 保存成功返回
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            visible: !record.id,
            record: {},
            editorSpin: false,
            resetForm: true,
          },
        });
        notification.success({
          message: '提示',
          description: '保存厂商信息成功！',
        });
        // 原条件重载列表
        const { page, query } = yield select(state => state.company);
        yield put({ type: 'load', payload: { query, page } });
      } else {
        notification.error({
          message: '错误',
          description: `${data.msg || '保存厂商信息失败！'}`,
        });
        yield put({
          type: 'setState',
          payload: {
            editorSpin: false,
          },
        });
      }
    },

    /**
     * 删除厂商信息
     */
    *delete({ id }, { select, call, put }) {
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(companyService.remove, id);
      if (data && data.success) {
        notification.success({
          message: '提示',
          description: '删除厂商信息成功！',
        });
        // 原条件重载列表
        const { page, query } = yield select(state => state.company);
        yield put({ type: 'load', payload: { query, page } });
      } else {
        notification.error({
          message: '错误',
          description: `${data.msg || '删除厂商信息失败！'}`,
        });
        yield put({ type: 'toggleSpin' });
      }
    },

    /**
     * 删除选定的多家厂商
     */
    *deleteSelected({ payload }, { select, call, put }) {
      yield put({ type: 'toggleSpin' });
      const selectedRowKeys = yield select(state => state.company.selectedRowKeys);
      const { data } = yield call(companyService.removeSelected, selectedRowKeys);
      if (data && data.success) {
        notification.success({
          message: '提示',
          description: '删除所选厂商信息成功！',
        });
        // 原条件重载列表
        const { page, query } = yield select(state => state.company);
        yield put({ type: 'load', payload: { query, page } });
      } else {
        notification.error({
          message: '错误',
          description: `${data.msg || '删除所选厂商信息失败！'}`,
        });
        yield put({ type: 'toggleSpin' });
      }
    },
  },

  reducers: {
    /* init(state, { data, page }) {
      const { result, total } = data;
      const resPage = { ...state.page, ...page, total };
      const resData = result || [];
      return { ...state, data: resData, page: resPage };
    },*/

    setState(state, { payload }) {
      return { ...state, ...payload };
    },

    toggleSpin(state) {
      return { ...state, isSpin: !state.isSpin };
    },

    toggleVisible(state) {
      return { ...state, visible: !state.visible };
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/base/company') {
          dispatch({
            type: 'utils/initDicts',
            payload: ['COMPANY_TYPE', 'COMPANY_SERVICES', 'STOP_FLAG'],
          });
        }
      });
    },
  },
};
