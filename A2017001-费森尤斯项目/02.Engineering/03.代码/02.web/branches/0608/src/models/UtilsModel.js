import { notification } from 'antd';
import {
  initTrees, loadTreeItemChildren, getOptions, initDepts, reloadDepts,
  loadItemInfo, loadDiagnosis, loadFreqs, getDataSource, loadRegInfo,
  loadDrugInfo, loadMaterialCompany, loadMaterialCertificate, loadMaterials,
  loadPatientInfoByPatientId, loadCompanies,
} from '../services/UtilsService';

export default {
  namespace: 'utils',
  state: {
    dicts: {},
    dictTrees: {},
    flatDictTrees: {},
    depts: {},
    deptsIdx: {},
    /* 通用收费项 */
    commonItems: [],
    commonItemsFetching: false,
    /* 诊疗项目 */
    diagnosis: [],
    diagnosisFetching: false,
    /* 挂号信息 */
    regInfo: [],
    regInfoFetching: false,
    /* 药品信息 */
    drugInfo: [],
    drugInfoFetching: false,
    /* 频次信息 */
    freqs: [],
    freqsFetching: false,
    /* 物资厂商信息 */
    materialCompany: [],
    materialCompanyFetching: false,
    /* 物资证书信息 */
    materialCertificate: [],
    materialCertificateFetching: false,
    /* 物资信息 */
    materials: [],
    materialsFetching: false,
    /* 公用厂商及供应商信息 */
    companies: [],
    companiesFetching: false,
    /* 新增／修改记录 */
    record: {},
    shortcuts: false,
    /* 数据源 */
    dataSource: {},
    /* 患者 */
    patient: {},
  },
  effects: {
    /**
     * 初始化需要的字典项
     */
    *initDicts({ payload }, { call, put }) {
      const dicts = yield call(getOptions, payload);
      if (dicts) {
        yield put({
          type: 'setState',
          payload: { dicts },
        });
      }
    },

    /**
     * 初始化所有部门信息
     */
    *initDepts({ payload }, { call, put }) {
      const { depts, deptsIdx } = yield call(initDepts);
      // console.log(depts, deptsIdx);
      if (depts && deptsIdx) {
        yield put({
          type: 'setState',
          payload: {
            depts,
            deptsIdx,
          },
        });
      }
    },

    /**
     * 中心载入所有部门信息到缓存
     * 仅限部门信息维护调用
     */
    *reloadDepts({ payload }, { put, call }) {
      // 清空缓存
      yield put({
        type: 'setState',
        payload: { depts: {} },
      });
      const { depts, deptsIdx } = yield call(reloadDepts);
      if (depts && deptsIdx) {
        yield put({
          type: 'setState',
          payload: {
            depts,
            deptsIdx,
          },
        });
      }
    },

    /**
     * 初始化需要的多级字典项
     */
    *initDictTrees({ payload }, { call, put }) {
      const { TREE_OPTIONS, FLAT_TREE_OPTIONS } = yield call(initTrees, payload);
      // console.log('dictTrees:', dictTrees);
      // if (TREE_OPTIONS) {
      yield put({
        type: 'setState',
        payload: {
          dictTrees: TREE_OPTIONS,
          flatDictTrees: FLAT_TREE_OPTIONS,
        },
      });
      // }
    },

    /**
     * 动态加载多级字典的子项
     */
    *loadTreeItemChildren({ payload }, { call, put }) {
      const { dictType, selectedOptions } = payload;
      const dictTrees = yield call(loadTreeItemChildren, dictType, selectedOptions);
      // console.log('dictTrees in UtilsService.loadTreeItemChildren():', dictTrees);
      if (dictTrees) {
        yield put({
          type: 'setState',
          payload: { dictTrees },
        });
      }
    },

    *loadCommonItem({ payload }, { call, put }) {
      const { searchCode, type, drugFlag, deptId } = payload;
      // if (searchCode) {
      yield put({
        type: 'setState',
        payload: {
          commonItemsFetching: true,
        },
      });
      const { data } = yield call(
        loadItemInfo, { searchCode, type, drugFlag, deptId },
      );
      if (data && data.success) {
        const { result } = data;
        const datatmp = result || [];
        // console.log('UtilsModel loadCommonItem() receive datatmp:', datatmp);
        yield put({
          type: 'setState',
          payload: {
            commonItems: datatmp,
            commonItemsFetching: false,
          },
        });
      }
      /* } else {
        yield put({
          type: 'setState',
          payload: {
            commonItems: [],
            commonItemsFetching: false,
          },
        });
      }*/
    },

    /**
     * 根据拼音码或查询码搜索诊断列表
     */
    *loadDiagnosis({ payload }, { call, put }) {
      const { searchCode } = payload;
      // if (searchCode) {
      yield put({
        type: 'setState',
        payload: {
          diagnosisFetching: true,
        },
      });
      const { data } = yield call(
        loadDiagnosis, { searchCode },
      );
      if (data && data.success) {
        const { result } = data;
        const datatmp = result || [];
        // console.log('UtilsModel loadDiagnosis() receive datatmp:', datatmp);
        yield put({
          type: 'setState',
          payload: {
            diagnosis: datatmp,
            diagnosisFetching: false,
          },
        });
      }
      /* } else {
        yield put({
          type: 'setState',
          payload: {
            diagnosis: [],
            diagnosisFetching: false,
          },
        });
      }*/
    },

    /**
     * 根据拼音码或查询码搜索频次列表
     */
    *loadFreqs({ payload }, { call, put }) {
      const { searchCode } = payload;
      // if (searchCode) {
      yield put({
        type: 'setState',
        payload: {
          freqFetching: true,
        },
      });
      const { data } = yield call(
        loadFreqs, { searchCode },
      );
      if (data && data.success) {
        const { result } = data;
        const datatmp = result || [];
        // console.log('UtilsModel loadfreq() receive datatmp:', datatmp);
        yield put({
          type: 'setState',
          payload: {
            freqs: datatmp,
            freqsFetching: false,
          },
        });
      }
      /* } else {
        yield put({
          type: 'setState',
          payload: {
            freqs: [],
            freqsFetching: false,
          },
        });
      }*/
    },

    /**
     * 根据就诊流水号查询挂号信息
     */
    *loadRegInfo({ payload }, { call, put }) {
      const { searchCode } = payload;
      if (searchCode) {
        yield put({
          type: 'setState',
          payload: {
            regInfoFetching: true,
          },
        });
        const { data } = yield call(
          loadRegInfo, { searchCode },
        );
        if (data && data.success) {
          const { result } = data;
          const datatmp = result || [];
          // console.log('UtilsModel loadfreq() receive datatmp:', datatmp);
          yield put({
            type: 'setState',
            payload: {
              regInfo: datatmp,
              regInfoFetching: false,
            },
          });
        }
      } else {
        yield put({
          type: 'setState',
          payload: {
            regInfo: [],
            regInfoFetching: false,
          },
        });
      }
    },
    /**
     * 根据药品名称、拼音、五笔等查询药品信息
     */
    *loadDrugInfo({ payload }, { call, put }) {
      const { searchCode } = payload;
      if (searchCode) {
        yield put({
          type: 'setState',
          payload: {
            drugInfoFetching: true,
          },
        });
        const { data } = yield call(
          loadDrugInfo, { searchCode },
        );
        if (data && data.success) {
          const { result } = data;
          const datatmp = result || [];
          yield put({
            type: 'setState',
            payload: {
              drugInfo: datatmp,
              drugInfoFetching: false,
            },
          });
        }
      } else {
        yield put({
          type: 'setState',
          payload: {
            drugInfo: [],
            drugInfoFetching: false,
          },
        });
      }
    },

    /**
     * 根据拼音码或查询码搜索物资厂商列表
     */
    *loadMaterialCompany({ payload }, { call, put }) {
      const { searchCode, ...rest } = payload;
      // if (searchCode) {
      yield put({
        type: 'setState',
        payload: {
          materialCompanyFetching: true,
        },
      });
      const { data } = yield call(
        loadMaterialCompany, { searchCode, ...rest },
      );
      if (data && data.success) {
        const { result } = data;
        const datatmp = result || [];
        // console.log('UtilsModel loadfreq() receive datatmp:', datatmp);
        yield put({
          type: 'setState',
          payload: {
            materialCompany: datatmp,
            materialCompanyFetching: false,
          },
        });
      }
      /* } else {
        yield put({
          type: 'setState',
          payload: {
            materialCompany: [],
            materialCompanyFetching: false,
          },
        });
      }*/
    },

    /**
     * 根据拼音码或查询码搜索公用厂商列表
     */
    *loadCompanies({ payload }, { call, put }) {
      const { searchCode, ...rest } = payload;
      // if (searchCode) {
      yield put({
        type: 'setState',
        payload: {
          companiesFetching: true,
        },
      });
      const { data } = yield call(
        loadCompanies, { searchCode, ...rest },
      );
      if (data && data.success) {
        const { result } = data;
        const datatmp = result || [];
        // console.log('UtilsModel loadfreq() receive datatmp:', datatmp);
        yield put({
          type: 'setState',
          payload: {
            companies: datatmp,
            companiesFetching: false,
          },
        });
      }
      /* } else {
        yield put({
          type: 'setState',
          payload: {
            materialCompany: [],
            materialCompanyFetching: false,
          },
        });
      }*/
    },

    /**
     * 根据拼音码或查询码搜索物资证书列表
     */
    *loadMaterialCertificate({ payload }, { call, put }) {
      const { searchCode, ...rest } = payload;
      // if (searchCode) {
      yield put({
        type: 'setState',
        payload: {
          materialCertificateFetching: true,
        },
      });
      const { data } = yield call(
        loadMaterialCertificate, { searchCode, ...rest },
      );
      if (data && data.success) {
        const { result } = data;
        const datatmp = result || [];
        // console.log('UtilsModel loadfreq() receive datatmp:', datatmp);
        yield put({
          type: 'setState',
          payload: {
            materialCertificate: datatmp,
            materialCertificateFetching: false,
          },
        });
      }
      /* } else {
        yield put({
          type: 'setState',
          payload: {
            materialCompany: [],
            materialCertificateFetching: false,
          },
        });
      }*/
    },

    /**
     * 根据拼音码或查询码搜索物资列表
     */
    *loadMaterials({ payload }, { call, put }) {
      const { searchCode, ...rest } = payload;
      // if (searchCode) {
      yield put({
        type: 'setState',
        payload: {
          materialsFetching: true,
        },
      });
      const { data } = yield call(
        loadMaterials, { searchCode, ...rest },
      );
      if (data && data.success) {
        const { result } = data;
        const datatmp = result || [];
        // console.log('UtilsModel loadfreq() receive datatmp:', datatmp);
        yield put({
          type: 'setState',
          payload: {
            materials: datatmp,
            materialsFetching: false,
          },
        });
      }
      /* } else {
        yield put({
          type: 'setState',
          payload: {
            materialCompany: [],
            materialsFetching: false,
          },
        });
      }*/
    },

    /**
     * 根据拼音码或查询码搜索物资列表
     */
    *loadPatientInfoByPatientId({ patientId }, { call, put }) {
      const { data } = yield call(
        loadPatientInfoByPatientId, patientId,
      );
      if (data && data.success) {
        const { result } = data;
        yield put({
          type: 'setState',
          payload: {
            patient: result,
          },
        });
      } else {
        notification.error({ message: '错误：', description: data.msg || '获取患者信息发生未知错误！' });
      }
    },

    /**
     * 初始化SelectInput需要的数据源
     */
    *initDataSource({ payload }, { call, put }) {
      const dataSource = yield call(getDataSource, payload);
      yield put({ type: 'setState', payload: { dataSource } });
    },

  },
  reducers: {
    setState(oldState, { payload }) {
      return { ...oldState, ...payload };
    },
  },
};
