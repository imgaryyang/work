import React from 'react';
import { Router, Route, IndexRoute } from 'dva/router';
import Framework from './routes/framework/Framework';
import Error404 from './routes/framework/404';
import CommonLayout from './routes/framework/CommonLayout';
import Login from './routes/framework/Login';
import Homepage from './routes/framework/Homepage';
import PatientRecordsTemplateMain from './routes/odws/patientRecordsTemplate/PatientRecordsTemplateMain';
import WorkloadSearchMain from './routes/odws/workloadSearch/WorkloadSearchMain';
import PatientStoreExecMain from './routes/onws/patientStoreExec/PatientStoreExecMain';
/* appointment */
import AppointmentHome from './routes/appointment/AppointmentHome';
import RegVisitTempMain from './routes/appointment/settings/RegVisitTempMain';
import RegVisitMain from './routes/appointment/settings/RegVisitMain';
import RegInfoMain from './routes/appointment/regInfo/RegInfoMain';
import RegCheckoutMain from './routes/appointment/regCheckout/RegCheckoutMain';
import RegFreeMain from './routes/appointment/regFree/RegFreeMain';
import RegisterMain from './routes/appointment/register/RegisterMain';
import PayWayMain from './routes/appointment/statistics/PayWayMain';
import RegReportMain from './routes/appointment/statistics/RegReportMain';
import WorkLoadMain from './routes/appointment/statistics/WorkLoadMain';
import AccountItemMain from './routes/appointment/statistics/AccountItemMain';
// import DictMain from './routes/base/dict/DictMain';
import DictionaryMain from './routes/base/dictionary/DictionaryMain';
import CtrlParamMain from './routes/base/ctrlParam/CtrlParamMain';
import ChargePkgMain from './routes/base/chargePkg/ChargePkgMain';
import PrintTemplate from './routes/base/printTemplate/PrintTemplateMain';
import MenuMain from './routes/base/menu/MenuMain';
import HospitalMain from './routes/base/hospital/HospitalMain';
import OptHospitalMain from './routes/operation/hospital/HospitalMain'; //運營-醫院管理

import DeptMain from './routes/base/dept/DeptMain';
import UserMain from './routes/base/user/UserMain';
import RoleMain from './routes/base/role/RoleMain';
import AuthMain from './routes/base/auth/AuthMain';
import ResourceMain from './routes/base/resource/ResourceMain';
import AccountMain from './routes/base/account/AccountMain';
import ItemInfoMain from './routes/base/itemInfo/ItemInfoMain';
import BaseHome from './routes/base/BaseHome';
import Company from './routes/base/company/CompanyMain';

/* 运营管理 */
import User4OptMain from './routes/operation/user/UserMain'; // 人员管理 added by BLB

/* 一卡通 */
import PatientMain from './routes/card/patient/PatientMain';
import CardMain from './routes/card/card/CardMain';
import CardHome from './routes/card/CardHome';

/* 财务 */
import FinanceHome from './routes/finance/FinanceHome';
import InvoiceMngMain from './routes/finance/invoiceMng/InvoiceMngMain';
import OperBalanceMain from './routes/finance/operBalance/OperBalanceMain';
import InvoiceAdjustMain from './routes/finance/invoiceMng/InvoiceAdjustMain';
import InvoiceReprintMain from './routes/finance/invoiceReprint/InvoiceReprintMain';
import PricChargeMain from './routes/finance/pricCharge/PricChargeMain';
import ChargeStatisByDoc from './routes/finance/chargeStatisByDoc/ChargeStatisByDocMain';


import HrpHome from './routes/hrp/HrpHome';

/* 医生站 */
import OdwsHome from './routes/odws/OdwsHome';
import OdwsMain from './routes/odws/OdwsMain';

import OnwsHome from './routes/onws/OnwsHome';

import ChargeHome from './routes/charge/ChargeHome';
import OutpatientChargeMain from './routes/finance/outpatientCharge/OutpatientChargeMain';

import OperationHome from './routes/operation/OperationHome';

/* 药房、药库 */
import PharmacyHome from './routes/pharmacy/PharmacyHome';
import DispensaryHome from './routes/pharmacy/DispensaryHome';
import PaymentHome from './routes/payment/PaymentHome';
import AdjustMain from './routes/pharmacy/storeInfo/AdjustMain';
import CheckInfoMain from './routes/pharmacy/checkInfo/CheckInfoMain';
import inStoreSummaryMain from './routes/pharmacy/inStoreSummary/InStoreSummaryMain';
import InStoreDetailMain from './routes/pharmacy/inStoreDetail/InStoreDetailMain';

