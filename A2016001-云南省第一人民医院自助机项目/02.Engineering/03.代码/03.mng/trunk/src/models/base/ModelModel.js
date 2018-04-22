import dva from 'dva';
import ajax                   from "../../utils/ajax"
import {loadAllModels, deleteAllModels, saveModel, loadParent} from '../../services/base/ModelService';
function arrayToTree(array){
	var map={},root=[];
	for(var obj of array){
		obj.children=[];
		map[obj.id] = obj; 
	}
	for(var obj of array){
		if(obj.parent){
			var parent = map[obj.parent];
			if(parent){
				parent.children.push(obj);
				obj.parent=parent;
			}else{root.push(obj);}
		}else{
			root.push(obj);
		}
	}
	console.info('root ',root);
	return root;
}
export default {
  namespace: 'modelManage',
  state: {
    tabs: [],
    activeKey: '',
    models: [],
    parents: [],
    checkedKeys: [],
    selectedNode: {},
    model: {},

    showIconSelecter: false,
    spin: false,
  },
  effects: {

    *load({ payload }, { select, call, put }) {
      yield put({ type: 'addSpin' });
      const { data } = yield call(loadAllModels);
      if (data) {
        yield put({
          type: 'init',
          data
        });
      }
      
      // 移除载入指示器
      yield put({ type: 'removeSpin' });
    },
    *loadParent({ payload }, { select, call, put }) {
    	const { data } = yield call(loadParent);
    	if(data){
    		yield put({
                type: 'setState',
                state: {
                	parents: data.result || [],
                },
            });
    	}
    },
    *save({ params }, { select, call, put }) {
       
      yield put({ type: 'addSpin' });
      const { data } = yield call(saveModel, params);

      if (data && data.success) {
        yield put({ type: 'load',});
        // 如果是新增，新增后将被选树状菜单节点设置为新增节点
        if (!params.id) {
          const { selectedNode } = yield select(state => state.modelManage);
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
              model: node,
            },
          });
        }
      } else {
        // TODO: 提示错误
      }
      // 移除载入指示器
      yield put({ type: 'removeSpin' });
    },

    *deleteSelected({ payload }, { select, call, put }) {
      const checkedKeys = yield select(state => state.modelManage.checkedKeys);
      yield put({ type: 'addSpin' });
      const { data } = yield call(deleteAllModels, checkedKeys);
      yield put({ type: 'removeSpin' });

      if (data && data.success) {
        yield put({
          type: 'setState',
          state: {
            checkedKeys: [],
            selectedNode: {},
            model: {},
          },
        });
        yield put({ type: 'load' });
      }
    },
  },
  reducers: {

    init(state, { data }) {
      const { result = result || [] } = data;
      const tree = arrayToTree(result);
      const models = tree || [];
      return {
        ...state,
        models,
        checkedKeys: [],
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
}