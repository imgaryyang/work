/* eslint-disable global-require */
const models = [
  require('./UtilsModel').default,
  require('./CacheModel').default,
  /* base models */
  require('./base/MenuModel').default,
  require('./base/UserModel').default,
  require('./base/RoleModel').default,
  require('./base/AuthModel').default,
  require('./base/DeptModel').default,
  require('./base/DictionaryModel').default,
  require('./base/TreeModel').default,
  require('./base/BaseModel').default,
  require('./base/AccountModel').default,
  require('./base/HospitalModel').default,
  require('./base/CtrlParamModel').default,
  // require('./base/PrintTemplateModel').default,
  // require('./base/PrintModel').default,
  require('./base/CompanyModel').default,
  require('./base/UserTrainingModel').default,
];

export default models;
/* eslint-enable global-require */
