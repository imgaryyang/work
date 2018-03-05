/**
 * 全局变量及参数
 */
import {
  Platform,
  Dimensions,
  PixelRatio,
} from 'react-native';
import _ from 'lodash';
import DeviceInfo from 'react-native-device-info';
import Toast from 'react-native-root-toast';

import * as Storage from './utils/Storage';
import { loadPatients } from './services/inpatientArea/InpatientArea';

class Global extends Object {
  static description = 'global variables & functions';

  // 屏幕方向 - 竖屏
  static ORIENTATION_PORTRAIT = 'PORTRAIT';
  // 屏幕方向 - 竖屏（头向下）
  static ORIENTATION_PORTRAITUPSIDEDOWN = 'PORTRAITUPSIDEDOWN';
  // 屏幕方向 - 横屏
  static ORIENTATION_LANDSCAPE = 'LANDSCAPE';

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

  /* 配置文件 */
  static Config = null;

  /**
   * 设备信息：
   * getAPILevel
   * getBrand
   * getBuildNumber
   * getBundleId
   * getDeviceCountry
   * getDeviceId
   * getDeviceLocale
   * getDeviceName
   * getFirstInstallTime
   * getIPAddress
   * getInstanceID
   * getLastUpdateTime
   * getMACAddress
   * getManufacturer
   * getModel
   * getPhoneNumber
   * getReadableVersion
   * getSerialNumber
   * getSystemName
   * getSystemVersion
   * getTimezone
   * getUniqueID
   * getUserAgent
   * getVersion
   * isEmulator
   * isPinOrFingerprintSet
   * isTablet
   * more infomation & API - https://github.com/rebeccahughes/react-native-device-info
   */
  static device = DeviceInfo;

  /* APP logo */
  static logo = null;

  // 设备操作系统
  static os = Platform.OS;
  static setOs = (os) => {
    Global.os = os;
  };

  // 设备像素密度
  static pixelRatio = PixelRatio.get();
  // 导航栏高度
  static navBarHeight = Platform.OS === 'ios' ? 64 : 44;
  // 线宽
  static lineWidth = 1 / Global.pixelRatio;

