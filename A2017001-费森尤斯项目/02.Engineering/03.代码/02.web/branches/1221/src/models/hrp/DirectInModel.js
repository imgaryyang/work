import moment from 'moment';
import { notification } from 'antd';
import { saveDirectIn, loadSearchBar, loadApply, saveApply, newApply, deleteApply, loadCompany } from '../../services/hrp/DirectInService';
import * as instrmInfoService from '../../services/hrp/InstrmInfoService';
import CompanySearchInput from '../../components/searchInput/CompanySearchInput';

let _count = 0;
export default {
  namespace: 'hrpDirectIn',
  state: {
    data: [], //  资产信息
    dataApply: [], //  直接入库资产信息
    spin: false,
    page: { total: 0, pageSize: 10, pageNo: 1 },
    deptId: null,
    hosId: null,
    userName: null,
    commonName: null,
    company: '',
    companyInfo: [],
  },
  effects: {
    //  查询资产（左边点击查询按钮操作）
    * load({ payload }, { select, call, put }) {
      const { page, query } = (payload || {});
      const { deptId, hosId, userName, commonName } = (query || {});
      const defaultPage = yield select(state => state.hrpDirectIn.page);
      const newPage = { ...defaultPage, ...page };

      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;

      const defaultQuery = yield select(state => state.hrpDirectIn.query);
      yield put({ type: 'setState', payload: { spin: true } });

      //  调用 service
      const { data } = yield call(instrmInfoService.loadInstrmInfoPage,
        start, pageSize, query);


      yield put({ type: 'setState', payload: { spin: false } });

      if (data) {
        newPage.total = data.total;
        yield put({
          type: 'init',
          payload: {
            data,
            page: newPage,
            deptId,
            hosId,
            userName,
            commonName,
          },
        });
      }
    },
    //  直接入库searchBar查询
    * loadSearchBar({ payload }, { select, call, put }) {
      const { query } = (payload || {});
      const defaultQuery = yield select(state => state.hrpDirectIn.query);
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(loadSearchBar, query || defaultQuery); //  改为查询入库表
      yield put({ type: 'setState', payload: { spin: false } });

      if (data) {
        yield put({
          type: 'initApply',
          data,
        });
      }
    },
    //  查询操作员直接入库暂存记录
    * loadApply({ payload }, { select, call, put }) {
      const { user } = yield select(state => state.base);
      const query = {
        createOper: user.name || null,
        hosId: user.hosId || null,
        inputState: '0',
      };
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(loadApply, query);
      const { data: dataCompany } = yield call(loadCompany);
      if (dataCompany && dataCompany.success) {
        const { result: resultCompany } = dataCompany;
        for (let j = 0; j < resultCompany.length; j++) {
          companyInfo.push({
            id: resultCompany[j].id,
            name: resultCompany[j].companyName,
          });
        }
      } else {
        //  todo
      }
      let dataApply = [];
      let company = '';
      if (data && data.success) {
        if (data.result && data.result.length > 0) {
          const { result } = data;
          company = (result[0].companyInfo || {}).id || '';

          for (let i = 0; i < result.length; i++) {
            _count = i;
            dataApply.push({
              id: result[i].id,
              instrmCode: result[i].instrmCode,
              centerCode: result[i].centerCode,
              barcode: result[i].barcode,
              commonName: result[i].commonName,
              tradeName: result[i].tradeName,
              commonSpell: result[i].commonSpell,
              commonWb: result[i].commonWb,
              userCode: result[i].userCode,
              instrmSpecs: result[i].instrmSpecs,
              instrmType: result[i].instrmType,
              producer: result[i].producer,
              buyPrice: result[i].buyPrice, //  采购价               
              salePrice: result[i].salePrice, //  零售价               
              stopFlag: result[i].stopFlag,
              batchNo: result[i].batchNo,
              deptId: result[i].deptId,
              hosId: result[i].hosId,
              approvalNo: result[i].approvalNo,
              instrmInfo: result[i].instrmInfo,
              inOper: result[i].inOper,
              produceDate: result[i].produceDate,
              inBill: result[i].inBill,
            });
          }
        }
      }
      yield put({ type: 'setState', payload: { dataApply: dataApply, company: company } });
      yield put({ type: 'setState', payload: { spin: false } });
    },
    //  增加入库资产（向右边添加一行）
    * forAddApply({ record }, { select, call, put }) {
      const { user } = yield select(state => state.base);
      //  获取资产信息
      const data = record || {};
      const { dataApply } = yield select(state => state.hrpDirectIn);

      const { deptId, hosId, userName } = yield select(state => state.hrpDirectIn);
      if (data.stopFlag === '1') {
        dataApply.push({
          'companyInfo.id': '',
          centerCode: data.centerCode,
          barcode: data.barcode,
          tradeName: data.tradeName,
          commonSpell: data.commonSpell,
          commonWb: data.commonWb,
          userCode: data.userCode,
          instrmSpecs: data.instrmSpecs,
          instrmType: data.instrmType,
          producer: data.producer,
          buyPrice: data.buyPrice,
          salePrice: data.salePrice,
          stopFlag: data.stopFlag,
          batchNo: data.batchNo,
          instrmCode: '',
          commonName: data.commonName,
          instrmInfo: { id: (data.id).trim() },
          inSum: 0.00,
          deptId: user.loginDepartment.id,
          hosId: user.hosId,
          approvalNo: '-',
          inOper: userName,
          rId: _count++,
        });
      } else {
        notification.error({
          message: '提示',
          description: '选择的资产已停用！',
        });
      }

      yield put({ type: 'setState', payload: { dataApply } });
    },
    //  保存或者暂存直接入库
    *saveDirectIn({ inputState }, { select, call, put }) {
      // yield put({type: 'setState',payload:{spin:true}});
      const data = yield select(state => state.hrpDirectIn.dataApply);
      const company = yield select(state => state.hrpDirectIn.company);
      if (data && data.length > 0) {
        for (let o of data) {
          o.inputState = inputState;
          o.inType = 'I3';
          o.plusMinus = '1';
          o.buyCost = o.buyPrice * o.inSum;
          //  o.batchNo = '1';// 批次默认
          o.companyInfo = { id: company };
          //  o.approvalNo = '1';// 批号得界面手输
          o.produceDate = moment().format('YYYY-MM-DD'); // 生产日期得界面手输
          //  o.validDate = moment().format('YYYY-MM-DD');// 有效日期得界面手输
          o.inSum = 1.0; // 入库数量
          o.inTime = moment().format('YYYY-MM-DD');
          o.saleCost = o.inSum * o.salePrice; // 入库金额
          //  o.instrmCode=
        }
        if (inputState === '0') {
          //  暂存
          const { data: ret } = yield call(saveApply, data);

          if (ret && ret.success) {
            yield put({ type: 'setState', payload: { dataApply: data } });
            yield put({ type: 'loadApply', payload: {} });

            notification.success({
              message: '提示',
              description: '暂存成功！',
            });
          } else {
            notification.error({
              message: '提示',
              description: `暂存失败！${ret.msg}`,
            });
          }
        } else {
          //  资产入库
          const { data: ret } = yield call(saveDirectIn, data);
          // console.info("删除", data);
          if (ret && ret.success) {
            yield put({ type: 'setState', payload: { dataApply: [] } });
            notification.success({
              message: '提示',
              description: '入库成功！',
            });
          } else {
            notification.error({
              message: '提示',
              description: '入库失败！' + `${ret.msg}`,
            });
          }
        }
      }
      yield put({ type: 'setState', payload: { spin: false } });
    },
    //  删除入库资产（移除一行）
    *deleteApply({ record }, { select, call, put }) {
      console.info('删除', record);
      _count--;
      if (record.id && record.id.length === 32) {
        yield put({ type: 'setState', payload: { spin: true } });
        const { data } = yield call(deleteApply, record.id);
        if (data && data.success) {
          yield put({ type: 'delete', matId: record.id });
        } else {
          notification.error({
            message: '提示',
            description: '删除失败！',
          });
          return;
        }
        yield put({ type: 'setState', payload: { spin: false } });
      } else {
        yield put({ type: 'delete', matId: record.rId });
      }
    },
    //  新建清空原纪录
    *newApply({ dataApply }, { select, call, put }) {
      let data = [];
      if (dataApply.length > 0) {
        for (let i = 0; i < dataApply.length; i++) {
          if (dataApply[i].id) {
            data.push(dataApply[i].id);
          }
        }
      }
      if (data && data.length > 0) {
        yield put({ type: 'setState', payload: { spin: true } });
        const { data: ret } = yield call(newApply, data);
        if (ret && ret.success) {
          yield put({ type: 'setState', payload: { dataApply: [] } });
        }
        yield put({ type: 'setState', payload: { spin: false } });
      } else {
        yield put({ type: 'setState', payload: { dataApply: [] } });
      }
    },

  },
  reducers: {
    init(state, { payload }) {
      const { data, page, deptId, hosId, userName, commonName } = (payload || {});
      const { result } = data || {};
      const newPage = page || {};
      const newDeptId = deptId || {};
      const newHosId = hosId || {};
      const newUserName = userName;
      const newCommonName = commonName || '';
      const newData = result || [];
      return { ...state, data: newData, page: newPage, deptId: newDeptId, hosId: newHosId, userName: newUserName, commonName: newCommonName };
    },
    initApply(state, { data }) {
      const { result } = data;
      const newData = result || [];
      return { ...state, dataApply: newData };
    },
    setState(state, { payload }) {
      return { ...state, ...payload };
    },
    delete(state, { matId }) {
      const { dataApply } = state;
      const index = dataApply.findIndex(value => value.rId === matId);
      dataApply.splice(index, 1);
      return {
        ...state,
        dataApply,
      };
    },
  },
};
