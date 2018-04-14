// 是否是数组且长度不为0
export function isValidArray(array) {
  return Array.isArray(array) && array.length;
}

export function action(type, payload) {
  return { type, payload };
}

export function save(payload) {
  return { type: 'save', payload };
}

export const { clientWidth, clientHeight } = document.documentElement;
// 兼容标准模式和混合模式
// export clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
// export clientWidth = document.documentElement.clientWidth || document.body.clientWidth;

// 初始page
export const initPage = { start: 0, limit: 20, total: 0 };
export const navBarHeight = 45;

export const guid = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  // return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};

// 常用颜色
export const colors = {
  NAV_BAR_LINE: '#96969A', // 'rgba(204,204,204,1)', // '#CCCCCC',
  NAV_BAR_BG: 'rgba(68,92,149,1)', // '#445C95',
  NAV_TITLE_TEXT: 'rgba(0,0,0,1)', // '#000000',
  NAV_BACK_TEXT: 'rgba(146,146,146,1)', // '#929292',
  NAV_BACK_ICON: 'rgba(146,146,146,1)', // '#929292',
  NAV_BTN: 'rgba(0,122,255,1)', // '#007AFF',

  TAB_BAR_LINE: 'rgba(204,204,204,1)', // '#CCCCCC',
  TAB_BAR_BG: 'rgba(255,255,255,1)', // '#FFFFFF',
  TAB_BTN: 'rgba(146,146,146,1)', // '#929292',
  TAB_BTN_ACTIVE: 'rgba(0,122,255,1)', // '#007AFF',

  FONT: 'rgba(0,0,0,1)', // '#000000', 工作区主字体颜色：（黑）
  FONT_GRAY: 'rgba(93,93,93,1)', // '#5D5D5D', 工作区主字体颜色：（深）
  FONT_LIGHT_GRAY: 'rgba(130,130,130,1)', // '#828282', 工作区主字体颜色：（浅）
  FONT_LIGHT_GRAY1: 'rgba(187,187,187,1)', // '#BBBBBB', 工作区主字体颜色：（更浅）
  LINE: 'rgba(230,230,230,1)', // '#E6E6E6', 工作区分割线颜色
  VIEW_BG: '#f8f7fd', // 'rgba(227,227,230,1)', //'#E3E3E6', 工作区背景色

  IOS_BLUE: 'rgba(0,122,255,1)', // '#007AFF', 苹果蓝色
  IOS_RED: 'rgba(255,59,48,1)', // '#FF3B30', 苹果红色
  IOS_GREEN: 'rgba(76,217,100,1)', // '#4CD964', 苹果浅绿
  IOS_YELLOW: 'rgba(255,225,0,1)', // '#FFE100', 苹果黄色
  IOS_DARK_GRAY: 'rgba(146,146,146,1)', // '#929292', 苹果深灰
  IOS_LIGHT_GRAY: 'rgba(200,199,204,1)', // '#C8C7CC', 苹果浅灰
  IOS_GRAY_BG: 'rgba(248,248,248,1)', // '#F8F8F8', 苹果浅灰底色

  IOS_NAV_BG: 'rgba(245,245,247,1)', // #f5f5f7 苹果导航栏底色
  IOS_NAV_LINE: 'rgba(167,167,170,1)', // #a7a7aa 苹果导航栏线条
  IOS_BG: 'rgba(239,239,244,1)', // #efeff4 苹果经典背景色
  IOS_SEP_LINE: '#dcdce1', // 'rgba(200,199,204,1)',  //#c8c7cc 苹果工作区分割线颜色
  IOS_ARROW: 'rgba(199,199,204,1)', // #c7c7cc 苹果箭头颜色
  IOS_GRAY_FONT: 'rgba(142,142,147,1)', // #8e8e93 苹果灰色字体颜色
  IOS_SEARCH_BG: 'rgba(202,201,207,1)', // #cac9cf 搜索框背景颜色

  ORANGE: 'rgba(255,102,0,1)', // '#FF6600',
  BROWN: 'rgba(102,51,0,1)', // '#663300',
  PURPLE: 'rgba(102,0,102,1)', // '#660066',
};

