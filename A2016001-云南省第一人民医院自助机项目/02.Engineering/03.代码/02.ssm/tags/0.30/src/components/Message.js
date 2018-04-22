import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col, Icon }   from 'antd';

import config               from '../config';
import styles               from './Message.css';

const _time      = config.timer.msgShow,
      _top       = -(config.msg.height * config.remSize),
      _stepping  = 10;

class Message extends React.Component {

  static displayName = 'Message';
  static description = '顶端浮动消息框';

  static propTypes = {
  };

  static defaultProps = {
  };

  _visibleTimer = null;
  _autoCloseTimer = null;

  /**
  * 初始化状态
  */
  state = {
    second: _time,
    top: _top,
  };

  constructor(props) {
    super(props);

    this.gotIt              = this.gotIt.bind(this);

    this.setShowClock       = this.setShowClock.bind(this);
    this.setHideClock       = this.setHideClock.bind(this);
    this.setAutoCloseClock  = this.setAutoCloseClock.bind(this);
  }

  componentDidMount () {
  }

  componentWillUnmount () {
    clearTimeout(this._visibleTimer);
    clearTimeout(this._autoCloseTimer);
  }

  /**
   * 监听
   */
  componentWillReceiveProps (props) {
    if (props.frame.notice.showSwitch) {
      this.setShowClock();
      this.setAutoCloseClock();
//      this.props.dispatch({//TODO 有问题 
//        type: 'frame/setNotice',
//        payload: {
//          showSwitch: false
//        }
//      });
    }

    if (props.frame.notice.hideSwitch) {
      this.props.dispatch({
        type: 'frame/setNotice',
        payload: {
          hideSwitch: false
        }
      });
      this.setHideClock();
    }
  }

  setShowClock () {
    let top = this.state.top;
    if(top >= 0) {
      clearTimeout(this._visibleTimer);
      return;
    }

    this._visibleTimer = setTimeout (
      () => {
        this.setState({top: (top + _stepping) > 0 ? 0 : top + _stepping})
        this.setShowClock();
      },
      1
    );
  }

  setHideClock () {
    let top = this.state.top;
    if(top <= _top) {
      this.setState({
        second: _time,
      });
      this.props.dispatch({
        type: 'frame/setNotice',
        payload: {
          msg: null
        }
      });
      clearTimeout(this._visibleTimer);
      clearTimeout(this._autoCloseTimer);
      return;
    }

    this._visibleTimer = setTimeout (
      () => {
        this.setState({top: (top - _stepping) < _top ? _top : top - _stepping})
        this.setHideClock();
      },
      1
    );
  }

  setAutoCloseClock () {
    
    if(this.state.second == 0) {
      this.props.dispatch({type: 'frame/hideNotice'});
      this.setState({
        second: _time,
      });
      clearTimeout(this._autoCloseTimer);
      return;
    }

    let second = this.state.second - 1;
    this._autoCloseTimer = setTimeout(
      () => {
        this.setState({
          second: second,
        });
        this.setAutoCloseClock();
      },
      1000
    );
  }

  gotIt () {
    this.props.dispatch({type: 'frame/hideNotice'});
  }

  render() {

    const {msg}  = this.props.frame.notice;
    const width           = config.getWS().width - 60,
          height          = config.msg.height * config.remSize,
          bottomHeight    = config.msg.bottomHeight * config.remSize,
          containerStyle  = {
            width: width + 'px',
            height: height + 'px',
            top: this.state.top + 'px',
          },
          msgStyle        = {
            height: (height - bottomHeight) + 'px',
          },
          bottomStyle     = {
            height: bottomHeight + 'px',
          };

    return (
      <div className = {styles.container} style = {containerStyle} >
        <div className = {styles.iconContainer} ><Icon type = 'message' /></div>
        <div className = {styles.msgContainer} style = {msgStyle} >
          {
            typeof msg == 'string' ? (
              <div className = {styles.msg} >{msg}</div>
            ) : msg
          }
        </div>
        <Row style = {bottomStyle} >
          <Col span = {12} style = {{padding: '0 1rem 2rem 2rem'}} className = {styles.timer} >
            {
              this.state.second > 0 ? (
                <font>{this.state.second}&nbsp;秒后自动关闭</font>
              ) : null
            }
          </Col>
          <Col span = {12} style = {{padding: '0 2rem 2rem 1rem'}} ><div className = {styles.btn} onClick = {this.gotIt} >我知道了</div></Col>
        </Row>
      </div>
    );
  }
}

export default connect(({frame}) => ({frame}))(Message);
