/**
 * Routes for stack navigator
 */

import NavigatorWrappingScreen from './TabNavigation';

// components of me
import Profile from '../components/me/Profile';
import Portrait from '../components/me/Portrait';
import EditProfile from '../components/me/EditProfile';
import ContactUs from '../components/me/ContactUs';
import AboutUs from '../components/me/AboutUs';
import Suggest from '../components/me/Suggest';
import Login from '../components/me/Login';
import ResetPwd from '../components/me/ResetPwd';
import Register from '../components/me/Register';
import ChangePwd from '../components/me/ChangePwd';

// components of common
import CameraRollView from '../components/common/CameraRollView';
import NewsList from '../components/news/NewsList';
import NewsContent from '../components/news/NewsContent';
// components of others
import SettingsForTest from '../components/SettingsForTest';

// components of samples
import SampleMenu from '../components/tmpl/sample/SampleMenu';
import SampleList from '../components/tmpl/sample/SampleList';
import SampleEdit from '../components/tmpl/sample/SampleEdit';
import JPush from '../components/common/JPush';
import EasyFormTest1 from '../components/tmpl/sample/EasyFormTest1';
import LineInputsFormTest from '../components/tmpl/sample/LineInputsFormTest';
import LineInputsFormTest1 from '../components/tmpl/sample/LineInputsFormTest1';
import ComponentTest from '../components/tmpl/sample/ComponentTest';
import CameraTest from '../components/tmpl/sample/CameraTest';
import ScannerTest from '../components/tmpl/sample/ScannerTest';
import Scanner from '../components/common/Scanner';

import LabTestExec from '../components/sickbed/LabTestExec';
import InfusionExec from '../components/sickbed/InfusionExec';
import OralMedicineExec from '../components/sickbed/OralMedicineExec';
import PhysicalSignCapture from '../components/sickbed/PhysicalSignCapture';
import PhysicalSignCaptureHis from '../components/sickbed/PhysicalSignCaptureHis';
import PhysicalSignCaptureHis2 from '../components/sickbed/PhysicalSignCaptureHis2';

import LabTestResult from '../components/sickbed/LabTestResult';
import LabTestResultDetail from '../components/sickbed/LabTestResultDetail';
import LabPacsResult from '../components/sickbed/LabPacsResult';
import LabPacsResultDetail from '../components/sickbed/LabPacsResultDetail';
import Operation from '../components/sickbed/Operation';
import OperationDetail from '../components/sickbed/OperationDetail';

export default {
  Root: { screen: NavigatorWrappingScreen },
  Login: { screen: Login }, // 登录
  // components of 病区业务
  // components of 床旁业务
  LabTestExec: { screen: LabTestExec }, // 化验执行
  LabTestResult: { screen: LabTestResult }, // 化验查询
  LabTestResultDetail: { screen: LabTestResultDetail }, // 化验查询明细
  LabPacsResult: { screen: LabPacsResult }, // 检查查询
  LabPacsResultDetail: { screen: LabPacsResultDetail }, // 检查查询明细
  InfusionExec: { screen: InfusionExec }, // 输液执行
  OralMedicineExec: { screen: OralMedicineExec }, // 口服药执行
  PhysicalSignCapture: { screen: PhysicalSignCapture }, // 体征采集
  PhysicalSignCaptureHis: { screen: PhysicalSignCaptureHis }, // 体征查询
  PhysicalSignCaptureHis2: { screen: PhysicalSignCaptureHis2 }, // 体征查询2
  Operation: { screen: Operation }, // 手术查询
  OperationDetail: { screen: OperationDetail }, // 手术查询明细

  // components of me
  Profile: { screen: Profile }, // 个人资料
  Portrait: { screen: Portrait }, // 头像
  EditProfile: { screen: EditProfile }, // 修改个人资料
  ContactUs: { screen: ContactUs }, // 联系我们
  AboutUs: { screen: AboutUs }, // 关于我们
  Suggest: { screen: Suggest }, // 投诉建议
  ResetPwd: { screen: ResetPwd }, // 重置密码
  Register: { screen: Register }, // 用户注册
  ChangePwd: { screen: ChangePwd }, // 修改密码
  // components of common
  CameraRollView: { screen: CameraRollView }, // 选择照片
  NewsList: { screen: NewsList }, // 公用新闻组件
  NewsContent: { screen: NewsContent }, // 公用新闻详情组件
  Scanner: { screen: Scanner }, // 扫一扫
  // components of others
  SettingsForTest: { screen: SettingsForTest }, // 设置
  // components of samples
  SampleMenu: { screen: SampleMenu }, // 样例
  SampleList: { screen: SampleList }, // 列表测试
  SampleEdit: { screen: SampleEdit }, // 表单测试
  JPush: { screen: JPush }, // 接收推送
  EasyFormTest1: { screen: EasyFormTest1 },
  LineInputsFormTest: { screen: LineInputsFormTest },
  LineInputsFormTest1: { screen: LineInputsFormTest1 },
  ComponentTest: { screen: ComponentTest }, // 组件测试
  CameraTest: { screen: CameraTest }, // 拍照测试
  ScannerTest: { screen: ScannerTest }, // 扫码测试
};
