import { getOutputList, getOutputDetail, saveOutputDetail } from '../../services/material/OutputInfoService';
import baseUtil from '../../utils/baseUtil';
import { notification } from 'antd';
export default {
  namespace: 'matOutOrderInstock',
  state: {
    page: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    outOrderList: [],  // 出库单
    outOrderDetail: [],  // 出库单明细
    state: [],  // 状态
    outBill: '',  // 出库单号
    spin: false,
  },
  effects: {
    // 1、加载页面（操作类型、出库科室）
    // 2、加载出库单信息
    // 3、加载出库单明细
    // 4、出库单入库
    *loadOutOrderList({ payload }, { select, call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });
      const deptId = yield select(state => state.base.user.loginDepartment.id);
      const { query } = payload || '';
      const { outBill } = query || '';
      const condition = {
        toDept: { id: deptId },
        outputState: '2',
        outBill: outBill || '',
      };
      const { data } = yield call(getOutputList, condition);// 查询出库单信息
      let outOrderList = [];
      if (data) {
        if (data.success) {
          outOrderList = data.result;
        }
      }
      yield put({ type: 'setState', payload: { spin: false, outOrderList, outBill } });
    },
    // 3、加载出库单明细
    *loadOutOrderDetail({ outBill }, { select, call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(getOutputDetail, { outBill });// 查询出库单明细
      let outOrderDetail = [];
      if (data && data.result) {
        outOrderDetail = data.result;
      }
      yield put({ type: 'setState', payload: { spin: false, outOrderDetail } });
    },
    // 4、出库单入库
    *save({ }, { select, call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });
      const { outOrderDetail, outBill } = yield select(state => state.matOutOrderInstock);
      let detail = [];
      for (let out of outOrderDetail) {
        out.outputState = '6';
        detail.push(out);
      }
      const { data } = yield call(saveOutputDetail, detail);// 查询出库单明细
      if (data) {
        if (data.success) {
			notification.success({
    			message: "提示",
    			description: "入库成功",
    		});
			detail = [];
			yield put({ type: 'loadOutOrderList', query: { outBill } });
			yield put({ type: 'setState', payload: { spin: false, outOrderDetail: detail } });
        } else {
			notification.success({
    			message: "提示",
    			description: "入库失败：" + data.msg ,
    		});
//			baseUtil.alert(`入库失败! ${data.msg}`);
			yield put({ type: 'setState', payload: { spin: false }});
        }
      }
    },
  },
  reducers: {
    setState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
