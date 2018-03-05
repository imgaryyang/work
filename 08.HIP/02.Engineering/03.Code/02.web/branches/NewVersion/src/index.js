import dva from 'dva';
import { browserHistory } from 'dva/router';
import { message } from 'antd';

import './index.css';
import './utils/prototype';

const ERROR_MSG_DURATION = 3; // 3 秒

// 1. Initialize
const app = dva({
  history: browserHistory,
  onError(e) {
    message.error(e.message, ERROR_MSG_DURATION);
  },
});

// 2. Plugins
// app.use({});

// 3. Model
// const models = require('./models');
//
// for (const i in models) {
//   if ({}.hasOwnProperty.call(models, i)) {
//     app.model(models[i]);
//   }
// }
app.model(require('./models/UtilsModel').default);
app.model(require('./models/CacheModel').default);
app.model(require('./models/base/MenuModel').default);
app.model(require('./models/base/UserModel').default);
app.model(require('./models/base/RoleModel').default);
app.model(require('./models/base/AuthModel').default);
app.model(require('./models/base/DeptModel').default);
app.model(require('./models/base/DictionaryModel').default);
app.model(require('./models/base/TreeModel').default);
app.model(require('./models/base/BaseModel').default);
app.model(require('./models/base/AccountModel').default);
app.model(require('./models/base/HospitalModel').default);
app.model(require('./models/base/CtrlParamModel').default);
// app.model(require('./models/base/PrintTemplateModel').default);
// app.model(require('./models/base/PrintModel').default);
app.model(require('./models/base/CompanyModel').default);
app.model(require('./models/base/UserTrainingModel').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