  /*
   * 设备实际屏幕属性
   * screen.width 屏幕宽度
   * screen.height 屏幕高度
  */
  static screen = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    tabWSHeight: Dimensions.get('window').height,
  };

  /*
   * 在初始场景中通过布局属性获得屏幕实际高度及宽度
   * 在0.16及以前版本中，Android系统下通过Dimensions获取的屏幕高度包含状态栏高度，
   * 而通过Layout获取的屏幕高度不包括状态栏高度，场景中使用到屏幕高度时，使用Layout
   * 获取的屏幕属性较为准确。0.17及以上版本是否存在此问题有待验证。
  */
  static setLayoutScreen = (layoutScreen) => {
    Global.screen = { ...Global.screen, ...layoutScreen };
  };
  static getScreen = () => {
    return Global.screen;
  };

  static user = null;
  static getUser = () => {
    return Global.user;
  };
  static setUser = (user) => {
    // console.log('user in Global.setUser():', user);
    Global.user = user;
    // 将用户信息放入本地存储
    Storage.setUser(user);
  };
  static clearUser = () => {
    Global.user = null;
    // 清空本地存储中的用户信息
    Storage.removeUser();
  };

  static currHospital = null;
  static getCurrHospital = () => {
    return Global.currHospital;
  };
  static setCurrHospital = (hospital) => {
    Global.currHospital = hospital;
    Storage.setCurrHospital(hospital);
  };

  static patients = null;
  static getPatients = () => {
    return Global.patients;
  };
  static setPatients = (patients) => {
    Global.patients = patients;
  };

  static currPatient = null;
  static getCurrPatient = () => {
    return Global.currPatient;
  };
  static setCurrPatient = (patient) => {
    Global.currPatient = patient;
    Storage.setCurrPatient(patient);
  };

  static menus = null;
  static getMenus = () => {
    return Global.menus;
  };
  static setMenus = (menus) => {
    Global.menus = menus;
  };

  static currArea = null;
  static getCurrArea = () => {
    return Global.currArea;
  };
  static setCurrArea = (area) => {
    Global.currArea = area;
    Storage.setCurrArea(area);
  };

  // 后台服务地址及请求超时时间
  static host = null;
  static getHost = () => {
    return _.endsWith(Global.host, '/') ? Global.host : `${Global.host}/`;
  };
  static setHost = (host) => {
    Global.host = host;
    // AsyncStorage.setItem(Global.ASK_HOST, Global.host);
    Storage.setHost(host);
  };
  static hostTimeout = 5000;
  static getHostTimeout = () => {
    return Global.hostTimeout;
  };
  static setHostTimeout = (hostTimeout) => {
    Global.hostTimeout = hostTimeout;
    // AsyncStorage.setItem(Global.ASK_HOST_TIMEOUT, `${Global.hostTimeout}`);
    Storage.setHostTimeout(hostTimeout);
  };

  // 用户当前位置
  static currArea = { code: '110100', name: '北京' };

  // 需要登录后才能访问的component
  static needLoginComp = [
    'HCTab',
    'Profile',
    'SecuritySettings',
    'AppAndRegRecords',
    'Reports',
    'PaymentRecords',
    'Records',
    'Patients',
    'Cards',
  ];

  // 常用颜色
  static colors = {
    NAV_BAR_LINE: 'rgba(204,204,204,1)', // '#CCCCCC',
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


  // 公用样式
  static styles = {
    CONTAINER: {
      flex: 1,
      backgroundColor: 'white',
      flexDirection: 'column',
    },
    CONTAINER_ROW: {
      flex: 1,
      backgroundColor: 'white',
      flexDirection: 'row',
    },
    INDICATOR_CONTAINER: {
      flex: 1,
      backgroundColor: 'white',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 100,
    },
    SAFE_VIEW: {
      flex: 1,
    },
    FIXED_BOTTOM_BTN_CONTAINER: {
      height: 50,
      backgroundColor: 'white',
      flexDirection: 'row',
      alignItems: 'center',
      borderTopColor: Global.colors.LINE,
      borderTopWidth: 1 / Global.pixelRatio,
    },
    PLACEHOLDER10: {
      backgroundColor: 'transparent',
      height: 10,
    },
    PLACEHOLDER15: {
      backgroundColor: 'transparent',
      height: 15,
    },
    PLACEHOLDER20: {
      backgroundColor: 'transparent',
      height: 20,
    },
    PLACEHOLDER40: {
      backgroundColor: 'transparent',
      height: 40,
    },
    ICON: {// 用于icon组件，此组件在Android下必须使用字体居中才能保证icon不偏移
      textAlign: 'center',
    },
    CENTER: {// 双向绝对居中
      alignItems: 'center',
      justifyContent: 'center',
    },
    BORDER: {
      borderColor: Global.colors.IOS_SEP_LINE,
      borderWidth: 1 / Global.pixelRatio,
    },
    SEP_LINE: {
      // width: getScreen().width - 15,
      marginLeft: 15,
      backgroundColor: Global.colors.IOS_SEP_LINE,
      height: 1 / Global.pixelRatio,
    },
    SEP_LINE_WITH_ICON: {
      // width: getScreen().width - 50,
      marginLeft: 50,
      backgroundColor: Global.colors.IOS_SEP_LINE,
      height: 1 / Global.pixelRatio,
    },
    FULL_SEP_LINE: {
      // width: getScreen().width,
      backgroundColor: Global.colors.IOS_SEP_LINE,
      height: 1 / Global.pixelRatio,
    },
    GRAY_BTN: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 40,
      flex: 1,
      backgroundColor: Global.colors.IOS_LIGHT_GRAY,
      borderRadius: 3,
      flexDirection: 'row',
    },
    BLUE_BTN: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 40,
      flex: 1,
      backgroundColor: Global.colors.IOS_BLUE,
      borderRadius: 3,
      flexDirection: 'row',
    },
    ORANGE_BTN: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 40,
      flex: 1,
      backgroundColor: Global.colors.ORANGE,
      borderRadius: 3,
    },
    LIST: {
      borderWidth: 1 / Global.pixelRatio,
      borderColor: Global.colors.IOS_SEP_LINE,
      borderLeftWidth: 0,
      borderRightWidth: 0,
    },
    GRAY_FONT: {
      fontSize: 13,
      color: Global.colors.FONT_GRAY,
    },
    CARD_TITLE: {
      borderBottomWidth: 1 / Global.pixelRatio,
      borderBottomColor: Global.colors.IOS_SEP_LINE,
      paddingTop: 8,
      paddingBottom: 8,
    },
    CARD_TITLE_TEXT: {
      fontSize: 15,
      color: 'black',
      fontWeight: '500',
    },
    CARD_CONTENT_TEXT: {
      fontSize: 14,
      color: Global.colors.FONT_GRAY,
      marginTop: 8,
      paddingBottom: 8,
      lineHeight: 18,
    },
    MSG_VIEW: {
      marginTop: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    MSG_TEXT: {
      fontSize: 17,
      color: Global.colors.FONT_LIGHT_GRAY1,
      textAlign: 'center',
      margin: 10,
    },
    NAV_BAR: {
      BAR: {
        width: Global.screen.width,
        height: Global.navBarHeight,
        borderTopWidth: 0,
        flexDirection: 'row',
        overflow: 'hidden',
      },
      FLOW_BAR: {
        position: 'absolute',
        top: 0,
        left: 0,
      },
      BUTTON_CONTAINER: {
        flexDirection: 'row',
        height: 44,
      },
      RIGHT_BUTTONS: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
      },
      BUTTON: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
      },
      BUTTON_ICON: {
        textAlign: 'center',
      },
      CENTER_VIEW: {
        height: Global.navBarHeight,
        paddingTop: (Global.os === 'ios' ? 20 : 0),
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1.5,
      },
      TITLE_TEXT: {
        flex: 1,
        fontSize: 16,
        color: '#000000',
        textAlign: 'center',
      },
    },
    TOOL_BAR: {
      BAR: {
        position: 'absolute',
        top: Global.navBarHeight,
        left: 0,
        width: Global.screen.width,
        height: 44,
        backgroundColor: Global.colors.IOS_NAV_BG,
        borderBottomWidth: 1 / Global.pixelRatio,
        borderBottomColor: Global.colors.IOS_NAV_LINE,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      },
      FIXED_BAR: {
        width: Global.screen.width,
        height: 44,
        backgroundColor: 'white', // Global.colors.IOS_NAV_BG,
        borderBottomWidth: 1 / Global.pixelRatio,
        borderBottomColor: Global.colors.IOS_NAV_LINE,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      },
      BOTTOM_BAR: {
        width: Global.screen.width,
        height: DeviceInfo.getModel() === 'iPhone X' ? (44 + 21) : 44,
        paddingBottom: DeviceInfo.getModel() === 'iPhone X' ? 21 : 0,
        backgroundColor: 'white', // Global.colors.IOS_NAV_BG,
        borderTopWidth: 1 / Global.pixelRatio,
        borderTopColor: Global.colors.IOS_NAV_LINE,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      },
      SEARCH_INPUT: Global.os === 'ios' ? {
        height: 30,
        fontSize: 13,
        borderRadius: 5,
        borderWidth: 1 / Global.pixelRatio,
        borderColor: Global.colors.IOS_NAV_LINE,
        backgroundColor: '#ffffff',
        paddingLeft: 5,
        paddingRight: 5,
      } : {
        height: 30,
        fontSize: 13,
      },
      SEARCH_INPUT_IOS: {
        borderRadius: 5,
        borderWidth: 1 / Global.pixelRatio,
        borderColor: Global.colors.IOS_NAV_LINE,
        backgroundColor: '#ffffff',
        paddingLeft: 5,
        paddingRight: 5,
      },
      BUTTON: {
        width: 50,
        height: 43,
      },
    },
    FORM: {
      TEXT_INPUT: Global.os === 'ios' ? {
        height: 35,
        fontSize: 13,
        borderRadius: 5,
        borderWidth: 1 / Global.pixelRatio,
        borderColor: Global.colors.IOS_SEP_LINE,
        backgroundColor: '#ffffff',
        paddingLeft: 5,
        paddingRight: 5,
      } : {
        height: 35,
        fontSize: 13,
      },
      NO_BORDER_TEXT_INPUT: {
        borderWidth: 0,
        backgroundColor: 'transparent',
        fontSize: 13,
        paddingLeft: 5,
        paddingRight: 5,
        height: 35,
      },
      GRAY_TEXT_INPUT: Global.os === 'ios' ? {
        height: 35,
        fontSize: 13,
        borderRadius: 5,
        borderWidth: 0,
        backgroundColor: Global.colors.IOS_GRAY_BG,
        paddingLeft: 5,
        paddingRight: 5,
      } : {
        height: 35,
        fontSize: 13,
        borderRadius: 5,
        borderWidth: 0,
        backgroundColor: Global.colors.IOS_GRAY_BG,
        paddingLeft: 5,
        paddingRight: 5,
      },
    },
    ACCT: {
      OPTION_ROW: {
        flexDirection: 'row',
        padding: 5,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        paddingRight: 10,
      },
      OPTION_BTN: {
        padding: 3,
        paddingRight: 10,
        paddingLeft: 10,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Global.colors.IOS_SEP_LINE,
        borderWidth: 1 / Global.pixelRatio,
        borderRadius: 3,
      },
      OPTION_BTN_TEXT: {
        fontSize: 10,
        color: Global.colors.IOS_GRAY_FONT,
        textAlign: 'center',
      },
    },
    CARD: {
      flex: 1,
      backgroundColor: '#ffffff',
      borderColor: Global.colors.IOS_SEP_LINE,
      borderWidth: 1 / Global.pixelRatio,
      borderRadius: 3,
      padding: 10,
    },
    ICON_HOLDER: {
      width: 30,
      height: 30,
      borderRadius: 5,
    },
  };
}

