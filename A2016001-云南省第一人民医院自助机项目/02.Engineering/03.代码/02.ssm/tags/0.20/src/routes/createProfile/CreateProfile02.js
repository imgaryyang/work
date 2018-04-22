import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col, Modal }  from 'antd';

import config               from '../../config';
import styles               from './CreateProfile02.css';

import { testMobile }       from '../../utils/validation';
import WorkSpace            from '../../components/WorkSpace';
import Steps                from '../../components/Steps';
import Card                 from '../../components/Card';
import Input                from '../../components/Input';
import Button               from '../../components/Button';
import Confirm              from '../../components/Confirm';
import NumKeyboard          from '../../components/keyboard/NumKeyboard';

const _resendTime = config.timer.resendAuthMsg;
const _authCodeLen = config.authCodeLen;

class CreateProfile02 extends React.Component {

  static displayName = 'CreateProfile02';
  static description = '自助建档-step2';

  static propTypes = {
  };

  static defaultProps = {
  };

  /**
  * 初始化状态
  */
  state = {
    mobile: '',
    authCode: '',
    acBtnText: '免费获取验证码', //(<div>免费获取<br/>验证码</div>),
    second: _resendTime,
    focus: 'mobile',

    acDisabled: true,
    acWaiting: false,

    submitWaiting: false,
    submitDisabled: true,

    alertVisible: false,
  };

  steps = ['读取' + this.props.location.state.cardName, '校验手机号', '完成建档'];
  _clockTimer = null;

  constructor(props) {
    super(props);

    this.onInput      = this.onInput.bind(this);
    this.onClear      = this.onClear.bind(this);
    this.onDel        = this.onDel.bind(this);
    this.sendAuthCode = this.sendAuthCode.bind(this);
    this.submit       = this.submit.bind(this);
    this.setClock     = this.setClock.bind(this);
  }

  componentDidMount() {
    //TODO: 播放语音：请输入手机号码
  }

  componentWillUnmount () {
    clearTimeout(this._clockTimer);
  }

  /**
   * 监听键盘输入
   */
  onInput(key) {
    if (this.state.focus == 'mobile') {
      if (this.state.mobile.length == 11) {
        return;
      }
      this.setState({mobile: this.state.mobile + key}, () => {
        if (this.state.mobile.length == 11) {
          this.setState({
            acDisabled: false,
            submitDisabled: true,
          });
          //TODO: 播放语音：请点击“免费获取验证码按钮”接收验证短信
        } else
          this.setState({
            acDisabled: true,
            submitDisabled: true,
          });
      });
    } else if (this.state.focus == 'authCode') {
      if (this.state.authCode.length == _authCodeLen) {
        return;
      }
      this.setState({authCode: this.state.authCode + key}, () => {
        if (this.state.authCode.length == _authCodeLen) {
          this.setState({
            submitDisabled: false,
          });
        } else
          this.setState({
            submitDisabled: true,
          });
      });
    }
  }

  /**
   * 监听键盘删除键
   */
  onDel() {
    if (this.state.focus == 'mobile') 
      this.setState({
        mobile: this.state.mobile.substr(0, this.state.mobile.length - 1),
        acDisabled: true,
        submitDisabled: true,
      });
    else if (this.state.focus == 'authCode') 
      this.setState({
        authCode: this.state.authCode.substr(0, this.state.authCode.length - 1),
        submitDisabled: true,
      });
  }

  /**
   * 监听键盘清空键
   */
  onClear() {
    if (this.state.focus == 'mobile') 
      this.setState({
        mobile: '',
        acDisabled: true,
      });
    else if (this.state.focus == 'authCode') 
      this.setState({
        authCode: '',
        submitDisabled: true,
      });
  }

  setClock () {
    if(this.state.second == 0) {
      this.setState({
        second: _resendTime,
        acBtnText: '免费获取验证码', //(<div>免费获取<br/>验证码</div>),
      });
      return;
    }

    let second = this.state.second - 1;
    this._clockTimer = setTimeout(
      () => {
        this.setState({
          second: second,
          acBtnText: second + ' 秒钟后可再次发送', //(<div>{second} 秒钟后<br/>可再次发送</div>),
        });
        this.setClock();
      },
      1000
    );
  }

  /**
   * 发送验证码
   */
  sendAuthCode() {

    if (this.state.second != _resendTime) {
      return;
    }

    if (!testMobile(this.state.mobile)) {
      this.setState({alertVisible: true});
      //TODO: 播放语音：您输入的手机号不合法，请重新输入
      return;
    }

    //TODO：发送验证码
    if (true) {
      /*message.success((
        <div style = {{fontSize: '2.5rem', textAlign: 'center', margin: '1.5rem', lineHeight: '4rem', whiteSpace: 'nowrap'}} >
          短信验证码已成功发送，请注意查收短信<br/>如未收到短信，{config.timer.resendAuthMsg}秒钟后可重新点击发送
        </div>
      ), 3);*/

      this.props.dispatch({
        type: 'message/show',
        payload: {
          msg: (
            <div style = {{fontSize: '2.5rem', textAlign: 'center', margin: '1.5rem', lineHeight: '4rem', whiteSpace: 'nowrap'}} >
              短信验证码已成功发送，请注意查收短信<br/>如未收到短信，{config.timer.resendAuthMsg}秒钟后可重新点击发送
            </div>
          ),
        }
      });

      this.setState({
        focus: 'authCode',
        authCode: '',
        acBtnText: this.state.second + ' 秒钟后可再次发送', //(<div>{this.state.second} 秒钟后<br/>可再次发送</div>),
      }, () => {
        this.setClock();
      })
    }
  }

