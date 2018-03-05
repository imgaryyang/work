import { notification } from 'antd';
import { loadSearchBar, loadApply, saveApply, deleteApply, newApply } from '../../services/material/InstockService';
import { loadStoreInfoPage } from '../../services/material/StoreInfoService';

export default {
  namespace: 'instockDept',
  state: {
    data: [], // 库存
    dataApply: [], // 请领
    spin: false,
    dataPage: { total: 0, pageSize: 10, pageNo: 1 },
    applyPage: { total: 0, pageSize: 10, pageNo: 1 },
    fromDeptId: null,

  },
  effects: {
    // 下拉选择药房数据以及库存searchBar查询
    * load({ payload }, { select, call, put }) {
      const { dataPage, query } = (payload || {});

      const { deptId } = (query || {});
      if (deptId) {
        yield put({ type: 'setState', payload: { fromDeptId: deptId } });
      }
      const defaultPage = yield select(state => state.instockDept.dataPage);
      const fromDeptId = yield select(state => state.instockDept.fromDeptId);
      const newPage = { ...defaultPage, ...dataPage };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;
      yield put({ type: 'setState', payload: { spin: true } });
      const newQuery = { ...query, ...{ deptId: fromDeptId } };
      const { data } = yield call(loadStoreInfoPage, start, pageSize, newQuery); // 调用汐鸣接口查询
      yield put({ type: 'setState', payload: { spin: false } });

      if (data) {
        newPage.total = data.total;

        yield put({
          type: 'init',
          data,
          dataPage: newPage,
        });
      }
    },
    // 请领searchBar查询
    * loadSearchBar({ payload }, { select, call, put }) {
      const { query } = (payload || {});
      const defaultQuery = yield select(state => state.instockDept.query);
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(loadSearchBar, query || defaultQuery); // 调用汐鸣接口查询
      yield put({ type: 'setState', payload: { spin: false } });

      if (data) {
        yield put({
          type: 'initApply',
          data,
        });
      }
    },
    * loadApply({ payload }, { select, call, put }) {
      // 查询操作员请领单暂存记录

      const { user } = yield select(state => state.base);
      const deptId = user.loginDepartment.id;

      const query = {
        createOper: user.name || null,
        hostId: user.hosId || null,
        appState: '0',
        deptId,
      };
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(loadApply, query);
      let dataApply = [];
      if (data && data.success) {
        if (data.result && data.result.length > 0) {
          const { result } = data;
          for (let i = 0; i < result.length; i++) {
            dataApply.push({
              tradeName: result[i].tradeName,
              materialSpec: result[i].materialSpec,
              producer: result[i].producer,
              salePrice: result[i].salePrice,
              minUnit: result[i].minUnit,
              appUnit: result[i].appUnit,
              matInfo: result[i].matInfo,
              appBill: result[i].appBill,
              appState: result[i].appState,
              appNum: result[i].appNum,
              id: result[i].id,
              deptId: result[i].deptId,
              approvalNo: result[i].approvalNo,
              batchNo: result[i].batchNo,
              producerName: result[i].matInfo.companyInfo.companyName, // 生产厂商
              fromDeptId: result[i].fromDeptId,
              materialType: result[i].materialType,
              //                            produceDate:result[i].produceDate,
              //                            validDate:result[i].validDate,
              company: result[i].company,
              buyPrice: result[i].buyPrice,
              saleCost: result[i].saleCost,
              appOper: result[i].appOper,

            });
          }
        }
      }
      yield put({ type: 'setState', payload: { spin: false } });
      yield put({ type: 'setState', payload: { dataApply } });
    },
    // 增加请领药品
    * forAddApply({ record }, { select, put }) {
      // 获取药品信息
      const data = record || {};
      const { dataApply, fromDeptId } = yield select(state => state.instockDept);
      const { user } = yield select(state => state.base);
      const userName = user.name;
      const deptId = user.loginDepartment.id;

      if (dataApply.length > 0) {
        if (data.storeSum === 0) {
          notification.error({
            message: '提示',
            description: '该物资库存为零,不能请领',
          });
        }

        if (dataApply.find(value => ((value.matInfo.id === data.materialInfo.id) && (value.approvalNo === data.approvalNo) || value.fromDeptId != fromDeptId))) {
          notification.error({
            message: '提示',
            description: '同一物资或不同库房的药品不允许添加!',
          });
          return;
        } else {
          dataApply.push({
            tradeName: data.tradeName,
            materialSpec: data.materialSpecs,
            producerName: data.companyInfo ? data.companyInfo.companyName : '', // 生产厂商
            salePrice: data.salePrice,
            saleCost: data.saleCost,
            materialType: data.materialType,
            maxUnit: data.maxUnit,
            appUnit: data.materialInfo.materialUnit,
            materialId: data.materialInfo.id,
            appBill: dataApply[0].appBill,
            appState: null,
            deptId,
            appNum: 0,
            approvalNo: data.approvalNo,
            batchNo: data.batchNo,
            matInfo: data.materialInfo,
            produceDate: data.produceDate,
            validDate: data.validDate,
            buyPrice: data.buyPrice,
            minUnit: data.minUnit,
            producer: data.materialInfo.companyInfo ? data.materialInfo.companyInfo.id : '',
            appOper: userName,
            company: data.companySupply ? data.companySupply.id : '', // 供货商
            fromDeptId,

          });
        }
      } else {
        if (data.storeSum === 0) {
          notification.error({
            message: '提示',
            description: '该物资库存为零,不能请领',
          });
          return;
        }
        dataApply.push({
          tradeName: data.tradeName,
          materialSpec: data.materialSpecs,
          producerName: data.companyInfo ? data.companyInfo.companyName : '',
          salePrice: data.salePrice,
          maxUnit: data.maxUnit,
          appUnit: data.materialInfo.materialUnit,
          appBill: null,
          deptId,
          appState: null,
          appNum: 0,
          approvalNo: data.approvalNo,
          batchNo: data.batchNo,
          matInfo: data.materialInfo,
          materialId: data.materialInfo.id,
          produceDate: data.produceDate,
          validDate: data.validDate,
          buyPrice: data.buyPrice,
          minUnit: data.minUnit,
          producer: data.materialInfo.companyInfo ? data.materialInfo.companyInfo.id : '',
          appOper: userName,
          company: data.companySupply ? data.companySupply.id : '', // 供货商
          fromDeptId,
          saleCost: data.saleCost,
          materialType: data.materialType,

        });
      }
      yield put({ type: 'setState', payload: { dataApply } });
    },
    // 保存或者暂存请领药品
    * saveApply({ appState }, { select, call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });
      const data = yield select(state => state.instockDept.dataApply);
      const { user } = yield select(state => state.base);
      if (data && data.length > 0) {
        for (const o of data) {
          o.appState = appState;
          o.deptId = user.loginDepartment.id;
          o.materialCode = o.matInfo.materialCode;
          o.plusMinus = 1;
          if (appState === '0') {
            o.comm = '暂存请领物资';
          } else {
            o.comm = '提交请领物资';
          }
        }
        const { data: ret } = yield call(saveApply, data);
        if (ret && ret.success) {
          if (appState === '0') {
            yield put({ type: 'setState', payload: { dataApply: data } });
            yield put({ type: 'loadApply', payload: {} });
            notification.success({
              message: '提示',
              description: '保存成功！',
            });
          } else {
            yield put({ type: 'setState', payload: { dataApply: [] } });
          }
        } else {
          notification.error({
            message: '提示',
            description: ret.msg || '保存失败！',
          });
        }
      }
      yield put({ type: 'setState', payload: { spin: false } });
    },
    // 删除请领药品
    * deleteApply({ record }, { call, put }) {
      if (record.id) {
        yield put({ type: 'setState', payload: { spin: true } });
        const { data } = yield call(deleteApply, record.id);
        if (data && data.success) {
          yield put({ type: 'delete', drugId: record.matInfo.id });
          notification.success({
            message: '提示',
            description: '删除成功！',
          });
        } else {
          notification.error({
            message: '错误',
            description: `${data.msg}!`,
          });
        }
        yield put({ type: 'setState', payload: { spin: false } });
      } else {
        yield put({ type: 'delete', drugId: record.matInfo.id });
      }
    },
    // 新建清空原纪录
    * newApply({ dataApply }, { call, put }) {
      let data = [];
      if (dataApply.length > 0) {
        for (let i = 0; i < dataApply.length; i++) {
          if (dataApply[i].id) {
            data.push(dataApply[i].id);
          }
        }
      }
      if (data && data.length > 0) {
        const { data: ret } = yield call(newApply, data);
        if (ret && ret.success) {
          yield put({ type: 'setState', payload: { dataApply: [] } });
        } else {
          notification.error({
            message: '错误',
            description: `${ret.msg}!`,
          });
        }
      } else {
        yield put({ type: 'setState', payload: { dataApply: [] } });
      }
    },

  },
  reducers: {
    init(state, { data, dataPage }) {
      const { result } = data;
      const newdata = result || [];
      return { ...state, data: newdata, dataPage };
    },
    initApply(state, { data }) {
      const { result } = data;
      const newdata = result || [];
      return { ...state, dataApply: newdata };
    },
    setState(state, { payload }) {
      return { ...state, ...payload };
    },
    delete(state, { drugId }) {
      const { dataApply } = state;
      const index = dataApply.findIndex(value => value.matInfo.id === drugId);
      if (index !== -1) {
        dataApply.splice(index, 1);
      }
      return {
        ...state,
        dataApply,
      };
    },
  },
};
