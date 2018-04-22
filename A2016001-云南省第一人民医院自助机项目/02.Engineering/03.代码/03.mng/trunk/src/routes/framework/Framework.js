import React, { Component } from 'react';
import { connect } from 'dva';
import { notification,Modal } from 'antd';
import styles from './Framework.less';

class Framework extends Component {

  constructor(props){
	  super(props);
	  this.notice = this.notice.bind(this);
	  this.alert = this.alert.bind(this);
  }
  
  state = {};

  componentWillMount() {
	this.props.dispatch({
      type:'base/setState',
      payload:{ noticeProvider:this.notice,alertProvider:this.alert }
    });
    const { user } = this.props.base;
    const { pathname } = this.props.location;
    if (pathname === 'login' || pathname === '/login' || pathname === '/' || pathname === '') {
      return;
    }
    if (!user.id) { // 无用户信息
      this.props.dispatch({ type: 'base/loadUserInfo' });
    }
  }
  notice(type,title,msg){
	  notification[type]({
	    message: title||'提示',
	    description: msg||'',
	  });
  }
  alert(type,title,content){
	  type = type||'error';
	  var fn = Modal[type];
	  if(typeof fn != 'function')fn = Modal.error;
	  fn({
	    title: title||'错误',
	    content: content||'',
	  });
  }
  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    const { user } = nextProps.base;
    const { pathname } = nextProps.location;
    if (pathname === 'login' || pathname === '/login' || pathname === '/' || pathname === '') {
      return;
    }
    if (!user.id) { // 无用户信息
      console.info('无用户信息');
      this.props.dispatch({ type: 'base/loadUserInfo' });
    }
  }

  render() {
    return (
      <div className={styles.container}>
        {this.props.children}
      </div>
    );
  }
}
export default connect(({ base }) => ({ base }))(Framework);
