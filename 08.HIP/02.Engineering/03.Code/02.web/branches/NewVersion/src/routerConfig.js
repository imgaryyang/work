/**
 * 路由配置
 */
import React from 'react';
import { Router, Route, IndexRoute } from 'dva/router';

import { getRandomNum } from './utils/randomTool';

import CommonLayout from './routes/framework/CommonLayout';
import Login from './routes/framework/Login';
import Homepage from './routes/framework/Homepage';
import DictionaryMain from './routes/base/dictionary/DictionaryMain';
import CtrlParamMain from './routes/base/ctrlParam/CtrlParamMain';
// import PrintTemplate from './routes/base/printTemplate/PrintTemplateMain';
import MenuMain from './routes/base/menu/MenuMain';
import HospitalMain from './routes/base/hospital/HospitalMain';

import DeptMain from './routes/base/dept/DeptMain';
import UserMain from './routes/base/user/UserMain';
import RoleMain from './routes/base/role/RoleMain';
import AuthMain from './routes/base/auth/AuthMain';
import AccountMain from './routes/base/account/AccountMain';
import BaseHome from './routes/base/BaseHome';
import Company from './routes/base/company/CompanyMain';
import Error404 from './routes/framework/404';

const routes = {
  Framework: [
    (<Route exact path="/" component={Login} key={getRandomNum(32)} />),
    (<Route exact path="/login" component={Login} key={getRandomNum(32)} />),
    (<Route exact path="/homepage" component={Homepage} key={getRandomNum(32)} />),
    (<Route exact path="/base" component={CommonLayout} key={getRandomNum(32)} />),
  ],
  CommonLayout: [
    (<Route exact path="/base/home" component={BaseHome} key={getRandomNum(32)} />),
    (<Route exact path="/base/dict" component={DictionaryMain} key={getRandomNum(32)} />), // 数据字典管理
    (<Route exact path="/base/ctrl" component={CtrlParamMain} key={getRandomNum(32)} />), // 控制参数管理
    (<Route exact path="/base/menu/:chanel" component={MenuMain} key={getRandomNum(32)} />), // 菜单管理
    (<Route exact path="/base/dept" component={DeptMain} key={getRandomNum(32)} />), // 科室管理
    // (<Route exact path="/base/printTemplate" component={PrintTemplate} key={getRandomNum(32)} />), // 打印模板
    (<Route exact path="/base/user" component={UserMain} key={getRandomNum(32)} />), // 用户管理
    (<Route exact path="/base/role/:chanel" component={RoleMain} key={getRandomNum(32)} />), // 角色管理
    (<Route exact path="/base/auth/:chanel" component={AuthMain} key={getRandomNum(32)} />), // 权限管理
    (<Route exact path="/base/account" component={AccountMain} key={getRandomNum(32)} />), // 登录账户管理
    (<Route exact path="/base/baseMng/hospMng" component={HospitalMain} key={getRandomNum(32)} />), // 医院信息维护
    (<Route exact path="/base/company/:chanel" component={Company} key={getRandomNum(32)} />), // 厂商及供应商管理
    (<Route exact path="*" component={Error404} />),
  ],
};

export default routes;
