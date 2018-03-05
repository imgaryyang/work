import React from 'react';
import { Router, Route } from 'dva/router';

import config from './routerConfig';

import Framework from './routes/framework/Framework';

// import Error404 from './routes/framework/404';
// import CommonLayout from './routes/framework/CommonLayout';
import Login from './routes/framework/Login';
// import Homepage from './routes/framework/Homepage';
// import DictionaryMain from './routes/base/dictionary/DictionaryMain';
// import CtrlParamMain from './routes/base/ctrlParam/CtrlParamMain';
// import PrintTemplate from './routes/base/printTemplate/PrintTemplateMain';
// import MenuMain from './routes/base/menu/MenuMain';
// import HospitalMain from './routes/base/hospital/HospitalMain';
//
// import DeptMain from './routes/base/dept/DeptMain';
// import UserMain from './routes/base/user/UserMain';
// import RoleMain from './routes/base/role/RoleMain';
// import AuthMain from './routes/base/auth/AuthMain';
// import AccountMain from './routes/base/account/AccountMain';
// import BaseHome from './routes/base/BaseHome';
// import Company from './routes/base/company/CompanyMain';

/**
 * @auther xiaweiyi
 */
// export default function ({ history }) {
//   return (
//     <Router history={history} >
//       <Route path="/" component={Framework} >
//         <IndexRoute component={Login} />
//         <Route path="/login" component={Login} />
//         <Route path="/homepage" component={Homepage} />
//         <Route path="/base" component={CommonLayout} >
//           <IndexRoute component={BaseHome} />
//           <Route path="dict" component={DictionaryMain} />{/* 数据字典管理 */}
//           <Route path="ctrl" component={CtrlParamMain} />{/* 控制参数管理 */}
//           <Route path="menu/:chanel" component={MenuMain} />{/* 菜单管理 */}
//           <Route path="dept" component={DeptMain} />{/* 科室管理 */}
//           <Route path="printTemplate" component={PrintTemplate} />{/* 打印模板 */}
//           <Route path="user" component={UserMain} />{/* 用户管理 */}
//           <Route path="role/:chanel" component={RoleMain} />{/* 角色管理 */}
//           <Route path="auth/:chanel" component={AuthMain} />{/* 权限管理 */}
//           <Route path="account" component={AccountMain} />{/* 登录账户管理 */}
//           <Route path="baseMng/hospMng" component={HospitalMain} />{/* 医院信息维护 */}
//           <Route path="company/:chanel" component={Company} />{/* 厂商及供应商管理 */}
//           <Route path="*" component={Error404} />
//         </Route>
//         <Route path="*" component={Error404} />
//       </Route>
//     </Router>
//   );
// }

export default function ({ history }) {
  console.log(history);
  return (
    <Router history={history} >
      <Route exact path="/" component={Framework} />
    </Router>
  );
}

// import React from 'react';
// import { Router, Switch, Route, IndexRoute } from 'dva/router';
// import dynamic from 'dva/dynamic';
//
// function RouterConfig({ history, app }) {
//   const IndexPage = dynamic({
//     app,
//     models: () => [
//       import('./models/base/BaseModel'),
//     ],
//     component: () => import('./routes/framework/Framework'),
//   });
//
//   const Login = dynamic({
//     app,
//     models: () => [
//       import('./models/base/BaseModel'),
//     ],
//     component: () => import('./routes/framework/Login'),
//   });
//
//   const BaseHome = dynamic({
//     app,
//     models: () => [
//       import('./models/base/BaseModel'),
//     ],
//     component: () => import('./routes/base/BaseHome'),
//   });
//
//   return (
//     <Router history={history}>
//       <Switch>
//         <Route exact path="/" component={IndexPage} />
//         <IndexRoute component={Login} />
//         <Route exact path="/users" component={BaseHome} />
//       </Switch>
//     </Router>
//   );
// }
//
// export default RouterConfig;
