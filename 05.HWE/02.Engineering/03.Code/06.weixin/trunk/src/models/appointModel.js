import { Toast } from 'antd-mobile';
import React from 'react';
import _ from 'lodash';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { forDeptTree, forScheduleList, forList, forReserve, forReservedList, forReservedNoCardList, forCancel, forSign } from '../services/appointService';
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
    selectAppointSource: [],

    // AppointRecordsMain
    hasCardRecords: [],
    noCardRecords: [],
  },

  effects: {
    *forDeptTree({ payload }, { select, call, put }) {
      Toast.loading('loading', 0);
      const { currHospital: { id: hosId, no: hosNo } } = yield select(model => model.base);
      const { data } = yield call(forDeptTree, { ...payload, hosId, hosNo });
      if (data && data.success) {
        const { result } = data;
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
      } else if (data && !data.success) {
        Toast.fail(data.msg || '未知错误', 3);
      }
    },

    *forScheduleList(obj, { select, call, put }) {
      yield put(save({ isLoading: true }));
      const { page, refreshing, renderData, filterData, cond, selectedDate } = yield select(model => model.appoint);
      if (refreshing) {
        // const { currHospital } = yield select(model => model.base);
        if (_.isEmpty(cond)) {
          Toast.fail('查询条件不能为空', 3);
          return false;
        }
        const newCond = {
          ...cond,
          startDate: moment().format('YYYY-MM-DD'),
          endDate: moment().add(7, 'days').format('YYYY-MM-DD'),
        };
        const { data } = yield call(forScheduleList, { ...newCond });
        if (data && data.success) {
          const { result = [] } = data;
          const newDateData = initDateData.concat(_.uniqBy(result, 'clinicDate').map((item, index) => { return { value: index + 1, label: item.clinicDate }; }));
          const newSelectedDate = newDateData.find(item => item.label === selectedDate.label) || initDateData[0];
          yield put(save({ dateData: newDateData, cond: newCond }));
          yield put(action('filterData', { allData: result, selectedDate: newSelectedDate }));
        } else if (data && !data.success) {
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
          Toast.fail(data.msg || '未知错误', 3);
        } else {
          yield put(save({ isLoading: false, refreshing: false }));
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
      Toast.loading('正在加载', 0);
      if (_.isEmpty(payload)) {
        Toast.fail('查询条件不能为空', 3);
        return false;
      }
      const { currHospital: { id: hosId, no: hosNo } } = yield select(model => model.base);
      const { data } = yield call(forList, { ...payload, hosId, hosNo });
      if (data && data.success) {
        yield put(save({ appointSourceData: data.result || [] }));
        Toast.hide();
      } else if (data && !data.success) {
        Toast.fail(data.msg || '未知错误', 3);
      }
      yield put(save({ isLoading: false }));
    },

    *forReserve({ payload }, { select, call, put }) {
      Toast.loading('正在预约', 0);
      const { currHospital: { id: hosId, no: hosNo } } = yield select(model => model.base);
      const { data } = yield call(forReserve, { ...payload, hosId, hosNo });
      if (data && data.success) {
        yield put(routerRedux.push('/stack/appoint/success'));
        Toast.hide();
      } else if (data && !data.success) {
        Toast.fail(data.msg || '未知错误', 3);
      }
    },

    *forAppointRecords({ payload }, { select, call, put }) {
      Toast.loading('正在加载', 0);
      const { currHospital: { id: hosId, no: hosNo } } = yield select(model => model.base);
      const { data: hasCardData } = yield call(forReservedList, { ...payload, hosId, hosNo });
      const { data: noCardData } = yield call(forReservedNoCardList, { ...payload, hosId, hosNo });

      if ((hasCardData && hasCardData.success) && (noCardData && noCardData.success)) {
        yield put(save({ hasCardRecords: hasCardData.result, noCardRecords: noCardData.result }));
        Toast.hide();
      } else if ((hasCardData && !hasCardData.success) || (noCardData && !noCardData.success)) {
        if (hasCardData.msg && noCardData.msg) {
          Toast.fail(hasCardData.msg + noCardData.msg, 3);
        } else if (hasCardData.msg && !noCardData.msg) {
          Toast.fail(hasCardData.msg, 3);
        } else if (!hasCardData.msg && noCardData.msg) {
          Toast.fail(noCardData.msg, 3);
        } else {
          Toast.fail('未知错误', 3);
        }
      }
    },

    *forReservedList({ payload }, { select, call, put }) {
      Toast.loading('正在加载', 0);
      const { currHospital: { id: hosId, no: hosNo } } = yield select(model => model.base);
      const { data } = yield call(forReservedList, { ...payload, hosId, hosNo });

      if (data && data.success) {
        yield put(save({ hasCardRecords: data.result }));
        Toast.hide();
      } else if (data && !data.success) {
        Toast.fail(data.msg || '未知错误', 3);
      }
    },

    *forReservedNoCardList({ payload }, { select, call, put }) {
      Toast.loading('正在加载', 0);
      const { currHospital: { id: hosId, no: hosNo } } = yield select(model => model.base);
      const { data } = yield call(forReservedNoCardList, { ...payload, hosId, hosNo });

      if (data && data.success) {
        yield put(save({ noCardRecords: data.result }));
        Toast.hide();
      } else if (data && !data.success) {
        Toast.fail(data.msg || '未知错误', 3);
      }
    },

    *forCancel({ payload }, { select, call }) {
      const { currHospital: { id: hosId, no: hosNo } } = yield select(model => model.base);
      const { data } = yield call(forCancel, { ...payload, hosId, hosNo });
      if (data && data.success) {
        return true;
      } else if (data && !data.success) {
        return Promise.reject(data.msg || '未知错误');
      } else {
        return false;
      }
    },

    *forSign({ payload }, { select, call }) {
      const { currHospital: { id: hosId, no: hosNo } } = yield select(model => model.base);
      const { data } = yield call(forSign, { ...payload, hosId, hosNo });
      if (data && data.success) {
        return true;
      } else if (data && !data.success) {
        return Promise.reject(data.msg || '未知错误');
      } else {
        return false;
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