import CompanyInfoMain from './routes/pharmacy/settings/CompanyInfoMain';
import DrugInfoMain from './routes/pharmacy/settings/DrugInfoMain';

import ProcureAuitdMain from './routes/pharmacy/procurePlanAuitd/ProcureAuitdMain';
import ProcureAuitdSearchMain from './routes/pharmacy/procureAuitdSearch/ProcureAuitdSearchMain';
import ProcurePlanMain from './routes/pharmacy/procurePlan/ProcurePlanMain';
import ProcurePlanEditMain from './routes/pharmacy/procurePlanEdit/ProcurePlanMain'; // 采购计划修改 added by BLB
import StoreInfoMain from './routes/pharmacy/storeInfo/StoreInfoMain';
import StoreInfoQueryMain from './routes/pharmacy/storeInfo/StoreInfoQueryMain';
import InstockMain from './routes/pharmacy/instock/InstockMain';
import InstockApplyEditMain from './routes/pharmacy/instock/InstockApplyEditMain'; // 请领计划修改 added by BLB
import DirectInMain from './routes/pharmacy/instock/DirectInMain';
import DrugDispenseMain from './routes/pharmacy/drugDispense/DrugDispenseMain';
import PhaRecipeBackMain from './routes/pharmacy/phaRecipe/PhaRecipeBackMain';
import OutOrderInstockMain from './routes/pharmacy/outOrderInstock/OutOrderInstockMain';
import OutStockMain from './routes/pharmacy/outStock/OutStockMain';
import OutStockCheckMain from './routes/pharmacy/outStockCheck/OutStockCheckMain';
import OutputDetailInfo from './routes/pharmacy/outputInfo/OutputDetailInfoMain';
import OutputSummary from './routes/pharmacy/outputSummary/OutputSummaryMain';
import ProcureInstockMain from './routes/pharmacy/instock/ProcureInstockMain';
import InstockAuitdMain from './routes/pharmacy/instock/InstockAuitdMain';

import InventWarnMain from './routes/pharmacy/storeWarnMng/InventWarnMain';
import ValidWarnMain from './routes/pharmacy/storeWarnMng/ValidWarnMain';
import DetentWarnMain from './routes/pharmacy/storeWarnMng/DetentWarnMain';

/* 物资 */
import MaterialHome from './routes/material/MaterialHome';
import MatOutOrderInstockMain from './routes/material/outOrderInstock/OutOrderInstockMain';
import MatOutStockMain from './routes/material/outStock/OutStockMain';
import MatProcurePlanMain from './routes/material/procurePlan/ProcurePlanMain';
import MatProcureAuitdMain from './routes/material/procurePlanAuitd/ProcureAuitdMain';
import Credential from './routes/material/credential/Credential';
import MatCheckInfoMain from './routes/material/matCheckInfo/MatCheckInfoMain';
import MatStoreInfoMain from './routes/material/matStoreInfo/MatStoreInfoMain';
import MatStoreInfoQueryMain from './routes/material/matStoreInfo/MatStoreInfoQueryMain';
import MaterialCompanyInfoMain from './routes/material/manufacturer/CompanyInfoMain';
import MaterialInfoMain from './routes/material/materialInfo/MaterialInfoMain';
import MaterialInventWarnMain from './routes/material/storeWarnMng/InventWarnMain';
import MaterialValidWarnMain from './routes/material/storeWarnMng/ValidWarnMain';
import MatOutStockCheckMain from './routes/material/outStockCheck/OutStockCheckMain';
import MatInstockMain from './routes/material/instock/InstockMain';
import MatInstockAuitdMain from './routes/material/instock/InstockAuitdMain';
import MaterialDirectInMain from './routes/material/instock/DirectInMain'; // added by BLB
import MatProcureInstockMain from './routes/material/instock/ProcureInstockMain'; // add by jiangyong
import MatInStoreDetailMain from './routes/material/inStoreDetail/InStoreDetailMain';
import MatOutputDetailInfo from './routes/material/outputInfo/OutputDetailInfoMain';
import MatOutputSummary from './routes/material/outputSummary/OutputSummaryMain';

