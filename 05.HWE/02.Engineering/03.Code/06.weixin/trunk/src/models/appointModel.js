import { Toast } from 'antd-mobile';
import React from 'react';
import _ from 'lodash';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { forDeptTree, forScheduleList, forList, forReserve, forReservedList, forCancel } from '../services/appointService';
import { isValidArray, save, action, initPage } from '../utils/common';
import less from '../utils/common.less';

export const initDateData = [{ value: 0, label: '所有日期' }];
export const initJobTitleData = [
  { value: 0, label: '全部职称' },
  { value: 1, label: '主任医师' },
  { value: 2, label: '副主任医师' },
  { value: 3, label: '主治医师' },
  { value: 4, label: '住院医师' },
  { value: 5, label: '其他' },
];
export const initShiftData = [
  { value: 0, label: '全天' },
  { value: 1, label: '上午' },
  { value: 2, label: '下午' },
];
export const initAreaData = [{ value: 0, label: '全院' }];

export default {
  namespace: 'appoint',

  state: {
    // Departments
    deptTreeData: [],

    // Schedule
    cond: {},
    isLoading: true,
    refreshing: false,
    allData: [],
    filterData: [],
    renderData: [],
    selectSchedule: {},
    dateData: initDateData,
    selectedDate: initDateData[0],
    jobTitleData: initJobTitleData,
    selectedJobTitle: initJobTitleData[0],
    shiftData: initShiftData,
    selectedShift: initShiftData[0],
    areaData: initAreaData,
    selectedArea: initAreaData[0],
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
        console.log('pathname', pathname);
        if (pathname === '/stack/appoint/departments') {
          dispatch(action('forDeptTree'));
        }
        if (pathname === '/stack/appoint/schedule') {
          const payload = history.location.state ? { ...history.location.state.dept, refreshing: true } : { refreshing: true };
          dispatch(action('forScheduleList', { ...payload }));
        }
        if (pathname === '/stack/appoint/source') {
          dispatch(action('forAppointSource', {
            // 为测试方便，无值时写死5
            schNo: history.location.state ? history.location.state.item.no : 5,
          }));
        }
        if (pathname === '/stack/appoint/records') {
          dispatch(action('forReservedList'));
        }
      });
    },
  },

  effects: {
    *forDeptTree({ payload }, { select, call, put }) {
      try {
        Toast.loading('正在加载', 0);
        const { currHospital: { id: hosId, no: hosNo } } = yield select(model => model.base);
        const { data = {} } = yield call(forDeptTree, { ...payload, hosId, hosNo });
        const { success, result, msg } = data;

        if (success) {
          // 为后台返回数据添加label和value，以适应menu组件的数据格式要求
          for (let i = 0; isValidArray(result) && i < result.length; i++) {
            const deptType = result[i];
            const { children } = deptType;

            for (let j = 0; j < children.length; j++) {
              const dept = children[j];
              result[i].children[j] = { ...dept, label: <span className={less.font14}>{dept.name}</span>, value: dept.no };
            }
            result[i] = { ...deptType, label: <span className={less.font14}>{deptType.name}</span>, value: deptType.type };
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
        const { page, refreshing, renderData, filterData, cond, selectedDate } = yield select(model => model.appoint);
        if (refreshing || (payload ? payload.refreshing : false)) {
          // const { currHospital } = yield select(model => model.base);
          const newCond = {
            ...cond,
            ...payload,
            startDate: moment().format('YYYY-MM-DD'),
            endDate: moment().add(7, 'days').format('YYYY-MM-DD'),
          };
          const { data = {} } = yield call(forScheduleList, { ...newCond });
          const { result: newAllData = [], success, msg } = data;
          // const newAllData = result || [];

          const newDateData = initDateData.concat(_.uniqBy(newAllData, 'clinicDate').map((item, index) => { return { value: index + 1, label: item.clinicDate }; }));
          const newSelectedDate = newDateData.find(item => item.label === selectedDate.label) || initDateData[0];

          if (success) {
            yield put(save({ dateData: newDateData, cond: newCond }));
            yield put(action('filterData', { allData: newAllData, selectedDate: newSelectedDate }));
          } else {
            // const total = newAllData.length;
            // const { start, limit } = initPage;
            yield put(save({
              isLoading: false,
              refreshing: false,
              hasMore: false,
              page: initPage,
              // hasMore: total > start + limit,
              // page: { ...page, total, start: start + limit },
              cond: newCond,
            }));
            Toast.fail(msg, 3);
          }
        } else {
          const { start, limit, total } = page;
          const newRenderData = renderData.concat(filterData.slice(start, start + limit));

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

    *filterData({ payload }, { select, put }) {
      const { selectedDate, selectedJobTitle, selectedShift, selectedArea, allData } = yield select(model => model.appoint);
      const newAllData = payload && payload.allData || allData;
      const newSelectedDate = payload && payload.selectedDate || selectedDate;
      const newSelectedJobTitle = payload && payload.selectedJobTitle || selectedJobTitle;
      const newSelectedShift = payload && payload.selectedShift || selectedShift;
      const newSelectedArea = payload && payload.selectedArea || selectedArea;

      const newFilterData = newAllData.filter(item =>
        (newSelectedDate === initDateData[0] || newSelectedDate.label === item.clinicDate) &&
        (newSelectedJobTitle === initJobTitleData[0] || newSelectedJobTitle.label === item.docJobTitle) &&
        (newSelectedShift === initShiftData[0] || newSelectedShift.label === item.shiftName) &&
        (newSelectedArea === initAreaData[0] || newSelectedArea.label === item.area));


      const { start, limit } = initPage;
      const total = newFilterData.length;

      yield put(save({
        selectedDate: newSelectedDate,
        selectedJobTitle: newSelectedJobTitle,
        selectedShift: newSelectedShift,
        selectedArea: newSelectedArea,
        allData: newAllData,
        fiterData: newFilterData,
        renderData: newFilterData.slice(start, start + limit),
        hasMore: total > start + limit,
        page: { ...initPage, total },
        refreshing: false,
        isLoading: false,
      }));
    },

    *forAppointSource({ payload }, { select, call, put }) {
      yield put(save({ isLoading: true }));
      try {
        Toast.loading('正在加载', 0);
        const { currHospital: { id: hosId, no: hosNo } } = yield select(model => model.base);
        const { data = {} } = yield call(forList, { ...payload, hosId, hosNo });
        const { success, result = [], msg } = data;

        if (success) {
          yield put(save({ appointSourceData: result }));
          Toast.hide();
        } else {
          Toast.fail(msg, 3);
        }
      } catch (e) {
        Toast.fail(e.toString(), 3);
      }
      yield put(save({ isLoading: false }));
    },

    *forReserve({ payload }, { select, call, put }) {
      try {
        Toast.loading('正在预约', 0);
        const { currHospital: { id: hosId, no: hosNo } } = yield select(model => model.base);
        const { data = {} } = yield call(forReserve, { ...payload, hosId, hosNo });
        const { success, msg } = data;

        if (success) {
          yield put(routerRedux.push('/stack/appoint/success'));
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
        const { currHospital: { id: hosId, no: hosNo } } = yield select(model => model.base);
        const { data = {} } = yield call(forReservedList, { ...payload, hosId, hosNo });
        const { result = [], success, msg } = data;
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

    *forCancel({ payload }, { select, call }) {
      const { currHospital: { id: hosId, no: hosNo } } = yield select(model => model.base);
      const { data = {} } = yield call(forCancel, { ...payload, hosId, hosNo });
      return data;
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
