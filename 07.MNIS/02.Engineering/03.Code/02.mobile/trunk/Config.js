/**
 * 全局配置文件
 * for implement
 * @type {Object}
 */
import _ from 'lodash';

const config = Object.freeze({
  appId: 'com.lenovohit.msh',
  app: '智慧医院',
  hospId: '',
  hospital: {},
  host: 'http://172.16.41.147:9600/api/mnis',
  hostTimeout: 5000,
  mode: 'production',
  edition: 'multi',
  logo: {
    l: require('./application/assets/images/logo/logo-l.png'), // 大
    m: require('./application/assets/images/logo/logo-m.png'), // 中
    s: require('./application/assets/images/logo/logo-s.png'), // 小
    lw: require('./application/assets/images/logo/logo-l-white.png'), // 大 - 白色
    mw: require('./application/assets/images/logo/logo-m-white.png'), // 中 - 白色
    sw: require('./application/assets/images/logo/logo-s-white.png'), // 小 - 白色
  },
  // ['#4dc7ee', '#2bd3c2', '#ff80c3', '#ff6666', '#ffcf2f', '#8b8ffa']
  menus: {
    doctor: {
      inpatientArea: [
        { id: 'a98', state: '1', route: 'CameraTest', name: '拍照', iconLib: 'mi', icon: 'camera-enhance', iconSize: 50, iconSmallSize: 26, img: '', color: '#ffffff', bgColor: '#2bd3c2', devMode: true },
        { id: 'a99', state: '1', route: 'ScannerTest', name: '扫一扫', iconLib: 'mi', icon: 'settings-overscan', iconSize: 50, iconSmallSize: 26, img: '', color: '#ffffff', bgColor: '#2bd3c2', devMode: true },
        { id: 'a9x', state: '1', route: 'SampleMenu', name: '样例', iconLib: 'mi', icon: 'flash-on', iconSize: 50, iconSmallSize: 26, img: '', color: '#ffffff', bgColor: '#ffcf2f', devMode: true },
      ],
      sickbed: [
        { id: 'b05', state: '1', route: '', name: 'LIS查询', iconLib: 'mi', icon: 'subtitles', iconSize: 50, iconSmallSize: 26, img: '', color: '#ffffff', bgColor: '#ff6666' },
        { id: 'b06', state: '1', route: '', name: 'PACS查询', iconLib: 'mi', icon: 'image', iconSize: 50, iconSmallSize: 26, img: '', color: '#ffffff', bgColor: '#8b8ffa' },
        { id: 'b07', state: '1', route: '', name: '医生医嘱', iconLib: 'mi', icon: 'assignment-ind', iconSize: 50, iconSmallSize: 26, img: '', color: '#ffffff', bgColor: '#4dc7ee' },
        { id: 'b08', state: '1', route: '', name: '电子病历', iconLib: 'mi', icon: 'contact-mail', iconSize: 50, iconSmallSize: 26, img: '', color: '#ffffff', bgColor: '#2bd3c2' },
        { id: 'b09', state: '1', route: '', name: '体征查询', iconLib: 'mi', icon: 'equalizer', iconSize: 50, iconSmallSize: 26, img: '', color: '#ffffff', bgColor: '#ff80c3' },
        { id: 'b10', state: '1', route: '', name: '手术', iconLib: 'mi', icon: 'content-cut', iconSize: 50, iconSmallSize: 26, img: '', color: '#ffffff', bgColor: '#ffcf2f' },
        // { id: 'a98', state: '1', route: 'CameraTest', name: '拍照', iconLib: 'mi', icon: 'camera-enhance', iconSize: 50, iconSmallSize: 26, img: '', color: '#ffffff', bgColor: '#2bd3c2', devMode: true },
        // { id: 'a99', state: '1', route: 'ScannerTest', name: '扫一扫', iconLib: 'mi', icon: 'settings-overscan', iconSize: 50, iconSmallSize: 26, img: '', color: '#ffffff', bgColor: '#2bd3c2', devMode: true },
        // { id: 'a9x', state: '1', route: 'SampleMenu', name: '样例', iconLib: 'mi', icon: 'flash-on', iconSize: 50, iconSmallSize: 26, img: '', color: '#ffffff', bgColor: '#ffcf2f', devMode: true },
      ],
    },
    nurse: {
      inpatientArea: [
        { id: 'a01', state: '1', route: '', name: '交班', iconLib: 'mi', icon: 'swap-calls', iconSize: 50, iconSmallSize: 26, img: '', color: '#ffffff', bgColor: '#4dc7ee' },
        { id: 'a98', state: '1', route: 'CameraTest', name: '拍照', iconLib: 'mi', icon: 'camera-enhance', iconSize: 50, iconSmallSize: 26, img: '', color: '#ffffff', bgColor: '#2bd3c2', devMode: true },
        { id: 'a99', state: '1', route: 'ScannerTest', name: '扫一扫', iconLib: 'mi', icon: 'settings-overscan', iconSize: 50, iconSmallSize: 26, img: '', color: '#ffffff', bgColor: '#2bd3c2', devMode: true },
        { id: 'a9x', state: '1', route: 'SampleMenu', name: '样例', iconLib: 'mi', icon: 'flash-on', iconSize: 50, iconSmallSize: 26, img: '', color: '#ffffff', bgColor: '#ffcf2f', devMode: true },
      ],
      sickbed: [
        { id: 'b01', state: '1', route: 'InfusionExec', name: '输液执行', iconLib: 'mi', icon: 'opacity', iconSize: 50, iconSmallSize: 26, img: '', color: '#ffffff', bgColor: '#4dc7ee' },
        { id: 'b02', state: '1', route: 'OralMedicineExec', name: '口服药', iconLib: 'mi', icon: 'format-color-fill', iconSize: 50, iconSmallSize: 26, img: '', color: '#ffffff', bgColor: '#2bd3c2' },
        { id: 'b03', state: '1', route: 'PhysicalSignCapture', name: '体征录入', iconLib: 'mi', icon: 'poll', iconSize: 50, iconSmallSize: 26, img: '', color: '#ffffff', bgColor: '#ff80c3' },
        { id: 'b04', state: '1', route: 'LabTestExec', name: '化验执行', iconLib: 'mi', icon: 'local-drink', iconSize: 50, iconSmallSize: 26, img: '', color: '#ffffff', bgColor: '#ffcf2f' },
        { id: 'b05', state: '1', route: 'LabTestResult', name: '化验查询', iconLib: 'mi', icon: 'subtitles', iconSize: 50, iconSmallSize: 26, img: '', color: '#ffffff', bgColor: '#ff6666' },
        { id: 'b06', state: '1', route: 'LabPacsResult', name: '检查查询', iconLib: 'mi', icon: 'image', iconSize: 50, iconSmallSize: 26, img: '', color: '#ffffff', bgColor: '#8b8ffa' },
        // { id: 'b07', state: '1', route: '', name: '医生医嘱', iconLib: 'mi', icon: 'assignment-ind', iconSize: 50, iconSmallSize: 26, img: '', color: '#ffffff', bgColor: '#4dc7ee' },
        // { id: 'b08', state: '1', route: '', name: '电子病历', iconLib: 'mi', icon: 'contact-mail', iconSize: 50, iconSmallSize: 26, img: '', color: '#ffffff', bgColor: '#2bd3c2' },
        { id: 'b09', state: '1', route: 'PhysicalSignCaptureHis2', name: '体征查询', iconLib: 'mi', icon: 'equalizer', iconSize: 50, iconSmallSize: 26, img: '', color: '#ffffff', bgColor: '#ff80c3' },
        { id: 'b10', state: '1', route: 'Operation', name: '手术', iconLib: 'mi', icon: 'content-cut', iconSize: 50, iconSmallSize: 26, img: '', color: '#ffffff', bgColor: '#ffcf2f' },
        // { id: 'b11', state: '1', route: '', name: '护理病历', iconLib: 'mi', icon: 'beach-access', iconSize: 50, iconSmallSize: 26, img: '', color: '#ffffff', bgColor: '#8b8ffa' },
        // { id: 'a98', state: '1', route: 'CameraTest', name: '拍照', iconLib: 'mi', icon: 'camera-enhance', iconSize: 50, iconSmallSize: 26, img: '', color: '#ffffff', bgColor: '#2bd3c2', devMode: true },
        // { id: 'a99', state: '1', route: 'ScannerTest', name: '扫一扫', iconLib: 'mi', icon: 'settings-overscan', iconSize: 50, iconSmallSize: 26, img: '', color: '#ffffff', bgColor: '#2bd3c2', devMode: true },
        // { id: 'b99', state: '1', route: '', name: '样例', iconLib: 'mi', icon: 'flash-on', iconSize: 50, iconSmallSize: 26, img: '', color: '#ffffff', bgColor: '#ffcf2f', devMode: true },
      ],
    },
  },
  // 系统配置
  // 全局
  global: {
    funcBarcodeSupport: false, // 是否支持功能条码
    funcBarcodeRule: (barcode) => {
      if (barcode) {
        // console.log(barcode, barcode.length);
        if (barcode.length === 8 && _.startsWith(barcode, '6')) { // 输液
          return { type: 'infusion' };
        } else if (barcode.length === 10) { // 化验
          return { type: 'test' };
        } else {
          return null;
        }
      } else {
        return null;
      }
    }, // 功能条码规则
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
