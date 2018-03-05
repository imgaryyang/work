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
  require('./base/AccountModel'),
  require('./base/HospitalModel'),
  require('./base/CtrlParamModel'),
  require('./base/PrintTemplateModel'),
  require('./base/PrintModel'),
  require('./base/CompanyModel'),
  require('./base/UserTrainingModel'),
];

export default models;
/* eslint-enable global-require */
