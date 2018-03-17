import Global from './application/Global';

/**
 * 全局配置文件
 * for implement
 * @type {Object}
 */
const appId = 'com.lenovohit.msh';
const appUUID = '2c90a85c614a07ce01614a38f8d40004';
const config = Object.freeze({
  appId,
  appUUID,
  appName: '联想智慧医院',
  mode: Global.MODE_DEV,
  edition: Global.EDITION_SINGLE,
  hospId: '8a81a7db4dad2271014dad2271e20001',
  hospital: { // 单医院版需要在配置文件中加入医院信息
    id: '8a81a7db4dad2271014dad2271e20001',
    orgId: '8a81a7db4dad2271014dad22org20001',
    name: '北京大学人民医院',
    no: 'H31AAAA001',
    type: '1',
    level: '3A',
    status: '1',
    logo: '8a50ad50e87c11e7be625254001f7cdb',
    scenery: '54279a56e87d11e7be625254001f7cdb',
    sceneryNum: 4,
    longitude: 116.360788,
    latitude: 39.942493,
    org: null,
    profiles: null,
    brief: '北京大学人民医院创建于1918年，是中国人自行筹资建设和管理的第一家综合性西医医院，最初命名为“北京中央医院”，中国现代医学先驱伍连德博士任首任院长。 北京大学人民医院的发展历程，是中国医学进步的见证。经过99年的发展现已发展成为集医疗、教学、科研为一体的现代化综合性三级甲等医院。',
  },
  host: 'http://123.206.123.247/api/hwe',
  hostTimeout: 5000,
  logo: {
    l: require('./assets/images/logo/logo-l.png'), // 大
    m: require('./assets/images/logo/logo-m.png'), // 中
    s: require('./assets/images/logo/logo-s.png'), // 小
    lw: require('./assets/images/logo/logo-l-white.png'), // 大 - 白色
    mw: require('./assets/images/logo/logo-m-white.png'), // 中 - 白色
    sw: require('./assets/images/logo/logo-s-white.png'), // 小 - 白色
  },
  imgIcons: {
    appAndReg: require('./assets/images/icons/app-and-reg.png'),
    payment: require('./assets/images/icons/payment.png'),
    reports: require('./assets/images/icons/reports.png'),
    consumeMain: require('./assets/images/icons/payment-records.png'),
    treatRecords: require('./assets/images/icons/treat-records.png'),
    news: require('./assets/images/icons/news.png'),
    consult: require('./assets/images/icons/consult.png'),
    forum: require('./assets/images/icons/forum.png'),
    signIn: require('./assets/images/icons/sign-in.png'),
    appAndRegRecords: require('./assets/images/icons/app-and-reg-records.png'),
    inpatientInfo: require('./assets/images/icons/inpatient-info.png'),
    inpatientDailyBill: require('./assets/images/icons/inpatient-daily-bill.png'),
  },
  imgTabIcons: {
    hosp: require('./assets/images/icons/tab-hosp.png'),
    hospActive: require('./assets/images/icons/tab-hosp-active.png'),
    hc: require('./assets/images/icons/tab-hc.png'),
    hcActive: require('./assets/images/icons/tab-hc-active.png'),
    comm: require('./assets/images/icons/tab-comm.png'),
    commActive: require('./assets/images/icons/tab-comm-active.png'),
    guide: require('./assets/images/icons/tab-guide.png'),
    guideActive: require('./assets/images/icons/tab-guide-active.png'),
    me: require('./assets/images/icons/tab-me.png'),
    meActive: require('./assets/images/icons/tab-me-active.png'),
  },
  ads: [
    { image: require('./assets/images/adImgs/ad-001.jpg') },
    { image: require('./assets/images/adImgs/ad-002.jpg') },
    { image: require('./assets/images/adImgs/ad-003.jpg') },
    { image: require('./assets/images/adImgs/ad-004.png') },
  ],
  defaultImgs: {
    userPortrait: require('./assets/images/me/default-portrait.png'),
    userBg: require('./assets/images/me/default-bg.png'),
    hospLogo: require('./assets/images/hosp/default-logo.png'),
    hospScenery: require('./assets/images/hosp/default-scenery.png'),
    hospBg: require('./assets/images/hosp/default-bg.png'),
    docPortrait: require('./assets/images/hosp/default-doc-portrait.png'),
    docBg: require('./assets/images/hosp/default-bg.png'),
  },
  imgPayChannel: {
    alipay: require('./assets/images/pay/alipay.png'),
    wxpay: require('./assets/images/pay/wxpay.png'),
    unionpay: require('./assets/images/pay/unionpay.png'),
  },
  imgCards: {
    md: require('./assets/images/cards/md.jpg'),
    mdb: require('./assets/images/cards/mdb.jpg'),
  },
  colors: [
    'rgb(246,77,83)', '#F54D53',
    'rgb(250,196,18)', '#FAC412',
    'rgb(117,123,252)', '#757BFC',
    'rgb(72,188,235)', '#48BCEB',
    'rgb(56,205,181)', '#38CDB5',
    'rgb(246,103,185)', '#F667B9',
    'rgb(105,222,81)', '#69DE51',
    'rgb(82,218,223)', '#52DADF',
    'rgb(228,183,76)', '#E4B74C',
  ],
  services: {
    hfc: [
      {
        id: 'hf01', state: '1', route: 'AppAndReg', name: '预约挂号',
        iconLib: '', icon: '', imgIcon: 'appAndReg', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
        passProps: {
          showCurrHospitalAndPatient: true,
          allowSwitchHospital: true,
          allowSwitchPatient: true,
        },
      },
      {
        id: 'hf02', state: '1', route: 'Payments', name: '充值缴费',
        iconLib: '', icon: '', imgIcon: 'payment', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
        passProps: {
          showCurrHospitalAndPatient: true,
          allowSwitchHospital: true,
          allowSwitchPatient: true,
          hideNavBarBottomLine: true,
        },
      },
      {
        id: 'hf03', state: '1', route: 'Reports', name: '报告查询',
        iconLib: '', icon: '', imgIcon: 'reports', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
        passProps: {
          showCurrHospitalAndPatient: true,
          allowSwitchHospital: true,
          allowSwitchPatient: true,
        },
      },
      {
        id: 'hf09', state: '1', route: 'AppAndRegRecords', name: '预约记录',
        iconLib: '', icon: '', imgIcon: 'appAndRegRecords', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
        passProps: {
          showCurrHospitalAndPatient: true,
          allowSwitchHospital: true,
          allowSwitchPatient: true,
        },
      },
      {
        id: 'hf08', state: '1', route: 'SignIn', name: '来院签到',
        iconLib: '', icon: '', imgIcon: 'signIn', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
        passProps: {
          showCurrHospitalAndPatient: true,
          allowSwitchHospital: true,
          allowSwitchPatient: true,
        },
      },
      {
        id: 'hf05', state: '1', route: 'Records', name: '就诊记录',
        iconLib: '', icon: '', imgIcon: 'treatRecords', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
        passProps: {
          showCurrHospitalAndPatient: true,
          allowSwitchHospital: true,
          allowSwitchPatient: true,
        },
      },
      {
        id: 'hf04', state: '1', route: 'ConsumeMain', name: '消费记录',
        iconLib: '', icon: '', imgIcon: 'consumeMain', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
        passProps: {
          showCurrHospitalAndPatient: true,
          allowSwitchHospital: true,
          allowSwitchPatient: true,
          hideNavBarBottomLine: true,
        },
      },
      {
        id: 'hf06', state: '1', route: 'ConsultRecords', name: '医患沟通',
        iconLib: '', icon: '', imgIcon: 'consult', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
        passProps: {
          showCurrHospitalAndPatient: true,
          allowSwitchHospital: true,
          allowSwitchPatient: true,
          hideNavBarBottomLine: true,
        },
      },
      {
        id: 'hf07', state: '1', route: 'NewsList', name: '健康资讯',
        iconLib: '', icon: '', imgIcon: 'news', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
        passProps: {
          fkId: appId,
          fkType: 'H4',
          hideNavBarBottomLine: true,
        },
      },
      {
        id: 'hf10', state: '1', route: 'InpatientInfo', name: '住院单查询',
        iconLib: '', icon: '', imgIcon: 'inpatientInfo', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
        passProps: {
          showCurrHospitalAndPatient: true,
          allowSwitchHospital: true,
          allowSwitchPatient: true,
        },
      },
      {
        id: 'hf11', state: '1', route: 'InpatientDailyBill', name: '住院日清单',
        iconLib: '', icon: '', imgIcon: 'inpatientDailyBill', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
        passProps: {
          showCurrHospitalAndPatient: true,
          allowSwitchHospital: true,
          allowSwitchPatient: true,
          hideNavBarBottomLine: true,
        },
      },
    ],
    tools: [
      {
        grpCode: 'group_01',
        grpName: '实用工具',
        children: [
          // {
          //   id: 'txx', state: '1', route: 'BarcodeScanner', name: '扫一扫',
          //   iconLib: 'ii', icon: 'ios-speedometer-outline', imgIcon: '', iconSize: 50, iconSmallSize: 26, color: '#ffffff', bgColor: '#F54D53', borderColor: '',
          // },
          {
            id: 't03', state: '1', route: 'BMI', name: 'BMI自查',
            iconLib: 'ii', icon: 'ios-speedometer-outline', imgIcon: '', iconSize: 50, iconSmallSize: 26, color: '#ffffff', bgColor: '#F54D53', borderColor: '',
          },
          {
            id: 't04', state: '1', route: 'EDC', name: '预产期自测',
            iconLib: 'ii', icon: 'ios-transgender-outline', imgIcon: '', iconSize: 50, iconSmallSize: 26, color: '#ffffff', bgColor: '#FAC412', borderColor: '',
          },
          {
            id: 't05', state: '1', route: 'Tests', name: '化验单解读',
            iconLib: 'ii', icon: 'ios-bookmarks-outline', imgIcon: '', iconSize: 50, iconSmallSize: 26, color: '#ffffff', bgColor: '#757BFC', borderColor: '',
          },
          {
            id: 't06', state: '1', route: 'Vaccines', name: '预防接种',
            iconLib: 'ii', icon: 'ios-umbrella-outline', imgIcon: '', iconSize: 50, iconSmallSize: 26, color: '#ffffff', bgColor: '#48BCEB', borderColor: '',
          },
          {
            id: 't01', state: '1', route: 'MedAlarm', name: '用药小闹钟',
            iconLib: 'ii', icon: 'ios-alarm-outline', imgIcon: '', iconSize: 50, iconSmallSize: 26, color: '#ffffff', bgColor: '#38CDB5', borderColor: '',
          },
          {
            id: 't02', state: '1', route: 'Triage', name: '智能分诊',
            iconLib: 'ii', icon: 'ios-compass-outline', imgIcon: '', iconSize: 50, iconSmallSize: 26, color: '#ffffff', bgColor: '#F667B9', borderColor: '',
          },
        ],
      },
      {
        grpCode: 'group_02',
        grpName: '知识库',
        children: [
          {
            id: 't31', state: '1', route: 'Diagnosis', name: '疾病库',
            iconLib: 'ii', icon: 'ios-archive-outline', imgIcon: '', iconSize: 50, iconSmallSize: 26, color: '#ffffff', bgColor: '#69DE51', borderColor: '',
          },
          {
            id: 't32', state: '1', route: 'Drugs', name: '药物库',
            iconLib: 'ii', icon: 'ios-flask-outline', imgIcon: '', iconSize: 50, iconSmallSize: 26, color: '#ffffff', bgColor: '#52DADF', borderColor: '',
          },
          {
            id: 't33', state: '1', route: 'FirstAids', name: '急救库',
            iconLib: 'ii', icon: 'ios-water-outline', imgIcon: '', iconSize: 50, iconSmallSize: 26, color: '#ffffff', bgColor: '#E4B74C', borderColor: '',
          },
        ],
      },
      // {
      //   grpCode: 'group_03',
      //   grpName: '其它工具',
      //   children: [
      //     {
      //       id: 't61', state: '1', route: 'SampleMenu', name: '样例',
      //       iconLib: 'ii', icon: 'ios-bug-outline', imgIcon: '', iconSize: 50, iconSmallSize: 26, color: '#ffffff', bgColor: '#4dc7ee', borderColor: '', devMode: true,
      //     },
      //     {
      //       id: 't62', state: '1', route: 'SampleList', name: '列表测试',
      //       iconLib: 'ii', icon: 'ios-book-outline', imgIcon: '', iconSize: 50, iconSmallSize: 26, color: '#ffffff', bgColor: '#4dc7ee', borderColor: '', devMode: true,
      //     },
      //   ],
      // },
    ],
    me: [
      {},
    ],
  },
  needChooseHospServices: [ // 需要先选择医院的场景
    'AppAndReg',
    'Payments',
    'Reports',
    'ConsumeMain',
    'Records',
    'ConsultRecords',
    'AppAndRegRecords',
    'SignIn',
    'InpatientInfo',
    'InpatientDailyBill',
  ],
  needLoginComp: [ // 需要登录才能访问的场景
    'HCTab',
    'Profile',
    'SecuritySettings',
    'AppAndRegRecords',
    'Reports',
    'ConsumeMain',
    'Records',
    'Patients',
    'Cards',
    'Appoint',
    'AppAndRegRecords',
    'SignIn',
    'Message',
    'ChooseHospital',
    'PatientList',
    'Payments',
    'ConsultRecords',
    'InpatientInfo',
    'InpatientDailyBill',
  ],
  tagTypes: {
    NEAREST: 'nearest',
    LATEST: 'latest',
    FREQUENT: 'frequent',
  },
  tagConfig: {
    nearest: { label: '离我最近', bgColor: Global.colors.IOS_GREEN, borderColor: Global.colors.IOS_GREEN },
    latest: { label: '最近去过', bgColor: Global.colors.ORANGE, borderColor: Global.colors.ORANGE },
    frequent: { label: '去的最多', bgColor: Global.colors.ORANGE, borderColor: Global.colors.IOS_BLUE },
  },
  // 系统配置
  // 全局
  global: {
    // ?
  },
  // 医院
  hosp: {
    logoVisible: true, // 是否显示医院logo
    evaluationAvailable: true, // 是否使用医院评价体系
  },
  // 科室
  dept: {
    evaluationAvailable: true, // 是否使用医院评价体系
  },
  // 医生
  doc: {
    portraitVisible: true, // 是否显示医生头像
    evaluationAvailable: true, // 是否使用医院评价体系
  },
});

module.exports = config;
