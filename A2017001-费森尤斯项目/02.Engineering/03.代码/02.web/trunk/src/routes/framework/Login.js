import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Card, Row, Col, Alert } from 'antd';
import styles from './Login.less';

import logoWhite from '../../assets/image/logoWhite.png';
import loginBGLeft from '../../assets/image/loginBGLeft.png';
import loginBGRight from '../../assets/image/loginBGRight.png';

import LoginForm from './LoginForm';
import LoginDept from './LoginDept';

class Login extends Component {

  componentDidMount() {
    setTimeout(() => {
      this.props.dispatch({
        type: 'base/checkPrintAlert',
      });
    }, 1000, this);
  }

  render() {
    /* global document*/
    const height = document.body.clientHeight;
    const leftStyle = { backgroundImage: `url(${loginBGLeft})`, height };
    const rightStyle = { backgroundImage: `url(${loginBGRight})`, height, width: '50%' };
    const { spin, isPrintAlert } = this.props.base;

    const alertMsg = () => {
      return (
        <p> CLodop云打印服务(localhost本地)未安装启动!点击这里
          <a href="/hcp/CLodop_Setup.exe" download="CLodop_Setup.exe" target="_self">下载安装文件</a>
           ，安装后请刷新页面。
        </p>
      );
    };

    const checkAlert = () => {
      if (isPrintAlert) {
        return (
          <Alert message={alertMsg()} banner closable />
        );
      }
    };

    return (
      <Spin spinning={spin} >
        <div className={styles.container} style={leftStyle} >
          <div className={styles.rightBgContainer} style={rightStyle} />
          <div className={styles.loginContainer} >
            {checkAlert()}
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
