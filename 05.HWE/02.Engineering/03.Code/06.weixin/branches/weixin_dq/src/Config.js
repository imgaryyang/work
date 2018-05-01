// import React from 'react';
import Global from './Global';

/**
 * 全局配置文件
 * for implement
 * @type {Object}
 */
const appId = 'com.lenovohit.lnhospital';
const appUUID = '2c90a85c614a07ce01614a38f8d40004';
// console.log('Global:', Global);
const config = Object.freeze({
  appId,
  appUUID,
  appName: '大庆龙南医院（新）',
  appType: 'W&Z', // TODO 临时
  appCode: 'W&Z01', // TODO 临时
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
    longitude: 124.895292,
    latitude: 46.624362,
    org: null,
    profiles: null,
    brief: '大庆龙南医院地处石油、石化企业中心区域，始建于1997年，是一所集医疗、教学、科研、预防保健于一体的综合性国家三级甲等医院，现有4个成员医院（乘风医院、东海医院、让北医院、五官医院）组成。建筑面积12.5万平方米，开放床位900余张，共设34个病区，46个临床科室，年门诊量110万余人次。历经21年的建设，大庆龙南医院用深圳速度，诠释了一个快速发展的奇迹。',
  },
  host: 'http://123.206.123.247/api/hwe',
  hostTimeout: 5000,
  // ads: [
  //   'ad1',
  //   'ad2',
  //   'ad3',
  //   'ad4',
  // ],
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
        id: 'hf01', state: '1', route: 'subFuncs', name: '预约挂号', iconLib: '', icon: '',
        imgIcon: 'outpatientAppoint', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
        children: [
          {
            id: 'hf0101', state: '1', route: 'appoint/departments', name: '预约挂号', iconLib: 'fa', icon: 'clock-o',
            imgIcon: 'outpatientAppoint', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
            passProps: {
              showCurrHospitalAndPatient: true,
              allowSwitchHospital: true,
              allowSwitchPatient: true,
            },
          },
          {
            id: 'hf0102', state: '1', route: '', name: '预约签到', iconLib: 'fa', icon: 'calendar-check-o',
            imgIcon: 'outpatientSignIn', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
            passProps: {
              showCurrHospitalAndPatient: true,
              allowSwitchHospital: true,
              allowSwitchPatient: true,
            },
          },
          {
            id: 'hf0103', state: '1', route: 'appoint/records', name: '我的预约', iconLib: 'fa', icon: 'calendar',
            imgIcon: 'outpatientAppointRecords', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
            passProps: {
              showCurrHospitalAndPatient: true,
              allowSwitchHospital: true,
              allowSwitchPatient: true,
            },
          },
        ],
      },
      {
        id: 'hf02', state: '1', route: 'subFuncs', name: '预存/退款', iconLib: '', icon: '',
        imgIcon: 'prepaidAndRefund', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
        children: [
          {
            id: 'hf0201', state: '1', route: 'OutpatientOnlineRecharge', name: '就诊卡预存', iconLib: 'fa', icon: 'download',
            imgIcon: 'outpatientPayment', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
            passProps: {
              showCurrHospitalAndPatient: true,
              allowSwitchHospital: true,
              allowSwitchPatient: true,
              hideNavBarBottomLine: true,
            },
          },
          {
            id: 'hf0202', state: '1', route: 'outpatientReturn', name: '就诊卡预存退款', iconLib: 'fa', icon: 'upload',
            imgIcon: 'outpatientRefund', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
            passProps: {
              showCurrHospitalAndPatient: true,
              allowSwitchHospital: true,
              allowSwitchPatient: true,
            },
          },
        ],
      },
      {
        id: 'hf03', state: '0', route: 'payDoctorAdvice', name: '自费缴费', iconLib: '', icon: '',
        imgIcon: 'outpatientPayment', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
        passProps: {
          showCurrHospitalAndPatient: true,
          allowSwitchHospital: true,
          allowSwitchPatient: true,
          hideNavBarBottomLine: false,
        },
      },
      {
        id: 'hf04', state: '1', route: 'report', name: '报告查询', iconLib: '', icon: '',
        imgIcon: 'reports', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
        passProps: {
          showCurrHospitalAndPatient: true,
          allowSwitchHospital: true,
          allowSwitchPatient: true,
        },
      },
      {
        id: 'hf05', state: '1', route: 'subFuncs', name: '住院服务', iconLib: '', icon: '',
        imgIcon: 'inpatient', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
        children: [
          { id: 'hf05G1', group: true, name: '住院预缴' },
          {
            id: 'hf0501', state: '0', route: '', name: '就诊卡预存转住院预缴', iconLib: 'fa', icon: 'mail-forward',
            imgIcon: 'outpatientPayment', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
            passProps: {
              showCurrHospitalAndPatient: true,
              allowSwitchHospital: true,
              allowSwitchPatient: true,
              hideNavBarBottomLine: true,
            },
          },
          {
            id: 'hf0502', state: '0', route: 'InpatientOnlineRecharge', name: '住院预缴', iconLib: 'fa', icon: 'sign-in',
            imgIcon: 'outpatientPayment', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
            passProps: {
              showCurrHospitalAndPatient: true,
              allowSwitchHospital: true,
              allowSwitchPatient: true,
              hideNavBarBottomLine: true,
            },
          },
          { id: 'hf05G2', group: true, name: '住院查询' },
          {
            id: 'hf0503', state: '1', route: 'inpatientBillQuery', name: '住院单查询', iconLib: 'fa', icon: 'medkit',
            imgIcon: 'inpatientInfo', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
            passProps: {
              showCurrHospitalAndPatient: true,
              allowSwitchHospital: true,
              allowSwitchPatient: true,
            },
          },
          {
            id: 'hf0504', state: '1', route: 'inpatientDaily', name: '住院日清单查询', iconLib: 'fa', icon: 'list-alt',
            imgIcon: 'inpatientDailyBill', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
            passProps: {
              showCurrHospitalAndPatient: true,
              allowSwitchHospital: true,
              allowSwitchPatient: true,
              hideNavBarBottomLine: true,
            },
          },
          {
            id: 'hf0505', state: '1', route: 'inpatientPrepaidRecords', name: ' 住院预缴记录查询', iconLib: 'fa', icon: 'indent',
            imgIcon: 'inpatientPrepaidRecords', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
            passProps: {
              showCurrHospitalAndPatient: true,
              allowSwitchHospital: true,
              allowSwitchPatient: true,
            },
          },
        ],
      },
      {
        id: 'hf06', state: '1', route: 'subFuncs', name: '综合查询', iconLib: '', icon: '',
        imgIcon: 'inpatientDailyBill', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
        children: [
          {
            id: 'hf0601', state: '1', route: 'PreRecordsList', name: '就诊卡预存记录查询', iconLib: 'fa', icon: 'download',
            imgIcon: 'outpatientPaymentRecords', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
            passProps: {
              showCurrHospitalAndPatient: true,
              allowSwitchHospital: true,
              allowSwitchPatient: true,
              hideNavBarBottomLine: true,
            },
          },
          {
            id: 'hf0602', state: '1', route: 'ConsumeRecordList', name: '就诊卡扣款记录查询', iconLib: 'fa', icon: 'random',
            imgIcon: 'outpatientPaymentRecords', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
            passProps: {
              showCurrHospitalAndPatient: true,
              allowSwitchHospital: true,
              allowSwitchPatient: true,
              hideNavBarBottomLine: true,
            },
          },
          {
            id: 'hf0603', state: '1', route: 'record', name: '就诊记录查询', iconLib: 'fa', icon: 'hospital-o',
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
      //   id: 'hf06', state: '1', route: '', name: '医患沟通', iconLib: '', icon: '',
      //   imgIcon: 'consult', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
      //   passProps: {
      //     showCurrHospitalAndPatient: true,
      //     allowSwitchHospital: true,
      //     allowSwitchPatient: true,
      //     hideNavBarBottomLine: true,
      //   },
      // },
      // {
      //   id: 'hf07', state: '1', route: 'news', name: '健康资讯', iconLib: '', icon: '',
      //   imgIcon: 'news', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
      //   passProps: {
      //     fkId: appUUID,
      //     fkType: 'H4',
      //     hideNavBarBottomLine: true,
      //     showCurrHospitalAndPatient: true,
      //     headerRight: null,
      //   },
      // },
    ],
    // tools: [
    //   {
    //     grpCode: 'group_01',
    //     grpName: '实用工具',
    //     children: [
    //       // {
    //       //   id: 'txx', state: '1', route: 'BarcodeScanner', name: '扫一扫', iconLib: 'ii', icon: 'ios-speedometer-outline',
    //       //   imgIcon: '', iconSize: 50, iconSmallSize: 26, color: '#ffffff', bgColor: '#F54D53', borderColor: '',
    //       // },
    //       {
    //         id: 't03', state: '1', route: 'BMI', name: 'BMI自查', iconLib: 'ii', icon: 'ios-speedometer-outline',
    //         imgIcon: '', iconSize: 50, iconSmallSize: 26, color: '#ffffff', bgColor: '#F54D53', borderColor: '',
    //       },
    //       {
    //         id: 't04', state: '1', route: 'EDC', name: '预产期自测', iconLib: 'ii', icon: 'ios-transgender-outline',
    //         imgIcon: '', iconSize: 50, iconSmallSize: 26, color: '#ffffff', bgColor: '#FAC412', borderColor: '',
    //       },
    //       {
    //         id: 't05', state: '1', route: 'Tests', name: '化验单解读', iconLib: 'ii', icon: 'ios-bookmarks-outline',
    //         imgIcon: '', iconSize: 50, iconSmallSize: 26, color: '#ffffff', bgColor: '#757BFC', borderColor: '',
    //       },
    //       {
    //         id: 't06', state: '1', route: 'Vaccines', name: '预防接种', iconLib: 'ii', icon: 'ios-umbrella-outline',
    //         imgIcon: '', iconSize: 50, iconSmallSize: 26, color: '#ffffff', bgColor: '#48BCEB', borderColor: '',
    //       },
    //       {
    //         id: 't01', state: '1', route: 'MedAlarm', name: '用药小闹钟', iconLib: 'ii', icon: 'ios-alarm-outline',
    //         imgIcon: '', iconSize: 50, iconSmallSize: 26, color: '#ffffff', bgColor: '#38CDB5', borderColor: '',
    //       },
    //       {
    //         id: 't02', state: '1', route: 'Triage', name: '智能分诊', iconLib: 'ii', icon: 'ios-compass-outline',
    //         imgIcon: '', iconSize: 50, iconSmallSize: 26, color: '#ffffff', bgColor: '#F667B9', borderColor: '',
    //       },
    //     ],
    //   },
    //   {
    //     grpCode: 'group_02',
    //     grpName: '知识库',
    //     children: [
    //       {
    //         id: 't31', state: '1', route: 'Diagnosis', name: '疾病库', iconLib: 'ii', icon: 'ios-archive-outline',
    //         imgIcon: '', iconSize: 50, iconSmallSize: 26, color: '#ffffff', bgColor: '#69DE51', borderColor: '',
    //       },
    //       {
    //         id: 't32', state: '1', route: 'Drugs', name: '药物库', iconLib: 'ii', icon: 'ios-flask-outline',
    //         imgIcon: '', iconSize: 50, iconSmallSize: 26, color: '#ffffff', bgColor: '#52DADF', borderColor: '',
    //       },
    //       {
    //         id: 't33', state: '1', route: 'FirstAids', name: '急救库', iconLib: 'ii', icon: 'ios-water-outline',
    //         imgIcon: '', iconSize: 50, iconSmallSize: 26, color: '#ffffff', bgColor: '#E4B74C', borderColor: '',
    //       },
    //     ],
    //   },
    //   // {
    //   //   grpCode: 'group_03',
    //   //   grpName: '其它工具',
    //   //   children: [
    //   //     {
    //   //       id: 't61', state: '1', route: 'SampleMenu', name: '样例', iconLib: 'ii', icon: 'ios-bug-outline',
    //   //       imgIcon: '', iconSize: 50, iconSmallSize: 26, color: '#ffffff', bgColor: '#4dc7ee', borderColor: '', devMode: true,
    //   //     },
    //   //     {
    //   //       id: 't62', state: '1', route: 'SampleList', name: '列表测试', iconLib: 'ii', icon: 'ios-book-outline',
    //   //       imgIcon: '', iconSize: 50, iconSmallSize: 26, color: '#ffffff', bgColor: '#4dc7ee', borderColor: '', devMode: true,
    //   //     },
    //   //   ],
    //   // },
    // ],
    me: [
      // {
      //   id: 'me01', state: '1', route: 'profile', name: '个人资料', iconLib: 'fa', icon: 'user',
      //   imgIcon: '', iconSize: 26, iconSmallSize: 26, color: '', bgColor: '', borderColor: '',
      //   passProps: {
      //     showCurrHospitalAndPatient: false,
      //     allowSwitchHospital: false,
      //     allowSwitchPatient: false,
      //     hideNavBarBottomLine: false,
      //     headerRight: null,
      //   },
      // },
      {
        id: 'me02', state: '1', route: 'patients', name: '常用就诊人', iconLib: 'fa', icon: 'users',
        imgIcon: '', iconSize: 26, iconSmallSize: 26, color: '', bgColor: '', borderColor: '', separator: true,
        passProps: {
          showCurrHospitalAndPatient: false,
          allowSwitchHospital: false,
          allowSwitchPatient: false,
          hideNavBarBottomLine: false,
          headerRight: null,
        },
      },
      // {
      //   id: 'me03', state: '1', route: '', name: '消息开关', iconLib: 'fa', icon: 'bell',
      //   imgIcon: 'inpatientDailyBill', iconSize: 26, iconSmallSize: 26, color: '', bgColor: '', borderColor: '', separator: true,
      //   passProps: {
      //     showCurrHospitalAndPatient: false,
      //     allowSwitchHospital: false,
      //     allowSwitchPatient: false,
      //     hideNavBarBottomLine: false,
      //     headerRight: null,
      //   },
      // },
      {
        id: 'me04', state: '1', route: 'contactUs', name: '联系我们', iconLib: 'fa', icon: 'envelope',
        imgIcon: '', iconSize: 26, iconSmallSize: 26, color: '', bgColor: '', borderColor: '',
        passProps: {
          showCurrHospitalAndPatient: false,
          allowSwitchHospital: false,
          allowSwitchPatient: false,
          hideNavBarBottomLine: false,
          headerRight: null,
        },
      },
      {
        id: 'me05', state: '1', route: 'feedBack', name: '反馈意见', iconLib: 'fa', icon: 'paper-plane',
        imgIcon: '', iconSize: 26, iconSmallSize: 26, color: '', bgColor: '', borderColor: '',
        passProps: {
          showCurrHospitalAndPatient: false,
          allowSwitchHospital: false,
          allowSwitchPatient: false,
          hideNavBarBottomLine: false,
          headerRight: null,
        },
      },
      {
        id: 'me06', state: '1', route: 'aboutUs', name: '关于', iconLib: 'fa', icon: 'newspaper-o',
        imgIcon: '', iconSize: 26, iconSmallSize: 26, color: '', bgColor: '', borderColor: '',
        passProps: {
          showCurrHospitalAndPatient: false,
          allowSwitchHospital: false,
          allowSwitchPatient: false,
          hideNavBarBottomLine: false,
          headerRight: null,
        },
      },
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
    'InpatientOnlineRecharge',
    'OutpatientOnlineRecharge',
    'PayDoctorAdvice',
    'PreRecordsList',
    'inpatientPrepaidRecords',
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
    'InpatientOnlineRecharge',
    'OutpatientOnlineRecharge',
    'PayDoctorAdvice',
    'PreRecordsList',
    'inpatientPrepaidRecords',
  ],
  needProfileComp: [ // 需要先选档案才能操作的场景
    'report', // 报告查询
    'signIn', // 预约签到
    'outpatientReturn', // 门诊退费
    // 'appoint/records', // 预约记录 无需选择就诊人，登陆即可
    'paymentRecord', // 消费记录
    'record', // 就诊记录
    'inpatientBillQuery', // 住院单查询
    'inpatientDaily', // 住院日清单
    'inpatientPrepaidRecords', // 住院预缴记录
    'InpatientOnlineRecharge', // 住院充值
    'OutpatientOnlineRecharge', // 门诊充值
    'PayDoctorAdvice',
    'PreRecordsList',
  ],
  // tagTypes: {
  //   NEAREST: 'nearest',
  //   LATEST: 'latest',
  //   FREQUENT: 'frequent',
  // },
  tagConfig: {
    nearest: { label: '离我最近', bgColor: '#4CD964', borderColor: '#4CD964' },
    latest: { label: '最近去过', bgColor: '#FF6600', borderColor: '#FF6600' },
    frequent: { label: '去的最多', bgColor: '#FF6600', borderColor: '#FF6600' },
    // 就诊类型
    clinicTypeNormal: { label: '普通门诊', bgColor: '#007AFF', borderColor: '#007AFF' },
    clinicTypeOther: { label: '', bgColor: '#FF3B30', borderColor: '#FF3B30' },
    // patientRelation
    patientRelationMeself: { label: '本人', bgColor: '#4CD964', borderColor: '#4CD964' },
    patientRelationOther: { label: '其他', bgColor: '#FF6600', borderColor: '#FF6600' },
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

export default config;
