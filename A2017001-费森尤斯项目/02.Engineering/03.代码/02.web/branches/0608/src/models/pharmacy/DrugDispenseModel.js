import { notification } from 'antd';
import { loadChargeDetailPage, loadChargeInvoicePage, dispense } from '../../services/pharmacy/DrugDispenseService';
// import { loadPatientPage } from '../../services/card/PatientService';

export default {
  namespace: 'drugDispense',
  state: {
    page: { total: 0, pageSize: 10, pageNo: 1 },
    query: {},

    invoices: [],
    invoice: [],
    invoiceIdx: -1,

    formulations: [],
    formulation: {},
    formulationIdx: -1,

    formulationSumItems: {},
    formulationItems: {},

    // baseInfo: {},
    spin: false,
  },
  effects: {
    /**
     * 根据发票汇总未发药的处方
     */
    *loadInvoice({ payload }, { select, call, put }) {
      const { page, query, search } = (payload || {});

      const defaultPage = yield select(state => state.drugDispense.page);
      const p = { ...defaultPage, ...page };
      const start = search ? 0 : (p.pageNo - 1) * p.pageSize;
      // 显示载入指示器
      yield put({ type: 'addSpin' });
      // 载入所有未发药的发票信息
      const { data } = yield call(loadChargeInvoicePage, start, p.pageSize, query);
      if (data) {
        yield put({
          type: 'initInvoice',
          data,
          page: p,
          query: query || {},
        });
      }
      // 移除载入指示器
      // yield put({ type: 'removeSpin' });
    },

    /**
     * 根据发票号载入处方明细
     */
    *loadRecipe({ payload }, { call, put }) {
      const { invoice, invoiceIdx } = (payload || {});
      // 显示载入指示器
      yield put({ type: 'addSpin' });
      yield put({
        type: 'setState',
        payload: {
          invoice,
          invoiceIdx,
          formulationIdx: -1,
          formulations: [],
          formulation: {},
          formulationSumItems: {},
          formulationItems: {},
        },
      });
      // 载入所有未发药的发票信息
      const { data } = yield call(loadChargeDetailPage, 0, 1000, { invoiceNo: invoice[0] });
      if (data && data.success) {
        const { result } = data;

        const formulationItems = {}; // 处方对应的医嘱项目明细列表
        const formulations = []; // 处方列表
        const idx = {}; // 暂存处方列表中处方对应的序号
        // console.log('result:', result);
        for (let i = 0; i < result.length; i += 1) {
          const item = result[i];
          // 按处方请领id归类
          if (!formulationItems[item.recipeId]) {
            formulationItems[item.recipeId] = [];
            idx[item.recipeId] = formulations.length;
            formulations.push({
              recipeId: item.recipeId,
              invoiceNo: item.invoiceNo,
              totCost: 0,
            });
          }
          // 医嘱明细列表
          formulationItems[item.recipeId].push(item);

          // 处理处方列表
          if (item.totCost) {
            const recipeItem = formulations[idx[item.recipeId]];
            formulations[idx[item.recipeId]] = {
              ...recipeItem,
              totCost: recipeItem.totCost + item.totCost,
            };
          }

          /* console.log('idx:', idx);
          console.log('formulations:', formulations);
          console.log('formulationItems:', formulationItems);*/
        }

        /* const formulation = {};
        const formulationIdx = -1;*/

        yield put({
          type: 'setState',
          payload: {
            formulations,
            formulationItems,
            formulation: formulations[0],
            formulationIdx: 0,
          },
        });
      }
      // 移除载入指示器
      yield put({ type: 'removeSpin' });
    },

    *dispense({ recipeId }, { select, call, put }) {
      // 显示载入指示器
      yield put({ type: 'addSpin' });
      const { data } = yield call(dispense, recipeId);
      if (data && data.success) {
        notification.success({
          message: '提示',
          description: '发药信息记录成功！',
        });
        const query = yield select(state => state.drugDispense.query);
        yield put({
          type: 'setState',
          payload: {
            invoices: [],
            invoice: [],
            formulations: [],
            formulation: {},
            formulationSumItems: {},
            formulationItems: {},
            invoiceIdx: -1,
            formulationIdx: -1,
          },
        });
        yield put({ type: 'loadInvoice', payload: { query } });
      } else {
        notification.error({
          message: '错误',
          description: data.msg,
        });
        // 移除载入指示器
        yield put({ type: 'removeSpin' });
      }
      // 移除载入指示器
      // yield put({ type: 'removeSpin' });
    },

  },
  reducers: {

    initInvoice(state, { data, page, query }) {
      const { result = result || [], total } = data;
      const p = { ...state.page, ...page, total };
      const invoices = result;
      return {
        ...state,
        invoices,
        page: p,
        query,
        invoice: [],
        formulations: [],
        formulation: {},
        formulationSumItems: {},
        formulationItems: {},
        invoiceIdx: -1,
        formulationIdx: -1,
        spin: false,
      };
    },

    setState(oldState, { payload }) {
      return { ...oldState, ...payload };
    },

    addSpin(state) {
      return { ...state, spin: true };
    },

    removeSpin(state) {
      return { ...state, spin: false };
    },
  },
};
