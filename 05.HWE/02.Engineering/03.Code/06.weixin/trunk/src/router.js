import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import IndexPage from './routes/IndexPage';
import TabNavLayout from './layouts/TabNavLayout';
import BasicLayout from './layouts/BasicLayout';
import LoginWeChat from './routes/LoginWeChat';
import LoginZFB from './routes/LoginZFB';
import Login from './routes/Login';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <Route path="/login" exact component={Login} />
        <Route path="/loginWeChat" exact component={LoginWeChat} />
        <Route path="/loginZFB" exact component={LoginZFB} />
        <Route path="/home" component={TabNavLayout} />
        <Route path="/stack" component={BasicLayout} />
      </Switch>
    </Router>
  );
}
export default RouterConfig;
