const config = {
  apiRoot: {
    /* base */
    base: '/api/hcp/base/', // 通用项目
    user: '/api/hcp/base/user/',
    userDept: '/api/hcp/base/userDept',
    dictionary: '/api/hcp/base/dictionary/',
    dept: '/api/hcp/base/dept/',
    tree: '/api/hcp/base/tree/',
    itemInfo: '/api/hcp/base/itemInfo/', // 项目信息
    printTemplate: '/api/hcp/base/printTemplate/', // 打印模板
    print: '/api/hcp/base/print/', // 打印
    chargePkg: '/api/hcp/base/chargePkg/', // 收费组套
    /* appointment */
    regVisitTemp: '/api/hcp/appointment/settings/regVisitTemp',    // 排班模版维护
    regVisit: '/api/hcp/appointment/settings/regVisit',
    register: '/api/hcp/appointment/register',                     // 门诊挂号
    regCheckout: '/api/hcp/appointment/regCheckout',               // 挂号结账
    regFree: '/api/hcp/appointment/regFree', // 挂号附加费维护
    /* pharmacy */
    manufacturer: '/api/hcp/pharmacy/settings/manufacturerMng',    // 厂商维护
    medicine: '/api/hcp/pharmacy/settings/medicineMng',            // 药品维护
    buyBill: '/api/hcp/pharmacy/buyBill',
    buyDetail: '/api/hcp/pharmacy/buyDetail',
    directIn: '/api/hcp/pharmacy/directIn',
    storeInfo: '/api/hcp/pharmacy/phaStoreInfo/',
    storeSumInfo: '/api/hcp/pharmacy/phaStoreSumInfo/',
    outputInfo: '/api/hcp/pharmacy/outputInfo/', // 出库信息
    instock: '/api/hcp/pharmacy/instock/', // 入库信息
    drugDispense: '/api/hcp/pharmacy/dispense/', // 药房发药
    phaRecipe: '/api/hcp/pharmacy/phaRecipe/', // 药房退药
    adjust: '/api/hcp/pharmacy/phaAdjust/', // 药品调价
    checkInfo: '/api/hcp/pharmacy/phaCheckInfo/', // 药品盘点
    pharmacyAlert: {
      inventoryAlert: '/api/hcp/pharmacy/alert/inventory/', // 库存预警
      expiryAlert: '/api/hcp/pharmacy/alert/expiry/', // 效期预警
      retentionAlert: '/api/hcp/pharmacy/alert/retention/', // 滞留预警
    },
    /* material */
    matOutputInfo: '/api/hcp/material/outputInfo/', // 出库信息
    matDirectIn: '/api/hcp/material/directIn',
    matInstock: '/api/hcp/material/instock/', // 入库信息
    matStoreInfo: '/api/hcp/material/matStoreInfo/',
    matStoreSumInfo: '/api/hcp/material/matStoreSumInfo/',
    materialAlert: {
      inventoryAlert: '/api/hcp/material/alert/inventory/', // 库存预警
      expiryAlert: '/api/hcp/material/alert/expiry/', // 效期预警
      retentionAlert: '/api/hcp/material/alert/retention/', // 滞留预警
    },
    matCheckInfo: '/api/hcp/material/matCheckInfo/',
    material: '/api/hcp/material/', // 物资
    matBuyBill: '/api/hcp/material/buyBill',
    matBuyDetail: '/api/hcp/material/buyDetail',
    materialInfo: '/api/hcp/material/settings/materialInfo',  // 物资信息 added by BLB
    /* finance */
    chargeDetail: '/api/hcp/finance/chargeDetail/', // 交费明细
    invoiceMng: '/api/hcp/finance/invoiceMng', // 发票管理
    invoiceAdjust: '/api/hcp/finance/invoiceMng/invoiceAdjust', // 发票管理
    invoiceReprint: '/api/hcp/finance/invoiceReprint', // 退费与重打
    checkOut: '/api/hcp/finance/checkOut',                       // 收费结账
    operBalance: '/api/hcp/finance/operBalance', // 会计收款
    card: '/api/hcp/card/',
    patient: '/api/hcp/patient/',
    optCharge: '/api/hcp/payment/outpatientCharge/', // 收费确认
    pay: '/api/hcp/payment/pay', // 支付相关
    odws: '/api/hcp/odws/',
    workloadSearch: '/api/hcp/odws/workloadSearch/',
    patientStoreExecl: '/api/hcp/onws/patientStoreExec',
    chargeStatis: '/api/hcp/payment/chargeStatis',
    /* hrp */
    hrp: '/api/hcp/hrp/', // 资产
    hrpOutputInfo: '/api/hcp/hrp/outputInfo/', // 出库信息
    instrmCheckInfo: '/api/hcp/hrp/instrmCheckInfo/',
    instrmStoreInfo: '/api/hcp/hrp/instrmStoreInfo/',
    hrpDirectIn: '/api/hcp/hrp/directIn',
    hrpInstrmInfo: '/api/hcp/hrp/settings/instrmInfo/',//固定资产信息
    hrpDirectIn: '/api/hcp/hrp/directIn',//固定资产-直接入库 add by jiangy 
    hrpOutputStock: '/api/hcp/hrp/outputInfo',//固定资产-直接出库 add by jiangy
    
  },
};

export default config;