Global.guid = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  // return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

/**
 * 将系统配置文件放入Global
 * @param config
 */
Global.setConfig = (config) => {
  // console.log(config);
  Global.Config = config;

  // Global.ASK_HOST = `@AsyncStorage.${Global.Config.APP_ID}${Global.ASK_HOST}`;
  // Global.ASK_HOST_TIMEOUT = `@AsyncStorage.${Global.Config.APP_ID}${Global.ASK_HOST_TIMEOUT}`;
  // Global.ASK_USER = `@AsyncStorage.${Global.Config.APP_ID}${Global.ASK_USER}`;

  Global.host = config.host;
  Global.hostTimeout = config.hostTimeout;
  Global.mode = config.mode;
  Global.edition = config.edition;
  Global.logo = config.logo;
  Global.menus = config.menus;
};

/**
 * 系统初始化
 */
export async function init() {
  try {
    const userInAS = await Storage.getUser();// AsyncStorage.getItem(Global.ASK_USER);
    const hostInAS = await Storage.getHost();// AsyncStorage.getItem(Global.ASK_HOST);
    const hostTimeoutInAS = await Storage.getHostTimeout();// AsyncStorage.getItem(Global.ASK_HOST_TIMEOUT);
    const currHospitalInAS = await Storage.getCurrHospital();
    const currAreaInAs = await Storage.getCurrArea();

    // console.log('....... userInAS:', userInAS);
    // console.log('....... hostInAS:', hostInAS);
    // console.log('....... hostTimeoutInAS:', hostTimeoutInAS);
    // 将取出的用户对象放置到flux store中
    if (userInAS !== null) {
      Global.user = userInAS;
    }
    if (currHospitalInAS !== null) {
      Global.currHospital = currHospitalInAS;
    }
    if (currAreaInAs !== null) {
      Global.currArea = currAreaInAs;
    }

    // 从持久化数据中取host，如果没有，则将Global中初始化的host持久化
    if (hostInAS === null) {
      await Storage.setHost(Global.host); // AsyncStorage.setItem(Global.ASK_HOST, Global.host);
    } else {
      Global.host = hostInAS;
    }

    // 从持久化数据中取hostTimeout，如果没有，则将Global中初始化的hostTimeout持久化
    if (hostTimeoutInAS === null) {
      await Storage.setHostTimeout(Global.hostTimeout); // AsyncStorage.setItem(Global.ASK_HOST_TIMEOUT, `${Global.hostTimeout}`);
    } else {
      Global.hostTimeout = hostTimeoutInAS;
    }

    if (userInAS !== null) {
      // 取患者信息
      const patientsData = await loadPatients();
      if (patientsData.success) {
        Global.patients = patientsData.result;
      } else {
        Toast.show('取患者列表出错');
      }
    }

    return true;
  } catch (e) {
    console.log('error in Global.init():');
    console.log(e);
    return false;
  }
}

export default Global;
