/* global require*/
const models = [
  require('./base/BaseModel'),
  require('./base/MngMenuModel'),
  require('./base/MngAuthModel'),

  require('./base/ClientMenuModel'),
  require('./base/ClientAuthModel'),

  // require('./base/ClientMenuModel'),
  require('./base/OptAuthModel'),

  require('./base/UserModel'),
  require('./base/RoleModel'),
  require('./base/AuthModel'),
  require('./base/MachineModel'),
  require('./base/AreaModel'),
  require('./base/OrgModel'),
  require('./base/OperatorModel'),

  require('./payment/CashModel'),
  require('./payment/RechargeModel'),
  
  require('./tran/TranModel'),
  require('./tran/CashModel'),
  require('./tran/ThirdModel'),
  require('./tran/RefundModel'),
  /* 运营 */
  require('./opt/BackTrackingModel'),
  /* 统计*/
  require('./statistics/TrilateralCheckingModel'),
];

export default models;
