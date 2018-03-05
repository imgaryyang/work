import { notification } from 'antd';
import { isObject, isArray, floor, isString } from 'lodash';
import { submitCharge, findChargeDetail, findRecipeList, getCurrentRegId, submitItemCharge, groupDetailList, saveItemToTemplate, getRecipeId, getDrugStock } from '../../services/finance/OptChargeService';
import { findCurrentInvoice } from '../../services/finance/InvoiceMngService';
import { loadRegInfoPage } from '../../services/appointment/RegisterService';
import { getPatientRegInfo } from '../../services/appointment/RegInfoService';
import { findChargePkgList } from '../../services/base/ChargePkgService';
import { doctorsInDept } from '../../services/base/UserService';

export default {
  namespace: 'outpatientCharge',
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
    deptDocList: [],
    regResult: {},
    payResult: {},
    form: {},
    tabName: '',
    isCheckBox: false,
  },
  effects: {
    /*
    加载收费详细信息
     */
    *loadChargeDetail({ recipes }, { select, call, put }) {
      const recipeList = yield select(state => state.outpatientCharge.recipeList);
      let recipeTmp = [];
      if (!recipes) {
        for (let i = 0; i < recipeList.length; i++) {
          if (isString(recipeList[i])) {
            recipeTmp.push(recipeList[i]);
          } else {
            recipeTmp.push(recipeList[i][0]);
          }
        }
      } else {
        recipeTmp = recipes;
      }
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(findChargeDetail, recipeTmp);
      yield put({ type: 'setState', payload: { spin: false } });
      if (data && data.success) {
        const { result } = data;
        const datatmp = result || [];
        let totCost = 0;
        for (let i = 0; i < datatmp.length; i++) {
          totCost += (datatmp[i].totCost);
        }
        yield put({ type: 'setState', payload: { data: datatmp, totCost, recipeIds: recipeTmp, isCheckBox: true } });
      }
    },
    /*
     获取发票信息
    */
    *getCurrentInvoice({ invoiceType }, { call, put }) {
      const { data } = yield call(findCurrentInvoice, invoiceType);
      if (data && data.success) {
        const { result } = data;
        const datatmp = result || [];
        yield put({ type: 'setState', payload: { invoiceUse: datatmp.invoiceUse } });
      } else {
        notification.info({ message: '提示信息：', description: '没有可用的发票，请先领用发票再进行操作！' });
      }
    },
    /*
     加载处方列表
    */
    *loadRecipe({ regId }, { call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });
      if (regId) {
        const { data } = yield call(findRecipeList, regId);
        yield put({ type: 'setState', payload: { spin: false } });
        if (data && data.success) {
          const { result } = data;
          const datatmp = result || [];
          yield put({ type: 'setState', payload: { recipeList: datatmp } });
          yield put({ type: 'loadChargeDetail' });
        }
      }
    },
    /*
    通过诊疗卡号获取挂号信息
    */
    *getCurrentRegId({ medicalCardNo }, { call, put }) {
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(getCurrentRegId, medicalCardNo);
      yield put({ type: 'setState', payload: { spin: false } });
      if (data && data.success) {
        const { result } = data;
        yield put({ type: 'getUserInfoByRegId', regId: result });
        yield put({ type: 'loadRecipe', regId: result });
      } else {
        notification.info({ message: '提示信息：', description: '不存在已看诊号别！' });
      }
    },
    /*
    通过挂号id获取用户基本信息
     */
    *getUserInfoByRegId({ regId }, { select, call, put }) {
      const userInfo = yield select(state => state.outpatientCharge.userInfo);
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
        yield put({ type: 'initUserInfo', payload: { userInfo: userInfoTmp } });
        if (userInfoTmp.recipeDept && userInfoTmp.recipeDept !== '') {
          yield put({ type: 'finDoctorsByDept', deptId: userInfoTmp.recipeDept });
        }
      } else {
        notification.info({ message: '提示信息：', description: '就诊号错误，请重新输入！' });
      }
    },
    /*
    右侧点击挂号信息加载信息
     */
    *clickPatient({ payload }, { put }) {
      const { record } = payload;
      if (record) {
        yield put({ type: 'getUserInfoByRegId', regId: record.id });
        yield put({ type: 'loadRecipe', regId: record.id });
      }
    },
    /*
    加载挂号信息列表
     */
    *loadRegInfoPage({ payload }, { select, call, put }) {
      let { page } = (payload || {});
      const defaultPage = yield select(state => state.outpatientCharge.page);
      page = { ...defaultPage, ...page };
      const { pageNo, pageSize } = page;
      const start = (pageNo - 1) * pageSize;
      yield put({ type: 'setState', payload: { spin: true } });
      const { data } = yield call(loadRegInfoPage, '2', start, pageSize, { flag: '1' });
      yield put({ type: 'setState', payload: { spin: false } });
      if (data) {
        yield put({ type: 'init', data, page });
      }
    },
    /*
    确认收费
     */
    *submitCharge({ subData }, { select, call, put }) {
      if (subData && subData.length > 0) {
        let userInfo = yield select(state => state.outpatientCharge.userInfo);
        const totCost = yield select(state => state.outpatientCharge.totCost);
        userInfo = { ...userInfo, totCost };
        const newSubData = subData.concat(userInfo);
        yield put({ type: 'setState', payload: { spin: true } });
        const { data } = yield call(submitCharge, newSubData);
        if (data && data.success) {
          /* 挂号 -> 收银台 */
          yield put({ type: 'payCounter/setState', payload: { payInfo: data.result, isVisible: true } });
          yield put({ type: 'setState', payload: { data: [], userInfo: {}, recipeList: [], totCost: '' } });
        }
        yield put({ type: 'setState', payload: { spin: false } });
      }
    },
    *subItem({ itemData }, { select, call, put }) {
      const subData = yield select(state => state.outpatientCharge.itemData);
      const user = yield select(state => state.outpatientCharge.userInfo);
      if (subData && subData.length > 0) {
        const regNo = user.regNo;
        const patientId = user.patientId;
        const regId = user.regId;
        const userInfo = {
          regNo,
          patientId,
          regId,
        };
        const newSubData = subData.concat(userInfo);
        yield put({ type: 'setState', payload: { spin: true } });
        const { data } = yield call(submitItemCharge, newSubData);
        if (data && data.success) {
          yield put({ type: 'loadRecipe', regId });
          yield put({ type: 'setState', payload: { itemData: [], tabName: 'outpatient', isCheckBox: false } });
        }
        yield put({ type: 'setState', payload: { spin: false } });
      }
    },
    *updateItem({ update }, { select, put }) {
      const tmpItem = yield select(state => state.outpatientCharge.tmpItem);
      const item = { ...tmpItem, ...update };
      yield put({ type: 'setState', payload: { tmpItem: item } });
    },
    /*
    更改用户信息
     */
    *updateUserInfo({ user }, { select, put }) {
      const userInfo = yield select(state => state.outpatientCharge.userInfo);
      const item = { ...userInfo, ...user };
      yield put({ type: 'setState', payload: { userInfo: item } });
    },
    *addCharge({ exeDept }, { select, call, put }) {
      const tmpItem = yield select(state => state.outpatientCharge.tmpItem);
      let itemData = yield select(state => state.outpatientCharge.itemData);
      const userInfo = yield select(state => state.outpatientCharge.userInfo);
      const currentRecipe = yield select(state => state.outpatientCharge.currentRecipe);
      if (userInfo === null || userInfo.regId === null || userInfo.regId === '') {
        notification.info({ message: '提示信息：', description: '请先填写用户信息！' });
      } else if (currentRecipe === '' || currentRecipe === null) {
        notification.info({ message: '提示信息：', description: '处方号不能为空！' });
      } else if (!isArray(tmpItem) && !(tmpItem && tmpItem.salePrice)) {
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
        } else if (tmpItem && tmpItem.salePrice) {
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
      const itemData = yield select(state => state.outpatientCharge.itemData);
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
      const itemData = yield select(state => state.outpatientCharge.itemData);
      let itemCost = 0;
      if (itemData && itemData.length > 0) {
        for (const index in itemData) {
          const item = itemData[index];
          if (item.salePrice !== '' && item.amount !== '') {
            itemCost += (item.salePrice * item.amount);
          }
        }
      }
      yield put({ type: 'setState', payload: { itemCost } });
    },
    *loadItemTemplate({ searchCode }, { call, put }) {
      const search = { shareLevel: 'all', comboName: searchCode };
      const { data } = yield call(findChargePkgList, search);
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
      const userInfo = yield select(state => state.outpatientCharge.userInfo);
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

    *saveItemToTemplate({ itemName }, { select, call, put }) {
      let itemData = yield select(state => state.outpatientCharge.itemData);
      const shareLevel = yield select(state => state.outpatientCharge.shareLevel);
      const templateName = yield select(state => state.outpatientCharge.templateName);
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
    *getRecipeId({ record }, { call, put }) {
      const { data } = yield call(getRecipeId);
      const { msg } = data;
      if (data && data.success) {
        yield put({
          type: 'setState',
          payload: {
            currentRecipe: msg,
          } });
      } else {
        notification.info({ message: '提示信息：', description: msg });
      }
    },
    *deleteItem({ record }, { select, put }) {
      const itemData = yield select(state => state.outpatientCharge.itemData);
      itemData.splice(itemData.indexOf(record), 1);
      const newData = [];
      for (const d of itemData) {
        newData.push(d);
      }
      yield put({
        type: 'setState',
        payload: {
          itemData: newData,
        } });
      yield put({
        type: 'calItemCost',
      });
    },
    *finDoctorsByDept({ deptId }, { call, put }) {
      const { data } = yield call(doctorsInDept, { deptId });
      const { result } = data;
      const deptDocList = result || [];
      yield put({
        type: 'setState',
        payload: {
          deptDocList,
        } });
    },
  },
  reducers: {
    init(state, { data, page }) {
      const { result, total } = data;
      const resData = result || [];
      const resPage = { ...state.page, ...page, total };
      return { ...state, pdata: resData, page: resPage };
    },

    initUserInfo(state, { payload }) {
      return { ...state, ...payload };
    },

    initTemplate(state, { data }) {
      const { result = result || [] } = data;
      let map = {}, tree = [];
      const levelName = { 1: '个人', 2: '科室', 3: '全院' };
      for (const tpl of result) {
        tpl.children = [];
        const shareLevel = tpl.shareLevel;
        let level = map[shareLevel];
        if (!level) {
          level = {
            shareLevel,
            comboName: levelName[shareLevel],
            children: [],
          };
          map[shareLevel] = level;
          tree.push(level);
        }
        level.children.push(tpl);
      }
      const tmpTree = tree || [];
      return {
        ...state,
        tmpTree,
      };
    },
    setState(oldState, { payload }) {
      return { ...oldState, ...payload };
    },
  },
};
