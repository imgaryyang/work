import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import IndexPage from './routes/IndexPage';
import TabNavLayout from './layouts/TabNavLayout';
import BasicLayout from './layouts/BasicLayout';
import LoginBySMS from './routes/LoginBySMS';
import Login from './routes/Login';
import DownloadApp from './DownloadApp';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <Route path="/login" exact component={Login} />
        <Route path="/loginBySMS" exact component={LoginBySMS} />
        <Route path="/home" component={TabNavLayout} />
        <Route path="/stack" component={BasicLayout} />
        <Route path="/downloadApp" component={DownloadApp} />
      </Switch>
    </Router>
  );
}
export default RouterConfig;
