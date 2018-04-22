import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Card, Row, Col } from 'antd';
import styles from './Login.less';
import { routerRedux } from 'dva/router';
import logoWhite from '../../assets/logo.png'; // '../../assets/image/logoWhite.png';
import loginBGLeft from '../../assets/image/loginBGLeft.png';
import loginBGRight from '../../assets/image/loginBGRight.png';

import LoginForm from './LoginForm';

class Login extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.base.user.id !== this.props.base.user.id) {
    	this.props.dispatch(routerRedux.push('/base'));
    }
  }
	
  render() {
    /* global document*/
    const height = document.body.clientHeight;
    const leftStyle = { backgroundImage: `url(${loginBGLeft})`, height };
    const rightStyle = { backgroundImage: `url(${loginBGRight})`, height, width: '50%' };
    const { spin } = this.props.base;
    return (
      <Spin spinning={spin} >
        <div className={styles.container} style={leftStyle} >
          <div className={styles.rightBgContainer} style={rightStyle} />
          <div className={styles.loginContainer} >
            <div className={styles.wrapper} >
              <Row>
                <Col span={24} style={{ textAlign: 'center' }} ><img src={logoWhite} className={styles.logo} alt="" /></Col>
                <Col span={24} >
                  <Card className={styles.card} >
                    <LoginForm />
                  </Card>
                </Col>
                <Col span="24" className={styles.title} >联想智慧医疗自助机管理系统</Col>
              </Row>
            </div>
          </div>
        </div>
      </Spin>
    );
  }
}
export default connect(({ base }) => ({ base }))(Login);

