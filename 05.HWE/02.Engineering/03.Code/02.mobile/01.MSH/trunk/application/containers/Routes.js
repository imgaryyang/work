/**
 * Routes for stack navigator
 */

import NavigatorWrappingScreen from './TabNavigation';

// components of me
import ContactUs from '../components/me/ContactUs';
import AboutUs from '../components/me/AboutUs';
import Suggest from '../components/me/Suggest';

// components of me/cards
import Cards from '../components/me/cards/Cards';

// components of me/login
import Login from '../components/me/login/Login';
import LoginBySMS from '../components/me/login/LoginBySMS';
import ResetPwd from '../components/me/login/ResetPwd';
import Register from '../components/me/login/Register';
import ChangePwd from '../components/me/login/ChangePwd';

// components of me/profile
import Profile from '../components/me/profile/Profile';
import EditProfile from '../components/me/profile/EditProfile';
import Portrait from '../components/me/profile/Portrait';

// components of me/patients
import Patients from '../components/me/patients/Patients';
import ChoosePatient from '../components/me/patients/ChoosePatient'; // 选择就诊人组件
import EditPatientInfo from '../components/me/patients/EditPatientInfo'; // 新增/修改就诊人
import PatientInfo from '../components/me/patients/PatientInfo'; // 就诊人信息及档案列表
import BindProfile from '../components/me/patients/BindProfile'; // 档案绑定

// import PatientList from '../components/me/patients/PatientList';
// import AddPatient from '../components/me/patients/AddPatient'; // 多医院
// import AddPatientSingle from '../components/me/patients/AddPatientSingle'; // 单医院
// import EditPatient from '../components/me/patients/EditPatient';
// import EditMyPatient from '../components/me/patients/EditMyPatient';
// import ChangePatient from '../components/me/patients/ChangePatient';
// import BindArchives from '../components/me/patients/BindArchives';
// import Identify from '../components/me/patients/Identify';
// import Identify2 from '../components/me/patients/Identify2';
// import ArchivesList2 from '../components/me/patients/ArchivesList2';
// import AddArchives from '../components/me/patients/AddArchives';

// components of hospital
import HospitalList from '../components/hospital/HospitalList';
import Hospital from '../components/hospital/Hospital';
import Department from '../components/hospital/Department';
import Doctor from '../components/hospital/Doctor';

// components of appointment 预约
import AppointRecordsMain from '../components/outpatient/appointment/AppointRecordsMain';
import SignMain from '../components/outpatient/appointment/SignMain';
import SignReceipt from '../components/outpatient/appointment/SignReceipt';
import AppAndReg from '../components/outpatient/appointment/AppAndReg';
import Schedule from '../components/outpatient/appointment/Schedule';
import AppointSource from '../components/outpatient/appointment/AppointSource';
import Appoint from '../components/outpatient/appointment/Appoint';
import AppointSuccess from '../components/outpatient/appointment/AppointSuccess';

// components of reports 检查检验单
import Reports from '../components/reports/Reports';
import LisDetail from '../components/reports/LisDetail';
import PacsDetail from '../components/reports/PacsDetail';

// components of records 报告单
import Records from '../components/records/Records';
import RecordDetails from '../components/records/RecordDetails';
import DiagnoseDetails from '../components/records/DiagnoseDetails';
import RecipeDetails from '../components/records/RecipeDetails';
import TestDetails from '../components/records/TestDetails';

// components of community 社区
import ConsultRecords from '../components/community/consult/ConsultRecords';
import SelectDept from '../components/community/consult/SelectDept';
import DoctorList from '../components/community/consult/DoctorList';
import EditConsult from '../components/community/consult/EditConsult';
import EditReply from '../components/community/consult/EditReply';
import ConsultDetail from '../components/community/consult/ConsultDetail';

// components of payment 支付
import PaymentMain from '../components/pay/PaymentMain';
import CompletePaySuccess from '../components/pay/CompletePaySuccess';
import OnlineRecharge from '../components/pay/OnlineRecharge';
import CompletePayFailure from '../components/pay/CompletePayFailure';
import PaymentChargeDetail from '../components/payment/advicePaymentBySelf/PaymentChargeDetail';
import PreSettlementBySelf from '../components/payment/advicePaymentBySelf/PreSettlementBySelf';
import PayCounter from '../components/PayCounter/PayCounter';


import PaymentList from '../components/payment/payment/PaymentList';
import PreSettlement from '../components/payment/payment/PreSettlement';

