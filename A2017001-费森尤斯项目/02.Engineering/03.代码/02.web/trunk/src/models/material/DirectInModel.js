import dva from 'dva';
import moment from 'moment';
import { notification } from 'antd';
import { saveDirectIn, loadSearchBar, loadApply, saveApply, newApply, deleteApply, loadCompany } from '../../services/material/DirectInService';
import { getOptions } from '../../services/UtilsService';
import * as materialInfoService from '../../services/material/MaterialInfoService';

var menu = [];
export default {
  namespace: 'materialDirectIn',
  state: {
    data: [], // 物资信息
    dataApply: [], // 直接入库物资信息
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
    // 查询物资（左边点击查询按钮操作）
    * load({ payload }, { select, call, put }) {
      var { page, query } = (payload || {});
      var { deptId, hosId, userName, commonName } = (query || {});
      //
      var defaultPage = yield select(state => state.materialDirectIn.page);
      var newPage = {...defaultPage, ...page };

      var { pageNo, pageSize } = newPage;
      var start = (pageNo - 1) * pageSize;

      const defaultQuery = yield select(state => state.materialDirectIn.query);
      yield put({ type: 'setState', payload: { spin: true } });

      // 调用 service
      const { data } = yield call(materialInfoService.loadMaterialInfoPage,
        start, pageSize, query
      );

      //
      yield put({ type: 'setState', payload: { spin: false } });

      if (data) {
        newPage.total = data.total;
        yield put({
          type: 'init',
          payload: {
            data: data,
            page: newPage,
            deptId: deptId,
            hosId: hosId,
            userName: userName,
            commonName: commonName
          }
        })
      }
    },
    //直接入库searchBar查询
    * loadSearchBar({ payload }, { select, call, put }) {
      const { query } = (payload || {});
      const defaultQuery = yield select(state => state.materialDirectIn.query);
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(loadSearchBar, query || defaultQuery); //改为查询入库表
      yield put({ type: 'setState', payload: { spin: false } });

      if (data) {
        yield put({
          type: 'initApply',
          data: data,
        })
      }
    },
    // 查询操作员直接入库暂存记录
    * loadApply({ payload }, { select, call, put }) {
      const { user } = yield select(state => state.base);
      const query = {
        createOper: user.name || null,
        hosId: user.hosId || null,
        inputState: '0',
      }
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(loadApply, query);

      const { data: dataCompany } = yield call(loadCompany);
      let companyInfo = [];
      if (dataCompany && dataCompany.success) {
        const { result: resultCompany } = dataCompany;
        for (let j = 0; j < resultCompany.length; j++) {
          companyInfo.push({
            id: resultCompany[j].id,
            name: (resultCompany[j] ? resultCompany[j].companyName : ''),
          });
        }
      } else {
        // todo
      }
      yield put({ type: 'setState', payload: { companyInfo: companyInfo } });
      let dataApply = [];
      let company = '';
      if (data && data.success) {
        if (data.result && data.result.length > 0) {
          const { result } = data;
          company = (result[0].companyInfo || {}).id || '';
          //

          for (let i = 0; i < result.length; i++) {

            dataApply.push({
              tradeName: result[i].tradeName,
              materialSpecs: result[i].materialSpecs,
              producer: result[i].producer,
              producerName: result[i].matInfo ? (result[i].matInfo.companyInfo ? result[i].matInfo.companyInfo.companyName : '') : '',
              salePrice: result[i].salePrice,
              minUnit: result[i].minUnit,
              matInfo: result[i].matInfo,
              inBill: result[i].inBill,
              inState: result[i].inState,
              materialUnit: result[i].matInfo.materialUnit,
              inSum: result[i].inSum,
              saleCost: result[i].saleCost,
              approvalNo: result[i].approvalNo,
              id: result[i].id,
              deptId: result[i].deptId,
              hosId: result[i].hosId,
              inOper: result[i].inOper,
              inTime: data.result[i].inTime,
              validDate: result[i].validDate,
              produceDate: result[i].produceDate,
              buyPrice: result[i].buyPrice, //采购价
              salePrice: result[i].salePrice, //零售价
              materialCode: result[i].materialCode,
              materialType: result[i].materialType,
              buyCost: result[i].buyCost,
              stopFlag: result[i].stopFlag
            });
          }
        }
      }
      yield put({ type: 'setState', payload: { dataApply: dataApply, company: company } });
      yield put({ type: 'setState', payload: { spin: false } });
    },

    // 增加入库物资（向右边添加一行）
    * forAddApply({ record }, { select, call, put }) {
      const { user } = yield select(state => state.base);

      // 获取物资信息
      const data = record || {};
      const { dataApply } = yield select(state => state.materialDirectIn);

      const { deptId, hosId, userName } = yield select(state => state.materialDirectIn);
      if (data.stopFlag == '1') {
        if (dataApply.length > 0) {
          // 不重复的物资并且同一个库房
          if (!dataApply.find(value => value.matInfo.id == (data.id).trim())) {
            dataApply.push({
              tradeName: data.commonName,
              materialSpecs: data.materialSpecs,
              producer: data && data.companyInfo ? data.companyInfo.id : '',
              producerName: data && data.companyInfo ? data.companyInfo.companyName : '',
              "companyInfo.id": '',
              salePrice: data.salePrice,
              minUnit: data.materialUnit,
              materialUnit: data.materialUnit,
              matInfo: { id: data.id ? (data.id).trim() : '' },
              inBill: dataApply[0].inBill,
              inputState: null,
              inSum: 0.00,
              saleCost: 0,
              approvalNo: '-',
              deptId: user.loginDepartment.id,
              hosId: user.hosId,
              inOper: userName,
              inTime: data.creatTime,
              produceDate: data.creatTime, //界面手输生产日期
              validDate: data.creatTime, //界面手输有效日期
              buyPrice: data.buyPrice, //采购价
              salePrice: data.salePrice, //零售价
              materialType: data.materialType,
              materialCode: data.materialCode,
              buyCost: data.buyPrice,
              stopFlag: data.stopFlag
            });
          } else {
            notification.error({
              message: '提示',
              description: '该物资已选择！',
            });
          }
        } else {
          dataApply.push({
            tradeName: data.commonName,
            materialSpecs: data.materialSpecs,
            producerName: data && data.companyInfo ? data.companyInfo.companyName : '',
            producer: data && data.companyInfo ? data.companyInfo.id : '',
            "companyInfo.id": '',
            salePrice: data.salePrice,
            minUnit: data.materialUnit,
            materialUnit: data.materialUnit,
            matInfo: { id: (data.id).trim() },
            inBill: null,
            inputState: null,
            inSum: 0.00,
            saleCost: 0,
            approvalNo: '-',
            deptId: user.loginDepartment.id,
            hosId: user.hosId,
            inOper: userName,
            inTime: data.creatTime,
            produceDate: data.creatTime, //界面手输生产日期
            validDate: data.creatTime, //界面手输有效日期
            buyPrice: data.buyPrice, //采购价
            salePrice: data.salePrice, //零售价
            materialType: data.materialType,
            materialCode: data.materialCode,
            buyCost: data.buyPrice,
            stopFlag: data.stopFlag
          });
        }
      } else {
        notification.error({
          message: '提示',
          description: '选择的物资已停用！',
        });
      }
      yield put({ type: 'setState', payload: { dataApply: dataApply } })
    },
    // 保存或者暂存直接入库
    * saveDirectIn({ inputState }, { select, call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });
      const data = yield select(state => state.materialDirectIn.dataApply);
      const company = yield select(state => state.materialDirectIn.company)
        //
      if (data && data.length > 0) {
        for (let o of data) {
          o.inputState = inputState;
          o.inType = 'I3';
          o.plusMinus = '1';
          o.buyCost = o.buyPrice * o.inSum;
          //	    			o.batchNo = '1';//批次默认
          o.companyInfo = { id: company };
          //	    			o.approvalNo = '1';//批号得界面手输
          //	    			o.produceDate = moment().format('YYYY-MM-DD');//生产日期得界面手输
          //	    			o.validDate = moment().format('YYYY-MM-DD');//有效日期得界面手输
          //	    			o.inSum = 1.0;//入库数量
          o.inTime = moment().format('YYYY-MM-DD');
          //	    			o.saleCost = o.inSum * o.salePrice;//入库金额
        }
        if (inputState == '0') {
          // 暂存
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
              description: '暂存失败！' + `${ret.msg}`,
            });
          }
        } else {
          // 物资入库
          const { data: ret } = yield call(saveDirectIn, data);
          //
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
    // 删除入库物资（移除一行）
    * deleteApply({ record }, { select, call, put }) {

      if (record.id) {
        yield put({ type: 'setState', payload: { spin: true } });
        const { data } = yield call(deleteApply, record.id);
        if (data && data.success) {
          yield put({ type: 'delete', matId: record.matInfo.id });
        } else {
          notification.error({
            message: '提示',
            description: '删除失败！',
          });
          return;
        }
        yield put({ type: 'setState', payload: { spin: false } });
      } else {
        yield put({ type: 'delete', matId: record.matInfo.id });
      }

    },
    // 新建清空原纪录
    * newApply({ dataApply }, { select, call, put }) {
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
    "init" (state, { payload }) {
      var { data, page, deptId, hosId, userName, commonName } = (payload || {});

      var { result } = data || {};
      var newPage = page || {};
      var deptId = deptId || {};
      var hosId = hosId || {};
      var userName = userName;
      var commonName = commonName || '';
      var data = result || [];
      return {...state, data: data, page: newPage, deptId: deptId, hosId: hosId, userName: userName, commonName: commonName, };
    },
    "initApply" (state, { data }) {
      var { result } = data;
      var data = result || [];
      return {...state, dataApply: data };
    },
    "setState" (state, { payload }) {

      return {...state, ...payload }
    },
    "delete" (state, { matId }) {
      const { dataApply } = state;

      const index = dataApply.findIndex(value => value.matInfo.id == matId);
      dataApply.splice(index, 1);
      return {
        ...state,
        dataApply,
      };
    },
  },
};
//&&dataApply.find( value=>value.deptId == deptId )
