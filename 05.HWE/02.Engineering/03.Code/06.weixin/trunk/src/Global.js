
/**
 * 全局变量及参数
 */
// import config from './Config';
// import _ from 'lodash';

class Global extends Object {
  static description = 'global variables & functions';

  /* 运行模式 */
  // 开发模式
  static MODE_DEV = 'development';
  // 生产模式
  static MODE_PRO = 'production';
  static mode = Global.MODE_DEV;

  /* 版本 */
  // 单医院版
  static EDITION_SINGLE = 'single';
  // 多医院版
  static EDITION_MULTI = 'multi';
  static edition = Global.EDITION_MULTI;
  static getEditionDesc() {
    return Global.edition === Global.EDITION_MULTI ? '多医院版' : '单医院版';
  }
  static setEdition(edition) {
    Global.edition = edition;
  }

  /**
   * 验证码类型
   * @type {{REG_APP: string, REG_WX: string, REG_ZFB: string, REG_WEB: string}}
   */
  static securityCodeType = {
    REG_APP: 'REG_APP', // APP登录
    REG_WX: 'REG_WX', // 微信登录
    REG_ZFB: 'REG_ALIPAY', // 支付宝登录
    REG_WEB: 'REG_WEB', // 网页登录
    BIND_PROFILE: 'BIND_PROFILE', // 绑定his档案
  };

  /**
   * 用户习惯数据类型
   * @type {{CURR_HOSPITAL: string, CURR_PATIENT: string, CURR_PROFILE: string}}
   */
  static habitsType = {
    CURR_HOSPITAL: 'CURR_HOSPITAL',
    CURR_PATIENT: 'CURR_PATIENT',
    CURR_PROFILE: 'CURR_PROFILE',
  };

  static relations = {
    0: '本人',
    1: '父母',
    2: '夫妻',
    3: '子女',
    4: '其他',
  };

  /* 配置文件 */
  static Config = null;

  /* APP logo */
  static logo = null;

  // 设备操作系统
  static os = null;
  static setOs = (os) => {
    Global.os = os;
  };

  // 导航栏高度
  static navBarHeight = 44;

  static currHospital = null;
  static getCurrHospital = () => {
    return Global.currHospital;
  };
  static setCurrHospital = (hospital) => {
    Global.currHospital = hospital;
  };
  static clearCurrHospital = () => {
    Global.currHospital = null;
  };

  static currPatient = null;
  static getCurrPatient = () => {
    return Global.currPatient;
  };
  static setCurrPatient = (patient) => {
    Global.currPatient = patient;
  };
  static clearCurrPatient = () => {
    Global.currPatient = null;
  };


  // 用户当前位置
  static currArea = null; // { code: '110100', name: '北京' };
  static getCurrArea = () => {
    return Global.currArea;
  };
  static setCurrArea = (area) => {
    Global.currArea = area;
  };

  // 后台服务地址及请求超时时间
  // static host = null;
  // static getHost = () => {
  //   return _.endsWith(Global.host, '/') ? Global.host : `${Global.host}/`;
  // };
  // static setHost = (host) => {
  //   Global.host = host;
  // };

  // static getImageHost = () => {
  //   return _.endsWith(Global.host, '/') ? Global.host : `${Global.host.replace('api/hwe', 'images/')}`;
  // };

  static hostTimeout = 5000;
  static getHostTimeout = () => {
    return Global.hostTimeout;
  };
  static setHostTimeout = (hostTimeout) => {
    Global.hostTimeout = hostTimeout;
  };
}

/**
 * 将系统配置文件放入Global
 * @param config
 */
Global.setConfig = (config) => {
  Global.Config = config;

  // Global.host = config.host;
  Global.hostTimeout = config.hostTimeout;
  Global.mode = config.mode;
  Global.edition = config.edition;
  Global.logo = Global.Config.logo;
};

export default Global;