// components of refund 退款
import OutpatientRefund from '../components/refund/OutpatientRefund';
import OutpatientRefundDetail from '../components/refund/OutpatientRefundDetail';
import CompleteRefundSuccess from '../components/refund/CompleteRefundSuccess';
import CompleteRefundFailure from '../components/refund/CompleteRefundFailure';
// components of records 消费记录
import ConsumeMain from '../components/consume/ConsumeMain';
import ConsumeRecords from '../components/consume/ConsumeRecords';

// components of common 公共组件
import CameraRollView from '../components/common/CameraRollView';
import NewsList from '../components/news/NewsList';
import NewsContent from '../components/news/NewsContent';
import JPush from '../components/common/JPush';
import Scanner from '../components/common/Scanner';
import BarcodeScanner from '../components/common/BarcodeScanner';

// components of others
import SettingsForTest from '../components/SettingsForTest';
import Message from '../components/message/Message';

// components of tools 工具
import Tools from '../components/tools/Tools';
import MedAlarm from '../components/tools/medAlarm/MedAlarm';
import Triage from '../components/tools/triage/Triage';
import BMI from '../components/tools/BMI';
import EDC from '../components/tools/EDC';
import Diagnosis from '../components/tools/diagnosis/Diagnosis';
import DiagnosisList from '../components/tools/diagnosis/DiagnosisList';
import DiseaseDetail from '../components/tools/diagnosis/DiseaseDetail';
import PartList from '../components/tools/diagnosis/PartList';
import Drugs from '../components/tools/drug/Drugs';
import CommonDrugType from '../components/tools/drug/CommonDrugType';
import DrugList from '../components/tools/drug/DrugList';
import DrugDesc from '../components/tools/drug/DrugDesc';
import MutilDrugType from '../components/tools/drug/MutilDrugType';
import FirstAids from '../components/tools/firstAid/FirstAids';
import FirstAidType from '../components/tools/firstAid/FirstAidType';
import FirstAidDesc from '../components/tools/firstAid/FirstAidDesc';
import Tests from '../components/tools/test/Tests';
import TestTypeList from '../components/tools/test/TestTypeList';
import TestList from '../components/tools/test/TestList';
import TestDesc from '../components/tools/test/TestDesc';
import Vaccines from '../components/tools/vaccine/Vaccines';
import VaccinesList from '../components/tools/vaccine/VaccinesList';
import VaccinesDesc from '../components/tools/vaccine/VaccinesDesc';
// import BodyPartDiagTriage from '../components/tools/triage/BodyPartDiagTriage';
import BodyPartListTriage from '../components/tools/triage/BodyPartListTriage';
import Symptom from '../components/tools/triage/Symptom';
import RelatedSymptoms from '../components/tools/triage/RelatedSymptoms';
import SelSymptomsList from '../components/tools/triage/SelSymptomsList';
import DiagnosisListTriage from '../components/tools/triage/DiagnosisListTriage';

// components of samples 示例
import SampleMenu from '../components/tmpl/sample/SampleMenu';
import SampleList from '../components/tmpl/sample/SampleList';
import SampleEdit from '../components/tmpl/sample/SampleEdit';
import EasyFormTest1 from '../components/tmpl/sample/EasyFormTest1';
import LineInputsFormTest from '../components/tmpl/sample/LineInputsFormTest';
import LineInputsFormTest1 from '../components/tmpl/sample/LineInputsFormTest1';
import ComponentTest from '../components/tmpl/sample/ComponentTest';
import CameraDemo from '../components/tmpl/sample/CameraDemo';
import Demo from '../components/tmpl/sample/Demo';

// components of guide 导诊
import Guide from '../components/guide/OutpatientGuidance';

// components of inpatient 住院
import InpatientInfo from '../components/inpatient/InpatientInfo';
import InpatientDailyBill from '../components/inpatient/InpatientDailyBill';
import InpatientPrepaidRecords from '../components/inpatient/InpatientPrepaidRecords';

const initOptions = { headerTruncatedBackTitle: '返回' };