// 测试数据1
export const testAppointItem = {
  address: '1号楼1诊室',
  appChannel: ' ',
  appUser: '',
  appointTime: '2018-02-08 11:05:21',
  cardId: null,
  cardNo: null,
  clinicDate: '2018-01-06',
  clinicTime: '14:40   ',
  clinicType: '          ',
  clinicTypeName: '普通门诊',
  comment: '',
  createdAt: null,
  createdBy: null,
  depClazz: '内科',
  depClazzName: '内科',
  depId: '8a81a7db4dadd943014dadd943920001',
  depName: '呼吸内科',
  depNo: '001',
  depPinyin: '',
  depWubi: '',
  department: null,
  docId: '8a81a7db4dad2271014dad2271e20001',
  docJobTitle: '副主任医师',
  docName: '何权瀛',
  docNo: '001',
  docPinyin: '',
  docWubi: '',
  doctor: null,
  endDate: null,
  hosId: '8a81a7db4dad2271014dad2271e20001',
  hosName: '北京大学人民医院',
  hosNo: 'H31AAAA001',
  hospital: null,
  id: '8a81a7db4dadd943014dapp943920003',
  idNo: null,
  isRepeated: ' ',
  mobile: null,
  no: '3',
  num: '3',
  proId: null,
  proName: null,
  proNo: null,
  profile: null,
  regFee: 0,
  reserveNo: '',
  schId: '                                ',
  schNo: '5',
  sepCode: '',
  sepId: '                                ',
  sepName: '',
  sepType: ' ',
  shift: ' ',
  shiftName: '下午',
  signTime: '2018-01-30 20:01:50',
  startDate: null,
  status: null,
  statusName: null,
  totalFee: 50,
  treatFee: 0,
  treatTime: '1900-01-01 00:00:00',
  type: '',
  updatedAt: null,
  updatedBy: null,
};
// 测试数据2
export const testAppointItem2 = {
  address: '1号楼1诊室',
  appChannel: ' ',
  appUser: '',
  appointTime: '2018-02-27 21:38:10',
  cardId: null,
  cardNo: null,
  clinicDate: '2018-01-06',
  clinicTime: '14:00   ',
  clinicType: '          ',
  clinicTypeName: '普通门诊',
  comment: '',
  createdAt: null,
  createdBy: null,
  depClazz: '内科',
  depClazzName: '内科',
  depId: '8a81a7db4dadd943014dadd943920001',
  depName: '呼吸内科',
  depNo: '001',
  depPinyin: '',
  depWubi: '',
  department: null,
  docId: '8a81a7db4dad2271014dad2271e20001',
  docJobTitle: '副主任医师',
  docName: '何权瀛',
  docNo: '001',
  docPinyin: '',
  docWubi: '',
  doctor: null,
  endDate: null,
  hosId: '8a81a7db4dad2271014dad2271e20001',
  hosName: '北京大学人民医院',
  hosNo: 'H31AAAA001',
  hospital: null,
  id: '8a81a7db4dadd943014dapp943920001',
  idNo: '410522199004152719',
  isRepeated: ' ',
  mobile: '18500227256',
  no: '1',
  num: '1',
  proId: null,
  proName: null,
  proNo: null,
  profile: null,
  regFee: 0,
  reserveNo: '',
  schId: '                                ',
  schNo: '5',
  sepCode: '',
  sepId: '                                ',
  sepName: '',
  sepType: ' ',
  shift: ' ',
  shiftName: '下午',
  signTime: '2018-02-03 20:46:51',
  startDate: null,
  status: '1',
  statusName: '已预约',
  totalFee: 50,
  treatFee: 0,
  treatTime: '1900-01-01 00:00:00',
  type: '',
  updatedAt: null,
  updatedBy: null,
};
