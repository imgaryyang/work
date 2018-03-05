/**
 * 配置所有后台请求路径s
 */
import Global from '../Global';
// import { del, get, post, put, form } from '../utils/Request';


/** ------------------APP业务---------------------**/
export const auth = () => ({
  login: `${Global.getHost()}app/login`,
  logout: `${Global.getHost()}app/logout`,
  resetPwd: `${Global.getHost()}app/resetPwd`,
  register: `${Global.getHost()}app/register`,
  doSave: `${Global.getHost()}app/doSave`,
  setPortrait: `${Global.getHost()}app/setPortrait`,
  changePwd: `${Global.getHost()}app/changePwd`,
});

export const hospital = () => ({
  page: `${Global.getHost()}treat/hospital/page`,
  get: `${Global.getHost()}treat/hospital/get`,
  nearest: `${Global.getHost()}treat/hospital/nearest`,
});

export const sample = () => ({
  list: `${Global.getHost()}app/sample/list`,
  page: `${Global.getHost()}app/sample/page`,
  create: `${Global.getHost()}app/sample/create`,
  update: `${Global.getHost()}app/sample/update`,
  remove: `${Global.getHost()}app/sample/remove`,
  removeSelected: `${Global.getHost()}app/sample/removeSelected`,
});

export const patient = () => ({
  list: `${Global.getHost()}app/userPatient/list`,
  page: `${Global.getHost()}app/userPatient/page`,
  create: `${Global.getHost()}app/userPatient/create`,
  update: `${Global.getHost()}app/userPatient/update`,
  remove: `${Global.getHost()}app/userPatient/remove`,
  removeSelected: `${Global.getHost()}app/userPatient/removeSelected`,
  getPatient: `${Global.getHost()}app/userPatient/getPatient`,
  addPatient: `${Global.getHost()}app/userPatient/addPatient`,
  loadCurrentPatient: `${Global.getHost()}app/userPatient/loadPatient`,
  queryProfile: `${Global.getHost()}app/userPatient/queryProfile`,
  setDefaultProfile: `${Global.getHost()}app/userPatient/setDefaultProfile`,
  identify: `${Global.getHost()}app/userPatient/identify`,
  getMyProfiles: `${Global.getHost()}app/userPatient/getMyProfiles`,
  setMyDefaultProfile: `${Global.getHost()}app/userPatient/setMyDefaultProfile`,
  addArchives: `${Global.getHost()}app/userPatient/addArchives`,
  updateUserPatients: `${Global.getHost()}app/userPatient/updateUserPatients`,
  getPreStore: `${Global.getHost()}treat/his/profile/info`,
  getPrePay: `${Global.getHost()}treat/his/inpatient/info`,
});


export const firstAid = () => ({
  listByKeyWords: `${Global.getHost()}app/emergency/listByKeyWords`,
  listFirstAidByType: `${Global.getHost()}app/emergency/listEmergencyByType`,
  loadSecondAidType: `${Global.getHost()}app/emergency/listDetailType`,
  loadFirstAidType: `${Global.getHost()}app/emergency/listEmergencyType`,
});

export const disease = () => ({
  listByKeyWords: `${Global.getHost()}app/disease/listByKeyWords`,
  listCommonDisease: `${Global.getHost()}app/disease/listCommonDisease`,
  listByPart: `${Global.getHost()}app/disease/listByPart`,
  listPart: `${Global.getHost()}app/disease/listPart`,
});

export const drug = () => ({
  listByKeyWords: `${Global.getHost()}app/drug/listByKeyWords`,
  listCommonDrugType: `${Global.getHost()}app/drug/listCommonDrugType`,
  listByDrugType: `${Global.getHost()}app/drug/listByDrugType`,
  listDrugByType: `${Global.getHost()}app/drug/listDrugByType`,
  listRescueDrug: `${Global.getHost()}app/drug/listRescueDrug`,
});

export const test = () => ({
  loadTestList: `${Global.getHost()}app/laboratory/listLaboratoryByType`,
  listByKeyWords: `${Global.getHost()}app/laboratory/listByKeyWords`,
  loadTestType: `${Global.getHost()}app/laboratory/listFirstLevelTest`,
  loadSecondTestType: `${Global.getHost()}app/laboratory/listSecondLevelTest`,
});

export const vaccine = () => ({
  listByKeyWords: `${Global.getHost()}app/vaccine/listByKeyWords`,
  loadAll: `${Global.getHost()}app/vaccine/listAll`,
  listRecent: `${Global.getHost()}app/vaccine/listRecent`,
});

export const feedBack = () => ({
  submit: `${Global.getHost()}app/feedBack/create`,
});

export const app = () => ({
  info: `${Global.getHost()}app/base`,
});

/** ------------------HIS业务---------------------**/
export const medicalCheck = () => ({
  loadCheckList: `${Global.getHost()}treat/medicalCheck/loadCheckList`,
  loadCheckDetail: `${Global.getHost()}treat/medicalCheck/loadCheckDetail`,
  loadHisCheckList: `${Global.getHost()}treat/medicalCheck/loadHisCheckList`,
  loadHisCheckDetail: `${Global.getHost()}treat/medicalCheck/loadHisCheckDetail`,

});