export default {
  Root: { screen: NavigatorWrappingScreen },
  // components of me
  ContactUs: { screen: ContactUs }, // 联系我们
  AboutUs: { screen: AboutUs }, // 关于我们
  Suggest: { screen: Suggest }, // 投诉建议

  // components of me/login
  Login: { screen: Login }, // 登录
  LoginBySMS: { screen: LoginBySMS }, // 通过短信验证登录
  ResetPwd: { screen: ResetPwd }, // 重置密码
  Register: { screen: Register }, // 用户注册
  ChangePwd: { screen: ChangePwd }, // 修改密码

  // components of me/profile
  Profile: { screen: Profile, navigationOptions: initOptions }, // 个人资料
  Portrait: { screen: Portrait }, // 头像
  EditProfile: { screen: EditProfile, navigationOptions: initOptions }, // 修改个人资料

  // components of me/cards
  Cards: { screen: Cards }, // 就诊卡

  // components of me/patients
  Patients: { screen: Patients }, // 常用就诊人
  ChoosePatient: { screen: ChoosePatient }, // 选择就诊人组件
  EditPatientInfo: { screen: EditPatientInfo }, // 新增/修改就诊人
  PatientInfo: { screen: PatientInfo }, // 就诊人信息及档案列表
  BindProfile: { screen: BindProfile }, // 档案绑定

  // PatientList: { screen: PatientList }, // 就诊人组件
  // AddPatient: { screen: AddPatient }, // 新增就诊人 多医院
  // AddPatientSingle: { screen: AddPatientSingle }, // 新增就诊人 单医院
  // BindArchives: { screen: BindArchives }, // 绑定档案
  // ArchivesList2: { screen: ArchivesList2 }, // 档案列表
  // Identify: { screen: Identify }, // 档案认证
  // Identify2: { screen: Identify2 }, // 档案认证
  // AddArchives: { screen: AddArchives }, // 新建档案
  // EditPatient: { screen: EditPatient, navigationOptions: initOptions }, // 编辑就诊人资料
  // EditMyPatient: { screen: EditMyPatient, navigationOptions: initOptions }, // 编辑本人资料
  // ChangePatient: { screen: ChangePatient }, // 切换就诊人

  // components of hospital
  HospitalList: {
    screen: HospitalList,
  }, // 医院列表
  ChooseHospital: {
    screen: HospitalList,
  }, // 选择医院
  Hospital: { screen: Hospital }, // 医院微主页
  Department: { screen: Department }, // 医院科室
  Doctor: { screen: Doctor }, // 医院医生

  // components of hospital functions
  AppAndReg: {
    screen: AppAndReg,
  }, // 预约挂号
  Schedule: { screen: Schedule, navigationOptions: initOptions }, // 排班
  AppointSource: { screen: AppointSource, navigationOptions: initOptions }, // 号源
  Appoint: { screen: Appoint, navigationOptions: initOptions }, // 预约挂号
  AppointSuccess: { screen: AppointSuccess, navigationOptions: initOptions }, // 预约挂号
  AppointRecordsMain: { screen: AppointRecordsMain, navigationOptions: initOptions }, // 预约挂号记录
  SignMain: { screen: SignMain, navigationOptions: initOptions }, // 来院签到
  SignReceipt: { screen: SignReceipt, navigationOptions: initOptions }, // 签到小票

  // components of payment
  Payments: { screen: PaymentMain }, // 充值缴费
  CompletePayFailure: { screen: CompletePayFailure }, // 充值缴费
  CompletePaySuccess: { screen: CompletePaySuccess }, // 充值缴费
  OnlineRecharge: { screen: OnlineRecharge }, // 充值缴费
  PaymentList: { screen: PaymentList }, // 缴费项
  PreSettlement: { screen: PreSettlement }, // 预结算
  PaymentChargeDetail: { screen: PaymentChargeDetail }, // 预结算
  PreSettlementBySelf: { screen: PreSettlementBySelf }, // 预结算
  PayCounter: { screen: PayCounter }, // 收银台
  CompleteRefundFailure: { screen: CompleteRefundFailure }, // 充值缴费
  CompleteRefundSuccess: { screen: CompleteRefundSuccess }, // 充值缴费

  // components of records 消费记录
  ConsumeMain: { screen: ConsumeMain }, // 消费记录
  ConsumeRecords: { screen: ConsumeRecords }, // 缴费记录

  // component of refunds 退费
  OutpatientRefund: { screen: OutpatientRefund }, // 门诊退费
  OutpatientRefundDetail: { screen: OutpatientRefundDetail }, // 门诊退费

  // components of reports
  Reports: { screen: Reports }, // 报告查询
  LisDetail: { screen: LisDetail },
  PacsDetail: { screen: PacsDetail },

  // components of records
  Records: { screen: Records }, // 诊疗记录
  RecordDetails: { screen: RecordDetails }, // 诊疗记录详情
  DiagnoseDetails: { screen: DiagnoseDetails }, // 医生诊断详情
  RecipeDetails: { screen: RecipeDetails }, // 处方详情
  TestDetails: { screen: TestDetails }, // 检查项明细

  // components of community 社区
  ConsultRecords: { screen: ConsultRecords }, // 问医生
  SelectDept: { screen: SelectDept }, // 选择科室
  DoctorList: { screen: DoctorList }, // 医生列表
  EditConsult: { screen: EditConsult }, // 添加咨询
  EditReply: { screen: EditReply }, // 查看回复
  ConsultDetail: { screen: ConsultDetail }, // 咨询详情

  // components of tools
  Tools: { screen: Tools }, // 工具首页
  MedAlarm: { screen: MedAlarm }, // 用药小闹钟
  Triage: { screen: Triage }, // 智能分诊
  BMI: { screen: BMI }, // BMI自查
  EDC: { screen: EDC }, // 预产期自测
  Diagnosis: { screen: Diagnosis }, // 疾病库
  DiagnosisList: { screen: DiagnosisList }, // 疾病库列表
  DiseaseDetail: { screen: DiseaseDetail }, // 疾病详情
  PartList: { screen: PartList }, // 按照部位查找
  Drugs: { screen: Drugs }, // 药品库
  CommonDrugType: { screen: CommonDrugType }, // 常见药品分类列表
  DrugList: { screen: DrugList }, // 药品列表
  DrugDesc: { screen: DrugDesc }, // 药品详情
  MutilDrugType: { screen: MutilDrugType }, // 药品分类列表
  FirstAids: { screen: FirstAids }, // 急救知识库
  FirstAidType: { screen: FirstAidType }, // 急救分类
  FirstAidDesc: { screen: FirstAidDesc }, // 急救知识列表
  Tests: { screen: Tests }, // 检验报告单解读
  TestTypeList: { screen: TestTypeList }, // 检验报告单分类列表
  TestList: { screen: TestList }, // 检验报告单分类列表
  TestDesc: { screen: TestDesc }, // 化验详情
  Vaccines: { screen: Vaccines }, // 预防接种
  VaccinesList: { screen: VaccinesList }, // 预防接种
  VaccinesDesc: { screen: VaccinesDesc }, // 预防接种
  // BodyPartDiagTriage: { screen: BodyPartDiagTriage }, // 身体部位图表选择
  BodyPartListTriage: { screen: BodyPartListTriage }, // 身体部位列表选择
  Symptom: { screen: Symptom }, // 大病症
  RelatedSymptoms: { screen: RelatedSymptoms }, // 大病症
  SelSymptomsList: { screen: SelSymptomsList },
  DiagnosisListTriage: { screen: DiagnosisListTriage },


  // components of common
  CameraRollView: { screen: CameraRollView }, // 选择照片
  NewsList: { screen: NewsList }, // 公用新闻组件
  NewsContent: { screen: NewsContent }, // 公用新闻详情组件
  Scanner: { screen: Scanner }, // 扫一扫
  BarcodeScanner: { screen: BarcodeScanner }, // 扫一扫
  // components of others
  SettingsForTest: { screen: SettingsForTest }, // 设置
  Message: { screen: Message }, // 消息中心
  // components of samples
  SampleMenu: { screen: SampleMenu }, // 样例
  SampleList: { screen: SampleList }, // 列表测试
  SampleEdit: { screen: SampleEdit }, // 表单测试
  JPush: { screen: JPush }, // 推送接收
  EasyFormTest1: { screen: EasyFormTest1 },
  LineInputsFormTest: { screen: LineInputsFormTest },
  LineInputsFormTest1: { screen: LineInputsFormTest1 },
  ComponentTest: { screen: ComponentTest }, // 组件测试
  CameraDemo: { screen: CameraDemo }, // 相机
  Demo: { screen: Demo }, // Demo

  // components of guide
  Guide: { screen: Guide }, // 导诊

  // components of inpatient
  InpatientInfo: { screen: InpatientInfo }, // 住院单查询
  InpatientDailyBill: { screen: InpatientDailyBill }, // 住院日清单
  InpatientPrepaidRecords: { screen: InpatientPrepaidRecords }, // 住院预缴记录
};
