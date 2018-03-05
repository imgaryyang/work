import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Card, Row, Col } from 'antd';
import styles from './Login.less';

import logoWhite from '../../assets/image/logoWhite.png';
import loginBGLeft from '../../assets/image/loginBGLeft.png';
import loginBGRight from '../../assets/image/loginBGRight.png';

import LoginForm from './LoginForm';
import LoginDept from './LoginDept';

class Login extends Component {
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
                <Col span="24" className={styles.title} >智慧医疗云HIS系统</Col>
              </Row>
            </div>
          </div>
          <LoginDept />
        </div>
      </Spin>
    );
  }
}
export default connect(({ base }) => ({ base }))(Login);

