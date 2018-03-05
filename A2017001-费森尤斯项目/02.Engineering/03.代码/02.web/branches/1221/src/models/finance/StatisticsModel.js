import { notification } from 'antd';
import * as service from '../../services/finance/StatisticsService';
import { loadHospital } from '../../services/base/HospitalService';

export default {
  namespace: 'financeStatistics',
  state: {
    // 患者费用分类查询
    patientFeePage: { // 查询及分页
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    hospitalList: [],
    patientFeeQuery: {},
    patientFeeData: [], // 列表数据
    patientFeeSpin: false, // 列表加载指示器

    // 费用分类查询
    feeTypePage: { // 查询及分页
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    feeTypeQuery: {},
    feeTypeData: [], // 列表数据
    feeTypeSpin: false, // 列表加载指示器

    incomeAndExpensesQuery: {},
    incomeAndExpensesData: [], // 列表数据
    incomeAndExpensesSpin: false, // 列表加载指示器

    matConsumQuery: {},
    matConsumData: [], // 列表数据
    matConsumSpin: false, // 列表加载指示器

    monthCheckQuery: {},
    monthCheckData: [], // 列表数据
    monthCheckSpin: false, // 列表加载指示器
    checkTimeList: [], // 月结时间数组

    // 总费用分类查询
    totalFeePage: { // 查询及分页
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    totalFeeQuery: {},
    totalFeeData: [], // 列表数据
    totalFeeSpin: false, // 列表加载指示器
    hosAndUserCount: [],
    BaseFeeType: {},
  },

  effects: {
    /**
     * 分页载入患者费用分类统计
     */
    *loadPatientFee({ payload }, { select, call, put }) {
      const { query, page, startFrom0 } = (payload || {});
      // 取现有的翻页对象
      const defaultPage = yield select(state => state.financeStatistics.patientFeePage);
      const newPage = { ...defaultPage, ...(page || {}) };
      const { pageNo, pageSize } = newPage;
      const start = startFrom0 ? 0 : (pageNo - 1) * pageSize;
      // 显示加载指示器
      yield put({ type: 'setState', payload: { patientFeeSpin: true } });
      // 调用载入数据
      const { data } = yield call(service.loadPatientFee, start, pageSize, query || {});

      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            patientFeeData: data.result,
            patientFeeQuery: query || {},
            patientFeePage: { pageNo: startFrom0 ? 1 : pageNo, pageSize, total: data.total },
            patientFeeSpin: false,
          },
        });
      } else {
        notification.error({
          message: '错误',
          description: `${data.msg || '查询患者费用分类统计信息出错！'}`,
        });
        // 隐藏加载指示器
        yield put({ type: 'setState', payload: { patientFeeSpin: false } });
      }
    },

    /**
     * 费用分类统计
     */
    *loadTotalFee({ payload }, { select, call, put }) {
      const { query } = (payload || {});
      const totalFeeQuery = yield select(state => state.financeStatistics.totalFeeQuery);
      const newquery = { ...totalFeeQuery, ...query };
      // 显示加载指示器
      yield put({ type: 'setState', payload: { totalFeeSpin: true } });
      // 调用载入数据
      const { data } = yield call(service.loadTotalFee, newquery || {});

      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            totalFeeData: data.result,
            totalFeeQuery: newquery || {},
            totalFeeSpin: false,
          },
        });
      } else {
        notification.error({
          message: '错误',
          description: `${data.msg || '查询总费用分类统计信息出错！'}`,
        });
        // 隐藏加载指示器
        yield put({ type: 'setState', payload: { totalFeeSpin: false } });
      }
    },

    /**
     * 总费用分类统计
     */
    *loadFeeType({ payload }, { select, call, put }) {
      const { query } = (payload || {});
      const feeTypeQuery = yield select(state => state.financeStatistics.feeTypeQuery);
      const newQuery = { ...feeTypeQuery, ...query };
      // 显示加载指示器
      yield put({ type: 'setState', payload: { feeTypeSpin: true } });
      // 调用载入数据
      const { data } = yield call(service.loadFeeType, newQuery || {});

      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            feeTypeData: data.result,
            feeTypeQuery: newQuery || {},
            feeTypeSpin: false,
          },
        });
      } else {
        notification.error({
          message: '错误',
          description: `${data.msg || '查询费用分类统计信息出错！'}`,
        });
        // 隐藏加载指示器
        yield put({ type: 'setState', payload: { feeTypeSpin: false } });
      }
    },

    /**
     * 会计收款统计
     */
    *loadDailyIncomeAndExpenses({ payload }, { select, call, put }) {
      const { query } = (payload || {});
      const incomeAndExpensesQuery = yield select(state => state.financeStatistics.incomeAndExpensesQuery);
      const newQuery = { ...incomeAndExpensesQuery, ...query };
      // 显示加载指示器
      yield put({ type: 'setState', payload: { incomeAndExpensesSpin: true } });
      // 调用载入数据
      const { data } = yield call(service.loadIncomeAndExpenses, newQuery || {});

      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            incomeAndExpensesData: data.result,
            incomeAndExpensesQuery: newQuery || {},
          },
        });
      } else {
        notification.error({
          message: '错误',
          description: `${data.msg || '查询统计信息出错！'}`,
        });
      }
        // 隐藏加载指示器
      yield put({ type: 'setState', payload: { incomeAndExpensesSpin: false } });
    },

    /**
     * 物资消耗统计
     */
    *loadMatConsum({ payload }, { select, call, put }) {
      const { query } = (payload || {});
      const matConsumQuery = yield select(state => state.financeStatistics.matConsumQuery);
      const newQuery = { ...matConsumQuery, ...query };
      // 显示加载指示器
      yield put({ type: 'setState', payload: { matConsumSpin: true } });
      // 调用载入数据
      const { data } = yield call(service.loadMatConsum, newQuery || {});
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            matConsumData: data.result,
            matConsumQuery: newQuery || {},
          },
        });
      } else {
        notification.error({
          message: '错误',
          description: `${data.msg || '查询统计信息出错！'}`,
        });
      }
        // 隐藏加载指示器
      yield put({ type: 'setState', payload: { matConsumSpin: false } });
    },

    /**
     * 物资期初期末统计
     */
    *loadMonthCheck({ payload }, { select, call, put }) {
      const { query } = (payload || {});
      const monthCheckQuery = yield select(state => state.financeStatistics.monthCheckQuery);
      const newQuery = { ...monthCheckQuery, ...query };
      // 显示加载指示器
      yield put({ type: 'setState', payload: { monthCheckSpin: true } });
      // 调用载入数据
      const { data } = yield call(service.loadMonthCheck, newQuery || {});
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            monthCheckData: data.result,
            monthCheckQuery: newQuery || {},
          },
        });
      } else {
        notification.error({
          message: '错误',
          description: `${data.msg || '查询统计信息出错！'}`,
        });
      }
        // 隐藏加载指示器
      yield put({ type: 'setState', payload: { monthCheckSpin: false } });
    },

    *findTimeList({ payload }, { call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(service.findMonthCheckTime, {});
      if (data && data.success) {
        const { result } = data;
        yield put({ type: 'setState', payload: { checkTimeList: result } });
      } else if (data && data.msg) {
        notification.error({
          message: '错误',
          description: `${data.msg || '获取月结时间信息出错！'}`,
        });
      } else {
        notification.error({
          message: '错误',
          description: '服务器内部错误！',
        });
      }
      yield put({ type: 'setState', payload: { spin: false } });
    },

    *loadHospitalList({ payload }, { call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(loadHospital, {});
      if (data && data.success) {
        const { result } = data;
        yield put({ type: 'setState', payload: { hospitalList: result } });
      } else if (data && data.msg) {
        notification.error({
          message: '错误',
          description: `${data.msg || '获取医院列表信息出错！'}`,
        });
      } else {
        notification.error({
          message: '错误',
          description: '服务器内部错误！',
        });
      }
      yield put({ type: 'setState', payload: { spin: false } });
    },

    *loadBaseOperation({ payload }, { call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(service.statisBaseOperation, {});
      if (data && data.success) {
        const { result } = data;
        yield put({ type: 'setState', payload: { hosAndUserCount: result } });
      } else if (data && data.msg) {
        notification.error({
          message: '错误',
          description: `${data.msg || '获取医院数量和员工总数信息出错！'}`,
        });
      } else {
        notification.error({
          message: '错误',
          description: '服务器内部错误！',
        });
      }
      yield put({ type: 'setState', payload: { spin: false } });
    },

    *loadBaseFeeType({ payload }, { call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(service.findBaseFeeType, {});
      if (data && data.success) {
        const { result } = data;
        yield put({ type: 'setState', payload: { BaseFeeType: result } });
      } else if (data && data.msg) {
        notification.error({
          message: '错误',
          description: `${data.msg || '获取医院数量和员工总数信息出错！'}`,
        });
      } else {
        notification.error({
          message: '错误',
          description: '服务器内部错误！',
        });
      }
      yield put({ type: 'setState', payload: { spin: false } });
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
