import { notification } from 'antd';
import { savePatientRecordsTemplate, deleteAll, loadPatientRecordsTemplatePage } from '../../services/odws/PatientRecordsTemplateService';

export default {
  namespace: 'patientRecordsTemplate',
  state: {
    tabs: [],
    activeKey: '',
    page: { total: 0, pageSize: 1000, pageNo: 1 },
    prts: [],

    checkedKeys: [],
    selectedNode: {},
    prt: {},

    showIconSelecter: false,
    spin: false,
  },

  effects: {
    *load({ payload }, { select, call, put }) {
      const { page, query } = (payload || {});

      const defaultPage = yield select(state => state.patientRecordsTemplate.page);
      const p = { ...defaultPage, ...page };
      const start = (p.pageNo - 1) * p.pageSize;

      yield put({ type: 'addSpin' });

      const { data } = yield call(loadPatientRecordsTemplatePage, start, p.pageSize, query);
      if (data && data.success) {
        yield put({
          type: 'init',
          data,
          page: p,
        });
      } else {
        notification.error({
          message: '错误',
          description: `${data.msg || '查询病历模板列表出错！'}`,
        });
        yield put({
          type: 'setState',
          payload: {
            spin: false,
          },
        });
      }
      // 移除载入指示器
      // yield put({ type: 'removeSpin' });
    },

    *save({ params }, { select, call, put }) {
      // console.log(params);
      yield put({ type: 'addSpin' });
      const { prt } = yield select(state => state.patientRecordsTemplate);
      const { data } = yield call(savePatientRecordsTemplate, { ...prt, ...params });

      if (data && data.success) {
        notification.success({
          message: '提示',
          description: '保存模板信息成功！',
        });
        // 重新载入菜单数据
        yield put({
          type: 'load',
        });

        // 如果是新增，新增后将被选树状菜单节点设置为新增节点
        /* if (!params.id) {
          const { selectedNode } = yield select(state => state.patientRecordsTemplate);
          // console.log('current selectedNode:', {...selectedNode});
          const node = { ...data.result };
          // console.log('node from server:', {...node});
          if (!node.parent) {  // 当前被选为1级
            node.parent = {};
          } else if (node.parent === selectedNode.id) {  // 当前被选是父节点
            node.parent = selectedNode;
          } else {
            node.parent = selectedNode.parent;
          }
          // console.log('new node:', node);
          // 将当前被选设置为新node
          yield put({
            type: 'setState',
            state: {
              selectedNode: node,
              prt: node,
              spin: false,
            },
          });
        }*/
      } else {
        notification.error({
          message: '错误',
          description: `${data.msg || '保存模板信息出错！'}`,
        });
        yield put({
          type: 'setState',
          payload: {
            spin: false,
          },
        });
      }
      // 移除载入指示器
      // yield put({ type: 'removeSpin' });
    },

    *deleteSelected({ payload }, { select, call, put }) {
      const checkedKeys = yield select(state => state.patientRecordsTemplate.checkedKeys);
      // console.log('11111111111111111AAAAAAAAAAAAAAAA111111111111111', checkedKeys);
      yield put({ type: 'addSpin' });
      const { data } = yield call(deleteAll, checkedKeys);

      if (data && data.success) {
        yield put({
          type: 'setState',
          state: {
            checkedKeys: [],
            selectedNode: {},
            prt: {},
            spin: false,
          },
        });
        yield put({ type: 'load' });
      } else {
        notification.error({
          message: '错误',
          description: `${data.msg || '删除模板信息出错！'}`,
        });
        yield put({
          type: 'setState',
          payload: {
            spin: false,
          },
        });
      }
    },
  },
  reducers: {

    init(state, { data, page }) {
      const { result = result || [], total } = data;
      const p = { ...state.page, ...page, total };
      const map = {};
      const tree = [];
      const levelName = { 1: '个人', 2: '科室', 3: '全院' };
      for (const tpl of result) {
        tpl.children = [];
        const shareLevel = tpl.shareLevel;
        let level = map[shareLevel];
        if (!level) {
          level = {
            shareLevel,
            modelName: levelName[shareLevel],
            children: [],
          };
          map[shareLevel] = level;
          tree.push(level);
        }
        level.children.push(tpl);
      }
      // console.info(' template tree : ', tree);

      const prts = tree || [];

      return {
        ...state,
        prts,
        checkedKeys: [],
        page: p,
        spin: false,
      };
    },

    setState(oldState, { state }) {
      return { ...oldState, ...state };
    },

    addSpin(state) {
      return { ...state, spin: true };
    },

    removeSpin(state) {
      return { ...state, spin: false };
    },
  },
};
