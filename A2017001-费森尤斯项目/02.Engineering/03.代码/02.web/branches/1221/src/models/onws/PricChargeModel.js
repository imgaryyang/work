import { notification } from 'antd';
import { isObject, isArray, floor } from 'lodash';
import { submitCharge, getCurrentRegId, getRecipeId, submitItemCharge, groupDetailList, saveItemToTemplate, saveCharge, getDrugStock } from '../../services/finance/OptChargeService';
import { findCurrentInvoice } from '../../services/finance/InvoiceMngService';
import { loadRegInfoPage } from '../../services/appointment/RegisterService';
import { getPatientRegInfo } from '../../services/appointment/RegInfoService';
import { findChargePkgList } from '../../services/base/ChargePkgService';
import { doctorsInDept } from '../../services/base/UserService';

export default {
  namespace: 'pricCharge',
  state: {
    query: {},
    data: [],
    pdata: [],
    itemData: [],
    tmpItem: [],
    itemInfo: [],
    record: '',
    userInfo: {
      medicalCardNo: '',
      regId: '',
      regNo: '',
      patientId: '',
      name: '',
      sex: '',
      age: '',
      birth: '',
      recipeDept: '',
      recipeDocId: '',
      recipeDocName: '',
      payType: '',
      feeType: '',
    },
    page: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    tabType: '2',
    invoiceUse: '',
    totCost: '',
    itemCost: '',
    recipeList: [],
    spin: false,
    tmpTree: [],
    shareLevel: '',
    templateName: '',
    currentRecipe: '',
    deptDocList: '',
    regResult: {},
    payResult: {},
    form: {},
  },
  effects: {
    *getCurrentInvoice({ invoiceType }, { call, put }) {
      const { data } = yield call(findCurrentInvoice, invoiceType);
      if (data && data.success) {
        const { result } = data;
        const datatmp = result || [];
        yield put({ type: 'setState', payload: { invoiceUse: datatmp } });
      }
    },
    *getCurrentRegId({ medicalCardNo }, { call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(getCurrentRegId, medicalCardNo);
      yield put({ type: 'setState', payload: { spin: false } });
      if (data && data.success) {
        const { result } = data;
        yield put({ type: 'getUserInfoByRegId', regId: result });
      } else {
        notification.info({ message: '提示信息：', description: '用户未挂号！' });
      }
    },

    *getUserInfoByRegId({ regId }, { select, call, put }) {
      const userInfo = yield select(state => state.pricCharge.userInfo);
      const { data } = yield call(getPatientRegInfo, regId);
      yield put({ type: 'setState', payload: { spin: false } });
      if (data && data.success) {
        const { result } = data;
        const regInfo = result || '';
        const userInfoTmp = {
          ...userInfo,
          ...{
            regId: regInfo.id,
            regNo: regInfo.regId,
            patientId: regInfo.patient ? regInfo.patient.id : '',
            recipeDept: regInfo.seeDept ? regInfo.seeDept.id : regInfo.regDept ? regInfo.regDept.id : '',
            recipeDocId: regInfo.seeDoc ? regInfo.seeDoc.id : regInfo.regDoc ? regInfo.regDoc.id : '',
            recipeDocName: regInfo.seeDoc ? regInfo.seeDoc.name : regInfo.regDoc ? regInfo.regDoc.name : '',
            payType: regInfo.payType,
            name: regInfo.patient ? regInfo.patient.name : '',
            sex: regInfo.patient ? regInfo.patient.sex : '',
            feeType: regInfo.feeType,
            birth: regInfo.patient ? regInfo.patient.birthday : '',
            medicalCardNo: regInfo.patient ? regInfo.patient.medicalCardNo : '',
          },
        };
        yield put({ type: 'setState', payload: { userInfo: userInfoTmp } });
        if (userInfoTmp.recipeDept && userInfoTmp.recipeDept !== '') {
          yield put({ type: 'finDoctorsByDept', deptId: userInfoTmp.recipeDept });
        }
      } else {
        notification.info({ message: '提示信息：', description: '就诊号错误，请重新输入！' });
      }
    },

    *loadRegInfoPage({ payload }, { select, call, put }) {
      let { page } = (payload || {});
      const defaultPage = yield select(state => state.pricCharge.page);
      page = { ...defaultPage, ...page };
      const { pageNo, pageSize } = page;
      const start = (pageNo - 1) * pageSize;
      yield put({ type: 'toggleSpin' });
      const { data } = yield call(loadRegInfoPage, '2', start, pageSize, { flag: '1' });
      yield put({ type: 'toggleSpin' });
      if (data) {
        yield put({ type: 'init', data, page });
      }
    },
    *submitCharge({ subData }, { select, call, put }) {
      if (subData && subData.length > 0) {
        const userInfo = yield select(state => state.pricCharge.userInfo);
        const newSubData = subData.concat(userInfo);
        yield put({ type: 'setState', payload: { spin: true } });
        const { data } = yield call(submitCharge, newSubData);
        if (data && data.success) {
          yield put({ type: 'setState', payload: { data: [] } });
        }
        yield put({ type: 'setState', payload: { spin: false } });
      }
    },

    *subItem({ sub }, { select, call, put }) {
      const subData = yield select(state => state.pricCharge.itemData);
      if (subData && subData.length > 0) {
        const regNo = yield select(state => state.pricCharge.userInfo.regNo);
        const patientId = yield select(state => state.pricCharge.userInfo.patientId);
        const regId = yield select(state => state.pricCharge.userInfo.regId);
        const userInfo = {
          regNo,
          patientId,
          regId,
        };
        const newSubData = subData.concat(userInfo);
        yield put({ type: 'setState', payload: { spin: true } });
        const { data } = yield call(submitItemCharge, newSubData);
        if (data && data.success) {
          yield put({
            type: 'setState',
            payload: {
              userInfo: {},
              tmpItem: [],
              itemCost: 0.00,
              itemData: [],
              record: 'clear',
              currentRecipe: '',
            } });
          notification.info({ message: '提示信息：', description: '划价成功！' });
        }
        yield put({ type: 'setState', payload: { spin: false } });
      }
    },
    *saveCharge({ subData }, { select, call, put }) {
      const itemData = yield select(state => state.pricCharge.itemData);
      if (itemData && itemData.length > 0) {
        const regNo = yield select(state => state.pricCharge.userInfo.regNo);
        const patientId = yield select(state => state.pricCharge.userInfo.patientId);
        const regId = yield select(state => state.pricCharge.userInfo.regId);
        const itemCost = yield select(state => state.pricCharge.itemCost);
        const userInfo = {
          regNo,
          patientId,
          regId,
          itemCost,
        };
        const newSubData = itemData.concat(userInfo);
        yield put({ type: 'setState', payload: { spin: true } });
        const { data } = yield call(saveCharge, newSubData);
        if (data && data.success) {
          notification.info({ message: '提示信息：', description: '划价成功！' });
        } else {
          notification.info({ message: '提示信息：', description: '数据通讯超时，请稍后重试！' });
        }
        yield put({ type: 'setState', payload: { spin: false } });
      } else {
        notification.info({ message: '提示信息：', description: '没有需要提交的数据' });
      }
    },

    *updateItem({ update }, { select, put }) {
      const tmpItem = yield select(state => state.pricCharge.tmpItem);
      const item = { ...tmpItem, ...update };
      yield put({ type: 'setState', payload: { tmpItem: item } });
    },
    /*
    更新用户中的信息
     */
    *updateUserInfo({ user }, { select, put }) {
      const userInfo = yield select(state => state.pricCharge.userInfo);
      const item = { ...userInfo, ...user };
      yield put({ type: 'setState', payload: { userInfo: item } });
    },

    *addCharge({ exeDept }, { select, call, put }) {
      const tmpItem = yield select(state => state.pricCharge.tmpItem);
      let itemData = yield select(state => state.pricCharge.itemData);
      const userInfo = yield select(state => state.pricCharge.userInfo);
      const currentRecipe = yield select(state => state.pricCharge.currentRecipe);
      if (userInfo === null || userInfo.regId === null || userInfo.regId === '') {
        notification.info({ message: '提示信息：', description: '请先填写用户信息！' });
      } else if (currentRecipe === '' || currentRecipe === null) {
        notification.info({ message: '提示信息：', description: '处方号不能为空！' });
      } else if (!isArray(tmpItem) && (!(tmpItem && tmpItem.salePrice))) {
        notification.info({ message: '提示信息：', description: '项目信息不能为空，请重新填写！' });
      } else {
        if (isArray(tmpItem)) {
          for (const item of tmpItem) {
            item.recipeId = currentRecipe;
            item.recipeDoc = userInfo.recipeDocId;
            item.recipeDept = userInfo.recipeDept;
            item.feeType = userInfo.feeType;
            if (item.amount === 0) {
              item.amount = 1;
            }
            itemData = itemData.concat(item);
          }
          yield put({ type: 'setState', payload: { itemData, tmpItem: [] } });
          yield put({ type: 'calItemCost' });
        } else if (exeDept && tmpItem.id) {
          const { data } = yield call(getDrugStock, { exeDept, drugId: tmpItem.id });
          if ((data && data.success) || tmpItem.itemFlag === '0') {
            const { result } = data;
            const stock = result || {};
            if ((stock !== 0 && floor(stock / tmpItem.packQty) >= tmpItem.amount) || tmpItem.itemFlag === '0') {
              tmpItem.recipeId = currentRecipe;
              tmpItem.recipeDoc = userInfo.recipeDocId;
              tmpItem.recipeDept = userInfo.recipeDept;
              tmpItem.feeType = userInfo.feeType;
              if (tmpItem.amount === 0) {
                tmpItem.amount = 1;
              }
              itemData = itemData.concat(tmpItem);
              yield put({ type: 'setState', payload: { itemData, tmpItem: [] } });
              yield put({ type: 'calItemCost' });
            } else {
              notification.info({ message: '提示信息：', description: '执行科室库存不足，请调整！' });
            }
          } else {
            notification.info({ message: '提示信息：', description: data.msg });
          }
        }
      }
    },
    *tmpItem({ addData }, { select, put }) {
      const itemData = yield select(state => state.pricCharge.itemData);
      if (isObject(addData)) {
        if (itemData && itemData.length > 0) {
          const lastItem = itemData[itemData.length - 1];
          if (lastItem.itemFlag !== addData.itemFlag) {
            yield put({ type: 'getRecipeId' });
          }
        }
        yield put({
          type: 'setState',
          payload: {
            tmpItem: addData,
          },
        });
      }
    },
    *initShareLevel({ shareLevel }, { put }) {
      if (shareLevel) {
        yield put({
          type: 'setState',
          payload: {
            shareLevel,
          },
        });
      }
    },
    *calItemCost({ addData }, { select, put }) {
      const itemData = yield select(state => state.pricCharge.itemData);
      let itemCost = 0;
      if (itemData && itemData.length > 0) {
        for (const index in itemData) {
          if ({}.hasOwnProperty.call(itemData, index)) {
            const item = itemData[index];
            if (item.salePrice !== '' && item.amount !== '') {
              itemCost += (item.salePrice * item.amount);
            }
          }
        }
      }
      yield put({ type: 'setState', payload: { itemCost } });
    },
    *loadItemTemplate({ searchCode }, { call, put }) {
      const { data } = yield call(findChargePkgList, { shareLevel: 'all', comboName: searchCode });
      if (data && data.success) {
        const { result } = data;
        const datatmp = result || [];
        yield put({
          type: 'setState',
          payload: { tmpTree: datatmp },
        });
      }
    },

    *addItemByItemId({ comboId }, { select, call, put }) {
      const userInfo = yield select(state => state.pricCharge.userInfo);
      if (userInfo === null || userInfo.regId === null || userInfo.regId === '') {
        notification.info({ message: '提示信息：', description: '请先填写用户信息！' });
      } else if (userInfo === null || userInfo.recipeDept === null || userInfo.recipeDept === '') {
        notification.info({ message: '提示信息：', description: '请选择开单科室后添加！' });
      } else if (userInfo === null || userInfo.recipeDocId === null || userInfo.recipeDocId === '') {
        notification.info({ message: '提示信息：', description: '请选择开单医生！' });
      } else {
        const { data } = yield call(groupDetailList, comboId);
        if (data && data.success) {
          const { result } = data;
          yield put({
            type: 'tmpItem',
            addData: result,
          });
          yield put({ type: 'addCharge' });
        }
      }
    },
    /*
    通过科室查询该科室医生信息
     */
    *finDoctorsByDept({ deptId }, { call, put }) {
      const { data } = yield call(doctorsInDept, { deptId });
      const { result } = data;
      const deptDocList = result || [];
      yield put({
        type: 'setState',
        payload: {
          deptDocList,
        },
      });
    },

    *saveItemToTemplate({ itemName }, { select, call, put }) {
      let itemData = yield select(state => state.pricCharge.itemData);
      const shareLevel = yield select(state => state.pricCharge.shareLevel);
      const templateName = yield select(state => state.pricCharge.templateName);
      const itemInfo = { comboName: templateName, shareLevel };
      if (itemData && itemData.length > 0) {
        itemData = itemData.concat(itemInfo);
        const { data } = yield call(saveItemToTemplate, itemData);
        if (data && data.success) {
          yield put({ type: 'setState',
            payload: { record: '1' },
          });
          yield put({ type: 'loadItemTemplate' });
        }
      } else {
        notification.info({ message: '提示信息：', description: '没有项目信息，不能进行保存！' });
      }
    },
    *deleteItem({ record }, { select, put }) {
      const itemData = yield select(state => state.pricCharge.itemData);
      itemData.splice(itemData.indexOf(record), 1);
      const newData = [];
      for (const d of itemData) {
        newData.push(d);
      }
      yield put({
        type: 'setState',
        payload: {
          itemData: newData,
        },
      });
      yield put({
        type: 'calItemCost',
      });
    },
    /*
    获取处方号
     */
    *getRecipeId({ record }, { call, put }) {
      const { data } = yield call(getRecipeId);
      if (data && data.success) {
        const { msg } = data;
        yield put({
          type: 'setState',
          payload: {
            currentRecipe: msg,
          },
        });
      } else {
        notification.info({ message: '提示信息：', description: '获取处方号失败！' });
      }
    },
  },
  reducers: {
    init(state, { data, page, userInfo }) {
      const { result, total } = data;
      const resData = result || [];
      const resPage = { ...state.page, ...page, total };
      return { ...state, pdata: resData, page: resPage, userInfo };
    },

    setState(oldState, { payload }) {
      return { ...oldState, ...payload };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/charge/pricChargeMain') {
          dispatch({
            type: 'loadItemTemplate',
          });
          dispatch({
            type: 'utils/initDicts',
            payload: ['PAY_TYPE'],
          });
        }
      });
    },
  },
};
