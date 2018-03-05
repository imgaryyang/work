
import { notification } from 'antd';

import { loadRegInfo, visit } from '../../services/odws/OdwsService';

export default {
  namespace: 'odws',
  state: {
    odwsWsHeight: 0, // 门诊医生工作站工作区高度
    // 接诊
    page: { total: 0, pageSize: 200, pageNo: 1 },
    query: {},
    listIdx: -1,
    regs: [],
    spin: false,
    currTabKey: '1',
    currentReg: {},
    // 当前诊疗主页
    treatStep: 'diagnose',
  },
  effects: {

    /**
     * 载入挂号信息
     */
    *loadRegInfo({ payload }, { select, call, put }) {
      const { page, query, search } = (payload || {});
      const defaultPage = yield select(state => state.odws.page);
      const p = { ...defaultPage, ...page };
      const start = search ? 0 : (p.pageNo - 1) * p.pageSize;
      // 显示载入指示器
      yield put({ type: 'addSpin' });
      // 载入所有待诊患者挂号列表
      const { data } = yield call(loadRegInfo, start, p.pageSize, query);
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            regs: data.result,
            page: p,
            query: query || {},
          },
        });
      } else {
        notification.error({
          message: '错误',
          description: '查询挂号信息出错，请稍后再试！',
        });
      }
      // 移除载入指示器
      yield put({ type: 'removeSpin' });
    },

    /**
     * 接诊
     */
    *visiting({ payload }, { select, call, put }) {
      const { listIdx, currentReg, currTabKey } = payload;
      // 已接诊但未完成就诊，继续诊疗
      if (currentReg.regState === '30') {
        yield put({
          type: 'setState',
          payload,
        });
      // 接诊
      } else {
        currentReg.step = '1';
        // 显示载入指示器
        yield put({ type: 'addSpin' });
        const { data } = yield call(visit, currentReg);
        if (data && data.success) {
          yield put({
            type: 'setState',
            payload: {
              listIdx,
              currentReg: data.result,
              currTabKey,
            },
          });
          // 原条件重载列表
          const { page, query, search } = yield select(state => state.odws);
          yield put({
            type: 'loadRegInfo',
            payload: { page, query, search },
          });
        } else {
          notification.error({
            message: '错误',
            description: '接诊操作出错，请稍后再试！',
          });
        }
        // 移除载入指示器
        yield put({ type: 'removeSpin' });
      }
    },

    /**
     * 完成就诊
     */
    *treatDone({ payload }, { select, call, put }) {
      const { currentReg } = yield select(state => state.odws);
      currentReg.step = '3';
      // 显示载入指示器
      yield put({ type: 'addSpin' });
      const { data } = yield call(visit, currentReg);
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            listIdx: -1,
            currentReg: {},
            currTabKey: '1',
          },
        });
        // 原条件重载列表
        const { page, query, search } = yield select(state => state.odws);
        yield put({
          type: 'loadRegInfo',
          payload: { page, query, search },
        });
      } else {
        notification.error({
          message: '错误',
          description: '完成就诊操作出错，请稍后再试！',
        });
      }
      // 移除载入指示器
      yield put({ type: 'removeSpin' });
    },

    /**
     * 取消就诊
     */
    *treatCancel({ payload }, { select, call, put }) {
      const { currentReg } = yield select(state => state.odws);
      currentReg.step = '2';
      // 显示载入指示器
      yield put({ type: 'addSpin' });
      const { data } = yield call(visit, currentReg);
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            listIdx: -1,
            currentReg: {},
            currTabKey: '1',
          },
        });
        // 原条件重载列表
        const { page, query, search } = yield select(state => state.odws);
        yield put({
          type: 'loadRegInfo',
          payload: { page, query, search },
        });
      } else {
        notification.error({
          message: '错误',
          description: '取消接诊操作出错，请稍后再试！',
        });
      }
      // 移除载入指示器
      yield put({ type: 'removeSpin' });
    },

  },
  reducers: {

    /* initWaitingList(state, { data, page, query }) {
      const { result = result || [], total } = data;
      const p = { ...state.page, ...page, total };
      const regs = result;
      return {
        ...state,
        regs,
        page: p,
        query,
      };
    },*/

    setState(oldState, { payload }) {
      return { ...oldState, ...payload };
    },

    addSpin(state) {
      return { ...state, spin: true };
    },

    removeSpin(state) {
      return { ...state, spin: false };
    },
  },
};
