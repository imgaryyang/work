/* eslint-disable global-require */
const models = [
  require('./UtilsModel'),
  require('./CacheModel'),
  /* base models */
  require('./base/MenuModel'),
  require('./base/UserModel'),
  require('./base/RoleModel'),
  require('./base/AuthModel'),
  require('./base/ResourceModel'),
  require('./base/DeptModel'),
  require('./base/DictionaryModel'),
  require('./base/TreeModel'),
  require('./base/BaseModel'),
  require('./base/ChargePkgModel'),
  require('./base/AccountModel'),
  require('./base/ItemInfoModel'),
  require('./base/HospitalModel'),
  require('./base/CtrlParamModel'),
  require('./base/PrintTemplateModel'),
  require('./base/PrintModel'),
  require('./base/CompanyModel'),

  /* 运营管理 */
  require('./operation/UserModel'),, // 人员管理 added by BLB

  /* card models */
  require('./card/PatientModel'),
  require('./card/CardModel'),
  /* payment */
  require('./payment/PayCounterModel'),
  /* appointment models */
  require('./appointment/RegisterModel'),
  require('./appointment/RegVisitTempModel'),
  require('./appointment/RegVisitModel'),
  require('./appointment/RegInfoModel'),
  require('./appointment/RegFreeModel'),
  require('./appointment/RegCheckoutModel'),
  require('./appointment/PayWayModel'),
  require('./appointment/RegReportModel'),
  require('./appointment/WorkLoadModel'),
  require('./appointment/AccountItemModel'),
  /* pharmacy models */
  require('./pharmacy/CompanyInfoModel'),
  require('./pharmacy/DrugInfoModel'),
  require('./pharmacy/InstockModel'),
  require('./pharmacy/InstockApplyEditModel'),, // 请领计划修改 added by BLB
  require('./pharmacy/StoreInfoModel'),
  require('./pharmacy/StoreInfoQueryModel'),
  require('./pharmacy/ProcurePlanModel'),
  require('./pharmacy/ProcurePlanEditModel'),, // 采购计划修改 added by BLB
  require('./pharmacy/ProcureAuitdModel'),
  require('./pharmacy/ProcureAuitdSearchModel'),
  require('./pharmacy/OutOrderInstockModel'),
  require('./pharmacy/OutStockModel'),
  require('./pharmacy/OutStockCheckModel'),
  require('./pharmacy/OutputDetailInfoModel'),
  require('./pharmacy/OutputSummaryModel'),
  require('./pharmacy/AdjustModel'),
  require('./pharmacy/CheckInfoModel'),
  require('./pharmacy/DrugDispenseModel'),
  require('./pharmacy/PhaRecipeModel'),
  require('./pharmacy/DirectInModel'),
  require('./pharmacy/ProcureInstockModel'),
  require('./pharmacy/InstockAuitdModel'),
  require('./pharmacy/InventWarnInfoModel'),
  require('./pharmacy/ValidWarnInfoModel'),
  require('./pharmacy/DetentWarnInfoModel'),
  require('./pharmacy/InStoreSummaryModel'),
  require('./pharmacy/InStoreDetailModel'),
  /* finance models */
  require('./finance/InvoiceMngModel'),
  require('./finance/InvoiceAdjustModel'),
  require('./finance/InvoiceReprintModel'),
  require('./finance/OutpatientChargeModel'),
  require('./finance/PricChargeModel'),
  require('./finance/OperBalanceModel'),
  require('./finance/ChargeStatisByDocModel'),
  /* odws models */
  require('./odws/OdwsModel'),
  require('./odws/MedicalRecordModel'),
  require('./odws/HistoryModel'),
  require('./odws/DiagnoseModel'),
  require('./odws/OrderModel'),
  require('./odws/LisModel'),
  require('./odws/ExamModel'),
  require('./odws/FeeModel'),
  require('./odws/AllergicHistoryModel'),
  require('./odws/PatientRecordsTemplateModel'),
  require('./odws/WorkloadSearchModel'),
  require('./onws/PatientStoreExecModel'),
  /* material models */
  require('./material/OutOrderInstockModel'),
  require('./material/ProcurePlanModel'),
  require('./material/MatProcureAuitdModel'),
  require('./material/OutStockModel'),
  require('./material/InstockModel'),
  require('./material/OutStockCheckModel'),
  require('./material/MaterialInventWarnInfoModel'),
  require('./material/MaterialValidWarnInfoModel'),
  require('./material/InstockAuitdModel'),
  require('./material/ProcureInstockModel'),
  require('./material/CredentialModel'),
  require('./material/MatCheckInfoModel'),
  require('./material/CompanyInfoModel'),
  require('./material/MaterialInfoModel'),
  require('./material/MatStoreInfoModel'),
  require('./material/MatStoreInfoQueryModel'),
  require('./material/InStoreDetailModel'),
  require('./material/OutputDetailInfoModel'),
  require('./material/OutputSummaryModel'),
  require('./material/DirectInModel'), // added by BLB

  /* instrm models */
  require('./hrp/AssetInfoModel'),
  require('./hrp/InStoreDetailModel'),
  require('./hrp/OutputDetailInfoModel'),
  require('./hrp/InstrmCheckInfoModel'),
  require('./hrp/InstrmStoreInfoModel'),
  require('./hrp/InstrmStoreInfoQueryModel'),
  require('./hrp/DirectInModel'), // added by jiangyong
  require('./hrp/OutStockModel'), // added by jiangyong  
  /* operation models */
  require('./operation/HospitalModel'),// added by jiangyong  

];

export default models;
/* eslint-enable global-require */
