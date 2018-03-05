/**
 * 配置所有后台请求路径s
 */
import Global from '../Global';

export const base = () => ({
  img: `${Global.getHost()}base/images/view/`,
  sectionDescList: `${Global.getHost()}base/desc/list`,
  contactList: `${Global.getHost()}base/contact/list`,
  loadInpatientAreas: `${Global.getHost()}base/inpatientArea/list`,
  loadPatients: `${Global.getHost()}base/inpatientArea/patients`,
});

export const auth = () => ({
  login: `${Global.getHost()}app/login`,
  logout: `${Global.getHost()}app/logout`,
  resetPwd: `${Global.getHost()}app/resetPwd`,
  register: `${Global.getHost()}app/register`,
  doSave: `${Global.getHost()}app/doSave`,
  changePwd: `${Global.getHost()}app/changePwd`,
});

export const sample = () => ({
  list: `${Global.getHost()}app/sample/list`,
  page: `${Global.getHost()}app/sample/page`,
  create: `${Global.getHost()}app/sample/create`,
  update: `${Global.getHost()}app/sample/update`,
  remove: `${Global.getHost()}app/sample/remove`,
  removeSelected: `${Global.getHost()}app/sample/removeSelected`,
});

export const feedBack = () => ({
  submit: `${Global.getHost()}app/feedBack/create`,
});

export const images = () => ({
  page: `${Global.getHost()}base/images/list`,
  save: `${Global.getHost()}base/images/create`,
  update: `${Global.getHost()}base/images`,
  remove: `${Global.getHost()}base/images`,
  getInfo: `${Global.getHost()}base/images`,
  getByFkId: `${Global.getHost()}base/images/getByFkId`,
  view: `${Global.getHost()}base/images/view`,
  upload: `${Global.getHost()}base/images/upload`,
});

export const news = () => ({
  list: `${Global.getHost()}base/news/list`,
});

// 代办事项
export const todoList = () => ({
  page: `${Global.getHost()}todoList/page`,
  todo: `${Global.getHost()}todoList/todo`,
});

// 菜单
export const menu = () => ({
  list: `${Global.getHost()}base/menu/list`,
});

// 病区
export const inpatientArea = () => ({
});

// 床旁
export const sickbed = () => ({
  // 生命体征新建
  // sickbed/sign/get/{1111111}
  sign: `${Global.getHost()}sickbed/sign/get`,
  signPage: `${Global.getHost()}sickbed/sign/page`,
  testOrder: `${Global.getHost()}sickbed/testOrder/inpatientNo`, // 化验医嘱
  testOrderByBarcode: `${Global.getHost()}sickbed/testOrder/barcode`, // 根据条码取化验医嘱
  infusionOrder: `${Global.getHost()}sickbed/infusionOrder/inpatientNo`, // 输液医嘱
  infusionOrderByBarcode: `${Global.getHost()}sickbed/infusionOrder/barcode`, // 根据条码取输液医嘱
});