  /**
   * 确认提交
   */
  submit() {

    this.setState({
      submitWaiting: true,
      acDisabled: true,
    });

    //TODO: 提交业务
    if (true) {
      this.props.dispatch(routerRedux.push({
        pathname: '/createProfile03',
        state: {
          cardType: this.props.location.state.cardType,
          cardName: this.props.location.state.cardName,
          idNo: this.props.location.state.idNo, 
          name: this.props.location.state.name,
          mobile: this.state.mobile,
          authCode: this.state.authCode,
          nav: {
            backDisabled: true,
            title: '自助建档',
          },
        },
      }));
    } else {
      //TODO: 语音报错

    }
  }

  render() {
    let height = config.getWS().height - (22 + config.navBar.height) * config.remSize;

    return (
      <WorkSpace style = {{paddingTop: '4rem'}} >
        <Steps steps = {this.steps} current = {2} />
        <Card shadow = {true} style = {{margin: '2rem', padding: '2rem', fontSize: '3rem'}} >
          <Row>
            <Col span = {8} >姓名 ：{this.props.location.state.name}</Col>
            <Col span = {16} >身份证号 ：{this.props.location.state.idNo}</Col>
          </Row>
        </Card>
        <Row>
          <Col span = {12} style = {{padding: '2rem', paddingTop: '0'}} >
            <Card shadow = {true} style = {{padding: '1rem', height: height + 'px'}} >{/* title = '请输入手机号码及验证码'*/}
              <div span = {8} className = {styles.label} >手机号：</div>
              <Input value = {this.state.mobile} placeholder = '请输入手机号码' focus = {this.state.focus == 'mobile' ? true : false} onClick = {() => this.setState({focus: 'mobile'})} />
              <Button text = {this.state.acBtnText} style = {{marginTop: '2rem', marginBottom: '1rem', fontSize: '3rem'}} waiting = {this.state.acWaiting} disabled = {this.state.acDisabled} onClick = {this.sendAuthCode} />
              
              <div span = {8} className = {styles.label} >验证码：</div>
              <Input value = {this.state.authCode} placeholder = '请输入验证码' focus = {false} style = {{textAlign: 'center'}} focus = {this.state.focus == 'authCode' ? true : false} onClick = {() => this.setState({focus: 'authCode'})} />
              
              <Button text = '确定' style = {{marginTop: '2.5rem'}} waiting = {this.state.submitWaiting} disabled = {this.state.submitDisabled} onClick = {this.submit} />

            </Card>
          </Col>
          <Col span = {12} style = {{paddingRight: '2rem'}}  >
            <NumKeyboard onInput = {this.onInput} onClear = {this.onClear} onDel = {this.onDel} height = {height} />
          </Col>
        </Row>
        <Confirm 
          visible = {this.state.alertVisible} 
          buttons = {[
            {text: '确定', onClick: () => this.setState({alertVisible: false}) },
          ]}
          info = '您输入的手机号不合法，请重新输入！' />
      </WorkSpace>
    );
    
    /*return (
      <WorkSpace style = {{paddingTop: '4rem'}} >
  		  <Steps steps = {this.steps} current = {2} />
        <Card style = {{margin: '2rem', padding: '1rem', fontSize: '3rem'}} >
          <Row>
            <Col span = {8} >姓名 ：{this.props.location.state.name}</Col>
            <Col span = {16} >身份证号 ：{this.props.location.state.idNo}</Col>
          </Row>
        </Card>
        <Row>
          <Col span = {12} style = {{padding: '2rem', paddingTop: '0'}} >
            <Card style = {{padding: '1rem', height: '40rem'}} title = '请输入手机号码及验证码' >
              <div span = {8} className = {styles.label} >手机号：</div>
              <Input value = {this.state.mobile} focus = {this.state.focus == 'mobile' ? true : false} onClick = {() => this.setState({focus: 'mobile'})} />
              
              <div span = {8} className = {styles.label} >验证码：</div>
              <Row>
                <Col span = {12} >
                  <Input value = {this.state.authCode} focus = {false} style = {{textAlign: 'center'}} focus = {this.state.focus == 'authCode' ? true : false} onClick = {() => this.setState({focus: 'authCode'})} />
                </Col>
                <Col span = {12} >
                  <Button text = {this.state.acBtnText} style = {{marginLeft: '1rem', fontSize: '2.4rem', lineHeight: '2.6rem', paddingTop: '.4rem'}} waiting = {this.state.acWaiting} disabled = {this.state.acDisabled} onClick = {this.sendAuthCode} />
                </Col>
              </Row>
              
              <Button text = '确定' style = {{marginTop: '2rem'}} waiting = {this.state.submitWaiting} disabled = {this.state.submitDisabled} onClick = {this.submit} />

            </Card>
          </Col>
          <Col span = {12} style = {{paddingRight: '2rem'}}  >
            <NumKeyboard onInput = {this.onInput} onClear = {this.onClear} onDel = {this.onDel} />
          </Col>
        </Row>
      </WorkSpace>
    );*/
  }
}
  

export default connect(({message}) => ({message}))(CreateProfile02);



