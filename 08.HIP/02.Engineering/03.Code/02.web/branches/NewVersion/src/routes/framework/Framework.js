import React, { Component } from 'react';
import { Route } from 'dva/router';
import { connect } from 'dva';
import { notification, Modal } from 'antd';
import styles from './Framework.less';
import Login from './Login';
import config from '../../routerConfig';
import Homepage from './Homepage';
import CommonLayout from './CommonLayout';
import { getRandomNum } from '../../utils/randomTool';

class Framework extends Component {
  constructor(props) {
    super(props);
    this.notice = this.notice.bind(this);
    this.alert = this.alert.bind(this);
  }

  state = {};

  componentWillMount() {
    this.props.dispatch({
      type: 'base/setState',
      payload: { noticeProvider: this.notice, alertProvider: this.alert },
    });
    const { user } = this.props.base;
    const { pathname } = this.props.location;
    if (pathname === 'login' || pathname === '/login' || pathname === '/' || pathname === '') {
      return;
    }
    if (!user.id) { // 无用户信息
      // console.info('无用户信息');
      this.props.dispatch({ type: 'base/loadUserInfo' });
    }
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    const { user } = nextProps.base;
    const { pathname } = nextProps.location;
    // console.log(pathname);
    if (pathname === 'login' || pathname === '/login' || pathname === '/' || pathname === '') {
      return;
    }
    if (!user.id) { // 无用户信息
      // console.info('无用户信息');
      this.props.dispatch({ type: 'base/loadUserInfo' });
    }
  }

  notice(type, title, msg) {
    notification[type]({
      message: title || '提示',
      description: msg || '',
    });
  }

  alert(type, title, content) {
    /* var args = arguments;
    if ( args.length == 1 ){
      content = type;
      type="";
    }else if(args.length == 2){
      content = title;
      title = type;
      type = "";
    } */
    let fn = Modal[type || 'error'];
    if (typeof fn !== 'function')fn = Modal.error;
    fn({
      title: title || '错误',
      content: content || '',
    });
  }

  render() {
    return (
      <div className={styles.container}>
        {/* config.Framework.map((comp) => {
          return comp;
        }) */}
        <Route exact path="/" component={Login} key={getRandomNum(32)} />
        <Route exact path="/login" component={Login} key={getRandomNum(32)} />
        <Route exact path="/homepage" component={Homepage} key={getRandomNum(32)} />
        <Route exact path="/base" component={CommonLayout} key={getRandomNum(32)} />
      </div>
    );
  }
}
export default connect(({ base }) => ({ base }))(Framework);