export const consultRecord = () => ({
  list: `${Global.getHost()}treat/consultRecord/list`,
  page: `${Global.getHost()}treat/consultRecord/page`,
  create: `${Global.getHost()}treat/consultRecord/create`,
  complete: `${Global.getHost()}treat/consultRecord/complete`,
  reply: `${Global.getHost()}treat/consultRecord/reply`,
  remove: `${Global.getHost()}treat/consultRecord/remove`,
  removeSelected: `${Global.getHost()}treat/consultRecord/removeSelected`,
});

export const dept = () => ({
  select: `${Global.getHost()}treat/department/select`,
});

export const doctor = () => ({
  listByDept: `${Global.getHost()}treat/doctor/listByDept`,
  listByHospital: `${Global.getHost()}treat/doctor/listByHospital`,
});


export const records = () => ({
  list: `${Global.getHost()}treat/his/activity/list`,
  diagnoseList: `${Global.getHost()}treat/his/activity/diagnoseList`,
  recordDrugList: `${Global.getHost()}treat/his/activity/recordDrugList`,
  recordTestList: `${Global.getHost()}treat/his/activity/recordTestList`,
  recordList: `${Global.getHost()}treat/his/activity/recordList`,
});

export const payRecords = () => ({
  getPreRecords: `${Global.getHost()}treat/his/deposit/list`,
  getConsumeRecords: `${Global.getHost()}treat/his/charge/list`,
});

// 排班
export const schedule = () => ({
  // 3.4.9 排班列表查询
  list: `${Global.getHost()}treat/his/schedule/list`,
});

// 预约挂号
export const appoint = () => ({
  // 3.4.1 可预约科室分类树查询
  deptTree: `${Global.getHost()}treat/appoint/deptTree`,
  // 3.4.2 可预约科室列表查询
  deptList: `${Global.getHost()}treat/his/appoint/deptList`,
  // 3.4.5 患者预约
  reserve: `${Global.getHost()}treat/his/appoint/reserve`,
  // 3.4.7 患者签到
  sign: `${Global.getHost()}treat/his/appoint/sign`,
  // 3.4.8 患者取消
  cancel: `${Global.getHost()}treat/his/appoint/cancel`,
  // 3.4.10 排班号源列表查询
  list: `${Global.getHost()}treat/his/appoint/list`,
  // 3.4.11 患者预约记录查询
  reservedList: `${Global.getHost()}treat/his/appoint/reserved/list`,
});

/** --------------------缴费------------------- */
export const patientPayment = () => ({
  patientPaymentList: `${Global.getHost()}treat/his/chargeDetail/list`,
  getPrePaymentInfo: `${Global.getHost()}treat/charge/prePayInfo`,
});


/** ------------------支付业务---------------------**/
export const alipay = () => ({
  createBill: `${Global.getHost()}pay/createBill`,
  createSettlement: `${Global.getHost()}pay/prePay`,
  payResult: `${Global.getHost()}pay/aliPay/payResult`,
  create: `${Global.getHost()}pay/aliPay/create`,
  update: `${Global.getHost()}pay/aliPay/update`,
  remove: `${Global.getHost()}pay/aliPay/remove`,
});

export const wxpay = () => ({
  createBill: `${Global.getHost()}pay/createBill`,
  createSettlement: `${Global.getHost()}pay/create/createSettlement`,
});


/** ------------------基础服务---------------------**/
export const base = () => ({
  img: `${Global.getHost()}base/images/view/`,
  imgByFK: `${Global.getHost()}base/images/viewByFkId/`,
  sectionDescPage: `${Global.getHost()}base/desc/page`,
  contactPage: `${Global.getHost()}base/contact/page`,
});

export const images = () => ({
  page: `${Global.getHost()}base/images/page`,
  list: `${Global.getHost()}base/images/list`,
  save: `${Global.getHost()}base/images`,
  update: `${Global.getHost()}base/images`,
  remove: `${Global.getHost()}base/images`,
  getInfo: `${Global.getHost()}base/images`,
  getByFkId: `${Global.getHost()}base/images`,
  view: `${Global.getHost()}base/images/view`,
  upload: `${Global.getHost()}base/images/upload`,
});

export const news = () => ({
  page: `${Global.getHost()}base/news/page`,
});

export const message = () => ({
  page: `${Global.getHost()}base/notice/page`,
  list: `${Global.getHost()}base/notice/list`,
  read: `${Global.getHost()}base/notice/read`,
  remove: `${Global.getHost()}base/notice`,
  removeSelected: `${Global.getHost()}base/notice/removeSelected`,
});

/** ------------------智能导诊---------------------**/
export const guide = () => ({
  unfinished: `${Global.getHost()}treat/unfinished`, // 取进行中的就诊记录（门诊及住院）
  guidance: `${Global.getHost()}treat/guidance`, // 根据就诊号或住院号取引导信息
});

