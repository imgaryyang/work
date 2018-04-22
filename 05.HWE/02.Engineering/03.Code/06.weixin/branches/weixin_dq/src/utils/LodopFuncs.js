const { userAgent, platform } = navigator;

let CreatedOKLodop7766 = null;

const LODOP_OB_ID = 'LODOP_OB';
const LODOP_EM_ID = 'LODOP_EM';

function getLodop() {
  /**
   * 本函数根据浏览器类型决定采用哪个页面元素作为Lodop对象：
   * IE系列、IE内核系列的浏览器采用oOBJECT，
   * 其它浏览器(Firefox系列、Chrome系列、Opera系列、Safari系列等)采用oEMBED,
   * 如果页面没有相关对象元素，则新建一个或使用上次那个,避免重复生成。
   * 64位浏览器指向64位的安装程序install_lodop64.exe。
   */
  if (platform === 'MacIntel') {
    return;
  }
  const strHtmInstall = '<br><font color=\'#f56a00\'>打印控件未安装!点击这里<a href=\'install_lodop32.exe\' target=\'_self\'>执行安装</a>,安装后请刷新页面或重新进入。</font>';
  const strHtmUpdate = '<br><font color=\'#f56a00\'>打印控件需要升级!点击这里<a href=\'install_lodop32.exe\' target=\'_self\'>执行升级</a>,升级后请重新进入。</font>';
  const strHtm64Install = '<br><font color=\'#f56a00\'>打印控件未安装!点击这里<a href=\'install_lodop64.exe\' target=\'_self\'>执行安装</a>,安装后请刷新页面或重新进入。</font>';
  const strHtm64Update = '<br><font color=\'#f56a00\'>打印控件需要升级!点击这里<a href=\'install_lodop64.exe\' target=\'_self\'>执行升级</a>,升级后请重新进入。</font>';
  const strHtmFireFox = '<br><br><font color=\'#f56a00\'>（注意：如曾安装过Lodop旧版附件npActiveXPLugin,请在【工具】->【附加组件】->【扩展】中先卸它）</font>';
  const strHtmChrome = '<br><br><font color=\'#f56a00\'>(如果此前正常，仅因浏览器升级或重安装而出问题，需重新执行以上安装）</font>';
  let LODOP = '';
  const oOBJECT = document.getElementById(LODOP_OB_ID);
  const oEMBED = document.getElementById(LODOP_EM_ID);
  // 判断浏览器类型
  const isIE = (userAgent.indexOf('MSIE') >= 0) || (userAgent.indexOf('Trident') >= 0);
  const is64IE = isIE && (userAgent.indexOf('x64') >= 0);
  try {
    // 如果页面有Lodop就直接使用，没有则新建
    if (oOBJECT !== undefined || oEMBED !== undefined) {
      if (isIE) {
        LODOP = oOBJECT;
      } else {
        LODOP = oEMBED;
      }
    } else if (CreatedOKLodop7766 == null) {
      LODOP = document.createElement('object');
      LODOP.setAttribute('width', 0);
      LODOP.setAttribute('height', 0);
      LODOP.setAttribute('style', 'position:absolute;left:0px;top:-100px;width:0px;height:0px;');
      if (isIE) {
        LODOP.setAttribute('classid', 'clsid:2105C259-1E0C-4534-8141-A753534CB4CA');
      } else {
        LODOP.setAttribute('type', 'application/x-print-lodop');
      }
      document.documentElement.appendChild(LODOP);
      CreatedOKLodop7766 = LODOP;
    } else {
      LODOP = CreatedOKLodop7766;
    }
    if (userAgent.indexOf('Win64') >= 0 || userAgent.indexOf('wow64') >= 0 || userAgent.indexOf('x64') >= 0) {
      return LODOP;
    }

    // =====判断Lodop插件是否安装过，没有安装或版本过低就提示下载安装:==========
    if ((LODOP === null) || (typeof (LODOP.VERSION) === 'undefined')) {
      if (userAgent.indexOf('Chrome') >= 0) {
        document.documentElement.innerHTML = strHtmChrome + document.documentElement.innerHTML;
      }
      if (userAgent.indexOf('Firefox') >= 0) {
        document.documentElement.innerHTML = strHtmFireFox + document.documentElement.innerHTML;
      }
      if (is64IE) {
        document.write(strHtm64Install);
      } else if (isIE) {
        document.write(strHtmInstall);
      } else {
        document.documentElement.innerHTML = strHtmInstall + document.documentElement.innerHTML;
      }
      return LODOP;
    } else if (LODOP.VERSION < '6.1.9.8') {
      if (is64IE) {
        document.write(strHtm64Update);
      } else if (isIE) {
        document.write(strHtmUpdate);
      } else {
        document.documentElement.innerHTML = strHtmUpdate + document.documentElement.innerHTML;
      }
      return LODOP;
    }
    // =====如下空白位置适合调用统一功能(如注册码、语言选择等):====

    LODOP.SET_LICENSES('北京联想智慧医疗信息技术有限公司', 'BEBE8A01D6D982EB566A294D4D199065', '', '');
    // LODOP.SET_LICENSES('公司名称','注册号XXXXXXXXXXXXXXXXX','','');

    // ============================================================
    return LODOP;
  } catch (err) {
    if (is64IE) {
      document.documentElement.innerHTML = `Error: ${strHtm64Install} ${document.documentElement.innerHTML}`;
    } else {
      document.documentElement.innerHTML = `Error: ${strHtmInstall} ${document.documentElement.innerHTML}`;
    }
    return LODOP;
  }
}

const util = {
  getLodop,
};

export default util;