/* 固定资产*/
import AssetInfoMain from './routes/hrp/assetInfo/AssetInfoMain';
import HrpInStoreDetailMain from './routes/hrp/inStockDetail/InStoreDetailMain';
import HrpOutputDetailInfo from './routes/hrp/outputInfo/OutputDetailInfoMain';
import InstrmCheckInfo from './routes/hrp/checkInfo/InstrmCheckInfoMain';
import InstrmCheckInfoSearch from './routes/hrp/checkInfo/InstrmCheckInfoSearchMain';
import InstrmStoreInfo from './routes/hrp/storeInfo/InstrmStoreInfoMain';
import InstrmStoreInfoQueryMain from './routes/hrp/storeInfo/InstrmStoreInfoQueryMain';
import InstrmDirectInMain from './routes/hrp/instock/DirectInMain'; // add by jiangyong
import InstrmOutStockMain from './routes/hrp/outStock/OutStockMain';// add by jiangyong

/**
 * @auther xiaweiyi
 */
export default function ({ history }) {
  return (
    <Router history={history} >
      <Route path="/" component={Framework} >
        <IndexRoute component={Login} />
        <Route path="/login" component={Login} />
        <Route path="/homepage" component={Homepage} />
        <Route path="/appointment" component={CommonLayout}>
          <IndexRoute component={AppointmentHome} />
          <Route path="register" component={RegisterMain} />
          <Route path="regInfo" component={RegInfoMain} />
          <Route path="regCheckout" component={RegCheckoutMain} />
          <Route path="invoiceAdjust" component={InvoiceAdjustMain} />
          <Route path="regFree" component={RegFreeMain} />
          <Route path="settings/regVisitTemp" component={RegVisitTempMain} />
          <Route path="settings/regVisit" component={RegVisitMain} />
          <Route path="statistics/payWay" component={PayWayMain} />
          <Route path="statistics/regReport" component={RegReportMain} />
          <Route path="statistics/workLoad" component={WorkLoadMain} />
          <Route path="statistics/accountItem" component={AccountItemMain} />
        </Route>
        <Route path="/base" component={CommonLayout} >
          <IndexRoute component={BaseHome} />
          <Route path="dict" component={DictionaryMain} />{/* 数据字典管理*/}
          <Route path="ctrl" component={CtrlParamMain} />{/* 控制参数管理*/}
          <Route path="menu" component={MenuMain} />{/* 菜单管理*/}
          <Route path="dept" component={DeptMain} />{/* 科室管理*/}
          <Route path="chargePkg" component={ChargePkgMain} />{/* 收费套餐*/}
          <Route path="printTemplate" component={PrintTemplate} />{/* 打印模板*/}
          <Route path="user" component={UserMain} />{/* 用户管理*/}
          <Route path="role" component={RoleMain} />{/* 角色管理*/}
          <Route path="auth" component={AuthMain} />{/* 权限管理*/}
          <Route path="resource" component={ResourceMain} />{/* 可访问资源管理*/}
          <Route path="account" component={AccountMain} />{/* 登录账户管理*/}
          <Route path="itemInfo" component={ItemInfoMain} />{/* 收费项目信息维护*/}
          <Route path="baseMng/hospMng" component={HospitalMain} />{/* 医院信息维护*/}
          <Route path="company" component={Company} />{/* 厂商及供应商管理 */}
          <Route path="*" component={Error404} />
        </Route>
        <Route path="/card" component={CommonLayout}>
          <IndexRoute component={CardHome} />
          <Route path="patient" component={PatientMain} />
          <Route path="cardMng" component={CardMain} />
        </Route>
        <Route path="/finance" component={CommonLayout}>
          <IndexRoute component={FinanceHome} />
          <Route path="invoiceMng" component={InvoiceMngMain} />
          <Route path="operBalance" component={OperBalanceMain} />
        </Route>
        <Route path="/hrp" component={CommonLayout}>
          <IndexRoute component={HrpHome} />
          <Route path="inStoreDetail" component={HrpInStoreDetailMain} />{/* 出库查询*/}
          <Route path="outputDetailInfo" component={HrpOutputDetailInfo} />{/* 出库查询*/}
          <Route path="instrmCheckInfo" component={InstrmCheckInfo} />{/* 盘点 */}
          <Route path="instrmCheckInfoSearch" component={InstrmCheckInfoSearch} />{/* 盘点查询 */}
          <Route path="instrmStoreInfo" component={InstrmStoreInfo} />{/* 库存汇总 */}
          <Route path="instrmStoreInfoSearch" component={InstrmStoreInfoQueryMain} />{/* 资产库存查询 */}
          <Route path="assetInfo" component={AssetInfoMain} />{/* 资产基本信息维护 */}
          <Route path="directIn" component={InstrmDirectInMain} />{/* 直接入库 added by jiangyong */}
          <Route path="outStock" component={InstrmOutStockMain} />{/* 直接出库 added by jiangyong */}
        </Route>
        <Route path="/material" component={CommonLayout}>
          <IndexRoute component={MaterialHome} />
          <Route path="procurePlan" component={MatProcurePlanMain} />{/* 采购计划 */}
          <Route path="procurePlanAudit" component={MatProcureAuitdMain} />
          <Route path="outOrderInstock" component={MatOutOrderInstockMain} />{/* 出库单入库 */}
          <Route path="outStock" component={MatOutStockMain} />{/* 直接出库 */}
          <Route path="instock" component={MatInstockMain} />{/* 请领计划 */}
          <Route path="inventWarnMain" component={MaterialInventWarnMain} />{/* 库存预警 */}
          <Route path="validWarnMain" component={MaterialValidWarnMain} />{/* 效期预警 */}
          <Route path="instockAuitd" component={MatInstockAuitdMain} />{/* 请领核准入库 */}
          <Route path="outStockCheck" component={MatOutStockCheckMain} />{/* 请领审核出库*/}
          <Route path="matCheckInfo" component={MatCheckInfoMain} />{/* 物资盘点 */}
          <Route path="matStoreInfo" component={MatStoreInfoMain} />{/* 物资库存管理 */}
          <Route path="matStoreInfoSearch" component={MatStoreInfoQueryMain} />{/* 物资库存查询 */}
          <Route path="credential" component={Credential} />{/* 物资证书管理 */}
          <Route path="settings/manufacturer" component={MaterialCompanyInfoMain} />{/* 物资厂商信息维护 */}
          <Route path="settings/materialInfo" component={MaterialInfoMain} />{/* 物资基础信息维护 */}
          <Route path="directIn" component={MaterialDirectInMain} />{/* 直接入库 // added by BLB */}
          <Route path="inStoreDetail" component={MatInStoreDetailMain} />{/* 入库查询*/}
          <Route path="outputDetailInfo" component={MatOutputDetailInfo} />{/* 出库查询*/}
          <Route path="outputSummary" component={MatOutputSummary} />{/* 药品出库汇总*/}
          <Route path="procureInstock" component={MatProcureInstockMain} />{/* 采购核准入库 add by jiangyong*/}
        </Route>
        <Route path="/odws" component={CommonLayout}>
          <IndexRoute component={OdwsHome} />
          <Route path="patientRecordsTemplate" component={PatientRecordsTemplateMain} />
          <Route path="workloadSearch" component={WorkloadSearchMain} />
          <Route path="reception" component={OdwsMain} />
        </Route>
        <Route path="/onws" component={CommonLayout}>
          <IndexRoute component={OnwsHome} />
          <Route path="treatment/patientStoreExec" component={PatientStoreExecMain} />
          <Route path="treatment/pricCharge" component={PricChargeMain} />
        </Route>
        <Route path="/charge" component={CommonLayout}>
          <IndexRoute component={ChargeHome} />
          <Route path="outpatientCharge" component={OutpatientChargeMain} />
          <Route path="invoiceAdjust" component={InvoiceAdjustMain} />
          <Route path="pricChargeMain" component={PricChargeMain} />
          <Route path="chargeCheckout" component={RegCheckoutMain} />
          <Route path="invoiceReprint" component={InvoiceReprintMain} />{/* 退费与重打*/}
          <Route path="statisByDocAndItem" component={ChargeStatisByDoc} />{/* 门诊收费-开单医生按会计科目统计*/}
          <Route path="statisByPayWay" component={PayWayMain} />
          <Route path="statisByAccountItem" component={AccountItemMain} />
        </Route>
        <Route path="/operation" component={CommonLayout}>
          <IndexRoute component={OperationHome} />
          <Route path="hospital" component={OptHospitalMain} />
          <Route path="user" component={User4OptMain} />{/* 人员管理 added by BLB */}
        </Route>
        <Route path="/payment" component={CommonLayout}>
          <IndexRoute component={PaymentHome} />
        </Route>
        <Route path="/pharmacy" component={CommonLayout}>
          <IndexRoute component={PharmacyHome} />
          <Route path="procurePlan" component={ProcurePlanMain} />
          <Route path="procurePlanEdit" component={ProcurePlanEditMain} />{/* 采购计划修改 added by BLB */}
          <Route path="procureAuitd" component={ProcureAuitdMain} />
          <Route path="procureAuitdSearch" component={ProcureAuitdSearchMain} />
          <Route path="storeInfo" component={StoreInfoMain} />{/* 库存管理*/}
          <Route path="storeInfoQuery" component={StoreInfoQueryMain} />{/* 库存查询 */}
          <Route path="settings/manufacturerMng" component={CompanyInfoMain} />
          <Route path="settings/medicineMng" component={DrugInfoMain} />
          <Route path="outOrderInstock" component={OutOrderInstockMain} />{/* 出库单核准入库*/}
          <Route path="outStock" component={OutStockMain} />
          <Route path="outStockCheck" component={OutStockCheckMain} />{/* 请领审核出库*/}
          <Route path="instock" component={InstockMain} />{/* 请领计划*/}
          <Route path="instockApplyEdit" component={InstockApplyEditMain} />{/* 请领计划修改 added by BLB */}
          <Route path="directIn" component={DirectInMain} />{/* 直接入库*/}
          <Route path="adjust" component={AdjustMain} />
          <Route path="checkInfo" component={CheckInfoMain} />{/* 盘点*/}
          <Route path="procureInstock" component={ProcureInstockMain} />{/* 采购核准入库*/}
          <Route path="instockAuitd" component={InstockAuitdMain} />{/* 请领核准入库*/}
          <Route path="inventWarnMain" component={InventWarnMain} />{/* 库存预警*/}
          <Route path="validWarnMain" component={ValidWarnMain} />{/* 效期预警*/}
          <Route path="DetentWarnMain" component={DetentWarnMain} />{/* 滞留预警*/}
          <Route path="inStoreDetail" component={InStoreDetailMain} />{/* 入库查询*/}
          <Route path="inStoreSummary" component={inStoreSummaryMain} />{/* 药品入库汇总*/}
          <Route path="outputDetailInfo" component={OutputDetailInfo} />{/* 出库查询*/}
          <Route path="outputSummary" component={OutputSummary} />{/* 药品出库汇总*/}
        </Route>
        <Route path="/dispensary" component={CommonLayout}>
          <IndexRoute component={DispensaryHome} />
          <Route path="procurePlan" component={ProcurePlanMain} />
          <Route path="procureAuitd" component={ProcureAuitdMain} />
          <Route path="storeInfo" component={StoreInfoMain} />{/* 库存管理*/}
          <Route path="checkInfo" component={CheckInfoMain} />{/* 盘点*/}
          <Route path="storeInfoQuery" component={StoreInfoQueryMain} />{/* 库存查询 */}
          <Route path="settings/manufacturerMng" component={CompanyInfoMain} />
          <Route path="settings/medicineMng" component={DrugInfoMain} />
          <Route path="outStock" component={OutStockMain} />
          <Route path="outStockCheck" component={OutStockCheckMain} />{/* 请领审核出库*/}
          <Route path="instock" component={InstockMain} />{/* 请领计划*/}
          <Route path="directIn" component={DirectInMain} />{/* 直接入库*/}
          <Route path="outOrderInstock" component={OutOrderInstockMain} />{/* 出库单核准入库*/}
          <Route path="instockAuitd" component={InstockAuitdMain} />{/* 请领核准入库*/}
          <Route path="adjust" component={AdjustMain} />
          <Route path="drugDispense" component={DrugDispenseMain} />
          <Route path="drugWithdrawal" component={PhaRecipeBackMain} />
          <Route path="inventWarnMain" component={InventWarnMain} />{/* 库存预警*/}
          <Route path="validWarnMain" component={ValidWarnMain} />{/* 效期预警*/}
          <Route path="DetentWarnMain" component={DetentWarnMain} />{/* 滞留预警*/}
          <Route path="inStoreDetail" component={InStoreDetailMain} />{/* 入库查询*/}
          <Route path="inStoreSummary" component={inStoreSummaryMain} />{/* 药品入库汇总*/}
          <Route path="outputDetailInfo" component={OutputDetailInfo} />{/* 出库查询*/}
          <Route path="outputSummary" component={OutputSummary} />{/* 药品出库汇总*/}
        </Route>
        <Route path="*" component={Error404} />
      </Route>
    </Router>
  );
}
