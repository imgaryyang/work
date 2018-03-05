import { notification } from 'antd';
import { floor } from 'lodash';
import { getOutputList, getOutputDetail, saveOutputDetail } from '../../services/pharmacy/OutputInfoService';

export default {
  namespace: 'outOrderInstock',
  state: {
    page: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    outOrderList: [], // 出库单
    outOrderDetail: [], // 出库单明细
    state: [], // 状态
    outBill: '', // 出库单号
    spin: false,

    bizPrintAlertParams: {
      visible: false,
      tmplateCode: '',
      bizCode: '',
      bizCodeLabel: '',
      bizTip: '',
    },
  },
  effects: {
    // 1、加载页面（操作类型、出库科室）
    // 2、加载出库单信息
    // 3、加载出库单明细
    // 4、出库单入库

    // 1、加载页面（操作类型、出库科室）
    * load({}, { call, put, select }) {

    },
    // 2、加载出库单信息
    * loadOutOrderList({ payload }, { select, call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });
      const deptId = yield select(state => state.base.user.loginDepartment.id);
      const { query } = payload || '';
      const { outBill } = query || '';
      const condition = {
        toDept: { id: deptId },
        outputState: '2',
        outBill: outBill || '',
      };

      const { data } = yield call(getOutputList, condition); // 查询出库单信息
      let outOrderList = [];
      if (data) {
        if (data.success) {
          outOrderList = data.result;
        }
      }

      yield put({ type: 'setState', payload: { spin: false, outOrderList, outBill } });
    },
    // 3、加载出库单明细
    * loadOutOrderDetail({ outBill }, { call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(getOutputDetail, { outBill }); // 查询出库单明细
      let outOrderDetail = [];
      if (data && data.result) {
        outOrderDetail = data.result;
      }

      yield put({ type: 'setState', payload: { spin: false, outOrderDetail } });
    },
    // 4、出库单入库
    * save({ paload }, { select, call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });
      const { outOrderDetail, outBill } = yield select(state => state.outOrderInstock);
      let detail = [];
      for (let out of outOrderDetail) {
        out.outputState = '6';
        if (out.outSum && out.drugInfo.packQty) {
          out.outSum = floor(out.outSum / out.drugInfo.packQty);
        }
        detail.push(out);
      }

      const { data } = yield call(saveOutputDetail, detail); // 查询出库单明细
      if (data) {
        if (data.success) {
          /*
          notification.success({
            message: '提示',
            description: "入库成功",
          });*/

          const retData = data.result;

          // 弹出业务单据打印提示
          yield put({
            type: 'setState',
            payload: {
              bizPrintAlertParams: {
                visible: true,
                tmplateCode: '009', // 模版编号
                bizCode: retData[0].inBill, // 业务单据编号
                bizCodeLabel: '入库单号', // 业务单据编号名称
                bizTip: '入库成功', // 业务操作成功提示
              },
            },
          });

          detail = [];
          yield put({ type: 'loadOutOrderList', query: { outBill } });
          yield put({ type: 'setState', payload: { spin: false, outOrderDetail: detail } });
        } else {
          notification.error({
            message: '提示',
            description: data.msg,
          });
          yield put({ type: 'setState', payload: { spin: false } });
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
