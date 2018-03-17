import React from 'react';
import Global from './Global';

/**
 * 全局配置文件
 * for implement
 * @type {Object}
 */
const appId = 'com.lenovohit.msh';
const appUUID = '2c90a85c614a07ce01614a38f8d40004';
console.log('Global:', Global);
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
  ads: [
    'ad1',
    'ad2',
    'ad3',
    'ad4',
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
        id: 'hf01', state: '1', route: 'appoint/departments', name: '预约挂号', iconLib: '', icon: '',
        imgIcon: 'appAndReg', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
        passProps: {
          showCurrHospitalAndPatient: true,
          allowSwitchHospital: true,
          allowSwitchPatient: true,
        },
      },
      {
        id: 'hf02', state: '1', route: '', name: '充值缴费', iconLib: '', icon: '',
        imgIcon: 'payment', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
        passProps: {
          showCurrHospitalAndPatient: true,
          allowSwitchHospital: true,
          allowSwitchPatient: true,
          hideNavBarBottomLine: true,
        },
      },
      {
        id: 'hf03', state: '1', route: 'report', name: '报告查询', iconLib: '', icon: '',
        imgIcon: 'reports', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
        passProps: {
          showCurrHospitalAndPatient: true,
          allowSwitchHospital: true,
          allowSwitchPatient: true,
        },
      },
      {
        id: 'hf09', state: '1', route: '', name: '预约记录', iconLib: '', icon: '',
        imgIcon: 'appAndRegRecords', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
        passProps: {
          showCurrHospitalAndPatient: true,
          allowSwitchHospital: true,
          allowSwitchPatient: true,
        },
      },
      {
        id: 'hf08', state: '1', route: '', name: '来院签到', iconLib: '', icon: '',
        imgIcon: 'signIn', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
        passProps: {
          showCurrHospitalAndPatient: true,
          allowSwitchHospital: true,
          allowSwitchPatient: true,
        },
      },
      {
        id: 'hf13', state: '1', route: 'outpatientReturn', name: '门诊退费', iconLib: '', icon: '',
        imgIcon: 'signIn', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
        passProps: {
          showCurrHospitalAndPatient: true,
          allowSwitchHospital: true,
          allowSwitchPatient: true,
        },
      },
      {
        id: 'hf05', state: '1', route: '', name: '就诊记录', iconLib: '', icon: '',
        imgIcon: 'treatRecords', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
        passProps: {
          showCurrHospitalAndPatient: true,
          allowSwitchHospital: true,
          allowSwitchPatient: true,
        },
      },
      {
        id: 'hf04', state: '1', route: 'paymentRecord', name: '消费记录', iconLib: '', icon: '',
        imgIcon: 'paymentRecords', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
        passProps: {
          showCurrHospitalAndPatient: true,
          allowSwitchHospital: true,
          allowSwitchPatient: true,
          hideNavBarBottomLine: true,
        },
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
      {
        id: 'hf07', state: '1', route: 'news', name: '健康资讯', iconLib: '', icon: '',
        imgIcon: 'news', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
        passProps: {
          fkId: appId,
          fkType: 'H4',
          hideNavBarBottomLine: true,
          headerRight: (<div><span style={{ backgroundColor: 'red' }} >测试按钮</span></div>),
          showCurrHospitalAndPatient: true,
        },
      },
      {
        id: 'hf12', state: '1', route: 'inpatientPaymentRecord', name: '住院预缴记录', iconLib: '', icon: '',
        imgIcon: 'inpatientInfo', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
        passProps: {
          showCurrHospitalAndPatient: true,
          allowSwitchHospital: true,
          allowSwitchPatient: true,
        },
      },
      {
        id: 'hf10', state: '1', route: 'inpatientBillQuery', name: '住院单查询', iconLib: '', icon: '',
        imgIcon: 'inpatientInfo', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
        passProps: {
          showCurrHospitalAndPatient: true,
          allowSwitchHospital: true,
          allowSwitchPatient: true,
        },
      },
      {
        id: 'hf11', state: '1', route: 'inpatientDaily', name: '住院日清单', iconLib: '', icon: '',
        imgIcon: 'inpatientDailyBill', iconSize: 50, iconSmallSize: 26, color: '#5D5D5D', bgColor: '', borderColor: '',
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
      {
        id: 'me01', state: '1', route: '', name: '个人资料', iconLib: '', icon: '',
        imgIcon: 'inpatientDailyBill', iconSize: 26, iconSmallSize: 26, color: '', bgColor: '', borderColor: '',
        passProps: {
          showCurrHospitalAndPatient: false,
          allowSwitchHospital: false,
          allowSwitchPatient: false,
          hideNavBarBottomLine: false,
          headerRight: null,
        },
      },
      {
        id: 'me02', state: '1', route: '', name: '常用就诊人', iconLib: '', icon: '',
        imgIcon: 'inpatientDailyBill', iconSize: 26, iconSmallSize: 26, color: '', bgColor: '', borderColor: '',
        passProps: {
          showCurrHospitalAndPatient: false,
          allowSwitchHospital: false,
          allowSwitchPatient: false,
          hideNavBarBottomLine: false,
          headerRight: null,
        },
      },
      {
        id: 'me03', state: '1', route: '', name: '消息开关', iconLib: '', icon: '',
        imgIcon: 'inpatientDailyBill', iconSize: 26, iconSmallSize: 26, color: '', bgColor: '', borderColor: '', separator: true,
        passProps: {
          showCurrHospitalAndPatient: false,
          allowSwitchHospital: false,
          allowSwitchPatient: false,
          hideNavBarBottomLine: false,
          headerRight: null,
        },
      },
      {
        id: 'me04', state: '1', route: '', name: '联系我们', iconLib: '', icon: '',
        imgIcon: 'inpatientDailyBill', iconSize: 26, iconSmallSize: 26, color: '', bgColor: '', borderColor: '',
        passProps: {
          showCurrHospitalAndPatient: false,
          allowSwitchHospital: false,
          allowSwitchPatient: false,
          hideNavBarBottomLine: false,
          headerRight: null,
        },
      },
      {
        id: 'me05', state: '1', route: '', name: '反馈意见', iconLib: '', icon: '',
        imgIcon: 'inpatientDailyBill', iconSize: 26, iconSmallSize: 26, color: '', bgColor: '', borderColor: '',
        passProps: {
          showCurrHospitalAndPatient: false,
          allowSwitchHospital: false,
          allowSwitchPatient: false,
          hideNavBarBottomLine: false,
          headerRight: null,
        },
      },
      {
        id: 'me06', state: '1', route: '', name: '关于', iconLib: '', icon: '',
        imgIcon: 'inpatientDailyBill', iconSize: 26, iconSmallSize: 26, color: '', bgColor: '', borderColor: '',
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
    nearest: { label: '离我最近', bgColor: 'IOS_GREEN', borderColor: 'IOS_GREEN' },
    latest: { label: '最近去过', bgColor: 'ORANGE', borderColor: 'ORANGE' },
    frequent: { label: '去的最多', bgColor: 'ORANGE', borderColor: 'IOS_BLUE' },
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

export default config;
