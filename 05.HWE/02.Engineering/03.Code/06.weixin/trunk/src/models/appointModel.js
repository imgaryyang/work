import { Toast } from 'antd-mobile';
import { routerRedux } from 'dva/router';
import { forDeptTree, forScheduleList, forList, forReserve, forReservedList, forCancel } from '../services/appointService';
import { isValidArray, save, action, initPage } from '../utils/common';

export default {
  namespace: 'appoint',

  state: {
    // Departments
    deptTreeData: [],
    // Schedule
    isLoading: false,
    refreshing: false,
    allData: [],
    renderData: [],
    selectSchedule: {},
    areaData: [
      { value: 0, label: '全院' },
      { value: 1, label: '老院' },
      { value: 2, label: '新院' },
    ],
    // selectAppointSource: {},
    page: initPage,
    // AppointSource
    appointSourceData: [],
    // AppointRecords
    appointRecordsData: [],
  },

  subscriptions: {
    setup({ history, dispatch }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname }) => {
        if (pathname === '/appoint/departments') {
          dispatch(action('forDeptTree'));
        }
        if (pathname === '/appoint/schedule') {
          dispatch(action('forScheduleList', { refreshing: true }));
        }
        if (pathname === '/appoint/source') {
          dispatch(action('forAppointSource', {
            // 为测试方便，写死5
            schNo: history.location.state ? history.location.state.item.schNo : 5,
          }));
        }
        if (pathname === '/appoint/records') {
          dispatch(action('forReservedList'));
        }
      });
    },
  },

  effects: {
    *forDeptTree({ payload }, { select, call, put }) {
      try {
        Toast.loading('正在加载', 0);
        const { currHospital } = yield select(model => model.base);
        const { data } = yield call(forDeptTree, { ...payload, hosId: currHospital.id, hosNo: currHospital.no });
        const { success, result, msg } = data || {};

        if (success) {
          // 为后台返回数据添加label和value，以适应menu组件的数据格式要求
          for (let i = 0; isValidArray(result) && i < result.length; i++) {
            const deptType = result[i];
            const { children } = deptType;

            for (let j = 0; j < children.length; j++) {
              const dept = children[j];
              result[i].children[j] = { ...dept, label: dept.name, value: dept.no };
            }
            result[i] = { ...deptType, label: deptType.name, value: deptType.type };
          }
          yield put(save({ deptTreeData: result || [] }));
          Toast.hide();
        } else {
          Toast.fail(msg, 3);
        }
      } catch (e) {
        Toast.fail(e.toString(), 3);
      }
    },

    *forScheduleList({ payload }, { select, call, put }) {
      try {
        yield put(save({ isLoading: true }));
        const { page, refreshing, renderData, allData } = yield select(model => model.appoint);
        if (refreshing || (payload ? payload.refreshing : false)) {
          const { currHospital } = yield select(model => model.base);
          const { data } = yield call(forScheduleList, { ...payload, hosId: currHospital.id, hosNo: currHospital.no });
          const { result, success, msg } = data;
          const newAllData = result || [];
          const total = newAllData.length;
          const { start, limit } = initPage;
          const newRenderData = newAllData.slice(start, start + limit);
          if (success) {
            yield put(save({
              isLoading: false,
              allData: newAllData,
              renderData: newRenderData,
              refreshing: false,
              hasMore: total > start + limit,
              page: { ...page, total, start: start + limit },
            }));
          } else {
            yield put(save({
              isLoading: false,
              refreshing: false,
              hasMore: total > start + limit,
              page: { ...page, total, start: start + limit },
            }));
            Toast.fail(msg, 3);
          }
        } else {
          const { start, limit, total } = page;
          const newRenderData = renderData.concat(allData.slice(start, start + limit));

          yield put(save({
            renderData: newRenderData,
            refreshing: false,
            hasMore: total > start + limit,
            page: { ...page, start: start + limit },
            isLoading: false,
          }));
        }
      } catch (e) {
        Toast.fail(e.toString(), 3);
        yield put(save({ isLoading: false, refreshing: false }));
      }
    },

    *forAppointSource({ payload }, { select, call, put }) {
      try {
        Toast.loading('正在加载', 0);
        const { currHospital } = yield select(model => model.base);
        const { data } = yield call(forList, { ...payload, hosId: currHospital.id, hosNo: currHospital.no });
        const { success, result, msg } = data || {};

        if (success) {
          yield put(save({ appointSourceData: result || [] }));
          Toast.hide();
        } else {
          Toast.fail(msg, 3);
        }
      } catch (e) {
        Toast.fail(e.toString(), 3);
      }
    },

    *forReserve({ payload }, { select, call, put }) {
      try {
        Toast.loading('正在预约', 0);
        const { currHospital } = yield select(model => model.base);
        const { data } = yield call(forReserve, { ...payload, hosId: currHospital.id, hosNo: currHospital.no });
        const { success, msg } = data || {};

        if (success) {
          yield put(routerRedux.push('/appoint/success'));
          Toast.hide();
        } else {
          Toast.fail(msg, 3);
        }
      } catch (e) {
        Toast.fail(e.toString(), 3);
      }
    },

    *forReservedList({ payload }, { select, call, put }) {
      try {
        Toast.loading('正在加载', 0);
        const { currHospital } = yield select(model => model.base);
        const { data } = yield call(forReservedList, { ...payload, hosId: currHospital.id, hosNo: currHospital.no });
        const { result, success, msg } = data || {};
        if (success) {
          yield put(save({ appointRecordsData: result }));
          Toast.hide();
        } else {
          Toast.fail(msg, 3);
        }
      } catch (e) {
        Toast.fail(e.toString(), 3);
      }
    },

    *forCancel({ payload }, { select, call, put }) {
      try {
        Toast.loading('正在取消', 0);
        const { currHospital } = yield select(model => model.base);
        const { data } = yield call(forCancel, { ...payload, hosId: currHospital.id, hosNo: currHospital.no });
        const { success, msg } = data || {};
        if (success) {
          Toast.success('取消成功', 1, () => {
            // yield put(routerRedux.goBack());
          });
          // 今后考虑如何放入Toast.success的回调中
          yield put(routerRedux.goBack());
        } else {
          Toast.fail(msg, 3);
        }
      } catch (e) {
        Toast.fail(e.toString(), 3);
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
