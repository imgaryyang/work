import { notification } from 'antd';
import * as service from '../../services/card/PatientTransferService';

export default {
  namespace: 'patienttransfer',
  state: {
    patientTransferPage: { // 查询及分页
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    patientTransferQuery: {},
    patientTransferData: [], // 列表数据
    patientTransChartData: [], // 图标数据
    patientTransferSpin: false, // 列表加载指示器
    activeKey: '1',
  },

  effects: {

    /**
     * 转入转出按月份统计
     */
    *loadPatientTransfer({ payload }, { select, call, put }) {
      const { query } = (payload || {});
      const activeKey = yield select(state => state.patienttransfer.activeKey);
      // 显示加载指示器
      yield put({ type: 'setState', payload: { patientTransferSpin: true } });
      // 调用载入数据
      const { data } = activeKey === '1' ? yield call(service.loadPatientTransfer, query || {}) :
      yield call(service.loadChartData, query || {});
      console.log(data);
      if (data && data.success && activeKey === '1') {
        yield put({
          type: 'setState',
          payload: {
            patientTransferData: data.result,
            patientTransferQuery: query || {},
            patientTransferSpin: false,
          },
        });
      } else if (data && data.success && activeKey === '2') {
        yield put({
          type: 'setState',
          payload: {
            patientTransChartData: data.result,
            patientTransferQuery: query || {},
            patientTransferSpin: false,
          },
        });
      } else {
        notification.error({
          message: '错误',
          description: `${data.msg || '查询总费用分类统计信息出错！'}`,
        });
      }
        // 隐藏加载指示器
      yield put({ type: 'setState', payload: { patientTransferSpin: false } });
    },

  },

  reducers: {
    setState(state, { payload }) {
      return { ...state, ...payload };
    },
  },

  subscriptions: {
  },
};
