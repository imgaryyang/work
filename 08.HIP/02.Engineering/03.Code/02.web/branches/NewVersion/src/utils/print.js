/* eslint no-eval: 0 */
import _ from 'lodash';
import { notification } from 'antd';
import './eventUtil';
import './baseUtil';

const { userAgent, platform } = navigator;

/**
 * @Author xlbd
 * @Desc print.js Lodop 打印公共函数
 */

const needCLodop = () => {
  try {
    const ua = userAgent;
    if (ua.match(/Windows\sPhone/i) != null) return true;
    if (ua.match(/iPhone|iPod/i) != null) return true;
    if (ua.match(/Android/i) != null) return true;
    if (ua.match(/Edge\D?\d+/i) != null) return true;

    const x64 = ua.match(/x64/i);
    const verIE = ua.match(/MSIE\D?\d+/i);
    let verOPR = ua.match(/OPR\D?\d+/i);
    let verFF = ua.match(/Firefox\D?\d+/i);
    let verChrome = ua.match(/Chrome\D?\d+/i);
    const verTrident = ua.match(/Trident\D?\d+/i);
    if ((verTrident == null) && (verIE == null) && (x64 !== null)) {
      return true;
    } else if (verFF !== null) {
      verFF = verFF[0].match(/\d+/);
      if ((verFF[0] >= 42) || (x64 !== null)) return true;
    } else if (verOPR !== null) {
      verOPR = verOPR[0].match(/\d+/);
      if (verOPR[0] >= 32) return true;
    } else if ((verTrident == null) && (verIE == null)) {
      if (verChrome !== null) {
        verChrome = verChrome[0].match(/\d+/);
        if (verChrome[0] >= 42) return true;
      }
    }
    return false;
  } catch (err) {
    return true;
  }
};

const injectCLodop = new Promise((resolve, reject) => {
  if (needCLodop()) {
    const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
    let oscript = document.createElement('script');
    oscript.src = 'http://localhost:8000/CLodopfuncs.js?priority=1';
    head.insertBefore(oscript, head.firstChild);

    // 引用双端口(8000和18000）避免其中某个被占用：
    oscript = document.createElement('script');
    oscript.src = 'http://localhost:18000/CLodopfuncs.js?priority=0';
    head.insertBefore(oscript, head.firstChild);
    resolve(true);
  } else {
    reject(false);
  }
});

const getLodop = () => injectCLodop.then(() => window.CLODOP);

const checkPrint = async () => {
  /**
   * 略过Mac
   */
  if (platform === 'MacIntel') {
    return;
  }

  const LODOP = await getLodop();

  if (_.isUndefined(LODOP)) {
    notification.error({
      message: '提示信息：',
      description: 'CLodop云打印服务(localhost本地)未启动！',
    });
    return false;
  } else {
    return true;
  }
};

const sendPrint = async (template, data, map) => {
  const isReady = await checkPrint();
  if (isReady) {
    // console.group('lodop print group');
    // console.log(template);
    // console.log(data);
    // console.log(map);
    // console.groupEnd('lodop print group');
    eval(template);
  }
};

const print = {
  injectCLodop,
  getLodop,
  checkPrint,
  sendPrint,
};

export default print;
