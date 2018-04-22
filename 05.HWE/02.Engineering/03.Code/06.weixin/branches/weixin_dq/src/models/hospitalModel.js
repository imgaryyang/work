/**
 * 医院信息
 */

import { Toast, ListView } from 'antd-mobile';

import { getHospById, getDeptsBrief, getDoctors } from '../services/hospitalService';
import { getSectionDescs, getContacts } from '../services/baseService';

import Global from '../Global';

const initPage = {
  start: 0,
  pageSize: 10,
};

export default {

  namespace: 'hospital',

  state: {
    hospital: {}, // 医院基础信息
    contacts: [], // 医院联系方式
    sectionDescs: [], // 医院介绍分段描述

    depts: [], // 医院科室列表
    dept: {}, // 科室信息
    deptDescs: [],

    refreshing: false,
    noMoreData: false,
    page: initPage,
    query: {},
    doctors: [], // 医院医生列表
    doctorsDS: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    }),
    filterDept: {},
    doctor: {}, // 医生信息
    doctorDescs: [],
    chooseDeptVisible: false,

    loading: false,
    loading1: false,
    loading2: false,

    tabIdx: 0,
  },

  subscriptions: {
  },

  effects: {
    /**
     * 查询医院基础信息
     * @param arg1
     * @param call
     * @param put
     */
    *getHospInfo(arg1, { call, put }) {
      Toast.loading('正在读取医院信息，请稍候...');
      const id = Global.Config.hospId;

      // 查询医院基础信息
      const { data } = yield call(getHospById, id);
      if (data && data.success === true) {
        const { result } = data;
        yield put({
          type: 'setState',
          payload: {
            hospital: result,
          },
        });
      } else if (data && data.msg) {
        Toast.info(data.msg);
      }

      // 查询医院联系方式
      yield put({
        type: 'setState',
        payload: {
          loading1: true,
        },
      });
      const contacts = yield call(getContacts, 0, 100, { fkId: id, fkType: 'hospital' });
      if (contacts.data && contacts.data.success === true) {
        const { result } = contacts.data;
        yield put({
          type: 'setState',
          payload: {
            contacts: result,
            loading1: false,
          },
        });
      } else {
        if (contacts.data && contacts.data.msg) Toast.info(contacts.data.msg);
        yield put({
          type: 'setState',
          payload: {
            loading1: false,
          },
        });
      }

      // 查询医院分段描述
      yield put({
        type: 'setState',
        payload: {
          loading: true,
        },
      });
      const descs = yield call(getSectionDescs, 0, 100, { fkId: id, fkType: 'hospDesc' });
      if (descs.data && descs.data.success === true) {
        const { result } = descs.data;
        yield put({
          type: 'setState',
          payload: {
            sectionDescs: result,
            loading: false,
          },
        });
      } else {
        if (descs.data && descs.data.msg) Toast.info(descs.data.msg);
        yield put({
          type: 'setState',
          payload: {
            loading: false,
          },
        });
      }

      // 查询医院科室列表
      const depts = yield call(getDeptsBrief, { hosId: id });
      if (depts.data && depts.data.success === true) {
        const { result } = depts.data;
        yield put({
          type: 'setState',
          payload: {
            depts: result,
          },
        });
      } else if (depts.data && depts.data.msg) {
        Toast.info(depts.data.msg);
      }

      Toast.hide();
    },

    *getDeptsBrief({ payload }, { call, put }) {
      // 查询医院科室列表
      const depts = yield call(getDeptsBrief, payload);
      if (depts.data && depts.data.success === true) {
        const { result } = depts.data;
        yield put({
          type: 'setState',
          payload: {
            depts: result,
          },
        });
      } else {
        if (depts.data && depts.data.msg) Toast.info(depts.data.msg);
      }
    },

    /**
     * 查询科室分段描述
     * @param arg1
     * @param call
     * @param put
     */
    *getDeptDescs({ payload }, { call, put }) {
      Toast.loading('正在读取科室介绍，请稍候...');

      // 查询分段描述
      yield put({
        type: 'setState',
        payload: {
          loading: true,
        },
      });
      const descs = yield call(getSectionDescs, 0, 100, { fkId: payload.id, fkType: 'deptDesc' });
      if (descs.data && descs.data.success === true) {
        const { result } = descs.data;
        yield put({
          type: 'setState',
          payload: {
            deptDescs: result,
            loading: false,
          },
        });
        Toast.hide();
      } else {
        if (descs.data && descs.data.msg) Toast.info(descs.data.msg);
        yield put({
          type: 'setState',
          payload: {
            loading: false,
          },
        });
        Toast.hide();
      }
    },

    /**
     * 查询医生分段描述
     * @param arg1
     * @param call
     * @param put
     */
    *getDoctorDescs({ payload }, { call, put }) {
      Toast.loading('正在读取医生介绍，请稍候...');

      // 查询分段描述
      yield put({
        type: 'setState',
        payload: {
          loading: true,
        },
      });
      const descs = yield call(getSectionDescs, 0, 100, { fkId: payload.id, fkType: 'docDesc' });
      if (descs.data && descs.data.success === true) {
        const { result } = descs.data;
        yield put({
          type: 'setState',
          payload: {
            doctorDescs: result,
            loading: false,
          },
        });
        Toast.hide();
      } else {
        if (descs.data && descs.data.msg) Toast.info(descs.data.msg);
        yield put({
          type: 'setState',
          payload: {
            loading: false,
          },
        });
        Toast.hide();
      }
    },

    // 刷新列表
    *refresh({ payload }, { put, select }) {
      const { query } = yield select(model => model.hospital);
      yield put({
        type: 'setState',
        payload: {
          refreshing: true,
          loading: false,
          doctors: [],
          noMoreData: false,
          query: { ...query, ...payload },
          page: initPage,
        },
      });
      yield put({ type: 'loadDoctors' });
    },
    // 点击查询按钮刷新列表
    *search({ payload }, { put, select }) {
      const { query } = yield select(model => model.hospital);
      yield put({
        type: 'setState',
        payload: {
          refreshing: true,
          loading: false,
          doctors: [],
          noMoreData: false,
          query: { ...query, depId: payload.filterDept.id },
          filterDept: payload.filterDept,
          chooseDeptVisible: false,
          page: initPage,
        },
      });
      yield put({ type: 'loadDoctors' });
    },
    // 无限加载
    *infiniteLoad(param, { put, select }) {
      const { page, noMoreData } = yield select(model => model.hospital);
      if (noMoreData) return false;
      yield put({
        type: 'setState',
        payload: {
          refreshing: false,
          loading: true,
          page: { ...page, start: page.start + page.pageSize },
        },
      });
      yield put({ type: 'loadDoctors' });
    },
    // 从后台载入医生列表
    *loadDoctors(param, { call, put, select }) {
      const { page, query, doctors } = yield select(model => model.hospital);
      const { data } = yield call(getDoctors, page.start, page.pageSize, query);
      if (data && data.success) {
        const { result } = data;
        yield put({
          type: 'setState',
          payload: {
            doctors: doctors.concat(result),
            noMoreData: data.start + data.pageSize >= data.total,
            refreshing: false,
            loading: false,
          },
        });
      } else {
        if (data && data.msg) Toast.info(`请求数据出错：${data.msg}`);
      }
    },
  },

  reducers: {
    setState(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
