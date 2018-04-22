/* global require*/
const models = [
  require('./base/BaseModel'),
  require('./base/MngMenuModel'),
  require('./base/MngAuthModel'),

  require('./base/ClientMenuModel'),
  require('./base/ClientAuthModel'),

  // require('./base/ClientMenuModel'),
  require('./base/OptAuthModel'),
  require('./base/LoggerModel'),
  require('./base/UserModel'),
  require('./base/RoleModel'),
  require('./base/AuthModel'),
  require('./base/MachineModel'),
  require('./base/AreaModel'),
  require('./base/ModelModel'),
  require('./base/OrgModel'),
  require('./base/OperatorModel'),
  /*图表统计*/
  require('./base/ChartModel'),
  require('./base/MonitorModel'),

  require('./payment/CashModel'),
  require('./payment/RechargeModel'),
  require('./payment/CheckModel'),
  require('./payment/PayChannelModel'),
  
  require('./tran/TranModel'),
  require('./tran/CashModel'),
  require('./tran/ThirdModel'),
  require('./tran/RefundModel'),
  require('./tran/DealRefundModel'), 
  /* 运营 */
  require('./opt/BackTrackingModel'),
  /* 统计*/
  require('./statistics/TrilateralCheckingModel'),
  /*材料*/
  require('./materials/MaterialManageModel'),
  require('./materials/InMaterialDetailModel'),
  require('./materials/OutMaterialDetailModel'),
  /*故障*/
  require('./troubles/TroubleModel'),
  require('./troubles/TroubleDetailModel'),
];

export default models;
