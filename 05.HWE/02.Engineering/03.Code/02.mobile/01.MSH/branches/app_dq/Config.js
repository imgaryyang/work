import Global from './application/Global';

/**
 * 全局配置文件
 * for implement
 * @type {Object}
 */
const appId = 'com.lenovohit.lnhospital';
const appUUID = '2c90a85c614a07ce01614a38f8d40004';
// const hisUser = '0001';
const config = Object.freeze({
  appId,
  appUUID,
  // hisUser,
  appName: '大庆龙南医院（新）',
  appType: 'APP', // 审计字段
  appCode: 'APP01', // 审计字段
  mode: Global.MODE_DEV,
  edition: Global.EDITION_SINGLE,
  hospId: 'f5132936894747638364411cb2b0ef9c',
  hospital: { // 单医院版需要在配置文件中加入医院信息
    id: 'f5132936894747638364411cb2b0ef9c',
    orgId: '8a81a7db4dad2271014dad22org20007',
    name: '大庆龙南医院',
    no: '01',
    type: '01',
    level: '3A',
    status: '1',
    logo: 'f5132936894747638364411cb2b0ef9c.png',
    scenery: '01-0001.jpg',
    sceneryNum: 4,
    longitude: 124.895176,
    latitude: 46.624389,
    org: null,
    profiles: null,
    brief: '大庆龙南医院地处石油、石化企业中心区域，始建于1997年，是一所集医疗、教学、科研、预防保健于一体的综合性国家三级甲等医院。建筑面积10.8万平方米，开放床位823张，共设34个病区，38个临床科室，年门诊量100万余人次。',
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
    outpatientAppoint: require('./assets/images/icons/outpatient-appoint.png'),
    outpatientPayment: require('./assets/images/icons/outpatient-payment.png'),
    reports: require('./assets/images/icons/reports.png'),
    outpatientPaymentRecords: require('./assets/images/icons/outpatient-payment-records.png'),
    outpatientTreatRecords: require('./assets/images/icons/outpatient-treat-records.png'),
    news: require('./assets/images/icons/news.png'),
    consult: require('./assets/images/icons/consult.png'),
    forum: require('./assets/images/icons/forum.png'),
    outpatientSignIn: require('./assets/images/icons/outpatient-sign-in.png'),
    outpatientAppointRecords: require('./assets/images/icons/outpatient-appoint-records.png'),
    outpatientRefund: require('./assets/images/icons/outpatient-refund.png'),
    prepaidAndRefund: require('./assets/images/icons/prepaid-and-refund.png'),
    inpatient: require('./assets/images/icons/inpatient.png'),
    inpatientInfo: require('./assets/images/icons/inpatient-info.png'),
    inpatientDailyBill: require('./assets/images/icons/inpatient-daily-bill.png'),
    inpatientPrepaidRecords: require('./assets/images/icons/inpatient-prepaid-records.png'),
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
    // { image: require('./assets/images/adImgs/ad-001.jpg') },
    // { image: require('./assets/images/adImgs/ad-002.jpg') },
    // { image: require('./assets/images/adImgs/ad-003.jpg') },
    // { image: require('./assets/images/adImgs/ad-004.png') },
  ],
  defaultImgs: {
    userPortrait: require('./assets/images/me/default-portrait.png'),
    userBg: require('./assets/images/me/default-bg.png'),
    hospLogo: require('./assets/images/hosp/default-logo.png'),
    hospScenery: require('./assets/images/hosp/default-scenery.png'),
    hospBg: require('./assets/images/hosp/default-bg.png'),
    docPortrait: require('./assets/images/hosp/default-doc-portrait.png'),
    docBg: require('./assets/images/hosp/default-bg.png'),
    adBg: require('./assets/images/adImgs/default-bg.png'),
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
  refundedChannelTypes: [ // 当前退款支持的渠道类型
    'W',
    'Z',
  ],
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
        id: 'hf01', state: '1', route: 'AppSubFuncs', name: '预约挂号', iconLib: '', icon: '',
        imgIcon: 'outpatientAppoint', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
        children: [
          {
            id: 'hf0101', state: '1', route: 'AppAndReg', name: '预约挂号', iconLib: 'fa', icon: 'clock-o',
            imgIcon: 'outpatientAppoint', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
            passProps: {
              showCurrHospitalAndPatient: true,
              allowSwitchHospital: true,
              allowSwitchPatient: true,
            },
          },
          {
            id: 'hf0102', state: '1', route: 'SignMain', name: '预约签到', iconLib: 'fa', icon: 'calendar-check-o',
            imgIcon: 'outpatientSignIn', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
            passProps: {
              showCurrHospitalAndPatient: true,
              allowSwitchHospital: true,
              allowSwitchPatient: true,
              hideNavBarBottomLine: false,
            },
          },
          {
            id: 'hf0103', state: '1', route: 'AppointRecordsMain', name: '我的预约', iconLib: 'fa', icon: 'calendar',
            imgIcon: 'outpatientAppointRecords', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
            passProps: {
              showCurrHospitalAndPatient: true,
              allowSwitchHospital: true,
              allowSwitchPatient: true,
              hideNavBarBottomLine: true,
            },
          },
        ],
      },
      {
        id: 'hf02', state: '1', route: 'AppSubFuncs', name: '预存/退款', iconLib: '', icon: '',
        imgIcon: 'prepaidAndRefund', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
        children: [
          {
            id: 'hf0201', state: '1', route: 'OutpatientOnlineRecharge', name: '就诊卡预存', iconLib: 'fa', icon: 'download',
            imgIcon: 'outpatientPayment', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
            passProps: {
              showCurrHospitalAndPatient: true,
              allowSwitchHospital: true,
              allowSwitchPatient: true,
              hideNavBarBottomLine: false,
            },
          },
          {
            id: 'hf0202', state: '1', route: 'OutpatientRefund', name: '就诊卡预存退款', iconLib: 'fa', icon: 'upload',
            imgIcon: 'outpatientRefund', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
            passProps: {
              showCurrHospitalAndPatient: true,
              allowSwitchHospital: true,
              allowSwitchPatient: true,
              hideNavBarBottomLine: false,
            },
          },
        ],
      },
      {
        id: 'hf03', state: '1', route: 'PaymentChargeDetail', name: '自费缴费', iconLib: '', icon: '',
        imgIcon: 'outpatientPayment', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
        passProps: {
          showCurrHospitalAndPatient: true,
          allowSwitchHospital: true,
          allowSwitchPatient: true,
          hideNavBarBottomLine: false,
        },
      },
      {
        id: 'hf04', state: '1', route: 'Reports', name: '报告查询', iconLib: '', icon: '',
        imgIcon: 'reports', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
        passProps: {
          showCurrHospitalAndPatient: true,
          allowSwitchHospital: true,
          allowSwitchPatient: true,
        },
      },
      {
        id: 'hf05', state: '1', route: 'AppSubFuncs', name: '住院服务', iconLib: '', icon: '',
        imgIcon: 'inpatient', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
        children: [
          { id: 'hf05G1', group: true, name: '住院预缴' },
          {
            id: 'hf0501', state: '1', route: '', name: '就诊卡预存转住院预缴', iconLib: 'fa', icon: 'mail-forward',
            imgIcon: 'outpatientPayment', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
            passProps: {
              showCurrHospitalAndPatient: true,
              allowSwitchHospital: true,
              allowSwitchPatient: true,
              hideNavBarBottomLine: true,
            },
          },
          {
            id: 'hf0502', state: '1', route: 'InpatientOnlineRecharge', name: '微信/支付宝住院预缴', iconLib: 'fa', icon: 'sign-in',
            imgIcon: 'outpatientPayment', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
            passProps: {
              showCurrHospitalAndPatient: true,
              allowSwitchHospital: true,
              allowSwitchPatient: true,
              hideNavBarBottomLine: false,
            },
          },
          { id: 'hf05G2', group: true, name: '住院查询' },
          {
            id: 'hf0503', state: '1', route: 'InpatientInfo', name: '住院单查询', iconLib: 'fa', icon: 'medkit',
            imgIcon: 'inpatientInfo', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
            passProps: {
              showCurrHospitalAndPatient: true,
              allowSwitchHospital: true,
              allowSwitchPatient: true,
            },
          },
          {
            id: 'hf0504', state: '1', route: 'InpatientDailyBill', name: '住院日清单查询', iconLib: 'fa', icon: 'list-alt',
            imgIcon: 'inpatientDailyBill', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
            passProps: {
              showCurrHospitalAndPatient: true,
              allowSwitchHospital: true,
              allowSwitchPatient: true,
              hideNavBarBottomLine: true,
            },
          },
          {
            id: 'hf0505', state: '1', route: 'InpatientPrepaidRecords', name: ' 住院预缴记录查询', iconLib: 'fa', icon: 'indent',
            imgIcon: 'inpatientPrepaidRecords', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
            passProps: {
              showCurrHospitalAndPatient: true,
              allowSwitchHospital: true,
              allowSwitchPatient: true,
              hideNavBarBottomLine: false,
            },
          },
        ],
      },
      {
        id: 'hf06', state: '1', route: 'AppSubFuncs', name: '综合查询', iconLib: '', icon: '',
        imgIcon: 'inpatientDailyBill', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
        children: [
          {
            id: 'hf0601', state: '1', route: 'PreRecords', name: '就诊卡预存记录查询', iconLib: 'fa', icon: 'download',
            imgIcon: 'outpatientPaymentRecords', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
            passProps: {
              showCurrHospitalAndPatient: true,
              allowSwitchHospital: true,
              allowSwitchPatient: true,
              hideNavBarBottomLine: false,
            },
          },
          {
            id: 'hf0602', state: '1', route: 'ConsumeRecords', name: '就诊卡扣款记录查询', iconLib: 'fa', icon: 'random',
            imgIcon: 'outpatientPaymentRecords', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
            passProps: {
              showCurrHospitalAndPatient: true,
              allowSwitchHospital: true,
              allowSwitchPatient: true,
              hideNavBarBottomLine: false,
            },
          },
          {
            id: 'hf0603', state: '1', route: 'Records', name: '就诊记录查询', iconLib: 'fa', icon: 'hospital-o',
            imgIcon: 'outpatientTreatRecords', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
            passProps: {
              showCurrHospitalAndPatient: true,
              allowSwitchHospital: true,
              allowSwitchPatient: true,
            },
          },
        ],
      },
      // {
      //   id: 'hf07', state: '1', route: 'ConsultRecords', name: '医患沟通', iconLib: '', icon: '',
      //   imgIcon: 'consult', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
      //   passProps: {
      //     showCurrHospitalAndPatient: true,
      //     allowSwitchHospital: true,
      //     allowSwitchPatient: true,
      //     hideNavBarBottomLine: true,
      //   },
      // },
      // {
      //   id: 'hf08', state: '1', route: 'NewsList', name: '健康资讯', iconLib: '', icon: '',
      //   imgIcon: 'news', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
      //   passProps: {
      //     fkId: appUUID,
      //     fkType: 'H4',
      //     hideNavBarBottomLine: true,
      //   },
      // },
    ],
    tools: [
      {
        grpCode: 'group_01',
        grpName: '实用工具',
        children: [
          // {
          //   id: 'txx', state: '1', route: 'BarcodeScanner', name: '扫一扫', iconLib: 'ii', icon: 'ios-speedometer-outline',
          //   imgIcon: '', iconSize: 50, iconSmallSize: 26, color: '#ffffff', bgColor: '#F54D53', borderColor: '',
          // },
          {
            id: 't03', state: '1', route: 'BMI', name: 'BMI自查', iconLib: 'ii', icon: 'ios-speedometer-outline',
            imgIcon: '', iconSize: 50, iconSmallSize: 26, color: '#ffffff', bgColor: '#F54D53', borderColor: '',
          },
          {
            id: 't04', state: '1', route: 'EDC', name: '预产期自测', iconLib: 'ii', icon: 'ios-transgender-outline',
            imgIcon: '', iconSize: 50, iconSmallSize: 26, color: '#ffffff', bgColor: '#FAC412', borderColor: '',
          },
          {
            id: 't05', state: '1', route: 'Tests', name: '化验单解读', iconLib: 'ii', icon: 'ios-bookmarks-outline',
            imgIcon: '', iconSize: 50, iconSmallSize: 26, color: '#ffffff', bgColor: '#757BFC', borderColor: '',
          },
          {
            id: 't06', state: '1', route: 'Vaccines', name: '预防接种', iconLib: 'ii', icon: 'ios-umbrella-outline',
            imgIcon: '', iconSize: 50, iconSmallSize: 26, color: '#ffffff', bgColor: '#48BCEB', borderColor: '',
          },
          {
            id: 't01', state: '1', route: 'MedAlarm', name: '用药小闹钟', iconLib: 'ii', icon: 'ios-alarm-outline',
            imgIcon: '', iconSize: 50, iconSmallSize: 26, color: '#ffffff', bgColor: '#38CDB5', borderColor: '',
          },
          {
            id: 't02', state: '1', route: 'Triage', name: '智能分诊', iconLib: 'ii', icon: 'ios-compass-outline',
            imgIcon: '', iconSize: 50, iconSmallSize: 26, color: '#ffffff', bgColor: '#F667B9', borderColor: '',
          },
        ],
      },
      {
        grpCode: 'group_02',
        grpName: '知识库',
        children: [
          {
            id: 't31', state: '1', route: 'Diagnosis', name: '疾病库', iconLib: 'ii', icon: 'ios-archive-outline',
            imgIcon: '', iconSize: 50, iconSmallSize: 26, color: '#ffffff', bgColor: '#69DE51', borderColor: '',
          },
          {
            id: 't32', state: '1', route: 'Drugs', name: '药物库', iconLib: 'ii', icon: 'ios-flask-outline',
            imgIcon: '', iconSize: 50, iconSmallSize: 26, color: '#ffffff', bgColor: '#52DADF', borderColor: '',
          },
          {
            id: 't33', state: '1', route: 'FirstAids', name: '急救库', iconLib: 'ii', icon: 'ios-water-outline',
            imgIcon: '', iconSize: 50, iconSmallSize: 26, color: '#ffffff', bgColor: '#E4B74C', borderColor: '',
          },
        ],
      },
      // {
      //   grpCode: 'group_03',
      //   grpName: '其它工具',
      //   children: [
      //     {
      //       id: 't61', state: '1', route: 'SampleMenu', name: '样例', iconLib: 'ii', icon: 'ios-bug-outline',
      //       imgIcon: '', iconSize: 50, iconSmallSize: 26, color: '#ffffff', bgColor: '#4dc7ee', borderColor: '', devMode: true,
      //     },
      //     {
      //       id: 't62', state: '1', route: 'SampleList', name: '列表测试', iconLib: 'ii', icon: 'ios-book-outline',
      //       imgIcon: '', iconSize: 50, iconSmallSize: 26, color: '#ffffff', bgColor: '#4dc7ee', borderColor: '', devMode: true,
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
    'Records',
    'ConsumeRecords',
    'PreRecords',
    'ConsultRecords',
    'AppointRecordsMain',
    'SignMain',
    'InpatientInfo',
    'InpatientDailyBill',
    'InpatientPrepaidRecords',
  ],
  needLoginComp: [ // 需要登录才能访问的场景
    'HCTab',
    'Profile',
    'SecuritySettings',
    'SignMain',
    'AppointRecordsMain',
    'Reports',
    'ConsumeMain',
    'Records',
    'Patients',
    'Cards',
    'Appoint',
    'Message',
    'ChooseHospital',
    'PatientList',
    'Payments',
    'ConsultRecords',
    'InpatientInfo',
    'InpatientDailyBill',
    'InpatientPrepaidRecords',
    'ChoosePatient',
    'Portrait',
    'OutpatientOnlineRecharge',
    'OutpatientRefund',
    'PaymentChargeDetail',
    'InpatientOnlineRecharge',
    'PreRecords',
    'ConsumeRecords',
    'Records',
  ],
  needProfileComp: [ // 需要先选档案才能操作的场景
    'Payments',
    'Reports',
    // 'SignMain',
    '', // 门诊退费
    // 'AppointRecordsMain',
    'ConsumeMain',
    'Records',
    'InpatientInfo',
    'InpatientDailyBill',
    'InpatientPrepaidRecords',
    'OutpatientOnlineRecharge',
    'OutpatientRefund',
    'PaymentChargeDetail',
    'InpatientOnlineRecharge',
    'PreRecords',
    'ConsumeRecords',
    'Records',
  ],
  // tagTypes: {
  //   NEAREST: 'nearest',
  //   LATEST: 'latest',
  //   FREQUENT: 'frequent',
  //   OP_TYPE_NORMAL: 'opTypeNormal', // 门诊就诊记录类型 - 普通门诊
  //   OP_TYPE_OTHER: 'opTypeOther', // 门诊就诊记录类型 - 其它（显示接口传过来的就诊类型）
  // },
  tagConfig: {
    // 医院列表
    nearest: { label: '离我最近', bgColor: Global.colors.IOS_GREEN, borderColor: Global.colors.IOS_GREEN },
    latest: { label: '最近去过', bgColor: Global.colors.ORANGE, borderColor: Global.colors.ORANGE },
    frequent: { label: '去的最多', bgColor: Global.colors.ORANGE, borderColor: Global.colors.ORANGE },
    // 就诊类型
    clinicTypeNormal: { label: '普通门诊', bgColor: Global.colors.IOS_BLUE, borderColor: Global.colors.IOS_BLUE },
    clinicTypeOther: { label: '', bgColor: Global.colors.IOS_RED, borderColor: Global.colors.IOS_RED },
    // patientRelation
    patientRelationMeself: { label: '本人', bgColor: Global.colors.IOS_GREEN, borderColor: Global.colors.IOS_GREEN },
    patientRelationOther: { label: '其他', bgColor: Global.colors.ORANGE, borderColor: Global.colors.ORANGE },
  },
  // 系统配置
  // 全局
  global: {
    loginMode: Global.LOGIN_MODE_SMS, // 登录模式：短信
    authCodeResendInterval: 30, // 重新发送验证码时间间隔（秒 s）
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
  // 检验项目说明
  LISDesc: {
    bloodRT: '血常规是最一般，最基本的血液检验。血液由液体和有形细胞两大部分组成，血常规检验的是血液的细胞部分。血液有三种不同功能的细胞——红细胞(俗称红血球)，白细胞(俗称白血球)、血小板。',
    liverFunction: '肝功能检查是通过各种生化试验方法检测与肝脏功能代谢有关的各项指标、以反映肝脏功能基本状况的检查。',
    UrineRT: '尿常规通过对人体尿液表象及成分的分析，检测是否可能患有某些泌尿系统疾病或糖尿病。尿常规检查内容包括尿的颜色、透明度、白细胞、上皮细胞、管型、蛋白质、比重及尿糖定性的检查。',
  },
});

module.exports = config;